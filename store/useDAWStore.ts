import { create } from 'zustand';

export interface FaderState {
    id: string; // 'vocal', 'beat', 'bass', 'fx', 'ch-...'
    label: string;
    value: number; // 0 a 100
    isMuted: boolean;
    pan: number;
    isSoloed: boolean;
}

export interface DAWTrack {
    id: string;
    name: string;
    color: string;
}

export type BottomPanelState = 'mixer' | 'piano_roll' | 'closed';
export type CloudStatus = 'disconnected' | 'connecting' | 'connected';

interface DAWStore {
    faders: FaderState[];
    tracks: DAWTrack[];
    isTraining: boolean;
    activeArtistId: string | null;
    activeBottomPanel: BottomPanelState;
    mixerBank: 1 | 2; // 1 = Ch 1-16, 2 = Ch 17-32
    cloudStatus: CloudStatus;
    systemMessage: string;
    isMetronomeOn: boolean;
    isPlaying: boolean;
    masterLevel: number;
    currentPreviewTrack: any | null;
    isFullMixer: boolean;

    // Acciones para que la IA mueva los faders
    setFaderValue: (id: string, value: number) => void;
    setTrainingStatus: (status: boolean) => void;
    resetConsole: () => void;
    // Preserving DAW UI state
    setPan: (id: string, pan: number) => void;
    toggleSolo: (id: string) => void;
    toggleMute: (id: string) => void;
    setActiveBottomPanel: (panel: BottomPanelState) => void;
    setMixerBank: (bank: 1 | 2) => void;
    setCloudStatus: (status: CloudStatus, message?: string) => void;
    setFullMixer: (status: boolean) => void;

    // Track Management
    addTrack: (name?: string, color?: string) => void;
    setTracks: (tracks: DAWTrack[]) => void;
    clearTracks: () => void;
    removeTrack: (id: string) => void;
    toggleMetronome: () => void;
    setIsPlaying: (playing: boolean) => void;
    setMasterLevel: (level: number) => void;
    setPreviewTrack: (track: any | null) => void;
}

// Generate 32 default faders
const defaultFaders: FaderState[] = Array.from({ length: 32 }, (_, i) => ({
    id: `ch-${i + 1}`,
    label: i < 16 ? `CH ${i + 1}` : (i < 24 ? `AUX ${i - 15}` : (i < 30 ? `BUS ${i - 23}` : `MTR L/R`)),
    value: 75,
    isMuted: false,
    pan: 0,
    isSoloed: false,
}));

// Set explicit labels for the first 4 for backwards compatibility with the Auto-mix Modal logic
defaultFaders[0] = { ...defaultFaders[0], id: 'vocal', label: 'VOCAL' };
defaultFaders[1] = { ...defaultFaders[1], id: 'beat', label: 'BEAT' };
defaultFaders[2] = { ...defaultFaders[2], id: 'bass', label: 'BASS' };
defaultFaders[3] = { ...defaultFaders[3], id: 'fx', label: 'FX' };

export const useDAWStore = create<DAWStore>((set) => ({
    faders: defaultFaders,
    tracks: [],
    isTraining: false,
    activeArtistId: null,
    activeBottomPanel: 'mixer', // Mixer opens by default
    mixerBank: 1,
    cloudStatus: 'disconnected',
    systemMessage: '',
    isMetronomeOn: false,
    isPlaying: false,
    masterLevel: 0,
    currentPreviewTrack: null,
    isFullMixer: false,

    setTracks: (tracks: DAWTrack[]) => set((state) => {
        const newFaders: FaderState[] = tracks.map((track, i) => ({
            id: track.id,
            label: track.name.toUpperCase(),
            value: 75,
            isMuted: false,
            pan: 0,
            isSoloed: false
        }));
        return { tracks, faders: newFaders };
    }),

    addTrack: (name, color) => set((state) => {
        const newId = `t${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const trackColor = color || ['#00F0FF', '#FF6B00', '#A4ECA1', '#E2A04A', '#D94AE2', '#FF0055', '#55FF00'][Math.floor(Math.random() * 7)];
        const trackName = name || `Audio Track ${state.tracks.length + 1}`;

        const newTrack: DAWTrack = { id: newId, name: trackName, color: trackColor };
        const newFader: FaderState = {
            id: newId,
            label: trackName.toUpperCase(),
            value: 75,
            isMuted: false,
            pan: 0,
            isSoloed: false
        };

        return {
            tracks: [...state.tracks, newTrack],
            faders: [...state.faders, newFader]
        };
    }),

    clearTracks: () => set({ tracks: [], faders: [] }),

    removeTrack: (id) => set((state) => ({
        tracks: state.tracks.filter(t => t.id !== id),
        faders: state.faders.filter(f => f.id !== id)
    })),

    toggleMetronome: () => set((state) => ({
        isMetronomeOn: !state.isMetronomeOn
    })),

    setActiveBottomPanel: (panel) => set({ activeBottomPanel: panel }),
    setMixerBank: (bank) => set({ mixerBank: bank }),

    setFaderValue: (id, value) => set((state) => ({
        faders: state.faders.map((f) => f.id === id ? { ...f, value } : f)
    })),

    setTrainingStatus: (status) => set({ isTraining: status }),

    resetConsole: () => set((state) => ({
        faders: state.faders.map((f) => ({ ...f, value: 0 }))
    })),

    setPan: (id, pan) => set((state) => ({
        faders: state.faders.map((f) => f.id === id ? { ...f, pan } : f)
    })),

    toggleSolo: (id) => set((state) => ({
        faders: state.faders.map((f) => f.id === id ? { ...f, isSoloed: !f.isSoloed } : f)
    })),

    toggleMute: (id) => set((state) => ({
        faders: state.faders.map((f) => f.id === id ? { ...f, isMuted: !f.isMuted } : f)
    })),

    setCloudStatus: (status, message = '') => set({ cloudStatus: status, systemMessage: message }),
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    setMasterLevel: (level) => set({ masterLevel: level }),
    setPreviewTrack: (track) => set({ currentPreviewTrack: track }),
    setFullMixer: (status) => set({ isFullMixer: status }),
}));
