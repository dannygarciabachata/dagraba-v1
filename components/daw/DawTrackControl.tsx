import React, { useState, useEffect } from 'react';
import { Volume2, Power, Trash2 } from 'lucide-react';
import { audioEngine } from '@/lib/audio-engine-bridge';
import { useDAWStore } from '@/store/useDAWStore';

interface DawTrackControlProps {
    trackId: string;
    trackName: string;
    color: string;
}

export function DawTrackControl({ trackId, trackName, color }: DawTrackControlProps) {
    const fader = useDAWStore((state) => state.faders.find((f) => f.id === trackId));
    const trackHeight = useDAWStore((state) => state.trackHeights[trackId] ?? 64);
    const setFaderValue = useDAWStore((state) => state.setFaderValue);
    const setPanStore = useDAWStore((state) => state.setPan);
    const toggleSoloStore = useDAWStore((state) => state.toggleSolo);
    const toggleMuteStore = useDAWStore((state) => state.toggleMute);
    const removeTrack = useDAWStore((state) => state.removeTrack);

    if (!fader) return null;

    // Communication with Bridge
    useEffect(() => { audioEngine.setTrackVolume(trackId, fader.value); }, [fader.value, trackId]);
    useEffect(() => { audioEngine.setTrackPan(trackId, fader.pan); }, [fader.pan, trackId]);
    useEffect(() => { audioEngine.setTrackMute(trackId, fader.isMuted); }, [fader.isMuted, trackId]);
    useEffect(() => { audioEngine.setTrackSolo(trackId, fader.isSoloed); }, [fader.isSoloed, trackId]);

    // Simple Circular Knob Renderer (SVG)
    const renderKnob = (
        value: number,
        min: number,
        max: number,
        label: string,
        onChange: (v: number) => void,
        isBipolar: boolean = false
    ) => {
        // Map value to angle (-135 to 135 deg)
        const percent = (value - min) / (max - min);
        const angle = -135 + percent * 270;

        const handleMouseDown = (e: React.MouseEvent) => {
            e.preventDefault();
            const startY = e.clientY;
            const startVal = value;

            const onMouseMove = (moveEvent: MouseEvent) => {
                const deltaY = (startY - moveEvent.clientY) * 0.5; // Sensitivity adj
                let newVal = startVal + deltaY;
                newVal = Math.max(min, Math.min(max, newVal));
                onChange(Math.round(newVal));
            };

            const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        };

        return (
            <div className="flex flex-col items-center gap-1 group">
                <div
                    className="w-8 h-8 rounded-full bg-[#18181A] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-white/5 relative flex items-center justify-center cursor-ns-resize"
                    onMouseDown={handleMouseDown}
                >
                    <svg className="absolute inset-0 w-full h-full -rotate-[135deg]" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="12" fill="none" stroke="#222" strokeWidth="2" strokeDasharray="56.5" />
                        <circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="2" strokeDasharray="56.5" strokeDashoffset={56.5 - (percent * 56.5)} className="transition-all" />
                    </svg>

                    <div className="absolute w-full h-full" style={{ transform: `rotate(${angle}deg)` }}>
                        <div className="mx-auto mt-1 w-0.5 h-1.5 rounded bg-white shadow-[0_0_2px_#fff]" />
                    </div>
                </div>
                <span className="text-[8px] font-mono text-[#666] uppercase group-hover:text-silver-dark">{label}</span>
            </div>
        );
    };

    return (
        <div
            className="w-[200px] bg-[#111] border-b border-[#222] flex items-center justify-between px-3 shadow-2xl shrink-0 z-30 group/trackControl hover:bg-[#151517] transition-colors"
            style={{ height: `${trackHeight}px` }}
        >
            <div className="flex flex-col gap-1 w-24">
                <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold truncate tracking-widest uppercase" style={{ color }}>{trackName}</span>
                    <button onClick={() => removeTrack(trackId)} className="opacity-0 group-hover/trackControl:opacity-100 text-red-500/50 hover:text-red-500 transition-all">
                        <Trash2 size={10} />
                    </button>
                </div>
                <div className="flex gap-1.5 mt-1">
                    <button
                        onClick={() => toggleMuteStore(trackId)}
                        className={`w-7 py-1 rounded-sm text-[8px] font-bold transition-all ${fader.isMuted ? 'bg-red-600 border-red-600 text-black shadow-[0_0_10px_rgba(255,0,0,0.5)]' : 'bg-[#1a1a1a] border border-[#333] text-[#666]'}`}
                    >
                        M
                    </button>
                    <button
                        onClick={() => toggleSoloStore(trackId)}
                        className={`w-7 py-1 rounded-sm text-[8px] font-bold transition-all ${fader.isSoloed ? 'bg-[#ffaa00] border-[#ffaa00] text-black shadow-[0_0_10px_rgba(255,170,0,0.5)]' : 'bg-[#1a1a1a] border border-[#333] text-[#666]'}`}
                    >
                        S
                    </button>
                </div>
            </div>

            {/* Hide knobs if track gets too short */}
            {trackHeight >= 40 && (
                <div className="flex gap-3 items-center">
                    {renderKnob(fader.pan, -100, 100, 'PAN', (v) => setPanStore(trackId, v), true)}
                    {renderKnob(fader.value, 0, 100, 'VOL', (v) => setFaderValue(trackId, v), false)}
                </div>
            )}
        </div>
    );
}
