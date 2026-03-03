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
        const { taskId } = body;

        if (!taskId) {
            return NextResponse.json({ code: 400, message: "Missing taskId" }, { status: 400 });
        }

        // In a real system, we'd check the DB. For the mock, we simulate it being ready if it's a simulated taskId
        if (taskId.startsWith('sim_nb_')) {
            // Simulate that the image is ready
            const generatedImageUrl = `https://picsum.photos/seed/${taskId}/1024/1024`;

            return NextResponse.json({
                code: 200,
                msg: "success",
                data: {
                    taskId: taskId,
                    state: "success",
                    status: "success",
                    resultJson: JSON.stringify({ resultUrls: [generatedImageUrl] })
                }
            });
        }

        return NextResponse.json({ code: 404, message: "Task not found" }, { status: 404 });

    } catch (err: any) {
        console.error("[Nano-Banana Mock] Query Error:", err);
        return NextResponse.json({ code: 500, message: "Internal server error" }, { status: 500 });
    }
}
