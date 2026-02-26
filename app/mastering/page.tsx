'use client';

import { useState } from 'react';
import { StudioMonitor } from '@/components/daw/StudioMonitor';
import { MasteringKnob } from '@/components/daw/MasteringKnob';
import { Activity, Power, SlidersHorizontal } from 'lucide-react';

export default function Mastering() {
    const [isOn, setIsOn] = useState(true);
    const [isComparing, setIsComparing] = useState(false);

    return (
        <div className="flex w-full h-full items-center justify-between px-24 relative overflow-hidden pointer-events-auto">

            {/* Background Studio Window Blur effect */}
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

            {/* Left Speaker */}
            <div className="flex-shrink-0 relative z-10 transform scale-110">
                <StudioMonitor />
            </div>

            {/* Center Plugin Rack (MiniSynth / Serum Style) */}
            <div className="flex-1 max-w-4xl mx-16 z-20 relative">

                {/* The Plugin Enclosure */}
                <div className="bg-[#2B2B2B] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-[#1A1A1A] p-4 flex flex-col gap-4">

                    {/* Header Bar */}
                    <div className="flex justify-between items-center px-2 py-1">
                        <div className="flex items-center gap-6">
                            <span className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                                <Activity size={16} />
                                DA GRABA
                            </span>
                            <span className="text-white/80 font-bold text-sm">MasterSynth</span>
                        </div>

                        {/* Power Switch */}
                        <button
                            onClick={() => setIsOn(!isOn)}
                            className="w-12 h-6 rounded-full bg-[#111] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative flex items-center px-1"
                        >
                            <div className={`w-4 h-4 rounded-full shadow-md transition-all duration-300 ${isOn ? 'bg-green-500 translate-x-6 glow-primary' : 'bg-[#444] translate-x-0'}`} />
                        </button>
                    </div>

                    <div className={`transition-opacity duration-500 ${isOn ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                        {/* Middle Displays Row */}
                        <div className="grid grid-cols-3 gap-4 h-48">

                            {/* Display 1: Fake EQ Graph */}
                            <div className="bg-[#181818] rounded-lg border border-[#333] shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] p-2 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[#1A1A1C] opacity-50" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                {/* Graphic Curve */}
                                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                    <path d="M0,150 C50,150 100,50 150,40 C200,30 250,150 350,150" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" />
                                </svg>
                                {/* Draggable node */}
                                <div className="absolute left-[145px] top-[35px] w-4 h-4 rounded-full border-2 border-white/50 bg-transparent cursor-pointer" />
                            </div>

                            {/* Display 2: Compare LED Meters */}
                            <div className="bg-[#2A2A2D] rounded-lg border border-[#1A1A1C] shadow-inner p-4 flex flex-col items-center justify-between">
                                <div className="flex gap-8 h-24 w-full justify-center">
                                    {/* Source Meter */}
                                    <div className="flex flex-col gap-1 h-full w-8 bg-[#111] rounded-sm p-1 shadow-inner justify-end">
                                        <div className="text-[8px] text-center text-silver-dark font-mono uppercase mb-1">SRC</div>
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={`s-${i}`} className={`h-1.5 w-full rounded-xs ${i < 3 ? 'bg-[#333]' : i < 6 ? 'bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]' : 'bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]'}`} />
                                        ))}
                                    </div>

                                    {/* Master Meter */}
                                    <div className="flex flex-col gap-1 h-full w-8 bg-[#111] rounded-sm p-1 shadow-inner justify-end">
                                        <div className="text-[8px] text-center text-silver-dark font-mono uppercase mb-1">MST</div>
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={`m-${i}`} className={`h-1.5 w-full rounded-xs ${i < 1 ? 'bg-[#333]' : i < 4 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`} />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onMouseDown={() => setIsComparing(true)}
                                    onMouseUp={() => setIsComparing(false)}
                                    onMouseLeave={() => setIsComparing(false)}
                                    className={`mt-4 px-6 py-1 rounded bg-[#1A1A1A] border border-[#333] text-[10px] font-bold tracking-widest uppercase transition-all shadow-[0_4px_6px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none ${isComparing ? 'text-red-500 glow-red border-red-500/50' : 'text-[#888] hover:text-[#AAA]'}`}
                                >
                                    COMPARE
                                </button>
                            </div>

                            {/* Display 3: Right Side Panel (Voices/Mode) */}
                            <div className="bg-[#303030] rounded-lg border border-[#3A3A3A] p-4 flex flex-col items-center justify-center gap-6 shadow-inner">
                                <div className="bg-[#1A1A1C] px-4 py-1.5 rounded-full border border-cyan-glow/30 flex items-center justify-between w-full cursor-pointer shadow-inner">
                                    <span className="text-cyan-glow text-xs font-bold tracking-widest">POLY</span>
                                    <span className="text-white/50 text-[10px]">▼</span>
                                </div>
                                <MasteringKnob label="VOICE MODE" value={20} size="sm" />
                                <MasteringKnob label="SLIDE" value={60} size="sm" />
                            </div>

                        </div>

                        {/* Bottom Row Knobs */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="bg-[#303030] rounded-lg border border-[#3A3A3A] p-6 flex justify-around items-center shadow-inner">
                                <MasteringKnob label="MOD" value={10} size="md" />
                                <MasteringKnob label="NOISE MIX" value={30} size="md" />
                            </div>
                            <div className="bg-[#303030] rounded-lg border border-[#3A3A3A] p-6 flex justify-around items-center shadow-inner">
                                <MasteringKnob label="CUTOFF" value={70} size="md" />
                                <MasteringKnob label="RESONANCE" value={45} size="md" />
                            </div>
                            <div className="bg-[#303030] rounded-lg border border-[#3A3A3A] py-6 px-2 flex justify-around items-center shadow-inner">
                                <MasteringKnob label="ATTACK" value={5} size="sm" />
                                <MasteringKnob label="DECAY" value={40} size="sm" />
                                <MasteringKnob label="SUSTAIN" value={80} size="sm" />
                                <MasteringKnob label="RELEASE" value={25} size="sm" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Right Speaker */}
            <div className="flex-shrink-0 relative z-10 transform scale-110">
                <StudioMonitor />
            </div>

        </div>
    );
}
