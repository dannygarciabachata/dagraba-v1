'use client';

import React from 'react';
import { MasteringKnob } from '../MasteringKnob';

interface LevelerModuleProps {
    settings: {
        levelerTarget: number;
        levelerBrake: number;
        levelerMaxPlus: number;
        levelerMaxMinus: number;
    };
    onChange: (settings: any) => void;
}

export function LevelerModule({ settings, onChange }: LevelerModuleProps) {
    return (
        <div className="flex gap-8 p-4 justify-around items-center bg-[#303030] rounded-lg border border-[#3A3A3A] shadow-inner min-h-[180px] w-full">
            <MasteringKnob 
                label="TARGET LUFS" 
                value={settings.levelerTarget} 
                onChange={(v) => onChange({ levelerTarget: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="BRAKE" 
                value={settings.levelerBrake} 
                onChange={(v) => onChange({ levelerBrake: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="MAX +" 
                value={settings.levelerMaxPlus} 
                onChange={(v) => onChange({ levelerMaxPlus: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="MAX -" 
                value={settings.levelerMaxMinus} 
                onChange={(v) => onChange({ levelerMaxMinus: v })} 
                size="lg" 
            />
        </div>
    );
}
