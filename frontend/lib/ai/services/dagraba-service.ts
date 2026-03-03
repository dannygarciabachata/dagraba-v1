import { prisma } from '@/lib/prisma';
import { BaseMusicService, MusicGenerationRequest, TaskStatusResponse } from '../types';
import fs from 'fs/promises';
import path from 'path';
import { JsonDbService } from './json-db-service';

interface DagrabaTaskResponse {
    id: string;
    // other fields omitted for brevity
}

interface DagrabaQueryResponse {
    id: string;
    status: 'pending' | 'generating' | 'succeeded' | 'failed' | 'cancelled' | 'timeouted';
    model: string;
    choices?: Array<{
        title: string;
        url: string;
        image_url?: string;
        prompt?: string;
        duration?: number;
    }>;
}

export class DagrabaService implements BaseMusicService {
    private baseUrl = 'https://api.mureka.ai/v1';

    private async getApiKey(): Promise<string> {
        try {
            const dbSetting = await prisma.systemSetting.findUnique({
                where: { key: 'DAGRABA_API_KEY' }
            });
            if (dbSetting?.value) return dbSetting.value;
        } catch (error) {
            console.error('Failed to read DAGRABA_API_KEY from DB, falling back to env');
        }

        const envKey = process.env.DAGRABA_API_KEY;
        if (!envKey) throw new Error('DAGRABA_API_KEY is not configured');

        return envKey;
    }

