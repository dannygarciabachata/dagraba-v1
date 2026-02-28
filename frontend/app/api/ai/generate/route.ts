import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { KieService } from '@/lib/ai/services/kie-service';
import { MusicGptService } from '@/lib/ai/services/musicgpt-service';
import { BaseMusicService, MusicGenerationRequest } from '@/lib/ai/types';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { provider = 'kie', ...requestParams } = body;

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

        const taskId = await service.generateMusic(requestParams as MusicGenerationRequest);

        return NextResponse.json({ success: true, taskId }, { status: 200 });

    } catch (error: any) {
        console.error(`[AI Generation API Error]:`, error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
