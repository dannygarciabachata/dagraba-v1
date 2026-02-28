'use client';

import React from 'react';
import { MasteringKnob } from '../MasteringKnob';

interface GateModuleProps {
    settings: {
        gateThreshold: number;
        gateAttack: number;
        gateRelease: number;
    };
    onChange: (settings: any) => void;
}

export function GateModule({ settings, onChange }: GateModuleProps) {
    return (
        <div className="flex gap-8 p-4 justify-around items-center bg-[#303030] rounded-lg border border-[#3A3A3A] shadow-inner min-h-[180px] w-full">
            <MasteringKnob 
                label="THRES" 
                value={settings.gateThreshold} 
                onChange={(v) => onChange({ gateThreshold: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="ATTACK" 
                value={settings.gateAttack} 
                onChange={(v) => onChange({ gateAttack: v })} 
                size="lg" 
            />
            <MasteringKnob 
                label="RELEASE" 
                value={settings.gateRelease} 
                onChange={(v) => onChange({ gateRelease: v })} 
                size="lg" 
            />
        </div>
    );
}
