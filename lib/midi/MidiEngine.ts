/**
 * Da Graba Studio — MIDI Engine
 * ==============================
 * TypeScript MIDI system inspired by JUCE's MidiMessage & MidiBuffer.
 * Web-native implementation for the DAW's Piano Roll & Drum Pads.
 */

// ─────────────────────────────────────────────────────────────────────────────
// MidiMessage
// ─────────────────────────────────────────────────────────────────────────────

export type MidiMessageType =
    | 'noteOn' | 'noteOff'
    | 'controlChange' | 'programChange'
    | 'pitchBend' | 'aftertouch' | 'channelPressure'
    | 'allNotesOff' | 'allSoundOff'
    | 'sysex' | 'meta' | 'unknown';

export class MidiMessage {
    private _status: number;
    private _data1: number;
    private _data2: number;
    private _channel: number;
    private _timestamp: number;
    private _type: MidiMessageType;

    private constructor(status: number, data1: number, data2: number, channel: number, type: MidiMessageType) {
        this._status = status;
        this._data1 = data1;
        this._data2 = data2;
        this._channel = channel;
        this._timestamp = 0;
        this._type = type;
    }

    // ── Factory Methods ─────────────────────────────────────────────

    static noteOn(channel: number, noteNumber: number, velocity: number): MidiMessage {
        const vel = Math.max(1, Math.min(127, Math.round(velocity)));
        return new MidiMessage(0x90, noteNumber & 0x7F, vel, channel & 0xF, 'noteOn');
    }

    static noteOff(channel: number, noteNumber: number, velocity: number = 0): MidiMessage {
        return new MidiMessage(0x80, noteNumber & 0x7F, velocity & 0x7F, channel & 0xF, 'noteOff');
    }

    static controllerEvent(channel: number, controllerNumber: number, value: number): MidiMessage {
        return new MidiMessage(0xB0, controllerNumber & 0x7F, value & 0x7F, channel & 0xF, 'controlChange');
    }

    static programChange(channel: number, programNumber: number): MidiMessage {
        return new MidiMessage(0xC0, programNumber & 0x7F, 0, channel & 0xF, 'programChange');
    }

    static pitchWheel(channel: number, position: number): MidiMessage {
        // position: 0-16383, center = 8192
        const clamped = Math.max(0, Math.min(16383, position));
        return new MidiMessage(0xE0, clamped & 0x7F, (clamped >> 7) & 0x7F, channel & 0xF, 'pitchBend');
    }

    static allNotesOff(channel: number): MidiMessage {
        return new MidiMessage(0xB0, 123, 0, channel & 0xF, 'allNotesOff');
    }

    static allSoundOff(channel: number): MidiMessage {
        return new MidiMessage(0xB0, 120, 0, channel & 0xF, 'allSoundOff');
    }

    // ── Query Methods ───────────────────────────────────────────────

    get type(): MidiMessageType { return this._type; }
    get channel(): number { return this._channel; }
    get timestamp(): number { return this._timestamp; }

    set timestamp(t: number) { this._timestamp = t; }
    setTimeStamp(t: number): MidiMessage { this._timestamp = t; return this; }

    isNoteOn(): boolean { return this._type === 'noteOn'; }
    isNoteOff(): boolean { return this._type === 'noteOff'; }
    isNoteOnOrOff(): boolean { return this._type === 'noteOn' || this._type === 'noteOff'; }
    isController(): boolean { return this._type === 'controlChange'; }
    isProgramChange(): boolean { return this._type === 'programChange'; }
    isPitchWheel(): boolean { return this._type === 'pitchBend'; }
    isAllNotesOff(): boolean { return this._type === 'allNotesOff'; }
    isAllSoundOff(): boolean { return this._type === 'allSoundOff'; }

    getNoteNumber(): number { return this._data1; }
    getVelocity(): number { return this._data2; }
    getFloatVelocity(): number { return this._data2 / 127.0; }
    getControllerNumber(): number { return this._data1; }
    getControllerValue(): number { return this._data2; }
    getProgramChangeNumber(): number { return this._data1; }
    getPitchWheelValue(): number { return this._data1 | (this._data2 << 7); }

    // ── Formatting ──────────────────────────────────────────────────

    static getMidiNoteName(noteNumber: number): string {
        const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(noteNumber / 12) - 1;
        return `${names[noteNumber % 12]}${octave}`;
    }

    static getControllerName(cc: number): string {
        const names: Record<number, string> = {
            1: 'Mod Wheel', 7: 'Volume', 10: 'Pan', 11: 'Expression',
            64: 'Sustain', 91: 'Reverb', 93: 'Chorus', 123: 'All Notes Off',
        };
        return names[cc] || `CC${cc}`;
    }

    getDescription(): string {
        if (this.isNoteOn()) return `Note On ${MidiMessage.getMidiNoteName(this._data1)} vel:${this._data2}`;
        if (this.isNoteOff()) return `Note Off ${MidiMessage.getMidiNoteName(this._data1)}`;
        if (this.isController()) return `CC ${MidiMessage.getControllerName(this._data1)}: ${this._data2}`;
        if (this.isProgramChange()) return `Program Change ${this._data1}`;
        if (this.isPitchWheel()) return `Pitch Wheel ${this.getPitchWheelValue()}`;
        if (this.isAllNotesOff()) return 'All Notes Off';
        if (this.isAllSoundOff()) return 'All Sound Off';
        return `MIDI [${this._status.toString(16)} ${this._data1} ${this._data2}]`;
    }

