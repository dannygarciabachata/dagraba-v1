'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    Play, Pause, Disc3, ArrowRight, Activity,
    Music, Heart, Eye, Share2, MessageSquare,
    Plus, Sparkles, Send, Mic2, Wand2, ChevronDown,
    Settings2, FileAudio, Type, Music4, Zap, RefreshCw, Scissors, ArrowUpRight,
    MoreVertical, Globe, Trash2, Layers, Bot, Loader2,
    History, FastForward, SkipBack, Repeat, Shuffle, Volume2, Maximize2, X, Download, Command, Disc, Flame, HelpCircle, ListPlus, Copy, Pencil, SlidersHorizontal
} from 'lucide-react';
import { useDAWStore } from '@/store/useDAWStore';
import { useCreatorStore } from '@/store/useCreatorStore';
import { useMasteringStore } from '@/store/useMasteringStore';
import { AudioStorage } from '@/lib/audio/AudioStorage';
import { Slider } from '@/components/ui/Slider';
import { useUserStore } from '@/store/useUserStore';
import { useAuth } from '@/context/AuthContext';

const GENRES = [
    'Trap', 'Reggaeton', 'Drill', 'R&B', 'Pop Urbano',
    'Afrobeat', 'Dembow', 'Salsa', 'Bachata', 'Hip Hop',
    'House', 'Synthwave', 'Lofi', 'Corridos Tumbados'
];


