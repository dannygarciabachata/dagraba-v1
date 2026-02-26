'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    Play, Pause, Disc3, ArrowRight, Activity,
    Music, Heart, Eye, Share2, MessageSquare,
    Plus, Sparkles, Send, Mic2, Wand2
} from 'lucide-react';
import { useDAWStore } from '@/store/useDAWStore';

// Mock data for the generated tracks
const MOCK_TRACKS = [
    {
        id: 'track-1',
        title: 'Sombras en la Calle',
        style: 'Dark Trap, 808s, Moody',
        duration: '2:45',
        image: '/suno_style_cover_dark_trap_1772078586853.png',
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
        image: '/suno_style_cover_melodic_trap_1772078606994.png',
        tags: ['Trap', 'Melodic'],
        lyrics: "[Verse 1]\nReflejos de neón en el asfalto frío\nUn mundo de cristal, un vacío mío\nLas máquinas cantan una melodía\nQue me atrapa el alma, pura fantasía.\n\n[Chorus]\nBrilla el neón, brilla el metal\nUn viaje eterno, algo sideral.",
        views: '850',
        likes: 92,
        url: 'https://cdn.pixabay.com/audio/2021/11/24/audio_12345678.mp3'
    }
];

export default function Crear() {
    const router = useRouter();
    const { currentPreviewTrack, setPreviewTrack } = useDAWStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [tracks, setTracks] = useState<any[]>(MOCK_TRACKS);
    const [activeTrack, setActiveTrack] = useState<any>(MOCK_TRACKS[0]);
    const [prompt, setPrompt] = useState("");

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        // Simulate generation
        setTimeout(() => {
            setIsGenerating(false);
            setPrompt("");
        }, 3000);
    };

    const handleSelectTrack = (track: any) => {
        setActiveTrack(track);
    };

    const handlePlayTrack = (track: any, e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentPreviewTrack?.id === track.id) {
            setPreviewTrack(null);
        } else {
            setPreviewTrack(track);
        }
    };

    return (
        <div className="flex h-full w-full bg-[#050505] overflow-hidden">

            {/* LEFT SIDEBAR: Creation Input */}
            <aside className="w-[350px] border-r border-white/5 bg-[#0A0A0C] flex flex-col p-6 gap-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-600 rounded-lg shadow-[0_0_15px_rgba(255,107,0,0.4)]">
                        <Wand2 size={20} className="text-white" />
                    </div>
                    <h2 className="text-lg font-bold tracking-widest text-[#E0E0E0]">CREAR</h2>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe tu canción (ej: Trap melódico con bajos profundos y voz atmosférica)..."
                            className="w-full h-40 bg-[#111] border border-[#222] rounded-xl p-4 text-sm text-silver-light focus:border-orange-500/50 outline-none resize-none transition-all placeholder:text-[#444]"
                        />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            <button className="p-2 bg-[#222] hover:bg-[#333] rounded-md text-[#666] hover:text-[#888] transition-all">
                                <Mic2 size={16} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                        className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold tracking-[0.2em] text-white flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(255,107,0,0.2)]"
                    >
                        {isGenerating ? (
                            <Activity size={20} className="animate-spin" />
                        ) : (
                            <>
                                <Sparkles size={18} />
                                GENERAR
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-auto border-t border-[#222] pt-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-[#444] uppercase">
                        <span>Modelos Recientes</span>
                        <ArrowRight size={10} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {['Trap V2', 'Lofi Sad', 'Hard Drill', 'Bolero IA'].map(m => (
                            <div key={m} className="px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-[10px] text-[#888] hover:text-orange-500 hover:border-orange-500/30 cursor-pointer transition-all">
                                {m}
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* CENTER PANEL: Vertical Track List */}
            <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505] p-8">
                <div className="max-w-4xl mx-auto flex flex-col gap-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-black tracking-[0.3em] text-[#444] uppercase">Tus Creaciones</h3>
                        <div className="flex gap-4">
                            <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded cursor-pointer">TODO</span>
                            <span className="text-[10px] font-bold text-[#444] hover:text-white cursor-pointer transition-colors">FAVORITOS</span>
                        </div>
                    </div>

                    {isGenerating && (
                        <div className="bg-[#111]/50 border border-orange-500/20 rounded-2xl p-6 animate-pulse flex items-center gap-6">
                            <div className="w-24 h-24 bg-[#222] rounded-xl flex items-center justify-center">
                                <Activity className="text-orange-500" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-[#222] w-1/3 rounded" />
                                <div className="h-3 bg-[#222] w-1/2 rounded" />
                                <div className="h-2 bg-[#222] w-full rounded" />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {tracks.map((track) => (
                            <div
                                key={track.id}
                                onClick={() => handleSelectTrack(track)}
                                className={`group relative bg-[#0A0A0C] border transition-all duration-300 rounded-2xl p-5 flex items-center gap-6 cursor-pointer overflow-hidden ${activeTrack?.id === track.id
                                        ? 'border-orange-500/40 bg-orange-500/5 shadow-[0_10px_40px_rgba(255,107,0,0.05)]'
                                        : 'border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden relative shadow-2xl">
                                    <img src={track.image} alt={track.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handlePlayTrack(track, e)}
                                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-all duration-300"
                                        >
                                            {currentPreviewTrack?.id === track.id ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-lg font-bold text-white truncate">{track.title}</h4>
                                        <span className="text-[10px] text-orange-500 font-mono tracking-tighter">{track.duration}</span>
                                    </div>
                                    <p className="text-sm text-[#666] mb-3 truncate italic">{track.style}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[10px] text-[#444] font-bold">
                                            <Eye size={12} /> {track.views}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-[#444] font-bold">
                                            <Heart size={12} /> {track.likes}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-[#666] hover:text-white transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                    <button className="p-2 text-[#666] hover:text-white transition-colors">
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {activeTrack?.id === track.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 shadow-[0_0_15px_rgba(255,107,0,0.8)]" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* RIGHT PANEL: Details & Lyrics */}
            <aside className="w-[450px] border-l border-white/5 bg-[#08080A] flex flex-col overflow-y-auto custom-scrollbar">
                {activeTrack ? (
                    <div className="flex flex-col w-full h-full relative">
                        {/* Cover Splash */}
                        <div className="relative aspect-square w-full">
                            <img src={activeTrack.image} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-8 right-8">
                                <h3 className="text-3xl font-black text-white tracking-tighter mb-2 leading-none">{activeTrack.title}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {activeTrack.tags.map((tag: string) => (
                                        <span key={tag} className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-[9px] font-black uppercase tracking-widest text-[#AAA]">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-8 flex flex-col gap-8">
                            <div className="flex gap-4">
                                <button className="flex-1 py-3 bg-white text-black font-bold tracking-widest text-xs rounded-xl hover:bg-silver-light transition-all flex items-center justify-center gap-2">
                                    <Share2 size={14} /> PUBLICAR
                                </button>
                                <button
                                    onClick={() => router.push('/studio')}
                                    className="flex-1 py-3 bg-[#111] border border-[#222] text-white font-bold tracking-widest text-xs rounded-xl hover:bg-[#222] transition-all flex items-center justify-center gap-2"
                                >
                                    <Send size={14} /> ENVIAR AL STUDIO
                                </button>
                                <button className="w-12 h-12 bg-[#111] border border-[#222] rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all">
                                    <Heart size={20} />
                                </button>
                            </div>

                            {/* Lyrics Container */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black tracking-widest text-[#444] uppercase flex items-center gap-2">
                                        <MessageSquare size={12} /> LÍRICA GENERADA
                                    </span>
                                    <button className="text-[9px] font-bold text-orange-500 hover:underline">Editar</button>
                                </div>
                                <div className="bg-[#0A0A0C] border border-[#222] rounded-2xl p-6 shadow-inner">
                                    <pre className="text-silver-dark text-sm leading-relaxed font-sans whitespace-pre-wrap">
                                        {activeTrack.lyrics}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#222] p-12 text-center">
                        <Disc3 size={100} className="mb-6 opacity-20" />
                        <p className="text-sm font-bold tracking-widest uppercase opacity-20">Selecciona una obra para ver detalles</p>
                    </div>
                )}
            </aside>
        </div>
    );
}
