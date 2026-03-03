import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import { SAOClient } from '@/lib/ai/sao-client';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { JsonDbService } from '@/lib/ai/services/json-db-service';

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
        const jsonDb = new JsonDbService();
        const models = await jsonDb.getModels();

        // Optional filtering by userId if implemented in JSON later, for now we serve all models
        return NextResponse.json({
            instruments: models.map(inst => ({
                id: inst.id,
                name: inst.name,
                description: inst.description,
                tags: inst.tags || [],
                baseModel: inst.baseModel || 'google/nano-banana',
                status: inst.status || 'READY',
                createdAt: inst.created_at || new Date().toISOString()
            }))
        });
    } catch (error: any) {
        console.error('Failed to fetch instruments:', error);
        return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 });
    }
}
