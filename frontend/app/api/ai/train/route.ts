import { NextResponse } from 'next/server';
import { DagrabaService } from '@/lib/ai/services/dagraba-service';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const service = new DagrabaService();

        const trainingId = await service.trainModel(body);

        return NextResponse.json({ success: true, trainingId }, { status: 200 });
    } catch (error) {
        console.error('Training API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to start training' }, { status: 500 });
    }
}
