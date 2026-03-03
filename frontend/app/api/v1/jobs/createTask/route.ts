import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        // Simulated Authentication
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ code: 401, message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { model, callBackUrl, input } = body;

        // We only simulate google/nano-banana
        if (model !== 'google/nano-banana') {
            return NextResponse.json({ code: 400, message: "Invalid model" }, { status: 400 });
        }

        // Generate a simulated task ID
        const taskId = `sim_nb_${Date.now()}`;

        // Simulate Async Generation & Webhook Callback if a URL was provided
        if (callBackUrl) {
            setTimeout(async () => {
                // High quality cover placeholder simulating Nano Banana output
                const generatedImageUrl = `https://picsum.photos/seed/${taskId}/1024/1024`;

                const callbackPayload = {
                    code: 200,
                    msg: "Playground task completed successfully.",
                    data: {
                        completeTime: Date.now(),
                        costTime: 5,
                        createTime: Date.now() - 5000,
                        model: "google/nano-banana",
                        param: JSON.stringify(body),
                        resultJson: JSON.stringify({ resultUrls: [generatedImageUrl] }),
                        state: "success",
                        taskId: taskId,
                        failCode: null,
                        failMsg: null
                    }
                };

                try {
                    console.log(`[Nano-Banana Mock] Firing Webhook to ${callBackUrl} for task ${taskId}`);
                    await fetch(callBackUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(callbackPayload)
                    });
                } catch (e) {
                    console.error(`[Nano-Banana Mock] Webhook Callback Failed:`, e);
                }
            }, 5000); // 5 seconds processing simulation
        }

        return NextResponse.json({
            code: 200,
            message: "success",
            data: {
                taskId: taskId
            }
        });

    } catch (err: any) {
        console.error("[Nano-Banana Mock] POST Error:", err);
        return NextResponse.json({ code: 500, message: "Internal server error" }, { status: 500 });
    }
}
