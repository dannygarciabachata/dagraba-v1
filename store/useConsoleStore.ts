import { create } from 'zustand';

export interface FaderState {
    id: number;
    volume: number; // 0 to 127
    pan: number; // -64 to +63
    solo: boolean;
    mute: boolean;
    label: string;
}

interface ConsoleStore {
    faders: FaderState[];
    setVolume: (id: number, volume: number) => void;
    setPan: (id: number, pan: number) => void;
    toggleSolo: (id: number) => void;
    toggleMute: (id: number) => void;
}

const initialFaders: FaderState[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    volume: 100, // default -0dB roughly (in MIDI scale)
    pan: 0,
    solo: false,
    mute: false,
    label: `CH ${i + 1}`,
}));

export const useConsoleStore = create<ConsoleStore>((set) => ({
    faders: initialFaders,
    setVolume: (id, volume) =>
        set((state) => ({
            faders: state.faders.map((f) =>
                f.id === id ? { ...f, volume: Math.max(0, Math.min(127, volume)) } : f
            ),
        })),
    setPan: (id, pan) =>
        set((state) => ({
            faders: state.faders.map((f) =>
                f.id === id ? { ...f, pan: Math.max(-64, Math.min(63, pan)) } : f
            ),
        })),
    toggleSolo: (id) =>
        set((state) => ({
            faders: state.faders.map((f) =>
                f.id === id ? { ...f, solo: !f.solo } : f
            ),
        })),
    toggleMute: (id) =>
        set((state) => ({
            faders: state.faders.map((f) =>
                f.id === id ? { ...f, mute: !f.mute } : f
            ),
        })),
}));
