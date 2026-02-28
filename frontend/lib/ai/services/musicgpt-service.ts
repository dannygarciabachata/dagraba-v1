import { prisma } from '@/lib/prisma';
import { BaseMusicService, MusicGenerationRequest, TaskStatusResponse } from '../types';

export class MusicGptService implements BaseMusicService {

    private async getApiKey(): Promise<string> {
        try {
            const dbSetting = await prisma.systemSetting.findUnique({
                where: { key: 'MUSICGPT_API_KEY' }
            });
            if (dbSetting?.value) return dbSetting.value;
        } catch (error) {
            console.error('Failed to read MUSICGPT_API_KEY from DB, falling back to env');
        }

        const envKey = process.env.MUSICGPT_API_KEY;
        if (!envKey) throw new Error('MUSICGPT_API_KEY is not configured');

        return envKey;
    }

    async generateMusic(request: MusicGenerationRequest): Promise<string> {
        const apiKey = await this.getApiKey();

        // This is a stub implementation meant to be populated when MusicGPT documentation is provided.
        console.log(`[MusicGPT] Triggering generation with key ending in: ...${apiKey.slice(-4)}`);

        // Return a mock task ID for now
        return `mgpt_task_${Date.now()}`;
    }

    async getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
        // Stub polling response
        return {
            status: 'PENDING',
            taskId
        };
    }
}
