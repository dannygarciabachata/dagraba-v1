/**
 * Sound Banks for DA GRABA Virtual Instrument Plugin
 * Each bank defines synthesis parameters for Web Audio API playback
 * and can optionally load sample buffers.
 */

export type OscType = 'sine' | 'square' | 'sawtooth' | 'triangle';

export interface ADSR {
    attack: number;    // seconds
    decay: number;     // seconds
    sustain: number;   // 0-1
    release: number;   // seconds
}

export interface SoundBank {
    id: string;
    name: string;
    category: 'keys' | 'strings' | 'bass' | 'synth' | 'percussion' | 'brass' | 'pad' | 'fx';
    oscillator: OscType;
    adsr: ADSR;
    detune: number;         // cents
    filterFreq: number;     // Hz (0 = no filter)
    filterQ: number;
    gain: number;           // 0-1
    color: string;          // UI accent color
    icon: string;           // emoji
    aiTrainable: boolean;   // Can be trained with Modal
    hasCustomSamples?: boolean;
    sampleUrls?: Record<string, string>; // note -> audioURL
}

export const SOUND_BANKS: SoundBank[] = [
    {
        id: 'grand_piano',
        name: 'Grand Piano',
        category: 'keys',
        oscillator: 'triangle',
        adsr: { attack: 0.005, decay: 1.2, sustain: 0.3, release: 1.0 },
        detune: 0,
        filterFreq: 5000,
        filterQ: 0.5,
        gain: 0.7,
        color: '#00F0FF',
        icon: '🎹',
        aiTrainable: true,
    },
    {
        id: 'electric_piano',
        name: 'Electric Piano',
        category: 'keys',
        oscillator: 'sine',
        adsr: { attack: 0.01, decay: 0.8, sustain: 0.5, release: 0.5 },
        detune: 5,
        filterFreq: 3000,
        filterQ: 1,
        gain: 0.65,
        color: '#F5A623',
        icon: '🎹',
        aiTrainable: true,
    },
    {
        id: 'strings',
        name: 'Strings Ensemble',
        category: 'strings',
        oscillator: 'sawtooth',
        adsr: { attack: 0.4, decay: 0.2, sustain: 0.8, release: 0.8 },
        detune: 8,
        filterFreq: 2000,
        filterQ: 0.7,
        gain: 0.5,
        color: '#E8D16E',
        icon: '🎻',
        aiTrainable: true,
    },
    {
        id: 'violin_solo',
        name: 'Violin Solo',
        category: 'strings',
        oscillator: 'sawtooth',
        adsr: { attack: 0.3, decay: 0.1, sustain: 0.9, release: 0.6 },
        detune: 3,
        filterFreq: 3500,
        filterQ: 1.2,
        gain: 0.55,
        color: '#E8A54B',
        icon: '🎻',
        aiTrainable: true,
    },
    {
        id: 'bass_guitar',
        name: 'Bass Guitar',
        category: 'bass',
        oscillator: 'triangle',
        adsr: { attack: 0.005, decay: 0.3, sustain: 0.6, release: 0.3 },
        detune: -1200,
        filterFreq: 800,
        filterQ: 2,
        gain: 0.8,
        color: '#FF6B00',
        icon: '🎸',
        aiTrainable: true,
    },
    {
        id: 'synth_bass',
        name: 'Synth Bass',
        category: 'bass',
        oscillator: 'square',
        adsr: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.2 },
        detune: -1200,
        filterFreq: 600,
        filterQ: 3,
        gain: 0.75,
        color: '#FF4040',
        icon: '🔊',
        aiTrainable: true,
    },
    {
        id: 'synth_lead',
        name: 'Synth Lead',
        category: 'synth',
        oscillator: 'sawtooth',
        adsr: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.3 },
        detune: 0,
        filterFreq: 4000,
        filterQ: 5,
        gain: 0.6,
        color: '#A855F7',
        icon: '🌊',
        aiTrainable: true,
    },
    {
        id: 'synth_pad',
        name: 'Synth Pad',
        category: 'pad',
        oscillator: 'sine',
        adsr: { attack: 0.5, decay: 0.5, sustain: 0.7, release: 1.5 },
        detune: 12,
        filterFreq: 1500,
        filterQ: 2,
        gain: 0.45,
        color: '#06B6D4',
        icon: '☁️',
        aiTrainable: true,
    },
    {
        id: 'brass',
        name: 'Brass Section',
        category: 'brass',
        oscillator: 'square',
        adsr: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.4 },
        detune: 0,
        filterFreq: 2500,
        filterQ: 1.5,
        gain: 0.6,
        color: '#F59E0B',
        icon: '🎺',
        aiTrainable: true,
    },
    {
        id: 'organ',
        name: 'Church Organ',
        category: 'keys',
        oscillator: 'sine',
        adsr: { attack: 0.01, decay: 0, sustain: 1, release: 0.1 },
        detune: 0,
        filterFreq: 0,
        filterQ: 0,
        gain: 0.65,
        color: '#8B5CF6',
        icon: '⛪',
        aiTrainable: false,
    },
    {
        id: 'drums_808',
        name: '808 Drums',
        category: 'percussion',
        oscillator: 'sine',
        adsr: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.5 },
        detune: -1200,
        filterFreq: 200,
        filterQ: 5,
        gain: 0.9,
        color: '#EF4444',
        icon: '🥁',
        aiTrainable: true,
    },
    {
        id: 'marimba',
        name: 'Marimba',
        category: 'percussion',
        oscillator: 'triangle',
        adsr: { attack: 0.001, decay: 0.8, sustain: 0.1, release: 0.4 },
        detune: 0,
        filterFreq: 0,
        filterQ: 0,
        gain: 0.65,
        color: '#10B981',
        icon: '🪘',
        aiTrainable: false,
    },
];

export const getBankById = (id: string): SoundBank | undefined =>
    SOUND_BANKS.find(b => b.id === id);

export const getBanksByCategory = (category: SoundBank['category']): SoundBank[] =>
    SOUND_BANKS.filter(b => b.category === category);

/** Convert MIDI note number to frequency in Hz */
export const midiToFreq = (midi: number): number =>
    440 * Math.pow(2, (midi - 69) / 12);

/** Get note name from MIDI number */
export const midiToName = (midi: number): string => {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return names[midi % 12] + Math.floor(midi / 12 - 1);
};
