'use client';

import React from 'react';
import { MasteringKnob } from '../MasteringKnob';

interface MultibandModuleProps {
    settings: {
        mbStrengthLow: number;
        mbStrengthHigh: number;
        mbCrossoverLow: number;
        mbCrossoverHigh: number;
    };
    onChange: (settings: any) => void;
}

export function MultibandModule({ settings, onChange }: MultibandModuleProps) {
    return (
        <div className="flex gap-8 p-4 justify-around items-center bg-[#303030] rounded-lg border border-[#3A3A3A] shadow-inner min-h-[180px] w-full">
            <div className="flex flex-col items-center gap-4 border-r border-white/5 pr-8">
                <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Low Bands</span>
                <div className="flex gap-4">
                    <MasteringKnob label="STR" value={settings.mbStrengthLow} onChange={(v) => onChange({ mbStrengthLow: v })} size="md" />
                    <MasteringKnob label="CROSS" value={settings.mbCrossoverLow} onChange={(v) => onChange({ mbCrossoverLow: v })} size="md" />
                </div>
            </div>
            <div className="flex flex-col items-center gap-4">
                <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">High Bands</span>
                <div className="flex gap-4">
                    <MasteringKnob label="STR" value={settings.mbStrengthHigh} onChange={(v) => onChange({ mbStrengthHigh: v })} size="md" />
                    <MasteringKnob label="CROSS" value={settings.mbCrossoverHigh} onChange={(v) => onChange({ mbCrossoverHigh: v })} size="md" />
                </div>
            </div>
        </div>
    );
}
