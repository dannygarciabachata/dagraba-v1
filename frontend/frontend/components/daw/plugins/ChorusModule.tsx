'use client';

import React from 'react';

interface ChorusModuleProps {
    settings: Record<string, any>;
    onChange: (settings: Record<string, any>) => void;
}

export function ChorusModule({ settings, onChange }: ChorusModuleProps) {
    const rate = settings.rate ?? 1;
    const depth = settings.depth ?? 50;
    const mix = settings.mix ?? 50;

    const handle = (param: string, val: number) => onChange({ ...settings, [param]: val });

    const pct = (val: number, min: number, max: number) => ((val - min) / (max - min)) * 100;

    const Knob = ({ label, param, value, min, max, unit, step = 1 }: { label: string; param: string; value: number; min: number; max: number; unit?: string; step?: number }) => (
        <div className="flex flex-col items-center gap-2 relative">
            <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-[135deg]">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="8" strokeDasharray="188 251" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#a78bfa" strokeWidth="8"
                        strokeDasharray={`${pct(value, min, max) * 1.88} 251`} strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.6))' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-purple-400 font-bold">{step < 1 ? value.toFixed(1) : Math.round(value)}{unit}</span>
                </div>
            </div>
            <input type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => handle(param, Number(e.target.value))}
                className="w-full h-1 accent-purple-400 cursor-pointer" />
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{label}</span>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black text-purple-400/60 uppercase tracking-[0.3em]">Modulation</span>
                <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-6">
                <Knob label="Rate" param="rate" value={rate} min={0.1} max={10} unit="Hz" step={0.1} />
                <Knob label="Depth" param="depth" value={depth} min={0} max={100} unit="%" />
                <Knob label="Mix" param="mix" value={mix} min={0} max={100} unit="%" />
            </div>
        </div>
    );
}
