/**
 * Da Graba Studio — MIDI Device Manager
 * =====================================
 * Handles Web MIDI API connections (external hardware).
 * Routes external incoming MIDI directly into the central MidiEngine.
 */
/// <reference path="../../types/webmidi.d.ts" />

import { MidiMessage, midiEngine, MidiMessageType } from './MidiEngine';

export interface MidiInputDef {
    id: string;
    name: string;
    manufacturer: string;
}

type DeviceListener = (inputs: MidiInputDef[], activeId: string | null) => void;

class MidiDeviceManager {
    private midiAccess: WebMidi.MIDIAccess | null = null;
    private inputs: Map<string, WebMidi.MIDIInput> = new Map();
    private activeInputId: string | null = null;
    private listeners: DeviceListener[] = [];
    private isInitialized = false;

    constructor() {
        // We will initialize explicitly, to handle permissions flow safely
    }

    /** 
     * Request MIDI access from the browser. 
     * If user denies, it throws or rejects.
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        if (typeof navigator !== 'undefined' && navigator.requestMIDIAccess) {
            try {
                this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
                this.midiAccess.onstatechange = this.handleStateChange;
                this.updateInputs();
                this.isInitialized = true;
            } catch (err) {
                console.error("MIDI Device Manager: Failed to get MIDI access", err);
            }
        } else {
            console.warn("MIDI Device Manager: Web MIDI API not supported in this browser.");
        }
    }

    /** Listeners for UI state updates */
    addListener(fn: DeviceListener) {
        this.listeners.push(fn);
        fn(this.getAvailableInputs(), this.activeInputId);
    }

    removeListener(fn: DeviceListener) {
        this.listeners = this.listeners.filter(l => l !== fn);
    }

    private notifyListeners() {
        const inputs = this.getAvailableInputs();
        this.listeners.forEach(fn => fn(inputs, this.activeInputId));
    }

    /** Get formatted list of inputs for UI */
    getAvailableInputs(): MidiInputDef[] {
        return Array.from(this.inputs.values()).map(input => ({
            id: input.id,
            name: input.name || `Unknown Input (${input.id})`,
            manufacturer: input.manufacturer || 'Unknown',
        }));
    }

    /** Set which hardware input we are listening to */
    setActiveInput(id: string | null) {
        // Disconnect old
        if (this.activeInputId && this.inputs.has(this.activeInputId)) {
            const oldInput = this.inputs.get(this.activeInputId)!;
            oldInput.onmidimessage = null;
        }

        this.activeInputId = id;

        // Connect new
        if (id && this.inputs.has(id)) {
            const newInput = this.inputs.get(id)!;
            newInput.onmidimessage = this.handleIncomingMidi;
        }

        this.notifyListeners();
    }

    /** Auto-connect to first available if none selected */
    autoConnect() {
        if (!this.activeInputId && this.inputs.size > 0) {
            this.setActiveInput(this.inputs.keys().next().value!);
        }
    }

    private updateInputs() {
        if (!this.midiAccess) return;

        this.inputs.clear();
        for (const input of this.midiAccess.inputs.values()) {
            this.inputs.set(input.id, input);
        }

        // If the active input was disconnected, clear it
        if (this.activeInputId && !this.inputs.has(this.activeInputId)) {
            this.activeInputId = null;
        }

        this.notifyListeners();
    }

    // Bound handlers
    private handleStateChange = (event: WebMidi.MIDIConnectionEvent) => {
        console.log(`MIDI Device State Change: ${event.port.name} ${event.port.state}`);
        this.updateInputs();
    };

    /** The core bridge: Hardware MIDI -> MidiMessage -> MidiEngine */
    private handleIncomingMidi = (event: WebMidi.MIDIMessageEvent) => {
        const [statusByte, data1 = 0, data2 = 0] = event.data;

        let msg: MidiMessage | null = null;

        const command = statusByte & 0xF0;
        const channel = statusByte & 0x0F;

        if (command === 0x90) {     // Note On
            if (data2 === 0) {
                msg = MidiMessage.noteOff(channel, data1, 0); // Implicit note off
            } else {
                msg = MidiMessage.noteOn(channel, data1, data2);
            }
        } else if (command === 0x80) { // Note Off
            msg = MidiMessage.noteOff(channel, data1, data2);
        } else if (command === 0xB0) { // Control Change
            msg = MidiMessage.controllerEvent(channel, data1, data2);
        } else if (command === 0xC0) { // Program Change
            msg = MidiMessage.programChange(channel, data1);
        } else if (command === 0xE0) { // Pitch Bend
            const val = data1 | (data2 << 7);
            msg = MidiMessage.pitchWheel(channel, val);
        }

        if (msg) {
            // Send directly to the engine
            midiEngine.sendImmediate(msg);
        }
    };
}

// Global Singleton
export const midiDeviceManager = new MidiDeviceManager();
