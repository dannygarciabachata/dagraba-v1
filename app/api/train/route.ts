import { NextResponse } from 'next/server';
import { modalClient } from '@/lib/ai/modalClient';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const type = formData.get('type') as 'audio' | 'image';

        if (!type) {
            return NextResponse.json(
                { error: 'Missing type (audio or image)' },
                { status: 400 }
            );
        }

        // Call our Modal SDK mock to dispatch the training task
        const result = await modalClient.dispatchTrainingJob(type, formData);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in /api/train:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
