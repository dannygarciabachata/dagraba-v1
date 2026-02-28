'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    Play, Pause, Disc3, ArrowRight, Activity,
    Music, Heart, Eye, Share2, MessageSquare,
    Plus, Sparkles, Send, Mic2, Wand2, ChevronDown,
    Settings2, FileAudio, Type, Music4, Zap, RefreshCw, Scissors, ArrowUpRight,
    MoreVertical, Globe, Trash2, Layers, Bot, Loader2
} from 'lucide-react';
import { useDAWStore } from '@/store/useDAWStore';
import { useCreatorStore } from '@/store/useCreatorStore';
import { Slider } from '@/components/ui/Slider';

const GENRES = [
    'Trap', 'Reggaeton', 'Drill', 'R&B', 'Pop Urbano',
    'Afrobeat', 'Dembow', 'Salsa', 'Bachata', 'Hip Hop',
    'House', 'Synthwave', 'Lofi', 'Corridos Tumbados'
];


export default function Crear() {
    const router = useRouter();
    const { currentPreviewTrack, setPreviewTrack } = useDAWStore();
    const { tracks, activeTrack, setTracks, setActiveTrack, updateTrack, removeTrack, addTrack } = useCreatorStore();
    const [isGenerating, setIsGenerating] = useState(false);

    // Track Menu State
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editMode, setEditMode] = useState<'extend' | 'vocals' | 'instrumental' | 'video' | null>(null);
    const [editTrack, setEditTrack] = useState<any>(null);
    const [editPrompt, setEditPrompt] = useState("");
    const [editContinueAt, setEditContinueAt] = useState<string>("0");
    const [isEditing, setIsEditing] = useState(false);

    // Advanced UI State
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
        }
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);

        try {
            let finalPrompt = '';
            let finalStyle = '';
            let finalCustomMode = false;

            const genreTag = selectedGenre || '';
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
                // For customMode: false, prompt is a single text description
                finalPrompt = [prompt, genreTag ? `en estilo ${genreTag}` : '', selectedTool !== 'Create Anything' ? `al estilo de ${selectedTool}` : '', promptIntensity > 50 ? 'con mucha intensidad' : ''].filter(Boolean).join(' ');
            }

            const payload = {
                provider: 'kie',
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

                console.log(`[KIE] Generation Queued: ${taskId}. Polling for status...`);

                // Start polling
                pollTaskStatus(taskId, 'kie', 'music');

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
                    {/* Tools Dropdown */}
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

                    {/* Title Input */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Song Title (optional)"
                        className="w-full bg-[#111] border border-[#222] rounded-xl p-3 text-sm text-silver-light focus:border-orange-500/50 outline-none transition-all placeholder:text-[#444]"
                    />

                    {/* Main Prompt */}
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Cover song of Jingle Bells with Drake's voice..."
                            className="w-full h-32 bg-[#111] border border-[#222] rounded-xl p-4 text-sm text-silver-light focus:border-orange-500/50 outline-none resize-none transition-all placeholder:text-[#444]"
                        />
                        <div className="absolute bottom-3 left-3 flex gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222] hover:bg-[#333] rounded-lg text-xs font-bold text-[#888] hover:text-white transition-all">
                                <FileAudio size={14} /> Attach file
                            </button>
                        </div>
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

                    {/* Toggles */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsInstrumental(true)}
                            className={`flex-1 py-2 flex flex-col items-center justify-center gap-1 rounded-xl border transition-all ${isInstrumental ? 'bg-orange-600/10 border-orange-500/50 text-orange-500 shadow-[0_0_10px_rgba(255,107,0,0.2)]' : 'bg-[#111] border-[#222] text-[#666] hover:bg-[#1A1A1A]'}`}
                        >
                            <Music size={16} />
                            <span className="text-[10px] font-bold tracking-widest uppercase">Instrumental</span>
                        </button>
                        <button
                            onClick={() => setIsInstrumental(false)}
                            className={`flex-1 py-2 flex flex-col items-center justify-center gap-1 rounded-xl border transition-all ${!isInstrumental ? 'bg-orange-600/10 border-orange-500/50 text-orange-500 shadow-[0_0_10px_rgba(255,107,0,0.2)]' : 'bg-[#111] border-[#222] text-[#666] hover:bg-[#1A1A1A]'}`}
                        >
                            <Type size={16} />
                            <span className="text-[10px] font-bold tracking-widest uppercase">Lyrics</span>
                        </button>
                    </div>

                    {/* AI Lyrics Box (Only visible when Words/Lyrics mode is active) */}
                    {!isInstrumental && (
                        <div className="flex flex-col gap-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-300 relative">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-[#888] uppercase tracking-wider">Letras</span>
                                <button
                                    onClick={generateAILyrics}
                                    disabled={isGeneratingLyrics || !prompt.trim()}
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
                                placeholder="Escribe tus letras aquí, o usa nuestro AI Co-writer para generarlas basadas en tu prompt..."
                                className="w-full h-40 bg-[#111] border border-[#222] rounded-xl p-4 text-sm text-silver-light focus:border-orange-500/50 outline-none resize-none transition-all placeholder:text-[#444] custom-scrollbar"
                            />
                        </div>
                    )}

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

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                        className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold tracking-[0.2em] text-white flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(255,107,0,0.2)]"
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

            {/* CENTER PANEL: Vertical Track List */}
            <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505] p-8">
                <div className="max-w-xl mx-auto flex flex-col gap-6">
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
                                    <img src={track.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
                                    <p className="text-sm text-[#666] mb-3 truncate italic">{track.style?.split(',').slice(0, 2).join(', ')}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] text-[#444] font-bold">
                                            <Eye size={12} /> {track.views}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-[#444] font-bold">
                                            <Heart size={12} /> {track.likes}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 flex flex-col gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(openMenuId === track.id ? null : track.id);
                                        }}
                                        className="p-2 text-[#666] hover:text-white transition-colors rounded-full hover:bg-white/5"
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    {openMenuId === track.id && (
                                        <div className="absolute right-10 top-0 w-48 bg-[#151515] border border-[#222] rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); /* handle publish */ }}
                                                className="w-full text-left px-4 py-3 text-xs font-bold text-silver-light hover:text-white hover:bg-orange-600 flex items-center gap-3 transition-colors"
                                            >
                                                <Globe size={14} /> Publicar
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); /* handle share */ }}
                                                className="w-full text-left px-4 py-3 text-xs font-bold text-silver-light hover:text-white hover:bg-orange-600 flex items-center gap-3 transition-colors"
                                            >
                                                <Share2 size={14} /> Compartir
                                            </button>
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(null);
                                                    const src = track.url || track.streamAudioUrl;
                                                    if (!src) {
                                                        alert('La pista aún está siendo procesada. Inténtalo más tarde.');
                                                        return;
                                                    }
                                                    try {
                                                        const res = await fetch(src);
                                                        const blob = await res.blob();
                                                        const url = URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = `${track.title || 'stem'}.mp3`;
                                                        a.click();
                                                        URL.revokeObjectURL(url);
                                                    } catch {
                                                        alert('Error descargando el stem. Intenta de nuevo.');
                                                    }
                                                }}
                                                className="w-full text-left px-4 py-3 text-xs font-bold text-silver-light hover:text-white hover:bg-orange-600 flex items-center gap-3 transition-colors"
                                            >
                                                <Layers size={14} /> Separar / Descargar Stems
                                            </button>
                                            <div className="h-px bg-[#222] my-1 w-[90%] mx-auto" />
                                            {/* Advanced Edit Options */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setEditMode('extend'); setEditTrack(track); setEditModalOpen(true); }}
                                                className="w-full text-left px-4 py-3 text-xs font-bold text-silver-light hover:text-white hover:bg-orange-600 flex items-center gap-3 transition-colors"
                                            >
                                                <ArrowUpRight size={14} /> Extender Pista
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setEditMode('vocals'); setEditTrack(track); setEditModalOpen(true); }}
                                                className="w-full text-left px-4 py-3 text-xs font-bold text-silver-light hover:text-white hover:bg-orange-600 flex items-center gap-3 transition-colors"
                                            >
                                                <Type size={14} /> Añadir Voces
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setEditMode('instrumental'); setEditTrack(track); setEditModalOpen(true); }}
                                                className="w-full text-left px-4 py-3 text-xs font-bold text-silver-light hover:text-white hover:bg-orange-600 flex items-center gap-3 transition-colors"
                                            >
                                                <Music size={14} /> Añadir Instrumental
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setEditMode('video'); setEditTrack(track); setEditModalOpen(true); }}
                                                className="w-full text-left px-4 py-3 text-xs font-bold text-silver-light hover:text-white hover:bg-orange-600 flex items-center gap-3 transition-colors"
                                            >
                                                <Activity size={14} /> Generar Video (MP4)
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); removeTrack(track.id); }}
                                                className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                                            >
                                                <Trash2 size={14} /> Borrar
                                            </button>
                                        </div>
                                    )}
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Track Title & Tags (below cover, clean) */}
                        <div className="px-8 pt-5 pb-2">
                            <h3 className="text-2xl font-black text-white tracking-tighter mb-3 leading-none">{activeTrack.title}</h3>
                            <div className="flex flex-wrap gap-2">
                                {activeTrack.tags.map((tag: string) => (
                                    <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-black uppercase tracking-widest text-[#888]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-8 flex flex-col gap-8">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <button className="flex-1 py-3 bg-white text-black font-bold tracking-widest text-xs rounded-xl hover:bg-silver-light transition-all flex items-center justify-center gap-2">
                                        <Share2 size={14} /> PUBLICAR
                                    </button>
                                    <button
                                        onClick={() => {
                                            const { addTrack, tracks } = useDAWStore.getState();
                                            if (!tracks.find(t => t.id === activeTrack.id)) {
                                                addTrack(activeTrack.title, '#FF6B00');
                                            }
                                            router.push('/studio');
                                        }}
                                        className="flex-1 py-3 bg-[#111] border border-[#222] text-white font-bold tracking-widest text-xs rounded-xl hover:bg-[#222] text-orange-500 hover:text-orange-400 border-orange-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Send size={14} /> AL CONSOLA
                                    </button>
                                    <button className="w-12 h-12 bg-[#111] border border-[#222] rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all shrink-0">
                                        <Heart size={20} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => router.push(`/${window.location.pathname.split('/')[1] || 'en'}/covers?trackId=${activeTrack.id}`)}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white font-black tracking-widest text-sm rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-white/10 relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    <Sparkles size={18} className="animate-pulse" /> DISEÑAR PORTADA EN CANVA
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
            {/* Edit Modal (Extend, Vocals, Instrumental, Video) */}
            {editModalOpen && editTrack && (
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
            )}
        </div>
    );
}
