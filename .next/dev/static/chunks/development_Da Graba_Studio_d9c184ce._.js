(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/development/Da Graba_Studio/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/ui/Slider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Slider",
    ()=>Slider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Slider = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, orientation = 'horizontal', ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: "range",
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('appearance-none bg-transparent cursor-pointer', // Custom track sizing and colors
        '[&::-webkit-slider-runnable-track]:bg-carbon [&::-webkit-slider-runnable-track]:border [&::-webkit-slider-runnable-track]:border-silver-dark/30', '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-silver-light', '[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,107,0,0.3)] hover:[&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(255,107,0,0.6)]', {
            'w-full h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:-mt-1': orientation === 'horizontal',
            // Vertical slider hacks
            '[writing-mode:vertical-lr] [direction:rtl] h-full w-2 [&::-webkit-slider-runnable-track]:w-2 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-carbon': orientation === 'vertical'
        }, className),
        ...props
    }, void 0, false, {
        fileName: "[project]/development/Da Graba_Studio/components/ui/Slider.tsx",
        lineNumber: 11,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Slider;
Slider.displayName = 'Slider';
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Slider$forwardRef");
__turbopack_context__.k.register(_c1, "Slider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/VUMeter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VUMeter",
    ()=>VUMeter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/utils.ts [app-client] (ecmascript)");
;
;
function VUMeter({ level, className }) {
    // Simple segmentation
    const totalSegments = 30;
    const activeSegments = Math.round(level / 127 * totalSegments);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col justify-end bg-black/40 rounded-sm overflow-hidden p-[1px] gap-[1px] border border-white/5 shadow-inner relative", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/VUMeter.tsx",
                lineNumber: 15,
                columnNumber: 13
            }, this),
            Array.from({
                length: totalSegments
            }).map((_, i)=>{
                const segmentIndex = totalSegments - 1 - i;
                const isActive = segmentIndex < activeSegments;
                let colorClass = '';
                if (isActive) {
                    if (segmentIndex > totalSegments - 4) {
                        colorClass = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
                    } else if (segmentIndex > totalSegments - 10) {
                        colorClass = 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]';
                    } else {
                        colorClass = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
                    }
                } else {
                    colorClass = 'bg-white/5';
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full h-[3px] transition-all duration-75 rounded-[0.5px]", colorClass)
                }, i, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/VUMeter.tsx",
                    lineNumber: 34,
                    columnNumber: 21
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/VUMeter.tsx",
        lineNumber: 14,
        columnNumber: 9
    }, this);
}
_c = VUMeter;
var _c;
__turbopack_context__.k.register(_c, "VUMeter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/SpectrumAnalyzer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SpectrumAnalyzer",
    ()=>SpectrumAnalyzer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useDAWStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function SpectrumAnalyzer({ analyzer, naked, isPlaying }) {
    _s();
    const dawIsPlaying = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "SpectrumAnalyzer.useDAWStore[dawIsPlaying]": (state)=>state.isPlaying
    }["SpectrumAnalyzer.useDAWStore[dawIsPlaying]"]);
    const actualIsPlaying = isPlaying !== undefined ? isPlaying : dawIsPlaying;
    const isPlayingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(actualIsPlaying);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SpectrumAnalyzer.useEffect": ()=>{
            isPlayingRef.current = actualIsPlaying;
        }
    }["SpectrumAnalyzer.useEffect"], [
        actualIsPlaying
    ]);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const requestRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Smooth falloff state holding the max peaks
    const peaksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SpectrumAnalyzer.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            // Ensure canvas renders sharply on high-DPI displays
            const scale = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * scale;
            canvas.height = canvas.clientHeight * scale;
            ctx.scale(scale, scale);
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            let dataArray;
            let bufferLength = 128; // Default if no analyzer
            if (analyzer) {
                bufferLength = analyzer.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);
            } else {
                dataArray = new Uint8Array(bufferLength);
            }
            // Initialize peaks array
            if (peaksRef.current.length !== bufferLength) {
                peaksRef.current = new Array(bufferLength).fill(0);
            }
            const renderFrame = {
                "SpectrumAnalyzer.useEffect.renderFrame": ()=>{
                    requestRef.current = requestAnimationFrame(renderFrame);
                    if (!isPlayingRef.current) {
                        // Dim the display when not playing
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        // Slowly decay any existing peaks
                        peaksRef.current = peaksRef.current.map({
                            "SpectrumAnalyzer.useEffect.renderFrame": (p)=>p * 0.9
                        }["SpectrumAnalyzer.useEffect.renderFrame"]);
                        // Draw static low baseline
                        const barWidth = Math.ceil(canvas.width / bufferLength);
                        for(let i = 0; i < bufferLength; i++){
                            const x = i * barWidth;
                            ctx.fillStyle = `rgba(255, 107, 0, 0.05)`;
                            ctx.fillRect(x, canvas.height - 2, barWidth - 1, 2);
                        }
                        return;
                    }
                    // Get audio data
                    if (analyzer) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        analyzer.getByteFrequencyData(dataArray);
                    } else {
                        // Simulate data for visual placeholder
                        const time = Date.now() / 1000;
                        for(let i = 0; i < bufferLength; i++){
                            // Create some dynamic peaks that look like music
                            const noise = Math.random() * 20;
                            const wave1 = Math.sin(time * 2 + i * 0.1) * 50 + 50;
                            const wave2 = Math.cos(time * 5 - i * 0.3) * 60 + 60;
                            // Emphasize bass (lower indices)
                            const bassBoost = i < 20 ? (20 - i) * 3 : 0;
                            // Attenuate highs
                            const highCut = i > 80 ? (i - 80) * 2 : 0;
                            let val = (wave1 + wave2) / 2 + noise + bassBoost - highCut;
                            // Occasional random spikes (like kick/snare)
                            if (Math.random() > 0.95 && i < 40) val += 80;
                            dataArray[i] = Math.max(0, Math.min(255, val));
                        }
                    }
                    // Clear canvas
                    ctx.clearRect(0, 0, width, height);
                    // Calculate bar width (leaving some gap)
                    // We use a subset of the buffer for better aesthetics (skipping the very highest dead frequencies)
                    const displayBins = Math.floor(bufferLength * 0.7);
                    const barWidth = width / displayBins - 1; // 1px gap
                    let x = 0;
                    const peaks = peaksRef.current;
                    const gravity = 1.5; // Speed at which peaks fall
                    for(let i = 0; i < displayBins; i++){
                        const value = dataArray[i];
                        // Update peak for smooth falloff
                        if (value > peaks[i]) {
                            peaks[i] = value;
                        } else {
                            peaks[i] = Math.max(0, peaks[i] - gravity);
                        }
                        // Normalize values to canvas height
                        const barHeight = value / 255 * height;
                        const peakHeight = peaks[i] / 255 * height;
                        // --- Draw Main Bar ---
                        // Gradient from Metallic Gray to DA GRABA Naranja (#FF6B00)
                        const barGradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
                        barGradient.addColorStop(0, '#5A5A60'); // Metallic gray base
                        barGradient.addColorStop(0.5, '#8C8C91'); // Lighter gray middle
                        barGradient.addColorStop(1, '#FF6B00'); // Orange peak
                        ctx.fillStyle = barGradient;
                        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                        // --- Draw Floating Peak (Cap) ---
                        // To enhance the 2D/3D feel, draw a bright cap at the peak level
                        ctx.fillStyle = '#FF9A4A'; // Slightly brighter orange for the cap
                        ctx.fillRect(x, height - peakHeight - 2, barWidth, 2);
                        x += barWidth + 1;
                    }
                }
            }["SpectrumAnalyzer.useEffect.renderFrame"];
            renderFrame();
            return ({
                "SpectrumAnalyzer.useEffect": ()=>{
                    if (requestRef.current) {
                        cancelAnimationFrame(requestRef.current);
                    }
                }
            })["SpectrumAnalyzer.useEffect"];
        }
    }["SpectrumAnalyzer.useEffect"], [
        analyzer
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full h-full relative p-2 overflow-hidden", !naked && "bg-[#111113]/60 backdrop-blur-md rounded-lg border border-[#333] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/SpectrumAnalyzer.tsx",
                lineNumber: 166,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "w-full h-full block"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/SpectrumAnalyzer.tsx",
                lineNumber: 168,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/SpectrumAnalyzer.tsx",
        lineNumber: 161,
        columnNumber: 9
    }, this);
}
_s(SpectrumAnalyzer, "Nxtv2LdZhTUWYj+QDX0+KAtyM0Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"]
    ];
});
_c = SpectrumAnalyzer;
var _c;
__turbopack_context__.k.register(_c, "SpectrumAnalyzer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PluginPicker",
    ()=>PluginPicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function PluginPicker({ onSelect, onClose }) {
    const plugins = [
        {
            id: 'gate',
            name: 'Gate',
            color: 'text-cyan-400'
        },
        {
            id: 'eq',
            name: 'Equalizer',
            color: 'text-cyan-400'
        },
        {
            id: 'leveler',
            name: 'Leveler',
            color: 'text-cyan-400'
        },
        {
            id: 'compressor',
            name: 'Compressor',
            color: 'text-cyan-400'
        },
        {
            id: 'multiband',
            name: 'Multiband',
            color: 'text-cyan-400'
        },
        {
            id: 'limiter',
            name: 'Limiter',
            color: 'text-cyan-400'
        },
        {
            id: 'reverb',
            name: 'Reverb',
            color: 'text-cyan-300'
        },
        {
            id: 'delay',
            name: 'Delay',
            color: 'text-orange-400'
        },
        {
            id: 'chorus',
            name: 'Chorus',
            color: 'text-purple-400'
        },
        {
            id: 'distortion',
            name: 'Distortion',
            color: 'text-red-400'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute top-0 left-0 w-56 bg-[#1A1A1A] border border-white/10 rounded-md shadow-2xl z-[150] p-1 animate-in fade-in zoom-in-95 duration-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 py-1.5 border-b border-white/5 mb-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-[9px] font-black text-white/40 uppercase tracking-widest",
                    children: "Select Effect"
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx",
                    lineNumber: 28,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx",
                lineNumber: 27,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "px-3 text-[8px] font-black text-white/20 uppercase tracking-widest",
                        children: "Dynamics"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx",
                        lineNumber: 31,
                        columnNumber: 17
                    }, this),
                    plugins.slice(0, 6).map((plugin)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                onSelect(plugin.id);
                                onClose();
                            },
                            className: `w-full text-left px-3 py-1.5 text-[10px] hover:text-white hover:bg-cyan-500/20 rounded-sm transition-colors uppercase font-bold tracking-tight ${plugin.color}`,
                            children: plugin.name
                        }, plugin.id, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx",
                            lineNumber: 33,
                            columnNumber: 21
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1 border-t border-white/5 pt-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "px-3 text-[8px] font-black text-white/20 uppercase tracking-widest",
                        children: "Time FX"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx",
                        lineNumber: 43,
                        columnNumber: 17
                    }, this),
                    plugins.slice(6).map((plugin)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                onSelect(plugin.id);
                                onClose();
                            },
                            className: `w-full text-left px-3 py-1.5 text-[10px] hover:text-white rounded-sm transition-colors uppercase font-bold tracking-tight ${plugin.color} hover:bg-white/10`,
                            children: plugin.name
                        }, plugin.id, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx",
                            lineNumber: 45,
                            columnNumber: 21
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx",
                lineNumber: 42,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 pt-1 border-t border-white/5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "w-full text-left px-3 py-1.5 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-sm transition-colors uppercase font-bold tracking-tight",
                    children: "Cancel"
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx",
                    lineNumber: 55,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx",
                lineNumber: 54,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx",
        lineNumber: 26,
        columnNumber: 9
    }, this);
}
_c = PluginPicker;
var _c;
__turbopack_context__.k.register(_c, "PluginPicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/lib/audio/WebAudioEngine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "audioEngine",
    ()=>audioEngine
]);
class WebAudioEngine {
    ctx = null;
    masterGain = null;
    trackChains = new Map();
    sourceNodeMap = new WeakMap();
    isPlaying = false;
    playhead = 0;
    startTime = 0;
    constructor(){
    // We delay context creation until a user interaction (play)
    }
    initContext() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    getOrCreateTrack(trackId) {
        this.initContext();
        if (!this.trackChains.has(trackId)) {
            const ctx = this.ctx;
            const input = ctx.createGain();
            const output = ctx.createGain();
            const panner = ctx.createStereoPanner();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            // Initial chain: Input -> Pan -> Output -> Analyser -> Master
            input.connect(panner);
            panner.connect(output);
            output.connect(analyser);
            analyser.connect(this.masterGain);
            this.trackChains.set(trackId, {
                input,
                output,
                panner,
                analyser,
                inserts: []
            });
        }
        return this.trackChains.get(trackId);
    }
    init(sampleRate, bufferSize) {
        console.log(`[WebAudioEngine] Ready for initialization. context will start on play.`);
        return true;
    }
    /**
     * Loads the AudioWorklet for the WebAssembly C++ engine.
     * To be called when the user wants to switch to the professional offline engine.
     */ async loadWasmLimiter() {
        this.initContext();
        try {
            await this.ctx.audioWorklet.addModule('/wasm/phaselimiter-worklet.js');
            console.log("[WebAudioEngine] WASM AudioWorklet module loaded successfully.");
            return true;
        } catch (error) {
            console.error("[WebAudioEngine] Failed to load WASM AudioWorklet module:", error);
            return false;
        }
    }
    play() {
        this.initContext();
        this.isPlaying = true;
        this.startTime = this.ctx.currentTime - this.playhead;
        console.log(`[WebAudioEngine] Playback started.`);
    }
    pause() {
        this.isPlaying = false;
        if (this.ctx) {
            this.playhead = this.ctx.currentTime - this.startTime;
        }
        console.log(`[WebAudioEngine] Playback paused.`);
    }
    stop() {
        this.isPlaying = false;
        this.playhead = 0;
        console.log(`[WebAudioEngine] Playback stopped.`);
    }
    setPlayheadPosition(seconds) {
        this.playhead = seconds;
        if (this.isPlaying && this.ctx) {
            this.startTime = this.ctx.currentTime - seconds;
        }
    }
    getPlayheadPosition() {
        if (this.isPlaying && this.ctx) {
            return this.ctx.currentTime - this.startTime;
        }
        return this.playhead;
    }
    setTrackVolume(trackId, value) {
        // value 0-100 to gain 0-1
        const chain = this.getOrCreateTrack(trackId);
        const gainValue = value / 100;
        chain.output.gain.setTargetAtTime(gainValue, this.ctx.currentTime, 0.05);
    }
    setTrackPan(trackId, value) {
        // value -50 to 50 to pan -1 to 1
        const chain = this.getOrCreateTrack(trackId);
        const panValue = value / 50;
        chain.panner.pan.setTargetAtTime(panValue, this.ctx.currentTime, 0.05);
    }
    setTrackMute(trackId, isMuted) {
        const chain = this.getOrCreateTrack(trackId);
        const gainValue = isMuted ? 0 : 1; // This should ideally be multiplied by the fader value
    // For simplicity, we'll store the target gain elsewhere or just use 0/1 for now
    // A better way is to have another GainNode for mute
    }
    setTrackSolo(trackId, isSolo) {
    // Dummy implementation for compilation
    }
    moveAudioClip(clipId, newTime) {
    // Dummy implementation
    }
    getWaveformData(clipId, arg2) {
        // Dummy implementation
        return [];
    }
    // New method to connect a real audio element (like in the mastering page)
    connectAudioElement(trackId, element) {
        this.initContext();
        const chain = this.getOrCreateTrack(trackId);
        let source = this.sourceNodeMap.get(element);
        if (!source) {
            try {
                source = this.ctx.createMediaElementSource(element);
                this.sourceNodeMap.set(element, source);
            } catch (e) {
                console.warn('Failed to create media element source', e);
                return;
            }
        }
        try {
            source.disconnect();
        } catch (e) {}
        source.connect(chain.input);
        chain.source = source;
    }
    /**
     * Performs an offline analysis of an audio file to determine its "DNA" (RMS, Peak, Crest Factor).
     * Used by the AI to set accurate dynamic and loudness targets.
     */ async analyzeAudioBuffer(audioUrl) {
        try {
            console.log('[WebAudioEngine] Fetching audio for analysis...');
            const response = await fetch(audioUrl);
            const arrayBuffer = await response.arrayBuffer();
            // Use an OfflineAudioContext just to decode (or use main ctx)
            this.initContext();
            console.log('[WebAudioEngine] Decoding audio data...');
            const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
            const channelData = audioBuffer.getChannelData(0); // Analyze left/mono channel for speed
            let sumSquares = 0;
            let peak = 0;
            // Calculate RMS and Peak
            console.log('[WebAudioEngine] Calculating RMS and Peak...');
            const length = channelData.length;
            const step = Math.max(1, Math.floor(length / 441000)); // Sample every ~100ms to speed up analysis if huge, or just process all if fast
            // For true accuracy, process all samples, it's usually less than 100ms in a Wasm/V8 loop
            for(let i = 0; i < length; i += 1){
                const sample = channelData[i];
                const abs = Math.abs(sample);
                sumSquares += sample * sample;
                if (abs > peak) {
                    peak = abs;
                }
            }
            const rms = Math.sqrt(sumSquares / length);
            // Convert to dB
            const rmsDb = 20 * Math.log10(rms || 0.0001);
            const peakDb = 20 * Math.log10(peak || 0.0001);
            const crestFactor = peakDb - rmsDb; // Difference between peak and average
            console.log(`[WebAudioEngine] Analysis complete. RMS: ${rmsDb.toFixed(2)}dB, Peak: ${peakDb.toFixed(2)}dB, CF: ${crestFactor.toFixed(2)}dB`);
            return {
                rms: rmsDb,
                peak: peakDb,
                crestFactor: crestFactor
            };
        } catch (error) {
            console.error('[WebAudioEngine] Audio analysis failed:', error);
            return null;
        }
    }
    getVUMeterLevel(trackId) {
        const chain = this.trackChains.get(trackId);
        if (!chain) return 0;
        const dataArray = new Uint8Array(chain.analyser.frequencyBinCount);
        chain.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for(let i = 0; i < dataArray.length; i++){
            sum += dataArray[i];
        }
        return Math.floor(sum / dataArray.length * 1.5);
    }
    getFrequencyLevel(trackId, minFreq, maxFreq) {
        const chain = this.trackChains.get(trackId);
        if (!chain || !this.ctx) return 0;
        const bufferLength = chain.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        chain.analyser.getByteFrequencyData(dataArray);
        const nyquist = this.ctx.sampleRate / 2;
        const indexMin = Math.round(minFreq / nyquist * bufferLength);
        const indexMax = Math.round(maxFreq / nyquist * bufferLength);
        let sum = 0;
        let count = 0;
        for(let i = indexMin; i <= indexMax; i++){
            sum += dataArray[i];
            count++;
        }
        return count > 0 ? sum / count / 255 : 0;
    }
    getTrackAnalyser(trackId) {
        return this.trackChains.get(trackId)?.analyser;
    }
    // --- Plugin System ---
    updateGate(trackId, threshold, bypass) {
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.gate) {
            // Real noise gates are complex in WebAudio without script processors.
            // A compressor acts backwards (reduces loud, not quiet).
            // We'll leave the node for routing but keep it fully transparent.
            const gate = this.ctx.createDynamicsCompressor();
            gate.ratio.value = 1; // 1:1 ratio (no compression)
            gate.threshold.value = 0; // 0 dB 
            chain.gate = gate;
            // Route: input -> gate -> [eqBands] -> [compressor] -> [makeup] -> [limiter] -> panner
            chain.input.disconnect();
            chain.input.connect(gate);
            const nextNode = (chain.eqBands ? chain.eqBands[0] : null) || chain.compressor || chain.makeup || chain.limiter || chain.panner;
            gate.connect(nextNode);
        }
        // Always bypass to prevent volume destruction
        chain.gate.ratio.setTargetAtTime(1, this.ctx.currentTime, 0.1);
        chain.gate.threshold.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }
    updateEQ(trackId, highpass, tilt, sideGain, sideFreq, bypass) {
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.eqBands) {
            const low = this.ctx.createBiquadFilter();
            low.type = 'lowshelf';
            low.frequency.value = 80;
            const mid = this.ctx.createBiquadFilter();
            mid.type = 'peaking';
            mid.frequency.value = 1000;
            mid.Q.value = 0.5;
            const high = this.ctx.createBiquadFilter();
            high.type = 'highshelf';
            high.frequency.value = 6000;
            const presence = this.ctx.createBiquadFilter();
            presence.type = 'peaking';
            presence.frequency.value = 3500;
            presence.Q.value = 1.0;
            low.connect(mid);
            mid.connect(high);
            high.connect(presence);
            chain.eqBands = [
                low,
                mid,
                high,
                presence
            ];
            // Re-route
            const prevNode = chain.gate || chain.input;
            prevNode.disconnect();
            prevNode.connect(low);
            const nextNode = chain.compressor || chain.makeup || chain.limiter || chain.panner;
            presence.connect(nextNode);
        }
        const [low, mid, high, presence] = chain.eqBands;
        if (bypass) {
            low.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
            mid.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
            high.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
            presence.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
        } else {
            // Knob (0-100) Maps to (-12dB to +12dB). Neutral is 50.
            low.gain.setTargetAtTime((highpass - 50) * 0.24, this.ctx.currentTime, 0.1);
            mid.gain.setTargetAtTime((tilt - 50) * 0.24, this.ctx.currentTime, 0.1);
            high.gain.setTargetAtTime((sideGain - 50) * 0.24, this.ctx.currentTime, 0.1);
            // Presence (0-100) maps to (0dB to +6dB). Neutral is 0.
            presence.gain.setTargetAtTime(sideFreq / 100 * 6, this.ctx.currentTime, 0.1);
        }
    }
    updateCompressor(trackId, strength, attack, release, bypass) {
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.compressor) {
            chain.compressor = this.ctx.createDynamicsCompressor();
            // Re-route
            const prevNode = (chain.eqBands ? chain.eqBands[chain.eqBands.length - 1] : null) || chain.gate || chain.input;
            prevNode.disconnect();
            prevNode.connect(chain.compressor);
            const nextNode = chain.makeup || chain.limiter || chain.panner;
            chain.compressor.connect(nextNode);
        }
        if (bypass) {
            chain.compressor.ratio.setTargetAtTime(1, this.ctx.currentTime, 0.1);
        } else {
            // Strength (0-100) -> Threshold (-10 to -25dB), Ratio (1.2 to 4.0)
            const threshold = -10 - strength / 100 * 15;
            const ratio = 1.2 + strength / 100 * 2.8;
            chain.compressor.threshold.setTargetAtTime(threshold, this.ctx.currentTime, 0.1);
            chain.compressor.ratio.setTargetAtTime(ratio, this.ctx.currentTime, 0.1);
            chain.compressor.attack.setTargetAtTime(attack / 1000, this.ctx.currentTime, 0.1);
            chain.compressor.release.setTargetAtTime(release / 1000, this.ctx.currentTime, 0.1);
        }
    }
    updateLeveler(trackId, target, bypass) {
        // We use Leveler as the Makeup Gain before the Limiter!
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.makeup) {
            chain.makeup = this.ctx.createGain();
            const prevNode = chain.compressor || (chain.eqBands ? chain.eqBands[chain.eqBands.length - 1] : null) || chain.gate || chain.input;
            prevNode.disconnect();
            prevNode.connect(chain.makeup);
            const nextNode = chain.limiter || chain.panner;
            chain.makeup.connect(nextNode);
        }
        if (bypass) {
            chain.makeup.gain.setTargetAtTime(1, this.ctx.currentTime, 0.1);
        } else {
            // Target (0-100) maps to 0dB to +15dB of gain!
            // This gain pushes the signal into the limiter (Loudness Maximizer)
            const dbGain = target / 100 * 15; // 0 to +15 dB
            const gainValue = Math.pow(10, dbGain / 20);
            chain.makeup.gain.setTargetAtTime(gainValue, this.ctx.currentTime, 0.1);
        }
    }
    updateLimiter(trackId, strength, ceiling, bypass, useWasm = false) {
        const chain = this.getOrCreateTrack(trackId);
        if (useWasm) {
            if (!chain.wasmLimiter) {
                try {
                    chain.wasmLimiter = new AudioWorkletNode(this.ctx, 'phaselimiter-worklet');
                    const prevNode = chain.makeup || chain.compressor || (chain.eqBands ? chain.eqBands[chain.eqBands.length - 1] : null) || chain.gate || chain.input;
                    prevNode.disconnect();
                    prevNode.connect(chain.wasmLimiter);
                    chain.wasmLimiter.connect(chain.panner);
                    console.log("[WebAudioEngine] Routed through WASM Limiter.");
                } catch (e) {
                    console.warn("[WebAudioEngine] WASM Worklet not ready. Falling back to native limiter.", e);
                    useWasm = false;
                }
            }
            // Send parameter updates to the worklet
            if (chain.wasmLimiter) {
                const ceilingDb = -0.3 - strength / 100 * 2.7; // -0.3 to -3 dBFS
                chain.wasmLimiter.port.postMessage({
                    type: 'params',
                    ceiling: bypass ? 0 : ceilingDb,
                    strength: strength / 100,
                    bypass
                });
                return;
            }
        }
        // Disconnect WASM if it was connected and we're falling back
        if (chain.wasmLimiter) {
            chain.wasmLimiter.disconnect();
        }
        if (!chain.limiter) {
            chain.limiter = this.ctx.createDynamicsCompressor();
            chain.limiter.ratio.value = 50;
            chain.limiter.attack.value = 0.001;
            chain.limiter.release.value = 0.05;
            const prevNode = chain.makeup || chain.compressor || (chain.eqBands ? chain.eqBands[chain.eqBands.length - 1] : null) || chain.gate || chain.input;
            prevNode.disconnect();
            prevNode.connect(chain.limiter);
            chain.limiter.connect(chain.panner);
        }
        if (bypass) {
            chain.limiter.ratio.setTargetAtTime(1, this.ctx.currentTime, 0.1);
        } else {
            const threshold = ceiling - strength / 100 * 3;
            chain.limiter.threshold.setTargetAtTime(threshold, this.ctx.currentTime, 0.1);
        }
    }
    updateMultiband(trackId, lowStr, highStr, bypass) {
    // Placeholder for multiband - logic would require a splitter and multiple compressors
    // For now, let's just use it as a global tone shaper or additional compression
    }
}
const audioEngine = new WebAudioEngine();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/lib/audio-engine-bridge.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio/WebAudioEngine.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/Fader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Fader",
    ()=>Fader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useDAWStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$ui$2f$Slider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/ui/Slider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$VUMeter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/VUMeter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$SpectrumAnalyzer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/SpectrumAnalyzer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$PluginPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/PluginPicker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/power.js [app-client] (ecmascript) <export default as Power>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2d$engine$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio-engine-bridge.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio/WebAudioEngine.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
