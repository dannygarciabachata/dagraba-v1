import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Note: These will need to be added to .env.local
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_API_SECRET = process.env.LASTFM_API_SECRET;

export interface SAOTrainingConfig {
    name: string;
    description?: string;
    tags: string[];
    midiFolder: string;
    vst3Plugins: string[];
}

export class SAOClient {
    /**
     * Triggers a Modal job to start fine-tuning a Stable Audio Open model.
     */
    static async startTraining(config: SAOTrainingConfig) {
        console.log(`Starting SAO Training for: ${config.name}`);

        // This would call the Modal background function via their API or a runner
        // For now, we simulate the job creation in the DB
        const model = await prisma.instrumentModel.create({
            data: {
                name: config.name,
                description: config.description,
                tags: config.tags,
                baseModel: "stabilityai/stable-audio-open-1.0",
                // weightsUrl will be updated when training completes
            }
        });

        return model;
    }

    /**
     * Fetches a client credentials access token from Spotify.
     */
    private static async fetchSpotifyAccessToken() {
        if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) return null;

        try {
            const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'grant_type=client_credentials',
            });

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error("Error fetching Spotify token:", error);
            return null;
        }
    }

    /**
     * Fetches metadata for a track from Spotify/Last.fm
     */
    static async fetchTrackMetadata(artist: string, track: string) {
        const token = await this.fetchSpotifyAccessToken();

        // Enrichment results
        const result: any = {
            artist,
            track,
            fetchedAt: new Date().toISOString(),
            spotify: null,
            lastfm: null
        };

        if (token) {
            try {
                const query = encodeURIComponent(`track:${track} artist:${artist}`);
                const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (data.tracks?.items?.length > 0) {
                    const item = data.tracks.items[0];
                    result.spotify = {
                        id: item.id,
                        href: item.href,
                        name: item.name,
                        popularity: item.popularity,
                        preview_url: item.preview_url,
                        album: item.album.name,
                        release_date: item.album.release_date
                    };
                }
            } catch (error) {
                console.error("Spotify search error:", error);
            }
        }

        // Last.fm enrichment for Tags, Genre, and Mood
        if (LASTFM_API_KEY) {
            try {
                const query = encodeURIComponent(`track=${track}&artist=${artist}`);
                const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`);
                const data = await response.json();

                if (data.track) {
                    const tags = data.track.toptags?.tag?.map((t: any) => t.name) || [];
                    result.lastfm = {
                        listeners: data.track.listeners,
                        playcount: data.track.playcount,
                        tags: tags.slice(0, 5), // Top 5 tags
                        summary: data.track.wiki?.summary
                    };

                    // Auto-suggest tags based on Last.fm
                    if (tags.length > 0) {
                        result.suggestedTags = tags.slice(0, 3);
                    }
                }
            } catch (error) {
                console.error("Last.fm enrichment error:", error);
            }
        }

        return result;
    }

    /**
     * Registers a new sample (audio + midi + metadata) in the database.
     */
    static async registerSample(data: {
        name: string,
        audioUrl: string,
        midiUrl?: string,
        prompt: string,
        metadata?: any,
        modelId: string
    }) {
        return await prisma.instrumentSample.create({
            data: {
                name: data.name,
                audioUrl: data.audioUrl,
                midiUrl: data.midiUrl,
                prompt: data.prompt,
                metadata: data.metadata,
                instrumentModelId: data.modelId
            }
        });
    }
}
