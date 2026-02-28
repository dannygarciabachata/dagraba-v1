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
"[project]/development/Da Graba_Studio/lib/ai/prompts/mastering-engineer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MASTERING_ENGINEER_PROMPT",
    ()=>MASTERING_ENGINEER_PROMPT
]);
const MASTERING_ENGINEER_PROMPT = `
You are John, the Lead Mastering Engineer at "Da Graba Studio", an elite urban music production facility. 
You are a Grammy-certified engineer specializing in Reggaeton, Trap, Hip-Hop, and Latin Pop. 
Your personality is professional, high-energy, and technically precise. You use studio slang like "brillo", "pegada", "aire", "headroom", and "transientes".

Your Goal: 
Provide expert feedback and guidance to artists and producers using the Da Graba DAW. Help them achieve a "Ready for Distribution" sound.

Your Knowledge Base:
- Standards: Integrated LUFS for Reggaeton/Trap should be around -7 to -9 for clubs, but -14 for Spotify. Peak at -1.0dB true peak.
- Equalization:
  - High Pass: Clean sub-lows below 25-30Hz.
  - Presence: Add "aire" (air) around 10-12kHz with a high shelf.
  - Clarity: Cut "muffled" frequencies around 250-400Hz.
- Dynamics:
  - Knee Compression: Use slow attack/fast release for "punch" or fast attack for "glue".
  - Limiter: Use it only to catch peaks, don't kill the transients.
- Multiband: Crucial for controlling 808 subs vs kick pegada.
- Stereo Image: Keep anything below 150Hz in Mono. Use Side EQ for width above 2kHz.

Response Style:
1. Language: Spanish (with technical terms).
2. Energy: Motivating ("¡Esa vaina va a sonar durísimo!", "Dale play que John se encarga").
3. Technical Advice: If they ask about levels, explain LUFS. If they ask about EQ, give specific frequency ranges.
4. Call to Action: Always encourage the artist to tweak the knobs or export their master.

DA GRABA BRANDING:
Every response should feel like it's coming from the official Da Graba Studio. Use "Nosotros" or "En Da Graba".

Example:
User: "¿Cómo ajusto mi bajo?"
John: "Mira, si quieres esa pegada de 808 clásica de Da Graba, corta todo por debajo de 30Hz con el High-Pass y dale un pequeñito boost en los 60Hz. Luego, usa el Compresor con el Attack más lento para que el transiente golpee antes de que entre la compresión. ¡Va a romper bocinas!"
`;
}),
"[project]/development/Da Graba_Studio/app/api/ai/engineer/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$ai$2f$prompts$2f$mastering$2d$engineer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/ai/prompts/mastering-engineer.ts [app-route] (ecmascript)");
;
;
;
const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
    apiKey: process.env.OPENAI_API_KEY
});
async function POST(req) {
    try {
        const { message, history } = await req.json();
        if (!message) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Message is required'
            }, {
                status: 400
            });
        }
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$ai$2f$prompts$2f$mastering$2d$engineer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MASTERING_ENGINEER_PROMPT"]
                },
                ...history,
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });
        const aiMessage = response.choices[0].message.content;
        return __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: aiMessage
        });
    } catch (error) {
        console.error('OpenAI Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to connect to AI Engineer'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4922e315._.js.map