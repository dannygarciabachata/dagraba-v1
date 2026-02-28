import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { KieService } from '@/lib/ai/services/kie-service';
import { MusicGptService } from '@/lib/ai/services/musicgpt-service';
import { BaseMusicService, VideoGenerationRequest } from '@/lib/ai/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Default to kie provider if not specified
        const { provider = 'kie', ...requestData } = body;

        let service: BaseMusicService;

        switch (provider) {
            case 'kie':
            case 'suno':
                service = new KieService();
                break;
            case 'musicgpt':
                service = new MusicGptService();
                break;
            default:
                return NextResponse.json(
                    { error: `Unsupported AI provider: ${provider}` },
                    { status: 400 }
                );
        }

        if (!service.generateVideo) {
            return NextResponse.json(
                { error: `Provider '${provider}' does not support video generation.` },
                { status: 400 }
            );
        }

        const videoRequest: VideoGenerationRequest = {
            taskId: requestData.taskId,
            audioId: requestData.audioId,
            callBackUrl: requestData.callBackUrl,
            author: requestData.author,
            domainName: requestData.domainName
        };

        if (!videoRequest.taskId || !videoRequest.audioId) {
            return NextResponse.json(
                { error: 'taskId and audioId are required for video generation.' },
                { status: 400 }
            );
        }

        const taskId = await service.generateVideo(videoRequest);

        return NextResponse.json({
            success: true,
            taskId,
            provider
        });

    } catch (error: any) {
        console.error('Video Generation Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate video' },
            { status: 500 }
        );
    }
}
