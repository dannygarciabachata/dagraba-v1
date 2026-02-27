import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CreatorTrack {
    id: string;
    title: string;
    style: string;
    duration: string;
    image: string;
    tags: string[];
    lyrics: string;
    views: string;
    likes: number;
    url: string;
    streamAudioUrl?: string;
}


const MOCK_TRACKS: CreatorTrack[] = [
    {
        id: 'track-1',
        title: 'Sombras en la Calle',
        style: 'Dark Trap, 808s, Moody',
        duration: '2:45',
        image: 'https://picsum.photos/seed/darktrap/200/200',
        tags: ['Trap', 'Dark'],
        lyrics: "[Verse 1]\nCaminando en la penumbra de la ciudad\nBuscando una salida, una realidad\nLos bajos retumban en mi pecho hoy\nNo sé a dónde voy, pero aquí estoy.\n\n[Chorus]\nSombras en la calle, luces que se van\nEl eco de un sueño que no volverá.",
        views: '1.2k',
        likes: 124,
        url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73a56.mp3'
    },
    {
        id: 'track-2',
        title: 'Luces de Neón',
        style: 'Melodic Trap, Heavy Bass, Futuristic',
        duration: '3:10',
        image: 'https://picsum.photos/seed/neon/200/200',
        tags: ['Trap', 'Melodic'],
        lyrics: "[Verse 1]\nReflejos de neón en el asfalto frío\nUn mundo de cristal, un vacío mío\nLas máquinas cantan una melodía\nQue me atrapa el alma, pura fantasía.\n\n[Chorus]\nBrilla el neón, brilla el metal\nUn viaje eterno, algo sideral.",
        views: '850',
        likes: 92,
        url: 'https://cdn.pixabay.com/audio/2021/11/24/audio_12345678.mp3'
    }
];

interface CreatorState {
    tracks: CreatorTrack[];
    activeTrack: CreatorTrack | null;
    setTracks: (tracks: CreatorTrack[]) => void;
    setActiveTrack: (track: CreatorTrack) => void;
    addTrack: (track: CreatorTrack) => void;
    updateTrack: (id: string, updates: Partial<CreatorTrack>) => void;
    removeTrack: (id: string) => void;
}

export const useCreatorStore = create<CreatorState>()(
    persist(
        (set) => ({
            tracks: MOCK_TRACKS,
            activeTrack: MOCK_TRACKS[0],
            setTracks: (tracks) => set({ tracks }),
            setActiveTrack: (track) => set({ activeTrack: track }),
            addTrack: (track) => set((state) => ({
                tracks: [track, ...state.tracks],
                activeTrack: track
            })),
            updateTrack: (id, updates) => set((state) => ({
                tracks: state.tracks.map((t) => t.id === id ? { ...t, ...updates } : t),
                activeTrack: state.activeTrack?.id === id ? { ...state.activeTrack, ...updates } : state.activeTrack
            })),
            removeTrack: (id) => set((state) => ({
                tracks: state.tracks.filter((t) => t.id !== id),
                activeTrack: state.activeTrack?.id === id ? null : state.activeTrack
            }))
        }),
        {
            name: 'creator-tracks-storage',
        }
    )
);
