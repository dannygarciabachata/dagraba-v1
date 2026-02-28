import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TrackType = 'mono' | 'stereo' | 'aux' | 'master' | 'midi' | 'virtual_instrument';

export interface DAWTrack {
    id: string;
    name: string;
    color: string;
    trackType: TrackType;
    audioUrl?: string; // Optional audio source for the track (e.g. from stems or import)
}

export interface FXInsert {
    id: string;
    pluginId: 'gate' | 'eq' | 'leveler' | 'compressor' | 'multiband' | 'limiter' | 'reverb' | 'delay' | 'chorus' | 'distortion' | 'saturator' | 'virtual_instrument';
    bypass: boolean;
    settings: any;
}

export interface FaderState {
    id: string; // 'vocal', 'beat', 'bass', 'fx', 'ch-...'
    label: string;
    value: number; // 0 a 100
    isMuted: boolean;
    pan: number;
    isSoloed: boolean;
    inserts: FXInsert[];
}

export type BottomPanelState = 'mixer' | 'piano_roll' | 'drums' | 'keys' | 'closed';
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
    addTrack: (name?: string, color?: string, trackType?: TrackType, audioUrl?: string) => void;
    setTracks: (tracks: DAWTrack[]) => void;
    clearTracks: () => void;
    removeTrack: (id: string) => void;
    toggleMetronome: () => void;
    setIsPlaying: (playing: boolean) => void;
    setMasterLevel: (level: number) => void;
    setPreviewTrack: (track: any | null) => void;

    // FX Insert Management
    addInsert: (trackId: string, pluginId: FXInsert['pluginId']) => void;
    removeInsert: (trackId: string, insertId: string) => void;
    updateInsertSettings: (trackId: string, insertId: string, settings: any) => void;
    toggleInsertBypass: (trackId: string, insertId: string) => void;

    // Plugin Window Management
    openPluginIds: string[]; // List of insert IDs currently open
    openPlugin: (insertId: string) => void;
    closePlugin: (insertId: string) => void;
}

export const useDAWStore = create<DAWStore>()(
    persist(
        (set) => ({
            faders: [], // Faders are created dynamically per track
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
                const newFaders: FaderState[] = tracks.map((track) => ({
                    id: track.id,
                    label: track.name.toUpperCase(),
                    value: 75,
                    isMuted: false,
                    pan: 0,
                    isSoloed: false,
                    inserts: []
                }));
                return { tracks, faders: newFaders };
            }),

            addTrack: (name, color, trackType = 'mono', audioUrl) => set((state) => {
                const newId = `t${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const trackColor = color || ['#00F0FF', '#FF6B00', '#A4ECA1', '#E2A04A', '#D94AE2', '#FF0055', '#55FF00'][Math.floor(Math.random() * 7)];
                const trackName = name || `Audio Track ${state.tracks.length + 1}`;

                const newTrack: DAWTrack = { id: newId, name: trackName, color: trackColor, trackType, audioUrl };
                const newFader: FaderState = {
                    id: newId,
                    label: trackName.toUpperCase(),
                    value: 75,
                    isMuted: false,
                    pan: 0,
                    isSoloed: false,
                    inserts: []
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

            // FX Insert Management
            addInsert: (trackId, pluginId) => set((state) => {
                const defaultSettings: any = {
                    gate: { gateThreshold: 10, gateAttack: 5, gateRelease: 100 },
                    eq: { eqHighpass: 30, eqTilt: 0, eqSideGain: 20, eqSideFreq: 4000 },
                    leveler: { levelerTarget: -14, levelerBrake: -60, levelerMaxPlus: 6, levelerMaxMinus: 12 },
                    compressor: { compStrength: 30, compAttack: 20, compRelease: 200, compMakeup: 0 },
                    multiband: { mbStrengthLow: 20, mbStrengthHigh: 40, mbCrossoverLow: 200, mbCrossoverHigh: 5000 },
                    limiter: { limStrength: 50, limAttack: 2, limRelease: 100, limCeiling: -0.1 }
                };

                const newInsert: FXInsert = {
                    id: `fx-${pluginId}-${Date.now()}`,
                    pluginId,
                    bypass: false,
                    settings: defaultSettings[pluginId] || {}
                };

                return {
                    faders: state.faders.map(f => f.id === trackId
                        ? { ...f, inserts: [...f.inserts, newInsert].slice(0, 4) } // Limit to 4 slots
                        : f)
                };
            }),

            removeInsert: (trackId, insertId) => set((state) => ({
                faders: state.faders.map(f => f.id === trackId
                    ? { ...f, inserts: f.inserts.filter(i => i.id !== insertId) }
                    : f)
            })),

            updateInsertSettings: (trackId, insertId, newSettings) => set((state) => ({
                faders: state.faders.map(f => f.id === trackId
                    ? { ...f, inserts: f.inserts.map(i => i.id === insertId ? { ...i, settings: { ...i.settings, ...newSettings } } : i) }
                    : f)
            })),

            toggleInsertBypass: (trackId, insertId) => set((state) => ({
                faders: state.faders.map(f => f.id === trackId
                    ? { ...f, inserts: f.inserts.map(i => i.id === insertId ? { ...i, bypass: !i.bypass } : i) }
                    : f)
            })),

            // Plugin Window Management
            openPluginIds: [],
            openPlugin: (insertId) => set((state) => ({
                openPluginIds: state.openPluginIds.includes(insertId) ? state.openPluginIds : [...state.openPluginIds, insertId]
            })),
            closePlugin: (insertId) => set((state) => ({
                openPluginIds: state.openPluginIds.filter(id => id !== insertId)
            })),
        }),
        {
            name: 'daw-session-storage',
            // Only persist tracks, faders, and basic state. Avoid persisting playback state.
            partialize: (state) => ({
                tracks: state.tracks,
                faders: state.faders,
                activeBottomPanel: state.activeBottomPanel,
                mixerBank: state.mixerBank,
                isFullMixer: state.isFullMixer,
                masterLevel: state.masterLevel,
            }),
        }
    )
);
