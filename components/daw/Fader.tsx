'use client';

import { useDAWStore } from '@/store/useDAWStore';
import { Slider } from '@/components/ui/Slider';
import { VUMeter } from '@/components/daw/VUMeter';
import { SpectrumAnalyzer } from '@/components/daw/SpectrumAnalyzer';
import { cn } from '@/lib/utils';
import { PluginPicker } from './PluginPicker';
import { Power } from 'lucide-react';
import { useState, useEffect } from 'react';
import { audioEngine } from '@/lib/audio-engine-bridge';

interface FaderProps {
    id: string;
}

export function Fader({ id }: FaderProps) {
    const fader = useDAWStore((state) => state.faders.find((f) => f.id === id));
    const setFaderValue = useDAWStore((state) => state.setFaderValue);
    const toggleSolo = useDAWStore((state) => state.toggleSolo);
    const toggleMute = useDAWStore((state) => state.toggleMute);
    const isFullMixer = useDAWStore((state) => state.isFullMixer);
    
    const addInsert = useDAWStore((state) => state.addInsert);
    const openPlugin = useDAWStore((state) => state.openPlugin);
    const toggleInsertBypass = useDAWStore((state) => state.toggleInsertBypass);

    const [pickerOpen, setPickerOpen] = useState(false);
    const [realLevel, setRealLevel] = useState(0);

    // Sync with Audio Engine
    useEffect(() => {
        if (!fader) return;
        audioEngine.setTrackVolume(id, fader.value);
        audioEngine.setTrackPan(id, fader.pan);
        audioEngine.setTrackMute(id, fader.isMuted);
    }, [id, fader?.value, fader?.pan, fader?.isMuted]);

    if (!fader) return null;

    // Level Update Loop
    useEffect(() => {
        let animationFrameId: number;
        const updateLevel = () => {
            const level = audioEngine.getVUMeterLevel(id);
            setRealLevel(level);
            animationFrameId = requestAnimationFrame(updateLevel);
        };
        updateLevel();
        return () => cancelAnimationFrame(animationFrameId);
    }, [id]);

    if (!fader) return null;

    return (
        <div className={cn("flex flex-col items-center group transition-all duration-500", isFullMixer ? "w-24" : "w-16")}>

            {/* Top Digital Section: Spectrum Analyzer */}
            <div className="w-full h-16 mb-2 bg-black border border-white/5 rounded-sm overflow-hidden shadow-inner relative group-hover:border-white/10 transition-colors">
                <SpectrumAnalyzer naked />
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            </div>

            {/* FX Slots (Dynamic Inserts) */}
            <div className="grid grid-cols-1 gap-1 w-full mb-3 px-1 relative">
                {[0, 1, 2, 3].map((index) => {
                    const insert = fader.inserts[index];
                    return (
                        <div key={index} className="relative group/insert">
                            {insert ? (
                                <div className="flex gap-0.5 h-5 w-full">
                                    <button
                                        onClick={() => toggleInsertBypass(id, insert.id)}
                                        className={cn(
                                            "w-4 h-full rounded-l-[1px] border border-white/5 flex items-center justify-center transition-all",
                                            insert.bypass ? "bg-zinc-900 text-zinc-700" : "bg-cyan-900/40 text-cyan-400 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]"
                                        )}
                                    >
                                        <Power size={8} />
                                    </button>
                                    <button
                                        onClick={() => openPlugin(insert.id)}
                                        className={cn(
                                            "flex-1 rounded-r-[1px] bg-[#111] border-y border-r border-white/5 text-[7px] font-black transition-all tracking-tighter uppercase ring-1 ring-black flex items-center px-1.5",
                                            insert.bypass ? "text-white/10" : "text-white/60 hover:text-white hover:bg-[#222]"
                                        )}
                                    >
                                        <span className="truncate">{insert.pluginId}</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setPickerOpen(true)}
                                    className="h-5 w-full rounded-[1px] bg-black/40 border border-dashed border-white/5 text-[6px] font-bold text-white/5 hover:text-white/20 hover:border-white/10 hover:bg-white/5 transition-all uppercase tracking-widest"
                                >
                                    Empty
                                </button>
                            )}
                        </div>
                    );
                })}

                {pickerOpen && (
                    <PluginPicker 
                        onSelect={(pluginId) => addInsert(id, pluginId)}
                        onClose={() => setPickerOpen(false)}
                    />
                )}
            </div>

            {/* Top Section: Buttons & Small Screen */}
            <div className="flex flex-col gap-2 items-center mb-6 w-full px-1">

                {/* Mini Routing/Pan Screen (OLED style) */}
                <div className="w-full h-10 bg-black border border-white/10 rounded-sm flex flex-col items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,1)] mb-2 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                    <span className="text-[10px] font-mono text-cyan-400 tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                        {fader.pan === 0 ? 'C' : fader.pan > 0 ? `R${fader.pan}` : `L${Math.abs(fader.pan)}`}
                    </span>
                    <div className="w-4/5 h-[1px] bg-white/5 mt-1" />
                    <span className="text-[7px] font-mono text-white/20 mt-0.5 tracking-tighter uppercase">Stereo Out</span>
                </div>

                <div className="grid grid-cols-2 gap-1 w-full">
                    <button
                        onClick={() => toggleSolo(id)}
                        className={`h-7 rounded-sm text-[9px] font-black tracking-widest border transition-all duration-300 shadow-md ${fader.isSoloed ? 'bg-orange-500 border-orange-400 text-black shadow-[0_0_15px_rgba(249,115,22,0.5)] ring-1 ring-orange-300/50' : 'bg-neutral-900 border-white/5 text-white/30 hover:text-white/60 hover:bg-neutral-800'}`}
                    >
                        S
                    </button>
                    <button
                        onClick={() => toggleMute(id)}
                        className={`h-7 rounded-sm text-[9px] font-black tracking-widest border transition-all duration-300 shadow-md ${fader.isMuted ? 'bg-red-600 border-red-500 text-black shadow-[0_0_15px_rgba(220,38,38,0.5)] ring-1 ring-red-400/50' : 'bg-neutral-900 border-white/5 text-white/30 hover:text-white/60 hover:bg-neutral-800'}`}
                    >
                        M
                    </button>
                </div>
            </div>

            {/* Main Fader Track Area */}
            <div className="relative h-[300px] w-full bg-[#111] border-x border-[#222] flex shadow-inner group-hover:bg-[#141414] transition-colors rounded-t-sm">

                {/* Scale Markings Container */}
                <div className="absolute left-1 inset-y-0 w-2 flex flex-col justify-between py-4 pointer-events-none z-0">
                    {[10, 5, 0, -5, -10, -20, -30, -60].map((val, i) => (
                        <div key={i} className="w-full border-t border-silver-dark/40 relative">
                            {(val === 0 || val === 10 || val === -60) && (
                                <span className={`absolute left-3 -top-2 text-[7px] font-mono ${(val === 0) ? 'text-primary' : 'text-silver-dark'}`}>
                                    {val === -60 ? '-∞' : val}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* LED VU Meter integrated into fader track */}
                <div className="absolute right-1 top-4 bottom-4 w-1.5 opacity-80 pointer-events-none z-0">
                    <VUMeter level={fader.isMuted ? 0 : realLevel} className="h-full w-full rounded-sm" />
                </div>

                {/* Functional Slider Track */}
                <div className="absolute inset-0 flex justify-center z-10 w-full">
                    {/* The physical slit */}
                    <div className="absolute top-4 bottom-4 w-1.5 bg-black rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]" />

                    <Slider
                        orientation="vertical"
                        min={0}
                        max={100}
                        value={fader.value}
                        onChange={(e) => setFaderValue(id, parseInt(e.target.value))}
                        className="h-full w-full cursor-grab active:cursor-grabbing transition-all duration-700 ease-in-out opacity-0 z-20"
                        style={{ writingMode: 'vertical-lr', direction: 'rtl' } as React.CSSProperties}
                    />

                    {/* Simulated 3D Fader Cap (Brushed Metal) */}
                    <div
                        className="absolute w-8 h-14 bg-[#CCCCCC] border-x border-[#999] shadow-[0_10px_30px_rgba(0,0,0,0.8),_inset_0_1px_4px_rgba(255,255,255,0.8)] rounded-[2px] pointer-events-none z-10 transition-all duration-700 ease-in-out flex flex-col items-center justify-center transform-gpu"
                        style={{ bottom: `calc(${fader.value}% - 28px)` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
                        <div className="w-full h-[3px] bg-black/60 shadow-[0_1px_2px_rgba(255,255,255,0.2)]" />
                        <div className="w-full h-[4px] bg-gradient-to-b from-white/20 to-transparent mt-[1px]" />
                        <div className="mt-auto mb-1 flex flex-col gap-[2px]">
                            <div className="w-5 h-[1px] bg-black/20" />
                            <div className="w-5 h-[1px] bg-black/20" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Scribble Strip (Aluminium look) */}
            <div className="w-full min-h-[48px] bg-gradient-to-b from-[#DEDEDE] to-[#B0B0B0] mt-1 rounded-b-md flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.8),_0_5px_15px_rgba(0,0,0,0.3)] border-b border-black/40 border-x border-black/20 px-1 overflow-hidden">
                <span className="font-mono text-[10px] font-black text-black/80 tracking-widest uppercase text-center break-words leading-tight">{fader.label}</span>
            </div>
        </div>
    );
}
