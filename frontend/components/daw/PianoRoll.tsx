import React from 'react';
import {
    Settings2, Play, MousePointer2, Scissors, PenTool,
    Eraser, Volume2, Maximize2, Crosshair, ArrowRightLeft,
    Link2, Navigation, Focus, X
} from 'lucide-react';
import { useDAWStore } from '@/store/useDAWStore';
import { midiEngine, MidiMessage } from '@/lib/midi/MidiEngine';

export interface MidiNote {
    id: string;
    midi: number;
    start: number; // in ticks (e.g. 1920 = 1 bar)
    duration: number; // in ticks
    velocity: number;
}

const TICKS_PER_BEAT = 480;
const INITIAL_NOTES: MidiNote[] = [
    { id: '1', midi: 72, start: 0, duration: 480, velocity: 100 },
    { id: '2', midi: 74, start: 480, duration: 480, velocity: 90 },
    { id: '3', midi: 76, start: 960, duration: 480, velocity: 110 },
];

export function PianoRoll() {
    const setActiveBottomPanel = useDAWStore((state) => state.setActiveBottomPanel);
    const [activeNotes, setActiveNotes] = React.useState<Set<number>>(new Set());
    const [notes, setNotes] = React.useState<MidiNote[]>(INITIAL_NOTES);
    const [selectedNoteIds, setSelectedNoteIds] = React.useState<Set<string>>(new Set());
    const [activeTool, setActiveTool] = React.useState<'pointer' | 'pen' | 'eraser' | 'scissors'>('pointer');
    const [snapValue, setSnapValue] = React.useState('1/16');
    const [clipboard, setClipboard] = React.useState<MidiNote[]>([]);

    // Interaction State
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0, notes: [] as MidiNote[] });
    const [selectionBox, setSelectionBox] = React.useState<{ x: number, y: number, w: number, h: number } | null>(null);

    const TICKS_PER_PIXEL = 16;
    const ROW_HEIGHT = 12;

    // MIDI Engine Listener: Connect to global MIDI messages for visual feedback
    React.useEffect(() => {
        const handleMidi = (msg: MidiMessage) => {
            if (msg.isNoteOn()) {
                const midi = msg.getNoteNumber();
                setActiveNotes(prev => new Set([...prev, midi]));
            } else if (msg.isNoteOff()) {
                const midi = msg.getNoteNumber();
                setActiveNotes(prev => {
                    const next = new Set(prev);
                    next.delete(midi);
                    return next;
                });
            }
        };

        midiEngine.addListener(handleMidi);
        return () => midiEngine.removeListener(handleMidi);
    }, []);

    // Actions
    const handleDelete = React.useCallback(() => {
        setNotes(prev => prev.filter(n => !selectedNoteIds.has(n.id)));
        setSelectedNoteIds(new Set());
    }, [selectedNoteIds]);

    const handleCopy = React.useCallback(() => {
        const toCopy = notes.filter(n => selectedNoteIds.has(n.id));
        setClipboard(toCopy);
    }, [notes, selectedNoteIds]);

    const handlePaste = React.useCallback(() => {
        if (clipboard.length === 0) return;
        const newNotes = clipboard.map(n => ({
            ...n,
            id: `n-${Date.now()}-${Math.random()}`,
            start: n.start + 480 // Paste shifted by 1 beat for visibility
        }));
        setNotes(prev => [...prev, ...newNotes]);
    }, [clipboard]);

    const handleSelectAll = React.useCallback(() => {
        setSelectedNoteIds(new Set(notes.map(n => n.id)));
    }, [notes]);

    // Keyboard shortcuts
    React.useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Backspace' || e.key === 'Delete') handleDelete();
            if (e.metaKey || e.ctrlKey) {
                if (e.key === 'c') handleCopy();
                if (e.key === 'v') handlePaste();
                if (e.key === 'a') {
                    e.preventDefault();
                    handleSelectAll();
                }
                if (e.key === 'd') {
                    e.preventDefault();
                    handleCopy();
                    handlePaste();
                }
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleDelete, handleCopy, handlePaste, handleSelectAll]);

    // Helper to send MIDI when clicking keys
    const playPreviewNote = (midi: number, isNoteOn: boolean) => {
        if (isNoteOn) {
            midiEngine.sendImmediate(MidiMessage.noteOn(1, midi, 100));
            setActiveNotes(prev => new Set([...prev, midi]));
        } else {
            midiEngine.sendImmediate(MidiMessage.noteOff(1, midi, 0));
            setActiveNotes(prev => {
                const next = new Set(prev);
                next.delete(midi);
                return next;
            });
        }
    };

    // Generate 4 octaves of keys
    const keys = Array.from({ length: 48 }, (_, i) => {
        const midi = 48 + i; // Start from C2 (MIDI 48)
        const noteIndex = midi % 12;
        const isBlack = [1, 3, 6, 8, 10].includes(noteIndex);
        const noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][noteIndex];
        const octave = Math.floor(midi / 12) - 1;
        return { id: i, midi, isBlack, noteName, octave, isC: noteIndex === 0 };
    });

    const divisorMap: Record<string, number> = { '1/4': 480, '1/8': 240, '1/16': 120, '1/32': 60, '1/64': 30, '1/128': 15 };

    return (
        <div className="w-full h-full bg-[#1E1E22] flex flex-col border-t border-black/40 shadow-[0_-20px_60px_rgba(0,0,0,0.6)] font-sans relative">

            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#111] bg-[#2D2D32] shrink-0 shadow-lg z-30">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <div className="relative group">
                            <button className="px-2.5 py-1 text-[11px] font-bold text-[#AAA] hover:text-white bg-transparent hover:bg-white/5 rounded transition-all">Edit</button>
                            <div className="absolute top-full left-0 mt-1 w-40 bg-[#2D2D32] border border-black shadow-xl hidden group-hover:block z-50 rounded-md py-1">
                                <button onClick={handleSelectAll} className="w-full text-left px-4 py-2 text-[10px] text-[#AAA] hover:text-white hover:bg-white/5 transition-colors">Select All (Cmd+A)</button>
                                <button onClick={handleCopy} className="w-full text-left px-4 py-2 text-[10px] text-[#AAA] hover:text-white hover:bg-white/5 transition-colors">Copy (Cmd+C)</button>
                                <button onClick={handlePaste} className="w-full text-left px-4 py-2 text-[10px] text-[#AAA] hover:text-white hover:bg-white/5 transition-colors">Paste (Cmd+V)</button>
                                <div className="h-px bg-black/20 my-1" />
                                <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-colors">Delete (Backspace)</button>
                            </div>
                        </div>
                        <button className="px-2.5 py-1 text-[11px] font-bold text-[#AAA] hover:text-white bg-transparent hover:bg-white/5 rounded transition-all">Functions</button>
                        <button className="px-2.5 py-1 text-[11px] font-bold text-[#AAA] hover:text-white bg-transparent hover:bg-white/5 rounded transition-all">View</button>
                    </div>

                    <div className="w-px h-6 bg-black/30 mx-1" />

                    <div className="flex items-center gap-1.5 p-1 bg-black/20 rounded-md border border-white/5">
                        <button onClick={() => setActiveTool('pointer')} className={`p-1.5 px-3 rounded transition-all ${activeTool === 'pointer' ? 'text-[#4A90E2] bg-[#1A1A1C] border border-white/10' : 'text-[#888] hover:text-white'}`}><MousePointer2 size={13} /></button>
                        <button onClick={() => setActiveTool('pen')} className={`p-1.5 px-3 rounded transition-all ${activeTool === 'pen' ? 'text-[#4A90E2] bg-[#1A1A1C] border border-white/10' : 'text-[#888] hover:text-white'}`}><PenTool size={13} /></button>
                        <button onClick={() => setActiveTool('eraser')} className={`p-1.5 px-3 rounded transition-all ${activeTool === 'eraser' ? 'text-[#4A90E2] bg-[#1A1A1C] border border-white/10' : 'text-[#888] hover:text-white'}`}><Eraser size={13} /></button>
                        <button onClick={() => setActiveTool('scissors')} className={`p-1.5 px-3 rounded transition-all ${activeTool === 'scissors' ? 'text-[#4A90E2] bg-[#1A1A1C] border border-white/10' : 'text-[#888] hover:text-white'}`}><Scissors size={13} /></button>
                    </div>

                    <div className="w-px h-6 bg-black/30 mx-1" />

                    <div className="flex items-center gap-2">
                        <button className="p-2 text-[#666] hover:text-white bg-black/20 rounded border border-white/5"><Navigation size={12} className="rotate-45" /></button>
                        <button className="p-2 text-orange-400 bg-orange-400/10 rounded border border-orange-400/20 shadow-[0_0_10px_rgba(251,146,60,0.1)]"><Link2 size={12} /></button>
                    </div>
                </div>

                <div className="flex bg-black/40 rounded-lg border border-white/5 p-1 shadow-inner ring-1 ring-black/50">
                    <button className="px-8 py-1 text-[10px] font-black tracking-widest text-white bg-gradient-to-b from-[#4A6B9C] to-[#3A5B8C] rounded shadow-[0_1px_3px_rgba(0,0,0,0.4)] ring-1 ring-white/10 uppercase">Piano Roll</button>
                    <button className="px-8 py-1 text-[10px] font-black tracking-widest text-[#666] hover:text-white transition-all uppercase">Score</button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-[#555] tracking-widest uppercase">Position</span>
                        <div className="text-[11px] font-mono text-[#4A90E2] bg-black/20 px-2 rounded">5 1 1 1</div>
                    </div>

                    <div className="flex items-center gap-3 bg-black/20 px-3 py-1 rounded border border-white/5">
                        <span className="text-[9px] font-black text-[#555] uppercase tracking-widest">Snap</span>
                        <select
                            value={snapValue}
                            onChange={(e) => setSnapValue(e.target.value)}
                            className="bg-transparent border-none text-[11px] font-bold text-[#AAA] outline-none cursor-pointer hover:text-white transition-colors"
                        >
                            {Object.keys(divisorMap).map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>

                    <button onClick={() => setActiveBottomPanel('closed')} className="p-1 px-3 ml-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-md border border-white/5 transition-all"><X size={14} /></button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative bg-[#1E1E22]">
                {/* Left Inspector */}
                <div className="w-[200px] bg-[#26262A] border-r border-black flex flex-col shrink-0 z-20 shadow-xl">
                    <div className="p-4 border-b border-black/40 bg-[#1A1A1D]">
                        <div className="text-[11px] font-black tracking-widest text-[#E0E0E0] uppercase flex items-center gap-2"><Focus size={12} className="text-[#4A90E2]" /> INSPECTOR</div>
                    </div>
                    <div className="p-4 space-y-6">
                        <div className="space-y-2">
                            <div className="text-[10px] font-black tracking-widest text-[#666] uppercase">Time Quantize</div>
                            <div className="flex rounded-md border border-black overflow-hidden shadow-lg">
                                <select value={snapValue} onChange={(e) => setSnapValue(e.target.value)} className="flex-1 bg-[#111] text-[11px] text-[#AAA] py-2 px-3 outline-none">
                                    {Object.keys(divisorMap).map(v => <option key={v} value={v}>{v} Note</option>)}
                                </select>
                                <button onClick={() => {
                                    const divisor = divisorMap[snapValue] || 120;
                                    setNotes(prev => prev.map(n => selectedNoteIds.has(n.id) ? { ...n, start: Math.round(n.start / divisor) * divisor } : n));
                                }} className="bg-[#4A90E2] text-white px-3 text-[11px] font-black border-l border-black">Q</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 overflow-y-auto overflow-x-auto relative custom-scrollbar">
                    {/* Vertical Keys */}
                    <div className="w-[60px] flex flex-col-reverse bg-[#EAEAEA] border-r border-black sticky left-0 z-30 shrink-0">
                        {keys.map((key) => {
                            const isActive = activeNotes.has(key.midi);
                            return (
                                <div
                                    key={key.id}
                                    onPointerDown={() => playPreviewNote(key.midi, true)}
                                    onPointerUp={() => playPreviewNote(key.midi, false)}
                                    className={`w-full relative flex flex-col justify-end items-center pr-1 border-b border-black/10 transition-colors duration-75 cursor-pointer h-[${ROW_HEIGHT}px] ${key.isBlack
                                        ? `${isActive ? 'bg-orange-400' : 'bg-gradient-to-r from-[#111] to-[#333]'} border-black z-20 shadow-md rounded-r-sm`
                                        : `${isActive ? 'bg-orange-300' : 'bg-gradient-to-r from-[#F0F0F0] to-[#E0E0E0]'} border-[#BBB]`
                                        }`}
                                    style={{ height: `${ROW_HEIGHT}px`, width: key.isBlack ? '70%' : '100%' }}
                                >
                                    {key.isC && !key.isBlack && <span className="text-[9px] font-black text-[#888] absolute right-1 bottom-0.5 opacity-60">{key.noteName}{key.octave}</span>}
                                </div>
                            );
                        })}
                    </div>

                    <div
                        className="flex-1 relative bg-[#26262A] min-w-[3000px] overflow-hidden"
                        onMouseDown={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;

                            if (activeTool === 'pen') {
                                const gridHeight = e.currentTarget.scrollHeight;
                                const keyIdx = keys.length - 1 - Math.floor(y / ROW_HEIGHT);
                                const midi = keys[keyIdx]?.midi;
                                if (midi) {
                                    const divisor = divisorMap[snapValue] || 120;
                                    const start = Math.floor((x * TICKS_PER_PIXEL) / divisor) * divisor;
                                    const newNote: MidiNote = { id: `n-${Date.now()}`, midi, start, duration: divisor, velocity: 100 };
                                    setNotes(prev => [...prev, newNote]);
                                    setSelectedNoteIds(new Set([newNote.id]));
                                    playPreviewNote(midi, true);
                                    setTimeout(() => playPreviewNote(midi, false), 200);
                                }
                            } else if (activeTool === 'eraser') {
                                const clickedNote = notes.find(n => {
                                    const nLeft = n.start / TICKS_PER_PIXEL;
                                    const nTop = (keys.length - 1 - (n.midi - 48)) * ROW_HEIGHT;
                                    const nWidth = n.duration / TICKS_PER_PIXEL;
                                    return x >= nLeft && x <= nLeft + nWidth && y >= nTop && y <= nTop + ROW_HEIGHT;
                                });
                                if (clickedNote) setNotes(prev => prev.filter(n => n.id !== clickedNote.id));
                            } else if (activeTool === 'pointer') {
                                const clickedNote = notes.find(n => {
                                    const nLeft = n.start / TICKS_PER_PIXEL;
                                    const nTop = (keys.length - 1 - (n.midi - 48)) * ROW_HEIGHT;
                                    const nWidth = n.duration / TICKS_PER_PIXEL;
                                    return x >= nLeft && x <= nLeft + nWidth && y >= nTop && y <= nTop + ROW_HEIGHT;
                                });

                                if (clickedNote) {
                                    if (!selectedNoteIds.has(clickedNote.id)) {
                                        if (e.shiftKey) setSelectedNoteIds(prev => new Set(prev).add(clickedNote.id));
                                        else setSelectedNoteIds(new Set([clickedNote.id]));
                                    }
                                    setIsDragging(true);
                                    setDragStart({ x, y, notes: notes.filter(n => selectedNoteIds.has(n.id) || n.id === clickedNote.id) });
                                } else {
                                    setSelectedNoteIds(new Set());
                                    setSelectionBox({ x, y, w: 0, h: 0 });
                                }
                            }
                        }}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;

                            if (isDragging) {
                                const dx = x - dragStart.x;
                                const dy = y - dragStart.y;
                                const tickDelta = dx * TICKS_PER_PIXEL;
                                const semiDelta = -Math.round(dy / ROW_HEIGHT);
                                const divisor = divisorMap[snapValue] || 120;

                                setNotes(prev => prev.map(n => {
                                    const orig = dragStart.notes.find(on => on.id === n.id);
                                    if (orig) {
                                        return {
                                            ...n,
                                            start: Math.max(0, Math.floor((orig.start + tickDelta) / divisor) * divisor),
                                            midi: Math.max(48, Math.min(95, orig.midi + semiDelta))
                                        };
                                    }
                                    return n;
                                }));
                            } else if (selectionBox) {
                                setSelectionBox(prev => prev ? { ...prev, w: x - prev.x, h: y - prev.y } : null);
                                const box = { x1: Math.min(selectionBox.x, x), y1: Math.min(selectionBox.y, y), x2: Math.max(selectionBox.x, x), y2: Math.max(selectionBox.y, y) };
                                const newlySelected = notes.filter(n => {
                                    const nLeft = n.start / TICKS_PER_PIXEL;
                                    const nTop = (keys.length - 1 - (n.midi - 48)) * ROW_HEIGHT;
                                    const nWidth = n.duration / TICKS_PER_PIXEL;
                                    return nLeft + nWidth >= box.x1 && nLeft <= box.x2 && nTop + ROW_HEIGHT >= box.y1 && nTop <= box.y2;
                                }).map(n => n.id);
                                setSelectedNoteIds(new Set(newlySelected));
                            }
                        }}
                        onMouseUp={() => { setIsDragging(false); setSelectionBox(null); }}
                    >
                        {/* Grid Lines */}
                        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)', backgroundSize: `100% ${ROW_HEIGHT}px, 30px 100%, 120px 100%` }} />

                        {/* Notes */}
                        {notes.map((note) => {
                            const left = note.start / TICKS_PER_PIXEL;
                            const width = note.duration / TICKS_PER_PIXEL;
                            const top = (keys.length - 1 - (note.midi - 48)) * ROW_HEIGHT;
                            const isSelected = selectedNoteIds.has(note.id);
                            return (
                                <div key={note.id} className={`absolute rounded-[2px] shadow-lg border ${isSelected ? 'ring-2 ring-white border-white z-50' : 'border-black/30'} ${note.midi % 12 === 0 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ top: `${top}px`, left: `${left}px`, width: `${width}px`, height: '10px' }} />
                            );
                        })}

                        {/* Selection Marquee */}
                        {selectionBox && <div className="absolute bg-blue-500/20 border border-blue-500 z-[60] pointer-events-none" style={{ left: Math.min(selectionBox.x, selectionBox.x + selectionBox.w), top: Math.min(selectionBox.y, selectionBox.y + selectionBox.h), width: Math.abs(selectionBox.w), height: Math.abs(selectionBox.h) }} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
