'use client';

import { useState, useEffect, useRef } from 'react';
import { useMasteringStore, MasteringProject } from '@/store/useMasteringStore';
import { ChevronLeft, Trash2, Play, Pause, ExternalLink, Music, Clock, Settings2, Power, Activity } from 'lucide-react';
import { AudioStorage } from '@/lib/audio/AudioStorage';
import { audioEngine } from '@/lib/audio-engine-bridge';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function MasteringHistory() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;
    const { history, deleteFromHistory } = useMasteringStore();
    const [isClient, setIsClient] = useState(false);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [isMastered, setIsMastered] = useState(true);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Effect to update audio engine state during preview
    useEffect(() => {
        if (playingId) {
            const project = history.find(p => p.id === playingId);
            if (project) {
                if (isMastered) {
                    audioEngine.updateEQ('master-track', project.settings.eqHighpass, project.settings.eqTilt, false);
                    audioEngine.updateCompressor('master-track', project.settings.compStrength, project.settings.compAttack, project.settings.compRelease, false);
                } else {
                    // Neutral settings for "MIX ORIGINAL"
                    audioEngine.updateEQ('master-track', 0, 0, true);
                    audioEngine.updateCompressor('master-track', 0, 0.03, 0.1, true);
                }
            }
        }
    }, [isMastered, playingId, history]);

    const handleTogglePlay = async (project: MasteringProject) => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playingId === project.id) {
            try {
                if (audio.paused) {
                    await audio.play();
                } else {
                    audio.pause();
                }
            } catch (e) {
                if (e instanceof Error && e.name !== 'AbortError') {
                    console.error("Selection playback failed", e);
                }
            }
            return;
        }

        // Stop current
        audio.pause();

        const blob = await AudioStorage.getAudio(project.id);
        if (blob) {
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setPlayingId(project.id);
            
            // Wait for metadata/load to call play
            const onCanPlay = async () => {
                try {
                    audioEngine.connectAudioElement('master-track', audio);
                    await audio.play();
                } catch (e) {
                    if (e instanceof Error && e.name !== 'AbortError') {
                        console.error("Delayed playback failed", e);
                    }
                }
                audio.removeEventListener('canplay', onCanPlay);
            };
            audio.addEventListener('canplay', onCanPlay);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto del historial?')) {
            await AudioStorage.deleteAudio(id);
            deleteFromHistory(id);
        }
    };

    if (!isClient) return null;

    return (
        <div className="flex flex-col w-full h-full bg-[#050505] text-white p-12 overflow-y-auto custom-scrollbar">
            <audio 
                ref={audioRef} 
                src={previewUrl || undefined} 
                onEnded={() => setPlayingId(null)}
                className="hidden"
            />
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                    <Link 
                        href={`/${locale}/mastering`}
                        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group"
                    >
                        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Historial de <span className="text-cyan-400">Mastering</span></h1>
                        <p className="text-white/40 text-sm font-mono mt-1 tracking-widest uppercase">Gestiona tus sesiones y revisiones pasadas</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-white/40 uppercase font-black">Proyectos Guardados</span>
                        <span className="text-xl font-mono text-cyan-400">{history.length}</span>
                    </div>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <Clock className="text-white/20" size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-white/60">No hay proyectos en el historial</h2>
                    <p className="text-white/30 text-sm mt-2">Tus sesiones de mastering aparecerán aquí cuando las guardes o exportes.</p>
                    <Link 
                        href={`/${locale}/mastering`}
                        className="mt-8 px-8 py-3 bg-cyan-500 text-black font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                    >
                        Ir al Master Rack
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((project) => (
                        <div 
                            key={project.id}
                            className="group relative bg-[#111] border border-white/5 rounded-3xl p-6 hover:border-cyan-500/30 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                        >
                            {/* Card Header: Play & Info */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => handleTogglePlay(project)}
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${
                                            playingId === project.id 
                                            ? 'bg-orange-600 text-white animate-pulse ring-2 ring-orange-500/50' 
                                            : 'bg-gradient-to-br from-neutral-800 to-black border border-white/10 text-cyan-400 hover:scale-105 active:scale-95'
                                        }`}
                                    >
                                        {playingId === project.id ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                                    </button>
                                    <div>
                                        <h3 className="text-lg font-bold truncate group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{project.name}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[9px] font-mono text-white/40 uppercase">DNA: {project.dna}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={(e) => handleDelete(project.id, e)}
                                    className="p-2 text-white/20 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* A/B Comparison Control */}
                            <div className="mb-6">
                                {playingId === project.id ? (
                                    <div className="bg-black/40 p-1.5 rounded-2xl border border-white/10 flex items-center gap-1">
                                        <button 
                                            onClick={() => setIsMastered(true)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black transition-all ${
                                                isMastered 
                                                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                                                : 'text-white/40 hover:bg-white/5'
                                            }`}
                                        >
                                            <Activity size={12} /> MASTERADO
                                        </button>
                                        <button 
                                            onClick={() => setIsMastered(false)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black transition-all ${
                                                !isMastered 
                                                ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' 
                                                : 'text-white/40 hover:bg-white/5'
                                            }`}
                                        >
                                            <Music size={12} /> MIX ORIGINAL
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-10 border border-white/5 rounded-2xl border-dashed flex items-center justify-center uppercase text-[8px] font-mono text-white/20 tracking-widest">
                                        Reproducir para comparar
                                    </div>
                                )}
                            </div>

                            {/* Meta & Settings */}
                            <div className="flex items-center justify-between mb-6 text-[10px] font-mono text-white/40">
                                <span>{new Date(project.date).toLocaleDateString()}</span>
                                <div className="flex gap-2">
                                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">LUFS {project.settings.levelerTarget}</span>
                                    <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">COMP {project.settings.compStrength}%</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => {
                                    router.push(`/${locale}/mastering?load=${project.id}`);
                                }}
                                className="w-full py-4 bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/10 hover:border-transparent rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all group/btn"
                            >
                                <ExternalLink size={14} className="group-hover/btn:scale-110 transition-transform" />
                                Cargar para Revisión
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
