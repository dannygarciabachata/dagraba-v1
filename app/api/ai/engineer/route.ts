import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { MASTERING_ENGINEER_PROMPT } from '@/lib/ai/prompts/mastering-engineer';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error('Missing OPENAI_API_KEY environment variable');
            return NextResponse.json({ error: 'AI Service currently unavailable' }, { status: 503 });
        }

        const openai = new OpenAI({ apiKey });
        const { message, history } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: MASTERING_ENGINEER_PROMPT
                },
                ...history,
                { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const aiMessage = response.choices[0].message.content;

        return NextResponse.json({ message: aiMessage });
    } catch (error: any) {
        console.error('OpenAI Error:', error);
        return NextResponse.json({ error: 'Failed to connect to AI Engineer' }, { status: 500 });
    }
}
