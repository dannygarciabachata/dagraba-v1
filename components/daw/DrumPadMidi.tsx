'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MidiMessage, midiEngine } from '@/lib/midi/MidiEngine';
import { Drum, Volume2, Activity } from 'lucide-react';

/**
 * Drum Pad MIDI Controller
 * Based on the JUCE MidiMessage tutorial — creates NoteOn/NoteOff messages
 * on MIDI channel 10 for General MIDI drum sounds.
 */

interface PadDef {
    label: string;
    note: number;
    color: string;
    shortcut: string;
}

const DRUM_PADS: PadDef[] = [
    { label: 'KICK', note: 36, color: '#FF3333', shortcut: 'Q' },
    { label: 'SNARE', note: 38, color: '#33AAFF', shortcut: 'W' },
    { label: 'HI-HAT', note: 42, color: '#FFD700', shortcut: 'E' },
    { label: 'OPEN HH', note: 46, color: '#FF8C00', shortcut: 'R' },
    { label: 'CRASH', note: 49, color: '#FF00FF', shortcut: 'A' },
    { label: 'RIDE', note: 51, color: '#00FFAA', shortcut: 'S' },
    { label: 'TOM HI', note: 48, color: '#8855FF', shortcut: 'D' },
    { label: 'TOM LO', note: 45, color: '#FF5588', shortcut: 'F' },
    { label: 'CLAP', note: 39, color: '#00CCFF', shortcut: 'Z' },
    { label: 'COWBELL', note: 56, color: '#FFAA00', shortcut: 'X' },
    { label: 'RIMSHOT', note: 37, color: '#99FF33', shortcut: 'C' },
    { label: 'SHAKER', note: 70, color: '#FF6699', shortcut: 'V' },
];

const MIDI_CHANNEL = 10;

export function DrumPadMidi() {
    const [activePads, setActivePads] = useState<Set<number>>(new Set());
    const [midiLog, setMidiLog] = useState<string[]>([]);
    const [volume, setVolume] = useState(100);
    const logRef = useRef<HTMLDivElement>(null);

    // Handle pad trigger
    const triggerPad = useCallback((noteNumber: number) => {
        // Create NoteOn
        const noteOn = MidiMessage.noteOn(MIDI_CHANNEL, noteNumber, volume);
        midiEngine.sendImmediate(noteOn);

        // Schedule NoteOff 100ms later
        const noteOff = MidiMessage.noteOff(MIDI_CHANNEL, noteNumber);
        noteOff.setTimeStamp(midiEngine.getCurrentTime() + 0.1);
        midiEngine.scheduleEvent(noteOff);

        // Visual feedback
        setActivePads(prev => new Set(prev).add(noteNumber));
        setTimeout(() => {
            setActivePads(prev => {
                const next = new Set(prev);
                next.delete(noteNumber);
                return next;
            });
        }, 120);

        // Update log
        setMidiLog(prev => {
            const entry = `${noteOn.getTimecodeString()} - ${noteOn.getDescription()}`;
            const next = [entry, ...prev];
            return next.slice(0, 30);
        });
    }, [volume]);

    // Volume CC handler
    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setVolume(val);
        const cc = MidiMessage.controllerEvent(MIDI_CHANNEL, 7, val);
        midiEngine.sendImmediate(cc);
        setMidiLog(prev => [`${cc.getTimecodeString()} - ${cc.getDescription()}`, ...prev].slice(0, 30));
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const pad = DRUM_PADS.find(p => p.shortcut === e.key.toUpperCase());
            if (pad && !e.repeat) triggerPad(pad.note);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [triggerPad]);

    // Start MIDI scheduler
    useEffect(() => {
        midiEngine.start();
        return () => midiEngine.stop();
    }, []);

    return (
        <div className="flex gap-4 w-full h-full">
            {/* Pad Grid */}
            <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                    <Drum size={14} className="text-cyan-400" />
                    <span className="text-[10px] font-black tracking-widest text-white/60 uppercase">
                        MIDI Drum Pads · CH{MIDI_CHANNEL}
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {DRUM_PADS.map(pad => {
                        const isActive = activePads.has(pad.note);
                        return (
                            <button
                                key={pad.note}
                                onMouseDown={() => triggerPad(pad.note)}
                                className="relative aspect-square rounded-lg border transition-all duration-75 flex flex-col items-center justify-center gap-1 select-none active:scale-95"
                                style={{
                                    background: isActive
                                        ? `${pad.color}40`
                                        : 'rgba(255,255,255,0.03)',
                                    borderColor: isActive
                                        ? `${pad.color}80`
                                        : 'rgba(255,255,255,0.08)',
                                    boxShadow: isActive
                                        ? `0 0 20px ${pad.color}30, inset 0 0 20px ${pad.color}15`
                                        : 'none',
                                }}
                            >
                                <span
                                    className="text-[10px] font-black tracking-wider"
                                    style={{ color: pad.color }}
                                >
                                    {pad.label}
                                </span>
                                <span className="text-[8px] text-white/20 font-mono">
                                    {pad.shortcut} · {pad.note}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Volume CC7 Slider */}
                <div className="flex items-center gap-3 mt-2 px-1">
                    <Volume2 size={12} className="text-white/30" />
                    <input
                        type="range"
                        min={0}
                        max={127}
                        value={volume}
                        onChange={handleVolumeChange}
                        className="flex-1 h-1 accent-cyan-500 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                    <span className="text-[9px] font-mono text-white/30 w-8 text-right">{volume}</span>
                </div>
            </div>

            {/* MIDI Log */}
            <div className="w-[220px] bg-black/40 border border-white/5 rounded-lg overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 bg-white/3">
                    <Activity size={10} className="text-green-400" />
                    <span className="text-[8px] font-black tracking-widest text-white/40 uppercase">
                        MIDI Monitor
                    </span>
                </div>
                <div
                    ref={logRef}
                    className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5 custom-scrollbar max-h-[200px]"
                >
                    {midiLog.length === 0 ? (
                        <span className="text-[9px] text-white/15 text-center py-8">
                            Press a pad or use keyboard shortcuts...
                        </span>
                    ) : (
                        midiLog.map((entry, i) => (
                            <div
                                key={i}
                                className="text-[8px] font-mono text-white/50 py-0.5 px-1 rounded hover:bg-white/5 transition-colors"
                            >
                                {entry}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
