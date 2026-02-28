'use client';

import React from 'react';
import { Database, UploadCloud, Folder, FileMusic, Music, Star, Trash2 } from 'lucide-react';

const mockAssets = [
    { id: 1, name: 'Beat Master Bounce_v2.wav', type: 'audio', category: 'Beat', isPremium: true, size: '45 MB' },
    { id: 2, name: 'Sub Bass Synth.vst', type: 'instrument', category: 'VST', isPremium: false, size: '12 MB' },
    { id: 3, name: 'Khea_V1_Epoch100.pth', type: 'model', category: 'Voice Model', isPremium: true, size: '200 MB' },
    { id: 4, name: 'Piano_Grand_Classic.nki', type: 'instrument', category: 'Kontakt', isPremium: true, size: '1.2 GB' },
];

export function AssetManager() {
    return (
        <section id="assets" className="bg-[#0A0A0C]/80 backdrop-blur-md border border-[#333] rounded-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-6 mt-8">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-[#00F0FF] to-blue-600 rounded-md">
                        <Database size={20} className="text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-widest text-[#E0E0E0]">MARKETPLACE ASSETS</h2>
                        <p className="text-xs text-[#888]">Gestión de Instrumentos, Beats y Modelos (S3)</p>
                    </div>
                </div>

                <button className="bg-[#222] hover:bg-[#333] text-white border border-[#444] px-4 py-2 rounded flex items-center gap-2 text-xs font-bold tracking-widest transition-colors">
                    <UploadCloud size={16} /> Subir Asset
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Folder Tree Sidebar */}
                <div className="col-span-1 border border-[#333] rounded-md bg-[#111] p-4 flex flex-col gap-2">
                    <h3 className="text-[10px] text-[#888] uppercase tracking-widest font-bold mb-2">Directorios S3</h3>

                    <FolderItem name="Beats Oficiales" count={12} active />
                    <FolderItem name="Stems y Acapellas" count={45} />
                    <FolderItem name="Instrumentos Virtuales" count={8} />
                    <FolderItem name="Modelos de Voz (.pth)" count={3} />
                    <FolderItem name="Efectos SFX" count={120} />
                </div>

                {/* File Explorer Content */}
                <div className="col-span-1 lg:col-span-3 border border-[#333] rounded-md bg-[#0A0A0C] overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 bg-[#111] p-3 border-b border-[#333] text-[10px] font-bold text-[#888] tracking-widest uppercase">
                        <div className="col-span-5">Archivo</div>
                        <div className="col-span-2">Categoría</div>
                        <div className="col-span-2">Tamaño</div>
                        <div className="col-span-2">Acceso</div>
                        <div className="col-span-1 text-right">Acciones</div>
                    </div>

                    <div className="flex flex-col">
                        {mockAssets.map((asset) => (
                            <div key={asset.id} className="grid grid-cols-12 gap-4 p-3 border-b border-[#222] hover:bg-[#1A1A1C] transition-colors items-center text-sm">
                                <div className="col-span-5 flex items-center gap-3 text-[#E0E0E0]">
                                    {asset.type === 'audio' ? <Music size={16} className="text-[#00F0FF]" /> :
                                        asset.type === 'model' ? <TermIcon size={16} className="text-purple-400" /> :
                                            <FileMusic size={16} className="text-[#FF6B00]" />}
                                    <span className="truncate">{asset.name}</span>
                                </div>
                                <div className="col-span-2 text-[#888]">{asset.category}</div>
                                <div className="col-span-2 text-[#666] font-mono text-xs">{asset.size}</div>
                                <div className="col-span-2">
                                    {asset.isPremium ? (
                                        <span className="bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider flex items-center justify-center gap-1 w-max">
                                            <Star size={10} fill="currentColor" /> Premium
                                        </span>
                                    ) : (
                                        <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider w-max block text-center">
                                            Gratis
                                        </span>
                                    )}
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button className="text-[#666] hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

function FolderItem({ name, count, active = false }: { name: string, count: number, active?: boolean }) {
    return (
        <button className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${active ? 'bg-[#222] text-white border border-[#444]' : 'text-[#888] hover:text-white hover:bg-[#1A1A1C]'
            }`}>
            <div className="flex items-center gap-2">
                <Folder size={14} className={active ? "fill-[#00F0FF]/20 text-[#00F0FF]" : ""} />
                <span className="text-xs font-bold">{name}</span>
            </div>
            <span className="text-[10px] bg-black px-1.5 py-0.5 rounded text-[#666]">{count}</span>
        </button>
    );
}

// Reuse icon from lucide that wasn't imported at the top
import { Terminal as TermIcon } from 'lucide-react';
