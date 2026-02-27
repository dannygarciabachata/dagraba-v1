import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ genre: string }> }
) {
    try {
        const { genre } = await context.params;

        // Find the Gold Standard DNA for this genre
        const goldStandard = await prisma.masteringDNA.findFirst({
            where: {
                genre: genre,
                isGoldStandard: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!goldStandard) {
            // Fallback to latest profiling if no gold standard is marked
            const latest = await prisma.masteringDNA.findFirst({
                where: { genre: genre },
                orderBy: { createdAt: 'desc' }
            });

            if (!latest) {
                return NextResponse.json({ success: false, error: 'No DNA profile found for this genre' }, { status: 404 });
            }
            return NextResponse.json({ success: true, dna: latest.dnaData });
        }

        return NextResponse.json({ success: true, dna: goldStandard.dnaData });
    } catch (error) {
        console.error('Error fetching Mastering DNA:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
