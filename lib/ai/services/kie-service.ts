import { prisma } from '@/lib/prisma';
import { BaseMusicService, MusicGenerationRequest, TaskStatusResponse } from '../types';

interface KieTaskStatusResponse {
    code: number;
    msg: string;
    data: {
        taskId: string;
        status: string;
        errorMessage?: string;
        response?: {
            sunoData?: any[];
        };
    };
}

export class KieService implements BaseMusicService {
    private baseUrl = 'https://api.kie.ai/api/v1';

    private async getApiKey(): Promise<string> {
        try {
            const dbSetting = await prisma.systemSetting.findUnique({
                where: { key: 'KIE_API_KEY' }
            });
            if (dbSetting?.value) return dbSetting.value;
        } catch (error) {
            console.error('Failed to read KIE_API_KEY from DB, falling back to env');
        }

        const envKey = process.env.KIE_API_KEY;
        if (!envKey) throw new Error('KIE_API_KEY is not configured');

        return envKey;
    }

    async generateMusic(request: MusicGenerationRequest): Promise<string> {
        const apiKey = await this.getApiKey();

        // Map generic request to specific Kie/Suno format
        const payload = {
            prompt: request.prompt,
            customMode: request.customMode ?? !!request.style,
            instrumental: request.instrumental,
            model: request.model || 'V4_5',
            style: request.style,
            title: request.title,
            callBackUrl: request.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/webhook`
        };

        const response = await fetch(`${this.baseUrl}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || data.code !== 200) {
            throw new Error(`KIE Generation failed: ${data.msg || 'Unknown error'}`);
        }

        return data.data.taskId;
    }

    async getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
        const apiKey = await this.getApiKey();

        const response = await fetch(`${this.baseUrl}/generate/record-info?taskId=${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        const data: KieTaskStatusResponse = await response.json();

        if (!response.ok || data.code !== 200) {
            return {
                status: 'ERROR',
                taskId,
                error: `Status check failed: ${data.msg || 'Unknown error'}`
            };
        }

        const kieStatus = data.data.status;

        // Map Suno specific statuses to our generic status
        if (kieStatus === 'SUCCESS') {
            return {
                status: 'SUCCESS',
                taskId,
                tracks: data.data.response?.sunoData?.map(track => ({
                    id: track.id,
                    audioUrl: track.audioUrl,
                    streamAudioUrl: track.streamAudioUrl,
                    imageUrl: track.imageUrl,
                    prompt: track.prompt,
                    title: track.title,
                    tags: track.tags,
                    duration: track.duration,
                    createTime: track.createTime
                }))
            };
        }

        if (kieStatus === 'PENDING') {
            return { status: 'PENDING', taskId };
        }

        if (kieStatus === 'FIRST_SUCCESS' || kieStatus === 'TEXT_SUCCESS') {
            return {
                status: 'PARTIAL',
                taskId,
                tracks: data.data.response?.sunoData?.map(track => ({
                    id: track.id,
                    audioUrl: track.audioUrl,
                    streamAudioUrl: track.streamAudioUrl,
                    imageUrl: track.imageUrl,
                    prompt: track.prompt,
                    title: track.title,
                    tags: track.tags,
                    duration: track.duration,
                    createTime: track.createTime
                }))
            };
        }

        // Handle error statuses
        return {
            status: 'ERROR',
            taskId,
            error: data.data.errorMessage || `Task failed with status: ${kieStatus}`
        };
    }
}
