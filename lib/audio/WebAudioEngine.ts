export interface TrackChain {
    input: GainNode; 
    inserts: AudioNode[];
    gate?: DynamicsCompressorNode;
    eq?: BiquadFilterNode;
    compressor?: DynamicsCompressorNode;
    limiter?: DynamicsCompressorNode;
    output: GainNode; 
    panner: StereoPannerNode;
    analyser: AnalyserNode;
    source?: MediaElementAudioSourceNode | AudioBufferSourceNode;
}

class WebAudioEngine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private trackChains: Map<string, TrackChain> = new Map();
    private isPlaying = false;
    private playhead = 0;
    private startTime = 0;

    constructor() {
        // We delay context creation until a user interaction (play)
    }

    private initContext() {
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
            const output = ctx.createGain();
            const panner = ctx.createStereoPanner();
            const analyser = ctx.createAnalyser();

            analyser.fftSize = 256;

            // Initial chain: Input -> Pan -> Output -> Analyser -> Master
            input.connect(panner);
            panner.connect(output);
            output.connect(analyser);
            analyser.connect(this.masterGain!);

            this.trackChains.set(trackId, { input, output, panner, analyser, inserts: [] });
        }
        return this.trackChains.get(trackId)!;
    }

    init(sampleRate: number, bufferSize: number) {
        console.log(`[WebAudioEngine] Ready for initialization. context will start on play.`);
        return true;
    }

    play() {
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
        const gainValue = isMuted ? 0 : 1; // This should ideally be multiplied by the fader value
        // For simplicity, we'll store the target gain elsewhere or just use 0/1 for now
        // A better way is to have another GainNode for mute
    }

    // New method to connect a real audio element (like in the mastering page)
    connectAudioElement(trackId: string, element: HTMLMediaElement) {
        this.initContext();
        const chain = this.getOrCreateTrack(trackId);
        
        if (chain.source) {
            // We don't want to recreate the source if it's the same element
            // But since we can't easily check, we just hope the caller handles it
            return; 
        }

        const source = this.ctx!.createMediaElementSource(element);
        source.connect(chain.input); 
        chain.source = source;
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
            // Simple gate using a DynamicsCompressor with extreme settings
            const gate = this.ctx!.createDynamicsCompressor();
            gate.ratio.value = 20;
            gate.attack.value = 0.001;
            gate.release.value = 0.1;
            chain.gate = gate;
            
            // Route: input -> gate -> [eq] -> [compressor] -> [limiter] -> panner
            chain.input.disconnect();
            chain.input.connect(gate);
            const nextNode = chain.eq || chain.compressor || chain.limiter || chain.panner;
            gate.connect(nextNode);
        }

        // To "bypass", we set threshold to a very low value or high value 
        // depending on the node type. For a gate-like compressor, threshold 0 means no compression.
        // real gate logic is harder, but let's just use gain for bypass
        if (bypass) {
            chain.gate.ratio.setTargetAtTime(1, this.ctx!.currentTime, 0.1);
            chain.gate.threshold.setTargetAtTime(0, this.ctx!.currentTime, 0.1);
        } else {
            // Map 0-100 to -100 to 0
            chain.gate.ratio.setTargetAtTime(20, this.ctx!.currentTime, 0.1);
            const threshValue = -((100 - threshold));
            chain.gate.threshold.setTargetAtTime(threshValue, this.ctx!.currentTime, 0.1);
        }
    }

    updateEQ(trackId: string, highpass: number, tilt: number, bypass: boolean) {
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.eq) {
            chain.eq = this.ctx!.createBiquadFilter();
            chain.eq.type = 'highpass';
            // Re-route
            const prevNode = chain.gate || chain.input;
            prevNode.disconnect();
            prevNode.connect(chain.eq);
            const nextNode = chain.compressor || chain.limiter || chain.panner;
            chain.eq.connect(nextNode);
        }
        
        if (bypass) {
            chain.eq.frequency.setTargetAtTime(10, this.ctx!.currentTime, 0.1); // effectively off
        } else {
            chain.eq.frequency.setTargetAtTime(highpass, this.ctx!.currentTime, 0.1);
        }
    }

    updateCompressor(trackId: string, strength: number, attack: number, release: number, bypass: boolean) {
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.compressor) {
            chain.compressor = this.ctx!.createDynamicsCompressor();
            // Re-route
            const prevNode = chain.eq || chain.gate || chain.input;
            prevNode.disconnect();
            prevNode.connect(chain.compressor);
            const nextNode = chain.limiter || chain.panner;
            chain.compressor.connect(nextNode);
        }

        if (bypass) {
            chain.compressor.ratio.setTargetAtTime(1, this.ctx!.currentTime, 0.1);
        } else {
            const threshold = -((strength / 100) * 60);
            const ratio = 1 + (strength / 100) * 19;
            chain.compressor.threshold.setTargetAtTime(threshold, this.ctx!.currentTime, 0.1);
            chain.compressor.ratio.setTargetAtTime(ratio, this.ctx!.currentTime, 0.1);
            chain.compressor.attack.setTargetAtTime(attack / 1000, this.ctx!.currentTime, 0.1);
            chain.compressor.release.setTargetAtTime(release / 1000, this.ctx!.currentTime, 0.1);
        }
    }

    updateLimiter(trackId: string, strength: number, ceiling: number, bypass: boolean) {
        const chain = this.getOrCreateTrack(trackId);
        if (!chain.limiter) {
            chain.limiter = this.ctx!.createDynamicsCompressor();
            chain.limiter.ratio.value = 20;
            chain.limiter.attack.value = 0.001;
            chain.limiter.release.value = 0.05;
            // Re-route
            const prevNode = chain.compressor || chain.eq || chain.gate || chain.input;
            prevNode.disconnect();
            prevNode.connect(chain.limiter);
            chain.limiter.connect(chain.panner);
        }

        if (bypass) {
            chain.limiter.ratio.setTargetAtTime(1, this.ctx!.currentTime, 0.1);
        } else {
            const threshold = ceiling - ((strength / 100) * 20);
            chain.limiter.threshold.setTargetAtTime(threshold, this.ctx!.currentTime, 0.1);
        }
    }

    updateLeveler(trackId: string, target: number, bypass: boolean) {
        const chain = this.getOrCreateTrack(trackId);
        if (bypass) {
            chain.output.gain.setTargetAtTime(1, this.ctx!.currentTime, 0.1);
        } else {
            // Map target LUFS/Gain 0-100 to gain 0.5 - 2.0
            const gainValue = 0.5 + (target / 100) * 1.5;
            chain.output.gain.setTargetAtTime(gainValue, this.ctx!.currentTime, 0.1);
        }
    }

    updateMultiband(trackId: string, lowStr: number, highStr: number, bypass: boolean) {
        // Placeholder for multiband - logic would require a splitter and multiple compressors
        // For now, let's just use it as a global tone shaper or additional compression
    }
}

export const audioEngine = new WebAudioEngine();
