import { prisma } from '@/lib/prisma';

/**
 * Kie.ai / Suno API Client
 * Aligned with official documentation for Generate Music v1
 */

export interface KieGenerationRequest {
    prompt: string;               // Core idea (lyrics in custom mode)
    customMode: boolean;          // Enable detailed parameter control
    instrumental: boolean;        // No lyrics if true
    model: string;                // "V4", "V4_5", "V4_5PLUS", "V4_5ALL", "V5"
    callBackUrl: string;          // Required for async task results
    style?: string;               // Genre (Required in Custom Mode)
    title?: string;               // Track title (Required in Custom Mode)
    negativeTags?: string;        // Exclude traits
    vocalGender?: 'm' | 'f';      // Increase probability of male/female
    styleWeight?: number;         // 0-1, adherence to style
    weirdnessConstraint?: number; // 0-1, creative deviation
    audioWeight?: number;         // 0-1, audio feature balance
    personaId?: string;           // Apply a specific persona
    personaModel?: 'style_persona' | 'voice_persona';
}

export interface KieGenerationResponse {
    code: number;
    msg: string;
    data?: {
        taskId: string;
    };
}

export const kieClient = {
    /**
     * Official Suno V4/V5 music generation via Kie.ai
     */
    generate: async (request: KieGenerationRequest): Promise<KieGenerationResponse> => {
        // Try getting the dynamic override key from the database first
        let apiKey = process.env.KIE_API_KEY;
        try {
            const dbSetting = await prisma.systemSetting.findUnique({
                where: { key: 'KIE_API_KEY' }
            });
            if (dbSetting?.value) {
                apiKey = dbSetting.value;
            }
        } catch (dbError) {
            console.error('Failed to parse DB for API KEY. Falling back to env vars', dbError);
        }

        if (!apiKey) {
            console.error('KIE_API_KEY missing from environment and database');
            return { code: 401, msg: 'Authentication credentials are missing' };
        }

        try {
            const response = await fetch('https://api.kie.ai/api/v1/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(request)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Kie.ai API Error:', data);
                return {
                    code: response.status,
                    msg: data.msg || 'Kie.ai API Error'
                };
            }

            return data;
        } catch (error) {
            console.error('Kie Client Error:', error);
            return { code: 500, msg: 'Internal server error while connecting to Kie.ai' };
        }
    }
};
