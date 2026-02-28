'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, RefreshCw, Brain, Piano as PianoIcon, ChevronDown } from 'lucide-react';
import { SOUND_BANKS, SoundBank, midiToFreq, type ADSR } from '@/lib/soundBanks';

interface VirtualInstrumentPluginProps {
    insert: { id: string; settings: any };
    onSettingsChange: (settings: any) => void;
}

// Piano keys: 2.5 octaves starting at C3 (MIDI 48) to E5 (MIDI 64+12)
const START_MIDI = 48; // C3
const NUM_WHITE_KEYS = 18;
const WHITE_KEY_SEQUENCE = [0, 2, 4, 5, 7, 9, 11]; // C D E F G A B semitones
const BLACK_KEY_POSITIONS: Record<number, number> = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 }; // semitone -> visual gap

function buildPianoKeys() {
    const keys: { midi: number; isBlack: boolean; position: number; label?: string }[] = [];
    let whitePos = 0;
    for (let octaveOffset = 0; octaveOffset < 3; octaveOffset++) {
        for (let semi = 0; semi < 12; semi++) {
            const midi = START_MIDI + octaveOffset * 12 + semi;
            const isBlack = [1, 3, 6, 8, 10].includes(semi);
            if (!isBlack) {
                keys.push({ midi, isBlack: false, position: whitePos, label: semi === 0 ? `C${Math.floor(midi / 12) - 1}` : undefined });
                whitePos++;
            } else {
                keys.push({ midi, isBlack: true, position: whitePos - 1 });
            }
        }
    }
    // Trim to NUM_WHITE_KEYS
    return keys.filter(k => !k.isBlack && k.position < NUM_WHITE_KEYS || k.isBlack && k.position < NUM_WHITE_KEYS - 1).slice(0, 40);
}

const PIANO_KEYS = buildPianoKeys();

let audioCtx: AudioContext | null = null;
const getAudioCtx = () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return audioCtx;
};

function playNote(midi: number, bank: SoundBank) {
    try {
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') ctx.resume();

        const freq = midiToFreq(midi) * Math.pow(2, bank.detune / 1200);
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = bank.oscillator;
        osc.frequency.value = freq;

        // ADSR
        const now = ctx.currentTime;
        const { attack, decay, sustain, release } = bank.adsr;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(bank.gain, now + attack);
        gainNode.gain.linearRampToValueAtTime(bank.gain * sustain, now + attack + decay);
        gainNode.gain.setValueAtTime(bank.gain * sustain, now + attack + decay + 0.2);
        gainNode.gain.linearRampToValueAtTime(0, now + attack + decay + 0.2 + release);

        // Filter
        if (bank.filterFreq > 0) {
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = bank.filterFreq;
            filter.Q.value = bank.filterQ;
            osc.connect(filter);
            filter.connect(gainNode);
        } else {
            osc.connect(gainNode);
        }
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + attack + decay + 0.2 + release + 0.1);
    } catch (e) {
        console.error('Audio playback error', e);
    }
}

const CATEGORY_LABELS: Record<string, string> = {
    keys: 'Teclados', strings: 'Cuerdas', bass: 'Bajo', synth: 'Sintetizadores',
    pad: 'Pads', brass: 'Metales', percussion: 'Percusión', fx: 'FX',
};

