'use client';

import React, { useState } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Check, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDAWStore } from '@/store/useDAWStore';
import { AddToPlaylistModal } from '@/components/ui/AddToPlaylistModal';

// Dummy data from user's request
const LIVE_RADIO = [
    { title: 'Chill Lounge', handle: '@mercury', listeners: '4.4K', color: 'from-blue-500/20 to-purple-500/20' },
    { title: 'A u r a P h o n k', handle: '@yumi', listeners: '5.2K', color: 'from-fuchsia-500/20 to-pink-500/20' },
    { title: 'Tokyo Lofi', handle: '@yumi', listeners: '277', color: 'from-emerald-500/20 to-teal-500/20' },
    { title: 'Heavenly Beats', handle: '@mercury', listeners: '4.1K', color: 'from-cyan-500/20 to-blue-500/20' },
    { title: 'Hip Hop Central', handle: '@reedbeatz_', listeners: '4.5K', color: 'from-red-500/20 to-orange-500/20' },
    { title: 'Mythic Realms', handle: '@graceholloway', listeners: '394', color: 'from-indigo-500/20 to-violet-500/20' },
    { title: 'Afro Sunset Lounge', handle: '@ohayes', listeners: '4.6K', color: 'from-orange-500/20 to-yellow-500/20' },
    { title: 'Techno Mainstage', handle: '@jordanmiles', listeners: '162', color: 'from-rose-500/20 to-red-500/20' },
    { title: 'Miami 1985', handle: '@dagraba', listeners: '5.4K', color: 'from-pink-500/20 to-purple-500/20' },
    { title: 'Elegant Jazz', handle: '@dagraba', listeners: '9', color: 'from-amber-500/20 to-yellow-500/20' },
];

const TRENDING_CATEGORIES = [
    { title: 'Top 100', likes: '97K' },
    { title: 'Hip Hop', likes: '29K' },
    { title: 'Afro House', likes: '36K' },
    { title: 'Chillout', likes: '31K' },
    { title: 'Popular Remixes', likes: '37K' },
    { title: 'Eurovision Reimagined', likes: '23K' },
    { title: 'K-pop', likes: '38K' },
    { title: 'Dark R&B', likes: '41K' },
    { title: 'Pop', likes: '25K' },
];

const BEATS_CATEGORIES = [
    { title: 'Type Beats', likes: '92K' },
    { title: 'Heavenly Beats', likes: '85K' },
    { title: 'LoFi beats', likes: '38K' },
    { title: 'House Essentials', likes: '48K' },
    { title: 'Aura Phonk', likes: '36K' },
    { title: 'Melodic Techno', likes: '30K' },
    { title: 'Angelcore', likes: '10K' },
    { title: 'Slap House Beats', likes: '28K' },
];

const FILM_TV_CATEGORIES = [
    { title: 'Cinematic', likes: '31K' },
    { title: 'Action', likes: '19K' },
    { title: 'Epic Realms - Myth & Fantasy', likes: '11K' },
    { title: 'Dark Fantasy - Hollow Realms', likes: '8K' },
    { title: 'Medieval Taverns', likes: '7K' },
    { title: 'Horror Themes', likes: '48K' },
    { title: 'Classical', likes: '48K' },
];

const SOUND_EFFECTS_CATEGORIES = [
    { title: 'Film Sound FX', likes: '21K' },
    { title: 'Ambience', likes: '9K' },
    { title: 'Notification Sounds', likes: '16K' },
    { title: 'E-commerce SFX', likes: '6K' },
    { title: 'Nature Ambience', likes: '14K' },
    { title: 'Casino - SFX', likes: '17K' },
    { title: 'Warzone SFX', likes: '18K' },
];

const HorizontalScrollContainer = ({ title, subtitle, items, renderItem }: { title: string, subtitle?: string, items: any[], renderItem: (item: any, i: number) => React.ReactNode }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="mb-12 relative w-full group">
            <div className="flex items-end justify-between mb-4 px-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        {title}
                        {(title.includes('Trending') || title.includes('Tendenza') || title.includes('Tendencia') || title.includes('Tendências') || title.includes('Tendances') || title.includes('Angesagt') || title.includes('トレンド')) && <span className="text-orange-500">🚀</span>}
                    </h2>
                    {subtitle && <p className="text-sm text-[#888] font-medium mt-1 uppercase tracking-widest">{subtitle}</p>}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => scroll('left')} className="p-2 bg-[#1A1A1A] hover:bg-[#333] rounded-full text-white transition-all shadow-xl">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => scroll('right')} className="p-2 bg-[#1A1A1A] hover:bg-[#333] rounded-full text-white transition-all shadow-xl">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 pb-4 px-8 snap-x snap-mandatory custom-scrollbar hidden-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item, i) => (
                    <div key={i} className="snap-start shrink-0">
                        {renderItem(item, i)}
                    </div>
                ))}
            </div>
        </section>
    );
};


