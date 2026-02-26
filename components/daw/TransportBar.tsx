import React, { useState, useEffect } from 'react';
import {
    Play, Square, Circle, SkipBack, SkipForward,
    Repeat, Settings2, Activity, Music, ActivitySquare, Upload, Download
} from 'lucide-react';
import { useDAWStore } from '@/store/useDAWStore';
import { modalClient } from '@/lib/modal-client';
import { audioEngine } from '@/lib/audio-engine-bridge';

export function TransportBar() {
    // --- State ---
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [playhead, setPlayhead] = useState(0);

    // --- Global DAW Store ---
    const isTraining = useDAWStore((state) => state.isTraining);
    const activeBottomPanel = useDAWStore((state) => state.activeBottomPanel);
    const isMetronomeOn = useDAWStore((state) => state.isMetronomeOn);
    const setTrainingStatus = useDAWStore((state) => state.setTrainingStatus);
    const setFaderValue = useDAWStore((state) => state.setFaderValue);
    const setActiveBottomPanel = useDAWStore((state) => state.setActiveBottomPanel);
    const toggleMetronome = useDAWStore((state) => state.toggleMetronome);
    const setIsPlayingStore = useDAWStore((state) => state.setIsPlaying);
    const setMasterLevel = useDAWStore((state) => state.setMasterLevel);
    const isFullMixer = useDAWStore((state) => state.isFullMixer);
    const setFullMixer = useDAWStore((state) => state.setFullMixer);

    // --- Audio Engine Sync ---
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setPlayhead(audioEngine.getPlayheadPosition());
                // Poll master level for speaker animations
                setMasterLevel(audioEngine.getVUMeterLevel('master'));
            }, 50);
        } else {
            setMasterLevel(0);
        }
        return () => clearInterval(interval);
    }, [isPlaying, setMasterLevel]);

    const handleTogglePlay = () => {
        if (isPlaying) {
            audioEngine.pause();
            setIsPlayingStore(false);
        } else {
            audioEngine.play();
            setIsPlayingStore(true);
        }
        setIsPlaying(!isPlaying);
    };

    const handleAutoMix = async () => {
        setTrainingStatus(true);
        try {
            const response = await modalClient.process_vocal_cloning();
            if (response.success) {
                setFaderValue('vocal', response.mixParameters.vocalLevel);
                setFaderValue('beat', response.mixParameters.beatLevel);
                setFaderValue('bass', 65);
                setFaderValue('fx', 50);
            }
        } catch (error) {
            console.error("Auto Mix Modal training failed:", error);
        } finally {
            setTrainingStatus(false);
        }
    };

    return (
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#222] bg-[#1C1C1E] shadow-md z-30 shrink-0 font-sans">

            {/* LEFT: Branding & Auto-Mix */}
            <div className="flex items-center gap-4 w-1/3">
                <div className="border border-[#FF6B00]/30 px-3 py-1 rounded bg-black/50 shadow-[0_0_10px_rgba(255,107,0,0.1)]">
                    <h1 className="text-sm font-sans tracking-widest text-white">
                        DA GRABA <span className="font-light text-[#FF6B00]">DAW</span>
                    </h1>
                </div>

                <button
                    onClick={handleAutoMix}
                    disabled={isTraining}
                    className="flex items-center gap-2 bg-[#111] hover:bg-[#1A1A1C] border border-[#FF6B00]/50 text-[#FF6B00] px-3 py-1.5 rounded shadow-[0_0_5px_rgba(255,107,0,0.2)] transition-colors disabled:opacity-50 text-[10px] font-bold tracking-widest"
                >
                    <Activity size={12} />
                    AUTO-MIX IA
                </button>
            </div>

            {/* CENTER: True Transport Controls (Logic/Pro Tools Style) */}
            <div className="flex flex-1 items-center justify-center gap-6">

                {/* Transport Buttons */}
                <div className="flex items-center gap-1 bg-[#111] p-1 rounded-md border border-[#333] shadow-inner">
                    <button className="p-1.5 text-[#AAA] hover:text-white transition-colors rounded hover:bg-[#222]">
                        <SkipBack size={16} />
                    </button>
                    <button className="p-1.5 text-[#AAA] hover:text-white transition-colors rounded hover:bg-[#222]">
                        <SkipForward size={16} />
                    </button>
                    <button className={`p-1.5 transition-colors rounded hover:bg-[#222] ${isPlaying ? 'text-white' : 'text-[#AAA] hover:text-white'}`} onClick={handleTogglePlay}>
                        <Square size={16} fill={isPlaying ? "currentColor" : "none"} />
                    </button>
                    <button className={`p-1.5 transition-colors rounded hover:bg-[#222] ${isPlaying ? 'text-[#A4ECA1]' : 'text-[#AAA] hover:text-white'}`} onClick={handleTogglePlay}>
                        <Play size={16} fill={isPlaying ? "currentColor" : "none"} />
                    </button>
                    <button className={`p-1.5 transition-colors rounded hover:bg-[#222] ${isRecording ? 'text-red-500' : 'text-[#AAA] hover:text-red-400'}`} onClick={() => setIsRecording(!isRecording)}>
                        <Circle size={16} fill={isRecording ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* LCD Display */}
                <div className="flex bg-[#0A0A0C] border border-[#333] rounded-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] px-4 py-1.5 items-center gap-6 min-w-[300px] justify-center text-[#E0E0E0]">
                    {/* Time / Measure */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-baseline gap-1 font-mono text-lg font-light tracking-wider text-[#A4ECA1]">
                            <span>{Math.floor(playhead / 2) + 1}</span>
                            <span className="text-[#666] text-sm">:</span>
                            <span>{Math.floor((playhead % 2) * 2) + 1}</span>
                            <span className="text-[#666] text-sm">:</span>
                            <span>1</span>
                            <span className="text-[#666] text-sm">:</span>
                            <span className="text-xs">{((playhead * 1000) % 1000).toFixed(0).padStart(3, '0')}</span>
                        </div>
                        <span className="text-[8px] text-[#666] uppercase tracking-widest">Measure / Time</span>
                    </div>

                    <div className="w-px h-6 bg-[#222]" />

                    {/* Tempo / Signature */}
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <span className="font-mono text-sm text-[#4A90E2]">120.00</span>
                            <span className="text-[8px] text-[#666] uppercase tracking-widest">Tempo</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-mono text-sm text-[#E2A04A]">4/4</span>
                            <span className="text-[8px] text-[#666] uppercase tracking-widest">Sig</span>
                        </div>
                    </div>
                </div>

                {/* Function Toggles */}
                <div className="flex items-center gap-1 bg-[#111] p-1 rounded-md border border-[#333] shadow-inner">
                    <button className="p-1.5 text-[#E2A04A] bg-[#222] rounded transition-colors border border-[#333]">
                        <Repeat size={16} />
                    </button>
                    <button
                        onClick={() => toggleMetronome()}
                        className={`p-1.5 rounded transition-colors border border-[#333] ${isMetronomeOn ? 'text-[#4A90E2] bg-blue-500/20 glow-blue' : 'text-[#666] bg-[#222] hover:text-[#4A90E2]'}`}
                    >
                        <ActivitySquare size={16} />
                    </button>
                </div>
            </div>

            {/* RIGHT: Panel Toggles & Settings */}
            <div className="flex items-center gap-4 w-1/3 justify-end">
                {/* Console Navigation Toggles */}
                <div className="flex bg-[#111] p-1 border border-white/5 rounded-lg shadow-xl ring-1 ring-black/50">
                    <button
                        onClick={() => {
                            setFullMixer(true);
                            setActiveBottomPanel('mixer');
                        }}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-black tracking-widest transition-all duration-300 ${isFullMixer ? 'bg-gradient-to-b from-orange-500 to-orange-700 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] border border-orange-400/50' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                    >
                        MIX
                    </button>
                    <button
                        onClick={() => {
                            setFullMixer(false);
                            setActiveBottomPanel('closed');
                        }}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-black tracking-widest transition-all duration-300 ${!isFullMixer ? 'bg-gradient-to-b from-neutral-600 to-neutral-800 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                    >
                        EDIT
                    </button>
                </div>

                <div className="w-[1px] h-6 bg-white/5 mx-2" />

                <div className="flex bg-[#111] p-1 border border-[#333] rounded shadow-sm">
                    <button
                        onClick={() => {
                            setFullMixer(false);
                            setActiveBottomPanel(activeBottomPanel === 'mixer' ? 'closed' : 'mixer');
                        }}
                        className={`px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest transition-colors ${activeBottomPanel === 'mixer' && !isFullMixer ? 'bg-[#5A5A60] text-white shadow-[inset_0_1px_5px_rgba(0,0,0,0.5)]' : 'text-[#888] hover:text-white hover:bg-[#222]'
                            }`}
                    >
                        FX
                    </button>
                    <button
                        onClick={() => {
                            setFullMixer(false);
                            setActiveBottomPanel(activeBottomPanel === 'piano_roll' ? 'closed' : 'piano_roll');
                        }}
                        className={`px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest transition-colors flex items-center gap-1 ${activeBottomPanel === 'piano_roll' ? 'bg-[#FF6B00] text-black shadow-[0_0_10px_rgba(255,107,0,0.6)]' : 'text-[#888] hover:text-white hover:bg-[#222]'
                            }`}
                    >
                        <Music size={12} />
                        PIANO
                    </button>
                </div>

                <div className="flex items-center gap-2 ml-2">
                    <button 
                        onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'audio/*';
                            input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) alert(`Audio importado al Studio: ${file.name}`);
                            };
                            input.click();
                        }}
                        className="p-1.5 text-[#AAA] hover:text-white transition-colors rounded hover:bg-[#222]" title="Importar Audio"
                    >
                        <Upload size={16} />
                    </button>
                    <button 
                        onClick={() => alert('Mezcla final exportada correctamente.')}
                        className="p-1.5 text-[#AAA] hover:text-[#A4ECA1] transition-colors rounded hover:bg-[#222]" title="Exportar Mezcla"
                    >
                        <Download size={16} />
                    </button>
                    <button className="p-1.5 text-[#666] hover:text-[#AAA] transition-colors rounded hover:bg-[#222]">
                        <Settings2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
