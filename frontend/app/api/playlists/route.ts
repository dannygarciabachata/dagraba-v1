import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // For now, getting all playlists as we don't have auth context yet in this request
        // In a real app, we'd filter by user session
        const playlists = await prisma.playlist.findMany({
            include: {
                tracks: {
                    include: {
                        sample: true
                    }
                }
            }
        });
        return NextResponse.json(playlists);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, description, userId } = await request.json();

        // Ensure user exists (hacky for now if no auth is set up)
        let user = await prisma.user.findFirst();
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: 'default@dagraba.studio',
                    name: 'Default User'
                }
            });
        }

        const playlist = await prisma.playlist.create({
            data: {
                name,
                description,
                userId: userId || user.id
            }
        });
        return NextResponse.json(playlist);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
    }
}
