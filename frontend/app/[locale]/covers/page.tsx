'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Download, Share2, Save, ExternalLink } from 'lucide-react';

export default function CanvaCovers() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const trackId = searchParams.get('trackId');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Simulate loading state for the Canva integration
        const timer = setTimeout(() => setIsLoaded(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col h-full w-full bg-[#050505] p-8 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-[#111] border border-[#222] rounded-full text-[#888] hover:text-white hover:bg-[#222] transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Diseño de Portada</h1>
                        <p className="text-xs text-[#666] font-bold tracking-widest mt-1">POWERED BY CANVA CONNECT</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-[#111] border border-[#222] rounded-xl text-xs font-black tracking-widest text-[#888] hover:text-white transition-all flex items-center gap-2">
                        <Download size={14} /> EXPORTAR
                    </button>
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl text-xs font-black tracking-widest text-white shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2">
                        <Save size={14} /> GUARDAR EN TRACK
                    </button>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex gap-8 min-h-[600px]">
                {/* Left Panel: Canva Canvas Dummy */}
                <div className="flex-1 bg-[#0A0A0C] border border-[#222] rounded-3xl relative overflow-hidden flex flex-col shadow-2xl">
                    <div className="bg-[#111] border-b border-[#222] px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            <span className="text-[10px] font-black tracking-widest text-[#888] uppercase">Connect Session Active</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-24 h-1 bg-[#222] rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col p-6 relative">
                        {/* Browser Window UI */}
                        <div className="flex-1 w-full bg-[#151515] rounded-t-xl rounded-b-md border border-[#333] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
                            {/* Browser Header */}
                            <div className="h-10 bg-[#222] border-b border-[#333] flex items-center px-4 gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="flex-1 bg-[#111] rounded-md h-6 border border-[#333] flex items-center px-3 justify-center">
                                    <span className="text-[10px] text-[#666] font-mono tracking-widest">https://canva.com/design/api-connect</span>
                                </div>
                            </div>

                            {/* Browser Content (Iframe / Embed) */}
                            <div className="flex-1 relative bg-white flex items-center justify-center">
                                {!isLoaded ? (
                                    <div className="flex flex-col items-center gap-4 bg-[#111] absolute inset-0 justify-center">
                                        <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                        <span className="text-[10px] font-bold text-[#888] tracking-widest uppercase">Cargando Editor de Canva...</span>
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-[#E8EAED] flex flex-col relative overflow-hidden">
                                        {/* Canva Top Bar */}
                                        <div className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center px-4 justify-between shrink-0">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-white rounded flex items-center justify-center font-bold text-blue-600 text-xs shadow-sm">C</div>
                                                <span className="text-white font-semibold text-sm">Canva Connect API</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="h-8 px-3 bg-white/20 rounded border border-white/30 flex items-center text-white text-xs font-medium cursor-not-allowed">
                                                    Share
                                                </div>
                                                <div className="h-8 px-3 bg-white text-blue-600 rounded flex items-center text-xs font-bold cursor-not-allowed shadow-sm">
                                                    Export
                                                </div>
                                            </div>
                                        </div>
                                        {/* Canva Main Workspace */}
                                        <div className="flex-1 flex">
                                            {/* Canva Sidebar */}
                                            <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-6 shrink-0 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.05)]">
                                                <div className="w-8 h-8 rounded hover:bg-gray-100 flex flex-col items-center justify-center gap-1 cursor-not-allowed text-gray-500">
                                                    <div className="w-4 h-4 rounded-sm border-2 border-current" />
                                                </div>
                                                <div className="w-8 h-8 rounded hover:bg-gray-100 flex flex-col items-center justify-center gap-1 cursor-not-allowed text-gray-500">
                                                    <div className="text-sm font-bold">T</div>
                                                </div>
                                                <div className="w-8 h-8 rounded hover:bg-gray-100 flex flex-col items-center justify-center gap-1 cursor-not-allowed text-gray-500">
                                                    <div className="w-4 h-4 bg-current rounded-full" />
                                                </div>
                                            </div>
                                            {/* Canva Canvas */}
                                            <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 overflow-auto">
                                                <div className="w-[500px] h-[500px] bg-gradient-to-br from-gray-900 to-black shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border border-white/10">
                                                    {/* Decorative rings */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-64 h-64 rounded-full border border-white/5" />
                                                        <div className="absolute w-48 h-48 rounded-full border border-white/5" />
                                                        <div className="absolute w-32 h-32 rounded-full border border-white/5" />
                                                    </div>
                                                    {/* Center logo */}
                                                    <div className="relative z-10 flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.5)]">
                                                            <span className="text-white font-black text-2xl">DG</span>
                                                        </div>
                                                        <span className="text-white/30 text-[10px] font-mono tracking-[0.3em] uppercase">Conecta Canva para editar</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Presets & Tools */}
                <aside className="w-[320px] flex flex-col gap-6">
                    <div className="bg-[#0A0A0C] border border-[#222] rounded-2xl p-6">
                        <h3 className="text-xs font-black tracking-[0.2em] text-white uppercase mb-6 flex items-center gap-2">
                            <Sparkles size={14} className="text-blue-500" /> Plantillas AI
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map(id => (
                                <div key={id} className="aspect-square bg-[#111] border border-[#222] rounded-xl hover:border-blue-500/50 cursor-pointer overflow-hidden transition-all group">
                                    <img
                                        src={`https://picsum.photos/seed/cover${id}/200/200`}
                                        alt=""
                                        className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0A0A0C] border border-[#222] rounded-2xl p-6">
                        <h3 className="text-xs font-black tracking-[0.2em] text-white uppercase mb-4">Detalles del Track</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-[#444] uppercase tracking-widest mb-1 block">ID de Sesión</label>
                                <div className="text-xs text-silver-light font-mono bg-black/40 p-2 rounded border border-white/5">
                                    {trackId || 'NEW_CREATION'}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-[#444] uppercase tracking-widest mb-1 block">Sincronización</label>
                                <div className="flex items-center gap-2 text-green-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-bold tracking-widest uppercase">Auto-sync On</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-2xl p-6">
                        <p className="text-[10px] text-blue-400 font-bold leading-relaxed">
                            Tus diseños de Canva se guardarán automáticamente en la biblioteca de DA GRABA y se aplicarán al track seleccionado.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
