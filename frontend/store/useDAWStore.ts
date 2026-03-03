import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TrackType = 'mono' | 'stereo' | 'aux' | 'master' | 'midi' | 'virtual_instrument';

export interface DAWTrack {
    id: string;
    name: string;
    color: string;
    trackType: TrackType;
    audioUrl?: string;
    isArmed?: boolean;
    inputSource?: string;
    outputTarget?: string;
    isMuted?: boolean;
    isSoloed?: boolean;
}

export interface AudioClip {
    id: string;
    trackId: string;
    startTime: number;   // seconds
    duration: number;    // seconds
    color: string;
    name: string;
    audioUrl?: string;
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
    isArmed: boolean;
    inputSource: string; // 'none' | 'in-1' | 'in-2' | 'stereo-1-2' | 'midi-all' | 'midi-hardware'
    outputTarget: string; // 'master' | 'out-1' | 'out-2' | 'out-1-2'
    inserts: FXInsert[];
}

export type BottomPanelState = 'mixer' | 'piano_roll' | 'drums' | 'keys' | 'closed';
export type CloudStatus = 'disconnected' | 'connecting' | 'connected';

interface DAWStore {
    faders: FaderState[];
    tracks: DAWTrack[];
    clips: AudioClip[];
    isTraining: boolean;
    activeArtistId: string | null;
    activeBottomPanel: BottomPanelState;
    mixerBank: 1 | 2; // 1 = Ch 1-16, 2 = Ch 17-32
    cloudStatus: CloudStatus;
    systemMessage: string;
    isMetronomeOn: boolean;
    tempo: number;
    isPlaying: boolean;
    isGlobalRecording: boolean;
    midiInputId: string | null;
    audioInputDeviceId: string | null;
    audioOutputDeviceId: string | null;
    masterLevel: number;
    currentPreviewTrack: any | null;
    isFullMixer: boolean;
    trackHeights: Record<string, number>; // Global heights for each track id
    rightPanelWidth: number;
    sidebarWidth: number;
    isProcessing: boolean;

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
    setTrackHeight: (id: string, height: number) => void;
    setAllTrackHeights: (delta: number, min: number, max: number) => void;

    // Hardware & Routing
    toggleRecordArm: (id: string) => void;
    setInputSource: (id: string, source: string) => void;
    setOutputTarget: (id: string, target: string) => void;
    setMidiInputId: (id: string | null) => void;
    setAudioDevices: (inputId: string | null, outputId: string | null) => void;
    setIsGlobalRecording: (recording: boolean) => void;

    // Track Management
    addTrack: (name?: string, color?: string, trackType?: TrackType, audioUrl?: string) => void;
    setTracks: (tracks: DAWTrack[]) => void;
    clearTracks: () => void;
    removeTrack: (id: string) => void;

    // Clip Management
    addClip: (clip: AudioClip) => void;
    updateClip: (id: string, updates: Partial<AudioClip>) => void;
    removeClip: (id: string) => void;
    setClips: (clips: AudioClip[]) => void;
    toggleMetronome: () => void;
    setTempo: (tempo: number) => void;
    setIsPlaying: (playing: boolean) => void;
    setMasterLevel: (level: number) => void;
    setPreviewTrack: (track: any | null) => void;
    setRightPanelWidth: (width: number) => void;
    setSidebarWidth: (width: number) => void;
    setIsProcessing: (isProcessing: boolean) => void;

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
            faders: [],
            tracks: [],
            clips: [],
            isTraining: false,
            activeArtistId: null,
            activeBottomPanel: 'mixer', // Mixer opens by default
            mixerBank: 1,
            cloudStatus: 'disconnected',
            systemMessage: '',
            isMetronomeOn: false,
            tempo: 120,
            isPlaying: false,
            isGlobalRecording: false,
            midiInputId: null,
            audioInputDeviceId: null,
            audioOutputDeviceId: null,
            masterLevel: 0,
            currentPreviewTrack: null,
            isFullMixer: false,
            trackHeights: {},
            rightPanelWidth: 0,
            sidebarWidth: 0,
            isProcessing: false,

