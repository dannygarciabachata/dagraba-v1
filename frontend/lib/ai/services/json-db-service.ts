import fs from 'fs/promises';
import path from 'path';

export interface AIModelMetadata {
    id: string;
    name: string;
    description: string;
    genre: string;
    tags: string[];
    baseModel: string;
    status: string;
    created_at: string;
}

export interface DatasetClip {
    id: string;
    model_ref: string;
    audioSrc: string;
    tags: Record<string, any>;
    lyrics?: string;
    duration_sec?: number;
}

export interface GeneratedCover {
    cover_url: string;
    prompt: string;
    task_id: string;
    created_at: string;
}

export interface DatasetIndex {
    models: AIModelMetadata[];
    dataset_clips: DatasetClip[];
    generated_covers: GeneratedCover[];
}

export class JsonDbService {
    private dbPath: string;

    constructor() {
        // Path to the global JSON database
        this.dbPath = path.join(process.cwd(), 'public', 'datasets', 'index.json');
    }

    private async ensureDbExists() {
        try {
            await fs.mkdir(path.dirname(this.dbPath), { recursive: true });
            try {
                await fs.access(this.dbPath);
            } catch {
                const initialData: DatasetIndex = {
                    models: [],
                    dataset_clips: [],
                    generated_covers: []
                };
                await fs.writeFile(this.dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
            }
        } catch (error) {
            console.error('[JsonDbService] Error ensuring DB exists:', error);
        }
    }

    async readDb(): Promise<DatasetIndex> {
        await this.ensureDbExists();
        try {
            const data = await fs.readFile(this.dbPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('[JsonDbService] Error reading DB:', error);
            return { models: [], dataset_clips: [], generated_covers: [] };
        }
    }

    async writeDb(data: DatasetIndex): Promise<void> {
        await this.ensureDbExists();
        try {
            // Write to a temporary file, then atomic rename to prevent corruption on crash
            const tempPath = `${this.dbPath}.tmp`;
            await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
            await fs.rename(tempPath, this.dbPath);
        } catch (error) {
            console.error('[JsonDbService] Error writing DB:', error);
        }
    }

    // --- Helpers ---

    async addModel(model: Omit<AIModelMetadata, 'created_at'>): Promise<AIModelMetadata> {
        const db = await this.readDb();
        const newModel = {
            ...model,
            created_at: new Date().toISOString()
        };
        db.models.push(newModel);
        await this.writeDb(db);
        return newModel;
    }

    async getModels(): Promise<AIModelMetadata[]> {
        const db = await this.readDb();
        return db.models || [];
    }

    async getModelById(id: string): Promise<AIModelMetadata | undefined> {
        const models = await this.getModels();
        return models.find(m => m.id === id);
    }

    async addClip(clip: DatasetClip): Promise<void> {
        const db = await this.readDb();
        db.dataset_clips.push(clip);
        await this.writeDb(db);
    }

    async addGeneratedCover(cover: GeneratedCover): Promise<void> {
        const db = await this.readDb();
        if (!db.generated_covers) db.generated_covers = [];
        db.generated_covers.push(cover);
        await this.writeDb(db);
    }
}
