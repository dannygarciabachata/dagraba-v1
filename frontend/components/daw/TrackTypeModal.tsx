'use client';

import React from 'react';
import { X, Mic2, Radio, ArrowLeftRight, Crown, Piano, Cpu } from 'lucide-react';
import type { TrackType } from '@/store/useDAWStore';

interface TrackTypeOption {
    type: TrackType;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    border: string;
    bg: string;
}

const TRACK_OPTIONS: TrackTypeOption[] = [
    {
        type: 'mono',
        label: 'Mono',
        description: 'Canal de audio de un solo canal. Ideal para voz, guitarra, bajo.',
        icon: <Mic2 size={26} />,
        color: 'text-cyan-400',
        border: 'border-cyan-500/30 hover:border-cyan-400/60',
        bg: 'from-cyan-500/10',
    },
    {
        type: 'stereo',
        label: 'Stereo',
        description: 'Canal de audio estéreo izquierda/derecha. Para loops, samples y pads.',
        icon: <Radio size={26} />,
        color: 'text-blue-400',
        border: 'border-blue-500/30 hover:border-blue-400/60',
        bg: 'from-blue-500/10',
    },
    {
        type: 'aux',
        label: 'Auxiliar',
        description: 'Bus de envío/retorno (Send/Return). Para reverb, delay y efectos compartidos.',
        icon: <ArrowLeftRight size={26} />,
        color: 'text-orange-400',
        border: 'border-orange-500/30 hover:border-orange-400/60',
        bg: 'from-orange-500/10',
    },
    {
        type: 'master',
        label: 'Master',
        description: 'Salida maestra de la sesión. Procesamiento final antes del render.',
        icon: <Crown size={26} />,
        color: 'text-yellow-400',
        border: 'border-yellow-500/30 hover:border-yellow-400/60',
        bg: 'from-yellow-500/10',
    },
    {
        type: 'midi',
        label: 'MIDI',
        description: 'Secuenciador MIDI para controlar instrumentos externos o plugins.',
        icon: <Piano size={26} />,
        color: 'text-purple-400',
        border: 'border-purple-500/30 hover:border-purple-400/60',
        bg: 'from-purple-500/10',
    },
    {
        type: 'virtual_instrument',
        label: 'Instrumento Virtual',
        description: 'Plugin de síntesis y bancos de sonido. Piano, cuerdas, drums y más.',
        icon: <Cpu size={26} />,
        color: 'text-green-400',
        border: 'border-green-500/30 hover:border-green-400/60',
        bg: 'from-green-500/10',
    },
];

interface TrackTypeModalProps {
    onSelect: (type: TrackType, name: string) => void;
    onClose: () => void;
}

export function TrackTypeModal({ onSelect, onClose }: TrackTypeModalProps) {
    const [selected, setSelected] = React.useState<TrackType | null>(null);
    const [trackName, setTrackName] = React.useState('');

    const handleConfirm = () => {
        if (!selected) return;
        const defaultNames: Record<TrackType, string> = {
            mono: 'Mono Track',
            stereo: 'Stereo Track',
            aux: 'Aux Bus',
            master: 'Master',
            midi: 'MIDI Track',
            virtual_instrument: 'VInst',
        };
        onSelect(selected, trackName.trim() || defaultNames[selected]);
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#111] border border-[#2A2A2A] rounded-2xl w-full max-w-2xl p-6 animate-in zoom-in-95 fade-in duration-200 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-black text-white tracking-tight">Nuevo Track</h2>
                        <p className="text-[11px] text-[#555] uppercase tracking-widest mt-0.5">Selecciona el tipo de canal</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-[#555] hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Track Type Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {TRACK_OPTIONS.map(opt => (
                        <button
                            key={opt.type}
                            onClick={() => setSelected(opt.type)}
                            className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left bg-gradient-to-br ${opt.bg} to-transparent
                                ${selected === opt.type
                                    ? `${opt.border} ring-1 ring-white/10 scale-[1.02]`
                                    : `border-white/5 ${opt.border}`
                                }`}
                        >
                            {selected === opt.type && (
                                <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-black rounded-full" />
                                </div>
                            )}
                            <div className={`${opt.color} mb-3`}>{opt.icon}</div>
                            <div className="text-sm font-black text-white mb-1">{opt.label}</div>
                            <div className="text-[10px] text-[#666] leading-relaxed">{opt.description}</div>
                        </button>
                    ))}
                </div>

                {/* Track Name Input */}
                {selected && (
                    <div className="mb-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <label className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-2 block">Nombre del Track (opcional)</label>
                        <input
                            type="text"
                            value={trackName}
                            onChange={e => setTrackName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleConfirm()}
                            placeholder={`Ej. ${selected === 'mono' ? 'Lead Vocal' : selected === 'stereo' ? 'Loop Beat' : selected === 'midi' ? 'Piano MIDI' : selected === 'virtual_instrument' ? 'Strings VI' : selected === 'aux' ? 'Reverb Bus' : 'Master Out'}`}
                            autoFocus
                            className="w-full bg-[#0A0A0C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#555] outline-none transition-colors placeholder:text-[#333]"
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="px-5 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-xs font-bold text-[#888] hover:text-white transition-all">
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selected}
                        className={`px-8 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all ${selected ? 'bg-white text-black hover:bg-gray-100 shadow-lg' : 'bg-[#1A1A1A] text-[#444] cursor-not-allowed border border-[#2A2A2A]'}`}
                    >
                        CREAR TRACK
                    </button>
                </div>
            </div>
        </div>
    );
}
