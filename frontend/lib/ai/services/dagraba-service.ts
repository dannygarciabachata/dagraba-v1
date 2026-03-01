import { prisma } from '@/lib/prisma';
import { BaseMusicService, MusicGenerationRequest, TaskStatusResponse } from '../types';

interface DagrabaTaskResponse {
    id: string;
    // other fields omitted for brevity
}

interface DagrabaQueryResponse {
    id: string;
    status: 'pending' | 'generating' | 'succeeded' | 'failed' | 'cancelled' | 'timeouted';
    model: string;
    choices?: Array<{
        title: string;
        url: string;
        image_url?: string;
        prompt?: string;
        duration?: number;
    }>;
}

export class DagrabaService implements BaseMusicService {
    private baseUrl = 'https://api.mureka.ai/v1';

    private async getApiKey(): Promise<string> {
        try {
            const dbSetting = await prisma.systemSetting.findUnique({
                where: { key: 'DAGRABA_API_KEY' }
            });
            if (dbSetting?.value) return dbSetting.value;
        } catch (error) {
            console.error('Failed to read DAGRABA_API_KEY from DB, falling back to env');
        }

        const envKey = process.env.DAGRABA_API_KEY;
        if (!envKey) throw new Error('DAGRABA_API_KEY is not configured');

        return envKey;
    }

    async generateMusic(request: MusicGenerationRequest): Promise<string> {
        const apiKey = await this.getApiKey();

        // If lyrics are provided as prompt, use /song/generate.
        // If it's an instrumental request, use /instrumental/generate.
        const isInstrumental = request.instrumental;
        const endpoint = isInstrumental ? '/instrumental/generate' : '/song/generate';
        const url = `${this.baseUrl}${endpoint}`;

        const payload: any = {
            model: request.model || 'auto',
        };

        if (isInstrumental) {
            payload.prompt = request.prompt || request.style || 'epic instrumental';
        } else {
            payload.lyrics = request.prompt;
            if (request.style) {
                payload.prompt = request.style; // Uses 'prompt' for style in /song/generate
            }
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || !data.id) {
            throw new Error(`Dagraba Generation failed: ${response.statusText} - ${JSON.stringify(data)}`);
        }

        // We embed the task type in the ID so we know which endpoint to query later
        return `${isInstrumental ? 'inst' : 'song'}_${data.id}`;
    }

    async getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
        const apiKey = await this.getApiKey();

        // Extract the original task ID and type
        const isInstrumental = taskId.startsWith('inst_');
        const realTaskId = taskId.replace(/^(inst|song)_/, '');

        const endpoint = isInstrumental ? `/instrumental/query/${realTaskId}` : `/song/query/${realTaskId}`;
        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        const data: DagrabaQueryResponse = await response.json();

        if (!response.ok) {
            return {
                status: 'ERROR',
                taskId,
                error: `Status check failed: ${response.statusText}`
            };
        }

        const { status, choices } = data;

        if (status === 'succeeded') {
            return {
                status: 'SUCCESS',
                taskId,
                tracks: choices?.map((choice, index) => ({
                    id: `${taskId}_${index}`,
                    audioUrl: choice.url,
                    streamAudioUrl: choice.url,
                    imageUrl: choice.image_url,
                    prompt: choice.prompt || '',
                    title: choice.title || `Track ${index + 1}`,
                    tags: data.model,
                    duration: choice.duration || 0,
                })) || []
            };
        }

        if (status === 'pending' || status === 'generating') {
            return { status: 'PENDING', taskId };
        }

        // failed, cancelled, timeouted
        return {
            status: 'ERROR',
            taskId,
            error: `Task failed with status: ${status}`
        };
    }
}
