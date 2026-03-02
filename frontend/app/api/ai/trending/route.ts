import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const country = searchParams.get('country');

    try {
        // Query tracks from users in the same city/country
        const localTracks = await prisma.instrumentSample.findMany({
            where: {
                instrumentModel: {
                    user: {
                        city: city || undefined,
                        country: country || undefined,
                    }
                }
            },
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                instrumentModel: {
                    include: {
                        user: true
                    }
                }
            }
        });

        // Query artists in the same city
        const localArtists = await prisma.user.findMany({
            where: {
                city: city || undefined,
                country: country || undefined,
                isArtist: true,
            },
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        // Global trending fallback if local is empty
        const globalTracks = localTracks.length === 0 ? await prisma.instrumentSample.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                instrumentModel: {
                    include: {
                        user: true
                    }
                }
            }
        }) : [];

        // Simulate trending news based on location
        const trendingNews = [
            { id: 1, title: `Top Producers surfacing in ${city || 'your area'}`, date: 'Today', category: 'Scene' },
            { id: 2, title: `New ${city || 'Local'} Studio Session: Bachata Fusion`, date: 'Yesterday', category: 'Studio' },
            { id: 3, title: `Community Spotlight: Emerging Artists in ${country || 'the region'}`, date: '2 days ago', category: 'Spotlight' }
        ];

        return NextResponse.json({
            success: true,
            tracks: localTracks.length > 0 ? localTracks : globalTracks,
            artists: localArtists,
            news: trendingNews,
            isLocal: localTracks.length > 0
        });
    } catch (error) {
        console.error('Trending API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
