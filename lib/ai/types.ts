export interface TrackData {
    id: string;
    audioUrl: string;
    streamAudioUrl?: string;
    imageUrl?: string;
    prompt: string;
    title: string;
    tags: string;
    duration: number;
    createTime?: string;
}

export interface MusicGenerationRequest {
    prompt: string;
    instrumental: boolean;
    style?: string;
    title?: string;
    callbackUrl?: string;
    // Optional generic flags that providers might adapt
    model?: string;
    customMode?: boolean;
}

export interface TaskStatusResponse {
    status: 'PENDING' | 'SUCCESS' | 'ERROR' | 'PARTIAL';
    taskId: string;
    tracks?: TrackData[];
    error?: string;
}

export interface BaseMusicService {
    /**
     * Start a new music generation task
     * @returns The taskId representing the queued job
     */
    generateMusic(request: MusicGenerationRequest): Promise<string>;

    /**
     * Check the current status of a music generation task
     */
    getTaskStatus(taskId: string): Promise<TaskStatusResponse>;

    /**
     * Extend an existing track
     * @returns The new taskId
     */
    extendMusic?(audioId: string, request: Partial<MusicGenerationRequest>): Promise<string>;
}
