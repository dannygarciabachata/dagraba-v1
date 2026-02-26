import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming this exists

export async function GET(req: Request) {
    try {
        // TO DO: In the future this should use the authenticated user's ID
        // For now, we will fetch the 10 most recent generated tracks

        // This is a placeholder structure until the DB relations are set in stone.
        // E.g., const tracks = await prisma.playlistTrack.findMany({...});

        // Using dummy data temporarily to ensure the Canva App integration works
        const mockTracks = [
            { id: 'track_1', title: 'Neon Lights Remix' },
            { id: 'track_2', title: 'Cyberpunk Odyssey' },
            { id: 'track_3', title: 'Acoustic Sunrise' },
        ];

        return NextResponse.json({ tracks: mockTracks }, { status: 200 });

    } catch (error) {
        console.error('API /user/tracks Error:', error);
        return NextResponse.json({
            code: 500,
            msg: 'Internal Server Error'
        }, { status: 500 });
    }
}