export default function Explorer() {
    const t = useTranslations('Explorer');
    const { isPlaying, setIsPlaying, setPreviewTrack, currentPreviewTrack } = useDAWStore();
    const [activeRadio, setActiveRadio] = useState<string | null>(null);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<{ id: string, title: string } | null>(null);

    const handlePlayTrack = (track: any) => {
        setPreviewTrack({
            id: track.id || 'dummy-id',
            title: track.title,
            url: track.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Dummy URL for demo
            image: `https://picsum.photos/seed/${track.title}/300/300`
        });
        setIsPlaying(true);
    };

    const handleOpenPlaylistModal = (e: React.MouseEvent, track: any) => {
        e.stopPropagation();
        setSelectedTrack({ id: track.id || 'dummy-id', title: track.title });
        setIsPlaylistModalOpen(true);
    };

    const handlePlayRadio = (radio: any) => {
        if (activeRadio === radio.title) {
            setIsPlaying(!isPlaying);
        } else {
            setActiveRadio(radio.title);
            handlePlayTrack({ ...radio, id: `radio-${radio.title}` });
        }
    };

    return (
        <div className="h-full bg-[#050505] flex flex-col overflow-y-auto overflow-x-hidden relative">

            {/* Header Banner */}
            <div className="flex-none p-8 pb-4">
                <div className="flex items-center gap-6 text-sm font-bold text-[#888]">
                    <span className="flex items-center gap-2 bg-[#1A1A1A] px-4 py-2 rounded-full border border-[#333]">
                        <Check size={14} className="text-green-500" /> {t('unlimitedStreaming')}
                    </span>
                    <span className="flex items-center gap-2 text-white/50">
                        <Check size={14} className="text-green-500" /> {t('freeDownloads')}
                    </span>
                    <span className="flex items-center gap-2 text-white/50">
                        <Check size={14} className="text-green-500" /> {t('noCopyright')}
                    </span>
                    <span className="flex items-center gap-2 text-white/50">
                        <Check size={14} className="text-green-500" /> {t('royaltyFree')}
                    </span>
                </div>
            </div>

            <main className="flex-1 pb-32">
                {/* LIVE RADIO */}
                <HorizontalScrollContainer
                    title={t('radioTitle')}
                    items={LIVE_RADIO}
                    renderItem={(radio) => {
                        const isCurrentlyPlaying = activeRadio === radio.title && isPlaying;
                        return (
                            <div className="group w-[200px] flex flex-col items-center gap-3 cursor-pointer" onClick={() => handlePlayRadio(radio)}>
                                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${radio.color} border-2 relative flex items-center justify-center transition-all duration-500 shadow-2xl ${activeRadio === radio.title ? 'border-orange-500 shadow-orange-500/20' : 'border-[#222] group-hover:border-[#444]'}`}>
                                    <div className={`absolute top-0 right-0 px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest bg-red-600 text-white ${activeRadio === radio.title ? 'animate-pulse' : ''}`}>
                                        {t('live')}
                                    </div>
                                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                                        {isCurrentlyPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-white font-bold text-sm tracking-wide truncate w-[180px]">{radio.title}</h3>
                                    <div className="flex items-center justify-center gap-2 text-xs text-[#888] mt-1">
                                        <span>{radio.handle}</span>
                                        <span className="w-1 h-1 rounded-full bg-[#444]" />
                                        <span>{radio.listeners} {t('listeners')}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }}
                />

                {/* TRENDING */}
                <HorizontalScrollContainer
                    title={t('trending')}
                    subtitle={t('updatedToday')}
                    items={TRENDING_CATEGORIES}
                    renderItem={(cat, i) => (
                        <div className="w-[180px] group cursor-pointer relative rounded-2xl overflow-hidden bg-[#111] border border-[#222] hover:border-orange-500/50 transition-all duration-300" onClick={() => handlePlayTrack(cat)}>
                            <div className="aspect-square bg-[#1A1A1A] relative" style={{ backgroundImage: `url(https://picsum.photos/seed/trend${i}/300/300)`, backgroundSize: 'cover' }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                    <button
                                        onClick={(e) => handleOpenPlaylistModal(e, cat)}
                                        className="p-2 bg-black/50 hover:bg-black rounded-full text-white backdrop-blur-md border border-white/10"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button className="absolute bottom-4 right-4 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20 hover:bg-orange-500 hover:scale-110">
                                    <Play size={18} fill="white" className="ml-0.5" />
                                </button>
                                <div className="absolute bottom-4 left-4 z-10 w-full pr-16 bg-gradient-to-r from-black/80 to-transparent p-1 rounded-md">
                                    <h3 className="text-white font-black text-xs uppercase tracking-wider truncate drop-shadow-md">{cat.title}</h3>
                                    <p className="text-[10px] text-orange-400 font-bold drop-shadow-md">{cat.likes} {t('likes')}</p>
                                </div>
                            </div>
                        </div>
                    )}
                />

                {/* BEATS */}
                <HorizontalScrollContainer
                    title={t('beats')}
                    subtitle={t('updatedToday')}
                    items={BEATS_CATEGORIES}
                    renderItem={(cat, i) => (
                        <div className="w-[180px] group cursor-pointer relative rounded-2xl overflow-hidden bg-[#111] border border-[#222] hover:border-orange-500/50 transition-all duration-300" onClick={() => handlePlayTrack(cat)}>
                            <div className="aspect-square bg-[#1A1A1A] relative" style={{ backgroundImage: `url(https://picsum.photos/seed/beats${i}/300/300)`, backgroundSize: 'cover' }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                    <button
                                        onClick={(e) => handleOpenPlaylistModal(e, cat)}
                                        className="p-2 bg-black/50 hover:bg-black rounded-full text-white backdrop-blur-md border border-white/10"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button className="absolute bottom-4 right-4 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20 hover:bg-orange-500 hover:scale-110">
                                    <Play size={18} fill="white" className="ml-0.5" />
                                </button>
                                <div className="absolute bottom-4 left-4 z-10 w-full pr-16 bg-gradient-to-r from-black/80 to-transparent p-1 rounded-md">
                                    <h3 className="text-white font-black text-xs uppercase tracking-wider truncate drop-shadow-md">{cat.title}</h3>
                                    <p className="text-[10px] text-orange-400 font-bold drop-shadow-md">{cat.likes} {t('likes')}</p>
                                </div>
                            </div>
                        </div>
                    )}
                />

                {/* FILM, GAME & TV */}
                <HorizontalScrollContainer
                    title={t('filmTv')}
                    subtitle={t('updatedToday')}
                    items={FILM_TV_CATEGORIES}
                    renderItem={(cat, i) => (
                        <div className="w-[180px] group cursor-pointer relative rounded-2xl overflow-hidden bg-[#111] border border-[#222] hover:border-orange-500/50 transition-all duration-300" onClick={() => handlePlayTrack(cat)}>
                            <div className="aspect-square bg-[#1A1A1A] relative" style={{ backgroundImage: `url(https://picsum.photos/seed/film${i}/300/300)`, backgroundSize: 'cover' }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                    <button
                                        onClick={(e) => handleOpenPlaylistModal(e, cat)}
                                        className="p-2 bg-black/50 hover:bg-black rounded-full text-white backdrop-blur-md border border-white/10"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button className="absolute bottom-4 right-4 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20 hover:bg-orange-500 hover:scale-110">
                                    <Play size={18} fill="white" className="ml-0.5" />
                                </button>
                                <div className="absolute bottom-4 left-4 z-10 w-full pr-16 bg-gradient-to-r from-black/80 to-transparent p-1 rounded-md">
                                    <h3 className="text-white font-black text-xs uppercase tracking-wider truncate drop-shadow-md">{cat.title}</h3>
                                    <p className="text-[10px] text-orange-400 font-bold drop-shadow-md">{cat.likes} {t('likes')}</p>
                                </div>
                            </div>
                        </div>
                    )}
                />

                {/* SOUND EFFECTS */}
                <HorizontalScrollContainer
                    title={t('sfx')}
                    subtitle={t('updatedToday')}
                    items={SOUND_EFFECTS_CATEGORIES}
                    renderItem={(cat, i) => (
                        <div className="w-[180px] group cursor-pointer relative rounded-2xl overflow-hidden bg-[#111] border border-[#222] hover:border-orange-500/50 transition-all duration-300" onClick={() => handlePlayTrack(cat)}>
                            <div className="aspect-square bg-[#1A1A1A] relative" style={{ backgroundImage: `url(https://picsum.photos/seed/sfx${i}/300/300)`, backgroundSize: 'cover' }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                    <button
                                        onClick={(e) => handleOpenPlaylistModal(e, cat)}
                                        className="p-2 bg-black/50 hover:bg-black rounded-full text-white backdrop-blur-md border border-white/10"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button className="absolute bottom-4 right-4 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20 hover:bg-orange-500 hover:scale-110">
                                    <Play size={18} fill="white" className="ml-0.5" />
                                </button>
                                <div className="absolute bottom-4 left-4 z-10 w-full pr-16 bg-gradient-to-r from-black/80 to-transparent p-1 rounded-md">
                                    <h3 className="text-white font-black text-xs uppercase tracking-wider truncate drop-shadow-md">{cat.title}</h3>
                                    <p className="text-[10px] text-orange-400 font-bold drop-shadow-md">{cat.likes} {t('likes')}</p>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </main>

            {selectedTrack && (
                <AddToPlaylistModal
                    isOpen={isPlaylistModalOpen}
                    onClose={() => setIsPlaylistModalOpen(false)}
                    trackId={selectedTrack.id}
                    trackTitle={selectedTrack.title}
                />
            )}
        </div>
    );
}
