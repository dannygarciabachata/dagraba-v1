import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';

export async function POST(req: Request) {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) return unauthorizedResponse();

    try {
        const body = await req.json();
        const { location, city, country, isArtist, bio } = body;

        // Upsert user based on email from verified token
        const updatedUser = await prisma.user.upsert({
            where: { email: authUser.email! },
            update: {
                name: authUser.name || undefined,
                location: location || undefined,
                city: city || undefined,
                country: country || undefined,
                isArtist: isArtist !== undefined ? isArtist : undefined,
            },
            create: {
                email: authUser.email!,
                name: authUser.name || 'Anonymous',
                location: location || '',
                city: city || '',
                country: country || '',
                isArtist: isArtist || false,
            },
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) return unauthorizedResponse();

    try {
        const user = await prisma.user.findUnique({
            where: { email: authUser.email! },
            include: {
                projects: true,
                instrumentModels: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Profile Get Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