export function VirtualInstrumentPlugin({ insert, onSettingsChange }: VirtualInstrumentPluginProps) {
    const [selectedBankId, setSelectedBankId] = useState<string>(insert.settings?.bankId || 'grand_piano');
    const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
    const [showBankPicker, setShowBankPicker] = useState(false);
    const [showTrainModal, setShowTrainModal] = useState(false);
    const [octaveShift, setOctaveShift] = useState(0);
    const [showImport, setShowImport] = useState(false);
    const [importedName, setImportedName] = useState<string | null>(null);

    const bank = SOUND_BANKS.find(b => b.id === selectedBankId) || SOUND_BANKS[0];

    const handleBankSelect = (id: string) => {
        setSelectedBankId(id);
        setShowBankPicker(false);
        onSettingsChange({ ...insert.settings, bankId: id });
    };

    const triggerKey = useCallback((midi: number) => {
        const shifted = midi + octaveShift * 12;
        setActiveKeys(prev => new Set([...prev, shifted]));
        playNote(shifted, bank);
        setTimeout(() => setActiveKeys(prev => { const n = new Set(prev); n.delete(shifted); return n; }), 300);
    }, [bank, octaveShift]);

    // Keyboard shortcuts: a-s-d-f-g-h-j-k-l = white keys C3..A3
    useEffect(() => {
        const keyMap: Record<string, number> = { a: 48, s: 50, d: 52, f: 53, g: 55, h: 57, j: 59, k: 60, l: 62, w: 49, e: 51, t: 54, y: 56, u: 58 };
        const onKey = (e: KeyboardEvent) => {
            if (e.repeat || e.metaKey || e.ctrlKey) return;
            const midi = keyMap[e.key.toLowerCase()];
            if (midi) triggerKey(midi);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [triggerKey]);

    const whiteKeys = PIANO_KEYS.filter(k => !k.isBlack);
    const blackKeys = PIANO_KEYS.filter(k => k.isBlack);

    return (
        <div className="flex flex-col gap-4 p-4 bg-[#0A0A0C] border border-[#1A1A1A] rounded-xl min-w-[600px] relative">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                        <PianoIcon size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">DA GRABA</p>
                        <p className="text-sm font-black text-white">Virtual Instrument</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowImport(!showImport)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111] border border-[#222] rounded-lg text-[10px] font-bold text-[#666] hover:text-white transition-all">
                        <Upload size={11} /> Importar
                    </button>
                    <button onClick={() => setShowTrainModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg text-[10px] font-bold text-purple-400 hover:bg-purple-500/20 transition-all">
                        <Brain size={11} /> Entrenar IA
                    </button>
                </div>
            </div>

            {/* Bank Selector */}
            <div className="relative">
                <button
                    onClick={() => setShowBankPicker(!showBankPicker)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#111] border border-[#2A2A2A] rounded-xl hover:border-[#3A3A3A] transition-all"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl">{bank.icon}</span>
                        <div className="text-left">
                            <div className="text-sm font-black text-white">{bank.name}</div>
                            <div className="text-[9px] text-[#555] uppercase tracking-wider">{CATEGORY_LABELS[bank.category]}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {bank.aiTrainable && <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-[8px] font-black rounded">IA</span>}
                        {importedName && <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-[8px] font-black rounded">CUSTOM</span>}
                        <ChevronDown size={14} className={`text-[#555] transition-transform ${showBankPicker ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                {showBankPicker && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#111] border border-[#2A2A2A] rounded-xl z-50 overflow-y-auto max-h-64 custom-scrollbar shadow-2xl">
                        {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
                            const catBanks = SOUND_BANKS.filter(b => b.category === cat);
                            if (!catBanks.length) return null;
                            return (
                                <div key={cat}>
                                    <div className="px-4 py-2 text-[8px] font-black text-[#444] uppercase tracking-widest border-b border-[#1A1A1A]">{label}</div>
                                    {catBanks.map(b => (
                                        <button key={b.id} onClick={() => handleBankSelect(b.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left ${b.id === selectedBankId ? 'bg-white/5' : ''}`}>
                                            <span>{b.icon}</span>
                                            <span className="text-sm font-bold text-white flex-1">{b.name}</span>
                                            {b.id === selectedBankId && <div className="w-2 h-2 rounded-full bg-green-400" />}
                                        </button>
                                    ))}
                                </div>
                            );
                        }).filter(Boolean)}
                    </div>
                )}
            </div>

            {/* Import Panel */}
            {showImport && (
                <div className="p-4 bg-[#111] border-2 border-dashed border-[#2A2A2A] rounded-xl animate-in fade-in duration-200">
                    <p className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-3 text-center">Importar Instrumento (WAV · MP3)</p>
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                        <Upload size={24} className="text-[#444]" />
                        <span className="text-xs text-[#555]">Arrastra o haz click para importar</span>
                        <input type="file" accept=".wav,.mp3,.ogg" className="hidden" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) { setImportedName(file.name); setShowImport(false); }
                        }} />
                    </label>
                    {importedName && <p className="text-xs text-green-400 text-center mt-2">✓ {importedName}</p>}
                    <p className="text-[9px] text-[#333] text-center mt-3">La IA puede analizar e imitar el instrumento importado para producción automatizada.</p>
                </div>
            )}

            {/* Piano Keyboard */}
            <div className="relative overflow-x-auto custom-scrollbar pb-2">
                <div className="relative select-none" style={{ width: `${whiteKeys.length * 32}px`, height: '120px' }}>
                    {/* White Keys */}
                    {whiteKeys.map(k => (
                        <button
                            key={k.midi}
                            onPointerDown={() => triggerKey(k.midi)}
                            className={`absolute bottom-0 border border-[#333] rounded-b-md transition-all duration-75 ${activeKeys.has(k.midi + octaveShift * 12) ? 'bg-yellow-400 border-yellow-300' : 'bg-white hover:bg-gray-100'}`}
                            style={{ left: `${k.position * 32}px`, width: '30px', height: '110px' }}
                        >
                            {k.label && <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black text-gray-400">{k.label}</span>}
                        </button>
                    ))}
                    {/* Black Keys */}
                    {blackKeys.map(k => (
                        <button
                            key={k.midi}
                            onPointerDown={() => triggerKey(k.midi)}
                            className={`absolute top-0 z-10 rounded-b-sm transition-all duration-75 ${activeKeys.has(k.midi + octaveShift * 12) ? 'bg-yellow-500' : 'bg-[#111] hover:bg-[#222]'}`}
                            style={{ left: `${k.position * 32 + 21}px`, width: '20px', height: '70px' }}
                        />
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#555] font-bold uppercase tracking-widest">Octava</span>
                    <button onClick={() => setOctaveShift(p => Math.max(-2, p - 1))} className="w-7 h-7 bg-[#111] border border-[#222] rounded-lg text-white hover:bg-[#1A1A1A] text-xs font-bold transition-all">−</button>
                    <span className="text-sm font-black text-white w-6 text-center">{octaveShift >= 0 ? `+${octaveShift}` : octaveShift}</span>
                    <button onClick={() => setOctaveShift(p => Math.min(2, p + 1))} className="w-7 h-7 bg-[#111] border border-[#222] rounded-lg text-white hover:bg-[#1A1A1A] text-xs font-bold transition-all">+</button>
                </div>
                <p className="text-[9px] text-[#333] italic">Usa el teclado A-S-D-F... para tocar</p>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] text-[#555] font-bold uppercase tracking-widest">Web Audio API</span>
                </div>
            </div>

            {/* Train Modal */}
            {showTrainModal && (
                <div className="absolute inset-0 bg-black/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-5 z-50 p-6">
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Brain size={28} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-black text-white mb-1">Entrenar Banco de Sonidos</h3>
                        <p className="text-sm text-[#666] max-w-xs">Sube tus archivos VST3 o samples WAV para entrenar un banco personalizado usando Modal.com + IA.</p>
                    </div>
                    <div className="w-full max-w-xs space-y-3">
                        <div className="p-3 bg-[#111] border border-[#222] rounded-xl">
                            <p className="text-[10px] text-[#444] uppercase tracking-widest font-black mb-1">1. Subir VST3 / Samples</p>
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-[#666] hover:text-white transition-colors">
                                <Upload size={14} /> Seleccionar archivos...
                                <input type="file" accept=".vst3,.wav,.mp3,.zip" className="hidden" />
                            </label>
                        </div>
                        <div className="p-3 bg-[#111] border border-[#222] rounded-xl opacity-60">
                            <p className="text-[10px] text-[#444] uppercase tracking-widest font-black mb-1">2. Entrenar con Modal.com</p>
                            <p className="text-[10px] text-[#555]">El modelo aprenderá las características del instrumento para síntesis y generación.</p>
                        </div>
                        <div className="p-3 bg-[#111] border border-[#222] rounded-xl opacity-40">
                            <p className="text-[10px] text-[#444] uppercase tracking-widest font-black mb-1">3. Disponible en bancos IA</p>
                            <p className="text-[10px] text-[#555]">El banco entrenado aparecerá en la lista y estará disponible para la IA compositora.</p>
                        </div>
                    </div>
                    <p className="text-[9px] text-[#333]">⚠️ Requiere cuenta Modal.com configurada en el panel Admin.</p>
                    <button onClick={() => setShowTrainModal(false)} className="px-6 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-xs font-bold text-[#888] hover:text-white transition-all">Cerrar</button>
                </div>
            )}
        </div>
    );
}