            setTracks: (tracks: DAWTrack[]) => set((state) => {
                const newFaders: FaderState[] = tracks.map((track) => ({
                    id: track.id,
                    label: track.name.toUpperCase(),
                    value: 75,
                    isMuted: false,
                    pan: 0,
                    isSoloed: false,
                    isArmed: false,
                    inputSource: 'none',
                    outputTarget: 'master',
                    inserts: []
                }));
                const initializedTracks = tracks.map(t => ({
                    ...t,
                    isArmed: t.isArmed ?? false,
                    inputSource: t.inputSource ?? 'none',
                    outputTarget: t.outputTarget ?? 'master',
                    isMuted: t.isMuted ?? false,
                    isSoloed: t.isSoloed ?? false
                }));

                const newClips: AudioClip[] = tracks
                    .filter(t => t.audioUrl)
                    .map(t => ({
                        id: `clip-${t.id}`,
                        trackId: t.id,
                        startTime: 0,
                        duration: 120, // Default duration if unknown
                        color: t.color,
                        name: t.name,
                        audioUrl: t.audioUrl,
                    }));

                return { tracks: initializedTracks, faders: newFaders, clips: newClips };
            }),

            addTrack: (name, color, trackType = 'mono', audioUrl) => set((state) => {
                const newId = `t${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const trackColor = color || ['#00F0FF', '#FF6B00', '#A4ECA1', '#E2A04A', '#D94AE2', '#FF0055', '#55FF00'][Math.floor(Math.random() * 7)];
                const trackName = name || `Audio Track ${state.tracks.length + 1}`;

                const newTrack: DAWTrack = {
                    id: newId,
                    name: trackName,
                    color: trackColor,
                    trackType,
                    audioUrl,
                    isArmed: false,
                    inputSource: 'none',
                    outputTarget: 'master',
                    isMuted: false,
                    isSoloed: false
                };
                const newFader: FaderState = {
                    id: newId,
                    label: trackName.toUpperCase(),
                    value: 75,
                    isMuted: false,
                    pan: 0,
                    isSoloed: false,
                    isArmed: false,
                    inputSource: 'none',
                    outputTarget: 'master',
                    inserts: []
                };

                return {
                    tracks: [...state.tracks, newTrack],
                    faders: [...state.faders, newFader],
                    trackHeights: { ...state.trackHeights, [newId]: 64 }
                };
            }),

            clearTracks: () => set({ tracks: [], faders: [], trackHeights: {} }),

            removeTrack: (id) => set((state) => {
                const newHeights = { ...state.trackHeights };
                delete newHeights[id];
                return {
                    tracks: state.tracks.filter(t => t.id !== id),
                    faders: state.faders.filter(f => f.id !== id),
                    clips: state.clips.filter(c => c.trackId !== id),
                    trackHeights: newHeights
                };
            }),

            toggleMetronome: () => set((state) => ({
                isMetronomeOn: !state.isMetronomeOn
            })),
            setTempo: (tempo) => set({ tempo }),

            addClip: (clip) => set((state) => ({ clips: [...state.clips, clip] })),
            updateClip: (id, updates) => set((state) => ({
                clips: state.clips.map(c => c.id === id ? { ...c, ...updates } : c)
            })),
            removeClip: (id) => set((state) => ({ clips: state.clips.filter(c => c.id !== id) })),
            setClips: (clips) => set({ clips }),

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
            setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
            setSidebarWidth: (width) => set({ sidebarWidth: width }),
            setIsProcessing: (isProcessing) => set({ isProcessing }),

            setTrackHeight: (id, height) => set((state) => ({
                trackHeights: { ...state.trackHeights, [id]: height }
            })),

            setAllTrackHeights: (delta, min, max) => set((state) => {
                const newHeights = { ...state.trackHeights };
                state.tracks.forEach(t => {
                    const current = newHeights[t.id] ?? 64;
                    newHeights[t.id] = Math.max(min, Math.min(max, current + delta));
                });
                return { trackHeights: newHeights };
            }),

            toggleRecordArm: (id) => set((state) => ({
                faders: state.faders.map((f) => f.id === id ? { ...f, isArmed: !f.isArmed } : f)
            })),

            setInputSource: (id, source) => set((state) => ({
                faders: state.faders.map((f) => f.id === id ? { ...f, inputSource: source } : f)
            })),

            setOutputTarget: (id, target) => set((state) => ({
                faders: state.faders.map((f) => f.id === id ? { ...f, outputTarget: target } : f)
            })),

            setMidiInputId: (id) => set({ midiInputId: id }),

            setAudioDevices: (inputId, outputId) => set({
                audioInputDeviceId: inputId,
                audioOutputDeviceId: outputId
            }),

            setIsGlobalRecording: (recording) => set({ isGlobalRecording: recording }),

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
                clips: state.clips,
                tempo: state.tempo,
                activeBottomPanel: state.activeBottomPanel,
                mixerBank: state.mixerBank,
                isFullMixer: state.isFullMixer,
                masterLevel: state.masterLevel,
                trackHeights: state.trackHeights,
            }),
        }
    )
);
