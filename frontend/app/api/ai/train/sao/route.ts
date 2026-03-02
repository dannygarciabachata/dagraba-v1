import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import { SAOClient } from '@/lib/ai/sao-client';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';

export async function POST(req: Request) {
    // SECURITY: Strictly for authenticated users
    const user = await getAuthenticatedUser(req);
    if (!user) {
        return unauthorizedResponse('Unauthorized: Please log in to train instruments');
    }

    try {
        const body = await req.json();
        const { name, description, tags, midiFolder, vst3Plugins } = body;

        if (!name) {
            return NextResponse.json({ error: 'Model name is required' }, { status: 400 });
        }

        // 1. Initial metadata and model registration
        const model = await SAOClient.startTraining({
            name,
            description,
            tags: tags || [],
            midiFolder: midiFolder || 'clean_midi',
            vst3Plugins: vst3Plugins || []
        });

        // 2. Simulate or trigger the Modal job
        console.log(`[SAO Training] Job queued for model: ${model.id}`);

        return NextResponse.json({
            message: 'Training job started successfully',
            modelId: model.id,
            status: 'QUEUED'
        });
    } catch (error: any) {
        console.error('SAO Training Route Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    // SECURITY: Authenticated check
    const user = await getAuthenticatedUser(req);
    if (!user) {
        return unauthorizedResponse();
    }

    try {
        return NextResponse.json({
            instruments: [
                { id: 'bolero-v1', name: 'Bolero Orchestra', tags: ['Bolero', 'Orchestra', 'Acoustic'] },
                { id: 'trap-v1', name: 'Trap Base', tags: ['Trap', 'Bass', 'Electronic'] }
            ]
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 });
    }
}