function Fader({ id }) {
    _s();
    const fader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "Fader.useDAWStore[fader]": (state)=>state.faders.find({
                "Fader.useDAWStore[fader]": (f)=>f.id === id
            }["Fader.useDAWStore[fader]"])
    }["Fader.useDAWStore[fader]"]);
    const setFaderValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "Fader.useDAWStore[setFaderValue]": (state)=>state.setFaderValue
    }["Fader.useDAWStore[setFaderValue]"]);
    const toggleSolo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "Fader.useDAWStore[toggleSolo]": (state)=>state.toggleSolo
    }["Fader.useDAWStore[toggleSolo]"]);
    const toggleMute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "Fader.useDAWStore[toggleMute]": (state)=>state.toggleMute
    }["Fader.useDAWStore[toggleMute]"]);
    const setPan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "Fader.useDAWStore[setPan]": (state)=>state.setPan
    }["Fader.useDAWStore[setPan]"]);
    const isFullMixer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "Fader.useDAWStore[isFullMixer]": (state)=>state.isFullMixer
    }["Fader.useDAWStore[isFullMixer]"]);
    const addInsert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "Fader.useDAWStore[addInsert]": (state)=>state.addInsert
    }["Fader.useDAWStore[addInsert]"]);
    const openPlugin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "Fader.useDAWStore[openPlugin]": (state)=>state.openPlugin
    }["Fader.useDAWStore[openPlugin]"]);
    const toggleInsertBypass = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "Fader.useDAWStore[toggleInsertBypass]": (state)=>state.toggleInsertBypass
    }["Fader.useDAWStore[toggleInsertBypass]"]);
    const [pickerOpen, setPickerOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [realLevel, setRealLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Sync with Audio Engine
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Fader.useEffect": ()=>{
            if (!fader) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].setTrackVolume(id, fader.value);
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].setTrackPan(id, fader.pan);
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].setTrackMute(id, fader.isMuted);
        }
    }["Fader.useEffect"], [
        id,
        fader?.value,
        fader?.pan,
        fader?.isMuted
    ]);
    if (!fader) return null;
    // Level Update Loop
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Fader.useEffect": ()=>{
            let animationFrameId;
            const updateLevel = {
                "Fader.useEffect.updateLevel": ()=>{
                    const level = __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].getVUMeterLevel(id);
                    setRealLevel(level);
                    animationFrameId = requestAnimationFrame(updateLevel);
                }
            }["Fader.useEffect.updateLevel"];
            updateLevel();
            return ({
                "Fader.useEffect": ()=>cancelAnimationFrame(animationFrameId)
            })["Fader.useEffect"];
        }
    }["Fader.useEffect"], [
        id
    ]);
    if (!fader) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center group transition-all duration-500", isFullMixer ? "w-24" : "w-16"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full h-16 mb-2 bg-black border border-white/5 rounded-sm overflow-hidden shadow-inner relative group-hover:border-white/10 transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$SpectrumAnalyzer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpectrumAnalyzer"], {
                        naked: true
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                        lineNumber: 61,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 bottom-0 h-[1px] bg-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                        lineNumber: 62,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                lineNumber: 60,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 gap-1 w-full mb-3 px-1 relative",
                children: [
                    [
                        0,
                        1,
                        2,
                        3
                    ].map((index)=>{
                        const insert = fader.inserts[index];
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative group/insert",
                            children: insert ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-0.5 h-5 w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleInsertBypass(id, insert.id),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-4 h-full rounded-l-[1px] border border-white/5 flex items-center justify-center transition-all", insert.bypass ? "bg-zinc-900 text-zinc-700" : "bg-cyan-900/40 text-cyan-400 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]"),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__["Power"], {
                                            size: 8
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                            lineNumber: 80,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                        lineNumber: 73,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>openPlugin(insert.id),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-r-[1px] bg-[#111] border-y border-r border-white/5 text-[7px] font-black transition-all tracking-tighter uppercase ring-1 ring-black flex items-center px-1.5", insert.bypass ? "text-white/10" : "text-white/60 hover:text-white hover:bg-[#222]"),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: insert.pluginId
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                            lineNumber: 89,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                        lineNumber: 82,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 72,
                                columnNumber: 33
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setPickerOpen(true),
                                className: "h-5 w-full rounded-[1px] bg-black/40 border border-dashed border-white/5 text-[6px] font-bold text-white/5 hover:text-white/20 hover:border-white/10 hover:bg-white/5 transition-all uppercase tracking-widest",
                                children: "Empty"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 93,
                                columnNumber: 33
                            }, this)
                        }, index, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                            lineNumber: 70,
                            columnNumber: 25
                        }, this);
                    }),
                    pickerOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$PluginPicker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PluginPicker"], {
                        onSelect: (pluginId)=>addInsert(id, pluginId),
                        onClose: ()=>setPickerOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                        lineNumber: 105,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                lineNumber: 66,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 items-center mb-6 w-full px-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-10 bg-black border border-white/10 rounded-sm flex flex-col items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,1)] mb-2 overflow-hidden relative group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-cyan-500/5 animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 117,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-mono text-cyan-400 tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]",
                                children: fader.pan === 0 ? 'C' : fader.pan > 0 ? `R${fader.pan}` : `L${Math.abs(fader.pan)}`
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 118,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-4/5 h-[1px] bg-white/5 mt-1"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 121,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[7px] font-mono text-white/20 mt-0.5 tracking-tighter uppercase",
                                children: "Stereo Out"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 122,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                        lineNumber: 116,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-1 w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>toggleSolo(id),
                                className: `h-7 rounded-sm text-[9px] font-black tracking-widest border transition-all duration-300 shadow-md ${fader.isSoloed ? 'bg-orange-500 border-orange-400 text-black shadow-[0_0_15px_rgba(249,115,22,0.5)] ring-1 ring-orange-300/50' : 'bg-neutral-900 border-white/5 text-white/30 hover:text-white/60 hover:bg-neutral-800'}`,
                                children: "S"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 126,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>toggleMute(id),
                                className: `h-7 rounded-sm text-[9px] font-black tracking-widest border transition-all duration-300 shadow-md ${fader.isMuted ? 'bg-red-600 border-red-500 text-black shadow-[0_0_15px_rgba(220,38,38,0.5)] ring-1 ring-red-400/50' : 'bg-neutral-900 border-white/5 text-white/30 hover:text-white/60 hover:bg-neutral-800'}`,
                                children: "M"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 132,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                        lineNumber: 125,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-1 w-full mt-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between w-full px-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[7px] font-black text-white/20",
                                        children: "L"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                        lineNumber: 143,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-[9px] font-mono font-black ${fader.pan === 0 ? 'text-cyan-400' : 'text-orange-400'}`,
                                        children: fader.pan === 0 ? 'C' : fader.pan > 0 ? `R${fader.pan}` : `L${Math.abs(fader.pan)}`
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                        lineNumber: 144,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[7px] font-black text-white/20",
                                        children: "R"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                        lineNumber: 147,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 142,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: -100,
                                max: 100,
                                step: 1,
                                value: fader.pan,
                                onChange: (e)=>setPan(id, parseInt(e.target.value)),
                                onDoubleClick: ()=>setPan(id, 0),
                                className: "w-full h-1 accent-cyan-400 cursor-pointer",
                                style: {
                                    background: fader.pan === 0 ? 'rgba(255,255,255,0.1)' : fader.pan > 0 ? `linear-gradient(to right, rgba(255,255,255,0.1) 50%, rgb(249,115,22) ${50 + fader.pan / 2}%, rgba(255,255,255,0.05) ${50 + fader.pan / 2}%)` : `linear-gradient(to right, rgba(255,255,255,0.05) ${50 + fader.pan / 2}%, rgb(6,182,212) ${50 + fader.pan / 2}%, rgba(255,255,255,0.1) 50%)`
                                }
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 149,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[6px] font-black text-white/10 uppercase tracking-widest",
                                children: "Pan  ·  dbl-click reset"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 166,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                        lineNumber: 141,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                lineNumber: 113,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-[300px] w-full bg-[#111] border-x border-[#222] flex shadow-inner group-hover:bg-[#141414] transition-colors rounded-t-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-1 inset-y-0 w-2 flex flex-col justify-between py-4 pointer-events-none z-0",
                        children: [
                            10,
                            5,
                            0,
                            -5,
                            -10,
                            -20,
                            -30,
                            -60
                        ].map((val, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full border-t border-silver-dark/40 relative",
                                children: (val === 0 || val === 10 || val === -60) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `absolute left-3 -top-2 text-[7px] font-mono ${val === 0 ? 'text-primary' : 'text-silver-dark'}`,
                                    children: val === -60 ? '-∞' : val
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                    lineNumber: 178,
                                    columnNumber: 33
                                }, this)
                            }, i, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 176,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                        lineNumber: 174,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute right-1 top-4 bottom-4 w-1.5 opacity-80 pointer-events-none z-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$VUMeter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VUMeter"], {
                            level: fader.isMuted ? 0 : realLevel,
                            className: "h-full w-full rounded-sm"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                            lineNumber: 188,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                        lineNumber: 187,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex justify-center z-10 w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-4 bottom-4 w-1.5 bg-black rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 194,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$ui$2f$Slider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slider"], {
                                orientation: "vertical",
                                min: 0,
                                max: 100,
                                value: fader.value,
                                onChange: (e)=>setFaderValue(id, parseInt(e.target.value)),
                                className: "h-full w-full cursor-grab active:cursor-grabbing transition-all duration-700 ease-in-out opacity-0 z-20",
                                style: {
                                    writingMode: 'vertical-lr',
                                    direction: 'rtl'
                                }
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 196,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute w-8 h-14 bg-[#CCCCCC] border-x border-[#999] shadow-[0_10px_30px_rgba(0,0,0,0.8),_inset_0_1px_4px_rgba(255,255,255,0.8)] rounded-[2px] pointer-events-none z-10 transition-all duration-700 ease-in-out flex flex-col items-center justify-center transform-gpu",
                                style: {
                                    bottom: `calc(${fader.value}% - 28px)`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                        lineNumber: 211,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-[3px] bg-black/60 shadow-[0_1px_2px_rgba(255,255,255,0.2)]"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                        lineNumber: 212,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-[4px] bg-gradient-to-b from-white/20 to-transparent mt-[1px]"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                        lineNumber: 213,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-auto mb-1 flex flex-col gap-[2px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-5 h-[1px] bg-black/20"
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                                lineNumber: 215,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-5 h-[1px] bg-black/20"
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                                lineNumber: 216,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                        lineNumber: 214,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                                lineNumber: 207,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                        lineNumber: 192,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                lineNumber: 171,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full min-h-[48px] bg-gradient-to-b from-[#DEDEDE] to-[#B0B0B0] mt-1 rounded-b-md flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.8),_0_5px_15px_rgba(0,0,0,0.3)] border-b border-black/40 border-x border-black/20 px-1 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-mono text-[10px] font-black text-black/80 tracking-widest uppercase text-center break-words leading-tight",
                    children: fader.label
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                    lineNumber: 225,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
                lineNumber: 224,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/Fader.tsx",
        lineNumber: 57,
        columnNumber: 9
    }, this);
}
_s(Fader, "KxgXpM8CqFp8lfFuSqNdz93AP2A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"]
    ];
});
_c = Fader;
var _c;
__turbopack_context__.k.register(_c, "Fader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AudioTimeline",
    ()=>AudioTimeline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scissors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scissors$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/scissors.js [app-client] (ecmascript) <export default as Scissors>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mouse$2d$pointer$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MousePointer2$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/mouse-pointer-2.js [app-client] (ecmascript) <export default as MousePointer2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2d$engine$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio-engine-bridge.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio/WebAudioEngine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useDAWStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function AudioTimeline() {
    _s();
    const tracks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "AudioTimeline.useDAWStore[tracks]": (state)=>state.tracks
    }["AudioTimeline.useDAWStore[tracks]"]);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [playhead, setPlayhead] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0); // seconds
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Timeline scale (pixels per second)
    const pixelsPerSecond = 50;
    const timelineDuration = 180; // 3 minutes total for now
    const timelineWidth = timelineDuration * pixelsPerSecond;
    // Mock clips for visualization
    const [clips, setClips] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: 'c1',
            trackId: 't1',
            startTime: 5,
            duration: 15,
            color: '#00F0FF',
            name: 'vocal_take_1.wav'
        },
        {
            id: 'c2',
            trackId: 't2',
            startTime: 0,
            duration: 60,
            color: '#FF6B00',
            name: 'beat_render.wav'
        }
    ]);
    const [draggingClip, setDraggingClip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragOffset, setDragOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // --- Playhead Animation Loop ---
    const loop = ()=>{
        if (isPlaying) {
            setPlayhead(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].getPlayheadPosition());
        }
        animationRef.current = requestAnimationFrame(loop);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AudioTimeline.useEffect": ()=>{
            animationRef.current = requestAnimationFrame(loop);
            return ({
                "AudioTimeline.useEffect": ()=>{
                    if (animationRef.current) cancelAnimationFrame(animationRef.current);
                }
            })["AudioTimeline.useEffect"];
        }
    }["AudioTimeline.useEffect"], [
        isPlaying
    ]);
    const togglePlay = ()=>{
        if (isPlaying) {
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].pause();
            setIsPlaying(false);
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].play();
            setIsPlaying(true);
        }
    };
    // --- Drag and Drop Logic ---
    const handleMouseDown = (e, clip)=>{
        e.stopPropagation();
        setDraggingClip(clip.id);
        // Calculate where inside the clip we clicked (in pixels)
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        setDragOffset(offsetX);
    };
    const handleMouseMove = (e)=>{
        if (!draggingClip || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        // Calculate new X position relative to container, accounting for scroll
        const newX = e.clientX - containerRect.left + containerRef.current.scrollLeft - dragOffset;
        // Convert X pixels back to seconds
        const newStartTime = Math.max(0, newX / pixelsPerSecond);
        setClips((prev)=>prev.map((c)=>c.id === draggingClip ? {
                    ...c,
                    startTime: newStartTime
                } : c));
    };
    const handleMouseUp = ()=>{
        if (draggingClip) {
            // Inform the engine of the final move
            const clip = clips.find((c)=>c.id === draggingClip);
            if (clip) {
                __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].moveAudioClip(clip.id, clip.startTime);
            }
            setDraggingClip(null);
        }
    };
    // --- Timeline Click (Move Playhead) ---
    const handleTimelineClick = (e)=>{
        if (!containerRef.current || draggingClip) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - containerRect.left + containerRef.current.scrollLeft;
        const newTime = clickX / pixelsPerSecond;
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].setPlayheadPosition(newTime);
        setPlayhead(newTime);
    };
    // --- Waveform Rendering ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AudioTimeline.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            clips.forEach({
                "AudioTimeline.useEffect": (clip)=>{
                    const x = clip.startTime * pixelsPerSecond;
                    const width = clip.duration * pixelsPerSecond;
                    // Get mock waveform from engine
                    const waveform = __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].getWaveformData(clip.id, Math.floor(width));
                    ctx.beginPath();
                    ctx.strokeStyle = clip.color;
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(x, 25); // Center line (assuming 50px height track)
                    for(let i = 0; i < width; i++){
                        // Waveform values are 0-1, map to -20 to 20 pixels amplitude
                        const amplitude = (waveform[i] - 0.5) * 40;
                        ctx.lineTo(x + i, 25 + amplitude);
                    }
                    ctx.stroke();
                }
            }["AudioTimeline.useEffect"]);
        }
    }["AudioTimeline.useEffect"], [
        clips,
        pixelsPerSecond
    ]);
    if (tracks.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 flex flex-col items-center justify-center h-full text-center p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 bg-white/5 animate-pulse",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-4 h-4 rounded-full bg-cyan-glow shadow-[0_0_10px_#00F0FF]"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                        lineNumber: 153,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                    lineNumber: 152,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-white font-bold tracking-widest text-sm mb-2 uppercase",
                    children: "Espacio de Trabajo Limpio"
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                    lineNumber: 155,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-silver-dark text-xs max-w-xs leading-relaxed",
                    children: "Dile a John en el chat qué quieres crear y él abrirá los tracks mágicamente..."
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                    lineNumber: 156,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
            lineNumber: 151,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col w-full h-full bg-[#18181A] border border-[#222] shadow-[inset_0_5px_20px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden font-mono select-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-10 border-b border-[#222] bg-[#111113] flex items-center px-4 gap-4 shadow-sm z-20 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: togglePlay,
                        className: `w-8 h-8 rounded flex items-center justify-center transition-colors ${isPlaying ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow' : 'hover:bg-[#222] text-[#AAA]'}`,
                        children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                            size: 14,
                            fill: "currentColor"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                            lineNumber: 169,
                            columnNumber: 34
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                            size: 14,
                            fill: "currentColor",
                            className: "ml-0.5"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                            lineNumber: 169,
                            columnNumber: 76
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                        lineNumber: 168,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-px h-4 bg-[#333]"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                        lineNumber: 172,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "w-8 h-8 rounded flex items-center justify-center hover:bg-[#222] text-[#AAA] active:text-cyan-glow",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mouse$2d$pointer$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MousePointer2$3e$__["MousePointer2"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                    lineNumber: 176,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                lineNumber: 175,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "w-8 h-8 rounded flex items-center justify-center hover:bg-[#222] text-[#AAA] active:text-red-500",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scissors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scissors$3e$__["Scissors"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                    lineNumber: 179,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                lineNumber: 178,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                        lineNumber: 174,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-auto text-cyan-glow text-xs font-bold tracking-widest bg-black px-3 py-1 rounded shadow-inner border border-[#222]",
                        children: [
                            Math.floor(playhead / 60).toString().padStart(2, '0'),
                            ":",
                            Math.floor(playhead % 60).toString().padStart(2, '0'),
                            ".",
                            Math.floor(playhead % 1 * 100).toString().padStart(2, '0')
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                        lineNumber: 183,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                lineNumber: 167,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: containerRef,
                className: "flex-1 overflow-auto relative cursor-text",
                onMouseMove: handleMouseMove,
                onMouseUp: handleMouseUp,
                onMouseLeave: handleMouseUp,
                onClick: handleTimelineClick,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: `${timelineWidth}px`,
                            height: '100%'
                        },
                        className: "relative bg-[#1A1A1C]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-0 left-0 w-full h-6 border-b border-[#2A2A2D] bg-[#111] opacity-90 z-10 flex",
                                children: Array.from({
                                    length: timelineDuration
                                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-full border-l border-[#333] relative",
                                        style: {
                                            width: `${pixelsPerSecond}px`
                                        },
                                        children: i % 5 === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute top-1 left-1 text-[8px] text-[#666]",
                                            children: [
                                                i,
                                                "s"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                            lineNumber: 206,
                                            columnNumber: 49
                                        }, this)
                                    }, `ruler-${i}`, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                        lineNumber: 205,
                                        columnNumber: 29
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                lineNumber: 203,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-6 left-0 w-full bottom-0 flex pointer-events-none opacity-20",
                                children: Array.from({
                                    length: timelineDuration
                                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-full border-l border-[#444]",
                                        style: {
                                            width: `${pixelsPerSecond}px`
                                        }
                                    }, `grid-${i}`, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                        lineNumber: 214,
                                        columnNumber: 29
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                lineNumber: 212,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-6 left-0 w-full flex flex-col pt-2 gap-1 pb-4",
                                children: tracks.map((track, trackIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-[60px] w-full bg-[#202022] border-y border-[#18181A] relative shadow-inner",
                                        children: [
                                            trackIndex === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                                                ref: canvasRef,
                                                width: timelineWidth,
                                                height: 60,
                                                className: "absolute inset-0 pointer-events-none opacity-60 mix-blend-screen",
                                                style: {
                                                    top: 0
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                                lineNumber: 224,
                                                columnNumber: 37
                                            }, this),
                                            clips.filter((c)=>c.trackId === track.id).map((clip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    onMouseDown: (e)=>handleMouseDown(e, clip),
                                                    className: `absolute top-1 bottom-1 rounded-sm border-2 cursor-grab active:cursor-grabbing backdrop-blur-sm transition-shadow ${draggingClip === clip.id ? 'z-20 shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-white/80' : 'z-10 shadow-sm'}`,
                                                    style: {
                                                        left: `${clip.startTime * pixelsPerSecond}px`,
                                                        width: `${clip.duration * pixelsPerSecond}px`,
                                                        backgroundColor: `${clip.color}20`,
                                                        borderColor: `${clip.color}80`
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-[#111]/80 px-1 py-0.5 text-[8px] truncate text-[#AAA] rounded-br-sm inline-block max-w-full",
                                                            children: clip.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                                            lineNumber: 246,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute top-0 left-0 w-2 h-2 bg-white/50 clip-path-triangle-tl opacity-0 hover:opacity-100 transition-opacity cursor-ew-resize"
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                                            lineNumber: 249,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute top-0 right-0 w-2 h-2 bg-white/50 clip-path-triangle-tr opacity-0 hover:opacity-100 transition-opacity cursor-ew-resize"
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                                            lineNumber: 250,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, clip.id, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 37
                                                }, this))
                                        ]
                                    }, track.id, true, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                        lineNumber: 221,
                                        columnNumber: 29
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                                lineNumber: 219,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                        lineNumber: 200,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-0 bottom-0 w-px bg-yellow-400 z-30 pointer-events-none shadow-[0_0_10px_rgba(250,204,21,0.8)]",
                        style: {
                            left: `${playhead * pixelsPerSecond}px`
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute -top-1 -left-1.5 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-yellow-400"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                            lineNumber: 264,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                        lineNumber: 260,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
                lineNumber: 191,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/AudioTimeline.tsx",
        lineNumber: 164,
        columnNumber: 9
    }, this);
}
_s(AudioTimeline, "kSpISTfWsLIrDrdFAetQ89kZuVc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"]
    ];
});
_c = AudioTimeline;
var _c;
__turbopack_context__.k.register(_c, "AudioTimeline");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StudioChat",
    ()=>StudioChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/wand-sparkles.js [app-client] (ecmascript) <export default as Wand2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$vocal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic2$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/mic-vocal.js [app-client] (ecmascript) <export default as Mic2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scissors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scissors$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/scissors.js [app-client] (ecmascript) <export default as Scissors>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/circle-play.js [app-client] (ecmascript) <export default as PlayCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/mic.js [app-client] (ecmascript) <export default as Mic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MicOff$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/mic-off.js [app-client] (ecmascript) <export default as MicOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-client] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useDAWStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function StudioChat({ embedded = false, songName, onExecuteMastering }) {
    _s();
    const addTrack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "StudioChat.useDAWStore[addTrack]": (state)=>state.addTrack
    }["StudioChat.useDAWStore[addTrack]"]);
    const setTracks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "StudioChat.useDAWStore[setTracks]": (state)=>state.setTracks
    }["StudioChat.useDAWStore[setTracks]"]);
    const clearTracks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "StudioChat.useDAWStore[clearTracks]": (state)=>state.clearTracks
    }["StudioChat.useDAWStore[clearTracks]"]);
    const tracks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "StudioChat.useDAWStore[tracks]": (state)=>state.tracks
    }["StudioChat.useDAWStore[tracks]"]);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StudioChat.useEffect": ()=>{
            const greeting = songName ? `¿Necesitas ayuda con tu master de "${songName}"? Aquí estoy listo para ayudarte.` : '¡Estamos en el studio! El plan está listo. ¿Quieres que genere la primera mitad de los instrumentos o prefieres grabar algo tú primero?';
            setMessages([
                {
                    role: 'assistant',
                    content: greeting
                }
            ]);
        }
    }["StudioChat.useEffect"], [
        songName
    ]);
    const [isTyping, setIsTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isListening, setIsListening] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSpeaking, setIsSpeaking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const recognitionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StudioChat.useEffect": ()=>{
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }
    }["StudioChat.useEffect"], [
        messages
    ]);
    // Initialize Speech Recognition
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StudioChat.useEffect": ()=>{
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = false;
                recognition.lang = 'es-ES';
                recognition.onresult = ({
                    "StudioChat.useEffect": (event)=>{
                        const transcript = event.results[event.results.length - 1][0].transcript;
                        if (transcript.trim()) {
                            handleVoiceInput(transcript);
                        }
                    }
                })["StudioChat.useEffect"];
                recognition.onerror = ({
                    "StudioChat.useEffect": (event)=>{
                        console.error('Speech recognition error', event.error);
                        setIsListening(false);
                    }
                })["StudioChat.useEffect"];
                recognition.onend = ({
                    "StudioChat.useEffect": ()=>{
                        if (isListening) recognition.start(); // Auto-restart if it should be listening
                    }
                })["StudioChat.useEffect"];
                recognitionRef.current = recognition;
            }
        }
    }["StudioChat.useEffect"], [
        isListening
    ]);
    const playJohnVoice = async (text)=>{
        try {
            setIsSpeaking(true);
            const response = await fetch('/api/ai/tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text
                })
            });
            if (!response.ok) throw new Error('Failed to fetch voice');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
            } else {
                const audio = new Audio(url);
                audioRef.current = audio;
                audio.play();
            }
            audioRef.current.onended = ()=>{
                setIsSpeaking(false);
                URL.revokeObjectURL(url);
            };
        } catch (error) {
            console.error('TTS Error:', error);
            setIsSpeaking(false);
        }
    };
    const triggerGeneration = ()=>{
        setIsTyping(true);
        setTimeout(()=>{
            const demoTracks = [
                {
                    id: 't-beat',
                    name: 'Dark Trap Beat (AI)',
                    color: '#FF6B00'
                },
                {
                    id: 't-808',
                    name: 'Heavy 808 Sub',
                    color: '#B026FF'
                },
                {
                    id: 't-melody',
                    name: 'Dark Piano Melody',
                    color: '#00F0FF'
                },
                {
                    id: 't-perch',
                    name: 'Percussion Loop',
                    color: '#A4ECA1'
                }
            ];
            setTracks(demoTracks);
            const msg = "¡Listo! He abierto los tracks en el espacio de trabajo como por arte de magia. He configurado la batería, el bajo y la melodía principal. ¿Escuchamos esta primera parte?";
            setMessages((prev)=>[
                    ...prev,
                    {
                        role: 'assistant',
                        content: msg
                    }
                ]);
            setIsTyping(false);
            playJohnVoice(msg);
        }, 1500);
    };
    const handleSend = async (forcedInput)=>{
        const textToSend = forcedInput || input;
        if (!textToSend.trim() || isTyping) return;
        setInput('');
        setMessages((prev)=>[
                ...prev,
                {
                    role: 'user',
                    content: textToSend
                }
            ]);
        const lowInput = textToSend.toLowerCase();
        if (lowInput.includes('genera') || lowInput.includes('mitad') || lowInput.includes('abre')) {
            triggerGeneration();
            return;
        }
        if ((lowInput.includes('masteriza') || lowInput.includes('arregla') || lowInput.includes('aplica el adn')) && onExecuteMastering) {
            setIsTyping(true);
            setTimeout(()=>{
                onExecuteMastering();
                const msg = "¡Claro que sí! Estoy analizando el ADN de tu mezcla ahora mismo. Voy a aplicar mi configuración Gold Standard para que suene con todo el peso de Da Graba Studio. ¡Mira cómo se mueven los equipos!";
                setMessages((prev)=>[
                        ...prev,
                        {
                            role: 'assistant',
                            content: msg
                        }
                    ]);
                setIsTyping(false);
                playJohnVoice(msg);
            }, 1000);
            return;
        }
        setIsTyping(true);
        try {
            const history = messages.map((m)=>({
                    role: m.role,
                    content: m.content
                }));
            const response = await fetch('/api/ai/engineer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: textToSend,
                    history
                })
            });
            if (!response.ok) throw new Error('Failed to fetch AI response');
            const data = await response.json();
            const aiMessage = data.message;
            setMessages((prev)=>[
                    ...prev,
                    {
                        role: 'assistant',
                        content: aiMessage
                    }
                ]);
            setIsTyping(false);
            playJohnVoice(aiMessage);
        } catch (error) {
            console.error('AI Error:', error);
            const errorMsg = "Lo siento, John tiene problemas de conexión ahora mismo. Pero sigo aquí.";
            setMessages((prev)=>[
                    ...prev,
                    {
                        role: 'assistant',
                        content: errorMsg
                    }
                ]);
            setIsTyping(false);
        }
    };
    const handleVoiceInput = (transcript)=>{
        handleSend(transcript);
    };
    const toggleListening = ()=>{
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: embedded ? "w-full h-full" : `fixed right-8 bottom-32 z-50 transition-all duration-500 flex flex-col items-end ${isOpen ? 'w-80 h-[450px]' : 'w-12 h-12'}`,
        children: [
            !embedded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleListening,
                        className: `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isListening ? 'bg-red-500 animate-pulse glow-red' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`,
                        children: isListening ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                            className: "text-white",
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                            lineNumber: 218,
                            columnNumber: 40
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MicOff$3e$__["MicOff"], {
                            className: "text-silver-dark",
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                            lineNumber: 218,
                            columnNumber: 83
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                        lineNumber: 214,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsOpen(!isOpen),
                        className: `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isOpen ? 'bg-orange-600 scale-90' : 'bg-gradient-to-br from-cyan-glow to-blue-600 glow-cyan hover:scale-110'}`,
                        children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            className: "text-white"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                            lineNumber: 225,
                            columnNumber: 35
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                            className: "text-white"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                            lineNumber: 225,
                            columnNumber: 77
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                        lineNumber: 221,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                lineNumber: 213,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${embedded ? 'w-full h-full' : 'mt-4 w-full h-full'} bg-[#0B1015]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${embedded || isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        size: 16,
                                        className: "text-cyan-glow"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 236,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold tracking-widest text-[#E0E0E0]",
                                        children: "ENGINEER FEEDBACK"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 237,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 235,
                                columnNumber: 21
                            }, this),
                            isSpeaking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                size: 14,
                                className: "text-cyan-glow animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 239,
                                columnNumber: 36
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                        lineNumber: 234,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: scrollRef,
                        className: "flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar",
                        children: [
                            messages.map((m, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-orange-600/20 border border-orange-500/30 text-white' : 'bg-white/5 border border-white/10 text-silver-light'}`,
                                        children: m.content
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 246,
                                        columnNumber: 29
                                    }, this)
                                }, i, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                    lineNumber: 245,
                                    columnNumber: 25
                                }, this)),
                            isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-1 ml-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 256,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce [animation-delay:0.2s]"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 257,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce [animation-delay:0.4s]"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 258,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 255,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                        lineNumber: 243,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 py-2 flex gap-2 overflow-x-auto border-t border-white/5 bg-black/20 no-scrollbar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: triggerGeneration,
                                className: "whitespace-nowrap flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-silver-dark hover:text-cyan-glow transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wand2$3e$__["Wand2"], {
                                        size: 10
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 269,
                                        columnNumber: 25
                                    }, this),
                                    " Generar Mitad"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 265,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "whitespace-nowrap flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-silver-dark hover:text-white transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__["PlayCircle"], {
                                        size: 10
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 272,
                                        columnNumber: 25
                                    }, this),
                                    " Continuar"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 271,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: clearTracks,
                                className: "whitespace-nowrap flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-red-400 hover:text-red-300 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scissors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scissors$3e$__["Scissors"], {
                                        size: 10
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 278,
                                        columnNumber: 25
                                    }, this),
                                    " Limpiar Todo"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 274,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "whitespace-nowrap flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-silver-dark hover:text-white transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$vocal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic2$3e$__["Mic2"], {
                                        size: 10
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 281,
                                        columnNumber: 25
                                    }, this),
                                    " Grabar Hum"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 280,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                        lineNumber: 264,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-3 bg-black/40 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: input,
                                onChange: (e)=>setInput(e.target.value),
                                onKeyDown: (e)=>e.key === 'Enter' && handleSend(),
                                placeholder: isListening ? "Te escucho..." : "Dime qué sigue...",
                                className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-glow/50 transition-colors"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 287,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleSend(),
                                className: "p-2 bg-orange-600 rounded-lg hover:bg-orange-500 transition-colors shadow-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                    size: 14,
                                    className: "text-white"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                    lineNumber: 299,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 295,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                        lineNumber: 286,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                lineNumber: 231,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
        lineNumber: 209,
        columnNumber: 9
    }, this);
}
_s(StudioChat, "DY5v0YCst+emMZ6F2R0np1g/bUY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"]
    ];
});
_c = StudioChat;
var _c;
__turbopack_context__.k.register(_c, "StudioChat");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MasteringKnob",
    ()=>MasteringKnob
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function MasteringKnob({ label, value, onChange, size = 'md' }) {
    // Calculate rotation (-135deg to +135deg for a standard 270 degree sweep)
    const rotation = -135 + value / 100 * 270;
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-3",
        onMouseDown: (e)=>{
            const startY = e.clientY;
            const startValue = value;
            const handleMouseMove = (moveEvent)=>{
                const deltaY = startY - moveEvent.clientY;
                const newValue = Math.min(100, Math.max(0, startValue + deltaY));
                if (onChange) onChange(newValue);
            };
            const handleMouseUp = ()=>{
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = 'default';
            };
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ns-resize';
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${sizeClasses[size]} rounded-full bg-[#1A1A1A] p-1 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_2px_4px_rgba(255,255,255,0.05)] relative flex items-center justify-center`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full h-full rounded-full bg-gradient-to-b from-[#333] to-[#111] shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_2px_1px_rgba(255,255,255,0.2)] relative cursor-ns-resize group transition-transform duration-500 ease-out",
                    style: {
                        transform: `rotate(${rotation}deg)`
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1/4 bg-white/80 rounded-full shadow-[0_0_2px_rgba(255,255,255,0.5)] group-hover:bg-cyan-glow group-hover:shadow-[0_0_5px_rgba(0,240,255,0.8)] transition-colors"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx",
                        lineNumber: 53,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx",
                    lineNumber: 48,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx",
                lineNumber: 45,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[10px] font-bold tracking-widest text-[#888] uppercase select-none",
                children: label
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx",
                lineNumber: 58,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx",
        lineNumber: 21,
        columnNumber: 9
    }, this);
}
_c = MasteringKnob;
var _c;
__turbopack_context__.k.register(_c, "MasteringKnob");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/plugins/GateModule.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GateModule",
    ()=>GateModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx [app-client] (ecmascript)");
'use client';
;
;
function GateModule({ settings, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-8 p-4 justify-around items-center bg-[#303030] rounded-lg border border-[#3A3A3A] shadow-inner min-h-[180px] w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "THRES",
                value: settings.gateThreshold,
                onChange: (v)=>onChange({
                        gateThreshold: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/GateModule.tsx",
                lineNumber: 18,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "ATTACK",
                value: settings.gateAttack,
                onChange: (v)=>onChange({
                        gateAttack: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/GateModule.tsx",
                lineNumber: 24,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "RELEASE",
                value: settings.gateRelease,
                onChange: (v)=>onChange({
                        gateRelease: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/GateModule.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/GateModule.tsx",
        lineNumber: 17,
        columnNumber: 9
    }, this);
}
_c = GateModule;
var _c;
__turbopack_context__.k.register(_c, "GateModule");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/plugins/EQModule.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EQModule",
    ()=>EQModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx [app-client] (ecmascript)");
'use client';
;
;
function EQModule({ settings, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-8 p-4 justify-around items-center bg-[#303030] rounded-lg border border-[#3A3A3A] shadow-inner min-h-[180px] w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "HI-PASS",
                value: settings.eqHighpass,
                onChange: (v)=>onChange({
                        eqHighpass: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/EQModule.tsx",
                lineNumber: 19,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "TILT",
                value: settings.eqTilt,
                onChange: (v)=>onChange({
                        eqTilt: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/EQModule.tsx",
                lineNumber: 25,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "SIDE GAIN",
                value: settings.eqSideGain,
                onChange: (v)=>onChange({
                        eqSideGain: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/EQModule.tsx",
                lineNumber: 31,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "SIDE FREQ",
                value: settings.eqSideFreq,
                onChange: (v)=>onChange({
                        eqSideFreq: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/EQModule.tsx",
                lineNumber: 37,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/EQModule.tsx",
        lineNumber: 18,
        columnNumber: 9
    }, this);
}
_c = EQModule;
var _c;
__turbopack_context__.k.register(_c, "EQModule");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/plugins/CompressorModule.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CompressorModule",
    ()=>CompressorModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx [app-client] (ecmascript)");
'use client';
;
;
function CompressorModule({ settings, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-8 p-4 justify-around items-center bg-[#303030] rounded-lg border border-[#3A3A3A] shadow-inner min-h-[180px] w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "STRENGTH",
                value: settings.compStrength,
                onChange: (v)=>onChange({
                        compStrength: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/CompressorModule.tsx",
                lineNumber: 19,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "ATTACK",
                value: settings.compAttack,
                onChange: (v)=>onChange({
                        compAttack: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/CompressorModule.tsx",
                lineNumber: 25,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "RELEASE",
                value: settings.compRelease,
                onChange: (v)=>onChange({
                        compRelease: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/CompressorModule.tsx",
                lineNumber: 31,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "MAKEUP",
                value: settings.compMakeup,
                onChange: (v)=>onChange({
                        compMakeup: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/CompressorModule.tsx",
                lineNumber: 37,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/CompressorModule.tsx",
        lineNumber: 18,
        columnNumber: 9
    }, this);
}
_c = CompressorModule;
var _c;
__turbopack_context__.k.register(_c, "CompressorModule");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MultibandModule",
    ()=>MultibandModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx [app-client] (ecmascript)");
'use client';
;
;
function MultibandModule({ settings, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-8 p-4 justify-around items-center bg-[#303030] rounded-lg border border-[#3A3A3A] shadow-inner min-h-[180px] w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-4 border-r border-white/5 pr-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[8px] text-white/30 uppercase font-black tracking-widest",
                        children: "Low Bands"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx",
                        lineNumber: 20,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                label: "STR",
                                value: settings.mbStrengthLow,
                                onChange: (v)=>onChange({
                                        mbStrengthLow: v
                                    }),
                                size: "md"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx",
                                lineNumber: 22,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                label: "CROSS",
                                value: settings.mbCrossoverLow,
                                onChange: (v)=>onChange({
                                        mbCrossoverLow: v
                                    }),
                                size: "md"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx",
                                lineNumber: 23,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx",
                        lineNumber: 21,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx",
                lineNumber: 19,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[8px] text-white/30 uppercase font-black tracking-widest",
                        children: "High Bands"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx",
                        lineNumber: 27,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                label: "STR",
                                value: settings.mbStrengthHigh,
                                onChange: (v)=>onChange({
                                        mbStrengthHigh: v
                                    }),
                                size: "md"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx",
                                lineNumber: 29,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                label: "CROSS",
                                value: settings.mbCrossoverHigh,
                                onChange: (v)=>onChange({
                                        mbCrossoverHigh: v
                                    }),
                                size: "md"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx",
                                lineNumber: 30,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx",
                        lineNumber: 28,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx",
                lineNumber: 26,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx",
        lineNumber: 18,
        columnNumber: 9
    }, this);
}
_c = MultibandModule;
var _c;
__turbopack_context__.k.register(_c, "MultibandModule");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/plugins/LimiterModule.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LimiterModule",
    ()=>LimiterModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx [app-client] (ecmascript)");
'use client';
;
;
function LimiterModule({ settings, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-8 p-4 justify-around items-center bg-[#303030] rounded-lg border border-[#3A3A3A] shadow-inner min-h-[180px] w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "STRENGTH",
                value: settings.limStrength,
                onChange: (v)=>onChange({
                        limStrength: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/LimiterModule.tsx",
                lineNumber: 19,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "ATTACK",
                value: settings.limAttack,
                onChange: (v)=>onChange({
                        limAttack: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/LimiterModule.tsx",
                lineNumber: 25,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "RELEASE",
                value: settings.limRelease,
                onChange: (v)=>onChange({
                        limRelease: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/LimiterModule.tsx",
                lineNumber: 31,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "CEILING",
                value: settings.limCeiling,
                onChange: (v)=>onChange({
                        limCeiling: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/LimiterModule.tsx",
                lineNumber: 37,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/LimiterModule.tsx",
        lineNumber: 18,
        columnNumber: 9
    }, this);
}
_c = LimiterModule;
var _c;
__turbopack_context__.k.register(_c, "LimiterModule");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/plugins/LevelerModule.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LevelerModule",
    ()=>LevelerModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx [app-client] (ecmascript)");
'use client';
;
;
function LevelerModule({ settings, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-8 p-4 justify-around items-center bg-[#303030] rounded-lg border border-[#3A3A3A] shadow-inner min-h-[180px] w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "TARGET LUFS",
                value: settings.levelerTarget,
                onChange: (v)=>onChange({
                        levelerTarget: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/LevelerModule.tsx",
                lineNumber: 19,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "BRAKE",
                value: settings.levelerBrake,
                onChange: (v)=>onChange({
                        levelerBrake: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/LevelerModule.tsx",
                lineNumber: 25,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "MAX +",
                value: settings.levelerMaxPlus,
                onChange: (v)=>onChange({
                        levelerMaxPlus: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/LevelerModule.tsx",
                lineNumber: 31,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                label: "MAX -",
                value: settings.levelerMaxMinus,
                onChange: (v)=>onChange({
                        levelerMaxMinus: v
                    }),
                size: "lg"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/LevelerModule.tsx",
                lineNumber: 37,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/LevelerModule.tsx",
        lineNumber: 18,
        columnNumber: 9
    }, this);
}
_c = LevelerModule;
var _c;
__turbopack_context__.k.register(_c, "LevelerModule");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReverbModule",
    ()=>ReverbModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function KnobRow({ label, param, value, min, max, unit, onChange }) {
    const pct = (value - min) / (max - min) * 100;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-16 h-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: "0 0 100 100",
                        className: "w-full h-full -rotate-[135deg]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "50",
                                cy: "50",
                                r: "40",
                                fill: "none",
                                stroke: "#1a1a1a",
                                strokeWidth: "8",
                                strokeDasharray: "188 251",
                                strokeLinecap: "round"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                                lineNumber: 19,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "50",
                                cy: "50",
                                r: "40",
                                fill: "none",
                                stroke: "#06b6d4",
                                strokeWidth: "8",
                                strokeDasharray: `${pct * 1.88} 251`,
                                strokeLinecap: "round",
                                style: {
                                    filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.6))'
                                }
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                                lineNumber: 20,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                        lineNumber: 18,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[10px] font-mono text-cyan-400 font-bold",
                            children: [
                                Math.round(value),
                                unit
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                            lineNumber: 25,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                        lineNumber: 24,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "range",
                min: min,
                max: max,
                step: 1,
                value: value,
                onChange: (e)=>onChange(param, Number(e.target.value)),
                className: "w-14 h-1 accent-cyan-400 opacity-0 absolute cursor-pointer",
                style: {
                    width: '64px',
                    height: '64px',
                    top: 0,
                    position: 'absolute',
                    borderRadius: '50%'
                }
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "range",
                min: min,
                max: max,
                step: 1,
                value: value,
                onChange: (e)=>onChange(param, Number(e.target.value)),
                className: "w-full h-1 accent-cyan-400 mt-1 cursor-pointer"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                lineNumber: 35,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[9px] font-black text-white/40 uppercase tracking-widest",
                children: label
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                lineNumber: 39,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
        lineNumber: 16,
        columnNumber: 9
    }, this);
}
_c = KnobRow;
function ReverbModule({ settings, onChange }) {
    const roomSize = settings.roomSize ?? 50;
    const damping = settings.damping ?? 50;
    const wet = settings.wet ?? 40;
    const handle = (param, val)=>onChange({
            ...settings,
            [param]: val
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[9px] font-black text-cyan-400/60 uppercase tracking-[0.3em]",
                        children: "Room Acoustics"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                        lineNumber: 54,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1 flex-1 ml-4 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                        lineNumber: 55,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                lineNumber: 53,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KnobRow, {
                        label: "Room",
                        param: "roomSize",
                        value: roomSize,
                        min: 0,
                        max: 100,
                        unit: "%",
                        onChange: handle
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                        lineNumber: 58,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KnobRow, {
                        label: "Damping",
                        param: "damping",
                        value: damping,
                        min: 0,
                        max: 100,
                        unit: "%",
                        onChange: handle
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                        lineNumber: 59,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KnobRow, {
                        label: "Wet/Dry",
                        param: "wet",
                        value: wet,
                        min: 0,
                        max: 100,
                        unit: "%",
                        onChange: handle
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                        lineNumber: 60,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
                lineNumber: 57,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx",
        lineNumber: 52,
        columnNumber: 9
    }, this);
}
_c1 = ReverbModule;
var _c, _c1;
__turbopack_context__.k.register(_c, "KnobRow");
__turbopack_context__.k.register(_c1, "ReverbModule");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DelayModule",
    ()=>DelayModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function DelayModule({ settings, onChange }) {
    const time = settings.delayTime ?? 250;
    const feedback = settings.feedback ?? 40;
    const mix = settings.mix ?? 30;
    const handle = (param, val)=>onChange({
            ...settings,
            [param]: val
        });
    const pct = (val, min, max)=>(val - min) / (max - min) * 100;
    const Knob = ({ label, param, value, min, max, unit })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center gap-2 relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-16 h-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 100 100",
                            className: "w-full h-full -rotate-[135deg]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "50",
                                    cy: "50",
                                    r: "40",
                                    fill: "none",
                                    stroke: "#1a1a1a",
                                    strokeWidth: "8",
                                    strokeDasharray: "188 251",
                                    strokeLinecap: "round"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                                    lineNumber: 23,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "50",
                                    cy: "50",
                                    r: "40",
                                    fill: "none",
                                    stroke: "#f97316",
                                    strokeWidth: "8",
                                    strokeDasharray: `${pct(value, min, max) * 1.88} 251`,
                                    strokeLinecap: "round",
                                    style: {
                                        filter: 'drop-shadow(0 0 6px rgba(249,115,22,0.6))'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                                    lineNumber: 24,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                            lineNumber: 22,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-mono text-orange-400 font-bold",
                                children: [
                                    Math.round(value),
                                    unit
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                                lineNumber: 29,
                                columnNumber: 21
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                            lineNumber: 28,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                    lineNumber: 21,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "range",
                    min: min,
                    max: max,
                    value: value,
                    onChange: (e)=>handle(param, Number(e.target.value)),
                    className: "w-full h-1 accent-orange-400 cursor-pointer"
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                    lineNumber: 32,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-[9px] font-black text-white/40 uppercase tracking-widest",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                    lineNumber: 35,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
            lineNumber: 20,
            columnNumber: 9
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[9px] font-black text-orange-400/60 uppercase tracking-[0.3em]",
                        children: "Echo Engine"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                        lineNumber: 42,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1 flex-1 ml-4 bg-gradient-to-r from-orange-500/20 to-transparent rounded-full"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                        lineNumber: 43,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                lineNumber: 41,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Knob, {
                        label: "Time",
                        param: "delayTime",
                        value: time,
                        min: 0,
                        max: 1000,
                        unit: "ms"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                        lineNumber: 46,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Knob, {
                        label: "Feedback",
                        param: "feedback",
                        value: feedback,
                        min: 0,
                        max: 95,
                        unit: "%"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                        lineNumber: 47,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Knob, {
                        label: "Mix",
                        param: "mix",
                        value: mix,
                        min: 0,
                        max: 100,
                        unit: "%"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                        lineNumber: 48,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
                lineNumber: 45,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx",
        lineNumber: 40,
        columnNumber: 9
    }, this);
}
_c = DelayModule;
var _c;
__turbopack_context__.k.register(_c, "DelayModule");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChorusModule",
    ()=>ChorusModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function ChorusModule({ settings, onChange }) {
    const rate = settings.rate ?? 1;
    const depth = settings.depth ?? 50;
    const mix = settings.mix ?? 50;
    const handle = (param, val)=>onChange({
            ...settings,
            [param]: val
        });
    const pct = (val, min, max)=>(val - min) / (max - min) * 100;
    const Knob = ({ label, param, value, min, max, unit, step = 1 })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center gap-2 relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-16 h-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 100 100",
                            className: "w-full h-full -rotate-[135deg]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "50",
                                    cy: "50",
                                    r: "40",
                                    fill: "none",
                                    stroke: "#1a1a1a",
                                    strokeWidth: "8",
                                    strokeDasharray: "188 251",
                                    strokeLinecap: "round"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                                    lineNumber: 23,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "50",
                                    cy: "50",
                                    r: "40",
                                    fill: "none",
                                    stroke: "#a78bfa",
                                    strokeWidth: "8",
                                    strokeDasharray: `${pct(value, min, max) * 1.88} 251`,
                                    strokeLinecap: "round",
                                    style: {
                                        filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.6))'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                                    lineNumber: 24,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                            lineNumber: 22,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-mono text-purple-400 font-bold",
                                children: [
                                    step < 1 ? value.toFixed(1) : Math.round(value),
                                    unit
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                                lineNumber: 29,
                                columnNumber: 21
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                            lineNumber: 28,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                    lineNumber: 21,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "range",
                    min: min,
                    max: max,
                    step: step,
                    value: value,
                    onChange: (e)=>handle(param, Number(e.target.value)),
                    className: "w-full h-1 accent-purple-400 cursor-pointer"
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                    lineNumber: 32,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-[9px] font-black text-white/40 uppercase tracking-widest",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                    lineNumber: 35,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
            lineNumber: 20,
            columnNumber: 9
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[9px] font-black text-purple-400/60 uppercase tracking-[0.3em]",
                        children: "Modulation"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                        lineNumber: 42,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1 flex-1 ml-4 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                        lineNumber: 43,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                lineNumber: 41,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Knob, {
                        label: "Rate",
                        param: "rate",
                        value: rate,
                        min: 0.1,
                        max: 10,
                        unit: "Hz",
                        step: 0.1
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                        lineNumber: 46,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Knob, {
                        label: "Depth",
                        param: "depth",
                        value: depth,
                        min: 0,
                        max: 100,
                        unit: "%"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                        lineNumber: 47,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Knob, {
                        label: "Mix",
                        param: "mix",
                        value: mix,
                        min: 0,
                        max: 100,
                        unit: "%"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                        lineNumber: 48,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
                lineNumber: 45,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx",
        lineNumber: 40,
        columnNumber: 9
    }, this);
}
_c = ChorusModule;
var _c;
__turbopack_context__.k.register(_c, "ChorusModule");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DistortionModule",
    ()=>DistortionModule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function DistortionModule({ settings, onChange }) {
    const drive = settings.drive ?? 50;
    const tone = settings.tone ?? 50;
    const mix = settings.mix ?? 50;
    const handle = (param, val)=>onChange({
            ...settings,
            [param]: val
        });
    const pct = (val, min, max)=>(val - min) / (max - min) * 100;
    const Knob = ({ label, param, value, min, max, unit })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center gap-2 relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-16 h-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 100 100",
                            className: "w-full h-full -rotate-[135deg]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "50",
                                    cy: "50",
                                    r: "40",
                                    fill: "none",
                                    stroke: "#1a1a1a",
                                    strokeWidth: "8",
                                    strokeDasharray: "188 251",
                                    strokeLinecap: "round"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                                    lineNumber: 23,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "50",
                                    cy: "50",
                                    r: "40",
                                    fill: "none",
                                    stroke: "#ef4444",
                                    strokeWidth: "8",
                                    strokeDasharray: `${pct(value, min, max) * 1.88} 251`,
                                    strokeLinecap: "round",
                                    style: {
                                        filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.6))'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                                    lineNumber: 24,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                            lineNumber: 22,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-mono text-red-400 font-bold",
                                children: [
                                    Math.round(value),
                                    unit
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                                lineNumber: 29,
                                columnNumber: 21
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                            lineNumber: 28,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                    lineNumber: 21,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "range",
                    min: min,
                    max: max,
                    value: value,
                    onChange: (e)=>handle(param, Number(e.target.value)),
                    className: "w-full h-1 accent-red-500 cursor-pointer"
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                    lineNumber: 32,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-[9px] font-black text-white/40 uppercase tracking-widest",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                    lineNumber: 35,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
            lineNumber: 20,
            columnNumber: 9
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[9px] font-black text-red-400/60 uppercase tracking-[0.3em]",
                        children: "Saturation Drive"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                        lineNumber: 42,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1 flex-1 ml-4 bg-gradient-to-r from-red-500/20 to-transparent rounded-full"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                        lineNumber: 43,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                lineNumber: 41,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Knob, {
                        label: "Drive",
                        param: "drive",
                        value: drive,
                        min: 0,
                        max: 100,
                        unit: "%"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                        lineNumber: 46,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Knob, {
                        label: "Tone",
                        param: "tone",
                        value: tone,
                        min: 0,
                        max: 100,
                        unit: "%"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                        lineNumber: 47,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Knob, {
                        label: "Mix",
                        param: "mix",
                        value: mix,
                        min: 0,
                        max: 100,
                        unit: "%"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                        lineNumber: 48,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
                lineNumber: 45,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx",
        lineNumber: 40,
        columnNumber: 9
    }, this);
}
_c = DistortionModule;
var _c;
__turbopack_context__.k.register(_c, "DistortionModule");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PluginWindow",
    ()=>PluginWindow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/power.js [app-client] (ecmascript) <export default as Power>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useDAWStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$GateModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/plugins/GateModule.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$EQModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/plugins/EQModule.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$CompressorModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/plugins/CompressorModule.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$MultibandModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/plugins/MultibandModule.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$LimiterModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/plugins/LimiterModule.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$LevelerModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/plugins/LevelerModule.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$ReverbModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/plugins/ReverbModule.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$DelayModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/plugins/DelayModule.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$ChorusModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/plugins/ChorusModule.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$DistortionModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/plugins/DistortionModule.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2d$engine$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio-engine-bridge.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio/WebAudioEngine.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function PluginWindow({ trackId, insert, onClose }) {
    _s();
    const updateInsertSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "PluginWindow.useDAWStore[updateInsertSettings]": (state)=>state.updateInsertSettings
    }["PluginWindow.useDAWStore[updateInsertSettings]"]);
    const toggleInsertBypass = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "PluginWindow.useDAWStore[toggleInsertBypass]": (state)=>state.toggleInsertBypass
    }["PluginWindow.useDAWStore[toggleInsertBypass]"]);
    // Sync with Audio Engine
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PluginWindow.useEffect": ()=>{
            if (insert.bypass && insert.pluginId !== 'limiter') return;
            if (insert.pluginId === 'eq') {
                __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].updateEQ(trackId, insert.settings.eqHighpass ?? 50, insert.settings.eqTilt ?? 50, insert.settings.eqSideGain ?? 50, insert.settings.eqSideFreq ?? 50, insert.bypass);
            } else if (insert.pluginId === 'compressor') {
                __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].updateCompressor(trackId, insert.settings.compStrength, insert.settings.compAttack, insert.settings.compRelease, insert.bypass);
            } else if (insert.pluginId === 'limiter') {
                // Load WASM worklet on first open, then route through it
                __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].loadWasmLimiter().then({
                    "PluginWindow.useEffect": (loaded)=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].updateLimiter(trackId, insert.settings.limStrength ?? 50, insert.settings.limCeiling ?? -0.3, insert.bypass, loaded // use WASM if it loaded successfully
                        );
                    }
                }["PluginWindow.useEffect"]);
            }
        }
    }["PluginWindow.useEffect"], [
        trackId,
        insert.settings,
        insert.bypass,
        insert.pluginId
    ]);
    const renderModule = ()=>{
        const props = {
            settings: insert.settings,
            onChange: (newSettings)=>updateInsertSettings(trackId, insert.id, newSettings)
        };
        switch(insert.pluginId){
            case 'gate':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$GateModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GateModule"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                    lineNumber: 71,
                    columnNumber: 33
                }, this);
            case 'eq':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$EQModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EQModule"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                    lineNumber: 72,
                    columnNumber: 31
                }, this);
            case 'compressor':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$CompressorModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CompressorModule"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                    lineNumber: 73,
                    columnNumber: 39
                }, this);
            case 'multiband':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$MultibandModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MultibandModule"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                    lineNumber: 74,
                    columnNumber: 38
                }, this);
            case 'limiter':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$LimiterModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LimiterModule"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                    lineNumber: 75,
                    columnNumber: 36
                }, this);
            case 'leveler':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$LevelerModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LevelerModule"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                    lineNumber: 76,
                    columnNumber: 36
                }, this);
            case 'reverb':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$ReverbModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReverbModule"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                    lineNumber: 77,
                    columnNumber: 35
                }, this);
            case 'delay':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$DelayModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DelayModule"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                    lineNumber: 78,
                    columnNumber: 34
                }, this);
            case 'chorus':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$ChorusModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChorusModule"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                    lineNumber: 79,
                    columnNumber: 35
                }, this);
            case 'distortion':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$plugins$2f$DistortionModule$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DistortionModule"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                    lineNumber: 80,
                    columnNumber: 39
                }, this);
            default:
                return null;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-[#2B2B2B] rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-[#1A1A1A] p-1 w-[600px] animate-in zoom-in-95 duration-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-4 py-2 bg-[#1A1A1A] rounded-t-lg border-b border-white/5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>toggleInsertBypass(trackId, insert.id),
                                className: `w-6 h-6 rounded-full flex items-center justify-center transition-all ${insert.bypass ? 'bg-zinc-800 text-zinc-600' : 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__["Power"], {
                                    size: 12
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                                    lineNumber: 94,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                                lineNumber: 90,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-black text-white/80 uppercase tracking-widest italic",
                                children: [
                                    "DA GRABA ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-cyan-400",
                                        children: insert.pluginId === 'multiband' ? 'M-BAND' : insert.pluginId
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                                        lineNumber: 97,
                                        columnNumber: 34
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                                lineNumber: 96,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                        lineNumber: 89,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "p-1 hover:bg-white/5 rounded-md text-white/20 hover:text-white transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                            lineNumber: 105,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                        lineNumber: 101,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                lineNumber: 88,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `p-4 transition-opacity duration-300 ${insert.bypass ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`,
                children: renderModule()
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                lineNumber: 110,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-1.5 bg-[#141414] rounded-b-lg flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[8px] text-white/20 font-mono uppercase tracking-tighter",
                        children: "High Fidelity Processing"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                        lineNumber: 116,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[8px] text-cyan-400/40 font-mono uppercase",
                        children: [
                            "Track: ",
                            trackId
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                        lineNumber: 117,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
                lineNumber: 115,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/PluginWindow.tsx",
        lineNumber: 86,
        columnNumber: 9
    }, this);
}
_s(PluginWindow, "GE1kQFuPcFXu66O2RMFU8PsbEXk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"]
    ];
});
_c = PluginWindow;
var _c;
__turbopack_context__.k.register(_c, "PluginWindow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=development_Da%20Graba_Studio_d9c184ce._.js.map