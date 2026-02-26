import React from 'react';

interface MasteringKnobProps {
    label: string;
    value: number; // 0 to 100
    onChange?: (value: number) => void;
    size?: 'sm' | 'md' | 'lg';
}

export function MasteringKnob({ label, value, onChange, size = 'md' }: MasteringKnobProps) {
    // Calculate rotation (-135deg to +135deg for a standard 270 degree sweep)
    const rotation = -135 + (value / 100) * 270;

    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Knob Container (The groove/shadow it sits in) */}
            <div className={`${sizeClasses[size]} rounded-full bg-[#1A1A1A] p-1 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_2px_4px_rgba(255,255,255,0.05)] relative flex items-center justify-center`}>

                {/* The Knob Body */}
                <div
                    className="w-full h-full rounded-full bg-gradient-to-b from-[#333] to-[#111] shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_2px_1px_rgba(255,255,255,0.2)] relative cursor-ns-resize group"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {/* The Indicator Line */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1/4 bg-white/80 rounded-full shadow-[0_0_2px_rgba(255,255,255,0.5)] group-hover:bg-cyan-glow group-hover:shadow-[0_0_5px_rgba(0,240,255,0.8)] transition-colors" />
                </div>
            </div>

            {/* Label */}
            <span className="text-[10px] font-bold tracking-widest text-[#888] uppercase">{label}</span>
        </div>
    );
}
