/**
 * phaselimiter-worklet.js
 * AudioWorklet processor that uses the phaselimiter WASM module for real-time limiting.
 * Loaded via WebAudioEngine.loadWasmLimiter()
 * 
 * Because AudioWorklet runs in a separate thread (AudioWorkletGlobalScope), we load
 * phaselimiter.js here via importScripts and process audio in 128-sample blocks.
 */

// Load the Emscripten WASM glue code into the worklet thread
try {
    importScripts('/phaselimiter.js');
} catch (e) {
    console.warn('[PhaseLimiterWorklet] Could not load phaselimiter.js via importScripts:', e);
}

class PhaseLimiterProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super(options);

        this._limiterHandle = null;
        this._ready = false;
        this._ceiling = -0.3;   // dBFS ceiling (mapped from knob)
        this._strength = 0.8;   // 0.0 – 1.0
        this._bypass = false;

        // Listen for param updates from the main thread
        this.port.onmessage = (e) => {
            const { type, ceiling, strength, bypass } = e.data || {};
            if (type === 'params') {
                if (ceiling !== undefined) this._ceiling = ceiling;
                if (strength !== undefined) this._strength = strength;
                if (bypass !== undefined) this._bypass = bypass;
            }
        };

        // Initialize WASM when the Module is ready
        this._initWasm();
    }

    _initWasm() {
        const tryInit = () => {
            if (typeof Module !== 'undefined' && Module.calledRun) {
                try {
                    this._createLimiter = Module.cwrap('createLimiter', 'number', []);
                    this._processLimiter = Module.cwrap('processLimiter', null, ['number', 'number', 'number', 'number']);
                    this._destroyLimiter = Module.cwrap('destroyLimiter', null, ['number']);
                    this._limiterHandle = this._createLimiter();
                    this._ready = true;
                    this.port.postMessage({ type: 'ready' });
                    console.log('[PhaseLimiterWorklet] WASM limiter initialized.');
                } catch (err) {
                    console.error('[PhaseLimiterWorklet] Failed to init WASM:', err);
                }
            } else {
                // Retry until Module is ready (max ~2 seconds)
                if (this._retries === undefined) this._retries = 0;
                if (this._retries++ < 40) {
                    setTimeout(tryInit, 50);
                }
            }
        };
        tryInit();
    }

    /**
     * Soft-knee brickwall limiter in pure JS.
     * Used when WASM isn't ready yet, and as a reference implementation.
     */
    _jsFallbackLimit(inputF32, outputF32, numSamples) {
        const ceilingLinear = Math.pow(10, this._ceiling / 20); // dBFS → linear
        const knee = 0.02; // 20ms release-like knee
        for (let i = 0; i < numSamples; i++) {
            const s = inputF32[i];
            const abs = Math.abs(s);
            if (abs > ceilingLinear) {
                outputF32[i] = (s / abs) * ceilingLinear;
            } else {
                outputF32[i] = s;
            }
        }
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];

        if (!input || !input.length) return true;

        const numChannels = Math.min(input.length, output.length);
        const blockSize = input[0].length; // Always 128 in standard AudioWorklet

        for (let ch = 0; ch < numChannels; ch++) {
            const inputCh = input[ch];
            const outputCh = output[ch];

            if (this._bypass || !this._ready) {
                // Bypass: pass through (or JS fallback limiter)
                if (this._bypass) {
                    outputCh.set(inputCh);
                } else {
                    this._jsFallbackLimit(inputCh, outputCh, blockSize);
                }
                continue;
            }

            try {
                // Allocate input buffer on WASM heap
                const heapIn = Module._malloc(blockSize * 4); // 4 bytes per float32
                const heapOut = Module._malloc(blockSize * 4);

                // Copy JS Float32 → WASM heap
                Module.HEAPF32.set(inputCh, heapIn >> 2);

                // Call the WASM limiter
                this._processLimiter(this._limiterHandle, heapIn, heapOut, blockSize);

                // Copy WASM heap → JS Float32
                outputCh.set(Module.HEAPF32.subarray(heapOut >> 2, (heapOut >> 2) + blockSize));

                Module._free(heapIn);
                Module._free(heapOut);
            } catch (err) {
                // Safety fallback
                this._jsFallbackLimit(inputCh, outputCh, blockSize);
            }
        }

        return true; // Keep processor alive
    }
}

registerProcessor('phaselimiter-worklet', PhaseLimiterProcessor);
