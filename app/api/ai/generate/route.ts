import { NextResponse } from 'next/server';
import { kieClient } from '@/lib/ai/kie-client';

/**
 * Internal API Proxy for Kie.ai / Suno Music Generation
 * This route simplifies the usage by accepting the exact same body as the official Kie.ai API.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Use the simplified client implementation
        const result = await kieClient.generate(body);

        // Map responses directly to maintain consistency
        return NextResponse.json(result, { status: result.code === 200 ? 200 : result.code });

    } catch (error) {
        console.error('Kie API Route Error:', error);
        return NextResponse.json({
            code: 500,
            msg: 'Internal Server Error'
        }, { status: 500 });
    }
}
