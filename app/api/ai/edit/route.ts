import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { KieService } from '@/lib/ai/services/kie-service';
import { MusicGptService } from '@/lib/ai/services/musicgpt-service';
import { BaseMusicService } from '@/lib/ai/types';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { provider = 'kie', action, ...payload } = body;

        if (!action) {
            return NextResponse.json({ error: 'Action is required (instrumental, vocals, replace, extend)' }, { status: 400 });
        }

        let service: BaseMusicService;

        if (provider === 'kie') {
            service = new KieService();
        } else if (provider === 'musicgpt') {
            service = new MusicGptService();
        } else {
            return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
        }

        let taskId: string;

        switch (action) {
            case 'instrumental':
                if (!service.addInstrumental) throw new Error(`${provider} does not support addInstrumental`);
                taskId = await service.addInstrumental(payload as any);
                break;
            case 'vocals':
                if (!service.addVocals) throw new Error(`${provider} does not support addVocals`);
                taskId = await service.addVocals(payload as any);
                break;
            case 'replace':
                if (!service.replaceSection) throw new Error(`${provider} does not support replaceSection`);
                taskId = await service.replaceSection(payload as any);
                break;
            case 'extend':
                if (!service.uploadAndExtend) throw new Error(`${provider} does not support uploadAndExtend`);
                taskId = await service.uploadAndExtend(payload as any);
                break;
            default:
                return NextResponse.json({ error: 'Invalid action. Must be instrumental, vocals, replace, or extend' }, { status: 400 });
        }

        return NextResponse.json({ taskId });
    } catch (error: any) {
        console.error('Audio Edit API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
