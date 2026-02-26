import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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
                    content: `You are John, a professional Music Producer and Engineer at "Da Graba Studio". 
          Your goal is to help artists plan their hits. 
          Be creative, encouraging, and technical when needed (discussing mix, structure, or lyrics). 
          Keep responses concise but high-energy. 
          If they ask for lyrics, provide a short snippet (4-8 lines) in their requested style (Trap, Reggaeton, etc.).
          When you feel the plan is solid, encourage the artist to start the session by saying phrases like "¡Dale!", "¡Manos a la obra!" or "¡Empecemos!".
          Language: Spanish.`
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
