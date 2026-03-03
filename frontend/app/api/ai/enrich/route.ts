import { NextResponse } from 'next/server';
import { SAOClient } from '@/lib/ai/sao-client';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const artist = searchParams.get('artist');
    const track = searchParams.get('track');

    if (!artist || !track) {
        return NextResponse.json({ error: 'Artist and Track are required' }, { status: 400 });
    }

    const user = await getAuthenticatedUser(req);
    if (!user) {
        return unauthorizedResponse();
    }

    try {
        console.log(`[AI Enrich] Fetching metadata for ${artist} - ${track}`);
        const metadata = await SAOClient.fetchTrackMetadata(artist, track);

        // Simple prompt generation logic based on SAO patterns
        let promptParts = [];

        if (metadata.lastfm?.tags) {
            promptParts.push(metadata.lastfm.tags.join(', '));
        }

        if (metadata.spotify) {
            const energy = metadata.spotify.popularity > 70 ? 'high energy' : 'chill';
            promptParts.push(energy);
        }

        const generatedPrompt = `Música al estilo de ${artist}, con vibras de ${promptParts.join(', ')}. Un sonido profesional y envolvente.`;

        return NextResponse.json({
            success: true,
            metadata,
            generatedPrompt
        });
    } catch (error) {
        console.error('Enrichment API Error:', error);
        return NextResponse.json({ error: 'Failed to enrich metadata' }, { status: 500 });
    }
}
