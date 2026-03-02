export interface TrackChain {
    input: GainNode;
    inserts: AudioNode[];
    gate?: DynamicsCompressorNode;
    eqBands?: BiquadFilterNode[]; // [lowShelf, midPeak, highShelf, presencePeak]
    proEqBands?: BiquadFilterNode[]; // 10 bands
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
    recorder?: MediaRecorder;
    recordedChunks: Blob[];
    inputNode?: MediaStreamAudioSourceNode;
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
    private inputStream: MediaStream | null = null;

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
                isSoloed: false,
                recordedChunks: []
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

    private rebuildChain(trackId: string) {
        const chain = this.getOrCreateTrack(trackId);

        // Helper to disconnect a node if it exists
        const safeDisconnect = (node: AudioNode | undefined) => {
            if (node) {
                try { node.disconnect(); } catch (e) { }
            }
        };

        safeDisconnect(chain.input);
        safeDisconnect(chain.gate);
        if (chain.eqBands) safeDisconnect(chain.eqBands[chain.eqBands.length - 1]);
        if (chain.proEqBands) safeDisconnect(chain.proEqBands[chain.proEqBands.length - 1]);
        safeDisconnect(chain.compressor);
        safeDisconnect(chain.makeup);
        safeDisconnect(chain.limiter);
        safeDisconnect(chain.wasmLimiter);

        let current: AudioNode = chain.input;

        if (chain.gate) { current.connect(chain.gate); current = chain.gate; }
        if (chain.eqBands) { current.connect(chain.eqBands[0]); current = chain.eqBands[chain.eqBands.length - 1]; }
        if (chain.proEqBands) { current.connect(chain.proEqBands[0]); current = chain.proEqBands[chain.proEqBands.length - 1]; }
        if (chain.compressor) { current.connect(chain.compressor); current = chain.compressor; }
        if (chain.makeup) { current.connect(chain.makeup); current = chain.makeup; }

        if (chain.wasmLimiter) {
            current.connect(chain.wasmLimiter);
            current = chain.wasmLimiter;
        } else if (chain.limiter) {
            current.connect(chain.limiter);
            current = chain.limiter;
        }

        current.connect(chain.panner);
    }

    updateGate(trackId: string, threshold: number, bypass: boolean) {
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.gate) {
            const gate = this.ctx!.createDynamicsCompressor();
            gate.ratio.value = 1; // 1:1 ratio (no compression)
            gate.threshold.value = 0; // 0 dB 
            chain.gate = gate;
            this.rebuildChain(trackId);
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
            this.rebuildChain(trackId);
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
            this.rebuildChain(trackId);
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
            this.rebuildChain(trackId);
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
                    this.rebuildChain(trackId);
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
            this.rebuildChain(trackId);
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

    updateProEQ(trackId: string, bands: number[], bypass: boolean) {
        const chain = this.getOrCreateTrack(trackId);

        if (!chain.proEqBands) {
            const freqs = [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
            const nodes = freqs.map(f => {
                const filter = this.ctx!.createBiquadFilter();
                filter.type = 'peaking';
                if (f === 31) filter.type = 'lowshelf';
                if (f === 16000) filter.type = 'highshelf';
                filter.frequency.value = f;
                // Quality factor of 1.414 gives approximately 1 octave bandwidth
                filter.Q.value = 1.414;
                return filter;
            });

            for (let i = 0; i < nodes.length - 1; i++) {
                nodes[i].connect(nodes[i + 1]);
            }
            chain.proEqBands = nodes;
            this.rebuildChain(trackId);
        }

        chain.proEqBands.forEach((filter, i) => {
            if (bypass) {
                filter.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.1);
            } else {
                // bands[i] is between -100 and 100. Map to -12dB to +12dB
                const dbGain = (bands[i] / 100) * 12;
                filter.gain.setTargetAtTime(dbGain, this.ctx!.currentTime, 0.1);
            }
        });
    }

    // --- Audio Device Management ---

    async getAudioDevices(): Promise<{ inputs: MediaDeviceInfo[], outputs: MediaDeviceInfo[] }> {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
            return { inputs: [], outputs: [] };
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return {
                inputs: devices.filter(d => d.kind === 'audioinput'),
                outputs: devices.filter(d => d.kind === 'audiooutput')
            };
        } catch (err) {
            console.error('[WebAudioEngine] Error enumerating devices:', err);
            return { inputs: [], outputs: [] };
        }
    }

    async setupRecordingStream(trackId: string, inputDeviceId: string): Promise<boolean> {
        this.initContext();
        const chain = this.getOrCreateTrack(trackId);

        try {
            // If we already have a stream, clean up the old input node for this track
            if (chain.inputNode) {
                chain.inputNode.disconnect();
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: inputDeviceId ? { exact: inputDeviceId } : undefined,
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });

            this.inputStream = stream;
            const source = this.ctx!.createMediaStreamSource(stream);
            source.connect(chain.input);
            chain.inputNode = source;

            console.log(`[WebAudioEngine] Recording stream setup for track ${trackId}`);
            return true;
        } catch (err) {
            console.error(`[WebAudioEngine] Failed to setup recording stream for track ${trackId}:`, err);
            return false;
        }
    }

    // --- Recording Logic ---

    startRecording(armedTrackIds: string[]) {
        if (this.isRecording()) return;
        this.initContext();

        armedTrackIds.forEach(id => {
            const chain = this.getOrCreateTrack(id);
            if (!chain.inputNode) {
                console.warn(`[WebAudioEngine] No input node for track ${id}. Cannot record.`);
                return;
            }

            const stream = chain.inputNode.mediaStream;
            const recorder = new MediaRecorder(stream);
            chain.recordedChunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chain.recordedChunks.push(e.data);
            };

            recorder.start();
            chain.recorder = recorder;
            console.log(`[WebAudioEngine] Started recording on track ${id}`);
        });
    }

    async stopRecording(armedTrackIds: string[]): Promise<Map<string, Blob>> {
        const results = new Map<string, Blob>();

        const stopPromises = armedTrackIds.map(id => {
            return new Promise<void>((resolve) => {
                const chain = this.getOrCreateTrack(id);
                if (chain.recorder && chain.recorder.state !== 'inactive') {
                    chain.recorder.onstop = () => {
                        const blob = new Blob(chain.recordedChunks, { type: 'audio/wav' });
                        results.set(id, blob);
                        chain.recordedChunks = [];
                        resolve();
                    };
                    chain.recorder.stop();
                    console.log(`[WebAudioEngine] Stopped recording on track ${id}`);
                } else {
                    resolve();
                }
            });
        });

        await Promise.all(stopPromises);
        return results;
    }

    isRecording(): boolean {
        return Array.from(this.trackChains.values()).some(c => c.recorder && c.recorder.state === 'recording');
    }
}

export const audioEngine = new WebAudioEngine();
