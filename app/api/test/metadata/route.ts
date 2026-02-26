import { NextResponse } from 'next/server';
import { SAOClient } from '@/lib/ai/sao-client';

export async function GET() {
    try {
        const artist = "Bad Bunny";
        const track = "Tití Me Preguntó";

        console.log(`[TEST] Fetching metadata for ${artist} - ${track}`);
        const metadata = await SAOClient.fetchTrackMetadata(artist, track);

        return NextResponse.json({
            success: true,
            testData: { artist, track },
            metadata
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
