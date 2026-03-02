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
        console.log('[DagrabaService] Simulating local music generation based on training data:', request);

        // In a real implementation, this would trigger a local worker or a dedicated training server.
        // For now, we simulate an immediate task ID.
        const taskId = `local_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        return taskId;
    }

    async getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
        console.log('[DagrabaService] Checking status for local task:', taskId);

        // Simulate success after a short delay (the client polls this)
        // In a real scenario, this would check a local database or worker status.
        return {
            status: 'SUCCESS',
            taskId,
            tracks: [
                {
                    id: `${taskId}_v1`,
                    audioUrl: 'https://cdn.mureka.ai/public/demo/1.mp3', // Standard placeholder for now
                    imageUrl: 'https://cdn.mureka.ai/public/demo/1.jpg',
                    title: 'Entrenamiento Local #1',
                    prompt: 'Custom trained model',
                    tags: 'local-training, custom',
                    duration: 180
                }
            ]
        };
    }

    async trainModel(dataset: any): Promise<string> {
        console.log('[DagrabaService] Initializing custom training with dataset:', dataset);
        const trainingId = `train_${Date.now()}`;
        // Logic to trigger local model finetuning would go here
        return trainingId;
    }
}
