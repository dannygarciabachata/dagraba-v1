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
"[project]/development/Da Graba_Studio/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/development/Da Graba_Studio/node_modules/@prisma/client)");
;
const globalForPrisma = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
const __TURBOPACK__default__export__ = prisma;
}),
"[project]/development/Da Graba_Studio/lib/ai/services/kie-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KieService",
    ()=>KieService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/prisma.ts [app-route] (ecmascript)");
;
class KieService {
    baseUrl = 'https://api.kie.ai/api/v1';
    async getApiKey() {
        try {
            const dbSetting = await __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].systemSetting.findUnique({
                where: {
                    key: 'KIE_API_KEY'
                }
            });
            if (dbSetting?.value) return dbSetting.value;
        } catch (error) {
            console.error('Failed to read KIE_API_KEY from DB, falling back to env');
        }
        const envKey = process.env.KIE_API_KEY;
        if (!envKey) throw new Error('KIE_API_KEY is not configured');
        return envKey;
    }
    async generateMusic(request) {
        const apiKey = await this.getApiKey();
        // Map generic request to specific Kie/Suno format
        const payload = {
            prompt: request.prompt,
            customMode: request.customMode ?? !!request.style,
            instrumental: request.instrumental,
            model: request.model || 'V4_5',
            style: request.style,
            title: request.title,
            callBackUrl: request.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/webhook`
        };
        const response = await fetch(`${this.baseUrl}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok || data.code !== 200) {
            throw new Error(`KIE Generation failed: ${data.msg || 'Unknown error'}`);
        }
        return data.data.taskId;
    }
    async generateVideo(request) {
        const apiKey = await this.getApiKey();
        const payload = {
            taskId: request.taskId,
            audioId: request.audioId,
            callBackUrl: request.callBackUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/webhook/video`,
            author: request.author,
            domainName: request.domainName
        };
        const response = await fetch(`${this.baseUrl}/mp4/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok || data.code !== 200) {
            throw new Error(`KIE Video Generation failed: ${data.msg || 'Unknown error'}`);
        }
        return data.data.taskId;
    }
    async getTaskStatus(taskId) {
        const apiKey = await this.getApiKey();
        const response = await fetch(`${this.baseUrl}/generate/record-info?taskId=${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const data = await response.json();
        if (!response.ok || data.code !== 200) {
            return {
                status: 'ERROR',
                taskId,
                error: `Status check failed: ${data.msg || 'Unknown error'}`
            };
        }
        const kieStatus = data.data.status;
        // Map Suno specific statuses to our generic status
        if (kieStatus === 'SUCCESS') {
            return {
                status: 'SUCCESS',
                taskId,
                tracks: data.data.response?.sunoData?.map((track)=>({
                        id: track.id,
                        audioUrl: track.audioUrl,
                        streamAudioUrl: track.streamAudioUrl,
                        imageUrl: track.imageUrl,
                        prompt: track.prompt,
                        title: track.title,
                        tags: track.tags,
                        duration: track.duration,
                        createTime: track.createTime
                    }))
            };
        }
        if (kieStatus === 'PENDING') {
            return {
                status: 'PENDING',
                taskId
            };
        }
        if (kieStatus === 'FIRST_SUCCESS' || kieStatus === 'TEXT_SUCCESS') {
            return {
                status: 'PARTIAL',
                taskId,
                tracks: data.data.response?.sunoData?.map((track)=>({
                        id: track.id,
                        audioUrl: track.audioUrl,
                        streamAudioUrl: track.streamAudioUrl,
                        imageUrl: track.imageUrl,
                        prompt: track.prompt,
                        title: track.title,
                        tags: track.tags,
                        duration: track.duration,
                        createTime: track.createTime
                    }))
            };
        }
        // Handle error statuses
        return {
            status: 'ERROR',
            taskId,
            error: data.data.errorMessage || `Task failed with status: ${kieStatus}`
        };
    }
    async getVideoTaskStatus(taskId) {
        const apiKey = await this.getApiKey();
        const response = await fetch(`${this.baseUrl}/mp4/record-info?taskId=${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const data = await response.json();
        if (!response.ok || data.code !== 200) {
            return {
                status: 'ERROR',
                taskId,
                error: `Video Status check failed: ${data.msg || 'Unknown error'}`
            };
        }
        const kieStatus = data.data?.response?.successFlag || data.data?.status;
        if (kieStatus === 'SUCCESS') {
            return {
                status: 'SUCCESS',
                taskId,
                // The Video response from KIE will contain the mp4 url in the data, or response object.
                // Assuming it comes in a `videoUrl` or similar based on typical payloads or callback structure.
                // Reusing standard videoUrl mapping here based on the callback docs provided.
                videoUrl: data.data?.response?.videoUrl || data.data?.response?.url || data.data?.videoUrl || data.data?.url
            };
        }
        if (kieStatus === 'PENDING') {
            return {
                status: 'PENDING',
                taskId
            };
        }
        return {
            status: 'ERROR',
            taskId,
            error: data.data?.errorMessage || `Video task failed with status: ${kieStatus}`
        };
    }
    async getMarketTaskStatus(taskId) {
        const apiKey = await this.getApiKey();
        const response = await fetch(`${this.baseUrl}/jobs/recordInfo?taskId=${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const data = await response.json();
        if (!response.ok || data.code !== 200) {
            return {
                status: 'ERROR',
                taskId,
                error: `Market Status check failed: ${data.msg || 'Unknown error'}`
            };
        }
        const kieState = data.data?.state;
        if (kieState === 'success') {
            let resultJsonObj = {};
            try {
                if (data.data?.resultJson) {
                    resultJsonObj = JSON.parse(data.data.resultJson);
                }
            } catch (e) {}
            return {
                status: 'SUCCESS',
                taskId,
                // Using Tracks as a generic carrier for Market Model responses where resultUrls might be images
                tracks: resultJsonObj?.resultUrls?.map((url, index)=>({
                        id: `${taskId}_${index}`,
                        audioUrl: url,
                        imageUrl: url,
                        title: `Market Output ${index}`,
                        prompt: data.data?.param,
                        tags: data.data?.model,
                        duration: 0
                    })) || []
            };
        }
        if (kieState === 'waiting' || kieState === 'queuing' || kieState === 'generating') {
            return {
                status: 'PENDING',
                taskId
            };
        }
        return {
            status: 'ERROR',
            taskId,
            error: data.data?.failMsg || `Market task failed with status: ${kieState}`
        };
    }
    async addInstrumental(request) {
        const apiKey = await this.getApiKey();
        const payload = {
            uploadUrl: request.uploadUrl,
            title: request.title,
            tags: request.tags,
            negativeTags: request.negativeTags,
            model: request.model || 'V4_5PLUS',
            vocalGender: request.vocalGender,
            styleWeight: request.styleWeight,
            weirdnessConstraint: request.weirdnessConstraint,
            audioWeight: request.audioWeight,
            callBackUrl: request.callBackUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/webhook`
        };
        const response = await fetch(`${this.baseUrl}/generate/add-instrumental`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok || data.code !== 200) {
            throw new Error(`KIE Add Instrumental failed: ${data.msg || 'Unknown error'}`);
        }
        return data.data.taskId;
    }
    async addVocals(request) {
        const apiKey = await this.getApiKey();
        const payload = {
            uploadUrl: request.uploadUrl,
            prompt: request.prompt,
            title: request.title,
            style: request.style,
            negativeTags: request.negativeTags,
            model: request.model || 'V4_5PLUS',
            vocalGender: request.vocalGender,
            styleWeight: request.styleWeight,
            weirdnessConstraint: request.weirdnessConstraint,
            audioWeight: request.audioWeight,
            callBackUrl: request.callBackUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/webhook`
        };
        const response = await fetch(`${this.baseUrl}/generate/add-vocals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok || data.code !== 200) {
            throw new Error(`KIE Add Vocals failed: ${data.msg || 'Unknown error'}`);
        }
        return data.data.taskId;
    }
    async replaceSection(request) {
        const apiKey = await this.getApiKey();
        const payload = {
            taskId: request.taskId,
            audioId: request.audioId,
            prompt: request.prompt,
            tags: request.tags,
            title: request.title,
            infillStartS: request.infillStartS,
            infillEndS: request.infillEndS,
            negativeTags: request.negativeTags,
            fullLyrics: request.fullLyrics,
            callBackUrl: request.callBackUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/webhook`
        };
        const response = await fetch(`${this.baseUrl}/generate/replace-section`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok || data.code !== 200) {
            throw new Error(`KIE Replace Section failed: ${data.msg || 'Unknown error'}`);
        }
        return data.data.taskId;
    }
    async uploadAndExtend(request) {
        const apiKey = await this.getApiKey();
        const payload = {
            uploadUrl: request.uploadUrl,
            defaultParamFlag: request.defaultParamFlag,
            instrumental: request.instrumental || false,
            continueAt: request.continueAt,
            model: request.model || 'V4_5PLUS',
            callBackUrl: request.callBackUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/webhook`
        };
        if (request.defaultParamFlag) {
            if (payload.instrumental) {
                payload.style = request.style;
                payload.title = request.title;
            } else {
                payload.style = request.style;
                payload.title = request.title;
                payload.prompt = request.prompt;
            }
        } else {
            payload.prompt = request.prompt; // Used as lyrics
        }
        // Optional
        if (request.negativeTags) payload.negativeTags = request.negativeTags;
        if (request.vocalGender) payload.vocalGender = request.vocalGender;
        if (request.styleWeight) payload.styleWeight = request.styleWeight;
        if (request.weirdnessConstraint) payload.weirdnessConstraint = request.weirdnessConstraint;
        if (request.audioWeight) payload.audioWeight = request.audioWeight;
        const response = await fetch(`${this.baseUrl}/generate/upload-extend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok || data.code !== 200) {
            throw new Error(`KIE Upload and Extend failed: ${data.msg || 'Unknown error'}`);
        }
        return data.data.taskId;
    }
}
}),
"[project]/development/Da Graba_Studio/lib/ai/services/musicgpt-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MusicGptService",
    ()=>MusicGptService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/prisma.ts [app-route] (ecmascript)");
;
class MusicGptService {
    async getApiKey() {
        try {
            const dbSetting = await __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].systemSetting.findUnique({
                where: {
                    key: 'MUSICGPT_API_KEY'
                }
            });
            if (dbSetting?.value) return dbSetting.value;
        } catch (error) {
            console.error('Failed to read MUSICGPT_API_KEY from DB, falling back to env');
        }
        const envKey = process.env.MUSICGPT_API_KEY;
        if (!envKey) throw new Error('MUSICGPT_API_KEY is not configured');
        return envKey;
    }
    async generateMusic(request) {
        const apiKey = await this.getApiKey();
        // This is a stub implementation meant to be populated when MusicGPT documentation is provided.
        console.log(`[MusicGPT] Triggering generation with key ending in: ...${apiKey.slice(-4)}`);
        // Return a mock task ID for now
        return `mgpt_task_${Date.now()}`;
    }
    async getTaskStatus(taskId) {
        // Stub polling response
        return {
            status: 'PENDING',
            taskId
        };
    }
}
}),
"[project]/development/Da Graba_Studio/app/api/ai/status/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$ai$2f$services$2f$kie$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/ai/services/kie-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$ai$2f$services$2f$musicgpt$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/ai/services/musicgpt-service.ts [app-route] (ecmascript)");
;
const dynamic = 'force-dynamic';
;
;
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const provider = searchParams.get('provider') || 'kie';
    const type = searchParams.get('type') || 'music'; // 'music', 'video', 'market'
    if (!taskId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'taskId is required'
        }, {
            status: 400
        });
    }
    try {
        let service;
        switch(provider.toLowerCase()){
            case 'musicgpt':
                service = new __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$ai$2f$services$2f$musicgpt$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MusicGptService"]();
                break;
            case 'kie':
            default:
                service = new __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$ai$2f$services$2f$kie$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["KieService"]();
                break;
        }
        let statusResponse;
        switch(type){
            case 'video':
                if (!service.getVideoTaskStatus) throw new Error(`Provider ${provider} does not support video status`);
                statusResponse = await service.getVideoTaskStatus(taskId);
                break;
            case 'market':
                if (!service.getMarketTaskStatus) throw new Error(`Provider ${provider} does not support market status`);
                statusResponse = await service.getMarketTaskStatus(taskId);
                break;
            case 'music':
            default:
                statusResponse = await service.getTaskStatus(taskId);
                break;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: statusResponse
        }, {
            status: 200
        });
    } catch (error) {
        console.error(`[AI Status API Error] Provider: ${provider}, Task: ${taskId}:`, error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__47955459._.js.map