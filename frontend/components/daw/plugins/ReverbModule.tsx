'use client';

import React from 'react';

interface ReverbModuleProps {
    settings: Record<string, any>;
    onChange: (settings: Record<string, any>) => void;
}

function KnobRow({ label, param, value, min, max, unit, onChange }: {
    label: string; param: string; value: number; min: number; max: number; unit?: string;
    onChange: (param: string, val: number) => void;
}) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-[135deg]">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="8" strokeDasharray="188 251" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#06b6d4" strokeWidth="8"
                        strokeDasharray={`${pct * 1.88} 251`} strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.6))' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        {Math.round(value)}{unit}
                    </span>
                </div>
            </div>
            <input type="range" min={min} max={max} step={1} value={value}
                onChange={(e) => onChange(param, Number(e.target.value))}
                className="w-14 h-1 accent-cyan-400 opacity-0 absolute cursor-pointer"
                style={{ width: '64px', height: '64px', top: 0, position: 'absolute', borderRadius: '50%' }}
            />
            <input type="range" min={min} max={max} step={1} value={value}
                onChange={(e) => onChange(param, Number(e.target.value))}
                className="w-full h-1 accent-cyan-400 mt-1 cursor-pointer"
            />
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{label}</span>
        </div>
    );
}

export function ReverbModule({ settings, onChange }: ReverbModuleProps) {
    const roomSize = settings.roomSize ?? 50;
    const damping = settings.damping ?? 50;
    const wet = settings.wet ?? 40;

    const handle = (param: string, val: number) => onChange({ ...settings, [param]: val });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black text-cyan-400/60 uppercase tracking-[0.3em]">Room Acoustics</span>
                <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-6">
                <KnobRow label="Room" param="roomSize" value={roomSize} min={0} max={100} unit="%" onChange={handle} />
                <KnobRow label="Damping" param="damping" value={damping} min={0} max={100} unit="%" onChange={handle} />
                <KnobRow label="Wet/Dry" param="wet" value={wet} min={0} max={100} unit="%" onChange={handle} />
            </div>
        </div>
    );
}
