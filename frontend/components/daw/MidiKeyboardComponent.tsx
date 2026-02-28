'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MidiMessage, midiEngine } from '@/lib/midi/MidiEngine';
import { Settings2 } from 'lucide-react';
import { midiDeviceManager, MidiInputDef } from '@/lib/midi/MidiDeviceManager';

/**
 * Da Graba Studio — MIDI Keyboard Component
 * =========================================
 * Inspired by JUCE MidiKeyboardComponent.
 * Acts as an on-screen source of MIDI messages and visually responds
 * to internal/external MIDI notes routed through the MidiEngine.
 */

// Simple 2-octave layout starting at C3 (MIDI 48)
const START_NOTE = 48;
const NUM_KEYS = 25;

const isBlackKey = (note: number) => {
    const semitone = note % 12;
    return [1, 3, 6, 8, 10].includes(semitone);
};

export function MidiKeyboardComponent() {
    const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
    const [volume, setVolume] = useState(100);

    // Visual feedback from external/internal MIDI engine
    useEffect(() => {
        const handleMidi = (msg: MidiMessage) => {
            if (msg.isNoteOn()) {
                setActiveNotes(prev => new Set(prev).add(msg.getNoteNumber()));
            } else if (msg.isNoteOff()) {
                setActiveNotes(prev => {
                    const next = new Set(prev);
                    next.delete(msg.getNoteNumber());
                    return next;
                });
            } else if (msg.isAllNotesOff() || msg.isAllSoundOff()) {
                setActiveNotes(new Set());
            }
        };

        midiEngine.addListener(handleMidi);
        return () => midiEngine.removeListener(handleMidi);
    }, []);

    // Mouse interactions
    const handleMouseNoteOn = useCallback((note: number) => {
        midiEngine.sendImmediate(MidiMessage.noteOn(1, note, volume));
        // We don't need to manually update activeNotes here, 
        // because the engine listener above handles it! Awesome architecture.
    }, [volume]);

    const handleMouseNoteOff = useCallback((note: number) => {
        midiEngine.sendImmediate(MidiMessage.noteOff(1, note, 0));
    }, []);

    // Render keys
    const keys = [];
    let whiteIndex = 0;

    for (let i = 0; i < NUM_KEYS; i++) {
        const note = START_NOTE + i;
        const _isBlack = isBlackKey(note);
        const isActive = activeNotes.has(note);

        if (_isBlack) {
            keys.push(
                <div
                    key={note}
                    onMouseDown={() => handleMouseNoteOn(note)}
                    onMouseUp={() => handleMouseNoteOff(note)}
                    onMouseLeave={() => { if (isActive) handleMouseNoteOff(note); }}
                    className={`absolute z-10 w-6 h-24 border border-black/80 rounded-b shadow-[0_4px_10px_rgba(0,0,0,0.5)] cursor-pointer select-none transition-all duration-75`}
                    style={{
                        left: `${whiteIndex * 36 - 12}px`,
                        background: isActive ? '#FF6B00' : 'linear-gradient(180deg, #333 0%, #111 100%)',
                    }}
                />
            );
        } else {
            keys.push(
                <div
                    key={note}
                    onMouseDown={() => handleMouseNoteOn(note)}
                    onMouseUp={() => handleMouseNoteOff(note)}
                    onMouseLeave={() => { if (isActive) handleMouseNoteOff(note); }}
                    className={`absolute z-0 w-9 h-36 border border-[#222] rounded-b shadow-[0_4px_10px_rgba(0,0,0,0.3)] cursor-pointer select-none transition-all duration-75 flex items-end justify-center pb-2`}
                    style={{
                        left: `${whiteIndex * 36}px`,
                        background: isActive ? '#FF8C00' : 'linear-gradient(180deg, #FFF 0%, #DDD 100%)',
                    }}
                >
                    <span className={`text-[8px] font-bold ${isActive ? 'text-black/60' : 'text-black/30'}`}>
                        {MidiMessage.getMidiNoteName(note)}
                    </span>
                </div>
            );
            whiteIndex++;
        }
    }

    return (
        <div className="flex flex-col gap-2 p-2 bg-[#1A1A1A] border border-white/10 rounded-lg w-fit">
            <div className="flex items-center justify-between px-2">
                <span className="text-[9px] font-black tracking-widest text-[#888] uppercase flex items-center gap-1">
                    <Settings2 size={10} />
                    Virtual Keyboard
                </span>

                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-[#666]">VEL:</span>
                    <input
                        type="range" min="1" max="127"
                        value={volume} onChange={e => setVolume(Number(e.target.value))}
                        className="w-20 h-1 accent-[#FF6B00] bg-white/10 rounded-full appearance-none"
                    />
                </div>
            </div>

            <div className="relative h-36 mt-1" style={{ width: `${whiteIndex * 36}px` }}>
                {keys}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Da Graba Studio — MIDI Input Selector
 * Dropdown to select the active hardware MIDI input device.
 */
export function MidiInputSelector() {
    const [inputs, setInputs] = useState<MidiInputDef[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const handleDeviceChange = (inps: MidiInputDef[], currentId: string | null) => {
            setInputs(inps);
            setActiveId(currentId);
        };

        // Initialize Web MIDI on mount, then register listener
        midiDeviceManager.initialize().then(() => {
            midiDeviceManager.addListener(handleDeviceChange);
            // Auto-connect if none is selected
            if (!activeId) midiDeviceManager.autoConnect();
        });

        return () => midiDeviceManager.removeListener(handleDeviceChange);
    }, [activeId]);

    return (
        <div className="flex items-center gap-2">
            <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">MIDI IN</span>
            <select
                className="bg-black/40 border border-white/10 text-white/70 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded outline-none"
                value={activeId || ''}
                onChange={(e) => midiDeviceManager.setActiveInput(e.target.value)}
            >
                <option value="" disabled>No Device Selected</option>
                {inputs.map(input => (
                    <option key={input.id} value={input.id}>{input.name}</option>
                ))}
            </select>
        </div>
    );
}
