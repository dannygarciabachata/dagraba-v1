'use client';

import React, { useState } from 'react';
import { X, Layers, Music, Mic2, Drum, GitBranch, Piano, ArrowRight } from 'lucide-react';
import { useCreatorStore } from '@/store/useCreatorStore';
import { useMasteringStore } from '@/store/useMasteringStore';
import { useDAWStore } from '@/store/useDAWStore';

interface StemExtractModalProps {
    onClose: () => void;
}

// Stem definitions — these are the track names + colors created for each song
const STEM_DEFINITIONS = [
    { name: 'Vocal', color: '#00F0FF', trackType: 'mono' as const },
    { name: 'Beat', color: '#FF6B00', trackType: 'stereo' as const },
    { name: 'Bajo', color: '#A4ECA1', trackType: 'mono' as const },
    { name: 'Melodía', color: '#E2A04A', trackType: 'stereo' as const },
    { name: 'FX', color: '#D94AE2', trackType: 'stereo' as const },
];

export function StemExtractModal({ onClose }: StemExtractModalProps) {
    const creatorTracks = useCreatorStore((s) => s.tracks);
    const masteringHistory = useMasteringStore((s) => s.history);
    const addTrack = useDAWStore((s) => s.addTrack);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [extracting, setExtracting] = useState(false);
    const [done, setDone] = useState(false);

    // Combine creator + mastering sources into one selectable list
    const songList = [
        ...creatorTracks.map((t) => ({
            id: t.id,
            title: t.title,
            subtitle: t.style || 'AI Creator',
            audioUrl: t.streamAudioUrl || t.url,
            source: 'creator' as const,
        })),
        ...masteringHistory.slice(0, 8).map((p) => ({
            id: p.id,
            title: p.name,
            subtitle: `Masterización · ${p.dna}`,
            audioUrl: typeof p.audioUrl === 'string' && !p.audioUrl.startsWith('blob:') ? p.audioUrl : null,
            source: 'mastering' as const,
        })),
    ];

    const handleExtract = async () => {
        if (!selectedId) return;
        const song = songList.find((s) => s.id === selectedId);
        if (!song) return;

        setExtracting(true);

        // Simulate stem separation delay (250ms per stem)
        for (let i = 0; i < STEM_DEFINITIONS.length; i++) {
            await new Promise((r) => setTimeout(r, 250));
            const stem = STEM_DEFINITIONS[i];
            addTrack(
                `${song.title} · ${stem.name}`,
                stem.color,
                stem.trackType,
                song.audioUrl ? `${song.audioUrl}?stem=${stem.name.toLowerCase()}` : undefined,
            );
        }

        setExtracting(false);
        setDone(true);

        // Auto-close after showing success
        setTimeout(() => onClose(), 1200);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-[#0B1015] border border-white/10 rounded-2xl w-full max-w-lg shadow-[0_0_60px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-lg border border-cyan-500/20">
                            <Layers size={18} className="text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white tracking-widest uppercase">Extraer Stems al Editor</h3>
                            <p className="text-[10px] text-white/40 mt-0.5">Selecciona una canción para separar sus pistas</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Song List */}
                <div className="p-4 flex flex-col gap-2 max-h-[340px] overflow-y-auto custom-scrollbar">
                    {songList.length === 0 && (
                        <div className="text-center py-10 text-white/20">
                            <Music size={36} className="mx-auto mb-3 opacity-30" />
                            <p className="text-xs font-bold tracking-widest uppercase">No hay canciones disponibles</p>
                            <p className="text-[10px] mt-1">Genera una canción en Crear primero</p>
                        </div>
                    )}
                    {songList.map((song) => (
                        <button
                            key={song.id}
                            onClick={() => setSelectedId(song.id)}
                            className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${selectedId === song.id
                                ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                                : 'bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/10'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${song.source === 'creator'
                                ? 'bg-orange-500/20 border border-orange-500/30'
                                : 'bg-purple-500/20 border border-purple-500/30'
                                }`}>
                                {song.source === 'creator' ? (
                                    <Music size={16} className="text-orange-400" />
                                ) : (
                                    <Layers size={16} className="text-purple-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{song.title}</p>
                                <p className="text-[10px] text-white/40 mt-0.5 truncate">{song.subtitle}</p>
                            </div>
                            {selectedId === song.id && (
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Stem Preview (when song selected) */}
                {selectedId && !done && (
                    <div className="px-4 pb-2">
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">Se crearán estas pistas en el editor:</p>
                        <div className="flex gap-2 flex-wrap">
                            {STEM_DEFINITIONS.map((stem, i) => (
                                <div
                                    key={stem.name}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border"
                                    style={{
                                        background: `${stem.color}15`,
                                        borderColor: `${stem.color}40`,
                                        color: stem.color,
                                        animationDelay: `${i * 50}ms`,
                                    }}
                                >
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: stem.color }} />
                                    {stem.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-4">
                    {done ? (
                        <div className="flex items-center gap-2 text-green-400 text-sm font-bold mx-auto">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">✓</div>
                            ¡Stems añadidos al editor!
                        </div>
                    ) : (
                        <>
                            <button onClick={onClose} className="px-5 py-2 text-white/40 hover:text-white text-xs font-bold tracking-widest transition-colors">
                                Cancelar
                            </button>
                            <button
                                onClick={handleExtract}
                                disabled={!selectedId || extracting}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                            >
                                {extracting ? (
                                    <>
                                        <div className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />
                                        Separando stems...
                                    </>
                                ) : (
                                    <>
                                        <Layers size={14} />
                                        Abrir en Editor
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
