import { NextResponse } from 'next/server';
import { SAOClient } from '@/lib/ai/sao-client';

export async function POST(req: Request) {
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
        // In a real production environment, this would hit a Modal webhook or use their SDK
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

export async function GET() {
    try {
        // Return available models from the database
        // This would be used to populate the "Available Instruments" rack in the admin panel
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
