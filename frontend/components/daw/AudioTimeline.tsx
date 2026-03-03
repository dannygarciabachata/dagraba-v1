import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Trash2, Scissors, MousePointer2, Maximize2, ZoomIn, ZoomOut, Play, Pause, Grid, Layers, ChevronUp, ChevronDown } from 'lucide-react';
import { useDAWStore, AudioClip } from '@/store/useDAWStore';
import { WaveformCanvas } from './WaveformCanvas';
import { audioEngine } from '@/lib/audio-engine-bridge';

const DEFAULT_TRACK_HEIGHT = 64;
const MIN_TRACK_HEIGHT = 28;
const MAX_TRACK_HEIGHT = 180;

/* ─────────────────────── Component ────────────────────────────────────── */
export function AudioTimeline() {
    const tracks = useDAWStore((state) => state.tracks);
    const clips = useDAWStore((state) => state.clips);
    const setClips = useDAWStore((state) => state.setClips);
    const updateClip = useDAWStore((state) => state.updateClip);
    const isPlayingGlobal = useDAWStore((state) => state.isPlaying);

    /* ── Playback Rendering ────────────────────────────────────────── */
    const [playhead, setPlayhead] = useState(0);
    const rafRef = useRef<number | null>(null);
    const [pps, setPps] = useState(60);           // pixels per second
    const trackHeights = useDAWStore((state) => state.trackHeights);
    const setTrackHeight = useDAWStore((state) => state.setTrackHeight);
    const setAllTrackHeights = useDAWStore((state) => state.setAllTrackHeights);

    /* ── Tools & Selection ────────────────────────────────────────── */
    const [activeTool, setActiveTool] = useState<'select' | 'cut'>('select');
    const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
    const selectionRef = useRef<{ start: number; end: number } | null>(null);

    const getH = (id: string) => trackHeights[id] ?? DEFAULT_TRACK_HEIGHT;
    const setH = (id: string, h: number) => setTrackHeight(id, Math.max(MIN_TRACK_HEIGHT, Math.min(MAX_TRACK_HEIGHT, h)));
    const setAllH = (delta: number) => setAllTrackHeights(delta, MIN_TRACK_HEIGHT, MAX_TRACK_HEIGHT);

    const timelineDuration = 240;
    const timelineWidth = timelineDuration * pps;

    /* ── Sync Clips with Engine ───────────────────────────────────── */
    useEffect(() => {
        audioEngine.syncClips(clips);
    }, [clips]);

    /* ── Drag ─────────────────────────────────────────────────────── */
    const [draggingClip, setDraggingClip] = useState<string | null>(null);
    const dragOffsetRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    /* ── RAF loop ─────────────────────────────────────────────────── */
    /* ── Playhead Loop ────────────────────────────────────────────── */
    useEffect(() => {
        const tick = () => {
            setPlayhead(audioEngine.getPlayheadPosition());
            rafRef.current = requestAnimationFrame(tick);
        };
        if (isPlayingGlobal) {
            rafRef.current = requestAnimationFrame(tick);
        } else {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            setPlayhead(audioEngine.getPlayheadPosition());
        }
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isPlayingGlobal]);

    // Removed local play/pause/stopAllAudio functions

    // ── RAZOR / CUT Logic ───────────────────────────────────────────
    const splitClipAtTime = (clipId: string, time: number) => {
        const clip = clips.find(c => c.id === clipId);
        if (!clip || time <= clip.startTime || time >= clip.startTime + clip.duration) return;

        const part1Duration = time - clip.startTime;
        const part2Duration = clip.duration - part1Duration;

        const part1 = { ...clip, duration: part1Duration };
        const part2 = {
            ...clip,
            id: `${clip.id}-split-${Date.now()}`,
            startTime: time,
            duration: part2Duration
        };

        const newClips = clips.filter(c => c.id !== clipId);
        setClips([...newClips, part1, part2]);
    };

    // ── SELECTION DELETE Logic ──────────────────────────────────────
    const deleteSelection = () => {
        if (!selection) return;
        const { start, end } = selection.start < selection.end
            ? { start: selection.start, end: selection.end }
            : { start: selection.end, end: selection.start };

        const newClips: AudioClip[] = [];

        clips.forEach(clip => {
            const clipEnd = clip.startTime + clip.duration;

            // 1. Clip completely inside selection -> delete
            if (clip.startTime >= start && clipEnd <= end) return;

            // 2. Selection completely inside clip -> split into two
            if (clip.startTime < start && clipEnd > end) {
                newClips.push({ ...clip, duration: start - clip.startTime });
                newClips.push({
                    ...clip,
                    id: `${clip.id}-del-split-${Date.now()}`,
                    startTime: end,
                    duration: clipEnd - end
                });
                return;
            }

            // 3. Selection overlaps start of clip -> trim start
            if (start <= clip.startTime && end > clip.startTime) {
                newClips.push({ ...clip, startTime: end, duration: clipEnd - end });
                return;
            }

            // 4. Selection overlaps end of clip -> trim end
            if (start < clipEnd && end >= clipEnd) {
                newClips.push({ ...clip, duration: start - clip.startTime });
                return;
            }

            // 5. No overlap
            newClips.push(clip);
        });

        setClips(newClips);
        setSelection(null);
    };

    // ── QUANTIZE Logic ──────────────────────────────────────────────
    const quantizeAll = () => {
        const bpm = useDAWStore.getState().tempo;
        const beatLength = 60 / bpm;

        const quantizedClips = clips.map(clip => ({
            ...clip,
            startTime: Math.round(clip.startTime / beatLength) * beatLength
        }));
        setClips(quantizedClips);
    };

    /* ── Sync with Global Playback ────────────────────────────────── */

    useEffect(() => {
        if (isPlayingGlobal) {
            audioEngine.play();
        } else {
            audioEngine.pause();
        }
    }, [isPlayingGlobal]);

    /* ── Cleanup on unmount ───────────────────────────────────────── */
    useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

    /* ── Timeline Interaction ─────────────────────────────────────── */
    const handleTimelineMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const t = Math.max(0, (e.clientX - rect.left + containerRef.current.scrollLeft) / pps);

        if (activeTool === 'select') {
            setSelection({ start: t, end: t });
            selectionRef.current = { start: t, end: t };
        } else {
            setSelection(null);
        }

        audioEngine.setPlayheadPosition(t);
        setPlayhead(t);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const t = Math.max(0, (e.clientX - rect.left + containerRef.current.scrollLeft) / pps);

        if (draggingClip) {
            const newX = e.clientX - rect.left + containerRef.current.scrollLeft - dragOffsetRef.current;
            const newStart = Math.max(0, newX / pps);
            updateClip(draggingClip, { startTime: newStart });
        } else if (selectionRef.current) {
            const start = selectionRef.current.start;
            setSelection({ start, end: t });
        }
    };

    const handleMouseUp = () => {
        setDraggingClip(null);
        selectionRef.current = null;
    };

    /* ── Keyboard Shortcuts ────────────────────────────────────────── */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                deleteSelection();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selection]);

    /* ── Clip Interaction ─────────────────────────────────────────── */
    const handleClipClick = (e: React.MouseEvent, clip: AudioClip) => {
        e.stopPropagation();
        if (activeTool === 'cut') {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const timeInsideClip = (e.clientX - rect.left) / pps;
            splitClipAtTime(clip.id, clip.startTime + timeInsideClip);
        }
    };

    const handleClipMouseDown = (e: React.MouseEvent, clip: AudioClip) => {
        if (activeTool !== 'select') return;
        e.stopPropagation();
        setDraggingClip(clip.id);
        dragOffsetRef.current = e.clientX - (e.currentTarget as HTMLElement).getBoundingClientRect().left;
    };

    /* ── Track resize ─────────────────────────────────────────────── */
    const handleResizeMouseDown = (e: React.MouseEvent, trackId: string) => {
        e.stopPropagation(); e.preventDefault();
        const startY = e.clientY;
        const startH = getH(trackId);
        const onMove = (ev: MouseEvent) => setH(trackId, startH + (ev.clientY - startY));
        const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    /* ── Empty state ──────────────────────────────────────────────── */
    if (tracks.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 bg-white/5 animate-pulse">
                    <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#00F0FF]" />
                </div>
                <h3 className="text-white font-bold tracking-widest text-sm mb-2 uppercase">Espacio de Trabajo Limpio</h3>
                <p className="text-white/30 text-xs max-w-xs leading-relaxed">
                    Usa <span className="text-cyan-400 font-bold">EXTRAER STEMS</span> para cargar pistas de una canción.
                </p>
            </div>
        );
    }

    /* ── Render ───────────────────────────────────────────────────── */
    return (
        <div className="flex flex-col w-full h-full bg-[#18181A] border border-[#222] rounded-xl overflow-hidden font-mono select-none">

            {/* Toolbar */}
            <div className="h-10 border-b border-[#222] bg-[#111113] flex items-center px-4 gap-3 shrink-0 z-20">
                {/* Tools */}
                <button
                    onClick={() => setActiveTool('select')}
                    className={`w-8 h-8 rounded flex items-center justify-center transition-all ${activeTool === 'select'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/60'
                        : 'hover:bg-white/5 text-white/40 border border-transparent'
                        }`}
                >
                    <MousePointer2 size={14} />
                </button>
                <button
                    onClick={() => setActiveTool('cut')}
                    className={`w-8 h-8 rounded flex items-center justify-center transition-all ${activeTool === 'cut'
                        ? 'bg-cyan-500/20 text-red-400 border border-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                        : 'hover:bg-white/5 text-white/40 border border-transparent'
                        }`}
                >
                    <Scissors size={14} />
                </button>

                <div className="w-px h-4 bg-[#333]" />

                {selection && (
                    <button
                        onClick={deleteSelection}
                        className="w-8 h-8 rounded flex items-center justify-center bg-red-500/20 text-red-400 border border-red-500/60 hover:bg-red-500/30 transition-all"
                        title="Eliminar Selección"
                    >
                        <Trash2 size={14} />
                    </button>
                )}

                <div className="w-px h-4 bg-[#333]" />

                {/* Track height */}
                <span className="text-[9px] text-white/20 uppercase tracking-widest">Altura</span>
                <button onClick={() => setAllH(-16)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/5 text-white/30 hover:text-white transition-colors"><ChevronUp size={12} /></button>
                <button onClick={() => setAllH(+16)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/5 text-white/30 hover:text-white transition-colors"><ChevronDown size={12} /></button>

                <div className="w-px h-4 bg-[#333]" />

                {/* Zoom */}
                <span className="text-[9px] text-white/20 uppercase tracking-widest">Zoom</span>
                <button onClick={() => setPps(p => Math.max(15, p - 15))} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/5 text-white/30 hover:text-white transition-colors"><ZoomOut size={12} /></button>
                <button onClick={() => setPps(p => Math.min(200, p + 15))} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/5 text-white/30 hover:text-white transition-colors"><ZoomIn size={12} /></button>

                <div className="w-px h-4 bg-[#333]" />

                <button
                    onClick={quantizeAll}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#222] border border-white/5 text-[10px] text-white/50 hover:text-white hover:bg-white/5 transition-all"
                >
                    <Grid size={12} /> Quantize
                </button>

                {/* Timecode */}
                <div className="ml-auto text-cyan-400 text-xs font-bold tracking-widest bg-black/60 px-3 py-1 rounded border border-white/5 tabular-nums">
                    {Math.floor(playhead / 60).toString().padStart(2, '0')}:
                    {Math.floor(playhead % 60).toString().padStart(2, '0')}.
                    {Math.floor((playhead % 1) * 100).toString().padStart(2, '0')}
                </div>
            </div>

            {/* Scrollable Timeline */}
            <div
                ref={containerRef}
                className="flex-1 overflow-auto relative scrollbar-hide"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseDown={handleTimelineMouseDown}
                style={{ cursor: draggingClip ? 'grabbing' : activeTool === 'cut' ? 'crosshair' : 'default' }}
            >
                <div style={{ width: `${timelineWidth}px`, minHeight: '100%', position: 'relative' }} className="bg-[#1A1A1C]">

                    {/* Time Ruler */}
                    <div className="sticky top-0 w-full h-6 border-b border-[#2A2A2D] bg-[#111] z-20 flex">
                        {Array.from({ length: timelineDuration }).map((_, i) => (
                            <div key={i} className="h-full border-l border-[#333] relative shrink-0" style={{ width: `${pps}px` }}>
                                {i % Math.max(1, Math.round(300 / pps)) === 0 && (
                                    <span className="absolute top-1 left-1 text-[8px] text-[#555] select-none">
                                        {i >= 60 ? `${Math.floor(i / 60)}m${i % 60 > 0 ? `${i % 60}s` : ''}` : `${i}s`}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="absolute top-6 left-0 w-full bottom-0 flex pointer-events-none opacity-[0.07]">
                        {Array.from({ length: timelineDuration }).map((_, i) => (
                            <div key={i} className="h-full border-l border-white shrink-0" style={{ width: `${pps}px` }} />
                        ))}
                    </div>

                    {/* Tracks */}
                    <div className="absolute top-6 left-0 w-full flex flex-col">
                        {tracks.map((track) => {
                            const h = getH(track.id);
                            const trackClipsRow = clips.filter(c => c.trackId === track.id);
                            return (
                                <div
                                    key={track.id}
                                    className="w-full relative border-b border-[#18181A] group"
                                    style={{ height: `${h}px`, background: 'linear-gradient(180deg,#202022 0%,#1A1A1C 100%)' }}
                                >
                                    {/* Track colour stripe */}
                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 opacity-40" style={{ background: track.color }} />

                                    {/* Clips */}
                                    {trackClipsRow.map(clip => (
                                        <div
                                            key={clip.id}
                                            onClick={e => handleClipClick(e, clip)}
                                            onMouseDown={e => handleClipMouseDown(e, clip)}
                                            className={`absolute top-1 rounded cursor-grab active:cursor-grabbing transition-shadow overflow-hidden ${draggingClip === clip.id ? 'z-20 shadow-[0_5px_20px_rgba(0,0,0,0.6)]' : 'z-10'}`}
                                            style={{
                                                left: `${clip.startTime * pps}px`,
                                                width: `${clip.duration * pps}px`,
                                                bottom: '8px',
                                                backgroundColor: `${clip.color}08`,
                                                border: `1px solid ${clip.color}40`,
                                                borderRadius: 4,
                                            }}
                                        >
                                            {/* Waveform Visualization */}
                                            <WaveformCanvas
                                                audioUrl={clip.audioUrl}
                                                color={clip.color}
                                                width={clip.duration * pps}
                                                height={h - 22}
                                            />

                                            {/* Clip header */}
                                            <div className="relative z-10 h-3.5 px-1.5 flex items-center text-[7px] font-bold truncate tracking-widest uppercase opacity-60" style={{ background: `${clip.color}20`, color: clip.color }}>
                                                {clip.name}
                                            </div>

                                            {/* Playback progress fill */}
                                            {isPlayingGlobal && playhead > clip.startTime && playhead < clip.startTime + clip.duration && (
                                                <div
                                                    className="absolute top-0 left-0 bottom-0 pointer-events-none rounded opacity-10 bg-white"
                                                    style={{ width: `${((playhead - clip.startTime) / clip.duration) * 100}%` }}
                                                />
                                            )}
                                        </div>
                                    ))}

                                    {/* Resize handle */}
                                    <div
                                        onMouseDown={e => handleResizeMouseDown(e, track.id)}
                                        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <div className="w-8 h-0.5 rounded bg-white/20 hover:bg-white/50 transition-colors" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Selection Overlay */}
                    {selection && (
                        <div
                            className="absolute top-6 bottom-0 bg-cyan-500/10 border-x border-cyan-500/30 z-10 pointer-events-none"
                            style={{
                                left: `${Math.min(selection.start, selection.end) * pps}px`,
                                width: `${Math.abs(selection.end - selection.start) * pps}px`
                            }}
                        />
                    )}

                    {/* Playhead */}
                    <div className="absolute top-0 bottom-0 z-30 pointer-events-none" style={{ left: `${playhead * pps}px` }}>
                        <div className="absolute top-0 bottom-0 w-px bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
                        <div className="absolute -top-0 -left-[5px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-yellow-400" />
                    </div>

                </div>
            </div>
        </div>
    );
}