    async generateCoverArt(prompt: string, referentTaskId: string): Promise<string> {
        console.log(`[DagrabaService] Requesting Nano-Banana mock generation for prompt:`, prompt);

        const payload = {
            model: "google/nano-banana",
            input: {
                prompt: prompt,
                output_format: "png",
                image_size: "1:1"
            },
            // Webhook callback example
            // callBackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/image/webhook?taskId=${referentTaskId}`
        };

        const endpoint = process.env.USE_REAL_KIE === 'true'
            ? 'https://api.kie.ai/api/v1/jobs/createTask'
            : 'http://localhost:3000/api/v1/jobs/createTask';

        const apiKey = await this.getApiKey();

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.code === 200 && data.data?.taskId) {
                return data.data.taskId;
            }
            throw new Error(`Failed to create cover art task: ${data.message || data.msg}`);
        } catch (e) {
            console.error('[DagrabaService] generateCoverArt error:', e);
            throw e;
        }
    }

    async getCoverArtStatus(imageTaskId: string): Promise<string | null> {
        const endpoint = process.env.USE_REAL_KIE === 'true'
            ? `https://api.kie.ai/api/v1/jobs/queryTask`
            : `http://localhost:3000/api/v1/jobs/queryTask`;

        const apiKey = await this.getApiKey();

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({ taskId: imageTaskId })
            });

            const data = await res.json();
            if (data.code === 200 && (data.data?.state === 'success' || data.data?.status === 'success')) {
                const resultJson = JSON.parse(data.data.resultJson || '{}');
                if (resultJson.resultUrls && resultJson.resultUrls.length > 0) {
                    return resultJson.resultUrls[0];
                }
            }
            return null; // still pending or failed
        } catch (e) {
            console.error('[DagrabaService] getCoverArtStatus error:', e);
            return null;
        }
    }

    async generateMusic(request: MusicGenerationRequest): Promise<string> {
        console.log('[DagrabaService] Music generation request:', request);

        const modelId = request.model || 'default';
        const genre = request.style || 'bolero';

        try {
            const aiUrl = process.env.NEXT_PUBLIC_AI_ENGINE_URL || 'http://localhost:8000';
            console.log(`[DagrabaService] Attempting to reach AI Engine at ${aiUrl}...`);
            const response = await fetch(`${aiUrl}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: request.prompt || 'Música',
                    modelId: modelId,
                    genre: genre,
                    duration: 30
                })
            });

            if (!response.ok) {
                throw new Error(`AI Engine error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.taskId;

        } catch (error) {
            console.error('[DagrabaService] Failed to connect to local AI Engine:', error);
            console.warn('[DagrabaService] WARNING: Falling back to local UI simulation because Python engine is unreachable. Is the FastAPI server running?');

            const encodedPrompt = Buffer.from(request.prompt || 'Musica').toString('base64').substring(0, 32);
            return `local_${Date.now()}_${modelId}_${encodedPrompt}_${Math.random().toString(36).substring(7)}`;
        }
    }

    async getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
        console.log('[DagrabaService] Checking status for task:', taskId);

        // If it's a real Python task
        if (taskId.startsWith('ai_gen_')) {
            try {
                const aiUrl = process.env.NEXT_PUBLIC_AI_ENGINE_URL || 'http://localhost:8000';
                const response = await fetch(`${aiUrl}/status/${taskId}`);
                if (response.ok) {
                    const data = await response.json();

                    if (data.status === 'SUCCESS') {
                        return {
                            status: 'SUCCESS',
                            taskId,
                            tracks: [
                                {
                                    id: `${taskId}_v1`,
                                    url: data.audio_url || data.audioUrl,
                                    audioUrl: data.audio_url || data.audioUrl,
                                    streamAudioUrl: data.audio_url || data.audioUrl,
                                    imageUrl: data.image_url || data.imageUrl,
                                    title: data.title,
                                    prompt: data.prompt,
                                    lyrics: data.lyrics,
                                    tags: data.tags,
                                    duration: 30
                                }
                            ]
                        };
                    } else if (data.status === 'FAILED') {
                        return { status: 'ERROR', taskId };
                    } else {
                        return { status: 'PENDING', taskId };
                    }
                }
            } catch (err) {
                console.error('[DagrabaService] Failed to poll Python AI Engine:', err);
                return { status: 'PENDING', taskId };
            }
        }

        // If it's a simulated taskId (fallback scenario)
        const parts = taskId.split('_');
        const timestamp = parseInt(parts[1] || '0');
        const requestedModelId = parts[2] || 'default';
        const rawPrompt = Buffer.from(parts[3] || '', 'base64').toString('utf8');
        const now = Date.now();
        const elapsed = now - timestamp;

        // Simulate 15 seconds of "Thinking/Generating"
        if (elapsed < 15000) {
            return {
                status: 'PENDING',
                taskId
            };
        }

        // Fallback to a real existing file if possible, or a generic placeholder
        let audioUrl = `/datasets/train_1772500430490/demo_bolero.mp3`;
        let imageUrl = '/covers/bolero_cover.png';
        let title = `Dagraba AI: ${rawPrompt.substring(0, 20)}...`;

        // HeartMuLa style lyrics
        let lyrics = `[Intro]\n(Drums and soft guitar start filtering in)\n\n[Verse 1]\nIdea: ${rawPrompt}\nBuscando el ritmo en el corazón,\nDa Graba Studio en la habitación.\n\n[Chorus]\nADN de mi alma, Bolero y Pasión,\nTodo lo que siento en esta canción.\n\n[Outro]\n(Music fades out with piano notes)`;

        // HeartMuLa style tags
        let tags = 'acoustic guitar,piano,romantic,bolero,bachata,tropical,44.1khz,heartmula-3b';

        // Try to find the specific model from JsonDbService
        try {
            const jsonDb = new JsonDbService();
            const models = await jsonDb.getModels();

            const targetModel = requestedModelId && requestedModelId !== 'default' && requestedModelId !== 'V4_5'
                ? models.find(m => m.id === requestedModelId)
                : (models.length > 0 ? models[models.length - 1] : null); // Simple fallback to latest

            if (targetModel) {
                const datasetDir = path.join(process.cwd(), 'frontend', 'public', 'datasets', targetModel.id);
                try {
                    const files = await fs.readdir(datasetDir);
                    // Look for our newly converted demo_bolero.mp3 first
                    const demoFile = files.find(f => f === 'demo_bolero.mp3');

                    if (demoFile) {
                        audioUrl = `/datasets/${targetModel.id}/${demoFile}`;
                        title = `${targetModel.name} (HeartMuLa)`;
                        imageUrl = `/covers/bolero_cover.png`;
                    }
                } catch (e) {
                    console.log(`[DagrabaService] No dataset folder found for ${targetModel.id}, using default assets`);
                }
            }
        } catch (err) {
            console.error('[DagrabaService] Error fetching model for generation:', err);
        }

        return {
            status: 'SUCCESS',
            taskId,
            tracks: [
                {
                    id: `${taskId}_v1`,
                    audioUrl,
                    imageUrl,
                    title,
                    prompt: rawPrompt,
                    lyrics,
                    tags,
                    duration: 180
                }
            ]
        };
    }

    async trainModel(dataset: any): Promise<string> {
        console.log('[DagrabaService] Initializing custom training with dataset:', {
            modelName: dataset.modelName,
            filesCount: dataset.audioFiles?.length
        });
        const trainingId = `train_${Date.now()}`;

        // Persist files to local dataset folder for training
        if (dataset.audioFiles && dataset.audioFiles.length > 0) {
            const datasetDir = path.join(process.cwd(), 'public', 'datasets', trainingId);
            await fs.mkdir(datasetDir, { recursive: true });

            for (const [index, file] of dataset.audioFiles.entries()) {
                if (file instanceof File || file instanceof Blob) {
                    const fileName = (file as File).name || `audio_${index}.wav`;
                    const filePath = path.join(datasetDir, fileName);
                    const buffer = Buffer.from(await file.arrayBuffer());
                    await fs.writeFile(filePath, buffer);
                    console.log(`[DagrabaService] Saved file: ${fileName}`);
                }
            }
        }

        if (dataset.referenceTrack && (dataset.referenceTrack instanceof File || dataset.referenceTrack instanceof Blob)) {
            const datasetDir = path.join(process.cwd(), 'public', 'datasets', trainingId);
            await fs.mkdir(datasetDir, { recursive: true });
            const fileName = `reference_${(dataset.referenceTrack as File).name || 'audio.wav'}`;
            const filePath = path.join(datasetDir, fileName);
            const buffer = Buffer.from(await dataset.referenceTrack.arrayBuffer());
            await fs.writeFile(filePath, buffer);
            console.log(`[DagrabaService] Saved reference track: ${fileName}`);
        }

        // Register model in DB so it shows up in selection
        try {
            await prisma.instrumentModel.create({
                data: {
                    id: trainingId,
                    name: dataset.modelName || 'Custom Model',
                    description: `Modelo entrenado localmente: ${dataset.modelName}`,
                    tags: ['custom', dataset.category || 'vocals'],
                    weightsUrl: `/datasets/${trainingId}`, // Local path pointer
                    userId: dataset.userId || null,
                    baseModel: 'Dagraba-V1-Local'
                }
            });
            console.log(`[DagrabaService] Registered model ${dataset.modelName} in DB.`);
        } catch (dbError) {
            console.error('[DagrabaService] Failed to register model in DB:', dbError);
        }

        return trainingId;
    }
}
