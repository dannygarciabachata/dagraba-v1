'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Scissors, MousePointer2 } from 'lucide-react';
import { audioEngine } from '@/lib/audio-engine-bridge';
import { useDAWStore } from '@/store/useDAWStore';

interface AudioClip {
    id: string;
    trackId: string;
    startTime: number; // in seconds
    duration: number; // in seconds
    color: string;
    name: string;
}

export function AudioTimeline() {
    const tracks = useDAWStore((state) => state.tracks);

    if (tracks.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 bg-white/5 animate-pulse">
                    <div className="w-4 h-4 rounded-full bg-cyan-glow shadow-[0_0_10px_#00F0FF]" />
                </div>
                <h3 className="text-white font-bold tracking-widest text-sm mb-2 uppercase">Espacio de Trabajo Limpio</h3>
                <p className="text-silver-dark text-xs max-w-xs leading-relaxed">
                    Dile a John en el chat qué quieres crear y él abrirá los tracks mágicamente...
                </p>
            </div>
        );
    }

    const [isPlaying, setIsPlaying] = useState(false);
    const [playhead, setPlayhead] = useState(0); // seconds
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);

    // Timeline scale (pixels per second)
    const pixelsPerSecond = 50;
    const timelineDuration = 180; // 3 minutes total for now
    const timelineWidth = timelineDuration * pixelsPerSecond;

    // Mock clips for visualization
    const [clips, setClips] = useState<AudioClip[]>([
        { id: 'c1', trackId: 't1', startTime: 5, duration: 15, color: '#00F0FF', name: 'vocal_take_1.wav' },
        { id: 'c2', trackId: 't2', startTime: 0, duration: 60, color: '#FF6B00', name: 'beat_render.wav' },
    ]);

    const [draggingClip, setDraggingClip] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState(0);

    // --- Playhead Animation Loop ---
    const loop = () => {
        if (isPlaying) {
            setPlayhead(audioEngine.getPlayheadPosition());
        }
        animationRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(loop);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying]);

    const togglePlay = () => {
        if (isPlaying) {
            audioEngine.pause();
            setIsPlaying(false);
        } else {
            audioEngine.play();
            setIsPlaying(true);
        }
    };

    // --- Drag and Drop Logic ---
    const handleMouseDown = (e: React.MouseEvent, clip: AudioClip) => {
        e.stopPropagation();
        setDraggingClip(clip.id);

        // Calculate where inside the clip we clicked (in pixels)
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        setDragOffset(offsetX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingClip || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();

        // Calculate new X position relative to container, accounting for scroll
        const newX = e.clientX - containerRect.left + containerRef.current.scrollLeft - dragOffset;

        // Convert X pixels back to seconds
        const newStartTime = Math.max(0, newX / pixelsPerSecond);

        setClips(prev => prev.map(c =>
            c.id === draggingClip ? { ...c, startTime: newStartTime } : c
        ));
    };

    const handleMouseUp = () => {
        if (draggingClip) {
            // Inform the engine of the final move
            const clip = clips.find(c => c.id === draggingClip);
            if (clip) {
                audioEngine.moveAudioClip(clip.id, clip.startTime);
            }
            setDraggingClip(null);
        }
    };

    // --- Timeline Click (Move Playhead) ---
    const handleTimelineClick = (e: React.MouseEvent) => {
        if (!containerRef.current || draggingClip) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - containerRect.left + containerRef.current.scrollLeft;
        const newTime = clickX / pixelsPerSecond;

        audioEngine.setPlayheadPosition(newTime);
        setPlayhead(newTime);
    };

    // --- Waveform Rendering ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        clips.forEach(clip => {
            const x = clip.startTime * pixelsPerSecond;
            const width = clip.duration * pixelsPerSecond;

            // Get mock waveform from engine
            const waveform = audioEngine.getWaveformData(clip.id, Math.floor(width));

            ctx.beginPath();
            ctx.strokeStyle = clip.color;
            ctx.lineWidth = 1.5;
            ctx.moveTo(x, 25); // Center line (assuming 50px height track)

            for (let i = 0; i < width; i++) {
                // Waveform values are 0-1, map to -20 to 20 pixels amplitude
                const amplitude = (waveform[i] - 0.5) * 40;
                ctx.lineTo(x + i, 25 + amplitude);
            }
            ctx.stroke();
        });

    }, [clips, pixelsPerSecond]);


    return (
        <div className="flex flex-col w-full h-full bg-[#18181A] border border-[#222] shadow-[inset_0_5px_20px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden font-mono select-none">

            {/* Toolbar */}
            <div className="h-10 border-b border-[#222] bg-[#111113] flex items-center px-4 gap-4 shadow-sm z-20 relative">
                <button onClick={togglePlay} className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${isPlaying ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow' : 'hover:bg-[#222] text-[#AAA]'}`}>
                    {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                </button>

                <div className="w-px h-4 bg-[#333]" />

                <div className="flex gap-1">
                    <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#222] text-[#AAA] active:text-cyan-glow">
                        <MousePointer2 size={14} />
                    </button>
                    <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-[#222] text-[#AAA] active:text-red-500">
                        <Scissors size={14} />
                    </button>
                </div>

                <div className="ml-auto text-cyan-glow text-xs font-bold tracking-widest bg-black px-3 py-1 rounded shadow-inner border border-[#222]">
                    {Math.floor(playhead / 60).toString().padStart(2, '0')}:
                    {Math.floor(playhead % 60).toString().padStart(2, '0')}.
                    {Math.floor((playhead % 1) * 100).toString().padStart(2, '0')}
                </div>
            </div>

            {/* Timeline Scrollable Area */}
            <div
                ref={containerRef}
                className="flex-1 overflow-auto relative cursor-text"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleTimelineClick}
            >
                {/* The sprawling timeline width */}
                <div style={{ width: `${timelineWidth}px`, height: '100%' }} className="relative bg-[#1A1A1C]">

                    {/* Time Ruler (Seconds) */}
                    <div className="absolute top-0 left-0 w-full h-6 border-b border-[#2A2A2D] bg-[#111] opacity-90 z-10 flex">
                        {Array.from({ length: timelineDuration }).map((_, i) => (
                            <div key={`ruler-${i}`} className="h-full border-l border-[#333] relative" style={{ width: `${pixelsPerSecond}px` }}>
                                {i % 5 === 0 && <span className="absolute top-1 left-1 text-[8px] text-[#666]">{i}s</span>}
                            </div>
                        ))}
                    </div>

                    {/* Background Grid Lines rendering over tracks */}
                    <div className="absolute top-6 left-0 w-full bottom-0 flex pointer-events-none opacity-20">
                        {Array.from({ length: timelineDuration }).map((_, i) => (
                            <div key={`grid-${i}`} className="h-full border-l border-[#444]" style={{ width: `${pixelsPerSecond}px` }} />
                        ))}
                    </div>

                    {/* Tracks Definition Container */}
                    <div className="absolute top-6 left-0 w-full flex flex-col pt-2 gap-1 pb-4">
                        {tracks.map((track, trackIndex) => (
                            <div key={track.id} className="h-[60px] w-full bg-[#202022] border-y border-[#18181A] relative shadow-inner">
                                {/* Waveform Canvas Layer */}
                                {trackIndex === 0 && (
                                    <canvas
                                        ref={canvasRef}
                                        width={timelineWidth}
                                        height={60}
                                        className="absolute inset-0 pointer-events-none opacity-60 mix-blend-screen"
                                        style={{ top: 0 }}
                                    />
                                )}

                                {/* Clips Interaction Layer */}
                                {clips.filter(c => c.trackId === track.id).map(clip => (
                                    <div
                                        key={clip.id}
                                        onMouseDown={(e) => handleMouseDown(e, clip)}
                                        className={`absolute top-1 bottom-1 rounded-sm border-2 cursor-grab active:cursor-grabbing backdrop-blur-sm transition-shadow ${draggingClip === clip.id ? 'z-20 shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-white/80' : 'z-10 shadow-sm'}`}
                                        style={{
                                            left: `${clip.startTime * pixelsPerSecond}px`,
                                            width: `${clip.duration * pixelsPerSecond}px`,
                                            backgroundColor: `${clip.color}20`,
                                            borderColor: `${clip.color}80`
                                        }}
                                    >
                                        <div className="bg-[#111]/80 px-1 py-0.5 text-[8px] truncate text-[#AAA] rounded-br-sm inline-block max-w-full">
                                            {clip.name}
                                        </div>
                                        <div className="absolute top-0 left-0 w-2 h-2 bg-white/50 clip-path-triangle-tl opacity-0 hover:opacity-100 transition-opacity cursor-ew-resize" />
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-white/50 clip-path-triangle-tr opacity-0 hover:opacity-100 transition-opacity cursor-ew-resize" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                </div>

                {/* Playhead Marker */}
                <div
                    className="absolute top-0 bottom-0 w-px bg-yellow-400 z-30 pointer-events-none shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                    style={{ left: `${playhead * pixelsPerSecond}px` }}
                >
                    <div className="absolute -top-1 -left-1.5 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-yellow-400" />
                </div>

            </div>
        </div>
    );
}
