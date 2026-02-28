module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/development/Da Graba_Studio/lib/ai/sao-client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SAOClient",
    ()=>SAOClient
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/development/Da Graba_Studio/node_modules/@prisma/client)");
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
// Note: These will need to be added to .env.local
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_API_SECRET = process.env.LASTFM_API_SECRET;
class SAOClient {
    /**
     * Triggers a Modal job to start fine-tuning a Stable Audio Open model.
     */ static async startTraining(config) {
        console.log(`Starting SAO Training for: ${config.name}`);
        // This would call the Modal background function via their API or a runner
        // For now, we simulate the job creation in the DB
        const model = await prisma.instrumentModel.create({
            data: {
                name: config.name,
                description: config.description,
                tags: config.tags,
                baseModel: "stabilityai/stable-audio-open-1.0"
            }
        });
        return model;
    }
    /**
     * Fetches a client credentials access token from Spotify.
     */ static async fetchSpotifyAccessToken() {
        if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) return null;
        try {
            const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=client_credentials'
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
     */ static async fetchTrackMetadata(artist, track) {
        const token = await this.fetchSpotifyAccessToken();
        // Enrichment results
        const result = {
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
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
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
                    const tags = data.track.toptags?.tag?.map((t)=>t.name) || [];
                    result.lastfm = {
                        listeners: data.track.listeners,
                        playcount: data.track.playcount,
                        tags: tags.slice(0, 5),
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
     */ static async registerSample(data) {
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
}),
"[project]/development/Da Graba_Studio/app/api/ai/train/sao/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$ai$2f$sao$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/ai/sao-client.ts [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        const body = await req.json();
        const { name, description, tags, midiFolder, vst3Plugins } = body;
        if (!name) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Model name is required'
            }, {
                status: 400
            });
        }
        // 1. Initial metadata and model registration
        const model = await __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$ai$2f$sao$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SAOClient"].startTraining({
            name,
            description,
            tags: tags || [],
            midiFolder: midiFolder || 'clean_midi',
            vst3Plugins: vst3Plugins || []
        });
        // 2. Simulate or trigger the Modal job
        // In a real production environment, this would hit a Modal webhook or use their SDK
        console.log(`[SAO Training] Job queued for model: ${model.id}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Training job started successfully',
            modelId: model.id,
            status: 'QUEUED'
        });
    } catch (error) {
        console.error('SAO Training Route Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function GET() {
    try {
        // Return available models from the database
        // This would be used to populate the "Available Instruments" rack in the admin panel
        return __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            instruments: [
                {
                    id: 'bolero-v1',
                    name: 'Bolero Orchestra',
                    tags: [
                        'Bolero',
                        'Orchestra',
                        'Acoustic'
                    ]
                },
                {
                    id: 'trap-v1',
                    name: 'Trap Base',
                    tags: [
                        'Trap',
                        'Bass',
                        'Electronic'
                    ]
                }
            ]
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch instruments'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4d0c882a._.js.map