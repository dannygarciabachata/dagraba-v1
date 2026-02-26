'use client';

import React from 'react';
import { MasteringKnob } from '../MasteringKnob';

interface CompressorModuleProps {
    settings: {
        compStrength: number;
        compAttack: number;
        compRelease: number;
        compMakeup: number;
    };
    onChange: (settings: any) => void;
}

export function CompressorModule({ settings, onChange }: CompressorModuleProps) {
    return (
        <div className="flex gap-8 p-4 justify-around items-center bg-[#303030] rounded-lg border border-[#3A3A3A] shadow-inner min-h-[180px] w-full">
            <MasteringKnob 
                label="STRENGTH" 
                value={settings.compStrength} 
                onChange={(v) => onChange({ compStrength: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="ATTACK" 
                value={settings.compAttack} 
                onChange={(v) => onChange({ compAttack: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="RELEASE" 
                value={settings.compRelease} 
                onChange={(v) => onChange({ compRelease: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="MAKEUP" 
                value={settings.compMakeup} 
                onChange={(v) => onChange({ compMakeup: v })} 
                size="lg" 
            />
        </div>
    );
}
