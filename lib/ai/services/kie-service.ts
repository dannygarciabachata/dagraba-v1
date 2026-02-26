import { prisma } from '@/lib/prisma';
import { BaseMusicService, MusicGenerationRequest, TaskStatusResponse, VideoGenerationRequest } from '../types';

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

    async generateVideo(request: VideoGenerationRequest): Promise<string> {
        const apiKey = await this.getApiKey();

        const payload = {
            taskId: request.taskId,
            audioId: request.audioId,
            callBackUrl: request.callBackUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/webhook/video`,
            author: request.author,
            domainName: request.domainName
        };

        const response = await fetch(`${this.baseUrl}/mp4/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || data.code !== 200) {
            throw new Error(`KIE Video Generation failed: ${data.msg || 'Unknown error'}`);
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

    async getVideoTaskStatus(taskId: string): Promise<TaskStatusResponse> {
        const apiKey = await this.getApiKey();

        const response = await fetch(`${this.baseUrl}/mp4/record-info?taskId=${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        const data = await response.json();

        if (!response.ok || data.code !== 200) {
            return {
                status: 'ERROR',
                taskId,
                error: `Video Status check failed: ${data.msg || 'Unknown error'}`
            };
        }

        const kieStatus = data.data?.response?.successFlag || data.data?.status;

        if (kieStatus === 'SUCCESS') {
            return {
                status: 'SUCCESS',
                taskId,
                // The Video response from KIE will contain the mp4 url in the data, or response object.
                // Assuming it comes in a `videoUrl` or similar based on typical payloads or callback structure.
                // Reusing standard videoUrl mapping here based on the callback docs provided.
                videoUrl: data.data?.response?.videoUrl || data.data?.response?.url || data.data?.videoUrl || data.data?.url
            };
        }

        if (kieStatus === 'PENDING') {
            return { status: 'PENDING', taskId };
        }

        return {
            status: 'ERROR',
            taskId,
            error: data.data?.errorMessage || `Video task failed with status: ${kieStatus}`
        };
    }

    async getMarketTaskStatus(taskId: string): Promise<TaskStatusResponse> {
        const apiKey = await this.getApiKey();

        const response = await fetch(`${this.baseUrl}/jobs/recordInfo?taskId=${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        const data = await response.json();

        if (!response.ok || data.code !== 200) {
            return {
                status: 'ERROR',
                taskId,
                error: `Market Status check failed: ${data.msg || 'Unknown error'}`
            };
        }

        const kieState = data.data?.state;

        if (kieState === 'success') {
            let resultJsonObj = {};
            try {
                if (data.data?.resultJson) {
                    resultJsonObj = JSON.parse(data.data.resultJson);
                }
            } catch (e) { /* ignore parse error */ }

            return {
                status: 'SUCCESS',
                taskId,
                // Using Tracks as a generic carrier for Market Model responses where resultUrls might be images
                tracks: (resultJsonObj as any)?.resultUrls?.map((url: string, index: number) => ({
                    id: `${taskId}_${index}`,
                    audioUrl: url,
                    imageUrl: url,
                    title: `Market Output ${index}`,
                    prompt: data.data?.param,
                    tags: data.data?.model,
                    duration: 0
                })) || []
            };
        }

        if (kieState === 'waiting' || kieState === 'queuing' || kieState === 'generating') {
            return { status: 'PENDING', taskId };
        }

        return {
            status: 'ERROR',
            taskId,
            error: data.data?.failMsg || `Market task failed with status: ${kieState}`
        };
    }
}