export default function Crear() {
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || 'es';
    const { currentPreviewTrack, setPreviewTrack, isPlaying, setIsPlaying, rightPanelWidth, sidebarWidth, setRightPanelWidth, setSidebarWidth } = useDAWStore();
    const { tracks, activeTrack, setTracks, setActiveTrack, updateTrack, removeTrack, addTrack } = useCreatorStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const { credits, deductCredits } = useUserStore();
    const { user, setLoginModalOpen } = useAuth();

    // Track Menu State
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [panelMenuOpen, setPanelMenuOpen] = useState(false);

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editMode, setEditMode] = useState<'extend' | 'vocals' | 'instrumental' | 'video' | null>(null);
    const [editTrack, setEditTrack] = useState<any>(null);
    const [editPrompt, setEditPrompt] = useState("");
    const [editContinueAt, setEditContinueAt] = useState<string>("0");
    const [isEditing, setIsEditing] = useState(false);

    // Advanced UI State
    const [creationMode, setCreationMode] = useState<'easy' | 'custom'>('easy');
    const [prompt, setPrompt] = useState("");
    const [title, setTitle] = useState("");
    const [isInstrumental, setIsInstrumental] = useState(false);
    const [lyrics, setLyrics] = useState("");
    const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
    const [showProControls, setShowProControls] = useState(false);
    const [promptIntensity, setPromptIntensity] = useState(85);
    const [lyricsIntensity, setLyricsIntensity] = useState(85);
    const [selectedTool, setSelectedTool] = useState('Create Anything');
    const [showToolsMenu, setShowToolsMenu] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

    const generateAILyrics = () => {
        if (!prompt) return;
        setIsGeneratingLyrics(true);
        // Simulate an AI response for lyrics generation based on the prompt
        setTimeout(() => {
            setLyrics(`[Verse 1]\nEscuchando este beat, siento la energía\nTodo lo que escribo se vuelve melancolía\nBasado en lo que pediste: ${prompt}\n\n[Chorus]\nEsta es la IA escribiendo por ti\nCambiamos el juego, ya estamos aquí...`);
            setIsGeneratingLyrics(false);
        }, 1500);
    };

    const handleEditAction = async () => {
        if (!editTrack || !editMode) return;
        if ((editMode === 'extend' || editMode === 'vocals') && !editPrompt.trim()) {
            alert("Prompt is required for this action");
            return;
        }

        setIsEditing(true);

        try {
            const isVideo = editMode === 'video';
            const endpoint = isVideo ? '/api/ai/generate/video' : '/api/ai/edit';

            const payload: any = {
                action: editMode,
            };

            if (isVideo) {
                payload.taskId = editTrack.id;
                payload.audioId = editTrack.id; // Usually the same or extracted
                payload.callbackUrl = `${window.location.origin}/api/ai/webhook`;
            } else {
                payload.uploadUrl = editTrack.url;
                payload.title = `${editTrack.title} (${editMode})`;
                payload.prompt = editPrompt;
                if (editMode === 'extend') {
                    payload.continueAt = parseInt(editContinueAt) || Math.floor(parseInt(editTrack.duration.split(':')[0]) * 60 + parseInt(editTrack.duration.split(':')[1]) || 0);
                    payload.defaultParamFlag = true;
                }
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success && data.taskId) {
                const newTaskId = data.taskId;

                // Add placeholder track for tracking status
                addTrack({
                    id: newTaskId,
                    title: payload.title || `Video for ${editTrack.title}`,
                    style: editMode,
                    duration: 'Procesando...',
                    image: editTrack.image,
                    tags: ['IA', editMode, 'Procesando'],
                    lyrics: editPrompt || editTrack.lyrics,
                    views: '0',
                    likes: 0,
                    url: ''
                });

                setEditModalOpen(false);

                setEditPrompt("");
                setEditContinueAt("0");

                pollTaskStatus(newTaskId, 'kie', isVideo ? 'video' : 'music');
            } else {
                alert("Error iniciando la edición: " + (data.error || "Desconocido"));
            }
        } catch (error) {
            console.error("Error editing:", error);
            alert("Error de red");
        } finally {
            setIsEditing(false);
        }
    };

    const pollTaskStatus = async (taskId: string, provider: string, type: string = 'music') => {
        try {
            const res = await fetch(`/api/ai/status?taskId=${taskId}&provider=${provider}&type=${type}`);
            const data = await res.json();

            if (data.success && data.data) {
                const status = data.data.status;
                if (status === 'SUCCESS' || status === 'PARTIAL') {
                    // Update the track with real data
                    if (data.data.tracks && data.data.tracks.length > 0) {
                        const generatedTrack = data.data.tracks[0];
                        updateTrack(taskId, {
                            duration: generatedTrack.duration ? `${Math.floor(generatedTrack.duration / 60)}:${Math.floor(generatedTrack.duration % 60).toString().padStart(2, '0')}` : 'Ready',
                            image: generatedTrack.imageUrl || '/logo_circular.png',
                            url: generatedTrack.audioUrl || generatedTrack.streamAudioUrl || '',
                            tags: generatedTrack.tags ? generatedTrack.tags.split(',') : undefined // Will only update if provided
                        });

                        // Stop polling if complete
                        if (status === 'SUCCESS') return;
                    }
                } else if (status === 'ERROR') {
                    console.error('Task failed:', data.data.error);
                    updateTrack(taskId, { duration: 'Error', tags: ['Error'] });
                    return;
                }
            }

            // Poll again in 10 seconds if still pending/partial
            setTimeout(() => pollTaskStatus(taskId, provider, type), 10000);

        } catch (error) {
            console.error('Error polling status:', error);
            // Don't retry indefinitely on real network/code errors
            updateTrack(taskId, { duration: 'Error', tags: ['Error de Red'] });
        }
    };

    const handleGenerate = async () => {
        if (!prompt && (creationMode === 'easy' || (creationMode === 'custom' && !isInstrumental && !lyrics))) return;

        if (credits < 10) {
            alert("No tienes suficientes créditos de prueba. ¡Regístrate gratis para obtener más!");
            setLoginModalOpen(true);
            return;
        }

        setIsGenerating(true);

        // Deduct 10 credits for generation
        deductCredits(10);

        try {
            let finalPrompt = '';
            let finalStyle = '';
            let finalCustomMode = false;

            const genreTag = selectedGenre || '';

            if (creationMode === 'easy') {
                finalCustomMode = false;
                finalPrompt = [prompt, genreTag ? `en estilo ${genreTag}` : ''].filter(Boolean).join(' ');
            } else {
                if (isInstrumental) {
                    finalCustomMode = true;
                    finalPrompt = "";
                    finalStyle = [prompt, genreTag, selectedTool !== 'Create Anything' ? selectedTool : '', promptIntensity > 50 ? 'intense' : ''].filter(Boolean).join(', ');
                } else if (lyrics.trim().length > 0) {
                    finalCustomMode = true;
                    finalPrompt = lyrics;
                    finalStyle = [prompt, genreTag, selectedTool !== 'Create Anything' ? selectedTool : '', promptIntensity > 50 ? 'intense' : ''].filter(Boolean).join(', ');
                } else {
                    finalCustomMode = false;
                    finalPrompt = [prompt, genreTag ? `en estilo ${genreTag}` : '', selectedTool !== 'Create Anything' ? `al estilo de ${selectedTool}` : '', promptIntensity > 50 ? 'con mucha intensidad' : ''].filter(Boolean).join(' ');
                }
            }

            const payload = {
                provider: 'dagraba',
                prompt: finalPrompt,
                title: title || undefined,
                instrumental: isInstrumental,
                customMode: finalCustomMode,
                model: 'V4_5',
                style: finalCustomMode ? finalStyle : undefined,
                callbackUrl: `${window.location.origin}/api/ai/webhook`
            };

            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success && data.taskId) {
                const taskId = data.taskId;

                const newTrack = {
                    id: taskId,
                    title: title || 'Nueva Creación IA',
                    style: [selectedGenre, selectedTool !== 'Create Anything' ? selectedTool : ''].filter(Boolean).join(', ') || selectedTool,
                    duration: 'Procesando...',
                    image: '/logo_circular.png',
                    tags: ['IA', isInstrumental ? 'Instrumental' : 'Vocal', 'Procesando'],
                    lyrics: isInstrumental ? 'Instrumental Track' : prompt,
                    views: '0',
                    likes: 0,
                    url: ''
                };

                addTrack(newTrack);
                setPrompt("");
                setTitle("");

                console.log(`[DAGRABA] Generation Queued: ${taskId}. Polling for status...`);

                // Start polling
                pollTaskStatus(taskId, 'dagraba', 'music');

            } else {
                console.error("AI generation failed:", data);
                alert("Error generando música: " + (data.error || "Desconocido"));
            }
        } catch (error: any) {
            console.error("Error calling generation API:", error);
            alert("Error de red conectando con la IA");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectTrack = (track: any) => {
        setActiveTrack(track);
        setIsPanelOpen(true);
    };

    const handleSendToMastering = async (track: any) => {
        try {
            setPanelMenuOpen(false);
            setOpenMenuId(null);

            const src = track.url || track.streamAudioUrl;
            if (!src) {
                alert("No hay URL de audio disponible para este track.");
                return;
            }

            let blob: Blob;
            try {
                const response = await fetch(src);
                blob = await response.blob();
            } catch (e) {
                console.warn("Could not fetch remote audio, using minimal blob", e);
                blob = new Blob(["mock-audio"], { type: "audio/mpeg" });
            }

            const projectId = `master-${track.id}-${Date.now()}`;
            await AudioStorage.saveAudio(projectId, blob);

            const { addToHistory } = useMasteringStore.getState();
            const cleanupName = track.title || "Track Creado";
            const dna = `DNA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

            addToHistory({
                id: projectId,
                name: cleanupName,
                audioUrl: URL.createObjectURL(blob),
                settings: {
                    eqHighpass: 0, eqTilt: 0, eqSideGain: 0, eqSideFreq: 0, eqBypass: false,
                    compStrength: 0, compAttack: 0.03, compRelease: 0.1, compKnee: 0.5, compMakeup: 0, compBypass: false,
                    gateThreshold: -60, gateAttack: 0.01, gateRelease: 0.1, gateBypass: false,
                    levelerTarget: -14, levelerBrake: 0, levelerMaxPlus: 12, levelerMaxMinus: -12, levelerBypass: false,
                    mbStrengthLow: 0, mbStrengthHigh: 0, mbAttackLow: 10, mbAttackHigh: 10, mbCrossoverLow: 250, mbCrossoverHigh: 2500, mbBypass: false,
                    limStrength: 0, limAttack: 0.01, limRelease: 0.1, limCeiling: -1.0, limBypass: false,
                    inputDrive: 0, stereoWidth: 0
                },
                dna: dna
            });

            router.push(`/${locale}/mastering?load=${projectId}`);
        } catch (error) {
            console.error("Error sending to mastering:", error);
            alert("Hubo un error al enviar el track al mastering. Inténtalo de nuevo.");
        }
    };

    const handlePlayTrack = (track: any, e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentPreviewTrack?.id === track.id) {
            setIsPlaying(!isPlaying);
        } else {
            setPreviewTrack(track);
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        setRightPanelWidth(isPanelOpen ? 340 : 0);
        return () => setRightPanelWidth(0);
    }, [isPanelOpen, setRightPanelWidth]);

    // Handle sidebar width for global player centering
    useEffect(() => {
        setSidebarWidth(350);
        return () => setSidebarWidth(0);
    }, [setSidebarWidth]);

    return (
        <div className="flex h-full w-full bg-[#050505] overflow-hidden relative">

            {/* LEFT SIDEBAR: Creation Input */}
            {/* LEFT SIDEBAR: Creation Input */}
            <aside className="w-[350px] border-r border-white/5 bg-[#0A0A0C] flex flex-col p-6 gap-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-600 rounded-lg shadow-[0_0_15px_rgba(255,107,0,0.4)]">
                        <Wand2 size={20} className="text-white" />
                    </div>
                    <h2 className="text-lg font-bold tracking-widest text-[#E0E0E0]">CREAR</h2>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Mode Tabs */}
                    <div className="bg-[#111] p-1 rounded-xl flex gap-1 border border-[#222]">
                        <button
                            onClick={() => setCreationMode('easy')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${creationMode === 'easy' ? 'bg-[#222] text-white shadow-sm' : 'text-[#888] hover:text-[#AAA]'}`}
                        >
                            Easy
                        </button>
                        <button
                            onClick={() => setCreationMode('custom')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${creationMode === 'custom' ? 'bg-[#222] text-white shadow-sm' : 'text-[#888] hover:text-[#AAA]'}`}
                        >
                            Custom
                        </button>
                    </div>

                    {creationMode === 'custom' && (
                        <div className="relative">
                            <button
                                onClick={() => setShowToolsMenu(!showToolsMenu)}
                                className="w-full flex items-center justify-between p-3 bg-[#111] border border-[#222] rounded-xl text-sm font-bold text-white hover:bg-[#1A1A1A] transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-orange-500" />
                                    {selectedTool}
                                </div>
                                <ChevronDown size={16} className={`text-[#666] transition-transform ${showToolsMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showToolsMenu && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-[#222] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
                                    {[
                                        { name: 'Create Anything', desc: 'A simple text prompt to create it all', icon: <Wand2 size={14} /> },
                                        { name: 'Sound generator', desc: 'Create sound effects and samples', icon: <Music4 size={14} />, tag: 'Plus' },
                                        { name: 'Text to Speech', desc: 'Speak text in any voice', icon: <Mic2 size={14} />, tag: 'Pro' },
                                        { name: 'Remix', desc: 'Remix a song with custom style or lyrics', icon: <RefreshCw size={14} />, tag: 'Pro' },
                                        { name: 'Replace', desc: 'Replace a part of a song', icon: <Scissors size={14} />, tag: 'Pro' },
                                        { name: 'Extend', desc: 'Continue a track beyond the original', icon: <ArrowUpRight size={14} />, tag: 'Pro' },
                                        { name: 'Add Vocals', desc: 'Add vocals to existing instrumental', icon: <Type size={14} />, tag: 'Pro' },
                                        { name: 'Add Instrumental', desc: 'Add instrumental to existing vocals', icon: <Music size={14} />, tag: 'Pro' }
                                    ].map(tool => (
                                        <button
                                            key={tool.name}
                                            onClick={() => { setSelectedTool(tool.name); setShowToolsMenu(false); }}
                                            className="flex items-start gap-3 p-3 hover:bg-[#1A1A1A] transition-all text-left"
                                        >
                                            <div className="mt-0.5 text-[#888]">{tool.icon}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-white">{tool.name}</span>
                                                    {tool.tag && <span className="text-[9px] px-1.5 py-0.5 bg-orange-600/20 text-orange-500 rounded font-black tracking-widest uppercase">{tool.tag}</span>}
                                                </div>
                                                <span className="text-xs text-[#666]">{tool.desc}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Title Input */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Song Title (optional)"
                        className="w-full bg-[#111] border border-[#222] rounded-xl p-3 text-sm text-silver-light focus:border-orange-500/50 outline-none transition-all placeholder:text-[#444]"
                    />

                    {creationMode === 'custom' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsInstrumental(false)}
                                className={`flex-1 py-2 flex flex-col items-center justify-center gap-1 rounded-xl border transition-all ${!isInstrumental ? 'bg-orange-600/10 border-orange-500/50 text-orange-500 shadow-[0_0_10px_rgba(255,107,0,0.2)]' : 'bg-[#111] border-[#222] text-[#666] hover:bg-[#1A1A1A]'}`}
                            >
                                <Type size={16} />
                                <span className="text-[10px] font-bold tracking-widest uppercase">Lyrics</span>
                            </button>
                            <button
                                onClick={() => setIsInstrumental(true)}
                                className={`flex-1 py-2 flex flex-col items-center justify-center gap-1 rounded-xl border transition-all ${isInstrumental ? 'bg-orange-600/10 border-orange-500/50 text-orange-500 shadow-[0_0_10px_rgba(255,107,0,0.2)]' : 'bg-[#111] border-[#222] text-[#666] hover:bg-[#1A1A1A]'}`}
                            >
                                <Music size={16} />
                                <span className="text-[10px] font-bold tracking-widest uppercase">Instrumental</span>
                            </button>
                        </div>
                    )}

                    {/* AI Lyrics Box (Only visible when Words/Lyrics mode is active in Custom mode) */}
                    {creationMode === 'custom' && !isInstrumental && (
                        <div className="flex flex-col gap-2 relative">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-[#888] uppercase tracking-wider">Letras</span>
                                <button
                                    onClick={generateAILyrics}
                                    disabled={isGeneratingLyrics || (!prompt.trim() && !lyrics.trim())}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-yellow-500/10 hover:from-orange-500/30 hover:to-yellow-500/20 border border-orange-500/30 text-orange-400 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all disabled:opacity-50 relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-orange-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {isGeneratingLyrics ? <Loader2 size={12} className="animate-spin" /> : <Bot size={12} />}
                                    AI Co-writer
                                </button>
                            </div>
                            <textarea
                                value={lyrics}
                                onChange={(e) => setLyrics(e.target.value)}
                                placeholder="Escribe tus letras aquí, o usa nuestro AI Co-writer para generarlas..."
                                className="w-full h-40 bg-[#111] border border-[#222] rounded-xl p-4 text-sm text-silver-light focus:border-orange-500/50 outline-none resize-none transition-all placeholder:text-[#444] custom-scrollbar"
                            />
                        </div>
                    )}

                    {/* Main Prompt */}
                    <div className="relative">
                        {creationMode === 'custom' && (
                            <span className="text-xs font-bold text-[#888] uppercase tracking-wider mb-2 block">Estilo Musical</span>
                        )}
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={creationMode === 'easy' ? "Describe una canción... ej: Un pop acústico cantado por una mujer sobre las estrellas" : "Describe el estilo musical (Ej. trap beat pesado)..."}
                            className={`${creationMode === 'custom' ? 'h-24' : 'h-32'} w-full bg-[#111] border border-[#222] rounded-xl p-4 text-sm text-silver-light focus:border-orange-500/50 outline-none resize-none transition-all placeholder:text-[#444] custom-scrollbar`}
                        />
                        {creationMode === 'easy' && (
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222] hover:bg-[#333] rounded-lg text-xs font-bold text-[#888] hover:text-white transition-all">
                                    <FileAudio size={14} /> Attach file
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Genres Carousel */}
                    <div className="flex overflow-x-auto custom-scrollbar pb-2 gap-2 mt-[-8px]">
                        {GENRES.map(genre => (
                            <button
                                key={genre}
                                onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                                className={`whitespace-nowrap px-3 py-1.5 border rounded-full text-[10px] font-bold tracking-wider transition-all ${selectedGenre === genre
                                    ? 'bg-orange-600/20 border-orange-500/60 text-orange-400 shadow-[0_0_8px_rgba(255,107,0,0.3)]'
                                    : 'bg-[#111] hover:bg-[#222] border-[#222] hover:border-[#333] text-[#888] hover:text-white'
                                    }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>

                    {creationMode === 'custom' && (
                        <div className="flex flex-col gap-2">
                            {/* Pro Controls Toggle */}
                            <button
                                onClick={() => setShowProControls(!showProControls)}
                                className="flex items-center justify-between p-3 bg-[#111] border border-[#222] rounded-xl text-sm font-bold text-[#888] hover:text-white transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Settings2 size={16} />
                                    Pro controls
                                </div>
                                <ChevronDown size={16} className={`transition-transform ${showProControls ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Pro Controls Panel */}
                            {showProControls && (
                                <div className="bg-[#111] border border-[#222] rounded-xl p-4 flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between text-xs font-bold text-[#888]">
                                            <span className="flex items-center gap-1">Prompt intensity <span className="w-3 h-3 rounded-full bg-[#222] text-[#666] flex items-center justify-center text-[8px]">i</span></span>
                                            <span className="text-white">{promptIntensity}</span>
                                        </div>
                                        <Slider
                                            value={promptIntensity}
                                            onChange={(e) => setPromptIntensity(Number(e.target.value))}
                                            min={0} max={100}
                                            className="w-full"
                                        />
                                    </div>
                                    {!isInstrumental && (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between text-xs font-bold text-[#888]">
                                                <span className="flex items-center gap-1">Lyrics intensity <span className="w-3 h-3 rounded-full bg-[#222] text-[#666] flex items-center justify-center text-[8px]">i</span></span>
                                                <span className="text-white">{lyricsIntensity}</span>
                                            </div>
                                            <Slider
                                                value={lyricsIntensity}
                                                onChange={(e) => setLyricsIntensity(Number(e.target.value))}
                                                min={0} max={100}
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || (creationMode === 'easy' ? !prompt : (!isInstrumental && !lyrics && !prompt))}
                        className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold tracking-[0.2em] text-white flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(255,107,0,0.2)] mt-2"
                    >
                        {isGenerating ? (
                            <Activity size={20} className="animate-spin" />
                        ) : (
                            <>
                                <Send size={18} />
                                SUBMIT
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

            {/* CENTER PANEL: Horizontal Track List (Mureka Style) */}
            <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505] p-2 pl-4">
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-center justify-between px-2 pt-4 max-w-[900px]">
                        <h3 className="text-[10px] font-black tracking-[0.4em] text-[#333] uppercase">Tus Creaciones</h3>
                        <div className="flex gap-4">
                            <span className="text-[9px] font-black text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded cursor-pointer tracking-widest">TODO</span>
                            <span className="text-[9px] font-black text-[#333] hover:text-white px-2.5 py-1 rounded cursor-pointer transition-all tracking-widest">FAVORITOS</span>
                        </div>
                    </div>

                    {isGenerating && (
                        <div className="bg-[#111]/50 border border-orange-500/20 rounded-xl p-4 animate-pulse flex items-center gap-6 w-full max-w-[900px] h-[156px]">
                            <div className="w-[150px] h-[150px] bg-[#222] rounded-lg flex items-center justify-center">
                                <Activity className="text-orange-500 animate-bounce" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="h-4 bg-[#222] w-1/4 rounded" />
                                <div className="h-3 bg-[#222] w-1/2 rounded" />
                                <div className="h-3 bg-[#222] w-1/3 rounded" />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {tracks.map((track) => (
                            <div
                                key={track.id}
                                onClick={() => handleSelectTrack(track)}
                                className={`group relative bg-[#08080A] border transition-all duration-300 rounded-xl p-[3px] flex items-center gap-6 cursor-pointer overflow-visible w-full max-w-[900px] h-[156px] ${activeTrack?.id === track.id
                                    ? 'border-orange-500/40 bg-orange-500/5 shadow-[0_10px_30px_rgba(255,107,0,0.03)]'
                                    : 'border-white/[0.03] hover:border-white/10 hover:bg-[#0C0C0E]'
                                    }`}
                            >
                                {/* Cover Image Container */}
                                <div className="w-[150px] h-[150px] shrink-0 rounded-lg overflow-hidden relative shadow-md">
                                    <img src={track.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <button
                                            onClick={(e) => handlePlayTrack(track, e)}
                                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-90 hover:scale-100 transition-all"
                                        >
                                            {currentPreviewTrack?.id === track.id && isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-0.5" />}
                                        </button>
                                    </div>

                                    {/* Duration Tag */}
                                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-md rounded text-[9px] font-mono text-white border border-white/10">
                                        {track.duration}
                                    </div>
                                </div>

                                {/* Track Info and Meta */}
                                <div className="flex-1 flex flex-col justify-center min-w-0 pr-12 relative h-full">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4
                                            className="text-[18px] font-bold text-white truncate group-hover:text-orange-400 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectTrack(track);
                                            }}
                                        >
                                            {track.title}
                                        </h4>
                                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-[#666] font-mono">V8-all</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {track.style?.split(',').slice(0, 4).map(tag => (
                                            <span key={tag} className="text-[10px] text-[#555] px-2 py-0.5 bg-[#111] rounded-full border border-white/5 hover:text-white transition-colors">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <button className="flex items-center gap-2 text-[11px] text-[#444] hover:text-white font-bold transition-colors">
                                            <Share2 size={14} /> Publish
                                        </button>
                                        <div className="flex items-center gap-1.5 text-[11px] text-[#444] font-bold">
                                            <Eye size={14} /> {track.views}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] text-[#444] font-bold">
                                            <Heart size={14} /> {track.likes}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] text-[#444] font-bold">
                                            <Download size={14} />
                                        </div>
                                    </div>

                                    {/* Right Side Actions for the Row */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setEditMode('vocals'); setEditTrack(track); setEditModalOpen(true); }}
                                            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] rounded-lg text-xs font-bold text-white flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ArrowUpRight size={14} /> Video
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setEditMode('extend'); setEditTrack(track); setEditModalOpen(true); }}
                                            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] rounded-lg text-xs font-bold text-white flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Pencil size={14} /> Edit
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === track.id ? null : track.id);
                                            }}
                                            className="p-2 text-[#333] hover:text-white transition-colors rounded-lg hover:bg-white/5"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Dropdown Menu (adjusted for horizontal row) */}
                                {openMenuId === track.id && (
                                    <div className="absolute right-4 top-[80%] w-52 bg-[#141416] border border-[#222] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-2 z-[200] animate-in fade-in zoom-in-95 duration-200">
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-xs text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                            <RefreshCw size={14} className="text-[#666]" /> Remake
                                        </button>

                                        <div className="h-px bg-[#222] my-1 mx-2"></div>
                                        <div className="px-4 py-1 text-[8px] font-black text-[#444] uppercase tracking-[0.2em]">Edición Avanzada</div>

                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setEditMode('extend'); setEditTrack(track); setEditModalOpen(true); }} className="w-full text-left px-4 py-2 text-xs text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                            <ArrowUpRight size={14} className="text-[#666]" /> Extender
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setEditMode('vocals'); setEditTrack(track); setEditModalOpen(true); }} className="w-full text-left px-4 py-2 text-xs text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                            <Type size={14} className="text-[#666]" /> Añadir Voces
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setEditMode('instrumental'); setEditTrack(track); setEditModalOpen(true); }} className="w-full text-left px-4 py-2 text-xs text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                            <Music size={14} className="text-[#666]" /> Instrumental
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setEditMode('video'); setEditTrack(track); setEditModalOpen(true); }} className="w-full text-left px-4 py-2 text-xs text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                            <Activity size={14} className="text-[#666]" /> Generar Video
                                        </button>

                                        <div className="h-px bg-[#222] my-1 mx-2"></div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(null);
                                                const { addTrack, tracks } = useDAWStore.getState();
                                                if (!tracks.find(t => t.id === track.id)) {
                                                    addTrack(track.title, '#FF6B00');
                                                }
                                                router.push(`/${locale}/studio`);
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs text-orange-500 hover:bg-orange-500/5 flex items-center gap-3 transition-colors font-bold"
                                        >
                                            <Music4 size={14} className="text-orange-500" /> STUDIO
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleSendToMastering(track); }}
                                            className="w-full text-left px-4 py-2 text-xs text-cyan-400 hover:bg-cyan-500/5 flex items-center gap-3 transition-colors font-bold"
                                        >
                                            <SlidersHorizontal size={14} className="text-cyan-400" /> MASTERING
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSendToMastering(track);
                                                // The stem extract modal logic is handled in mastering,
                                                // but we can pass a hint to open it automatically if needed.
                                                // For now, it takes them to the Mastering space where they find the button.
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs text-purple-400 hover:bg-purple-500/5 flex items-center gap-3 transition-colors font-bold"
                                        >
                                            <Layers size={14} className="text-purple-400" /> EXTRAER STEMS
                                        </button>

                                        <div className="h-px bg-[#222] my-1 mx-2"></div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (track.lyrics) {
                                                    navigator.clipboard.writeText(track.lyrics);
                                                    setOpenMenuId(null);
                                                    alert("Letras copiadas!");
                                                }
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors"
                                        >
                                            <Copy size={14} className="text-[#666]" /> Copy lyrics
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeTrack(track.id);
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-xs text-red-500/80 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}

                                {activeTrack?.id === track.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 shadow-[0_0_15px_rgba(255,107,0,0.5)] rounded-l-xl" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main >

            {/* RIGHT PANEL: Details & Lyrics */}
            < aside className={`border-l border-[#222] bg-[#0A0A0C] shrink-0 flex flex-col overflow-hidden transition-[width] duration-300 ease-in-out ${isPanelOpen ? 'w-[340px]' : 'w-0 border-none'}`}>
                <div className="w-[340px] h-full flex flex-col overflow-y-auto custom-scrollbar relative">
                    {activeTrack ? (
                        <div className="flex flex-col w-full h-full relative">
                            {/* Cover Splash & Top Header */}
                            <div className="relative w-full p-6 pb-4 flex flex-col">
                                {/* Header with Close */}
                                <div className="flex items-center mb-4">
                                    <button
                                        onClick={() => setIsPanelOpen(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#222] hover:bg-[#333] text-[#888] hover:text-white transition-colors"
                                    >
                                        <ChevronDown className="rotate-90" size={16} />
                                    </button>
                                </div>

                                <div className="w-full aspect-square relative rounded-2xl overflow-hidden shadow-lg mb-4 border border-[#222]">
                                    <img src={activeTrack.image} alt="" className="w-full h-full object-cover" />
                                </div>

                                {/* Title & Artist */}
                                <h3 className="text-xl font-black text-white tracking-tighter mb-1.5 leading-none">{activeTrack.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-[#888] mb-4">
                                    <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                                        <img src="/logo_circular.png" className="w-4 h-4 rounded-full" />
                                        <span>Danny Garcia Bachata</span>
                                    </div>
                                    <span>•</span>
                                    <span>{activeTrack.duration}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Eye size={12} /> {activeTrack.views}</span>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {activeTrack.tags.map((tag: string) => (
                                        <span key={tag} className="px-2 py-0.5 bg-[#1A1A1A] border border-[#333] rounded-sm text-[9px] font-bold text-[#AAA] hover:text-white hover:bg-[#222] transition-colors cursor-pointer leading-none">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Interaction Row */}
                                <div className="flex items-center gap-2 w-full justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handlePlayTrack(activeTrack, e)}
                                            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                                        >
                                            {currentPreviewTrack?.id === activeTrack.id && isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
                                        </button>
                                        <button className="h-10 px-3 bg-[#222] hover:bg-[#333] text-white font-bold text-xs rounded-full flex items-center gap-1.5 transition-all border border-[#333]">
                                            <Share2 size={12} /> Publish
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#222] text-[#CCC] hover:text-white transition-all">
                                            <Heart size={16} />
                                        </button>
                                        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#222] text-[#CCC] hover:text-white transition-all">
                                            <MessageSquare size={16} />
                                        </button>

                                        {/* Three Dots */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setPanelMenuOpen(!panelMenuOpen)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#222] text-[#CCC] hover:text-white transition-all"
                                            >
                                                <MoreVertical size={16} />
                                            </button>

                                            {panelMenuOpen && (
                                                <div className="absolute right-0 bottom-full mb-2 w-56 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-2xl py-2 z-50 overflow-y-auto max-h-[400px] custom-scrollbar">
                                                    <button onClick={() => setPanelMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                                        <RefreshCw size={16} className="text-[#888]" /> Remake
                                                    </button>

                                                    <div className="h-px bg-[#333] my-1 mx-2"></div>
                                                    <div className="px-4 py-1.5 text-[10px] font-black text-[#666] uppercase tracking-wider">Edición Avanzada</div>

                                                    <button onClick={() => { setPanelMenuOpen(false); setEditMode('extend'); setEditTrack(activeTrack); setEditModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                                        <ArrowUpRight size={16} className="text-[#888]" /> Extender
                                                    </button>
                                                    <button onClick={() => { setPanelMenuOpen(false); setEditMode('vocals'); setEditTrack(activeTrack); setEditModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                                        <Type size={16} className="text-[#888]" /> Añadir Voces
                                                    </button>
                                                    <button onClick={() => { setPanelMenuOpen(false); setEditMode('instrumental'); setEditTrack(activeTrack); setEditModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                                        <Music size={16} className="text-[#888]" /> Instrumental
                                                    </button>
                                                    <button onClick={() => { setPanelMenuOpen(false); setEditMode('video'); setEditTrack(activeTrack); setEditModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                                        <Activity size={16} className="text-[#888]" /> Generar Video
                                                    </button>

                                                    <div className="h-px bg-[#333] my-1 mx-2"></div>

                                                    <button
                                                        onClick={() => {
                                                            setPanelMenuOpen(false);
                                                            const { addTrack, tracks } = useDAWStore.getState();
                                                            if (!tracks.find(t => t.id === activeTrack.id)) {
                                                                addTrack(activeTrack.title, '#FF6B00');
                                                            }
                                                            router.push(`/${locale}/studio`);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-orange-500 hover:bg-[#222] flex items-center gap-3 transition-colors font-bold"
                                                    >
                                                        <Music4 size={16} className="text-orange-500" /> AL CONSOLA / STUDIO
                                                    </button>

                                                    <div className="h-px bg-[#333] my-1 mx-2"></div>

                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleSendToMastering(activeTrack); }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-cyan-400 hover:bg-[#222] flex items-center gap-3 transition-colors font-bold"
                                                    >
                                                        <SlidersHorizontal size={16} className="text-cyan-400" /> MANDAR AL MASTERING
                                                    </button>

                                                    <div className="h-px bg-[#333] my-1 mx-2"></div>

                                                    <button onClick={() => setPanelMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                                        <Play size={16} className="text-[#888]" /> Play next
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (activeTrack.lyrics) {
                                                                navigator.clipboard.writeText(activeTrack.lyrics);
                                                                setPanelMenuOpen(false);
                                                                alert("Letras copiadas al portapapeles!");
                                                            }
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors"
                                                    >
                                                        <Copy size={16} className="text-[#888]" /> Copy lyrics
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            setPanelMenuOpen(false);
                                                            const src = activeTrack.url || activeTrack.streamAudioUrl;
                                                            if (!src) return;
                                                            const a = document.createElement('a');
                                                            a.href = src;
                                                            a.download = `${activeTrack.title}.mp3`;
                                                            a.click();
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors"
                                                    >
                                                        <Download size={16} className="text-[#888]" /> Download
                                                    </button>
                                                    <button onClick={() => setPanelMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                                        <Pencil size={16} className="text-[#888]" /> Edit song title and cover
                                                    </button>
                                                    <div className="h-px bg-[#333] my-1 mx-2"></div>
                                                    <button onClick={() => setPanelMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                                        <HelpCircle size={16} className="text-[#888]" /> Feedback
                                                    </button>
                                                    <button onClick={() => setPanelMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-[#E0E0E0] hover:text-white hover:bg-[#222] flex items-center gap-3 transition-colors">
                                                        <Flame size={16} className="text-[#888]" /> Dislike
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            removeTrack(activeTrack.id);
                                                            setIsPanelOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lyrics & Edit Actions */}
                            <div className="px-6 pb-32 flex flex-col gap-6">

                                {/* Lyrics Block */}
                                {activeTrack.lyrics && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-[#888] uppercase tracking-wider">Lyrics</span>
                                            <button className="text-[9px] text-orange-500 hover:text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded bg-orange-500/10 transition-colors">Edit</button>
                                        </div>
                                        <div className="text-[#CCC] text-[13px] leading-relaxed font-sans whitespace-pre-wrap font-medium">
                                            {activeTrack.lyrics}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-[#222] p-12 text-center pt-32">
                            <Disc3 size={100} className="mb-6 opacity-20" />
                            <p className="text-sm font-bold tracking-widest uppercase opacity-20">Selecciona una obra para ver detalles</p>
                        </div>
                    )}
                </div>
            </aside >
            {/* Edit Modal (Extend, Vocals, Instrumental, Video) */}
            {
                editModalOpen && editTrack && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    {editMode === 'extend' && <><ArrowUpRight size={20} className="text-orange-500" /> Extender Pista</>}
                                    {editMode === 'vocals' && <><Type size={20} className="text-orange-500" /> Añadir Voces</>}
                                    {editMode === 'instrumental' && <><Music size={20} className="text-orange-500" /> Añadir Instrumental</>}
                                    {editMode === 'video' && <><Activity size={20} className="text-orange-500" /> Generar Video MP4</>}
                                </h3>
                                <button onClick={() => setEditModalOpen(false)} className="p-2 text-[#666] hover:text-white bg-[#222] rounded-full">
                                    <Plus size={20} className="rotate-45" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6 p-4 bg-[#1A1A1A] rounded-xl border border-[#333]">
                                <img src={editTrack.image} alt="cover" className="w-12 h-12 rounded-lg object-cover" />
                                <div>
                                    <p className="text-sm font-bold text-white truncate max-w-[250px]">{editTrack.title}</p>
                                    <p className="text-xs text-[#888]">{editMode === 'video' ? 'Crear visualizador para este track' : 'Pista base para edición'}</p>
                                </div>
                            </div>

                            {editMode !== 'video' && (
                                <div className="space-y-4 mb-6">
                                    {editMode === 'extend' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Continuar en (segundos)</label>
                                            <input
                                                type="number"
                                                value={editContinueAt}
                                                onChange={(e) => setEditContinueAt(e.target.value)}
                                                className="w-full bg-[#0A0A0C] border border-[#333] rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none"
                                                placeholder="Ej: 120"
                                            />
                                            <p className="text-[10px] text-[#666]">Deja en 0 para extender desde el final de la pista ({editTrack.duration}).</p>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#888] uppercase tracking-wider">
                                            {editMode === 'vocals' ? 'Letras o estilo vocal' : (editMode === 'extend' ? 'Cómo continuar' : 'Estilo Instrumental')}
                                        </label>
                                        <textarea
                                            value={editPrompt}
                                            onChange={(e) => setEditPrompt(e.target.value)}
                                            placeholder={editMode === 'vocals' ? "Escribe las letras aquí..." : "Describe el estilo musical..."}
                                            className="w-full h-24 bg-[#0A0A0C] border border-[#333] rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none resize-none custom-scrollbar"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleEditAction}
                                disabled={isEditing || (editMode !== 'video' && !editPrompt.trim())}
                                className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold tracking-widest text-white flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)]"
                            >
                                {isEditing ? <Activity size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                {isEditing ? 'PROCESANDO...' : 'INICIAR PROCESO'}
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
