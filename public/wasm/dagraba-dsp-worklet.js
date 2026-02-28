/**
 * Da Graba DSP AudioWorklet Processor
 * ====================================
 * Runs C++ DSP (Compressor, Saturator, EQ) on the audio render thread.
 * Loaded via: audioContext.audioWorklet.addModule('/wasm/dagraba-dsp-worklet.js')
 *
 * Communication with main thread via MessagePort:
 *   { type: 'init', plugin: 'compressor'|'saturator'|'eq' }
 *   { type: 'param', key: 'threshold', value: -18 }
 */

// The WASM module is loaded once and shared across processors
let dspModule = null;
let moduleReady = false;

async function loadModule() {
    if (moduleReady) return;
    try {
        // importScripts works inside AudioWorklet scope
        importScripts('/wasm/dagraba-dsp.js');
        dspModule = await createDaGrabaDSP();
        moduleReady = true;
        console.log('[DaGrabaDSP-Worklet] WASM module loaded on audio thread.');
    } catch (e) {
        console.error('[DaGrabaDSP-Worklet] Failed to load WASM:', e);
    }
}

class DaGrabaDSPProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();
        this.plugin = null;
        this.pluginType = null;
        this.bypass = false;

        // Load the WASM module
        loadModule().then(() => {
            if (options.processorOptions && options.processorOptions.plugin) {
                this._createPlugin(options.processorOptions.plugin);
            }
        });

        // Listen for parameter updates from main thread
        this.port.onmessage = (e) => {
            const msg = e.data;

            if (msg.type === 'init' && moduleReady) {
                this._createPlugin(msg.plugin);
            }

            if (msg.type === 'bypass') {
                this.bypass = !!msg.value;
            }

            if (msg.type === 'param' && this.plugin) {
                this._setParam(msg.key, msg.value);
            }
        };
    }

    _createPlugin(type) {
        if (!dspModule) return;

        switch (type) {
            case 'compressor':
                this.plugin = new dspModule.DG_Compressor();
                this.plugin.setSampleRate(sampleRate);
                break;
            case 'saturator':
                this.plugin = new dspModule.DG_Saturator();
                break;
            case 'eq':
                this.plugin = new dspModule.DG_ParametricEQ();
                this.plugin.setSampleRate(sampleRate);
                break;
            default:
                console.warn(`[DaGrabaDSP-Worklet] Unknown plugin type: ${type}`);
                return;
        }

        this.pluginType = type;
        this.port.postMessage({ type: 'ready', plugin: type });
        console.log(`[DaGrabaDSP-Worklet] Plugin created: ${type}`);
    }

    _setParam(key, value) {
        if (!this.plugin) return;

        // Map generic param names to C++ methods
        const methodMap = {
            // Compressor
            threshold: 'setThreshold', ratio: 'setRatio',
            attack: 'setAttack', release: 'setRelease',
            makeupGain: 'setMakeupGain', kneeWidth: 'setKneeWidth',
            // Saturator
            drive: 'setDrive', mix: 'setMix',
            outputGain: 'setOutputGain', bias: 'setBias',
        };

        const method = methodMap[key];
        if (method && typeof this.plugin[method] === 'function') {
            this.plugin[method](value);
            return;
        }

        // EQ band params: band0_freq, band0_gain, band0_q, band0_type
        const bandMatch = key.match(/^band(\d+)_(freq|gain|q|type)$/);
        if (bandMatch && this.pluginType === 'eq') {
            // Store band params and call setBand with all 4
            if (!this._eqBands) {
                this._eqBands = [
                    { freq: 80, gain: 0, q: 0.7, type: 0 },
                    { freq: 800, gain: 0, q: 1.0, type: 1 },
                    { freq: 3500, gain: 0, q: 1.0, type: 1 },
                    { freq: 8000, gain: 0, q: 0.7, type: 2 },
                ];
            }
            const idx = parseInt(bandMatch[1]);
            const prop = bandMatch[2];
            if (this._eqBands[idx]) {
                this._eqBands[idx][prop] = value;
                const b = this._eqBands[idx];
                this.plugin.setBand(idx, b.freq, b.gain, b.q, b.type);
            }
        }
    }

    process(inputs, outputs) {
        if (!this.plugin || this.bypass || !inputs[0] || !inputs[0][0]) {
            // Pass-through
            if (inputs[0] && outputs[0]) {
                for (let ch = 0; ch < inputs[0].length; ch++) {
                    if (outputs[0][ch] && inputs[0][ch]) {
                        outputs[0][ch].set(inputs[0][ch]);
                    }
                }
            }
            return true;
        }

        const input = inputs[0];
        const output = outputs[0];
        const numFrames = input[0].length;

        // Interleave stereo for C++ processing
        const numChannels = Math.min(input.length, 2);
        const interleaved = new Float32Array(numFrames * 2);

        // Fill interleaved buffer
        for (let i = 0; i < numFrames; i++) {
            interleaved[i * 2] = input[0][i];
            interleaved[i * 2 + 1] = numChannels > 1 ? input[1][i] : input[0][i];
        }

        // Get a pointer in WASM memory
        const byteLength = interleaved.byteLength;
        const wasmPtr = dspModule._malloc(byteLength);
        const wasmHeap = new Float32Array(dspModule.HEAPF32.buffer, wasmPtr, numFrames * 2);
        wasmHeap.set(interleaved);

        // Process in C++
        this.plugin.process(wasmPtr, numFrames);

        // Read back
        const result = new Float32Array(dspModule.HEAPF32.buffer, wasmPtr, numFrames * 2);

        // De-interleave to output
        for (let i = 0; i < numFrames; i++) {
            output[0][i] = result[i * 2];
            if (output[1]) {
                output[1][i] = result[i * 2 + 1];
            }
        }

        dspModule._free(wasmPtr);

        // Send gain reduction meter data for compressor
        if (this.pluginType === 'compressor') {
            this.port.postMessage({
                type: 'meter',
                gainReduction: this.plugin.getGainReduction()
            });
        }

        return true;
    }
}

registerProcessor('dagraba-dsp-processor', DaGrabaDSPProcessor);
