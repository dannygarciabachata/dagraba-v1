'use client';

import React, { useEffect } from 'react';
import { X, Power } from 'lucide-react';
import { useDAWStore, FXInsert } from '@/store/useDAWStore';
import { GateModule } from './plugins/GateModule';
import { EQModule } from './plugins/EQModule';
import { CompressorModule } from './plugins/CompressorModule';
import { MultibandModule } from './plugins/MultibandModule';
import { LimiterModule } from './plugins/LimiterModule';
import { LevelerModule } from './plugins/LevelerModule';
import { audioEngine } from '@/lib/audio-engine-bridge';

interface PluginWindowProps {
    trackId: string;
    insert: FXInsert;
    onClose: () => void;
}

export function PluginWindow({ trackId, insert, onClose }: PluginWindowProps) {
    const updateInsertSettings = useDAWStore((state) => state.updateInsertSettings);
    const toggleInsertBypass = useDAWStore((state) => state.toggleInsertBypass);

    // Sync with Audio Engine
    useEffect(() => {
        if (insert.bypass) return;

        if (insert.pluginId === 'eq') {
            audioEngine.updateEQ(trackId, insert.settings.eqHighpass, insert.settings.eqTilt, false);
        } else if (insert.pluginId === 'compressor') {
            audioEngine.updateCompressor(trackId, insert.settings.compStrength, insert.settings.compAttack, insert.settings.compRelease, false);
        }
    }, [trackId, insert.settings, insert.bypass, insert.pluginId]);

    const renderModule = () => {
        const props = {
            settings: insert.settings,
            onChange: (newSettings: any) => updateInsertSettings(trackId, insert.id, newSettings)
        };

        switch (insert.pluginId) {
            case 'gate': return <GateModule {...props} />;
            case 'eq': return <EQModule {...props} />;
            case 'compressor': return <CompressorModule {...props} />;
            case 'multiband': return <MultibandModule {...props} />;
            case 'limiter': return <LimiterModule {...props} />;
            case 'leveler': return <LevelerModule {...props} />;
            default: return null;
        }
    };

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-[#2B2B2B] rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-[#1A1A1A] p-1 w-[600px] animate-in zoom-in-95 duration-200">
            {/* Header / Title Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] rounded-t-lg border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => toggleInsertBypass(trackId, insert.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${insert.bypass ? 'bg-zinc-800 text-zinc-600' : 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}
                    >
                        <Power size={12} />
                    </button>
                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest italic">
                        DA GRABA <span className="text-cyan-400">{insert.pluginId === 'multiband' ? 'M-BAND' : insert.pluginId}</span>
                    </span>
                </div>
                
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-white/5 rounded-md text-white/20 hover:text-white transition-colors"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Plugin Interface */}
            <div className={`p-4 transition-opacity duration-300 ${insert.bypass ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                {renderModule()}
            </div>

            {/* Footer / Status */}
            <div className="px-4 py-1.5 bg-[#141414] rounded-b-lg flex justify-between items-center">
                <span className="text-[8px] text-white/20 font-mono uppercase tracking-tighter">High Fidelity Processing</span>
                <span className="text-[8px] text-cyan-400/40 font-mono uppercase">Track: {trackId}</span>
            </div>
        </div>
    );
}
