export interface TrackChain {
    input: GainNode;
    inserts: AudioNode[];
    gate?: DynamicsCompressorNode;
    eqBands?: BiquadFilterNode[]; // [lowShelf, midPeak, highShelf, presencePeak]
    compressor?: DynamicsCompressorNode;
    makeup?: GainNode;
    limiter?: DynamicsCompressorNode;
    wasmLimiter?: AudioWorkletNode;
    muteGain: GainNode; // Dedicated node for Mute/Solo
    output: GainNode;
    panner: StereoPannerNode;
    analyser: AnalyserNode;
    stemDSP?: {
        splitter: ChannelSplitterNode;
        merger: ChannelMergerNode;
        midGain: GainNode;
        sideGain: GainNode;
        filters: BiquadFilterNode[];
    };
    source?: MediaElementAudioSourceNode | AudioBufferSourceNode;
    isMuted: boolean;
    isSoloed: boolean;
}

class WebAudioEngine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private trackChains: Map<string, TrackChain> = new Map();
    private sourceNodeMap: WeakMap<HTMLMediaElement, MediaElementAudioSourceNode> = new WeakMap();
    private isPlaying = false;
    private playhead = 0;
    private startTime = 0;
    private soloedTracks: Set<string> = new Set();
    private dspWorkletReady = false;

    constructor() {
        // We delay context creation until a user interaction (play)
    }

    public initContext() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    private getOrCreateTrack(trackId: string): TrackChain {
        this.initContext();
        if (!this.trackChains.has(trackId)) {
            const ctx = this.ctx!;
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
            analyser.connect(this.masterGain!);

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
        return this.trackChains.get(trackId)!;
    }

    init(sampleRate: number, bufferSize: number) {
        console.log(`[WebAudioEngine] Ready for initialization. context will start on play.`);
        return true;
    }

    /**
     * Loads the AudioWorklet for the WebAssembly C++ engine.
     * To be called when the user wants to switch to the professional offline engine.
     */
    async loadWasmLimiter() {
        this.initContext();
        try {
            await this.ctx!.audioWorklet.addModule('/wasm/phaselimiter-worklet.js');
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
     */
    async loadDaGrabaDSP(): Promise<boolean> {
        if (this.dspWorkletReady) return true;
        this.initContext();
        try {
            await this.ctx!.audioWorklet.addModule('/wasm/dagraba-dsp-worklet.js');
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
     */
    async insertWasmPlugin(trackId: string, plugin: 'compressor' | 'saturator' | 'eq'): Promise<AudioWorkletNode | null> {
        await this.loadDaGrabaDSP();
        if (!this.dspWorkletReady || !this.ctx) return null;

        const chain = this.getOrCreateTrack(trackId);

        const node = new AudioWorkletNode(this.ctx, 'dagraba-dsp-processor', {
            processorOptions: { plugin },
            numberOfInputs: 1,
            numberOfOutputs: 1,
            outputChannelCount: [2]
        });

        // Insert into chain: after input, before panner
        // For simplicity, chain the worklet between input and panner
        const prevLast = chain.inserts.length > 0 ? chain.inserts[chain.inserts.length - 1] : chain.input;
        try { prevLast.disconnect(chain.panner); } catch (e) { }
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
        this.startTime = this.ctx!.currentTime - this.playhead;
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

    setPlayheadPosition(seconds: number) {
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

    setTrackVolume(trackId: string, value: number) {
        // value 0-100 to gain 0-1
        const chain = this.getOrCreateTrack(trackId);
        const gainValue = value / 100;
        chain.output.gain.setTargetAtTime(gainValue, this.ctx!.currentTime, 0.05);
    }

    setTrackPan(trackId: string, value: number) {
        // value -50 to 50 to pan -1 to 1
        const chain = this.getOrCreateTrack(trackId);
        const panValue = value / 50;
        chain.panner.pan.setTargetAtTime(panValue, this.ctx!.currentTime, 0.05);
    }

    setTrackMute(trackId: string, isMuted: boolean) {
        const chain = this.getOrCreateTrack(trackId);
        chain.isMuted = isMuted;
        this.updateRoutingLevels();
    }

    setTrackSolo(trackId: string, isSolo: boolean) {
        const chain = this.getOrCreateTrack(trackId);
        chain.isSoloed = isSolo;

        if (isSolo) {
            this.soloedTracks.add(trackId);
        } else {
            this.soloedTracks.delete(trackId);
        }

        this.updateRoutingLevels();
    }

    private updateRoutingLevels() {
        // A track is audible IF (no tracks are soloed OR it is soloed) AND (it is not muted)
        const hasSolo = this.soloedTracks.size > 0;

        this.trackChains.forEach((chain, id) => {
            const shouldBeHeard = (hasSolo ? chain.isSoloed : true) && !chain.isMuted;
            const targetGain = shouldBeHeard ? 1 : 0;
            chain.muteGain.gain.setTargetAtTime(targetGain, this.ctx!.currentTime, 0.05);
        });
    }

    moveAudioClip(clipId: string, newTime: number) {
        // Dummy implementation
    }

    getWaveformData(clipId: string, arg2?: any): number[] {
        // Dummy implementation
        return [];
    }

    // New method to connect a real audio element (like in the mastering page)
    connectAudioElement(trackId: string, element: HTMLMediaElement) {
        this.initContext();
        const chain = this.getOrCreateTrack(trackId);

        // Disconnect previous source associated with this track chain to prevent accumulation
        if (chain.source) {
            try { chain.source.disconnect(); } catch (e) { }
        }

        let source = this.sourceNodeMap.get(element);
        if (!source) {
            try {
                source = this.ctx!.createMediaElementSource(element);
                this.sourceNodeMap.set(element, source);
            } catch (e) {
                console.warn('Failed to create media element source', e);
                return;
            }
        }

        try { source.disconnect(); } catch (e) { }
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

    private applyStemSeparation(trackId: string, type: string) {
        const chain = this.getOrCreateTrack(trackId);
        const ctx = this.ctx!;

        // Clean up previous stem DSP if any
        if (chain.stemDSP) {
            try {
                chain.input.disconnect(chain.stemDSP.splitter);
                chain.stemDSP.merger.disconnect();
                chain.stemDSP.filters.forEach(f => f.disconnect());
            } catch (e) { }
        }

        const splitter = ctx.createChannelSplitter(2);
        const merger = ctx.createChannelMerger(2);
        const midGain = ctx.createGain();
        const sideGain = ctx.createGain();
        const filters: BiquadFilterNode[] = [];

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

        chain.stemDSP = { splitter, merger, midGain, sideGain, filters };
        console.log(`[WebAudioEngine] Applied SSE separation for stem: ${type} on track: ${trackId}`);
    }

    /**
     * Performs an offline analysis of an audio file to determine its "DNA" (RMS, Peak, Crest Factor).
     * Used by the AI to set accurate dynamic and loudness targets.
     */
    async analyzeAudioBuffer(audioUrl: string): Promise<{ rms: number, peak: number, crestFactor: number } | null> {
        try {
            console.log('[WebAudioEngine] Fetching audio for analysis...');
            const response = await fetch(audioUrl);
            const arrayBuffer = await response.arrayBuffer();

            // Use an OfflineAudioContext just to decode (or use main ctx)
            this.initContext();
            console.log('[WebAudioEngine] Decoding audio data...');
            const audioBuffer = await this.ctx!.decodeAudioData(arrayBuffer);

            const channelData = audioBuffer.getChannelData(0); // Analyze left/mono channel for speed
            let sumSquares = 0;
            let peak = 0;

            // Calculate RMS and Peak
            console.log('[WebAudioEngine] Calculating RMS and Peak...');
            const length = channelData.length;
            const step = Math.max(1, Math.floor(length / 441000)); // Sample every ~100ms to speed up analysis if huge, or just process all if fast

            // For true accuracy, process all samples, it's usually less than 100ms in a Wasm/V8 loop
            for (let i = 0; i < length; i += 1) {
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

    getVUMeterLevel(trackId: string): number {
        const chain = this.trackChains.get(trackId);
        if (!chain) return 0;

        const dataArray = new Uint8Array(chain.analyser.frequencyBinCount);
        chain.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        return Math.floor((sum / dataArray.length) * 1.5);
    }

    getFrequencyLevel(trackId: string, minFreq: number, maxFreq: number): number {
        const chain = this.trackChains.get(trackId);
        if (!chain || !this.ctx) return 0;

        const bufferLength = chain.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        chain.analyser.getByteFrequencyData(dataArray);

        const nyquist = this.ctx.sampleRate / 2;
        const indexMin = Math.round((minFreq / nyquist) * bufferLength);
        const indexMax = Math.round((maxFreq / nyquist) * bufferLength);

        let sum = 0;
        let count = 0;
        for (let i = indexMin; i <= indexMax; i++) {
            sum += dataArray[i];
            count++;
        }

        return count > 0 ? sum / count / 255 : 0;
    }

    getTrackAnalyser(trackId: string): AnalyserNode | undefined {
        return this.trackChains.get(trackId)?.analyser;
    }

    // --- Plugin System ---

    updateGate(trackId: string, threshold: number, bypass: boolean) {
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.gate) {
            // Real noise gates are complex in WebAudio without script processors.
            // A compressor acts backwards (reduces loud, not quiet).
            // We'll leave the node for routing but keep it fully transparent.
            const gate = this.ctx!.createDynamicsCompressor();
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
        chain.gate.ratio.setTargetAtTime(1, this.ctx!.currentTime, 0.1);
        chain.gate.threshold.setTargetAtTime(0, this.ctx!.currentTime, 0.1);
    }

    updateEQ(trackId: string, highpass: number, tilt: number, sideGain: number, sideFreq: number, bypass: boolean) {
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.eqBands) {
            const low = this.ctx!.createBiquadFilter();
            low.type = 'lowshelf';
            low.frequency.value = 80;

            const mid = this.ctx!.createBiquadFilter();
            mid.type = 'peaking';
            mid.frequency.value = 1000;
            mid.Q.value = 0.5;

            const high = this.ctx!.createBiquadFilter();
            high.type = 'highshelf';
            high.frequency.value = 6000;

            const presence = this.ctx!.createBiquadFilter();
            presence.type = 'peaking';
            presence.frequency.value = 3500;
            presence.Q.value = 1.0;

            low.connect(mid);
            mid.connect(high);
            high.connect(presence);

            chain.eqBands = [low, mid, high, presence];

            // Re-route
            const prevNode = chain.gate || chain.input;
            prevNode.disconnect();
            prevNode.connect(low);
            const nextNode = chain.compressor || chain.makeup || chain.limiter || chain.panner;
            presence.connect(nextNode);
        }

        const [low, mid, high, presence] = chain.eqBands;

        if (bypass) {
            low.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.1);
            mid.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.1);
            high.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.1);
            presence.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.1);
        } else {
            // Knob (0-100) Maps to (-12dB to +12dB). Neutral is 50.
            low.gain.setTargetAtTime((highpass - 50) * 0.24, this.ctx!.currentTime, 0.1);
            mid.gain.setTargetAtTime((tilt - 50) * 0.24, this.ctx!.currentTime, 0.1);
            high.gain.setTargetAtTime((sideGain - 50) * 0.24, this.ctx!.currentTime, 0.1);
            // Presence (0-100) maps to (0dB to +6dB). Neutral is 0.
            presence.gain.setTargetAtTime((sideFreq / 100) * 6, this.ctx!.currentTime, 0.1);
        }
    }

    updateCompressor(trackId: string, strength: number, attack: number, release: number, bypass: boolean) {
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.compressor) {
            chain.compressor = this.ctx!.createDynamicsCompressor();
            // Re-route
            const prevNode = (chain.eqBands ? chain.eqBands[chain.eqBands.length - 1] : null) || chain.gate || chain.input;
            prevNode.disconnect();
            prevNode.connect(chain.compressor);
            const nextNode = chain.makeup || chain.limiter || chain.panner;
            chain.compressor.connect(nextNode);
        }

        if (bypass) {
            chain.compressor.ratio.setTargetAtTime(1, this.ctx!.currentTime, 0.1);
        } else {
            // Strength (0-100) -> Threshold (-10 to -25dB), Ratio (1.2 to 4.0)
            const threshold = -10 - ((strength / 100) * 15);
            const ratio = 1.2 + ((strength / 100) * 2.8);

            chain.compressor.threshold.setTargetAtTime(threshold, this.ctx!.currentTime, 0.1);
            chain.compressor.ratio.setTargetAtTime(ratio, this.ctx!.currentTime, 0.1);
            chain.compressor.attack.setTargetAtTime(attack / 1000, this.ctx!.currentTime, 0.1);
            chain.compressor.release.setTargetAtTime(release / 1000, this.ctx!.currentTime, 0.1);
        }
    }

    updateLeveler(trackId: string, target: number, bypass: boolean) {
        // We use Leveler as the Makeup Gain before the Limiter!
        const chain = this.getOrCreateTrack(trackId);

        if (!chain.makeup) {
            chain.makeup = this.ctx!.createGain();
            const prevNode = chain.compressor || (chain.eqBands ? chain.eqBands[chain.eqBands.length - 1] : null) || chain.gate || chain.input;
            prevNode.disconnect();
            prevNode.connect(chain.makeup);
            const nextNode = chain.limiter || chain.panner;
            chain.makeup.connect(nextNode);
        }

        if (bypass) {
            chain.makeup.gain.setTargetAtTime(1, this.ctx!.currentTime, 0.1);
        } else {
            // Target (0-100) maps to 0dB to +15dB of gain!
            // This gain pushes the signal into the limiter (Loudness Maximizer)
            const dbGain = (target / 100) * 15; // 0 to +15 dB
            const gainValue = Math.pow(10, dbGain / 20);
            chain.makeup.gain.setTargetAtTime(gainValue, this.ctx!.currentTime, 0.1);
        }
    }

    updateLimiter(trackId: string, strength: number, ceiling: number, bypass: boolean, useWasm: boolean = false) {
        const chain = this.getOrCreateTrack(trackId);

        if (useWasm) {
            if (!chain.wasmLimiter) {
                try {
                    chain.wasmLimiter = new AudioWorkletNode(this.ctx!, 'phaselimiter-worklet');
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
                const ceilingDb = -0.3 - ((strength / 100) * 2.7); // -0.3 to -3 dBFS
                chain.wasmLimiter.port.postMessage({
                    type: 'params',
                    ceiling: bypass ? 0 : ceilingDb,
                    strength: strength / 100,
                    bypass,
                });
                return;
            }
        }

        // Disconnect WASM if it was connected and we're falling back
        if (chain.wasmLimiter) {
            chain.wasmLimiter.disconnect();
        }

        if (!chain.limiter) {
            chain.limiter = this.ctx!.createDynamicsCompressor();
            chain.limiter.ratio.value = 50;
            chain.limiter.attack.value = 0.001;
            chain.limiter.release.value = 0.05;
            const prevNode = chain.makeup || chain.compressor || (chain.eqBands ? chain.eqBands[chain.eqBands.length - 1] : null) || chain.gate || chain.input;
            prevNode.disconnect();
            prevNode.connect(chain.limiter);
            chain.limiter.connect(chain.panner);
        }

        if (bypass) {
            chain.limiter.ratio.setTargetAtTime(1, this.ctx!.currentTime, 0.1);
        } else {
            const threshold = ceiling - ((strength / 100) * 3);
            chain.limiter.threshold.setTargetAtTime(threshold, this.ctx!.currentTime, 0.1);
        }
    }


    updateMultiband(trackId: string, lowStr: number, highStr: number, bypass: boolean) {
        // Placeholder for multiband - logic would require a splitter and multiple compressors
        // For now, let's just use it as a global tone shaper or additional compression
    }
}

export const audioEngine = new WebAudioEngine();
