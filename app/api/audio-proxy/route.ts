import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const audioUrl = searchParams.get('url');

    if (!audioUrl) {
        return new NextResponse('Missing url parameter', { status: 400 });
    }

    try {
        const response = await fetch(audioUrl, {
            headers: {
                // Some CDNs (like Suno) block requests without a standard User-Agent
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch audio: ${response.statusText}`);
        }

        const audioData = await response.arrayBuffer();

        // Return the audio data with appropriate headers to bypass CORS in the browser
        return new NextResponse(audioData, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error: any) {
        console.error('[AudioProxy] Error:', error);
        return new NextResponse(`Error fetching audio: ${error.message}`, { status: 500 });
    }
}