    getTimecodeString(): string {
        const t = this._timestamp;
        const mins = Math.floor(t / 60) % 60;
        const secs = Math.floor(t) % 60;
        const ms = Math.floor((t * 1000) % 1000);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
    }

    /** Raw MIDI bytes */
    getRawData(): Uint8Array {
        return new Uint8Array([this._status | this._channel, this._data1, this._data2]);
    }

    /** Clone this message */
    clone(): MidiMessage {
        const m = new MidiMessage(this._status, this._data1, this._data2, this._channel, this._type);
        m._timestamp = this._timestamp;
        return m;
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// MidiBuffer
// ─────────────────────────────────────────────────────────────────────────────

interface BufferEvent {
    samplePosition: number;
    message: MidiMessage;
}

export class MidiBuffer {
    private events: BufferEvent[] = [];
    private _sampleRate: number;

    constructor(sampleRate: number = 44100) {
        this._sampleRate = sampleRate;
    }

    get sampleRate(): number { return this._sampleRate; }
    get numEvents(): number { return this.events.length; }
    get isEmpty(): boolean { return this.events.length === 0; }

    /** Add a MIDI event at the given sample position */
    addEvent(message: MidiMessage, sampleNumber: number): void {
        const event: BufferEvent = { samplePosition: sampleNumber, message: message.clone() };

        // Insert in sorted order
        let i = this.events.length;
        while (i > 0 && this.events[i - 1].samplePosition > sampleNumber) i--;
        this.events.splice(i, 0, event);
    }

    /** Add event using the message's timestamp (seconds → samples) */
    addEventFromTimestamp(message: MidiMessage): void {
        const sampleNumber = Math.floor(message.timestamp * this._sampleRate);
        this.addEvent(message, sampleNumber);
    }

    /** Iterate over events in the buffer */
    *[Symbol.iterator](): Generator<BufferEvent> {
        for (const e of this.events) {
            yield e;
        }
    }

    /** Get events in a specific sample range [start, end) */
    getEventsInRange(startSample: number, endSample: number): BufferEvent[] {
        return this.events.filter(
            e => e.samplePosition >= startSample && e.samplePosition < endSample
        );
    }

    /** Clear events in range [start, start+numSamples) */
    clear(startSample: number = 0, numSamples?: number): void {
        if (numSamples === undefined) {
            this.events = [];
        } else {
            const end = startSample + numSamples;
            this.events = this.events.filter(
                e => e.samplePosition < startSample || e.samplePosition >= end
            );
        }
    }

    /** Clear all events */
    clearAll(): void {
        this.events = [];
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// MidiEngine — Realtime scheduler
// ─────────────────────────────────────────────────────────────────────────────

type MidiListener = (message: MidiMessage) => void;

export class MidiEngine {
    private buffer: MidiBuffer;
    private listeners: MidiListener[] = [];
    private startTime: number = 0;
    private previousSampleNumber: number = 0;
    private timerId: ReturnType<typeof setInterval> | null = null;
    private _log: MidiMessage[] = [];
    private _maxLog = 200;

    constructor(sampleRate: number = 44100) {
        this.buffer = new MidiBuffer(sampleRate);
        this.startTime = performance.now() / 1000;
    }

    get log(): MidiMessage[] { return this._log; }
    get sampleRate(): number { return this.buffer.sampleRate; }

    /** Register a listener for dispatched MIDI events */
    addListener(fn: MidiListener): void {
        this.listeners.push(fn);
    }

    removeListener(fn: MidiListener): void {
        this.listeners = this.listeners.filter(l => l !== fn);
    }

    /** Schedule a MIDI event into the buffer */
    scheduleEvent(msg: MidiMessage): void {
        this.buffer.addEventFromTimestamp(msg);
    }

    /** Fire a MIDI event immediately (bypasses buffer) */
    sendImmediate(msg: MidiMessage): void {
        msg.setTimeStamp(this.getCurrentTime());
        this._log.push(msg);
        if (this._log.length > this._maxLog) this._log.shift();
        this.listeners.forEach(l => l(msg));
    }

    /** Get current time relative to engine start (seconds) */
    getCurrentTime(): number {
        return performance.now() / 1000 - this.startTime;
    }

    /** Start the scheduling timer */
    start(): void {
        this.startTime = performance.now() / 1000;
        this.previousSampleNumber = 0;
        this.timerId = setInterval(() => this.tick(), 1);
    }

    /** Stop the scheduler */
    stop(): void {
        if (this.timerId) clearInterval(this.timerId);
        this.timerId = null;
    }

    /** Internal: dispatch due events */
    private tick(): void {
        const currentTime = this.getCurrentTime();
        const currentSample = Math.floor(currentTime * this.buffer.sampleRate);

        const dueEvents = this.buffer.getEventsInRange(this.previousSampleNumber, currentSample);
        for (const { message, samplePosition } of dueEvents) {
            message.setTimeStamp(samplePosition / this.buffer.sampleRate);
            this._log.push(message);
            if (this._log.length > this._maxLog) this._log.shift();
            this.listeners.forEach(l => l(message));
        }

        this.buffer.clear(this.previousSampleNumber, currentSample - this.previousSampleNumber);
        this.previousSampleNumber = currentSample;
    }

    /** Reset engine */
    reset(): void {
        this.stop();
        this.buffer.clearAll();
        this._log = [];
        this.previousSampleNumber = 0;
    }
}

// ── Singleton instance ──────────────────────────────────────────────────────
export const midiEngine = new MidiEngine();
