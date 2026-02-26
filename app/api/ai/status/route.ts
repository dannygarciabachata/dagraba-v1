import { NextResponse } from 'next/server';
import { KieService } from '@/lib/ai/services/kie-service';
import { MusicGptService } from '@/lib/ai/services/musicgpt-service';
import { BaseMusicService } from '@/lib/ai/types';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const provider = searchParams.get('provider') || 'kie';
    const type = searchParams.get('type') || 'music'; // 'music', 'video', 'market'

    if (!taskId) {
        return NextResponse.json({ success: false, error: 'taskId is required' }, { status: 400 });
    }

    try {
        let service: BaseMusicService;

        switch (provider.toLowerCase()) {
            case 'musicgpt':
                service = new MusicGptService();
                break;
            case 'kie':
            default:
                service = new KieService();
                break;
        }

        let statusResponse;

        switch (type) {
            case 'video':
                if (!service.getVideoTaskStatus) throw new Error(`Provider ${provider} does not support video status`);
                statusResponse = await service.getVideoTaskStatus(taskId);
                break;
            case 'market':
                if (!service.getMarketTaskStatus) throw new Error(`Provider ${provider} does not support market status`);
                statusResponse = await service.getMarketTaskStatus(taskId);
                break;
            case 'music':
            default:
                statusResponse = await service.getTaskStatus(taskId);
                break;
        }

        return NextResponse.json({ success: true, data: statusResponse }, { status: 200 });

    } catch (error: any) {
        console.error(`[AI Status API Error] Provider: ${provider}, Task: ${taskId}:`, error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
