import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth-server';

const execPromise = promisify(exec);

export async function POST(req: Request) {
    // SECURITY: Strictly for authenticated users
    const user = await getAuthenticatedUser(req);
    if (!user) {
        return unauthorizedResponse('Unauthorized: Please log in to analyze DNA');
    }

    try {
        const formData = await req.formData();
        const rawAudio = formData.get('rawAudio') as File;
        const masteredAudio = formData.get('masteredAudio') as File;
        const profileName = formData.get('profileName') as string;
        const genre = formData.get('genre') as string;

        if (!rawAudio || !masteredAudio || !profileName || !genre) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const tempDir = path.join(process.cwd(), 'tmp', 'dna-analysis');
        await fs.mkdir(tempDir, { recursive: true });

        const requestId = uuidv4();
        const rawPath = path.join(tempDir, `${requestId}_raw.wav`);
        const masteredPath = path.join(tempDir, `${requestId}_mastered.wav`);

        // Helper to save File to disk
        const saveAudio = async (file: File, filePath: string) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            await fs.writeFile(filePath, buffer);
        };

        await saveAudio(rawAudio, rawPath);
        await saveAudio(masteredAudio, masteredPath);

        const scriptPath = path.join(process.cwd(), 'sao-instrumental-finetune', 'dataset-creator', 'analyze_mastering_dna.py');

        try {
            const { stdout, stderr } = await execPromise(`python3 "${scriptPath}" "${rawPath}" "${masteredPath}"`);

            if (stderr && !stdout) {
                console.error('Python Error:', stderr);
                return NextResponse.json({ error: 'Analysis script failed' }, { status: 500 });
            }

            const analysisResult = JSON.parse(stdout);

            if (analysisResult.error) {
                return NextResponse.json({ error: analysisResult.error }, { status: 400 });
            }

            // Save to database
            const dnaProfile = await prisma.masteringDNA.create({
                data: {
                    profileName,
                    genre,
                    dnaData: analysisResult,
                    isGoldStandard: true
                }
            });

            // Cleanup
            await fs.unlink(rawPath);
            await fs.unlink(masteredPath);

            return NextResponse.json({
                success: true,
                profileId: dnaProfile.id,
                dna: analysisResult
            });

        } catch (execError: any) {
            console.error('Execution Error:', execError);
            return NextResponse.json({ error: 'Failed to execute analysis' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('DNA Analysis Route Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
