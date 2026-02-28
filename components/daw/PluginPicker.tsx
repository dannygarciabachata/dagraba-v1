'use client';

import React from 'react';
import { FXInsert } from '@/store/useDAWStore';

interface PluginPickerProps {
    onSelect: (pluginId: FXInsert['pluginId']) => void;
    onClose: () => void;
}

export function PluginPicker({ onSelect, onClose }: PluginPickerProps) {
    const plugins: { id: FXInsert['pluginId']; name: string; color: string }[] = [
        { id: 'gate', name: 'Gate', color: 'text-cyan-400' },
        { id: 'eq', name: 'Equalizer', color: 'text-cyan-400' },
        { id: 'leveler', name: 'Leveler', color: 'text-cyan-400' },
        { id: 'compressor', name: 'Compressor', color: 'text-cyan-400' },
        { id: 'multiband', name: 'Multiband', color: 'text-cyan-400' },
        { id: 'limiter', name: 'Limiter', color: 'text-cyan-400' },
        { id: 'reverb', name: 'Reverb', color: 'text-cyan-300' },
        { id: 'delay', name: 'Delay', color: 'text-orange-400' },
        { id: 'chorus', name: 'Chorus', color: 'text-purple-400' },
        { id: 'distortion', name: 'Distortion', color: 'text-red-400' },
    ];

    const wasmPlugins: { id: FXInsert['pluginId']; name: string; color: string }[] = [
        { id: 'saturator', name: 'Saturator ⚡', color: 'text-orange-400' },
    ];

    return (
        <div className="absolute top-0 left-0 w-56 bg-[#1A1A1A] border border-white/10 rounded-md shadow-2xl z-[150] p-1 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 border-b border-white/5 mb-1">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Select Effect</span>
            </div>
            <div className="mb-1">
                <span className="px-3 text-[8px] font-black text-white/20 uppercase tracking-widest">Dynamics</span>
                {plugins.slice(0, 6).map((plugin) => (
                    <button
                        key={plugin.id}
                        onClick={() => { onSelect(plugin.id); onClose(); }}
                        className={`w-full text-left px-3 py-1.5 text-[10px] hover:text-white hover:bg-cyan-500/20 rounded-sm transition-colors uppercase font-bold tracking-tight ${plugin.color}`}
                    >
                        {plugin.name}
                    </button>
                ))}
            </div>
            <div className="mb-1 border-t border-white/5 pt-1">
                <span className="px-3 text-[8px] font-black text-white/20 uppercase tracking-widest">Time FX</span>
                {plugins.slice(6).map((plugin) => (
                    <button
                        key={plugin.id}
                        onClick={() => { onSelect(plugin.id); onClose(); }}
                        className={`w-full text-left px-3 py-1.5 text-[10px] hover:text-white rounded-sm transition-colors uppercase font-bold tracking-tight ${plugin.color} hover:bg-white/10`}
                    >
                        {plugin.name}
                    </button>
                ))}
            </div>
            <div className="mb-1 border-t border-white/5 pt-1">
                <span className="px-3 text-[8px] font-black text-orange-400/40 uppercase tracking-widest">WASM DSP ⚡</span>
                {wasmPlugins.map((plugin) => (
                    <button
                        key={plugin.id}
                        onClick={() => { onSelect(plugin.id); onClose(); }}
                        className={`w-full text-left px-3 py-1.5 text-[10px] hover:text-white rounded-sm transition-colors uppercase font-bold tracking-tight ${plugin.color} hover:bg-orange-500/10`}
                    >
                        {plugin.name}
                    </button>
                ))}
            </div>
            <div className="mt-1 pt-1 border-t border-white/5">
                <button
                    onClick={onClose}
                    className="w-full text-left px-3 py-1.5 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-sm transition-colors uppercase font-bold tracking-tight"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
