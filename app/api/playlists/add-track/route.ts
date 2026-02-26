import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { playlistId, sampleId } = await request.json();

        const playlistTrack = await prisma.playlistTrack.create({
            data: {
                playlistId,
                sampleId
            },
            include: {
                sample: true
            }
        });

        return NextResponse.json(playlistTrack);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add track to playlist' }, { status: 500 });
    }
}
