import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';

export async function POST(req: Request) {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) return unauthorizedResponse();

    try {
        const body = await req.json();
        const { trackId, rightsOrg } = body;

        if (!trackId || !rightsOrg) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const publishing = await prisma.publishing.create({
            data: {
                trackId,
                rightsOrg,
                status: 'PENDING',
                systemShare: 0.50 // 50% cut for the system as requested
            }
        });

        return NextResponse.json({ success: true, publishing });
    } catch (error: any) {
        console.error('Publishing Registration Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) return unauthorizedResponse();

    try {
        const registrations = await prisma.publishing.findMany({
            where: {
                track: {
                    instrumentModel: {
                        user: {
                            email: authUser.email!
                        }
                    }
                }
            },
            include: {
                track: true
            }
        });

        return NextResponse.json({ success: true, registrations });
    } catch (error) {
        console.error('Publishing Fetch Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
