// Type definitions for Web MIDI API
// Based on W3C Web MIDI API specification

declare namespace WebMidi {
    interface MIDIAccess {
        inputs: MIDIInputMap;
        outputs: MIDIOutputMap;
        onstatechange: ((this: MIDIAccess, ev: MIDIConnectionEvent) => any) | null;
        sysexEnabled: boolean;
    }

    interface MIDIInputMap {
        size: number;
        has(id: string): boolean;
        get(id: string): MIDIInput | undefined;
        entries(): IterableIterator<[string, MIDIInput]>;
        keys(): IterableIterator<string>;
        values(): IterableIterator<MIDIInput>;
        forEach(callback: (value: MIDIInput, key: string, map: MIDIInputMap) => void, thisArg?: any): void;
    }

    interface MIDIOutputMap {
        size: number;
        has(id: string): boolean;
        get(id: string): MIDIOutput | undefined;
        entries(): IterableIterator<[string, MIDIOutput]>;
        keys(): IterableIterator<string>;
        values(): IterableIterator<MIDIOutput>;
        forEach(callback: (value: MIDIOutput, key: string, map: MIDIOutputMap) => void, thisArg?: any): void;
    }

    interface MIDIPort {
        id: string;
        manufacturer?: string;
        name?: string;
        type: 'input' | 'output';
        version?: string;
        state: 'disconnected' | 'connected';
        connection: 'open' | 'closed' | 'pending';
        onstatechange: ((this: MIDIPort, ev: MIDIConnectionEvent) => any) | null;
        open(): Promise<MIDIPort>;
        close(): Promise<MIDIPort>;
    }

    interface MIDIInput extends MIDIPort {
        type: 'input';
        onmidimessage: ((this: MIDIInput, ev: MIDIMessageEvent) => any) | null;
    }

    interface MIDIOutput extends MIDIPort {
        type: 'output';
        send(data: Iterable<number>, timestamp?: number): void;
        clear(): void;
    }

    interface MIDIMessageEvent extends Event {
        data: Uint8Array;
        receivedTime: number;
    }

    interface MIDIConnectionEvent extends Event {
        port: MIDIPort;
    }
}

interface Navigator {
    requestMIDIAccess(options?: { sysex: boolean }): Promise<WebMidi.MIDIAccess>;
}
