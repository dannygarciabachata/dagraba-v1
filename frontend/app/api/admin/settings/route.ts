import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    // SECURITY: Strictly for Superadmin only
    // In a production environment, this should use a secure JWT/Session role check.
    // For now, we use a custom header or query param as a placeholder if we had the email.
    // However, since we don't have the user object in the serverless route without a session,
    // we must ensure this is protected by another mechanism or at least acknowledge the limitation.

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const adminEmail = request.headers.get('x-admin-email');

    if (adminEmail !== 'dagrabastudio@gmail.com') {
        return NextResponse.json({ success: false, error: 'Unauthorized: Superadmin only' }, { status: 403 });
    }

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
    const adminEmail = request.headers.get('x-admin-email');

    if (adminEmail !== 'dagrabastudio@gmail.com') {
        return NextResponse.json({ success: false, error: 'Unauthorized: Superadmin only' }, { status: 403 });
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
