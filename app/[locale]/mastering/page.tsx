'use client';

import { useState, useRef, useEffect } from 'react';
import { StudioMonitor } from '@/components/daw/StudioMonitor';
import { MasteringKnob } from '@/components/daw/MasteringKnob';
import { Activity, Power, SlidersHorizontal, Upload, Download, Play, Pause, Volume2, Repeat, Music, History, Save, ChevronLeft, MessageSquare, Sparkles } from 'lucide-react';
import { useMasteringStore } from '@/store/useMasteringStore';
import { audioEngine } from '@/lib/audio-engine-bridge';
import { StudioChat } from '@/components/daw/StudioChat';
import { SpectrumAnalyzer } from '@/components/daw/SpectrumAnalyzer';
import { AudioStorage } from '@/lib/audio/AudioStorage';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

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
    const [settings, setSettings] = useState({
        // Gate
        gateThreshold: 10,
        gateAttack: 5,
        gateRelease: 100,
        
        // EQ
        eqHighpass: 30,
        eqTilt: 0,
        eqSideGain: 20,
        eqSideFreq: 4000,
        
        // Leveler
        levelerTarget: -14,
        levelerBrake: -60,
        levelerMaxPlus: 6,
        levelerMaxMinus: 12,
        
        // Knee Compressor
        compStrength: 30,
        compAttack: 20,
        compRelease: 200,
        compKnee: 6,
        compMakeup: 0,
        
        // Multiband
        mbStrengthLow: 20,
        mbStrengthHigh: 40,
        mbAttackLow: 50,
        mbAttackHigh: 20,
        mbCrossoverLow: 200,
        mbCrossoverHigh: 5000,
        
        // Limiter & Brickwall
        limStrength: 50,
        limAttack: 2,
        limRelease: 100,
        limCeiling: -0.1,

        // Legacy/Direct
        inputDrive: 20,
        stereoWidth: 60,

        // Bypasses (Power status)
        gateBypass: true,
        eqBypass: true,
        levelerBypass: true,
        compBypass: true,
        mbBypass: true,
        limBypass: true,
    });

    const { history, addToHistory, getProjectById, currentModule, setCurrentModule } = useMasteringStore();
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
                    
                    const blob = await AudioStorage.getAudio(project.id);
                    if (blob) {
                        setAudioUrl(URL.createObjectURL(blob));
                        setCurrentAudioId(project.id);
                    } else if (project.audioUrl && !project.audioUrl.startsWith('blob:')) {
                        setAudioUrl(project.audioUrl);
                        setCurrentAudioId(project.id);
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
                }
            }
        };
        loadProject();
    }, [loadId, getProjectById, history, audioUrl]);

    // List of songs currently available for mastering
    const songList = [
        { name: 'Proyecto 1 - Final', dna: 'PROJ-001-A' },
        { name: 'Grabación de Voz - Raw', dna: 'PROJ-002-B' },
        { name: 'Mix Down Instrumental', dna: 'PROJ-003-C' }
    ];

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

                // Sequential movement for visual impact
                // GATE
                setCurrentModule('gate');
                setSettings(prev => ({ ...prev, gateBypass: false }));
                await new Promise(r => setTimeout(r, 1000));

                // EQ
                setCurrentModule('eq');
                setSettings(prev => ({ ...prev, eqBypass: false, eqHighpass: targetSettings.eqHighpass, eqTilt: targetSettings.eqTilt }));
                await new Promise(r => setTimeout(r, 1000));
                
                // LEVELER
                setCurrentModule('leveler');
                setSettings(prev => ({ ...prev, levelerBypass: false, levelerTarget: targetSettings.levelerTarget }));
                await new Promise(r => setTimeout(r, 1000));

                // COMPRESSOR
                setCurrentModule('compressor');
                setSettings(prev => ({ ...prev, compBypass: false, compStrength: targetSettings.compStrength }));
                await new Promise(r => setTimeout(r, 1000));

                // LIMITER
                setCurrentModule('limiter');
                setSettings(prev => ({ ...prev, limBypass: false, limStrength: targetSettings.limStrength, limCeiling: targetSettings.limCeiling }));
                await new Promise(r => setTimeout(r, 1000));
            }

            setAiStatus('MASTERIZACIÓN IA COMPLETADA.');
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
                                    setSelectedSong(project.name);
                                    setMetadataDNA(project.dna);
                                    setSettings(project.settings);
                                    const audioId = project.audioId || project.id;
                                    const blob = await AudioStorage.getAudio(audioId);
                                    if (blob) {
                                        setAudioUrl(URL.createObjectURL(blob));
                                        setCurrentAudioId(audioId);
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
                        {history.length === 0 && songList.map((song) => (
                            <button
                                key={song.dna}
                                onClick={() => {
                                    setSelectedSong(song.name);
                                    setMetadataDNA(song.dna);
                                }}
                                className={`flex flex-col min-w-[160px] px-4 py-2 rounded-xl transition-all border ${
                                    selectedSong === song.name 
                                    ? 'bg-cyan-500/10 border-cyan-500/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                                    : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                                }`}
                            >
                                <span className="text-[10px] font-bold truncate">{song.name}</span>
                                <span className="text-[7px] font-mono opacity-40 uppercase tracking-tighter">DNA: {song.dna}</span>
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
                    {/* The Plugin Enclosure */}
                    <div className="bg-[#2B2B2B] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-[#1A1A1A] p-4 flex flex-col gap-4">

                        {/* Header Bar */}
                        <div className="flex justify-between items-center px-2 py-1">
                            <div className="flex items-center gap-6">
                                <span className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                                    <Activity size={16} />
                                    DA GRABA
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-white/80 font-bold text-[10px] uppercase tracking-tighter leading-none">Stereo Master Rack</span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                        <input 
                                            value={selectedSong} 
                                            onChange={(e) => setSelectedSong(e.target.value)}
                                            className="bg-transparent border-none text-cyan-400 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400/30 rounded px-1 transition-all w-48"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Export buttons in header */}
                            <div className="flex items-center gap-3">
                                <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs text-white/60 hover:text-white transition-colors">
                                    <Save size={12} /> Guardar
                                </button>
                                <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1 bg-green-600/20 hover:bg-green-600/40 border border-green-500/50 rounded text-xs text-green-400 hover:text-green-300 transition-colors">
                                    <Download size={12} /> Exportar
                                </button>
                            </div>

                            {/* AI Mastering Button */}
                            <div className="flex items-center gap-4">
                                <select 
                                    value={selectedGenre}
                                    onChange={(e) => setSelectedGenre(e.target.value)}
                                    className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[9px] text-cyan-400 font-bold focus:outline-none"
                                >
                                    <option value="DGB_BACHATA">BACHATA DGB</option>
                                    <option value="DGB_BOLERO">BOLERO DGB</option>
                                    <option value="DGB_TRAP">TRAP DGB</option>
                                    <option value="DGB_MERENGUE">MERENGUE DGB</option>
                                </select>
                                <button
                                    onClick={startAIMastering}
                                    disabled={isAIMastering}
                                    className={`px-4 py-1 rounded-full border flex items-center gap-2 text-[10px] font-black tracking-widest transition-all ${
                                        isAIMastering 
                                        ? 'bg-orange-500/20 border-orange-500 text-orange-400 animate-pulse' 
                                        : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                    }`}
                                >
                                    <Sparkles size={12} /> {isAIMastering ? 'AI WORKING' : 'AI MASTER'}
                                </button>
                                <button
                                    onClick={() => setIsOn(!isOn)}
                                    className="w-12 h-6 rounded-full bg-[#111] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative flex items-center px-1"
                                >
                                    <div className={`w-4 h-4 rounded-full shadow-md transition-all duration-300 ${isOn ? 'bg-green-500 translate-x-6 glow-primary' : 'bg-[#444] translate-x-0'}`} />
                                </button>
                            </div>
                        </div>

                        {/* master_me Module Selector (Expert Mode Tabs) */}
                        <div className="flex flex-col gap-2 mx-2">
                            <div className="flex items-center justify-between bg-black/20 rounded-lg p-1 border border-white/5">
                                {['gate', 'eq', 'leveler', 'compressor', 'multiband', 'limiter'].map((mod, idx) => (
                                    <div key={mod} className="flex-1 flex items-center">
                                        <button
                                            onClick={() => setCurrentModule(mod as any)}
                                            className={`flex-1 py-1.5 px-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${
                                                currentModule === mod 
                                                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                                                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                                            }`}
                                        >
                                            {mod === 'compressor' ? 'Comp' : mod === 'multiband' ? 'M-Band' : mod}
                                        </button>
                                        {idx < 5 && (
                                            <div className="px-1 text-white/10 text-[8px] font-black">➔</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center">
                                <span className="text-[7px] text-cyan-400/40 uppercase font-black tracking-widest">Signal Flow: Pre-Processing ➔ Gate ➔ EQ ➔ Leveler ➔ Comp ➔ M-Band ➔ Limiter ➔ Brickwall</span>
                            </div>
                        </div>

                        <div className={`transition-opacity duration-500 ${isOn ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                            {/* Middle Displays Row */}
                            <div className="grid grid-cols-3 gap-4 h-48">

                                {/* Display 1: Real-time Spectrum Analyzer or AI Status */}
                                <div className="bg-[#181818] rounded-lg border border-[#333] shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] overflow-hidden relative">
                                     {isAIMastering ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/60 backdrop-blur-sm z-10 animate-in fade-in">
                                            <div className="flex gap-1 mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="w-1.5 h-6 bg-cyan-500 animate-[bounce_1s_infinite]" style={{ animationDelay: `${i * 0.1}s` }} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-mono text-cyan-400 tracking-tighter text-center uppercase leading-tight">{aiStatus}</span>
                                        </div>
                                     ) : null}
                                     <SpectrumAnalyzer 
                                        analyzer={audioEngine.getTrackAnalyser('master-track')} 
                                        naked 
                                    />
                                </div>

                                {/* Display 2: Compare LED Meters */}
                                <div className="bg-[#2A2A2D] rounded-lg border border-[#1A1A1C] shadow-inner p-4 flex flex-col items-center justify-between">
                                    <div className="flex gap-8 h-24 w-full justify-center">
                                        {/* Source Meter */}
                                        <div className="flex flex-col gap-1 h-full w-8 bg-[#111] rounded-sm p-1 shadow-inner justify-end">
                                            <div className="text-[8px] text-center text-silver-dark font-mono uppercase mb-1">SRC</div>
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <div key={`s-${i}`} className={`h-1.5 w-full rounded-xs ${i < 3 ? 'bg-[#333]' : i < 6 ? 'bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]' : 'bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]'}`} />
                                            ))}
                                        </div>

                                        {/* Master Meter */}
                                        <div className="flex flex-col gap-1 h-full w-8 bg-[#111] rounded-sm p-1 shadow-inner justify-end">
                                            <div className="text-[8px] text-center text-silver-dark font-mono uppercase mb-1">MST</div>
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <div key={`m-${i}`} className={`h-1.5 w-full rounded-xs ${i < 1 ? 'bg-[#333]' : i < 4 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`} />
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onMouseDown={() => setIsComparing(true)}
                                        onMouseUp={() => setIsComparing(false)}
                                        onMouseLeave={() => setIsComparing(false)}
                                        className={`mt-4 px-6 py-1 rounded bg-[#1A1A1A] border border-[#333] text-[10px] font-bold tracking-widest uppercase transition-all shadow-[0_4px_6px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none ${isComparing ? 'text-red-500 glow-red border-red-500/50' : 'text-[#888] hover:text-[#AAA]'}`}
                                    >
                                        COMPARE
                                    </button>
                                </div>

                                {/* Display 3: Right Side Panel (Master Mode) */}
                                <div className="bg-[#303030] rounded-lg border border-[#3A3A3A] p-4 flex flex-col items-center justify-center gap-6 shadow-inner">
                                    <div className="bg-[#1A1A1C] px-4 py-1.5 rounded-full border border-cyan-glow/30 flex items-center justify-between w-full cursor-pointer shadow-inner">
                                        <span className="text-cyan-glow text-xs font-bold tracking-widest uppercase">Stereo</span>
                                        <span className="text-white/50 text-[10px]">▼</span>
                                    </div>
                                    <MasteringKnob 
                                        label="INPUT DRIVE" 
                                        value={settings.inputDrive} 
                                        onChange={(v) => setSettings({...settings, inputDrive: v})}
                                        size="sm" 
                                    />
                                    <MasteringKnob 
                                        label="WIDTH" 
                                        value={settings.stereoWidth} 
                                        onChange={(v) => setSettings({...settings, stereoWidth: v})}
                                        size="sm" 
                                    />
                                </div>

                            </div>

                            {/* Bottom Row Knobs: Dynamic master_me module controls */}
                            <div className="mt-4 bg-[#303030] rounded-lg border border-[#3A3A3A] p-8 flex justify-around items-center shadow-inner min-h-[180px]">
                                {currentModule === 'gate' && (
                                    <div className="flex-1 flex gap-8 items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <button 
                                                onClick={() => setSettings({...settings, gateBypass: !settings.gateBypass})}
                                                className={`w-6 h-6 rounded-full border transition-all ${!settings.gateBypass ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-black border-white/10'}`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full mx-auto ${!settings.gateBypass ? 'bg-white animate-pulse' : 'bg-white/10'}`} />
                                            </button>
                                            <span className="text-[7px] text-white/30 font-black uppercase tracking-tighter">Power</span>
                                        </div>
                                        <MasteringKnob label="THRESHOLD" value={settings.gateThreshold} onChange={(v) => setSettings({...settings, gateThreshold: v})} size="lg" />
                                        <MasteringKnob label="RELEASE" value={settings.gateRelease} onChange={(v) => setSettings({...settings, gateRelease: v})} size="lg" />
                                    </div>
                                )}
                                {currentModule === 'eq' && (
                                    <div className="flex-1 flex gap-8 items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <button 
                                                onClick={() => setSettings({...settings, eqBypass: !settings.eqBypass})}
                                                className={`w-6 h-6 rounded-full border transition-all ${!settings.eqBypass ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-black border-white/10'}`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full mx-auto ${!settings.eqBypass ? 'bg-white animate-pulse' : 'bg-white/10'}`} />
                                            </button>
                                            <span className="text-[7px] text-white/30 font-black uppercase tracking-tighter">Power</span>
                                        </div>
                                        <MasteringKnob label="HIGHPASS" value={settings.eqHighpass} onChange={(v) => setSettings({...settings, eqHighpass: v})} size="lg" />
                                        <MasteringKnob label="TILT" value={settings.eqTilt} onChange={(v) => setSettings({...settings, eqTilt: v})} size="lg" />
                                        <MasteringKnob label="S-GAIN" value={settings.eqSideGain} onChange={(v) => setSettings({...settings, eqSideGain: v})} size="lg" />
                                        <MasteringKnob label="SIDE FREQ" value={settings.eqSideFreq} onChange={(v) => setSettings({...settings, eqSideFreq: v})} size="lg" />
                                    </div>
                                )}
                                {currentModule === 'leveler' && (
                                    <div className="flex-1 flex gap-8 items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <button 
                                                onClick={() => setSettings({...settings, levelerBypass: !settings.levelerBypass})}
                                                className={`w-6 h-6 rounded-full border transition-all ${!settings.levelerBypass ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-black border-white/10'}`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full mx-auto ${!settings.levelerBypass ? 'bg-white animate-pulse' : 'bg-white/10'}`} />
                                            </button>
                                            <span className="text-[7px] text-white/30 font-black uppercase tracking-tighter">Power</span>
                                        </div>
                                        <MasteringKnob label="TARGET" value={settings.levelerTarget} onChange={(v) => setSettings({...settings, levelerTarget: v})} size="lg" />
                                        <MasteringKnob label="BRAKE" value={settings.levelerBrake} onChange={(v) => setSettings({...settings, levelerBrake: v})} size="lg" />
                                        <MasteringKnob label="MAX +" value={settings.levelerMaxPlus} onChange={(v) => setSettings({...settings, levelerMaxPlus: v})} size="lg" />
                                        <MasteringKnob label="MAX -" value={settings.levelerMaxMinus} onChange={(v) => setSettings({...settings, levelerMaxMinus: v})} size="lg" />
                                    </div>
                                )}
                                {currentModule === 'compressor' && (
                                    <div className="flex-1 flex gap-8 items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <button 
                                                onClick={() => setSettings({...settings, compBypass: !settings.compBypass})}
                                                className={`w-6 h-6 rounded-full border transition-all ${!settings.compBypass ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-black border-white/10'}`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full mx-auto ${!settings.compBypass ? 'bg-white animate-pulse' : 'bg-white/10'}`} />
                                            </button>
                                            <span className="text-[7px] text-white/30 font-black uppercase tracking-tighter">Power</span>
                                        </div>
                                        <MasteringKnob label="STRENGTH" value={settings.compStrength} onChange={(v) => setSettings({...settings, compStrength: v})} size="lg" />
                                        <MasteringKnob label="ATTACK" value={settings.compAttack} onChange={(v) => setSettings({...settings, compAttack: v})} size="lg" />
                                        <MasteringKnob label="RELEASE" value={settings.compRelease} onChange={(v) => setSettings({...settings, compRelease: v})} size="lg" />
                                        <MasteringKnob label="MAKEUP" value={settings.compMakeup} onChange={(v) => setSettings({...settings, compMakeup: v})} size="lg" />
                                    </div>
                                )}
                                {currentModule === 'multiband' && (
                                    <div className="flex-1 flex gap-8 items-center justify-center">
                                        <div className="flex flex-col items-center gap-2 mr-4">
                                            <button 
                                                onClick={() => setSettings({...settings, mbBypass: !settings.mbBypass})}
                                                className={`w-6 h-6 rounded-full border transition-all ${!settings.mbBypass ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-black border-white/10'}`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full mx-auto ${!settings.mbBypass ? 'bg-white animate-pulse' : 'bg-white/10'}`} />
                                            </button>
                                            <span className="text-[7px] text-white/30 font-black uppercase tracking-tighter">Power</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-4 border-r border-white/5 pr-8">
                                            <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Low Bands</span>
                                            <div className="flex gap-4">
                                                <MasteringKnob label="STR" value={settings.mbStrengthLow} onChange={(v) => setSettings({...settings, mbStrengthLow: v})} size="md" />
                                                <MasteringKnob label="CROSS" value={settings.mbCrossoverLow} onChange={(v) => setSettings({...settings, mbCrossoverLow: v})} size="md" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-4">
                                            <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">High Bands</span>
                                            <div className="flex gap-4">
                                                <MasteringKnob label="STR" value={settings.mbStrengthHigh} onChange={(v) => setSettings({...settings, mbStrengthHigh: v})} size="md" />
                                                <MasteringKnob label="CROSS" value={settings.mbCrossoverHigh} onChange={(v) => setSettings({...settings, mbCrossoverHigh: v})} size="md" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {currentModule === 'limiter' && (
                                    <div className="flex-1 flex gap-8 items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <button 
                                                onClick={() => setSettings({...settings, limBypass: !settings.limBypass})}
                                                className={`w-6 h-6 rounded-full border transition-all ${!settings.limBypass ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-black border-white/10'}`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full mx-auto ${!settings.limBypass ? 'bg-white animate-pulse' : 'bg-white/10'}`} />
                                            </button>
                                            <span className="text-[7px] text-white/30 font-black uppercase tracking-tighter">Power</span>
                                        </div>
                                        <MasteringKnob label="STRENGTH" value={settings.limStrength} onChange={(v) => setSettings({...settings, limStrength: v})} size="lg" />
                                        <MasteringKnob label="ATTACK" value={settings.limAttack} onChange={(v) => setSettings({...settings, limAttack: v})} size="lg" />
                                        <MasteringKnob label="RELEASE" value={settings.limRelease} onChange={(v) => setSettings({...settings, limRelease: v})} size="lg" />
                                        <MasteringKnob label="CEILING" value={settings.limCeiling} onChange={(v) => setSettings({...settings, limCeiling: v})} size="lg" />
                                    </div>
                                )}
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
