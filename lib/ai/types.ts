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

export interface VideoGenerationRequest {
    taskId: string;
    audioId: string;
    callBackUrl?: string;
    author?: string;
    domainName?: string;
}

export interface TaskStatusResponse {
    status: 'PENDING' | 'SUCCESS' | 'ERROR' | 'PARTIAL';
    taskId: string;
    tracks?: TrackData[];
    videoUrl?: string; // Optional for MP4 tasks
    error?: string;
}

export interface BaseMusicService {
    /**
     * Start a new music generation task
     * @returns The taskId representing the queued job
     */
    generateMusic(request: MusicGenerationRequest): Promise<string>;

    /**
     * Start a new music video (MP4) generation task
     * @returns The taskId representing the queued job
     */
    generateVideo?(request: VideoGenerationRequest): Promise<string>;

    /**
     * Check the current status of a music generation task
     */
    getTaskStatus(taskId: string): Promise<TaskStatusResponse>;

    /**
     * Check the current status of an MP4 generation task
     */
    getVideoTaskStatus?(taskId: string): Promise<TaskStatusResponse>;

    /**
     * Check the current status of a generic Market Models task
     */
    getMarketTaskStatus?(taskId: string): Promise<TaskStatusResponse>;

    /**
     * Extend an existing track
     * @returns The new taskId
     */
    extendMusic?(audioId: string, request: Partial<MusicGenerationRequest>): Promise<string>;
}
