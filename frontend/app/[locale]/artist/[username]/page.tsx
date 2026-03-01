'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Heart, Share2, Play, Pause, Users, Headphones, Music, MoreVertical,
    ArrowLeft, CheckCircle2, Eye, ExternalLink, Bell, Gift, Award
} from 'lucide-react';
import { GiftModal } from '@/components/profile/GiftModal';

const ARTIST_DATA = {
    name: 'Productor Maestro',
    username: 'productor-maestro',
    bio: 'Productor y compositor. Creando música que mueve el alma desde República Dominicana 🇩🇴',
    badge: 'LEYENDA',
    followers: 2400,
    following: 198,
    songs: 34,
    plays: 29300,
    socials: {
        instagram: '@productor_maestro',
        tiktok: '@productor_maestro',
    }
};

const ARTIST_SONGS = [
    { id: '1', title: 'Bendecidos por Dios', style: 'Reggaeton, Trap', duration: '3:24', image: '/logo_circular.png', views: 12400, likes: 847, source: 'DA GRABA' },
    { id: '2', title: 'Noche Sin Ti', style: 'R&B, Pop Urbano', duration: '2:58', image: '/logo_circular.png', views: 8100, likes: 612, source: 'SPOTIFY' },
    { id: '3', title: 'En La Cima', style: 'Drill, Hip Hop', duration: '4:02', image: '/logo_circular.png', views: 5600, likes: 391, source: 'LAST.FM' },
    { id: '4', title: 'Fuego Eterno', style: 'Corridos Tumbados', duration: '3:47', image: '/logo_circular.png', views: 3200, likes: 218, source: 'DA GRABA' },
    { id: '5', title: 'Promesa Rota', style: 'Balada Urbana', duration: '3:11', image: '/logo_circular.png', views: 2900, likes: 183, source: 'DA GRABA' },
];

type Tab = 'songs' | 'playlists';

