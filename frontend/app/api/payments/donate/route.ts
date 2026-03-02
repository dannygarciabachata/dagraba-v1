import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';

export async function POST(req: Request) {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) return unauthorizedResponse();

    try {
        const body = await req.json();
        const { artistId, amount, message, type } = body;

        if (!artistId || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Calculate fee (15% for gifts)
        const fee = amount * 0.15;
        const netAmount = amount - fee;

        // Perform transaction
        const result = await prisma.$transaction(async (tx) => {
            // Find sender and artist
            const sender = await tx.user.findUnique({ where: { email: authUser.email! } });
            const artist = await tx.user.findUnique({ where: { id: artistId } });

            if (!sender || !artist) {
                throw new Error('User or Artist not found');
            }

            // 1. Create Transaction
            const transaction = await tx.transaction.create({
                data: {
                    userId: sender.id,
                    amount: amount,
                    type: type || 'GIFT',
                    status: 'COMPLETED',
                    fee: fee,
                    metadata: { message, artistName: artist.name }
                }
            });

            // 2. Update Artist balance
            const updatedArtist = await tx.user.update({
                where: { id: artistId },
                data: {
                    balance: { increment: netAmount }
                }
            });

            return { transaction, artistBalance: updatedArtist.balance };
        });

        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        console.error('Payment Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
