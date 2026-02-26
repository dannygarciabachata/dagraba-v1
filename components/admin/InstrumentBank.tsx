'use client';

import React, { useState, useEffect } from 'react';
import { Music, Play, Disc, Tag, Layers, ChevronRight, Activity, Database } from 'lucide-react';

interface InstrumentModel {
    id: string;
    name: string;
    description?: string;
    tags: string[];
    baseModel: string;
    status: string;
    createdAt: string;
}

export function InstrumentBank() {
    const [models, setModels] = useState<InstrumentModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            const response = await fetch('/api/ai/train/sao');
            const data = await response.json();
            // Using mock data if API is empty for now to show the UI
            setModels(data.instruments || [
                {
                    id: 'sao-bolero-01',
                    name: 'Bolero Orchestra V1',
                    description: 'Full orchestra for Bolero styles',
                    tags: ['Bolero', 'Orchestra', 'Acoustic'],
                    baseModel: 'Stable Audio Open 1.0',
                    status: 'READY',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'sao-trap-02',
                    name: 'Trap Synth Engine',
                    description: 'Aggressive brass and pads',
                    tags: ['Trap', 'Electronic', 'Dirty'],
                    baseModel: 'Stable Audio Open 1.0',
                    status: 'TRAINING',
                    createdAt: new Date().toISOString()
                }
            ]);
        } catch (error) {
            console.error('Failed to fetch instrument models:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="instrument-bank" className="bg-[#0A0A0C]/80 backdrop-blur-md border border-[#333] rounded-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-md">
                        <Database size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-widest text-[#E0E0E0]">INSTRUMENT BANK</h2>
                        <p className="text-xs text-[#888]">Modelos de Stable Audio Open Finetuneados</p>
                    </div>
                </div>
                <button
                    onClick={fetchModels}
                    className="text-[10px] font-black tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors uppercase"
                >
                    Actualizar Banco
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full h-40 flex items-center justify-center">
                        <Activity className="animate-spin text-indigo-500" />
                    </div>
                ) : models.length === 0 ? (
                    <div className="col-span-full text-center p-8 border border-dashed border-[#222] rounded-lg">
                        <p className="text-sm text-[#555]">No se han encontrado modelos de instrumentos entrenados.</p>
                    </div>
                ) : (
                    models.map((model) => (
                        <div
                            key={model.id}
                            className="bg-[#111] border border-[#222] hover:border-indigo-500/50 rounded-lg p-5 transition-all group relative overflow-hidden"
                        >
                            {/* Status Badge */}
                            <div className={`absolute top-0 right-0 px-2 py-1 text-[8px] font-bold tracking-tighter uppercase rounded-bl-lg ${model.status === 'READY' ? 'bg-green-500/20 text-green-400 border-l border-b border-green-500/30' : 'bg-yellow-500/20 text-yellow-500 border-l border-b border-yellow-500/30 animate-pulse'
                                }`}>
                                {model.status}
                            </div>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-[#0A0A0C] border border-[#333] rounded-lg text-indigo-500 group-hover:text-indigo-400 transition-colors">
                                    <Disc size={24} className={model.status === 'TRAINING' ? 'animate-spin' : ''} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-silver-light truncate">{model.name}</h3>
                                    <p className="text-[10px] text-[#666] line-clamp-1">{model.description}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {model.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 bg-indigo-900/10 border border-indigo-500/20 text-[#888] text-[9px] rounded-full uppercase tracking-widest font-bold">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#222]">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-[#444] font-bold tracking-widest uppercase">Base</span>
                                    <span className="text-[10px] text-[#888] font-mono">{model.baseModel}</span>
                                </div>

                                <button className="p-2 bg-[#222] hover:bg-indigo-600 text-white rounded-md transition-all shadow-lg active:scale-95">
                                    <Play size={14} fill="currentColor" />
                                </button>
                            </div>

                            {/* Decorative line */}
                            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
