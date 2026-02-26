import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { MASTERING_ENGINEER_PROMPT } from '@/lib/ai/prompts/mastering-engineer';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
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
