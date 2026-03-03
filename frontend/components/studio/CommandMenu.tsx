import React, { useState } from 'react';
import {
    ChevronDown,
    Zap,
    Waves,
    Volume2,
    Sparkles,
    Trash2,
    Plus
} from 'lucide-react';
import { useDAWStore, TrackCommand } from '@/store/useDAWStore';

interface CommandMenuProps {
    trackId: string;
}

const COMMAND_CATEGORIES = {
    groove: {
        label: 'Patrones Rítmicos (Groove)',
        icon: Zap,
        options: ['Majao', 'Mambo', 'Pambiche', 'Derecho', 'Tumbao', 'Síncopa'],
        color: 'text-orange-400',
        bg: 'bg-orange-400/10'
    },
    articulation: {
        label: 'Técnicas (Articulación)',
        icon: Waves,
        options: ['Slap', 'Mute (Sordina)', 'Picado (Metal)', 'Glissando', 'Vibrato', 'Rasgueo'],
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10'
    },
    dynamics: {
        label: 'Dinámicas Globales',
        icon: Volume2,
        options: ['Tuty (Full Power)', 'Crescendo', 'Diminuendo', 'Piano (Suave)'],
        color: 'text-purple-400',
        bg: 'bg-purple-400/10'
    },
    fills: {
        label: 'Improvisación (Fills)',
        icon: Sparkles,
        options: ['Escala de paso', 'Adorno de cierre', 'Relleno rítmico'],
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10'
    }
};

export function CommandMenu({ trackId }: CommandMenuProps) {
    const track = useDAWStore((state) => state.tracks.find(t => t.id === trackId));
    const addCommand = useDAWStore((state) => state.addTrackCommand);
    const removeCommand = useDAWStore((state) => state.removeTrackCommand);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedMeasure, setSelectedMeasure] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<keyof typeof COMMAND_CATEGORIES | null>(null);

    if (!track) return null;

    const handleAddCommand = (value: string) => {
        if (!selectedCategory) return;
        addCommand(trackId, {
            measure: selectedMeasure,
            category: selectedCategory,
            value
        });
        setIsOpen(false);
        setSelectedCategory(null);
    };

    return (
        <div className="flex flex-col gap-2 mt-2 border-t border-white/5 pt-3">
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black tracking-widest text-[#555] uppercase">Librería de Comandos</span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-silver-dark"
                >
                    <Plus size={12} />
                </button>
            </div>

            {/* List of active commands */}
            <div className="flex flex-wrap gap-1.5 px-1 max-h-[100px] overflow-y-auto custom-scrollbar">
                {(track.commands || []).sort((a, b) => a.measure - b.measure).map((cmd) => {
                    const CatIcon = COMMAND_CATEGORIES[cmd.category].icon;
                    return (
                        <div
                            key={cmd.id}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-md border border-white/5 ${COMMAND_CATEGORIES[cmd.category].bg} group/cmd shadow-lg`}
                        >
                            <span className="text-[9px] font-mono font-black text-white/40">M{cmd.measure}</span>
                            <CatIcon size={10} className={COMMAND_CATEGORIES[cmd.category].color} />
                            <span className="text-[10px] font-bold text-white uppercase tracking-tight">{cmd.value}</span>
                            <button
                                onClick={() => removeCommand(trackId, cmd.id)}
                                className="opacity-0 group-hover/cmd:opacity-100 ml-1 hover:text-red-500 transition-all"
                            >
                                <Trash2 size={10} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Dropdown Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div
                        className="w-full max-w-sm bg-[#111113] border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase">Inyectar Comando</h3>
                            <button onClick={() => setIsOpen(false)} className="text-silver-dark hover:text-white transition-colors">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>

                        {/* Measure Selector */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black tracking-widest text-silver-dark uppercase">Compás de Ejecución</label>
                            <input
                                type="number"
                                min="1"
                                value={selectedMeasure}
                                onChange={(e) => setSelectedMeasure(parseInt(e.target.value))}
                                className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-primary transition-all"
                            />
                        </div>

                        {/* Category Selector */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black tracking-widest text-silver-dark uppercase">Categoría</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(COMMAND_CATEGORIES).map(([key, cat]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedCategory(key as any)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedCategory === key
                                                ? 'bg-primary/20 border-primary text-white'
                                                : 'bg-white/5 border-white/5 text-silver-dark hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <cat.icon size={16} className={selectedCategory === key ? 'text-primary' : cat.color} />
                                        <span className="text-[11px] font-bold uppercase leading-tight">{cat.label.split(' ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Option Selector (Contextual) */}
                        {selectedCategory && (
                            <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
                                <label className="text-[10px] font-black tracking-widest text-silver-dark uppercase">Técnica Específica</label>
                                <div className="flex flex-wrap gap-2">
                                    {COMMAND_CATEGORIES[selectedCategory].options.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => handleAddCommand(opt)}
                                            className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-[#E0E0E0] hover:bg-white/15 hover:border-primary transition-all uppercase tracking-wide"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
