'use client';

import React from 'react';
import { Knob } from '../Knob';

interface SaturatorModuleProps {
    settings: Record<string, any>;
    onChange: (settings: Record<string, any>) => void;
}

/**
 * Da Graba Tube Saturator — Plugin UI
 * Routes through the C++ WASM DG_Saturator for analog-style warmth.
 */
export function SaturatorModule({ settings, onChange }: SaturatorModuleProps) {
    const drive = settings.satDrive ?? 30;
    const mix = settings.satMix ?? 50;
    const output = settings.satOutput ?? 50;
    const bias = settings.satBias ?? 10;

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[9px] font-black text-orange-400/80 tracking-widest uppercase">
                    Tube Saturator · WASM
                </span>
            </div>

            {/* Knobs row */}
            <div className="flex items-center justify-center gap-6">
                {/* DRIVE */}
                <div className="flex flex-col items-center gap-2">
                    <Knob
                        value={drive}
                        min={0} max={100}
                        onChange={(v) => onChange({ ...settings, satDrive: v })}
                        size={40}
                    />
                    <span className="text-[8px] font-black tracking-widest text-orange-400/60 uppercase">Drive</span>
                    <span className="text-[9px] font-mono text-white/30">{drive}%</span>
                </div>
                {/* MIX */}
                <div className="flex flex-col items-center gap-2">
                    <Knob
                        value={mix}
                        min={0} max={100}
                        onChange={(v) => onChange({ ...settings, satMix: v })}
                        size={40}
                    />
                    <span className="text-[8px] font-black tracking-widest text-orange-300/60 uppercase">Mix</span>
                    <span className="text-[9px] font-mono text-white/30">{mix}%</span>
                </div>
                {/* OUTPUT */}
                <div className="flex flex-col items-center gap-2">
                    <Knob
                        value={output}
                        min={0} max={100}
                        onChange={(v) => onChange({ ...settings, satOutput: v })}
                        size={40}
                    />
                    <span className="text-[8px] font-black tracking-widest text-amber-400/60 uppercase">Output</span>
                    <span className="text-[9px] font-mono text-white/30">{output}%</span>
                </div>
                {/* BIAS */}
                <div className="flex flex-col items-center gap-2">
                    <Knob
                        value={bias}
                        min={0} max={50}
                        onChange={(v) => onChange({ ...settings, satBias: v })}
                        size={40}
                    />
                    <span className="text-[8px] font-black tracking-widest text-red-400/60 uppercase">Bias</span>
                    <span className="text-[9px] font-mono text-white/30">{bias}%</span>
                </div>
            </div>

            {/* VU-style indicator */}
            <div className="mx-auto w-[260px] h-3 bg-[#111] rounded-full border border-white/5 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-150"
                    style={{
                        width: `${Math.min(100, drive * 1.5)}%`,
                        background: `linear-gradient(90deg, #FF6B00 0%, #FF0000 ${Math.min(100, drive * 2)}%)`,
                    }}
                />
            </div>

            <p className="text-[8px] text-white/20 text-center font-mono">
                Asymmetric Tube Model · 2nd Harmonic Injection · C++ WASM
            </p>
        </div>
    );
}
