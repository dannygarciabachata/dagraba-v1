import { NextResponse } from 'next/server';
import { DagrabaService } from '@/lib/ai/services/dagraba-service';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';

export async function POST(req: Request) {
    // SECURITY: Only authenticated users can trigger training
    const user = await getAuthenticatedUser(req);

    if (!user) {
        return unauthorizedResponse('Unauthorized: Please log in to train models');
    }

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
