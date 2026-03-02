import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';

export async function GET(request: Request) {
    // SECURITY: Strictly for Superadmin only
    const user = await getAuthenticatedUser(request, true);

    if (!user) {
        return unauthorizedResponse('Unauthorized: Superadmin only');
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    try {
        if (key) {
            const setting = await prisma.systemSetting.findUnique({
                where: { key }
            });
            return NextResponse.json({ success: true, setting });
        } else {
            const settings = await prisma.systemSetting.findMany();
            return NextResponse.json({ success: true, settings });
        }
    } catch (error: any) {
        console.error('Error fetching system settings:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // SECURITY: Strictly for Superadmin only
    const user = await getAuthenticatedUser(request, true);

    if (!user) {
        return unauthorizedResponse('Unauthorized: Superadmin only');
    }

    try {
        const body = await request.json();
        const { key, value, category } = body;

        if (!key || value === undefined) {
            return NextResponse.json({ success: false, error: 'Key and Value are required' }, { status: 400 });
        }

        const setting = await prisma.systemSetting.upsert({
            where: { key },
            update: { value, category: category || 'system' },
            create: { key, value, category: category || 'system' }
        });

        return NextResponse.json({ success: true, setting });
    } catch (error: any) {
        console.error('Error saving system setting:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
