'use client';

import { useState, useRef, useEffect } from 'react';
import { StudioMonitor } from '@/components/daw/StudioMonitor';
import { MasteringKnob } from '@/components/daw/MasteringKnob';
import { Activity, Power, SlidersHorizontal, Upload, Download, Play, Pause, Volume2, Repeat, Music, History, Save, ChevronLeft, MessageSquare, Sparkles } from 'lucide-react';
import { useMasteringStore, MasteringSettings } from '@/store/useMasteringStore';
import { audioEngine } from '@/lib/audio-engine-bridge';
import { StudioChat } from '@/components/daw/StudioChat';
import { SpectrumAnalyzer } from '@/components/daw/SpectrumAnalyzer';
import { AudioStorage } from '@/lib/audio/AudioStorage';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useCreatorStore } from '@/store/useCreatorStore';

export default function Mastering() {
    const params = useParams();
    const searchParams = useSearchParams();
    const locale = params.locale as string;
    const loadId = searchParams.get('load');
    
    // UI State
    const [isOn, setIsOn] = useState(true);
    const [isComparing, setIsComparing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [selectedSong, setSelectedSong] = useState('Proyecto 1 - Final');
    const [metadataDNA, setMetadataDNA] = useState('PROJ-001-A');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState('DGB_BACHATA');
    const [isAIMastering, setIsAIMastering] = useState(false);
    const [aiStatus, setAiStatus] = useState('');
    const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);

    // Mastering Knobs State (master_me architecture)
    const [settings, setSettings] = useState<MasteringSettings>({
        // Gate
        gateThreshold: -12,
        gateAttack: 10,
        gateRelease: 100,
        
        // EQ
        eqHighpass: 35,
        eqTilt: 0,
        eqSideGain: 0,
        eqSideFreq: 100,
        
        // Leveler
        levelerTarget: -14,
        levelerBrake: 50,
        levelerMaxPlus: 10,
        levelerMaxMinus: 10,
        
        // Knee Compressor
        compStrength: 30,
        compAttack: 30,
        compRelease: 200,
        compKnee: 6,
        compMakeup: 0,
        
        // Multiband
        mbStrengthLow: 20,
        mbStrengthHigh: 15,
        mbAttackLow: 50,
        mbAttackHigh: 30,
        mbCrossoverLow: 250,
        mbCrossoverHigh: 3000,
        
        // Limiter
        limStrength: 40,
        limAttack: 1,
        limRelease: 100,
        limCeiling: -1.0,

        // Legacy/Direct
        inputDrive: 0,
        stereoWidth: 0,

        // Bypasses (Power status) - START ALL OFF
        gateBypass: true,
        eqBypass: true,
        levelerBypass: true,
        compBypass: true,
        mbBypass: true,
        limBypass: true,
    });

    const { history, currentModule, setCurrentModule, addToHistory, getProjectById, cleanupOldHistory } = useMasteringStore();
    const creatorTracks = useCreatorStore((state) => state.tracks);

    useEffect(() => {
        cleanupOldHistory();
    }, []);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Load project from history if requested or recover last session
    useEffect(() => {
        const loadProject = async () => {
            // Priority 1: loadId from URL
            if (loadId) {
                const project = getProjectById(loadId);
                if (project) {
                    setSelectedSong(project.name);
                    setMetadataDNA(project.dna);
                    setSettings(project.settings);
                    
                    const audioId = project.audioId || project.id;
                    const blob = await AudioStorage.getAudio(audioId);
                    if (blob) {
                        setAudioUrl(URL.createObjectURL(blob));
                        setCurrentAudioId(audioId);
                    } else if (project.audioUrl && !project.audioUrl.startsWith('blob:')) {
                        setAudioUrl(project.audioUrl);
                        setCurrentAudioId(audioId);
                    }
                    return;
                }
            }
            
            // Priority 2: Last session from history if no audio is loaded
            if (!audioUrl && history.length > 0) {
                const project = history[0];
                setSelectedSong(project.name);
                setMetadataDNA(project.dna);
                setSettings(project.settings);
                const audioId = project.audioId || project.id;
                const blob = await AudioStorage.getAudio(audioId);
                if (blob) {
                    setAudioUrl(URL.createObjectURL(blob));
                    setCurrentAudioId(audioId);
                } else if (project.audioUrl && !project.audioUrl.startsWith('blob:')) {
                    setAudioUrl(project.audioUrl);
                    setCurrentAudioId(audioId);
                }
            }
        };
        loadProject();
    }, [loadId, getProjectById, history, audioUrl]);

    // Mocking user plan for export logic
    const userPlan = 'Básico';

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const projectId = `import-${Date.now()}`;
                const url = URL.createObjectURL(file);
                
                // Save to IndexedDB for persistence
                await AudioStorage.saveAudio(projectId, file);
                
                const cleanName = file.name.replace(/\.[^/.]+$/, "");
                const dna = `DNA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
                
                // Genre detection based on filename
                if (cleanName.toLowerCase().includes('bachata')) setSelectedGenre('DGB_BACHATA');
                else if (cleanName.toLowerCase().includes('bolero')) setSelectedGenre('DGB_BOLERO');
                else if (cleanName.toLowerCase().includes('trap')) setSelectedGenre('DGB_TRAP');
                else if (cleanName.toLowerCase().includes('merengue')) setSelectedGenre('DGB_MERENGUE');

                setSelectedSong(cleanName);
                setAudioUrl(url);
                setCurrentAudioId(projectId);
                setMetadataDNA(dna);
                
                // Auto-add to history as requested by user
                addToHistory({
                    id: projectId,
                    name: cleanName,
                    audioUrl: url,
                    settings: settings,
                    dna: dna
                });
                
                setIsPlaying(true);
            }
        };
        input.click();
    };

    // --- Audio Logic ---
    useEffect(() => {
        if (audioRef.current && audioUrl) {
            audioEngine.connectAudioElement('master-track', audioRef.current);
        }
    }, [audioUrl]);

    // Sync settings with Audio Engine
    useEffect(() => {
        if (!isOn) return;
        
        // Update individual modules in the audio engine
        audioEngine.updateGate('master-track', settings.gateThreshold, settings.gateBypass);
        audioEngine.updateEQ('master-track', settings.eqHighpass, settings.eqTilt, settings.eqBypass);
        audioEngine.updateLeveler('master-track', settings.levelerTarget, settings.levelerBypass);
        audioEngine.updateCompressor('master-track', settings.compStrength, settings.compAttack, settings.compRelease, settings.compBypass);
        audioEngine.updateLimiter('master-track', settings.limStrength, settings.limCeiling, settings.limBypass);
        
    }, [settings, isOn]);

    const startAIMastering = async () => {
        if (!audioUrl) {
            alert("Sube una canción primero para que el Ingeniero pueda trabajar.");
            return;
        }

        setIsPlaying(false);
        setIsAIMastering(true);
        setAiStatus('ESCANEANDO ADN DE LA CANCIÓN...');

        // Warning to user about volume
        setTimeout(() => {
            setAiStatus('⚠️ ADVERTENCIA: EL VOLUMEN PUEDE CAMBIAR FUERTEMENTE.');
        }, 1000);

        try {
            // First delay: simulate scanning
            await new Promise(r => setTimeout(r, 3000));
            setAiStatus(`BUSCANDO GOLD STANDARD PARA ${selectedGenre}...`);

            const response = await fetch(`/api/ai/get-dna/${selectedGenre}`);
            const data = await response.json();

            if (!data.success) {
                setAiStatus('NO SE ENCONTRÓ ADN PATRÓN. USANDO PRESET MAESTRO.');
                await new Promise(r => setTimeout(r, 1500));
            } else {
                setAiStatus('ADN ENCONTRADO. APLICANDO FIRMA SONORA DGB...');
                const dna = data.dna;

                // Prepare target settings based on DNA
                const targetSettings = { ...settings };
                
                // 1. Loudness
                if (dna.loudness) {
                    targetSettings.levelerTarget = dna.loudness.target_lufs;
                }

                // 2. Dynamics
                if (dna.dynamics) {
                    targetSettings.limCeiling = dna.dynamics.peak_ceiling;
                    // Logic: If crest factor is high (dynamic), apply more compression strength
                    const cf = dna.dynamics.crest_factor;
                    targetSettings.compStrength = Math.min(60, Math.max(20, cf * 4));
                    targetSettings.limStrength = Math.min(80, Math.max(30, cf * 5));
                }

                // 3. Spectral (Tilt / Highpass)
                if (dna.spectral_envelope) {
                    const mags = dna.spectral_envelope.magnitudes;
                    if (mags.length > 0) {
                        const avgSlope = (mags[mags.length - 1] - mags[0]) / mags.length;
                        targetSettings.eqTilt = Math.min(4, Math.max(-4, avgSlope * 10));
                        targetSettings.eqHighpass = 35; // Standard DGB cut
                    }
                }

                // --- SEQUENTIAL AI NAVIGATION ---
                // The user wants to SEE the parameters as the AI applies them.
                
                // 1. GATE
                setAiStatus('CONFIGURANDO GATE...');
                setCurrentModule('gate');
                await new Promise(r => setTimeout(r, 1200));
                setSettings((prev: MasteringSettings) => ({ ...prev, gateBypass: false, gateThreshold: targetSettings.gateThreshold }));
                await new Promise(r => setTimeout(r, 800));

                // 2. EQ
                setAiStatus('CORRIGIENDO BALANCE ESPECTRAL (EQ)...');
                setCurrentModule('eq');
                await new Promise(r => setTimeout(r, 1200));
                setSettings((prev: MasteringSettings) => ({ ...prev, eqBypass: false, eqHighpass: targetSettings.eqHighpass, eqTilt: targetSettings.eqTilt }));
                await new Promise(r => setTimeout(r, 800));
                
                // 3. LEVELER
                setAiStatus('CALIBRANDO GAIN STAGING (LEVELER)...');
                setCurrentModule('leveler');
                await new Promise(r => setTimeout(r, 1200));
                setSettings((prev: MasteringSettings) => ({ ...prev, levelerBypass: false, levelerTarget: targetSettings.levelerTarget }));
                await new Promise(r => setTimeout(r, 800));

                // 4. COMPRESSOR
                setAiStatus('ESTABILIZANDO DINÁMICA DE SEÑAL...');
                setCurrentModule('compressor');
                await new Promise(r => setTimeout(r, 1200));
                setSettings((prev: MasteringSettings) => ({ ...prev, compBypass: false, compStrength: targetSettings.compStrength }));
                await new Promise(r => setTimeout(r, 800));

                // 5. LIMITER
                setAiStatus('MAXIMIZANDO VOLUMEN FINAL (LIMITER)...');
                setCurrentModule('limiter');
                await new Promise(r => setTimeout(r, 1200));
                setSettings((prev: MasteringSettings) => ({ ...prev, limBypass: false, limStrength: targetSettings.limStrength, limCeiling: targetSettings.limCeiling }));
                await new Promise(r => setTimeout(r, 1000));
            }

            setAiStatus('MASTERIZACIÓN IA COMPLETADA.');
            
            // Save to history with frequency "snapshot" (DNA summary)
            addToHistory({
                id: currentAudioId || `master-${Date.now()}`,
                name: selectedSong,
                audioUrl: audioUrl,
                audioId: currentAudioId || undefined,
                dna: metadataDNA,
                settings: settings,
                frequencyData: [settings.eqHighpass, settings.eqTilt, settings.eqSideGain] // Summary of spectral actions
            });
            setTimeout(() => {
                setIsAIMastering(false);
                setAiStatus('');
                // Ensure audio engine is active
                audioEngine.initContext();
                // Auto-play after completion
                setIsPlaying(true);
            }, 2000);

        } catch (error) {
            console.error("AI Mastering failed", error);
            setIsAIMastering(false);
            setAiStatus('ERROR EN EL PROCESO.');
        }
    };

    const togglePlay = () => {
        if (!isPlaying) {
            audioEngine.initContext();
        }
        setIsPlaying(prev => !prev);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        let isMounted = true;

        const attemptPlay = async () => {
            if (isPlaying && audioUrl) {
                try {
                    // Modern browsers return a promise from play()
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        await playPromise;
                    }
                } catch (e) {
                    // Only log if it's not an AbortError handled by the browser
                    if (e instanceof Error && e.name !== 'AbortError') {
                        console.error("Playback failed", e);
                    }
                }
            } else {
                audio.pause();
            }
        };

        attemptPlay();

        return () => {
            isMounted = false;
        };
    }, [isPlaying, isOn, audioUrl]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const dur = audioRef.current.duration;
            setProgress((current / (dur || 1)) * 100);
            setDuration(dur || 0);
        }
    };

    const handleSeek = (percentage: number) => {
        if (audioRef.current && duration) {
            const time = (percentage / 100) * duration;
            audioRef.current.currentTime = time;
            setProgress(percentage);
        }
    };

    const handleSave = () => {
        const projectId = `proj-${Date.now()}`;
        addToHistory({
            id: projectId,
            name: selectedSong,
            audioUrl: audioUrl,
            audioId: currentAudioId || undefined,
            settings: settings,
            dna: metadataDNA || projectId
        });
        alert("Sesión guardada en el historial.");
    };

    const handleExport = () => {
        handleSave(); // Auto-save on export

        const exportInfo = {
            title: selectedSong,
            studio: 'DA-GRABA STUDIO MASTER',
            info: '24-bit / 44.1kHz High Quality'
        };

        if (userPlan === 'Básico') {
            alert(`Exportando "${exportInfo.title}"\n- Sello: ${exportInfo.studio}\n- Calidad: MP3 128kbps (Plan Básico)\n- Información: El cliente puede editar su información después de descargar.`);
        } else {
            alert(`Exportando Pro "${exportInfo.title}"\n- Sello: ${exportInfo.studio}\n- Formatos: WAV & MP3 320kbps\n- Metadatos: Inyectando DA-GRABA MASTER DNA.`);
        }
    };

    return (
        <div className="flex flex-col w-full h-full items-center justify-start px-24 py-8 relative overflow-hidden pointer-events-auto">
            <audio 
                ref={audioRef} 
                src={audioUrl || undefined} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Background Studio Window Blur effect */}
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

            {/* TOP BAR: Horizontal Song Selection */}
            <div className="w-full max-w-6xl mb-8 relative z-20">
                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-2 shadow-2xl overflow-x-auto no-scrollbar">
                    <Link href={`/${locale}/mastering/history`} className="flex items-center gap-2 px-4 py-2 border-r border-white/10 flex-shrink-0 hover:bg-white/5 transition-colors group">
                        <History size={14} className="text-cyan-400 group-hover:rotate-[-45deg] transition-transform" />
                        <span className="text-[10px] text-white/60 font-black tracking-widest uppercase">Historial</span>
                    </Link>
                    <div className="flex gap-2 p-1">
                        {/* Merge mock list with real history for selection */}
                        {history.slice(0, 5).map((project) => (
                            <button
                                key={project.id}
                                onClick={async () => {
                                    audioEngine.initContext();
                                    setIsPlaying(false); // Stop current playback
                                    setSelectedSong(project.name);
                                    setMetadataDNA(project.dna);
                                    setSettings(project.settings);
                                    const audioId = project.audioId || project.id;
                                    const blob = await AudioStorage.getAudio(audioId);
                                    if (blob) {
                                        setAudioUrl(URL.createObjectURL(blob));
                                        setCurrentAudioId(audioId);
                                        // Auto-play selected track
                                        setTimeout(() => setIsPlaying(true), 100);
                                    } else if (project.audioUrl && !project.audioUrl.startsWith('blob:')) {
                                        setAudioUrl(project.audioUrl);
                                        setCurrentAudioId(audioId);
                                        setTimeout(() => setIsPlaying(true), 100);
                                    } else {
                                        alert("El archivo de audio original ya no está disponible en la memoria local. Por favor, vuelve a importarlo.");
                                    }
                                    
                                    if (audioRef.current) {
                                        audioRef.current.currentTime = 0;
                                    }
                                }}
                                className={`flex flex-col min-w-[160px] px-4 py-2 rounded-xl transition-all border ${
                                    selectedSong === project.name 
                                    ? 'bg-cyan-500/10 border-cyan-500/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                                    : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                                }`}
                            >
                                <span className="text-[10px] font-bold truncate">{project.name}</span>
                                <span className="text-[7px] font-mono opacity-40 uppercase tracking-tighter">DNA: {project.dna}</span>
                            </button>
                        ))}
                        {/* Fallback mock list if history is empty */}
                        {creatorTracks.map((track) => (
                            <button
                                key={`creator-${track.id}`}
                                onClick={() => {
                                    audioEngine.initContext();
                                    setIsPlaying(false);
                                    setSelectedSong(track.title);
                                    setMetadataDNA("AI CREATOR");
                                    setAudioUrl(track.url);
                                    setCurrentAudioId(track.id);
                                    setTimeout(() => setIsPlaying(true), 100);
                                    if (audioRef.current) {
                                        audioRef.current.currentTime = 0;
                                    }
                                }}
                                className={`flex flex-col min-w-[160px] px-4 py-2 rounded-xl transition-all border ${
                                    selectedSong === track.title 
                                    ? 'bg-orange-500/10 border-orange-500/30 text-white shadow-[0_0_15px_rgba(255,107,0,0.1)]' 
                                    : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                                }`}
                            >
                                <span className="text-[10px] font-bold truncate">{track.title}</span>
                                <span className="text-[7px] font-mono opacity-40 uppercase tracking-tighter">SOURCE: AI CREATOR</span>
                            </button>
                        ))}
                    </div>
                    <button onClick={handleImport} className="ml-auto flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
                        <Upload size={14} /> Importar Nuevo
                    </button>
                </div>
            </div>

            <div className="w-full flex items-center justify-center relative z-10 gap-16">
                {/* Left Speaker */}
                <div className="flex-shrink-0 transform scale-110">
                    <StudioMonitor />
                </div>

                {/* Center Plugin Rack */}
                <div className="flex-1 max-w-4xl relative">
                    {/* The Plugin Enclosure - LANDR Style */}
                    <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.05)] border border-slate-700/30 p-6 flex flex-col gap-6 w-full max-w-5xl mx-auto">
                        
                        {/* Header Bar */}
                        <div className="flex justify-between items-center px-4">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                                    <div className="w-5 h-5 rounded-full border border-white/40 border-t-transparent animate-spin-slow" />
                                </div>
                                <span className="text-white font-medium tracking-widest text-sm opacity-90">DA-GRABA Studio Mastering</span>
                            </div>

                            {/* Center Toggles */}
                            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/5 rounded-full px-4 py-1.5 backdrop-blur-md border border-white/10">
                                <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-widest mr-2 cursor-pointer shadow-[0_0_10px_rgba(103,232,249,0.3)]">Master</span>
                            </div>

                            {/* Right Controls */}
                            <div className="flex items-center gap-4">
                                <button className="text-xs text-white/50 hover:text-white transition-colors tracking-widest uppercase">Gain Match</button>
                                <button 
                                    onClick={() => setIsOn(!isOn)}
                                    className={`text-xs px-3 py-1 rounded transition-colors tracking-widest uppercase border ${isOn ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10' : 'border-white/20 text-white/50 hover:bg-white/5'}`}
                                >
                                    Bypass
                                </button>
                                <button
                                    onClick={startAIMastering}
                                    disabled={isAIMastering}
                                    className={`px-3 py-1 rounded border flex items-center gap-2 text-xs font-bold tracking-widest transition-all ${
                                        isAIMastering 
                                        ? 'bg-orange-500/20 border-orange-500 text-orange-400 animate-pulse' 
                                        : 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/40 hover:text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                    }`}
                                >
                                    <Sparkles size={12} /> {isAIMastering ? 'AI WORKING' : 'AI MASTER'}
                                </button>
                                <div className="flex gap-2 text-white/30 ml-2">
                                    <span className="cursor-pointer hover:text-white transition-colors">⟲</span>
                                    <span className="cursor-pointer hover:text-white transition-colors">⟳</span>
                                    <span className="cursor-pointer hover:text-white transition-colors">•••</span>
                                </div>
                            </div>
                        </div>

                        <div className={`transition-opacity duration-500 flex flex-col gap-6 ${isOn ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                            
                            {/* Top Half: Massive Spectrum Analyzer */}
                            <div className="h-64 relative bg-slate-900/50 rounded-lg overflow-hidden border-b border-white/5">
                                {isAIMastering && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10 animate-in fade-in">
                                        <div className="w-16 h-16 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
                                        <span className="text-xs font-mono text-indigo-300 tracking-widest text-center uppercase">{aiStatus}</span>
                                    </div>
                                )}
                                <SpectrumAnalyzer 
                                    analyzer={audioEngine.getTrackAnalyser('master-track')} 
                                    naked 
                                />
                                {/* Frequency Labels */}
                                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 pointer-events-none opacity-30 text-[9px] font-mono text-white">
                                    <span>20</span><span>50</span><span>100</span><span>200</span><span>500</span><span>1K</span><span>2K</span><span>5K</span><span>10K</span><span>20K</span>
                                </div>
                            </div>

                            {/* Middle Toggles (Style) */}
                            <div className="flex justify-center -mt-10 relative z-10">
                                <div className="flex bg-slate-800/80 backdrop-blur-xl rounded-full p-1 border border-slate-600/50 shadow-2xl">
                                    {['DGB_BOLERO', 'DGB_BACHATA', 'DGB_MERENGUE'].map((genre) => (
                                        <button
                                            key={genre}
                                            onClick={() => setSelectedGenre(genre)}
                                            className={`px-8 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                                                selectedGenre === genre 
                                                ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)] text-white' 
                                                : 'text-white/40 hover:text-white/80'
                                            }`}
                                        >
                                            {genre === 'DGB_BOLERO' ? 'Warm' : genre === 'DGB_BACHATA' ? 'Balanced' : 'Open'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Half: Control Grid */}
                            <div className="grid grid-cols-12 gap-4 px-4 pb-4">
                                
                                {/* EQUALIZER */}
                                <div className="col-span-3 flex flex-col items-center gap-4">
                                    <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">Equalizer</span>
                                    <div className="flex gap-4">
                                        <MasteringKnob label="Low" value={settings.eqHighpass} onChange={(v) => setSettings({...settings, eqHighpass: v})} size="md" />
                                        <MasteringKnob label="Mid" value={settings.eqTilt} onChange={(v) => setSettings({...settings, eqTilt: v})} size="md" />
                                        <MasteringKnob label="High" value={settings.eqSideGain} onChange={(v) => setSettings({...settings, eqSideGain: v})} size="md" />
                                    </div>
                                </div>

                                {/* PRESENCE */}
                                <div className="col-span-2 flex flex-col items-center gap-4 border-l border-white/5 pl-4">
                                    <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">Presence</span>
                                    <MasteringKnob label="Amount" value={settings.eqSideFreq} onChange={(v) => setSettings({...settings, eqSideFreq: v})} size="md" />
                                </div>

                                {/* DE-ESSER */}
                                <div className="col-span-2 flex flex-col items-center gap-4 border-l border-white/5 pl-4">
                                    <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">De-Esser</span>
                                    <div className="flex gap-4">
                                        <MasteringKnob label="Amount" value={settings.mbStrengthHigh} onChange={(v) => setSettings({...settings, mbStrengthHigh: v})} size="md" />
                                        <MasteringKnob label="Frequency" value={settings.mbCrossoverHigh} onChange={(v) => setSettings({...settings, mbCrossoverHigh: v})} size="md" />
                                    </div>
                                </div>

                                {/* DYNAMICS */}
                                <div className="col-span-3 flex flex-col items-center gap-4 border-l border-white/5 pl-4">
                                    <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">Dynamics</span>
                                    <div className="flex gap-4">
                                        <MasteringKnob label="Compression" value={settings.compStrength} onChange={(v) => setSettings({...settings, compStrength: v})} size="md" />
                                        <MasteringKnob label="Character" value={settings.compAttack} onChange={(v) => setSettings({...settings, compAttack: v})} size="md" />
                                        <MasteringKnob label="Saturation" value={settings.inputDrive} onChange={(v) => setSettings({...settings, inputDrive: v})} size="md" />
                                    </div>
                                </div>

                                {/* LOUDNESS (Rightmost) */}
                                <div className="col-span-2 flex flex-col items-center justify-between border-l border-white/5 pl-4 h-full">
                                    <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">Loudness</span>
                                    <div className="flex items-center gap-4 w-full justify-center">
                                        <div className="flex flex-col items-center -mr-2">
                                            <MasteringKnob label="" value={settings.levelerTarget} onChange={(v) => setSettings({...settings, levelerTarget: v})} size="lg" />
                                            <span className="text-[9px] text-white/40 font-medium tracking-widest mt-2">{settings.levelerTarget.toFixed(1)} LUFS</span>
                                        </div>
                                        {/* Fake LUFS Meter */}
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-[8px] font-mono text-cyan-400">-0.2 dB</span>
                                            <div className="w-2 h-24 bg-black rounded-sm relative overflow-hidden ring-1 ring-white/10">
                                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-white transition-all shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ height: `${isPlaying ? 60 + Math.random() * 30 : 0}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            
                            {/* STEREO FIELD (Bottom Left) */}
                            <div className="flex flex-col gap-2 px-8 pb-4">
                                <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">Stereo Field</span>
                                <div className="flex items-center gap-4 w-48">
                                    <span className="text-[9px] text-white/40">Focus</span>
                                    <input 
                                        type="range" 
                                        min="0" max="100" 
                                        value={settings.stereoWidth} 
                                        onChange={(e) => setSettings({...settings, stereoWidth: parseFloat(e.target.value)})}
                                        className="flex-1 h-0.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 outline-none"
                                    />
                                    <span className="text-[9px] text-blue-400 font-bold">{settings.stereoWidth}% Wide</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ELEGANT MASTERING PLAYER */}
                    <div className="mt-8 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 shadow-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-6">
                            {/* Track Info & Visualizer */}
                            <div className="flex items-center gap-4 w-1/3">
                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 relative overflow-hidden group">
                                    <Music className="text-white/80 transition-transform group-hover:scale-110" size={24} />
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-black tracking-widest text-sm uppercase truncate max-w-[150px]">{selectedSong}</span>
                                    <span className="text-cyan-400/60 font-mono text-[9px] tracking-widest mt-0.5">DNA: {metadataDNA}</span>
                                    <span className="text-white/20 font-mono text-[8px] uppercase mt-1">24-BIT / 44.1KHZ</span>
                                </div>
                            </div>

                            {/* Main Controls */}
                            <div className="flex-1 flex flex-col items-center gap-3">
                                <div className="flex items-center gap-8">
                                    <button className="text-white/20 hover:text-white transition-colors"><Repeat size={16} /></button>
                                    <button 
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all active:scale-95 group"
                                    >
                                        {isPlaying ? <Pause size={24} fill="black" className="text-black" /> : <Play size={24} fill="black" className="text-black ml-1" />}
                                    </button>
                                    <button onClick={handleExport} className="text-white/20 hover:text-green-400 transition-colors"><Download size={16} /></button>
                                </div>

                                {/* Elegant Seeker */}
                                <div className="w-full flex items-center gap-4">
                                    <span className="text-[10px] font-mono text-white/30 w-8 text-right">
                                        {Math.floor((audioRef.current?.currentTime || 0) / 60)}:
                                        {Math.floor((audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}
                                    </span>
                                    <div 
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const x = e.clientX - rect.left;
                                            const p = (x / rect.width) * 100;
                                            handleSeek(p);
                                        }}
                                        className="flex-1 h-1.5 bg-white/5 rounded-full relative overflow-hidden group cursor-pointer"
                                    >
                                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${progress}%` }} />
                                    </div>
                                    <span className="text-[10px] font-mono text-white/30 w-8 text-left">
                                        {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            </div>

                            {/* Utilities */}
                            <div className="w-1/3 flex items-center justify-end gap-6">
                                {/* L-R VU Meter */}
                                <div className="flex flex-col gap-1.5 mr-2 pointer-events-none">
                                    {/* Left Channel */}
                                    <div className="flex gap-0.5 items-center">
                                        <span className="text-[7px] text-white/30 font-mono w-2">L</span>
                                        <div className="flex gap-0.5">
                                            {[...Array(12)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`w-1 h-3 rounded-full transition-all duration-300 ${
                                                        isPlaying && i < (isPlaying ? 5 + Math.random() * 6 : 0) ? 'bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.3)]' : 
                                                        isPlaying && i < 10 ? 'bg-yellow-500/80' : 
                                                        'bg-white/5'
                                                    }`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Right Channel */}
                                    <div className="flex gap-0.5 items-center">
                                        <span className="text-[7px] text-white/30 font-mono w-2">R</span>
                                        <div className="flex gap-0.5">
                                            {[...Array(12)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`w-1 h-3 rounded-full transition-all duration-300 ${
                                                        isPlaying && i < (isPlaying ? 4 + Math.random() * 8 : 0) ? 'bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.3)]' : 
                                                        'bg-white/5'
                                                    }`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 group">
                                    <Volume2 size={14} className="text-white/40 group-hover:text-white" />
                                    <input 
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={(e) => {
                                            const v = parseFloat(e.target.value);
                                            setVolume(v);
                                            if (audioRef.current) audioRef.current.volume = v;
                                        }}
                                        className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Speaker */}
                <div className="flex-shrink-0 transform scale-110">
                    <StudioMonitor />
                </div>
            </div>

            {/* FLOATING AI ENGINEER CHAT BUTTON AND INTERFACE */}
            <div className="fixed bottom-12 right-12 z-[100] flex flex-col items-end gap-3">
                {chatOpen && (
                    <div className="w-96 h-[500px] mb-6 animate-in slide-in-from-bottom-10 fade-in duration-500 origin-bottom-right">
                        <div className="w-full h-full bg-[#0B1015]/95 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/20">
                            {/* Header for the Mastering-specific Chat */}
                            <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-cyan-600/20 to-blue-700/20 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                        <Sparkles size={14} className="text-cyan-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase">John - Da Graba Eng.</span>
                                        <span className="text-[7px] font-mono text-cyan-400/60 uppercase">Especialista en Masterización</span>
                                    </div>
                                </div>
                                <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-white/5 rounded-md text-white/20 hover:text-white transition-colors">
                                    <ChevronLeft size={16} className="rotate-[-90deg]" />
                                </button>
                            </div>
                            
                            {/* The StudioChat component itself should be refactored to be more modular 
                                but for now we'll use a copy of its logic or just embed it if it works.
                                Given the current structure, I'll embed it but adjust its position via props if added.
                            */}
                            <div className="flex-1 overflow-hidden relative">
                                <StudioChat 
                                    embedded={true} 
                                    songName={selectedSong} 
                                    onExecuteMastering={startAIMastering}
                                />
                            </div>
                        </div>
                    </div>
                )}
                
                <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className={`group flex items-center gap-4 px-8 py-4 rounded-full border transition-all duration-700 shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_80px_rgba(6,182,212,0.3)] ${
                        chatOpen 
                        ? 'bg-orange-600 border-orange-400/50 scale-95' 
                        : 'bg-gradient-to-r from-cyan-600 to-blue-700 border-white/20 hover:scale-110 active:scale-95'
                    }`}
                >
                    <div className="relative">
                        <MessageSquare size={20} className={`text-white transition-all duration-500 ${chatOpen ? 'rotate-90 opacity-0' : 'animate-pulse'}`} />
                        <Activity size={20} className={`text-white absolute inset-0 transition-all duration-500 ${chatOpen ? 'rotate-0' : 'opacity-0 -rotate-90'}`} />
                    </div>
                    <div className="flex flex-col items-start leading-none pr-2">
                        <span className="text-[11px] font-black tracking-[0.2em] text-white uppercase drop-shadow-md">ING DA GRABA MASTERING</span>
                        <span className="text-[8px] font-mono text-white/40 uppercase mt-1 tracking-tighter">Consultar con John</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-white/20'}`} />
                </button>
            </div>

        </div>
    );
}
