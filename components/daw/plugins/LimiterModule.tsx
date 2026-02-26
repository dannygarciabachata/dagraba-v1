'use client';

import React from 'react';
import { MasteringKnob } from '../MasteringKnob';

interface LimiterModuleProps {
    settings: {
        limStrength: number;
        limAttack: number;
        limRelease: number;
        limCeiling: number;
    };
    onChange: (settings: any) => void;
}

export function LimiterModule({ settings, onChange }: LimiterModuleProps) {
    return (
        <div className="flex gap-8 p-4 justify-around items-center bg-[#303030] rounded-lg border border-[#3A3A3A] shadow-inner min-h-[180px] w-full">
            <MasteringKnob 
                label="STRENGTH" 
                value={settings.limStrength} 
                onChange={(v) => onChange({ limStrength: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="ATTACK" 
                value={settings.limAttack} 
                onChange={(v) => onChange({ limAttack: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="RELEASE" 
                value={settings.limRelease} 
                onChange={(v) => onChange({ limRelease: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="CEILING" 
                value={settings.limCeiling} 
                onChange={(v) => onChange({ limCeiling: v })} 
                size="lg" 
            />
        </div>
    );
}
