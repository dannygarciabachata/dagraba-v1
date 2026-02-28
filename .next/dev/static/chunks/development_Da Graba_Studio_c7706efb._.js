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
    sourceNodeMap = new WeakMap();
    isPlaying = false;
    playhead = 0;
    startTime = 0;
    soloedTracks = new Set();
    dspWorkletReady = false;
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
            const muteGain = ctx.createGain();
            const output = ctx.createGain();
            const panner = ctx.createStereoPanner();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            // Initial chain: Input -> Pan -> MuteGain -> Output -> Analyser -> Master
            input.connect(panner);
            panner.connect(muteGain);
            muteGain.connect(output);
            output.connect(analyser);
            analyser.connect(this.masterGain);
            this.trackChains.set(trackId, {
                input,
                muteGain,
                output,
                panner,
                analyser,
                inserts: [],
                isMuted: false,
                isSoloed: false
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
    /**
     * Loads the Da Graba professional DSP suite (Compressor, Saturator, EQ).
     * Call once on user interaction. The worklet runs C++ WASM on the audio thread.
     */ async loadDaGrabaDSP() {
        if (this.dspWorkletReady) return true;
        this.initContext();
        try {
            await this.ctx.audioWorklet.addModule('/wasm/dagraba-dsp-worklet.js');
            this.dspWorkletReady = true;
            console.log('[WebAudioEngine] Da Graba DSP WASM worklet loaded.');
            return true;
        } catch (error) {
            console.error('[WebAudioEngine] Failed to load Da Graba DSP worklet:', error);
            return false;
        }
    }
    /**
     * Insert a WASM DSP plugin on a track.
     * plugin: 'compressor' | 'saturator' | 'eq'
     * Returns the AudioWorkletNode for parameter control.
     */ async insertWasmPlugin(trackId, plugin) {
        await this.loadDaGrabaDSP();
        if (!this.dspWorkletReady || !this.ctx) return null;
        const chain = this.getOrCreateTrack(trackId);
        const node = new AudioWorkletNode(this.ctx, 'dagraba-dsp-processor', {
            processorOptions: {
                plugin
            },
            numberOfInputs: 1,
            numberOfOutputs: 1,
            outputChannelCount: [
                2
            ]
        });
        // Insert into chain: after input, before panner
        // For simplicity, chain the worklet between input and panner
        const prevLast = chain.inserts.length > 0 ? chain.inserts[chain.inserts.length - 1] : chain.input;
        try {
            prevLast.disconnect(chain.panner);
        } catch (e) {}
        prevLast.connect(node);
        node.connect(chain.panner);
        chain.inserts.push(node);
        console.log(`[WebAudioEngine] Inserted WASM ${plugin} on track ${trackId}`);
        return node;
    }
    play() {
        if (this.isPlaying) return;
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
        chain.isMuted = isMuted;
        this.updateRoutingLevels();
    }
    setTrackSolo(trackId, isSolo) {
        const chain = this.getOrCreateTrack(trackId);
        chain.isSoloed = isSolo;
        if (isSolo) {
            this.soloedTracks.add(trackId);
        } else {
            this.soloedTracks.delete(trackId);
        }
        this.updateRoutingLevels();
    }
    updateRoutingLevels() {
        // A track is audible IF (no tracks are soloed OR it is soloed) AND (it is not muted)
        const hasSolo = this.soloedTracks.size > 0;
        this.trackChains.forEach((chain, id)=>{
            const shouldBeHeard = (hasSolo ? chain.isSoloed : true) && !chain.isMuted;
            const targetGain = shouldBeHeard ? 1 : 0;
            chain.muteGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
        });
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
        // Disconnect previous source associated with this track chain to prevent accumulation
        if (chain.source) {
            try {
                chain.source.disconnect();
            } catch (e) {}
        }
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
        // Apply automatic stem separation if URL contains stem parameter
        const url = new URL(element.src, window.location.href);
        let stemType = url.searchParams.get('stem');
        // Handle proxy URL case where stem parameter is encoded inside the 'url' parameter
        if (!stemType) {
            const innerUrlStr = url.searchParams.get('url');
            if (innerUrlStr) {
                try {
                    // Try to parse as URL
                    const innerUrl = new URL(innerUrlStr, window.location.href);
                    stemType = innerUrl.searchParams.get('stem');
                } catch (e) {
                    // Fallback to simple query string parsing if it's just a path
                    const match = innerUrlStr.match(/[?&]stem=([^&]+)/);
                    if (match) stemType = match[1];
                }
            }
        }
        if (stemType) {
            this.applyStemSeparation(trackId, stemType);
        }
    }
    applyStemSeparation(trackId, type) {
        const chain = this.getOrCreateTrack(trackId);
        const ctx = this.ctx;
        // Clean up previous stem DSP if any
        if (chain.stemDSP) {
            try {
                chain.input.disconnect(chain.stemDSP.splitter);
                chain.stemDSP.merger.disconnect();
                chain.stemDSP.filters.forEach((f)=>f.disconnect());
            } catch (e) {}
        }
        const splitter = ctx.createChannelSplitter(2);
        const merger = ctx.createChannelMerger(2);
        const midGain = ctx.createGain();
        const sideGain = ctx.createGain();
        const filters = [];
        // Mid-Side Logic for Separation
        // Mid = (L + R) / 2
        // Side = (L - R) / 2
        const midInverter = ctx.createGain();
        midInverter.gain.value = -1;
        splitter.connect(midGain, 0); // L
        splitter.connect(midGain, 1); // R
        midGain.gain.value = 0.5;
        splitter.connect(sideGain, 0); // L
        splitter.connect(midInverter, 1); // -R
        midInverter.connect(sideGain);
        sideGain.gain.value = 0.5;
        // Routing based on Stem Type
        const dspOutput = ctx.createGain();
        if (type === 'vocal') {
            // Vocals are usually centered (Mid channel)
            const hp = ctx.createBiquadFilter();
            hp.type = 'highpass';
            hp.frequency.value = 250;
            const lp = ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.value = 4000;
            const peak = ctx.createBiquadFilter();
            peak.type = 'peaking';
            peak.frequency.value = 3000;
            peak.gain.value = 3;
            midGain.connect(hp);
            hp.connect(lp);
            lp.connect(peak);
            peak.connect(dspOutput);
            filters.push(hp, lp, peak);
            // Kill sides for isolation
            sideGain.gain.value = 0;
        } else if (type === 'beat' || type === 'bajo') {
            // Beat/Bass are Mid heavy but need different EQ
            const lp = ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.value = type === 'bajo' ? 200 : 800;
            midGain.connect(lp);
            lp.connect(dspOutput);
            filters.push(lp);
            sideGain.gain.value = 0.1; // Minimal sides
        } else {
            // Melody/FX are often panned or wide (Sides)
            const hp = ctx.createBiquadFilter();
            hp.type = 'highpass';
            hp.frequency.value = 400;
            sideGain.connect(hp);
            hp.connect(dspOutput);
            filters.push(hp);
            midGain.gain.value = 0.3; // Low mid to avoid echo
        }
        // Connect chain: Input -> Splitter -> (Mid/Side processing) -> dspOutput -> Panner
        chain.input.disconnect();
        chain.input.connect(splitter);
        dspOutput.connect(chain.panner);
        chain.stemDSP = {
            splitter,
            merger,
            midGain,
            sideGain,
            filters
        };
        console.log(`[WebAudioEngine] Applied SSE separation for stem: ${type} on track: ${trackId}`);
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
            set((state)=>{
                // Remove any existing entry with the same ID to prevent duplication
                const filteredHistory = state.history.filter((p)=>p.id !== project.id);
                return {
                    history: [
                        newProject,
                        ...filteredHistory
                    ]
                };
            });
        },
        deleteFromHistory: (id)=>{
            set((state)=>({
                    history: state.history.filter((p)=>p.id !== id)
                }));
        },
        getProjectById: (id)=>{
            return get().history.find((p)=>p.id === id);
        },
        cleanupOldHistory: ()=>{
            const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
            const now = Date.now();
            set((state)=>({
                    history: state.history.filter((p)=>{
                        const projectDate = new Date(p.date).getTime();
                        return now - projectDate < NINETY_DAYS_MS;
                    })
                }));
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
                    color: '#FF6B00',
                    trackType: 'stereo'
                },
                {
                    id: 't-808',
                    name: 'Heavy 808 Sub',
                    color: '#B026FF',
                    trackType: 'stereo'
                },
                {
                    id: 't-melody',
                    name: 'Dark Piano Melody',
                    color: '#00F0FF',
                    trackType: 'stereo'
                },
                {
                    id: 't-perch',
                    name: 'Percussion Loop',
                    color: '#A4ECA1',
                    trackType: 'stereo'
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
"[project]/development/Da Graba_Studio/lib/audio/AudioStorage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AudioStorage",
    ()=>AudioStorage
]);
class AudioStorage {
    static DB_NAME = 'DaGrabaAudioCache';
    static STORE_NAME = 'audioFiles';
    static DB_VERSION = 1;
    static async getDB() {
        return new Promise((resolve, reject)=>{
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            request.onerror = ()=>reject(request.error);
            request.onsuccess = ()=>resolve(request.result);
            request.onupgradeneeded = (event)=>{
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME);
                }
            };
        });
    }
    static async saveAudio(id, blob) {
        const db = await this.getDB();
        return new Promise((resolve, reject)=>{
            const transaction = db.transaction(this.STORE_NAME, 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.put(blob, id);
            request.onsuccess = ()=>resolve();
            request.onerror = ()=>reject(request.error);
        });
    }
    static async getAudio(id) {
        const db = await this.getDB();
        return new Promise((resolve, reject)=>{
            const transaction = db.transaction(this.STORE_NAME, 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.get(id);
            request.onsuccess = ()=>resolve(request.result || null);
            request.onerror = ()=>reject(request.error);
        });
    }
    static async deleteAudio(id) {
        const db = await this.getDB();
        return new Promise((resolve, reject)=>{
            const transaction = db.transaction(this.STORE_NAME, 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.delete(id);
            request.onsuccess = ()=>resolve();
            request.onerror = ()=>reject(request.error);
        });
    }
    static async createUrl(id) {
        const blob = await this.getAudio(id);
        if (!blob) return null;
        return URL.createObjectURL(blob);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/store/useCreatorStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreatorStore",
    ()=>useCreatorStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const MOCK_TRACKS = [
    {
        id: 'track-1',
        title: 'Sombras en la Calle',
        style: 'Dark Trap, 808s, Moody',
        duration: '2:45',
        image: 'https://picsum.photos/seed/darktrap/200/200',
        tags: [
            'Trap',
            'Dark'
        ],
        lyrics: "[Verse 1]\nCaminando en la penumbra de la ciudad\nBuscando una salida, una realidad\nLos bajos retumban en mi pecho hoy\nNo sé a dónde voy, pero aquí estoy.\n\n[Chorus]\nSombras en la calle, luces que se van\nEl eco de un sueño que no volverá.",
        views: '1.2k',
        likes: 124,
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73a56.mp3'
    },
    {
        id: 'track-2',
        title: 'Luces de Neón',
        style: 'Melodic Trap, Heavy Bass, Futuristic',
        duration: '3:10',
        image: 'https://picsum.photos/seed/neon/200/200',
        tags: [
            'Trap',
            'Melodic'
        ],
        lyrics: "[Verse 1]\nReflejos de neón en el asfalto frío\nUn mundo de cristal, un vacío mío\nLas máquinas cantan una melodía\nQue me atrapa el alma, pura fantasía.\n\n[Chorus]\nBrilla el neón, brilla el metal\nUn viaje eterno, algo sideral.",
        views: '850',
        likes: 92,
        url: 'https://cdn.pixabay.com/audio/2021/11/24/audio_12345678.mp3'
    }
];
const useCreatorStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        tracks: MOCK_TRACKS,
        activeTrack: MOCK_TRACKS[0],
        setTracks: (tracks)=>set({
                tracks
            }),
        setActiveTrack: (track)=>set({
                activeTrack: track
            }),
        addTrack: (track)=>set((state)=>({
                    tracks: [
                        track,
                        ...state.tracks
                    ],
                    activeTrack: track
                })),
        updateTrack: (id, updates)=>set((state)=>({
                    tracks: state.tracks.map((t)=>t.id === id ? {
                            ...t,
                            ...updates
                        } : t),
                    activeTrack: state.activeTrack?.id === id ? {
                        ...state.activeTrack,
                        ...updates
                    } : state.activeTrack
                })),
        removeTrack: (id)=>set((state)=>({
                    tracks: state.tracks.filter((t)=>t.id !== id),
                    activeTrack: state.activeTrack?.id === id ? null : state.activeTrack
                }))
    }), {
    name: 'creator-tracks-storage'
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PlanLock",
    ()=>PlanLock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/crown.js [app-client] (ecmascript) <export default as Crown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/use-intl/dist/esm/development/react.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const PlanLock = ({ requiredPlan, featureName })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const isPremium = requiredPlan === 'premium';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-700",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-md w-full bg-[#0A0A0C] border border-white/5 rounded-[32px] p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `absolute -top-24 -left-24 w-48 h-48 blur-[100px] opacity-20 rounded-full transition-colors duration-1000 ${isPremium ? 'bg-orange-500' : 'bg-cyan-glow'}`
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                    lineNumber: 23,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `absolute -bottom-24 -right-24 w-48 h-48 blur-[100px] opacity-20 rounded-full transition-colors duration-1000 ${isPremium ? 'bg-orange-500' : 'bg-cyan-glow'}`
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                    lineNumber: 24,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `w-20 h-20 rounded-3xl mb-8 flex items-center justify-center relative ${isPremium ? 'bg-orange-500/10 text-orange-500' : 'bg-cyan-glow/10 text-cyan-glow'}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 rounded-3xl blur-2xl opacity-50 bg-inherit"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                            lineNumber: 28,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        isPremium ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__["Crown"], {
                            size: 32,
                            className: "relative z-10"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                            lineNumber: 29,
                            columnNumber: 34
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                            size: 32,
                            className: "relative z-10"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                            lineNumber: 29,
                            columnNumber: 82
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute -top-2 -right-2 w-8 h-8 bg-black border border-white/10 rounded-full flex items-center justify-center translate-x-1 -translate-y-1 shadow-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                size: 12,
                                className: "text-white/40"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                                lineNumber: 31,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                            lineNumber: 30,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                    lineNumber: 27,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-black text-white tracking-tighter mb-4 uppercase",
                    children: [
                        featureName,
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: isPremium ? 'text-orange-500' : 'text-cyan-glow',
                            children: "Locked"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                            lineNumber: 37,
                            columnNumber: 35
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                    lineNumber: 36,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-silver-dark text-sm leading-relaxed mb-10 px-4",
                    children: [
                        "The ",
                        featureName,
                        " is a professional tool reserved for our ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-white font-bold",
                            children: requiredPlan.toUpperCase()
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                            lineNumber: 40,
                            columnNumber: 79
                        }, ("TURBOPACK compile-time value", void 0)),
                        " members. Upgrade now to unlock your full sonic potential."
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                    lineNumber: 39,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full flex flex-col gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push(`/${locale}/pricing`),
                            className: `w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all group/btn ${isPremium ? 'bg-orange-600 text-white hover:bg-orange-500 shadow-[0_10px_30px_rgba(255,107,0,0.2)]' : 'bg-cyan-glow text-black hover:bg-white shadow-[0_10px_30px_rgba(0,240,255,0.2)]'}`,
                            children: [
                                "Explore ",
                                requiredPlan.toUpperCase(),
                                " Plans",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                    size: 14,
                                    className: "group-hover/btn:translate-x-1 transition-transform"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                                    lineNumber: 53,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                            lineNumber: 45,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.back(),
                            className: "w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-white/40 hover:text-white transition-colors",
                            children: "Back to Safety"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                            lineNumber: 55,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
                    lineNumber: 44,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
            lineNumber: 21,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx",
        lineNumber: 20,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(PlanLock, "LQ/fTYEKIRYVzTYM56XKejj16vA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c = PlanLock;
var _c;
__turbopack_context__.k.register(_c, "PlanLock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StemExtractModal",
    ()=>StemExtractModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/music.js [app-client] (ecmascript) <export default as Music>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useCreatorStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useCreatorStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useMasteringStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useMasteringStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useDAWStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// Stem definitions — these are the track names + colors created for each song
const STEM_DEFINITIONS = [
    {
        name: 'Vocal',
        color: '#00F0FF',
        trackType: 'mono'
    },
    {
        name: 'Beat',
        color: '#FF6B00',
        trackType: 'stereo'
    },
    {
        name: 'Bajo',
        color: '#A4ECA1',
        trackType: 'mono'
    },
    {
        name: 'Melodía',
        color: '#E2A04A',
        trackType: 'stereo'
    },
    {
        name: 'FX',
        color: '#D94AE2',
        trackType: 'stereo'
    }
];
function StemExtractModal({ onClose }) {
    _s();
    const creatorTracks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useCreatorStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreatorStore"])({
        "StemExtractModal.useCreatorStore[creatorTracks]": (s)=>s.tracks
    }["StemExtractModal.useCreatorStore[creatorTracks]"]);
    const masteringHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useMasteringStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMasteringStore"])({
        "StemExtractModal.useMasteringStore[masteringHistory]": (s)=>s.history
    }["StemExtractModal.useMasteringStore[masteringHistory]"]);
    const addTrack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])({
        "StemExtractModal.useDAWStore[addTrack]": (s)=>s.addTrack
    }["StemExtractModal.useDAWStore[addTrack]"]);
    const [selectedId, setSelectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [extracting, setExtracting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [done, setDone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Combine creator + mastering sources into one selectable list
    const songList = [
        ...creatorTracks.map((t)=>({
                id: t.id,
                title: t.title,
                subtitle: t.style || 'AI Creator',
                audioUrl: t.streamAudioUrl || t.url,
                source: 'creator'
            })),
        ...masteringHistory.slice(0, 8).map((p)=>({
                id: p.id,
                title: p.name,
                subtitle: `Masterización · ${p.dna}`,
                audioUrl: typeof p.audioUrl === 'string' && !p.audioUrl.startsWith('blob:') ? p.audioUrl : null,
                source: 'mastering'
            }))
    ];
    const handleExtract = async ()=>{
        if (!selectedId) return;
        const song = songList.find((s)=>s.id === selectedId);
        if (!song) return;
        setExtracting(true);
        // Simulate stem separation delay (250ms per stem)
        for(let i = 0; i < STEM_DEFINITIONS.length; i++){
            await new Promise((r)=>setTimeout(r, 250));
            const stem = STEM_DEFINITIONS[i];
            addTrack(`${song.title} · ${stem.name}`, stem.color, stem.trackType, song.audioUrl ? `${song.audioUrl}?stem=${stem.name.toLowerCase()}` : undefined);
        }
        setExtracting(false);
        setDone(true);
        // Auto-close after showing success
        setTimeout(()=>onClose(), 1200);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#0B1015] border border-white/10 rounded-2xl w-full max-w-lg shadow-[0_0_60px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-6 py-4 border-b border-white/5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-lg border border-cyan-500/20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                        size: 18,
                                        className: "text-cyan-400"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                        lineNumber: 83,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                    lineNumber: 82,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-black text-white tracking-widest uppercase",
                                            children: "Extraer Stems al Editor"
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                            lineNumber: 86,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-white/40 mt-0.5",
                                            children: "Selecciona una canción para separar sus pistas"
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                            lineNumber: 87,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                    lineNumber: 85,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                            lineNumber: 81,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                lineNumber: 91,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                            lineNumber: 90,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                    lineNumber: 80,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 flex flex-col gap-2 max-h-[340px] overflow-y-auto custom-scrollbar",
                    children: [
                        songList.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-10 text-white/20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"], {
                                    size: 36,
                                    className: "mx-auto mb-3 opacity-30"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                    lineNumber: 99,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-bold tracking-widest uppercase",
                                    children: "No hay canciones disponibles"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                    lineNumber: 100,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] mt-1",
                                    children: "Genera una canción en Crear primero"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                    lineNumber: 101,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                            lineNumber: 98,
                            columnNumber: 25
                        }, this),
                        songList.map((song)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedId(song.id),
                                className: `flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${selectedId === song.id ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/10'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${song.source === 'creator' ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-purple-500/20 border border-purple-500/30'}`,
                                        children: song.source === 'creator' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music$3e$__["Music"], {
                                            size: 16,
                                            className: "text-orange-400"
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                            lineNumber: 118,
                                            columnNumber: 37
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                            size: 16,
                                            className: "text-purple-400"
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                            lineNumber: 120,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                        lineNumber: 113,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-bold text-white truncate",
                                                children: song.title
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                                lineNumber: 124,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-white/40 mt-0.5 truncate",
                                                children: song.subtitle
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                                lineNumber: 125,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                        lineNumber: 123,
                                        columnNumber: 29
                                    }, this),
                                    selectedId === song.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                        lineNumber: 128,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, song.id, true, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                lineNumber: 105,
                                columnNumber: 25
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                    lineNumber: 96,
                    columnNumber: 17
                }, this),
                selectedId && !done && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 pb-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2",
                            children: "Se crearán estas pistas en el editor:"
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                            lineNumber: 137,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 flex-wrap",
                            children: STEM_DEFINITIONS.map((stem, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border",
                                    style: {
                                        background: `${stem.color}15`,
                                        borderColor: `${stem.color}40`,
                                        color: stem.color,
                                        animationDelay: `${i * 50}ms`
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-1.5 h-1.5 rounded-full",
                                            style: {
                                                background: stem.color
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                            lineNumber: 150,
                                            columnNumber: 37
                                        }, this),
                                        stem.name
                                    ]
                                }, stem.name, true, {
                                    fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                    lineNumber: 140,
                                    columnNumber: 33
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                            lineNumber: 138,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                    lineNumber: 136,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-6 py-4 border-t border-white/5 flex items-center justify-between gap-4",
                    children: done ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-green-400 text-sm font-bold mx-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center",
                                children: "✓"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                lineNumber: 162,
                                columnNumber: 29
                            }, this),
                            "¡Stems añadidos al editor!"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                        lineNumber: 161,
                        columnNumber: 25
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "px-5 py-2 text-white/40 hover:text-white text-xs font-bold tracking-widest transition-colors",
                                children: "Cancelar"
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                lineNumber: 167,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleExtract,
                                disabled: !selectedId || extracting,
                                className: "flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]",
                                children: extracting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-3 h-3 rounded-full border border-white border-t-transparent animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                            lineNumber: 177,
                                            columnNumber: 41
                                        }, this),
                                        "Separando stems..."
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                            lineNumber: 182,
                                            columnNumber: 41
                                        }, this),
                                        "Abrir en Editor"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                                lineNumber: 170,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
                    lineNumber: 159,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
            lineNumber: 77,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx",
        lineNumber: 76,
        columnNumber: 9
    }, this);
}
_s(StemExtractModal, "Ju53SNaqARk7e7st2DOIexNwOXI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useCreatorStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreatorStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useMasteringStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMasteringStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"]
    ];
});
_c = StemExtractModal;
var _c;
__turbopack_context__.k.register(_c, "StemExtractModal");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useMasteringStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useMasteringStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2d$engine$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio-engine-bridge.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio/WebAudioEngine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$StudioChat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/StudioChat.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$SpectrumAnalyzer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/SpectrumAnalyzer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$AudioStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/lib/audio/AudioStorage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useCreatorStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useCreatorStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useUserStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useUserStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$ui$2f$PlanLock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/ui/PlanLock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$StemExtractModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/components/daw/StemExtractModal.tsx [app-client] (ecmascript)");
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
;
function Mastering() {
    _s();
    const plan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useUserStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserStore"])({
        "Mastering.useUserStore[plan]": (state)=>state.plan
    }["Mastering.useUserStore[plan]"]);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mastering.useEffect": ()=>{
            setMounted(true);
        }
    }["Mastering.useEffect"], []);
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
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
    const [selectedGenre, setSelectedGenre] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('DGB_BACHATA');
    const [isAIMastering, setIsAIMastering] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [aiStatus, setAiStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [currentAudioId, setCurrentAudioId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const defaultSettings = {
        gateThreshold: -12,
        gateAttack: 10,
        gateRelease: 100,
        eqHighpass: 50,
        eqTilt: 50,
        eqSideGain: 50,
        eqSideFreq: 0,
        levelerTarget: -14,
        levelerBrake: 50,
        levelerMaxPlus: 10,
        levelerMaxMinus: 10,
        compStrength: 30,
        compAttack: 30,
        compRelease: 200,
        compKnee: 6,
        compMakeup: 0,
        mbStrengthLow: 20,
        mbStrengthHigh: 15,
        mbAttackLow: 50,
        mbAttackHigh: 30,
        mbCrossoverLow: 250,
        mbCrossoverHigh: 3000,
        limStrength: 40,
        limAttack: 1,
        limRelease: 100,
        limCeiling: -1.0,
        inputDrive: 0,
        stereoWidth: 0,
        gateBypass: true,
        eqBypass: true,
        levelerBypass: true,
        compBypass: true,
        mbBypass: true,
        limBypass: true
    };
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultSettings);
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [stemsModalOpen, setStemsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const resetSettings = ()=>{
        setSettings(defaultSettings);
        setMenuOpen(false);
    };
    const animateParameter = async (moduleName, message, duration, updates)=>{
        setAiStatus(message);
        setCurrentModule(moduleName);
        const steps = 30; // 30 frames for smooth animation
        const stepTime = duration / steps;
        let startValues = {};
        setSettings((prev)=>{
            startValues = {
                ...prev
            };
            const next = {
                ...prev
            };
            if (updates.gateBypass !== undefined) next.gateBypass = false;
            if (updates.eqBypass !== undefined) next.eqBypass = false;
            if (updates.levelerBypass !== undefined) next.levelerBypass = false;
            if (updates.compBypass !== undefined) next.compBypass = false;
            if (updates.limBypass !== undefined) next.limBypass = false;
            return next;
        });
        for(let i = 1; i <= steps; i++){
            await new Promise((r)=>setTimeout(r, stepTime));
            const progress = i / steps;
            // easeInOutCubic for a human-like turn
            const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            setSettings((prev)=>{
                const next = {
                    ...prev
                };
                for (const key of Object.keys(updates)){
                    if (typeof updates[key] === 'number') {
                        const start = startValues[key];
                        const end = updates[key];
                        // Add a tiny random jitter while "thinking"
                        const jitter = progress > 0.1 && progress < 0.9 ? (Math.random() - 0.5) * 3 : 0;
                        next[key] = start + (end - start) * ease + jitter;
                    }
                }
                return next;
            });
        }
        // Snap to precise final values after animation
        setSettings((prev)=>({
                ...prev,
                ...updates
            }));
        await new Promise((r)=>setTimeout(r, 600)); // Short pause before next step
    };
    const { history, currentModule, setCurrentModule, addToHistory, getProjectById, cleanupOldHistory } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useMasteringStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMasteringStore"])();
    const creatorTracks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useCreatorStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreatorStore"])({
        "Mastering.useCreatorStore[creatorTracks]": (state)=>state.tracks
    }["Mastering.useCreatorStore[creatorTracks]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mastering.useEffect": ()=>{
            cleanupOldHistory();
        }
    }["Mastering.useEffect"], []);
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Guard rendering
    if (!mounted) return null;
    if (plan !== 'premium') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$ui$2f$PlanLock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlanLock"], {
            requiredPlan: "premium",
            featureName: "Pro Mastering Suite"
        }, void 0, false, {
            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
            lineNumber: 132,
            columnNumber: 16
        }, this);
    }
    // Load project from history if requested or recover last session
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mastering.useEffect": ()=>{
            const loadProject = {
                "Mastering.useEffect.loadProject": async ()=>{
                    // Priority 1: loadId from URL
                    if (loadId) {
                        const project = getProjectById(loadId);
                        if (project) {
                            setSelectedSong(project.name);
                            setMetadataDNA(project.dna);
                            setSettings(project.settings);
                            const audioId = project.audioId || project.id;
                            const blob = await __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$AudioStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AudioStorage"].getAudio(audioId);
                            if (blob) {
                                setAudioUrl(URL.createObjectURL(blob));
                                setCurrentAudioId(audioId);
                            } else if (project.audioUrl && !project.audioUrl.startsWith('blob:')) {
                                setAudioUrl(project.audioUrl);
                                setCurrentAudioId(audioId);
                            }
                            return;
                        }
                    }
                    // Priority 2: Last session from history if no audio is loaded
                    if (!audioUrl && history.length > 0) {
                        const project = history[0];
                        setSelectedSong(project.name);
                        setMetadataDNA(project.dna);
                        setSettings(project.settings);
                        const audioId = project.audioId || project.id;
                        const blob = await __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$AudioStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AudioStorage"].getAudio(audioId);
                        if (blob) {
                            setAudioUrl(URL.createObjectURL(blob));
                            setCurrentAudioId(audioId);
                        } else if (project.audioUrl && !project.audioUrl.startsWith('blob:')) {
                            setAudioUrl(project.audioUrl);
                            setCurrentAudioId(audioId);
                        }
                    }
                }
            }["Mastering.useEffect.loadProject"];
            loadProject();
        }
    }["Mastering.useEffect"], [
        loadId,
        getProjectById,
        history,
        audioUrl
    ]);
    // Mocking user plan for export logic
    const userPlan = 'Básico';
    const handleImport = ()=>{
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = async (e)=>{
            const file = e.target.files?.[0];
            if (file) {
                const projectId = `import-${Date.now()}`;
                const url = URL.createObjectURL(file);
                // Save to IndexedDB for persistence
                await __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$AudioStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AudioStorage"].saveAudio(projectId, file);
                const cleanName = file.name.replace(/\.[^/.]+$/, "");
                const dna = `DNA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
                // Genre detection based on filename
                if (cleanName.toLowerCase().includes('bachata')) setSelectedGenre('DGB_BACHATA');
                else if (cleanName.toLowerCase().includes('bolero')) setSelectedGenre('DGB_BOLERO');
                else if (cleanName.toLowerCase().includes('trap')) setSelectedGenre('DGB_TRAP');
                else if (cleanName.toLowerCase().includes('merengue')) setSelectedGenre('DGB_MERENGUE');
                setSelectedSong(cleanName);
                setAudioUrl(url);
                setCurrentAudioId(projectId);
                setMetadataDNA(dna);
                // Auto-add to history as requested by user
                addToHistory({
                    id: projectId,
                    name: cleanName,
                    audioUrl: url,
                    settings: settings,
                    dna: dna
                });
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
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].updateGate('master-track', settings.gateThreshold, settings.gateBypass);
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].updateEQ('master-track', settings.eqHighpass, settings.eqTilt, settings.eqSideGain, settings.eqSideFreq, settings.eqBypass);
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].updateLeveler('master-track', settings.levelerTarget, settings.levelerBypass);
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].updateCompressor('master-track', settings.compStrength, settings.compAttack, settings.compRelease, settings.compBypass);
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].updateLimiter('master-track', settings.limStrength, settings.limCeiling, settings.limBypass);
        }
    }["Mastering.useEffect"], [
        settings,
        isOn
    ]);
    const startAIMastering = async ()=>{
        if (!audioUrl) {
            alert("Sube una canción primero para que el Ingeniero pueda trabajar.");
            return;
        }
        setIsPlaying(false);
        setIsAIMastering(true);
        setAiStatus('ESCANEANDO ADN DE LA CANCIÓN...');
        // Warning to user about volume
        setTimeout(()=>{
            setAiStatus('⚠️ ADVERTENCIA: EL VOLUMEN PUEDE CAMBIAR FUERTEMENTE.');
        }, 1000);
        try {
            // 1-2. Análisis inicial e Intensidad
            setAiStatus('ANÁLISIS CON IA: EVALUANDO INTENSIDAD Y RMS REAL DE LA PISTA...');
            const trackAnalysis = await __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].analyzeAudioBuffer(audioUrl);
            if (trackAnalysis) {
                // Short simulated delay to let the user read the text
                await new Promise((r)=>setTimeout(r, 1500));
            } else {
                await new Promise((r)=>setTimeout(r, 3000));
            }
            setAiStatus(`BUSCANDO GOLD STANDARD PARA ${selectedGenre}...`);
            const response = await fetch(`/api/ai/get-dna/${selectedGenre}`);
            const data = await response.json();
            // Prepare target settings based on DNA
            const targetSettings = {
                ...settings
            };
            // Base target calculations dependent on active track analysis
            const currentRms = trackAnalysis?.rms || -20;
            const currentCf = trackAnalysis?.crestFactor || 12;
            if (!data.success) {
                setAiStatus('ANALIZANDO CON MOTOR HEURÍSTICO LOCAL HÍBRIDO...');
                await new Promise((r)=>setTimeout(r, 2000));
                // Smart Fallbacks based on genre and internal track analysis
                let targetLoudnessDb = -8.0;
                if (selectedGenre === 'DGB_BOLERO') {
                    targetLoudnessDb = -10.0;
                    targetSettings.eqHighpass = 60; // Retain warmth
                    targetSettings.eqTilt = 55; // Slight low mid boost
                    targetSettings.eqSideGain = 45; // Smooth highs
                    targetSettings.eqSideFreq = 20; // Slight presence
                    targetSettings.limCeiling = -1.0;
                } else if (selectedGenre === 'DGB_BACHATA') {
                    targetLoudnessDb = -8.5;
                    targetSettings.eqHighpass = 55;
                    targetSettings.eqTilt = 50;
                    targetSettings.eqSideGain = 55;
                    targetSettings.eqSideFreq = 40; // Vocal presence
                    targetSettings.limCeiling = -0.5;
                } else {
                    // Merengue / Urban
                    targetLoudnessDb = -7.0;
                    targetSettings.eqHighpass = 50;
                    targetSettings.eqTilt = 45; // Less low mud
                    targetSettings.eqSideGain = 65; // Crispy highs
                    targetSettings.eqSideFreq = 60; // Aggressive presence
                    targetSettings.limCeiling = -0.1;
                }
                // Dynamic calculations based on track analysis
                const gainNeeded = targetLoudnessDb - currentRms;
                targetSettings.levelerTarget = Math.min(95, Math.max(40, 50 + gainNeeded * 2.5));
                targetSettings.compStrength = Math.min(80, Math.max(30, currentCf * 4));
                targetSettings.limStrength = Math.min(85, Math.max(35, currentCf * 5));
            } else {
                setAiStatus('ADN ENCONTRADO. CALCULANDO BALANCE ESPECTRAL PERFECTO...');
                await new Promise((r)=>setTimeout(r, 2000));
                const dna = data.dna;
                // 1. Loudness Hybrid Calculation
                const dnaTargetLufs = dna.loudness && dna.loudness.target_lufs ? dna.loudness.target_lufs : -8.0;
                const gainNeeded = dnaTargetLufs - currentRms;
                targetSettings.levelerTarget = Math.min(95, Math.max(40, 50 + gainNeeded * 2.5));
                // 2. Dynamics Hybrid Calculation
                targetSettings.limCeiling = dna.dynamics && dna.dynamics.peak_ceiling ? dna.dynamics.peak_ceiling : -0.5;
                const targetCf = dna.dynamics && dna.dynamics.crest_factor ? dna.dynamics.crest_factor : 10;
                // Blend current track dynamics with target DNA
                const blendedCf = (currentCf + targetCf) / 2;
                targetSettings.compStrength = Math.min(75, Math.max(25, blendedCf * 4.5));
                targetSettings.limStrength = Math.min(85, Math.max(30, blendedCf * 5.5));
                // 3. Spectral (Tilt / Highpass)
                if (dna.spectral_envelope) {
                    const mags = dna.spectral_envelope.magnitudes;
                    if (mags.length > 0) {
                        const avgSlope = (mags[mags.length - 1] - mags[0]) / mags.length;
                        targetSettings.eqTilt = 50 + Math.min(20, Math.max(-20, avgSlope * 10));
                        targetSettings.eqHighpass = 58;
                        targetSettings.eqSideGain = 50 - Math.min(25, Math.max(-25, avgSlope * 8));
                        targetSettings.eqSideFreq = 60; // Enhancing presence globally for AI
                    }
                }
            }
            // --- SEQUENTIAL AI NAVIGATION (13-Point Analysis) ---
            // 3-4. Visualizador y Medidores
            setAiStatus('CONFIGURANDO VISUALIZADOR Y MEDIDORES DE VOLUMEN/SALIDA...');
            await new Promise((r)=>setTimeout(r, 1500));
            // 5-6. Ajuste de Entrada e Igualación
            setAiStatus('CALIBRANDO AJUSTE DE ENTRADA Y GAIN MATCH...');
            await animateParameter('compressor', 'CALIBRANDO AJUSTE DE ENTRADA...', 1000, {
                inputDrive: Math.min(100, targetSettings.compStrength * 0.5)
            });
            // 7. Bypass / Preparación
            setAiStatus('VERIFICANDO BYPASS Y ESTADO DE SEÑAL...');
            await new Promise((r)=>setTimeout(r, 1000));
            // 8. Estilos de Mastering
            setAiStatus(`APLICANDO ESTILO DE MASTERING (${selectedGenre})...`);
            await new Promise((r)=>setTimeout(r, 1500));
            // 9-10. EQ y Presencia
            await animateParameter('eq', 'ESCULPIENDO EQ Y PRESENCIA...', 2500, {
                eqHighpass: targetSettings.eqHighpass,
                eqTilt: targetSettings.eqTilt,
                eqSideGain: targetSettings.eqSideGain,
                eqSideFreq: targetSettings.eqSideFreq,
                eqBypass: false
            });
            // 11. De-Esser (Multiband High)
            await animateParameter('multiband', 'AJUSTANDO DE-ESSER PARA CONTROL DE SIBILANCIA...', 2000, {
                mbStrengthHigh: Math.min(50, targetSettings.eqSideGain * 0.8),
                mbBypass: false
            });
            // 12. Stereo Width
            setAiStatus('EXPANDIENDO STEREO WIDTH...');
            setSettings((prev)=>({
                    ...prev,
                    stereoWidth: 25
                }));
            await new Promise((r)=>setTimeout(r, 1500));
            // 13. Dinámicas y Volumen Final
            await animateParameter('compressor', 'COMPRIMIENDO DINÁMICAS...', 2000, {
                compStrength: targetSettings.compStrength,
                compBypass: false
            });
            await animateParameter('limiter', 'MAXIMIZANDO VOLUMEN Y SALIDA...', 1800, {
                limStrength: targetSettings.limStrength,
                limCeiling: targetSettings.limCeiling,
                limBypass: false
            });
            await animateParameter('leveler', 'AJUSTANDO MEDIDOR DE VOLUMEN FINAL...', 1500, {
                levelerTarget: targetSettings.levelerTarget,
                levelerBypass: false
            });
            setAiStatus('MASTERIZACIÓN IA COMPLETADA.');
            // Save to history with frequency "snapshot" (DNA summary)
            addToHistory({
                id: currentAudioId || `master-${Date.now()}`,
                name: selectedSong,
                audioUrl: audioUrl,
                audioId: currentAudioId || undefined,
                dna: metadataDNA,
                settings: settings,
                frequencyData: [
                    settings.eqHighpass,
                    settings.eqTilt,
                    settings.eqSideGain
                ] // Summary of spectral actions
            });
            setTimeout(()=>{
                setIsAIMastering(false);
                setAiStatus('');
                // Ensure audio engine is active
                __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].initContext();
                // Auto-play after completion
                setIsPlaying(true);
            }, 2000);
        } catch (error) {
            console.error("AI Mastering failed", error);
            setIsAIMastering(false);
            setAiStatus('ERROR EN EL PROCESO.');
        }
    };
    const togglePlay = ()=>{
        if (!isPlaying) {
            __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].initContext();
        }
        setIsPlaying((prev)=>!prev);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mastering.useEffect": ()=>{
            const audio = audioRef.current;
            if (!audio) return;
            let isMounted = true;
            const attemptPlay = {
                "Mastering.useEffect.attemptPlay": async ()=>{
                    if (isPlaying && audioUrl) {
                        try {
                            // Modern browsers return a promise from play()
                            const playPromise = audio.play();
                            if (playPromise !== undefined) {
                                await playPromise;
                            }
                        } catch (e) {
                            // Only log if it's not an AbortError handled by the browser
                            if (e instanceof Error && e.name !== 'AbortError') {
                                console.error("Playback failed", e);
                            }
                        }
                    } else {
                        audio.pause();
                    }
                }
            }["Mastering.useEffect.attemptPlay"];
            attemptPlay();
            return ({
                "Mastering.useEffect": ()=>{
                    isMounted = false;
                }
            })["Mastering.useEffect"];
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
            audioId: currentAudioId || undefined,
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
        className: "flex flex-col w-full h-full items-center justify-start px-4 md:px-12 lg:px-24 py-4 relative overflow-y-auto overflow-x-hidden pb-32 pointer-events-auto custom-scrollbar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                ref: audioRef,
                src: audioUrl ? audioUrl.startsWith('blob:') || audioUrl.startsWith('data:') ? audioUrl : `/api/audio-proxy?url=${encodeURIComponent(audioUrl)}` : undefined,
                onTimeUpdate: handleTimeUpdate,
                onEnded: ()=>setIsPlaying(false),
                crossOrigin: audioUrl?.startsWith('blob:') ? undefined : "anonymous"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                lineNumber: 498,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                lineNumber: 513,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-6xl mb-4 relative z-20",
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
                                    lineNumber: 519,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] text-white/60 font-black tracking-widest uppercase",
                                    children: "Historial"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 520,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                            lineNumber: 518,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 p-1",
                            children: [
                                history.slice(0, 5).map((project, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: async ()=>{
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].initContext();
                                                    setIsPlaying(false);
                                                    setSelectedSong(project.name);
                                                    setMetadataDNA(project.dna);
                                                    setSettings(project.settings);
                                                    const audioId = project.audioId || project.id;
                                                    const blob = await __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$AudioStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AudioStorage"].getAudio(audioId);
                                                    if (blob) {
                                                        setAudioUrl(URL.createObjectURL(blob));
                                                        setCurrentAudioId(audioId);
                                                        setTimeout(()=>setIsPlaying(true), 100);
                                                    } else if (project.audioUrl && !project.audioUrl.startsWith('blob:')) {
                                                        setAudioUrl(project.audioUrl);
                                                        setCurrentAudioId(audioId);
                                                        setTimeout(()=>setIsPlaying(true), 100);
                                                    } else {
                                                        alert("El archivo de audio original ya no está disponible en la memoria local. Por favor, vuelve a importarlo.");
                                                    }
                                                    if (audioRef.current) audioRef.current.currentTime = 0;
                                                },
                                                className: `flex flex-col min-w-[140px] px-4 py-2 rounded-xl transition-all border ${selectedSong === project.name ? 'bg-cyan-500/10 border-cyan-500/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-bold truncate",
                                                        children: project.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 553,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[7px] font-mono opacity-40 uppercase tracking-tighter",
                                                        children: [
                                                            "DNA: ",
                                                            project.dna
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 554,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 526,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                title: "Eliminar del historial",
                                                onClick: ()=>{
                                                    if (confirm(`¿Eliminar "${project.name}" del historial?`)) {
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useMasteringStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMasteringStore"].getState().deleteFromHistory(project.id);
                                                        if (selectedSong === project.name) setSelectedSong('');
                                                    }
                                                },
                                                className: "p-1 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 566,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 556,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, `${project.id}-${index}`, true, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 525,
                                        columnNumber: 29
                                    }, this)),
                                creatorTracks.map((track)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].initContext();
                                                    setIsPlaying(false);
                                                    setSelectedSong(track.title);
                                                    setMetadataDNA("AI CREATOR");
                                                    setAudioUrl(track.url);
                                                    setCurrentAudioId(track.id);
                                                    setTimeout(()=>setIsPlaying(true), 100);
                                                    if (audioRef.current) audioRef.current.currentTime = 0;
                                                },
                                                className: `flex flex-col min-w-[140px] px-4 py-2 rounded-xl transition-all border ${selectedSong === track.title ? 'bg-orange-500/10 border-orange-500/30 text-white shadow-[0_0_15px_rgba(255,107,0,0.1)]' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-bold truncate",
                                                        children: track.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 589,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[7px] font-mono opacity-40 uppercase tracking-tighter",
                                                        children: "SOURCE: AI CREATOR"
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 590,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 573,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                title: "Extraer stem de esta pista",
                                                onClick: ()=>setStemsModalOpen(true),
                                                className: "p-1 text-white/20 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 597,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 592,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, `creator-${track.id}`, true, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 572,
                                        columnNumber: 29
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                            lineNumber: 522,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ml-auto flex items-center gap-2 shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setStemsModalOpen(true),
                                    className: "flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 text-green-400 text-[10px] font-black tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 608,
                                            columnNumber: 29
                                        }, this),
                                        " Extraer Stems"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 604,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleImport,
                                    className: "flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 611,
                                            columnNumber: 29
                                        }, this),
                                        " Importar"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 610,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                            lineNumber: 603,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                    lineNumber: 517,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                lineNumber: 516,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full flex items-center justify-center relative z-10 gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0 transform scale-110",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$StudioMonitor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StudioMonitor"], {}, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                            lineNumber: 620,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                        lineNumber: 619,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 max-w-4xl relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.05)] border border-slate-700/30 p-4 flex flex-col gap-4 w-full max-w-5xl mx-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center px-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-8 h-8 rounded-full border border-white/20 flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-5 h-5 rounded-full border border-white/40 border-t-transparent animate-spin-slow"
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 632,
                                                            columnNumber: 37
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 631,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white font-medium tracking-widest text-sm opacity-90",
                                                        children: "DA-GRABA Studio Mastering"
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 634,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 630,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/5 rounded-full px-4 py-1.5 backdrop-blur-md border border-white/10",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] font-bold text-cyan-300 uppercase tracking-widest mr-2 cursor-pointer shadow-[0_0_10px_rgba(103,232,249,0.3)]",
                                                    children: "Master"
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 639,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 638,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "text-xs text-white/50 hover:text-white transition-colors tracking-widest uppercase",
                                                        children: "Gain Match"
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 644,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            const newIsOn = !isOn;
                                                            setIsOn(newIsOn);
                                                            setSettings((prev)=>({
                                                                    ...prev,
                                                                    gateBypass: !newIsOn,
                                                                    eqBypass: !newIsOn,
                                                                    levelerBypass: !newIsOn,
                                                                    compBypass: !newIsOn,
                                                                    mbBypass: !newIsOn,
                                                                    limBypass: !newIsOn
                                                                }));
                                                        },
                                                        className: `text-xs px-3 py-1 rounded transition-colors tracking-widest uppercase border ${isOn ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10' : 'border-white/20 text-white/50 hover:bg-white/5'}`,
                                                        children: "Bypass"
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 645,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: startAIMastering,
                                                        disabled: isAIMastering,
                                                        className: `px-3 py-1 rounded border flex items-center gap-2 text-xs font-bold tracking-widest transition-all ${isAIMastering ? 'bg-orange-500/20 border-orange-500 text-orange-400 animate-pulse' : 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/40 hover:text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 671,
                                                                columnNumber: 37
                                                            }, this),
                                                            " ",
                                                            isAIMastering ? 'AI WORKING' : 'AI MASTER'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 663,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2 text-white/30 ml-2 items-center relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "cursor-pointer hover:text-white transition-colors",
                                                                onClick: resetSettings,
                                                                children: "⟲"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 674,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "cursor-pointer hover:text-white transition-colors",
                                                                children: "⟳"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 675,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setMenuOpen(!menuOpen),
                                                                className: "p-1 hover:bg-white/10 rounded-md transition-colors hover:text-white",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                                    size: 14
                                                                }, void 0, false, {
                                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                    lineNumber: 677,
                                                                    columnNumber: 41
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 676,
                                                                columnNumber: 37
                                                            }, this),
                                                            menuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute right-0 top-full mt-2 w-48 bg-[#0B1015] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-20 animate-in fade-in slide-in-from-top-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "px-3 py-2 text-[9px] font-bold tracking-widest text-cyan-400 uppercase border-b border-white/5 bg-white/5",
                                                                        children: "Advanced Options"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 682,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: resetSettings,
                                                                        className: "w-full text-left px-4 py-3 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5",
                                                                        children: "Reset to Default"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 685,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>{
                                                                            alert("Preset guardado localmente (Simulado)");
                                                                            setMenuOpen(false);
                                                                        },
                                                                        className: "w-full text-left px-4 py-3 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5",
                                                                        children: "Save Custom Preset"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 691,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>{
                                                                            setSettings((prev)=>({
                                                                                    ...prev,
                                                                                    stereoWidth: 50,
                                                                                    inputDrive: 20
                                                                                }));
                                                                            setMenuOpen(false);
                                                                        },
                                                                        className: "w-full text-left px-4 py-3 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors",
                                                                        children: "Enable Auto-Widener"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 700,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 681,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 673,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 643,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 629,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `transition-opacity duration-500 flex flex-col gap-4 ${isOn ? 'opacity-100' : 'opacity-30 pointer-events-none'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-40 md:h-48 relative bg-slate-900/50 rounded-lg overflow-hidden border-b border-white/5",
                                                children: [
                                                    isAIMastering && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10 animate-in fade-in",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-16 h-16 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 721,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-mono text-indigo-300 tracking-widest text-center uppercase",
                                                                children: aiStatus
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 722,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 720,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$SpectrumAnalyzer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpectrumAnalyzer"], {
                                                        analyzer: __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$lib$2f$audio$2f$WebAudioEngine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audioEngine"].getTrackAnalyser('master-track'),
                                                        naked: true,
                                                        isPlaying: isPlaying
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 725,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute bottom-2 left-0 right-0 flex justify-between px-8 pointer-events-none opacity-30 text-[9px] font-mono text-white",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "20"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 732,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "50"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 732,
                                                                columnNumber: 52
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "100"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 732,
                                                                columnNumber: 67
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "200"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 732,
                                                                columnNumber: 83
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 732,
                                                                columnNumber: 99
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "1K"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 732,
                                                                columnNumber: 115
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "2K"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 732,
                                                                columnNumber: 130
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "5K"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 732,
                                                                columnNumber: 145
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "10K"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 732,
                                                                columnNumber: 160
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "20K"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 732,
                                                                columnNumber: 176
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 731,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 718,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-center -mt-10 relative z-10",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex bg-slate-800/80 backdrop-blur-xl rounded-full p-1 border border-slate-600/50 shadow-2xl",
                                                    children: [
                                                        'DGB_BOLERO',
                                                        'DGB_BACHATA',
                                                        'DGB_MERENGUE'
                                                    ].map((genre)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                setSelectedGenre(genre);
                                                                if (genre === 'DGB_BOLERO') {
                                                                    // Warm preset: boost low, cut high slightly, gentle comp
                                                                    setSettings((prev)=>({
                                                                            ...prev,
                                                                            eqHighpass: 65,
                                                                            eqTilt: 50,
                                                                            eqSideGain: 40,
                                                                            eqSideFreq: 0,
                                                                            compStrength: 25
                                                                        }));
                                                                } else if (genre === 'DGB_BACHATA') {
                                                                    // Balanced preset: slight mid boost, medium comp
                                                                    setSettings((prev)=>({
                                                                            ...prev,
                                                                            eqHighpass: 55,
                                                                            eqTilt: 55,
                                                                            eqSideGain: 55,
                                                                            eqSideFreq: 10,
                                                                            compStrength: 45
                                                                        }));
                                                                } else if (genre === 'DGB_MERENGUE') {
                                                                    // Open preset: neutral low, boost high, boost presence, strong comp
                                                                    setSettings((prev)=>({
                                                                            ...prev,
                                                                            eqHighpass: 50,
                                                                            eqTilt: 45,
                                                                            eqSideGain: 65,
                                                                            eqSideFreq: 30,
                                                                            compStrength: 70
                                                                        }));
                                                                }
                                                            },
                                                            className: `px-8 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${selectedGenre === genre ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)] text-white' : 'text-white/40 hover:text-white/80'}`,
                                                            children: genre === 'DGB_BOLERO' ? 'Warm' : genre === 'DGB_BACHATA' ? 'Balanced' : 'Open'
                                                        }, genre, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 740,
                                                            columnNumber: 41
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 738,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 737,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-12 gap-4 px-4 pb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-3 flex flex-col items-center gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-bold text-white/30 tracking-widest uppercase",
                                                                children: "Equalizer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 771,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                        label: "Low",
                                                                        value: settings.eqHighpass,
                                                                        onChange: (v)=>setSettings({
                                                                                ...settings,
                                                                                eqHighpass: v
                                                                            }),
                                                                        size: "sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 773,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                        label: "Mid",
                                                                        value: settings.eqTilt,
                                                                        onChange: (v)=>setSettings({
                                                                                ...settings,
                                                                                eqTilt: v
                                                                            }),
                                                                        size: "sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 774,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                        label: "High",
                                                                        value: settings.eqSideGain,
                                                                        onChange: (v)=>setSettings({
                                                                                ...settings,
                                                                                eqSideGain: v
                                                                            }),
                                                                        size: "sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 775,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 772,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 770,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-2 flex flex-col items-center gap-4 border-l border-white/5 pl-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-bold text-white/30 tracking-widest uppercase",
                                                                children: "Presence"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 781,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                label: "Amount",
                                                                value: settings.eqSideFreq,
                                                                onChange: (v)=>setSettings({
                                                                        ...settings,
                                                                        eqSideFreq: v
                                                                    }),
                                                                size: "md"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 782,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 780,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-2 flex flex-col items-center gap-4 border-l border-white/5 pl-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-bold text-white/30 tracking-widest uppercase",
                                                                children: "De-Esser"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 787,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                        label: "Amount",
                                                                        value: settings.mbStrengthHigh,
                                                                        onChange: (v)=>setSettings({
                                                                                ...settings,
                                                                                mbStrengthHigh: v
                                                                            }),
                                                                        size: "sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 789,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                        label: "Freq",
                                                                        value: settings.mbCrossoverHigh,
                                                                        onChange: (v)=>setSettings({
                                                                                ...settings,
                                                                                mbCrossoverHigh: v
                                                                            }),
                                                                        size: "sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 790,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 788,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 786,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-3 flex flex-col items-center gap-4 border-l border-white/5 pl-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-bold text-white/30 tracking-widest uppercase",
                                                                children: "Dynamics"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 796,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                        label: "Comp",
                                                                        value: settings.compStrength,
                                                                        onChange: (v)=>setSettings({
                                                                                ...settings,
                                                                                compStrength: v
                                                                            }),
                                                                        size: "sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 798,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                        label: "Chrc",
                                                                        value: settings.compAttack,
                                                                        onChange: (v)=>setSettings({
                                                                                ...settings,
                                                                                compAttack: v
                                                                            }),
                                                                        size: "sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 799,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                        label: "Sat",
                                                                        value: settings.inputDrive,
                                                                        onChange: (v)=>setSettings({
                                                                                ...settings,
                                                                                inputDrive: v
                                                                            }),
                                                                        size: "sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 800,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 797,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 795,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-2 flex flex-col items-center justify-between border-l border-white/5 pl-4 h-full",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-bold text-white/30 tracking-widest uppercase",
                                                                children: "Loudness"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 806,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-4 w-full justify-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col items-center -mr-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$MasteringKnob$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MasteringKnob"], {
                                                                                label: "",
                                                                                value: settings.levelerTarget,
                                                                                onChange: (v)=>setSettings({
                                                                                        ...settings,
                                                                                        levelerTarget: v
                                                                                    }),
                                                                                size: "lg"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                lineNumber: 809,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[9px] text-white/40 font-medium tracking-widest mt-2",
                                                                                children: [
                                                                                    (-14 + settings.levelerTarget / 100 * 8).toFixed(1),
                                                                                    " LUFS"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                lineNumber: 810,
                                                                                columnNumber: 45
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 808,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[8px] font-mono text-cyan-400",
                                                                                children: "-0.2 dB"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                lineNumber: 816,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "w-2 h-24 bg-black rounded-sm relative overflow-hidden ring-1 ring-white/10",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "absolute bottom-0 w-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-white transition-all shadow-[0_0_10px_rgba(6,182,212,0.8)]",
                                                                                    style: {
                                                                                        height: `${isPlaying ? 60 + Math.random() * 30 : 0}%`
                                                                                    }
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                    lineNumber: 818,
                                                                                    columnNumber: 49
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                                lineNumber: 817,
                                                                                columnNumber: 45
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                        lineNumber: 815,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 807,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 805,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 767,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-2 px-8 pb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[9px] font-bold text-white/30 tracking-widest uppercase",
                                                        children: "Stereo Field"
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 828,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-4 w-48",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] text-white/40",
                                                                children: "Focus"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 830,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "range",
                                                                min: "0",
                                                                max: "100",
                                                                value: settings.stereoWidth,
                                                                onChange: (e)=>setSettings({
                                                                        ...settings,
                                                                        stereoWidth: parseFloat(e.target.value)
                                                                    }),
                                                                className: "flex-1 h-0.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 outline-none"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 831,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] text-blue-400 font-bold",
                                                                children: [
                                                                    settings.stereoWidth,
                                                                    "% Wide"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 838,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                        lineNumber: 829,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                lineNumber: 827,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 715,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                lineNumber: 626,
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
                                                            lineNumber: 851,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 852,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 850,
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
                                                            lineNumber: 855,
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
                                                            lineNumber: 856,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white/20 font-mono text-[8px] uppercase mt-1",
                                                            children: "24-BIT / 44.1KHZ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 857,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 854,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 849,
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
                                                                lineNumber: 864,
                                                                columnNumber: 106
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 864,
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
                                                                lineNumber: 869,
                                                                columnNumber: 54
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                                size: 24,
                                                                fill: "black",
                                                                className: "text-black ml-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 869,
                                                                columnNumber: 112
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 865,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleExport,
                                                            className: "text-white/20 hover:text-green-400 transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                size: 16
                                                            }, void 0, false, {
                                                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                lineNumber: 871,
                                                                columnNumber: 133
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 871,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 863,
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
                                                            lineNumber: 876,
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
                                                                lineNumber: 889,
                                                                columnNumber: 41
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 880,
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
                                                            lineNumber: 891,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 875,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 862,
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
                                                                    lineNumber: 903,
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
                                                                            lineNumber: 906,
                                                                            columnNumber: 49
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                    lineNumber: 904,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 902,
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
                                                                    lineNumber: 918,
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
                                                                            lineNumber: 921,
                                                                            columnNumber: 49
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                                    lineNumber: 919,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 917,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 900,
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
                                                            lineNumber: 933,
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
                                                            lineNumber: 934,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 932,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 898,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 847,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                lineNumber: 846,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                        lineNumber: 624,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0 transform scale-110",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$StudioMonitor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StudioMonitor"], {}, void 0, false, {
                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                            lineNumber: 955,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                        lineNumber: 954,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                lineNumber: 617,
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
                                                        lineNumber: 968,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 967,
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
                                                            lineNumber: 971,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[7px] font-mono text-cyan-400/60 uppercase",
                                                            children: "Especialista en Masterización"
                                                        }, void 0, false, {
                                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                            lineNumber: 972,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                                    lineNumber: 970,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 966,
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
                                                lineNumber: 976,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                            lineNumber: 975,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 965,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-hidden relative",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$StudioChat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StudioChat"], {
                                        embedded: true,
                                        songName: selectedSong,
                                        onExecuteMastering: startAIMastering
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 985,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                    lineNumber: 984,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                            lineNumber: 963,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                        lineNumber: 962,
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
                                        lineNumber: 1003,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                        size: 20,
                                        className: `text-white absolute inset-0 transition-all duration-500 ${chatOpen ? 'rotate-0' : 'opacity-0 -rotate-90'}`
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 1004,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                lineNumber: 1002,
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
                                        lineNumber: 1007,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[8px] font-mono text-white/40 uppercase mt-1 tracking-tighter",
                                        children: "Consultar con John"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                        lineNumber: 1008,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                lineNumber: 1006,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-white/20'}`
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                                lineNumber: 1010,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                        lineNumber: 995,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                lineNumber: 960,
                columnNumber: 13
            }, this),
            stemsModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$components$2f$daw$2f$StemExtractModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StemExtractModal"], {
                onClose: ()=>setStemsModalOpen(false)
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
                lineNumber: 1014,
                columnNumber: 32
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/app/[locale]/mastering/page.tsx",
        lineNumber: 497,
        columnNumber: 9
    }, this);
}
_s(Mastering, "S106RErRo/w/ZFMmqKjxuVDN34Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useUserStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useMasteringStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMasteringStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useCreatorStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreatorStore"]
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

//# sourceMappingURL=development_Da%20Graba_Studio_c7706efb._.js.map