export default function ArtistPublicProfile() {
    const params = useParams();
    const router = useRouter();
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState(ARTIST_DATA.followers);
    const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [shareModal, setShareModal] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('songs');
    const [showGiftModal, setShowGiftModal] = useState(false);

    const handleFollow = () => {
        setIsFollowing(prev => !prev);
        setFollowers(prev => isFollowing ? prev - 1 : prev + 1);
    };

    const handleLike = (songId: string) => {
        setLikedSongs(prev => {
            const next = new Set(prev);
            if (next.has(songId)) next.delete(songId); else next.add(songId);
            return next;
        });
    };

    const formatCount = (n: number) =>
        n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

    return (
        <div className="flex flex-col w-full min-h-full bg-[#050505] overflow-y-auto custom-scrollbar">
            {/* Back */}
            <div className="px-8 pt-6 shrink-0">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-[#555] hover:text-white text-xs font-bold transition-colors">
                    <ArrowLeft size={14} /> Volver
                </button>
            </div>

            {/* Artist Hero */}
            <div className="relative w-full pt-10 pb-8 px-8 bg-gradient-to-b from-indigo-900/30 via-purple-900/20 to-[#050505] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-transparent to-purple-600/5 pointer-events-none" />

                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8 relative z-10">
                    {/* Avatar */}
                    <div className="relative w-36 h-36 rounded-full border-4 border-orange-500/40 bg-[#111] overflow-hidden flex items-center justify-center shadow-2xl shadow-orange-500/10 shrink-0">
                        <img src="/logo_circular.png" alt="" className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none'; }} />
                        <span className="text-5xl font-black text-[#222] absolute">PM</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-3xl font-black text-white tracking-tight">{ARTIST_DATA.name}</h1>
                            <span className="px-2.5 py-1 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[9px] uppercase font-black rounded-full border border-white/20">
                                {ARTIST_DATA.badge}
                            </span>
                            <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                        </div>
                        <p className="text-[#666] text-sm mb-4 max-w-md">{ARTIST_DATA.bio}</p>

                        {/* Stats */}
                        <div className="flex items-center justify-center md:justify-start gap-6 mb-5 text-sm">
                            <div className="text-center">
                                <div className="text-white font-black">{formatCount(followers)}</div>
                                <div className="text-[9px] text-[#555] uppercase tracking-widest">Seguidores</div>
                            </div>
                            <div className="w-px h-8 bg-[#222]" />
                            <div className="text-center">
                                <div className="text-white font-black">{ARTIST_DATA.following}</div>
                                <div className="text-[9px] text-[#555] uppercase tracking-widest">Siguiendo</div>
                            </div>
                            <div className="w-px h-8 bg-[#222]" />
                            <div className="text-center">
                                <div className="text-white font-black">{ARTIST_DATA.songs}</div>
                                <div className="text-[9px] text-[#555] uppercase tracking-widest">Canciones</div>
                            </div>
                            <div className="w-px h-8 bg-[#222]" />
                            <div className="text-center">
                                <div className="text-white font-black">{formatCount(ARTIST_DATA.plays)}</div>
                                <div className="text-[9px] text-[#555] uppercase tracking-widest">Reproducciones</div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <button
                                onClick={handleFollow}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black tracking-widest transition-all ${isFollowing
                                    ? 'bg-[#1A1A1A] border border-[#333] text-[#888] hover:border-red-500/50 hover:text-red-400'
                                    : 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]'}`}
                            >
                                {isFollowing ? <><Bell size={14} /> SIGUIENDO</> : <><Users size={14} /> SEGUIR</>}
                            </button>
                            <button
                                onClick={() => setShowGiftModal(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-600/80 to-orange-600/80 hover:from-yellow-500/80 hover:to-orange-500/80 border border-yellow-500/30 rounded-xl text-sm font-black text-white transition-all shadow-[0_0_20px_rgba(234,179,8,0.15)]"
                            >
                                <Gift size={14} /> Regalo
                            </button>
                            <button
                                onClick={() => setShareModal('artist')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#111] hover:bg-[#1A1A1A] border border-[#222] rounded-xl text-sm font-bold text-[#888] hover:text-white transition-all"
                            >
                                <Share2 size={14} /> Compartir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#1A1A1A] px-8 max-w-5xl mx-auto w-full">
                {(['songs', 'playlists'] as Tab[]).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`mr-1 px-5 py-3 text-[10px] font-black tracking-widest uppercase border-b-2 transition-all ${activeTab === tab ? 'border-orange-500 text-orange-400' : 'border-transparent text-[#555] hover:text-[#888]'}`}>
                        {tab === 'songs' ? 'Canciones' : 'Playlists'}
                    </button>
                ))}
            </div>

            {/* Songs */}
            {activeTab === 'songs' && (
                <div className="max-w-5xl mx-auto w-full px-8 py-6 space-y-3">
                    {ARTIST_SONGS.map((song, i) => {
                        const isLiked = likedSongs.has(song.id);
                        const localLikes = song.likes + (isLiked ? 1 : 0);
                        return (
                            <div key={song.id} className="group flex items-center gap-4 p-4 bg-[#0A0A0C] hover:bg-[#0F0F12] border border-white/5 hover:border-white/10 rounded-2xl transition-all">
                                <span className="text-[#333] text-xs font-mono w-5 text-center">{String(i + 1).padStart(2, '0')}</span>

                                {/* Cover */}
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                                    <img src={song.image} alt="" className="w-full h-full object-cover" />
                                    <button onClick={() => setPlayingId(playingId === song.id ? null : song.id)}
                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {playingId === song.id ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="ml-0.5" />}
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-sm font-bold text-white truncate">{song.title}</span>
                                        <span className={`px-1.5 py-0.5 rounded text-[7px] font-black tracking-widest shrink-0 ${song.source === 'SPOTIFY' ? 'bg-green-500/20 text-green-400' : song.source === 'LAST.FM' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                            {song.source}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-[#555] italic">{song.style}</span>
                                </div>

                                {/* Counters */}
                                <div className="flex items-center gap-5 text-[11px] text-[#444]">
                                    <span className="flex items-center gap-1"><Eye size={10} /> {formatCount(song.views)}</span>
                                    <button
                                        onClick={() => handleLike(song.id)}
                                        className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-red-400' : 'hover:text-red-400'}`}
                                    >
                                        <Heart size={10} fill={isLiked ? 'currentColor' : 'none'} /> {formatCount(localLikes)}
                                    </button>
                                    <button onClick={() => setShareModal(song.id)} className="hover:text-white transition-colors">
                                        <Share2 size={10} />
                                    </button>
                                    <span className="font-mono text-[#333]">{song.duration}</span>
                                </div>

                                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/5 rounded-lg text-[#555] hover:text-white transition-all">
                                    <MoreVertical size={13} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Playlists tab (placeholder) */}
            {activeTab === 'playlists' && (
                <div className="max-w-5xl mx-auto w-full px-8 py-16 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-dashed border-[#333] flex items-center justify-center">
                        <Music size={24} className="text-[#444]" />
                    </div>
                    <p className="text-[#444] text-sm font-bold uppercase tracking-widest">Sin playlists públicas aún</p>
                </div>
            )}

            {/* Gift Modal */}
            {showGiftModal && (
                <GiftModal artistName={ARTIST_DATA.name} onClose={() => setShowGiftModal(false)} />
            )}

            {/* Share Modal */}
            {shareModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShareModal(null)}>
                    <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <h3 className="font-black text-white">Compartir</h3>
                        <div className="flex items-center gap-2 p-3 bg-[#0A0A0C] border border-[#222] rounded-xl">
                            <span className="text-xs text-[#555] flex-1 truncate">
                                {shareModal === 'artist' ? `dagraba.studio/artist/${params.username}` : `dagraba.studio/track/${shareModal}`}
                            </span>
                            <button className="text-xs font-bold text-orange-400 hover:text-orange-300 shrink-0">Copiar</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {['Instagram', 'Twitter/X', 'WhatsApp'].map(s => (
                                <button key={s} className="py-2.5 bg-[#0A0A0C] border border-[#222] rounded-xl text-[10px] font-bold text-[#777] hover:text-white hover:border-[#333] transition-all">{s}</button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
