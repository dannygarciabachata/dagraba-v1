import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';

export async function POST(req: Request) {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) return unauthorizedResponse();

    try {
        const body = await req.json();
        const { artistId, price } = body;

        if (!artistId || !price) {
            return NextResponse.json({ error: 'Missing artistId or price' }, { status: 400 });
        }

        const currentUser = await prisma.user.findUnique({ where: { email: authUser.email! } });
        if (!currentUser) throw new Error('User not found');

        const subscription = await prisma.subscription.upsert({
            where: {
                subscriberId_artistId: {
                    subscriberId: currentUser.id,
                    artistId: artistId
                }
            },
            update: {
                status: 'active',
                price: price,
            },
            create: {
                subscriberId: currentUser.id,
                artistId: artistId,
                status: 'active',
                price: price
            }
        });

        return NextResponse.json({ success: true, subscription });
    } catch (error: any) {
        console.error('Subscription Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
