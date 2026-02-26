'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useDAWStore } from '@/store/useDAWStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, X, Maximize2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function GlobalFooterPlayer() {
    const t = useTranslations('Player');
    const { currentPreviewTrack, setPreviewTrack } = useDAWStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);

    useEffect(() => {
        if (currentPreviewTrack && currentPreviewTrack.url && audioRef.current) {
            audioRef.current.src = currentPreviewTrack.url;
            audioRef.current.play().catch(err => console.error("Playback error:", err));
            setIsPlaying(true);
        } else if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [currentPreviewTrack]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const dur = audioRef.current.duration;
            setProgress((current / dur) * 100);
            setDuration(dur);
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
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-xl border-t border-white/10 z-[100] flex items-center px-6 gap-8 animate-in slide-in-from-bottom duration-500">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Track Info */}
            <div className="flex items-center gap-4 w-[300px] shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-md flex items-center justify-center shadow-lg overflow-hidden border border-white/10">
                    {currentPreviewTrack.image ? (
                        <img src={currentPreviewTrack.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <Music className="text-white/50" size={20} />
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-white font-bold text-sm truncate">{currentPreviewTrack.title || t('untitled')}</span>
                    <span className="text-white/50 text-[10px] uppercase tracking-widest truncate">{currentPreviewTrack.style || t('aiGenerated')}</span>
                </div>
            </div>

            {/* Player Controls */}
            <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl">
                <div className="flex items-center gap-6">
                    <button className="text-white/40 hover:text-white transition-colors">
                        <SkipBack size={20} />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    >
                        {isPlaying ? <Pause size={20} fill="black" className="text-black" /> : <Play size={20} fill="black" className="text-black ml-1" />}
                    </button>
                    <button className="text-white/40 hover:text-white transition-colors">
                        <SkipForward size={20} />
                    </button>
                </div>

                <div className="w-full flex items-center gap-3">
                    <span className="text-[10px] font-mono text-white/40 w-10 text-right">
                        {Math.floor((audioRef.current?.currentTime || 0) / 60)}:
                        {Math.floor((audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}
                    </span>
                    <input
                        type="range"
                        value={progress}
                        onChange={handleSeek}
                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                        style={{ background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.1) ${progress}%)` }}
                    />
                    <span className="text-[10px] font-mono text-white/40 w-10">
                        {Math.floor(duration / 60)}:
                        {Math.floor(duration % 60).toString().padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-6 w-[300px] justify-end">
                <div className="flex items-center gap-2 group">
                    <Volume2 size={18} className="text-white/40 group-hover:text-white transition-colors" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            setVolume(v);
                            if (audioRef.current) audioRef.current.volume = v;
                        }}
                        className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                    />
                </div>
                <button
                    onClick={() => setPreviewTrack(null)}
                    className="text-white/20 hover:text-red-500 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}
