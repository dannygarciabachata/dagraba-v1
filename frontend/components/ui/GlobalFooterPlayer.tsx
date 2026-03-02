'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useDAWStore } from '@/store/useDAWStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, X, Maximize2, Repeat, Shuffle, Share2, ListPlus, Heart, MoreVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function GlobalFooterPlayer() {
    const t = useTranslations('Player');
    const { currentPreviewTrack, setPreviewTrack, isPlaying, setIsPlaying, rightPanelWidth } = useDAWStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isLooping, setIsLooping] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop = isLooping;
        }
    }, [isLooping]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (currentPreviewTrack) {
            const src = currentPreviewTrack.streamAudioUrl || currentPreviewTrack.url || '';
            if (!src) {
                // Track not ready yet (still processing)
                audio.pause();
                setIsPlaying(false);
                return;
            }
            if (audio.src !== src && !audio.src.endsWith(src)) {
                audio.src = src;
                audio.load();
                audio.volume = volume;
            }

            if (isPlaying) {
                audio.play().catch(err => {
                    console.warn('[GlobalPlayer] Playback failed:', err);
                    setIsPlaying(false);
                });
            } else {
                audio.pause();
            }
        } else {
            audio.pause();
            audio.src = '';
            setIsPlaying(false);
            setProgress(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPreviewTrack, isPlaying]);


    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const dur = audioRef.current.duration;
            if (isFinite(dur) && dur > 0) {
                setProgress((current / dur) * 100);
                setDuration(dur);
            }
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const seekTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
            audioRef.current.currentTime = seekTime;
            setProgress(parseFloat(e.target.value));
        }
    };

    if (!currentPreviewTrack) return null;

    return (
        <div
            className="fixed bottom-0 left-0 h-24 bg-[#0A0A0C] border-t border-[#1A1A1A] z-[100] flex items-center justify-between px-6 animate-in slide-in-from-bottom duration-500 transition-[right]"
            style={{ right: `${rightPanelWidth || 0}px` }}
        >
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Track Info (Left) */}
            <div className="flex items-center gap-4 w-[350px] shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg overflow-hidden border border-white/5 shrink-0">
                    {currentPreviewTrack.image ? (
                        <img src={currentPreviewTrack.image} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <Music className="text-white/50" size={24} />
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-white font-semibold text-base truncate">{currentPreviewTrack.title || t('untitled')}</span>
                    <span className="text-white/40 text-[13px] truncate mt-0.5">{currentPreviewTrack.style || t('aiGenerated')}</span>
                </div>
            </div>

            {/* Player Controls (Center) - Absolutely Centered */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 w-full max-w-[500px] justify-center z-10 px-4">

                {/* Top Row: Playback Buttons */}
                <div className="flex items-center gap-6">
                    <button className="text-white/50 hover:text-white transition-colors">
                        <SkipBack size={20} fill="currentColor" />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 bg-[#6b4cff] rounded-full flex items-center justify-center hover:bg-[#5b3ce0] hover:scale-105 transition-all shadow-[0_0_20px_rgba(107,76,255,0.4)] text-white"
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                    </button>
                    <button className="text-white/50 hover:text-white transition-colors">
                        <SkipForward size={20} fill="currentColor" />
                    </button>
                    <button
                        onClick={() => setIsLooping(!isLooping)}
                        className={`${isLooping ? 'text-white' : 'text-white/50'} hover:text-white transition-colors ml-2`}
                    >
                        <Repeat size={18} />
                    </button>
                </div>

                {/* Bottom Row: Progress Bar & Timestamps */}
                <div className="flex items-center w-full gap-3">
                    <span className="text-[11px] font-mono text-white/50 w-10 text-right shrink-0">
                        {Math.floor((audioRef.current?.currentTime || 0) / 60)}:
                        {Math.floor((audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}
                    </span>

                    <div className="flex-1 flex items-center h-full group relative py-1">
                        <input
                            type="range"
                            value={isFinite(progress) ? progress : 0}
                            onChange={handleSeek}
                            min={0}
                            max={100}
                            className="w-full h-1 bg-[#2A2A2A] rounded-full appearance-none cursor-pointer group-hover:h-1.5 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100"
                            style={{ background: `linear-gradient(to right, white ${isFinite(progress) ? progress : 0}%, #2A2A2A ${isFinite(progress) ? progress : 0}%)` }}
                        />
                    </div>

                    <span className="text-[11px] font-mono text-white/50 w-10 shrink-0">
                        {Math.floor(duration / 60)}:
                        {Math.floor(duration % 60).toString().padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center justify-end gap-5 w-[350px] shrink-0 z-20">
                <button className="text-white/50 hover:text-white transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                </button>
                <button className="text-white/50 hover:text-white transition-colors">
                    <Share2 size={20} />
                </button>
                <button className="text-white/50 hover:text-white transition-colors">
                    <ListPlus size={20} />
                </button>
                <button className="text-white/50 hover:text-white transition-colors">
                    <Heart size={20} />
                </button>
                <button className="text-white/50 hover:text-white transition-colors ml-2">
                    <MoreVertical size={20} />
                </button>
                <button
                    onClick={() => setPreviewTrack(null)}
                    className="text-white/30 hover:text-red-500 transition-colors ml-4 border-l border-white/10 pl-4"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
