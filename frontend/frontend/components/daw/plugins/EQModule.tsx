'use client';

import React from 'react';
import { MasteringKnob } from '../MasteringKnob';

interface EQModuleProps {
    settings: {
        eqHighpass: number;
        eqTilt: number;
        eqSideGain: number;
        eqSideFreq: number;
    };
    onChange: (settings: any) => void;
}

export function EQModule({ settings, onChange }: EQModuleProps) {
    return (
        <div className="flex gap-8 p-4 justify-around items-center bg-[#303030] rounded-lg border border-[#3A3A3A] shadow-inner min-h-[180px] w-full">
            <MasteringKnob 
                label="HI-PASS" 
                value={settings.eqHighpass} 
                onChange={(v) => onChange({ eqHighpass: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="TILT" 
                value={settings.eqTilt} 
                onChange={(v) => onChange({ eqTilt: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="SIDE GAIN" 
                value={settings.eqSideGain} 
                onChange={(v) => onChange({ eqSideGain: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="SIDE FREQ" 
                value={settings.eqSideFreq} 
                onChange={(v) => onChange({ eqSideFreq: v })} 
                size="lg" 
            />
        </div>
    );
}
