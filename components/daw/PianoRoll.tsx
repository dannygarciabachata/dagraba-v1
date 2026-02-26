import React from 'react';
import {
    Settings2, Play, MousePointer2, Scissors, PenTool,
    Eraser, Volume2, Maximize2, Crosshair, ArrowRightLeft,
    Link2, Navigation, Focus
} from 'lucide-react';

/**
 * PianoRoll Component
 * Styled after Logic Pro X's Piano Roll editor.
 * Features a lighter gray grid, comprehensive toolbar, and velocity-colored notes.
 */
export function PianoRoll() {
    // Generate 4 octaves of keys
    const keys = Array.from({ length: 48 }, (_, i) => {
        const noteIndex = i % 12;
        const isBlack = [1, 3, 6, 8, 10].includes(noteIndex);
        const noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][noteIndex];
        const octave = Math.floor(i / 12) + 2; // Start from C2
        return { id: i, isBlack, noteName, octave, isC: noteIndex === 0 };
    });

    return (
        <div className="w-full h-full bg-[#1E1E22] flex flex-col border-t border-black/40 shadow-[0_-20px_60px_rgba(0,0,0,0.6)] font-sans relative">

            {/* Top Toolbar (Logic Pro X Inspired) */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#111] bg-[#2D2D32] shrink-0 shadow-lg z-30">

                {/* Left controls: Menus & Tools */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <button className="px-2.5 py-1 text-[11px] font-bold text-[#AAA] hover:text-white bg-transparent hover:bg-white/5 rounded transition-all">Edit</button>
                        <button className="px-2.5 py-1 text-[11px] font-bold text-[#AAA] hover:text-white bg-transparent hover:bg-white/5 rounded transition-all">Functions</button>
                        <button className="px-2.5 py-1 text-[11px] font-bold text-[#AAA] hover:text-white bg-transparent hover:bg-white/5 rounded transition-all">View</button>
                    </div>

                    <div className="w-px h-6 bg-black/30 mx-1" />

                    {/* Primary & Secondary Tools */}
                    <div className="flex items-center gap-1.5 p-1 bg-black/20 rounded-md border border-white/5">
                        <button className="p-1.5 px-3 text-[#4A90E2] bg-[#1A1A1C] rounded shadow-[0_2px_5px_rgba(0,0,0,0.3)] border border-white/10"><MousePointer2 size={13} /></button>
                        <button className="p-1.5 px-3 text-[#888] hover:text-white transition-colors"><PenTool size={13} /></button>
                        <button className="p-1.5 px-3 text-[#888] hover:text-white transition-colors"><Eraser size={13} /></button>
                        <button className="p-1.5 px-3 text-[#888] hover:text-white transition-colors"><Scissors size={13} /></button>
                    </div>

                    <div className="w-px h-6 bg-black/30 mx-1" />

                    {/* Logic Toggles */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-[#666] hover:text-white bg-black/20 rounded border border-white/5"><Navigation size={12} className="rotate-45" /></button>
                        <button className="p-2 text-orange-400 bg-orange-400/10 rounded border border-orange-400/20 shadow-[0_0_10px_rgba(251,146,60,0.1)]"><Link2 size={12} /></button>
                    </div>
                </div>

                {/* Center Tabs: Seamless Switch */}
                <div className="flex bg-black/40 rounded-lg border border-white/5 p-1 shadow-inner ring-1 ring-black/50">
                    <button className="px-8 py-1 text-[10px] font-black tracking-widest text-white bg-gradient-to-b from-[#4A6B9C] to-[#3A5B8C] rounded shadow-[0_1px_3px_rgba(0,0,0,0.4)] ring-1 ring-white/10">PIANO ROLL</button>
                    <button className="px-8 py-1 text-[10px] font-black tracking-widest text-[#666] hover:text-white transition-all uppercase">Score</button>
                    <button className="px-8 py-1 text-[10px] font-black tracking-widest text-[#666] hover:text-white transition-all uppercase">Step Editor</button>
                </div>

                {/* Right controls: Info & Snap */}
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-[#555] tracking-widest uppercase">Position</span>
                        <div className="text-[11px] font-mono text-[#4A90E2] tracking-tighter shadow-sm bg-black/20 px-2 rounded">5 1 1 1</div>
                    </div>

                    <div className="flex items-center gap-3 bg-black/20 px-3 py-1 rounded border border-white/5">
                        <span className="text-[9px] font-black text-[#555] uppercase tracking-widest">Snap</span>
                        <select className="bg-transparent border-none text-[11px] font-bold text-[#AAA] outline-none cursor-pointer hover:text-white transition-colors">
                            <option>Smart</option>
                            <option>1/16</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex flex-1 overflow-hidden relative bg-[#1E1E22]">

                {/* Left Inspector Panel (Dark Metal Style) */}
                <div className="w-[200px] bg-[#26262A] border-r border-black flex flex-col shrink-0 shadow-[10px_0_30px_rgba(0,0,0,0.3)] z-20">
                    <div className="p-4 border-b border-black/40 bg-[#1A1A1D]">
                        <div className="text-[11px] font-black tracking-widest text-[#E0E0E0] uppercase flex items-center gap-2">
                            <Focus size={12} className="text-[#4A90E2]" /> INSPECTOR
                        </div>
                        <div className="text-[9px] text-[#555] tracking-widest mt-1">Región: "Orquesta Bolero"</div>
                    </div>

                    <div className="p-4 space-y-6">
                        <div className="space-y-2">
                            <div className="text-[10px] font-black tracking-widest text-[#666] uppercase">Time Quantize</div>
                            <div className="flex rounded-md border border-black overflow-hidden shadow-lg">
                                <select className="flex-1 bg-[#111] text-[11px] text-[#AAA] py-2 px-3 outline-none hover:text-white transition-colors">
                                    <option>1/16 Note</option>
                                    <option>1/8 Note</option>
                                </select>
                                <button className="bg-[#4A90E2] text-white px-3 text-[11px] font-black border-l border-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">Q</button>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <div className="text-[10px] font-black tracking-widest text-[#666] uppercase">Velocity</div>
                                <div className="text-[10px] font-mono text-[#4A90E2] bg-black/40 px-2 rounded">100</div>
                            </div>
                            <div className="relative group py-2">
                                <div className="h-1 bg-black rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-[70%]" />
                                </div>
                                <div className="absolute top-1/2 left-[70%] -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] border border-black cursor-pointer group-hover:scale-125 transition-transform" />
                            </div>
                        </div>

                        {/* Interactive Scale Quantize */}
                        <div className="space-y-2 pt-4 border-t border-white/5">
                            <div className="text-[10px] font-black tracking-widest text-[#666] uppercase">Scale Quantize</div>
                            <div className="flex flex-col gap-1">
                                <select className="bg-[#111] border border-black rounded-md text-[11px] text-[#AAA] py-1.5 px-2 outline-none">
                                    <option>C Major</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Piano Keys & Grid Container */}
                <div className="flex flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar">

                    {/* Vertical Piano Keys (Ivory & Ebony Style) */}
                    <div className="w-[60px] flex flex-col-reverse bg-[#EAEAEA] border-r border-black sticky left-0 z-30 shadow-[5px_0_15px_rgba(0,0,0,0.4)] shrink-0">
                        {keys.map((key) => (
                            <div
                                key={key.id}
                                className={`w-full relative flex flex-col justify-end items-center pr-1 border-b border-black/10 ${key.isBlack
                                    ? 'h-[14px] bg-gradient-to-r from-[#111] to-[#333] border-black z-20 shadow-[0_2px_4px_rgba(0,0,0,0.5)] -my-[7px] rounded-r-sm'
                                    : 'h-[24px] bg-gradient-to-r from-[#F0F0F0] to-[#E0E0E0] border-[#BBB]'
                                    }`}
                                style={key.isBlack ? { width: '65%', borderRight: '2px solid black' } : {}}
                            >
                                {key.isC && !key.isBlack && (
                                    <span className="text-[10px] font-black text-[#888] absolute right-2 bottom-1 tracking-tighter opacity-60">
                                        {key.noteName}{key.octave}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* MIDI Grid (Pro Dark Theme) */}
                    <div className="flex-1 relative bg-[#26262A] min-w-[2000px]">

                        {/* High-Contrast Professional Grid Pattern */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: `
                                    linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
                                `,
                                backgroundSize: '100% 12px, 30px 100%, 120px 100%, 480px 100%'
                            }}
                        />

                        {/* Top Measure Ruler (Metallic Style) */}
                        <div className="h-8 sticky top-0 bg-[#2D2D32] border-b border-black z-40 flex text-[10px] font-black text-[#666] font-mono shadow-md">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(m => (
                                <div key={m} className="w-[120px] px-2 flex items-end pb-1.5 border-l border-white/5 relative group">
                                    <span className="group-hover:text-[#AAA] transition-colors">{m}</span>
                                    <div className="absolute bottom-0 left-[30px] h-1.5 w-px bg-white/10" />
                                    <div className="absolute bottom-0 left-[60px] h-3 w-px bg-white/10" />
                                    <div className="absolute bottom-0 left-[90px] h-1.5 w-px bg-white/10" />
                                </div>
                            ))}
                        </div>

                        {/* Green Region Header (Glossy Glass) */}
                        <div className="h-5 absolute top-8 left-0 right-0 bg-[#7ED321]/30 backdrop-blur-sm border-b border-[#7ED321]/50 flex items-center px-4 z-20 shadow-[0_2px_10px_rgba(126,211,33,0.1)]">
                            <span className="text-[9px] font-black text-[#A4ECA1] flex items-center gap-2 tracking-[0.2em] uppercase">
                                <Play size={10} fill="currentColor" /> REGION: HARP_BOLERO_01
                            </span>
                        </div>

                        {/* Playhead line (Liquid Neon) */}
                        <div className="absolute top-0 bottom-0 left-[480px] w-[2px] bg-white z-[45] shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white absolute -top-1 -left-[5px]" />
                        </div>

                        {/* Advanced MIDI Notes (3D Glass Style) */}
                        {[
                            { t: 120, l: 30, w: 200, color: 'bg-[#F29F94]', border: 'border-[#D04033]' },
                            { t: 288, l: 10, w: 40, color: 'bg-[#ED6255]', border: 'border-[#C52013]' },
                            { t: 276, l: 60, w: 120, color: 'bg-[#F29F94]', border: 'border-[#D04033]' },
                            { t: 264, l: 200, w: 80, color: 'bg-[#E2A04A]', border: 'border-[#A05D17]' },
                            { t: 240, l: 320, w: 150, color: 'bg-[#4A90E2]', border: 'border-[#2A60A2]' },
                            { t: 300, l: 500, w: 60, color: 'bg-[#D6D657]', border: 'border-[#A8A811]' },
                            { t: 216, l: 600, w: 90, color: 'bg-[#FF6B00]', border: 'border-[#CC5500]' },
                            { t: 312, l: 720, w: 110, color: 'bg-[#ED6255]', border: 'border-[#C52013]' },
                        ].map((note, idx) => (
                            <div
                                key={idx}
                                className={`absolute rounded-[2px] shadow-lg flex items-center overflow-hidden hover:scale-y-110 active:scale-95 transition-all cursor-pointer group select-none ${note.color} ${note.border} border`}
                                style={{ top: `${note.t}px`, left: `${note.l}px`, width: `${note.w}px`, height: '10px' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                                <div className="ml-1 w-1 h-1 rounded-full bg-white/50 opacity-0 group-hover:opacity-100" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
