'use client';

import React from 'react';
import { FXInsert } from '@/store/useDAWStore';

interface PluginPickerProps {
    onSelect: (pluginId: FXInsert['pluginId']) => void;
    onClose: () => void;
}

export function PluginPicker({ onSelect, onClose }: PluginPickerProps) {
    const plugins: { id: FXInsert['pluginId']; name: string }[] = [
        { id: 'gate', name: 'Gate' },
        { id: 'eq', name: 'Equalizer' },
        { id: 'leveler', name: 'Leveler' },
        { id: 'compressor', name: 'Compressor' },
        { id: 'multiband', name: 'Multiband' },
        { id: 'limiter', name: 'Limiter' },
    ];

    return (
        <div className="absolute top-0 left-0 w-48 bg-[#1A1A1A] border border-white/10 rounded-md shadow-2xl z-[150] p-1 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 border-b border-white/5 mb-1">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Select Effect</span>
            </div>
            {plugins.map((plugin) => (
                <button
                    key={plugin.id}
                    onClick={() => {
                        onSelect(plugin.id);
                        onClose();
                    }}
                    className="w-full text-left px-3 py-1.5 text-[10px] text-white/60 hover:text-white hover:bg-cyan-500/20 rounded-sm transition-colors uppercase font-bold tracking-tight"
                >
                    {plugin.name}
                </button>
            ))}
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
