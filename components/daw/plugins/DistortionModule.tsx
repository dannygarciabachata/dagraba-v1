'use client';

import React from 'react';

interface DistortionModuleProps {
    settings: Record<string, any>;
    onChange: (settings: Record<string, any>) => void;
}

export function DistortionModule({ settings, onChange }: DistortionModuleProps) {
    const drive = settings.drive ?? 50;
    const tone = settings.tone ?? 50;
    const mix = settings.mix ?? 50;

    const handle = (param: string, val: number) => onChange({ ...settings, [param]: val });

    const pct = (val: number, min: number, max: number) => ((val - min) / (max - min)) * 100;

    const Knob = ({ label, param, value, min, max, unit }: { label: string; param: string; value: number; min: number; max: number; unit?: string }) => (
        <div className="flex flex-col items-center gap-2 relative">
            <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-[135deg]">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="8" strokeDasharray="188 251" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="8"
                        strokeDasharray={`${pct(value, min, max) * 1.88} 251`} strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.6))' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-red-400 font-bold">{Math.round(value)}{unit}</span>
                </div>
            </div>
            <input type="range" min={min} max={max} value={value}
                onChange={(e) => handle(param, Number(e.target.value))}
                className="w-full h-1 accent-red-500 cursor-pointer" />
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{label}</span>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black text-red-400/60 uppercase tracking-[0.3em]">Saturation Drive</span>
                <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-red-500/20 to-transparent rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-6">
                <Knob label="Drive" param="drive" value={drive} min={0} max={100} unit="%" />
                <Knob label="Tone" param="tone" value={tone} min={0} max={100} unit="%" />
                <Knob label="Mix" param="mix" value={mix} min={0} max={100} unit="%" />
            </div>
        </div>
    );
}
