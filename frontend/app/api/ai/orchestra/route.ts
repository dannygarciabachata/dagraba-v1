import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Proxy to backend FastAPI server
        const aiUrl = process.env.NEXT_PUBLIC_AI_ENGINE_URL || 'http://localhost:8000';
        const response = await fetch(`${aiUrl}/orchestra`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ success: false, error: errorData.detail || 'Backend error' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error(`[Orchestra API Proxy Error]:`, error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
