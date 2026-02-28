(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
    // New method to connect a real audio element (like in the mastering page)
    connectAudioElement(trackId, element) {
        this.initContext();
        const chain = this.getOrCreateTrack(trackId);
        if (chain.source) {
            // We don't want to recreate the source if it's the same element
            // But since we can't easily check, we just hope the caller handles it
            return;
        }
        const source = this.ctx.createMediaElementSource(element);
        source.connect(chain.input);
        chain.source = source;
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
    updateEQ(trackId, highpass, tilt) {
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.eq) {
            chain.eq = this.ctx.createBiquadFilter();
            chain.eq.type = 'highpass';
            // Re-route: input -> eq -> panner
            chain.input.disconnect();
            chain.input.connect(chain.eq);
            chain.eq.connect(chain.panner);
        }
        chain.eq.frequency.setTargetAtTime(highpass, this.ctx.currentTime, 0.1);
    // Tilt is a bit more complex, for now we just use the highpass
    }
    updateCompressor(trackId, strength, attack, release) {
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.compressor) {
            chain.compressor = this.ctx.createDynamicsCompressor();
            // Re-route: input -> [eq] -> compressor -> panner
            const prevNode = chain.eq || chain.input;
            prevNode.disconnect();
            prevNode.connect(chain.compressor);
            chain.compressor.connect(chain.panner);
        }
        // Map strength (0-100) to threshold (-60 to 0) and ratio (1 to 20)
        const threshold = -(strength / 100 * 60);
        const ratio = 1 + strength / 100 * 19;
        chain.compressor.threshold.setTargetAtTime(threshold, this.ctx.currentTime, 0.1);
        chain.compressor.ratio.setTargetAtTime(ratio, this.ctx.currentTime, 0.1);
        chain.compressor.attack.setTargetAtTime(attack / 1000, this.ctx.currentTime, 0.1);
        chain.compressor.release.setTargetAtTime(release / 1000, this.ctx.currentTime, 0.1);
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
"[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StudioMonitor",
    ()=>StudioMonitor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useDAWStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2d$engine$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio-engine-bridge.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio/WebAudioEngine.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function StudioMonitor({ className = '' }) {
    _s();
    const isPlaying = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "StudioMonitor.useDAWStore[isPlaying]": (state)=>state.isPlaying
    }["StudioMonitor.useDAWStore[isPlaying]"]);
    const [bassLevel, setBassLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0); // 0 to 1
    const [midLevel, setMidLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0); // 0 to 1
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StudioMonitor.useEffect": ()=>{
            if (!isPlaying) {
                setBassLevel(0);
                setMidLevel(0);
                return;
            }
            let animationFrameId;
            const updateLevels = {
                "StudioMonitor.useEffect.updateLevels": ()=>{
                    // Get bass frequency intensity (20Hz - 150Hz) for woofer
                    const bass = __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].getFrequencyLevel('master-track', 20, 150);
                    // Get mid frequency intensity (150Hz - 2kHz) for cabinetry/tweeter
                    const mid = __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].getFrequencyLevel('master-track', 150, 2000);
                    setBassLevel(bass);
                    setMidLevel(mid);
                    animationFrameId = requestAnimationFrame(updateLevels);
                }
            }["StudioMonitor.useEffect.updateLevels"];
            updateLevels();
            return ({
                "StudioMonitor.useEffect": ()=>cancelAnimationFrame(animationFrameId)
            })["StudioMonitor.useEffect"];
        }
    }["StudioMonitor.useEffect"], [
        isPlaying
    ]);
    // Calculate pulse intensity: 1.0 (base) to 1.05 (max mid/high expansion)
    const pulseScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StudioMonitor.useMemo[pulseScale]": ()=>{
            return 1 + midLevel * 0.03;
        }
    }["StudioMonitor.useMemo[pulseScale]"], [
        midLevel
    ]);
    // Woofer specific pulse (stronger vibration)
    const wooferScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StudioMonitor.useMemo[wooferScale]": ()=>{
            return 1 + bassLevel * 0.15;
        }
    }["StudioMonitor.useMemo[wooferScale]"], [
        bassLevel
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col items-center justify-center w-64 h-96 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                animate: {
                    scale: pulseScale
                },
                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                },
                className: "w-full h-full bg-[#1A1A1C] border border-[#222] rounded-md shadow-[-20px_0_50px_rgba(0,0,0,0.8),20px_0_50px_rgba(0,0,0,0.8),inset_0_4px_10px_rgba(255,255,255,0.02)] flex flex-col items-center py-8 relative justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-transparent mix-blend-overlay opacity-10 pointer-events-none rounded-md"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                        lineNumber: 55,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-24 h-24 rounded-full bg-[#2A2A2D] border-2 border-[#111] shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)] flex items-center justify-center relative z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-12 h-12 rounded-full bg-black/80 blur-[2px] absolute"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                                lineNumber: 59,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-16 h-16 rounded-full border border-white/5 flex items-center justify-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-6 h-6 rounded-full bg-[#3A3A3D] shadow-[0_0_10px_rgba(0,0,0,0.9)]"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                                        lineNumber: 62,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute w-[2px] h-3 bg-[#444] top-8"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                                        lineNumber: 63,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute w-[2px] h-3 bg-[#444] top-[48px] -rotate-[120deg] left-10"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                                        lineNumber: 64,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute w-[2px] h-3 bg-[#444] top-[48px] rotate-[120deg] right-10"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                                        lineNumber: 65,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                                lineNumber: 61,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                        lineNumber: 58,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-48 h-48 rounded-full bg-[#202022] border-[4px] border-[#0a0a0a] shadow-[inset_0_10px_30px_rgba(0,0,0,0.9),0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center relative mt-auto z-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            animate: {
                                scale: wooferScale
                            },
                            transition: {
                                type: 'spring',
                                stiffness: 400,
                                damping: 15
                            },
                            className: "w-36 h-36 rounded-full bg-gradient-to-br from-[#f0f0f0] to-[#aaaaaa] shadow-[inset_0_-5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-16 h-16 rounded-full bg-[#d0d0d0] border border-white/40 shadow-[0_2px_5px_rgba(0,0,0,0.2)]"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                                lineNumber: 78,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                            lineNumber: 72,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                        lineNumber: 70,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                lineNumber: 48,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                animate: {
                    scaleX: pulseScale,
                    opacity: 0.7 + bassLevel * 0.3
                },
                className: "w-48 h-4 bg-black/90 blur-xl mt-2 rounded-full"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
                lineNumber: 85,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx",
        lineNumber: 46,
        columnNumber: 9
    }, this);
}
_s(StudioMonitor, "bY+D1R4U6ECQ9oe2ggCHzdePOeU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"]
    ];
});
_c = StudioMonitor;
var _c;
__turbopack_context__.k.register(_c, "StudioMonitor");
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
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${sizeClasses[size]} rounded-full bg-[#1A1A1A] p-1 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_2px_4px_rgba(255,255,255,0.05)] relative flex items-center justify-center`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full h-full rounded-full bg-gradient-to-b from-[#333] to-[#111] shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_2px_1px_rgba(255,255,255,0.2)] relative cursor-ns-resize group",
                    style: {
                        transform: `rotate(${rotation}deg)`
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1/4 bg-white/80 rounded-full shadow-[0_0_2px_rgba(255,255,255,0.5)] group-hover:bg-cyan-glow group-hover:shadow-[0_0_5px_rgba(0,240,255,0.8)] transition-colors"
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx",
                        lineNumber: 31,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx",
                    lineNumber: 26,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx",
                lineNumber: 23,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[10px] font-bold tracking-widest text-[#888] uppercase",
                children: label
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx",
                lineNumber: 36,
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
"[project]/development/Da Graba_Studio/store/useMasteringStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMasteringStore",
    ()=>useMasteringStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useMasteringStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        history: [],
        currentModule: 'leveler',
        setCurrentModule: (module)=>set({
                currentModule: module
            }),
        addToHistory: (project)=>{
            const newProject = {
                ...project,
                date: new Date().toISOString()
            };
            set((state)=>({
                    history: [
                        newProject,
                        ...state.history
                    ]
                }));
        },
        deleteFromHistory: (id)=>{
            set((state)=>({
                    history: state.history.filter((p)=>p.id !== id)
                }));
        },
        getProjectById: (id)=>{
            return get().history.find((p)=>p.id === id);
        }
    }), {
    name: 'mastering-history-storage'
}));
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
function StudioChat({ embedded = false, songName }) {
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
                            lineNumber: 198,
                            columnNumber: 40
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MicOff$3e$__["MicOff"], {
                            className: "text-silver-dark",
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                            lineNumber: 198,
                            columnNumber: 83
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                        lineNumber: 194,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsOpen(!isOpen),
                        className: `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isOpen ? 'bg-orange-600 scale-90' : 'bg-gradient-to-br from-cyan-glow to-blue-600 glow-cyan hover:scale-110'}`,
                        children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            className: "text-white"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                            lineNumber: 205,
                            columnNumber: 35
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                            className: "text-white"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                            lineNumber: 205,
                            columnNumber: 77
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                        lineNumber: 201,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                lineNumber: 193,
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
                                        lineNumber: 216,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold tracking-widest text-[#E0E0E0]",
                                        children: "ENGINEER FEEDBACK"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 217,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 215,
                                columnNumber: 21
                            }, this),
                            isSpeaking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                size: 14,
                                className: "text-cyan-glow animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 219,
                                columnNumber: 36
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                        lineNumber: 214,
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
                                        lineNumber: 226,
                                        columnNumber: 29
                                    }, this)
                                }, i, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                    lineNumber: 225,
                                    columnNumber: 25
                                }, this)),
                            isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-1 ml-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 236,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce [animation-delay:0.2s]"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 237,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce [animation-delay:0.4s]"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 238,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 235,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                        lineNumber: 223,
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
                                        lineNumber: 249,
                                        columnNumber: 25
                                    }, this),
                                    " Generar Mitad"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 245,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "whitespace-nowrap flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-silver-dark hover:text-white transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__["PlayCircle"], {
                                        size: 10
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 252,
                                        columnNumber: 25
                                    }, this),
                                    " Continuar"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 251,
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
                                        lineNumber: 258,
                                        columnNumber: 25
                                    }, this),
                                    " Limpiar Todo"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 254,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "whitespace-nowrap flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-silver-dark hover:text-white transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$vocal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic2$3e$__["Mic2"], {
                                        size: 10
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                        lineNumber: 261,
                                        columnNumber: 25
                                    }, this),
                                    " Grabar Hum"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 260,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                        lineNumber: 244,
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
                                lineNumber: 267,
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
                                    lineNumber: 279,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                                lineNumber: 275,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                        lineNumber: 266,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
                lineNumber: 211,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx",
        lineNumber: 189,
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
function SpectrumAnalyzer({ analyzer, naked }) {
    _s();
    const isPlaying = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "SpectrumAnalyzer.useDAWStore[isPlaying]": (state)=>state.isPlaying
    }["SpectrumAnalyzer.useDAWStore[isPlaying]"]);
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
                    if (!isPlaying) {
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
                lineNumber: 158,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "w-full h-full block"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/components/daw/SpectrumAnalyzer.tsx",
                lineNumber: 160,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/SpectrumAnalyzer.tsx",
        lineNumber: 153,
        columnNumber: 9
    }, this);
}
_s(SpectrumAnalyzer, "togC81frVF+yWxEUErz87gj5lF8=", false, function() {
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
"[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Mastering
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$StudioMonitor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/StudioMonitor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/MasteringKnob.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-client] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/repeat.js [app-client] (ecmascript) <export default as Repeat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/music.js [app-client] (ecmascript) <export default as Music>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/history.js [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useMasteringStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useMasteringStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2d$engine$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio-engine-bridge.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio/WebAudioEngine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$StudioChat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$SpectrumAnalyzer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/SpectrumAnalyzer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/navigation.js [app-client] (ecmascript)");
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
function Mastering() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const locale = params.locale;
    const loadId = searchParams.get('load');
    // UI State
    const [isOn, setIsOn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isComparing, setIsComparing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [duration, setDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [volume, setVolume] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0.8);
    const [selectedSong, setSelectedSong] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Proyecto 1 - Final');
    const [metadataDNA, setMetadataDNA] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('PROJ-001-A');
    const [audioUrl, setAudioUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [chatOpen, setChatOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Mastering Knobs State (master_me architecture)
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        // Gate
        gateThreshold: 10,
        gateAttack: 5,
        gateRelease: 100,
        // EQ
        eqHighpass: 30,
        eqTilt: 0,
        eqSideGain: 20,
        eqSideFreq: 4000,
        // Leveler
        levelerTarget: -14,
        levelerBrake: -60,
        levelerMaxPlus: 6,
        levelerMaxMinus: 12,
        // Knee Compressor
        compStrength: 30,
        compAttack: 20,
        compRelease: 200,
        compKnee: 6,
        compMakeup: 0,
        // Multiband
        mbStrengthLow: 20,
        mbStrengthHigh: 40,
        mbAttackLow: 50,
        mbAttackHigh: 20,
        mbCrossoverLow: 200,
        mbCrossoverHigh: 5000,
        // Limiter & Brickwall
        limStrength: 50,
        limAttack: 2,
        limRelease: 100,
        limCeiling: -0.1,
        // Legacy/Direct
        inputDrive: 20,
        stereoWidth: 60
    });
    const { addToHistory, getProjectById, currentModule, setCurrentModule } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useMasteringStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMasteringStore"])();
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Load project from history if requested
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mastering.useEffect": ()=>{
            if (loadId) {
                const project = getProjectById(loadId);
                if (project) {
                    setSelectedSong(project.name);
                    setMetadataDNA(project.dna);
                    setSettings(project.settings);
                    if (project.audioUrl) {
                        setAudioUrl(project.audioUrl);
                    }
                }
            }
        }
    }["Mastering.useEffect"], [
        loadId,
        getProjectById
    ]);
    // List of songs currently available for mastering
    const songList = [
        {
            name: 'Proyecto 1 - Final',
            dna: 'PROJ-001-A'
        },
        {
            name: 'Grabación de Voz - Raw',
            dna: 'PROJ-002-B'
        },
        {
            name: 'Mix Down Instrumental',
            dna: 'PROJ-003-C'
        }
    ];
    // Mocking user plan for export logic
    const userPlan = 'Básico';
    const handleImport = ()=>{
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = (e)=>{
            const file = e.target.files?.[0];
            if (file) {
                const url = URL.createObjectURL(file);
                setAudioUrl(url);
                const cleanName = file.name.replace(/\.[^/.]+$/, "");
                setSelectedSong(cleanName);
                setMetadataDNA(`IMPORT-${Date.now().toString().slice(-4)}`);
                setIsPlaying(true);
            }
        };
        input.click();
    };
    // --- Audio Logic ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mastering.useEffect": ()=>{
            if (audioRef.current && audioUrl) {
                __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].connectAudioElement('master-track', audioRef.current);
            }
        }
    }["Mastering.useEffect"], [
        audioUrl
    ]);
    // Sync settings with Audio Engine
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mastering.useEffect": ()=>{
            if (!isOn) return;
            // Update individual modules in the audio engine
            // (Note: These methods will be fully implemented in WebAudioEngine)
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].updateEQ('master-track', settings.eqHighpass, settings.eqTilt);
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].updateCompressor('master-track', settings.compStrength, settings.compAttack, settings.compRelease);
        // This makes the "plugins" feel real
        }
    }["Mastering.useEffect"], [
        settings,
        isOn
    ]);
    const togglePlay = ()=>{
        setIsPlaying((prev)=>!prev);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mastering.useEffect": ()=>{
            if (audioRef.current) {
                if (isPlaying && isOn) {
                    audioRef.current.play().catch({
                        "Mastering.useEffect": (e)=>console.error("Playback failed", e)
                    }["Mastering.useEffect"]);
                } else {
                    audioRef.current.pause();
                }
            }
        }
    }["Mastering.useEffect"], [
        isPlaying,
        isOn,
        audioUrl
    ]);
    const handleTimeUpdate = ()=>{
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const dur = audioRef.current.duration;
            setProgress(current / (dur || 1) * 100);
            setDuration(dur || 0);
        }
    };
    const handleSeek = (percentage)=>{
        if (audioRef.current && duration) {
            const time = percentage / 100 * duration;
            audioRef.current.currentTime = time;
            setProgress(percentage);
        }
    };
    const handleSave = ()=>{
        const projectId = `proj-${Date.now()}`;
        addToHistory({
            id: projectId,
            name: selectedSong,
            audioUrl: audioUrl,
            settings: settings,
            dna: metadataDNA || projectId
        });
        alert("Sesión guardada en el historial.");
    };
    const handleExport = ()=>{
        handleSave(); // Auto-save on export
        const exportInfo = {
            title: selectedSong,
            studio: 'DA-GRABA STUDIO MASTER',
            info: '24-bit / 44.1kHz High Quality'
        };
        if ("TURBOPACK compile-time truthy", 1) {
            alert(`Exportando "${exportInfo.title}"\n- Sello: ${exportInfo.studio}\n- Calidad: MP3 128kbps (Plan Básico)\n- Información: El cliente puede editar su información después de descargar.`);
        } else //TURBOPACK unreachable
        ;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col w-full h-full items-center justify-start px-24 py-8 relative overflow-hidden pointer-events-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                ref: audioRef,
                src: audioUrl || '',
                onTimeUpdate: handleTimeUpdate,
                onEnded: ()=>setIsPlaying(false)
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                lineNumber: 203,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                lineNumber: 211,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-6xl mb-8 relative z-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-2 shadow-2xl overflow-x-auto no-scrollbar",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/${locale}/mastering/history`,
                            className: "flex items-center gap-2 px-4 py-2 border-r border-white/10 flex-shrink-0 hover:bg-white/5 transition-colors group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                    size: 14,
                                    className: "text-cyan-400 group-hover:rotate-[-45deg] transition-transform"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 217,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] text-white/60 font-black tracking-widest uppercase",
                                    children: "Historial"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 218,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                            lineNumber: 216,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 p-1",
                            children: songList.map((song)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setSelectedSong(song.name);
                                        setMetadataDNA(song.dna);
                                    },
                                    className: `flex flex-col min-w-[160px] px-4 py-2 rounded-xl transition-all border ${selectedSong === song.name ? 'bg-cyan-500/10 border-cyan-500/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] font-bold truncate",
                                            children: song.name
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 234,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[7px] font-mono opacity-40 uppercase tracking-tighter",
                                            children: [
                                                "DNA: ",
                                                song.dna
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 235,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, song.dna, true, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 222,
                                    columnNumber: 29
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                            lineNumber: 220,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleImport,
                            className: "ml-auto flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 240,
                                    columnNumber: 25
                                }, this),
                                " Importar Nuevo"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                            lineNumber: 239,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                    lineNumber: 215,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                lineNumber: 214,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full flex items-center justify-center relative z-10 gap-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0 transform scale-110",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$StudioMonitor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StudioMonitor"], {}, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                            lineNumber: 248,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                        lineNumber: 247,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 max-w-4xl relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#2B2B2B] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-[#1A1A1A] p-4 flex flex-col gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center px-2 py-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white font-bold text-sm tracking-wide flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                                size: 16
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 260,
                                                                columnNumber: 37
                                                            }, this),
                                                            "DA GRABA"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 259,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white/80 font-bold text-[10px] uppercase tracking-tighter leading-none",
                                                                children: "Stereo Master Rack"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 264,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-1.5 mt-0.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 266,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: selectedSong,
                                                                        onChange: (e)=>setSelectedSong(e.target.value),
                                                                        className: "bg-transparent border-none text-cyan-400 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400/30 rounded px-1 transition-all w-48"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 267,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 265,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 263,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 258,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleSave,
                                                        className: "flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs text-white/60 hover:text-white transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 279,
                                                                columnNumber: 37
                                                            }, this),
                                                            " Guardar"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 278,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleExport,
                                                        className: "flex items-center gap-1.5 px-3 py-1 bg-green-600/20 hover:bg-green-600/40 border border-green-500/50 rounded text-xs text-green-400 hover:text-green-300 transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 282,
                                                                columnNumber: 37
                                                            }, this),
                                                            " Exportar"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 277,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setIsOn(!isOn),
                                                    className: "w-12 h-6 rounded-full bg-[#111] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative flex items-center px-1",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `w-4 h-4 rounded-full shadow-md transition-all duration-300 ${isOn ? 'bg-green-500 translate-x-6 glow-primary' : 'bg-[#444] translate-x-0'}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 292,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 288,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 287,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 257,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-2 mx-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between bg-black/20 rounded-lg p-1 border border-white/5",
                                                children: [
                                                    'gate',
                                                    'eq',
                                                    'leveler',
                                                    'compressor',
                                                    'multiband',
                                                    'limiter'
                                                ].map((mod, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setCurrentModule(mod),
                                                                className: `flex-1 py-1.5 px-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${currentModule === mod ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`,
                                                                children: mod === 'compressor' ? 'Comp' : mod === 'multiband' ? 'M-Band' : mod
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 302,
                                                                columnNumber: 41
                                                            }, this),
                                                            idx < 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "px-1 text-white/10 text-[8px] font-black",
                                                                children: "➔"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 313,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, mod, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 301,
                                                        columnNumber: 37
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 299,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[7px] text-cyan-400/40 uppercase font-black tracking-widest",
                                                    children: "Signal Flow: Pre-Processing ➔ Gate ➔ EQ ➔ Leveler ➔ Comp ➔ M-Band ➔ Limiter ➔ Brickwall"
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 319,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 318,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 298,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `transition-opacity duration-500 ${isOn ? 'opacity-100' : 'opacity-30 pointer-events-none'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-3 gap-4 h-48",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-[#181818] rounded-lg border border-[#333] shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] overflow-hidden",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$SpectrumAnalyzer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpectrumAnalyzer"], {
                                                            analyzer: __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].getTrackAnalyser('master-track'),
                                                            naked: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 329,
                                                            columnNumber: 38
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 328,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-[#2A2A2D] rounded-lg border border-[#1A1A1C] shadow-inner p-4 flex flex-col items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-8 h-24 w-full justify-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col gap-1 h-full w-8 bg-[#111] rounded-sm p-1 shadow-inner justify-end",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-[8px] text-center text-silver-dark font-mono uppercase mb-1",
                                                                                children: "SRC"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                lineNumber: 340,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            Array.from({
                                                                                length: 12
                                                                            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: `h-1.5 w-full rounded-xs ${i < 3 ? 'bg-[#333]' : i < 6 ? 'bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]' : 'bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]'}`
                                                                                }, `s-${i}`, false, {
                                                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                    lineNumber: 342,
                                                                                    columnNumber: 49
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 339,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col gap-1 h-full w-8 bg-[#111] rounded-sm p-1 shadow-inner justify-end",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-[8px] text-center text-silver-dark font-mono uppercase mb-1",
                                                                                children: "MST"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                lineNumber: 348,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            Array.from({
                                                                                length: 12
                                                                            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: `h-1.5 w-full rounded-xs ${i < 1 ? 'bg-[#333]' : i < 4 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`
                                                                                }, `m-${i}`, false, {
                                                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                    lineNumber: 350,
                                                                                    columnNumber: 49
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 347,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 337,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onMouseDown: ()=>setIsComparing(true),
                                                                onMouseUp: ()=>setIsComparing(false),
                                                                onMouseLeave: ()=>setIsComparing(false),
                                                                className: `mt-4 px-6 py-1 rounded bg-[#1A1A1A] border border-[#333] text-[10px] font-bold tracking-widest uppercase transition-all shadow-[0_4px_6px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none ${isComparing ? 'text-red-500 glow-red border-red-500/50' : 'text-[#888] hover:text-[#AAA]'}`,
                                                                children: "COMPARE"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 355,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 336,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-[#303030] rounded-lg border border-[#3A3A3A] p-4 flex flex-col items-center justify-center gap-6 shadow-inner",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "bg-[#1A1A1C] px-4 py-1.5 rounded-full border border-cyan-glow/30 flex items-center justify-between w-full cursor-pointer shadow-inner",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-cyan-glow text-xs font-bold tracking-widest uppercase",
                                                                        children: "Stereo"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 368,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-white/50 text-[10px]",
                                                                        children: "▼"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 369,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 367,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "INPUT DRIVE",
                                                                value: settings.inputDrive,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        inputDrive: v
                                                                    }),
                                                                size: "sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 371,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "WIDTH",
                                                                value: settings.stereoWidth,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        stereoWidth: v
                                                                    }),
                                                                size: "sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 377,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 366,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 325,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-4 bg-[#303030] rounded-lg border border-[#3A3A3A] p-8 flex justify-around items-center shadow-inner min-h-[180px]",
                                                children: [
                                                    currentModule === 'gate' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "THRES",
                                                                value: settings.gateThreshold,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        gateThreshold: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 391,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "ATTACK",
                                                                value: settings.gateAttack,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        gateAttack: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 392,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "RELEASE",
                                                                value: settings.gateRelease,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        gateRelease: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 393,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true),
                                                    currentModule === 'eq' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "HI-PASS",
                                                                value: settings.eqHighpass,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        eqHighpass: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 398,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "TILT",
                                                                value: settings.eqTilt,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        eqTilt: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 399,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "SIDE GAIN",
                                                                value: settings.eqSideGain,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        eqSideGain: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 400,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "SIDE FREQ",
                                                                value: settings.eqSideFreq,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        eqSideFreq: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 401,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true),
                                                    currentModule === 'leveler' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "TARGET LUFS",
                                                                value: settings.levelerTarget,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        levelerTarget: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 406,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "BRAKE",
                                                                value: settings.levelerBrake,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        levelerBrake: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 407,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "MAX +",
                                                                value: settings.levelerMaxPlus,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        levelerMaxPlus: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 408,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "MAX -",
                                                                value: settings.levelerMaxMinus,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        levelerMaxMinus: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 409,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true),
                                                    currentModule === 'compressor' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "STRENGTH",
                                                                value: settings.compStrength,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        compStrength: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 414,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "ATTACK",
                                                                value: settings.compAttack,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        compAttack: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 415,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "RELEASE",
                                                                value: settings.compRelease,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        compRelease: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 416,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "MAKEUP",
                                                                value: settings.compMakeup,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        compMakeup: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 417,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true),
                                                    currentModule === 'multiband' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col items-center gap-4 border-r border-white/5 pr-8",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[8px] text-white/30 uppercase font-black tracking-widest",
                                                                        children: "Low Bands"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 423,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                                label: "STR",
                                                                                value: settings.mbStrengthLow,
                                                                                onChange: (v)=>setSettings({
                                                                                        ...settings,
                                                                                        mbStrengthLow: v
                                                                                    }),
                                                                                size: "md"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                lineNumber: 425,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                                label: "CROSS",
                                                                                value: settings.mbCrossoverLow,
                                                                                onChange: (v)=>setSettings({
                                                                                        ...settings,
                                                                                        mbCrossoverLow: v
                                                                                    }),
                                                                                size: "md"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                lineNumber: 426,
                                                                                columnNumber: 49
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 424,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 422,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col items-center gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[8px] text-white/30 uppercase font-black tracking-widest",
                                                                        children: "High Bands"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 430,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                                label: "STR",
                                                                                value: settings.mbStrengthHigh,
                                                                                onChange: (v)=>setSettings({
                                                                                        ...settings,
                                                                                        mbStrengthHigh: v
                                                                                    }),
                                                                                size: "md"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                lineNumber: 432,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                                label: "CROSS",
                                                                                value: settings.mbCrossoverHigh,
                                                                                onChange: (v)=>setSettings({
                                                                                        ...settings,
                                                                                        mbCrossoverHigh: v
                                                                                    }),
                                                                                size: "md"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                lineNumber: 433,
                                                                                columnNumber: 49
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 431,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 429,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true),
                                                    currentModule === 'limiter' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "STRENGTH",
                                                                value: settings.limStrength,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        limStrength: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 440,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "ATTACK",
                                                                value: settings.limAttack,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        limAttack: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 441,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "RELEASE",
                                                                value: settings.limRelease,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        limRelease: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 442,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "CEILING",
                                                                value: settings.limCeiling,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        limCeiling: v
                                                                    }),
                                                                size: "lg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 443,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 388,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 323,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                lineNumber: 254,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 shadow-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-bottom-4 duration-700",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-4 w-1/3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 relative overflow-hidden group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"], {
                                                            className: "text-white/80 transition-transform group-hover:scale-110",
                                                            size: 24
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 457,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 458,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 456,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white font-black tracking-widest text-sm uppercase truncate max-w-[150px]",
                                                            children: selectedSong
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 461,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-cyan-400/60 font-mono text-[9px] tracking-widest mt-0.5",
                                                            children: [
                                                                "DNA: ",
                                                                metadataDNA
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 462,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white/20 font-mono text-[8px] uppercase mt-1",
                                                            children: "24-BIT / 44.1KHZ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 460,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 455,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 flex flex-col items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "text-white/20 hover:text-white transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"], {
                                                                size: 16
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 470,
                                                                columnNumber: 106
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 470,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setIsPlaying(!isPlaying),
                                                            className: "w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all active:scale-95 group",
                                                            children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                                                size: 24,
                                                                fill: "black",
                                                                className: "text-black"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 475,
                                                                columnNumber: 54
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                                size: 24,
                                                                fill: "black",
                                                                className: "text-black ml-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 475,
                                                                columnNumber: 112
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 471,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleExport,
                                                            className: "text-white/20 hover:text-green-400 transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                size: 16
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 477,
                                                                columnNumber: 133
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 477,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 469,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full flex items-center gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] font-mono text-white/30 w-8 text-right",
                                                            children: [
                                                                Math.floor((audioRef.current?.currentTime || 0) / 60),
                                                                ":",
                                                                Math.floor((audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 482,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            onClick: (e)=>{
                                                                const rect = e.currentTarget.getBoundingClientRect();
                                                                const x = e.clientX - rect.left;
                                                                const p = x / rect.width * 100;
                                                                handleSeek(p);
                                                            },
                                                            className: "flex-1 h-1.5 bg-white/5 rounded-full relative overflow-hidden group cursor-pointer",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(6,182,212,0.5)]",
                                                                style: {
                                                                    width: `${progress}%`
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 495,
                                                                columnNumber: 41
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 486,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] font-mono text-white/30 w-8 text-left",
                                                            children: [
                                                                Math.floor(duration / 60),
                                                                ":",
                                                                Math.floor(duration % 60).toString().padStart(2, '0')
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 497,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 481,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 468,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-1/3 flex items-center justify-end gap-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-1.5 mr-2 pointer-events-none",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-0.5 items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[7px] text-white/30 font-mono w-2",
                                                                    children: "L"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                    lineNumber: 509,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-0.5",
                                                                    children: [
                                                                        ...Array(12)
                                                                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `w-1 h-3 rounded-full transition-all duration-300 ${isPlaying && i < (isPlaying ? 5 + Math.random() * 6 : 0) ? 'bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.3)]' : isPlaying && i < 10 ? 'bg-yellow-500/80' : 'bg-white/5'}`
                                                                        }, i, false, {
                                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                            lineNumber: 512,
                                                                            columnNumber: 49
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                    lineNumber: 510,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 508,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-0.5 items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[7px] text-white/30 font-mono w-2",
                                                                    children: "R"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                    lineNumber: 525,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-0.5",
                                                                    children: [
                                                                        ...Array(12)
                                                                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `w-1 h-3 rounded-full transition-all duration-300 ${isPlaying && i < (isPlaying ? 4 + Math.random() * 8 : 0) ? 'bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.3)]' : 'bg-white/5'}`
                                                                        }, i, false, {
                                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                            lineNumber: 528,
                                                                            columnNumber: 49
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                    lineNumber: 526,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 524,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 506,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                                            size: 14,
                                                            className: "text-white/40 group-hover:text-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 541,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "range",
                                                            min: "0",
                                                            max: "1",
                                                            step: "0.01",
                                                            value: volume,
                                                            onChange: (e)=>{
                                                                const v = parseFloat(e.target.value);
                                                                setVolume(v);
                                                                if (audioRef.current) audioRef.current.volume = v;
                                                            },
                                                            className: "w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 542,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 540,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 504,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 453,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                lineNumber: 452,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                        lineNumber: 252,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0 transform scale-110",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$StudioMonitor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StudioMonitor"], {}, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                            lineNumber: 563,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                        lineNumber: 562,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                lineNumber: 245,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-12 right-12 z-[100] flex flex-col items-end gap-3",
                children: [
                    chatOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-96 h-[500px] mb-6 animate-in slide-in-from-bottom-10 fade-in duration-500 origin-bottom-right",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full h-full bg-[#0B1015]/95 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-4 border-b border-white/5 bg-gradient-to-r from-cyan-600/20 to-blue-700/20 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                        size: 14,
                                                        className: "text-cyan-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 576,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 575,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] font-black tracking-[0.2em] text-white uppercase",
                                                            children: "John - Da Graba Eng."
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 579,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[7px] font-mono text-cyan-400/60 uppercase",
                                                            children: "Especialista en Masterización"
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 580,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 578,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 574,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setChatOpen(false),
                                            className: "p-1 hover:bg-white/5 rounded-md text-white/20 hover:text-white transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                size: 16,
                                                className: "rotate-[-90deg]"
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 584,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 583,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 573,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-hidden relative",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$StudioChat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StudioChat"], {
                                        embedded: true,
                                        songName: selectedSong
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 593,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 592,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                            lineNumber: 571,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                        lineNumber: 570,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setChatOpen(!chatOpen),
                        className: `group flex items-center gap-4 px-8 py-4 rounded-full border transition-all duration-700 shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_80px_rgba(6,182,212,0.3)] ${chatOpen ? 'bg-orange-600 border-orange-400/50 scale-95' : 'bg-gradient-to-r from-cyan-600 to-blue-700 border-white/20 hover:scale-110 active:scale-95'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        size: 20,
                                        className: `text-white transition-all duration-500 ${chatOpen ? 'rotate-90 opacity-0' : 'animate-pulse'}`
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 608,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                        size: 20,
                                        className: `text-white absolute inset-0 transition-all duration-500 ${chatOpen ? 'rotate-0' : 'opacity-0 -rotate-90'}`
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 609,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                lineNumber: 607,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-start leading-none pr-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] font-black tracking-[0.2em] text-white uppercase drop-shadow-md",
                                        children: "ING DA GRABA MASTERING"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 612,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[8px] font-mono text-white/40 uppercase mt-1 tracking-tighter",
                                        children: "Consultar con John"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 613,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                lineNumber: 611,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-white/20'}`
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                lineNumber: 615,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                        lineNumber: 599,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                lineNumber: 568,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
        lineNumber: 202,
        columnNumber: 9
    }, this);
}
_s(Mastering, "0bR2t9H+FHLw/nW4+OzJuRe+qQE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useMasteringStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMasteringStore"]
    ];
});
_c = Mastering;
var _c;
__turbopack_context__.k.register(_c, "Mastering");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=development_Da%20Graba_Studio_a9503208._.js.map