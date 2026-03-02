import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';

export async function GET(req: Request) {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) return unauthorizedResponse();

    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                user: { email: authUser.email! }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return NextResponse.json({ success: true, transactions });
    } catch (error) {
        console.error('Transactions Fetch Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
