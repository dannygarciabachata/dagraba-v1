'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    User, Settings, Shield, Zap, Save, Palette, Globe, HardDrive,
    Music, Heart, Eye, Share2, ExternalLink, CheckCircle2,
    Play, Pause, MoreVertical, Headphones, Users, Plus, X, RefreshCw, Upload, Download, BarChart3,
    CreditCard, Bitcoin, AlertCircle, Check
} from 'lucide-react';

const SpotifyIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
);

const LastFmIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M10.599 17.211l-.881-2.393s-1.433 1.596-3.579 1.596c-1.9 0-3.249-1.652-3.249-4.296 0-3.38 1.7-4.597 3.381-4.597 3.048 0 4.023 1.983 4.903 4.543l.88 2.74C13.175 18.403 15.125 20 18.574 20c3.816 0 6.4-2.35 6.4-6.776 0-3.965-2.25-6.032-5.124-6.032-2.849 0-4.547 1.879-4.547 5.073 0 2.744 1.38 4.337 3.414 4.337 1.174 0 2.074-.637 2.511-1.544.29.906-.247 1.904-1.562 1.904-1.52 0-2.558-1.47-2.558-4.697 0-2.824 1.178-4.047 2.742-4.047 1.64 0 2.82 1.26 2.82 4.005 0 3.116-1.479 4.978-4.1 4.978-2.846 0-4.19-1.974-5.034-4.36l-.91-2.58c-1.109-3.136-2.735-4.578-7.058-4.578C1.96 6.683 0 9.38 0 11.927 0 14.7 1.7 17.4 5.14 17.4c2.213 0 3.7-.94 4.596-1.967l.863 1.778z" />
    </svg>
);

const MOCK_SONGS = [
    { id: '1', title: 'Bendecidos por Dios', style: 'Reggaeton, Trap', duration: '3:24', image: '/logo_circular.png', views: '12.4K', likes: 847, source: 'DA GRABA' },
    { id: '2', title: 'Noche Sin Ti', style: 'R&B, Pop Urbano', duration: '2:58', image: '/logo_circular.png', views: '8.1K', likes: 612, source: 'SPOTIFY' },
    { id: '3', title: 'En La Cima', style: 'Drill, Hip Hop', duration: '4:02', image: '/logo_circular.png', views: '5.6K', likes: 391, source: 'LAST.FM' },
    { id: '4', title: 'Fuego Eterno', style: 'Corridos Tumbados', duration: '3:47', image: '/logo_circular.png', views: '3.2K', likes: 218, source: 'DA GRABA' },
];

const MOCK_SPOTIFY = [
    { id: 's1', title: 'Amor en Llamas', album: 'Fuego Vol. 1', duration: '3:12', streams: '845K' },
    { id: 's2', title: 'Ya No Eres Mía', album: 'Fuego Vol. 1', duration: '4:01', streams: '1.2M' },
    { id: 's3', title: 'Cielo Roto', album: 'Single', duration: '2:58', streams: '320K' },
];

const MOCK_LASTFM = [
    { id: 'l1', title: 'La Última Vez', scrobbles: '24,801' },
    { id: 'l2', title: 'Sueños de Arena', scrobbles: '18,440' },
    { id: 'l3', title: 'Mi Mundo Sin Ti', scrobbles: '11,200' },
];

type Tab = 'music' | 'public' | 'spotify' | 'lastfm' | 'daw' | 'billing' | 'pagos';

export default function Profile() {
    const [activeTab, setActiveTab] = useState<Tab>('music');
    const router = useRouter();
    const [spotifyConnected, setSpotifyConnected] = useState(false);
    const [lastfmConnected, setLastfmConnected] = useState(false);
    const [lastfmUser, setLastfmUser] = useState('');
    const [importedSpotify, setImportedSpotify] = useState<Set<string>>(new Set());
    const [importedLastfm, setImportedLastfm] = useState<Set<string>>(new Set());
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [shareOpen, setShareOpen] = useState<string | null>(null);

    // Payment state
    const [defaultPayment, setDefaultPayment] = useState<'stripe' | 'paypal' | 'card'>('stripe');
    const [stripeConnected, setStripeConnected] = useState(false);
    const [paypalEmail, setPaypalEmail] = useState('');
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const [cardSaved, setCardSaved] = useState(false);

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'music', label: 'Mi Música', icon: <Music size={14} /> },
        { id: 'public', label: 'Perfil Público', icon: <Globe size={14} /> },
        { id: 'spotify', label: 'Spotify', icon: <SpotifyIcon /> },
        { id: 'lastfm', label: 'Last.fm', icon: <LastFmIcon /> },
        { id: 'daw', label: 'Preferencias', icon: <Palette size={14} /> },
        { id: 'billing', label: 'Suscripción', icon: <Shield size={14} /> },
        { id: 'pagos', label: 'Pagos', icon: <CreditCard size={14} /> },
    ];

    const toggleImport = (set: Set<string>, setFn: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) => {
        const next = new Set(set);
        if (next.has(id)) next.delete(id); else next.add(id);
        setFn(next);
    };

    return (
        <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar bg-[#050505]">
            {/* Hero Banner */}
            <div className="relative w-full h-52 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-orange-900/30 overflow-hidden shrink-0">
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#050505] to-transparent" />
                <div className="absolute top-5 right-8 flex gap-4">
                    {[{ v: '2.4K', l: 'Seguidores', i: <Users size={12} /> }, { v: '34', l: 'Canciones', i: <Music size={12} /> }, { v: '29.3K', l: 'Plays', i: <Headphones size={12} /> }].map(s => (
                        <div key={s.l} className="flex flex-col items-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 text-center">
                            <div className="flex items-center gap-1 text-white/80 text-xs font-bold mb-0.5">{s.i} {s.v}</div>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest">{s.l}</span>
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-7 left-8 flex items-end gap-5">
                    <div className="w-20 h-20 rounded-full border-4 border-orange-500/60 bg-[#111] overflow-hidden flex items-center justify-center shadow-2xl cursor-pointer group relative">
                        <User size={32} className="text-[#444]" />
                        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center backdrop-blur-sm"><Upload size={16} className="text-white" /></div>
                    </div>
                    <div className="pb-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-xl font-black text-white">Productor Maestro</h1>
                            <span className="px-2 py-0.5 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[8px] uppercase font-black rounded-full">LEYENDA</span>
                        </div>
                        <p className="text-[#666] text-xs mb-2">@productor-maestro · contacto@dagraba.studio</p>
                        <div className="flex gap-2">
                            <button onClick={() => router.push('/es/artist/productor-maestro')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-bold text-white transition-all">
                                <ExternalLink size={11} /> Ver Perfil Público
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 rounded-lg text-[10px] font-bold text-orange-400 transition-all">
                                <Share2 size={11} /> Compartir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#1A1A1A] bg-[#080808] px-8 shrink-0 overflow-x-auto">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3.5 text-[10px] font-black tracking-widest uppercase border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-orange-500 text-orange-400' : 'border-transparent text-[#555] hover:text-[#888]'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-8 animate-in fade-in duration-300">

                {/* MI MÚSICA */}
                {activeTab === 'music' && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center justify-between">
                            <div><h2 className="text-xl font-black text-white">Mi Música</h2><p className="text-sm text-[#666] mt-1">Todas tus canciones y su rendimiento.</p></div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#222] rounded-xl text-xs font-bold text-[#888] hover:text-white transition-all"><BarChart3 size={13} /> Analíticas</button>
                                <button className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-500 rounded-xl text-xs font-bold text-white transition-all"><Plus size={13} /> Nueva</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { l: 'Total Plays', v: '29.3K', color: 'text-cyan-400', bg: 'from-cyan-500/10', i: <Headphones size={16} /> },
                                { l: 'Total Likes', v: '2,068', color: 'text-red-400', bg: 'from-red-500/10', i: <Heart size={16} /> },
                                { l: 'Canciones', v: '34', color: 'text-orange-400', bg: 'from-orange-500/10', i: <Music size={16} /> },
                                { l: 'Seguidores', v: '2.4K', color: 'text-purple-400', bg: 'from-purple-500/10', i: <Users size={16} /> },
                            ].map(s => (
                                <div key={s.l} className={`bg-gradient-to-br ${s.bg} to-transparent border border-white/5 rounded-2xl p-4`}>
                                    <div className={`${s.color} mb-2`}>{s.i}</div>
                                    <div className="text-2xl font-black text-white">{s.v}</div>
                                    <div className="text-[9px] text-[#555] uppercase tracking-widest mt-1">{s.l}</div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            {MOCK_SONGS.map((song, i) => (
                                <div key={song.id} className="group flex items-center gap-4 p-4 bg-[#0A0A0C] hover:bg-[#111] border border-white/5 hover:border-white/10 rounded-2xl transition-all">
                                    <span className="text-[#333] text-xs font-mono w-5">{String(i + 1).padStart(2, '0')}</span>
                                    <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0">
                                        <img src={song.image} alt="" className="w-full h-full object-cover" />
                                        <button onClick={() => setPlayingId(playingId === song.id ? null : song.id)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            {playingId === song.id ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" className="ml-0.5" />}
                                        </button>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-sm font-bold text-white truncate">{song.title}</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[7px] font-black tracking-widest ${song.source === 'SPOTIFY' ? 'bg-green-500/20 text-green-400' : song.source === 'LAST.FM' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>{song.source}</span>
                                        </div>
                                        <span className="text-[11px] text-[#555] italic">{song.style}</span>
                                    </div>
                                    <div className="flex items-center gap-5 text-[11px] text-[#444] font-bold">
                                        <span className="flex items-center gap-1"><Eye size={10} /> {song.views}</span>
                                        <span className="flex items-center gap-1"><Heart size={10} /> {song.likes}</span>
                                        <span className="font-mono text-[#333]">{song.duration}</span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button onClick={() => setShareOpen(song.id)} className="p-2 hover:bg-white/5 rounded-lg text-[#555] hover:text-white"><Share2 size={13} /></button>
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-[#555] hover:text-white"><MoreVertical size={13} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PERFIL PÚBLICO */}
                {activeTab === 'public' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div><h2 className="text-xl font-black text-white mb-1">Perfil Público</h2><p className="text-sm text-[#666]">Así te ven los demás en DA GRABA.</p></div>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Nombre Artístico</label>
                                <input type="text" defaultValue="Productor Maestro" className="w-full bg-[#111] border border-[#333] rounded-xl p-3.5 text-sm text-white focus:border-orange-500 outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Username (URL del perfil)</label>
                                <div className="flex">
                                    <span className="flex items-center px-4 bg-[#0A0A0C] border border-r-0 border-[#333] rounded-l-xl text-xs text-[#555]">dagraba.studio/artist/</span>
                                    <input type="text" defaultValue="productor-maestro" className="flex-1 bg-[#111] border border-[#333] rounded-r-xl p-3.5 text-sm text-white focus:border-orange-500 outline-none transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Bio</label>
                                <textarea defaultValue="Productor y compositor. Creando música que mueve el alma desde República Dominicana 🇩🇴" className="w-full h-24 bg-[#111] border border-[#333] rounded-xl p-3.5 text-sm text-white focus:border-orange-500 outline-none resize-none transition-colors custom-scrollbar" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-3">Redes Sociales</p>
                                <div className="space-y-3">
                                    {[{ l: 'Instagram', p: '@usuario' }, { l: 'TikTok', p: '@usuario' }, { l: 'YouTube', p: 'youtube.com/c/...' }, { l: 'SoundCloud', p: 'soundcloud.com/...' }].map(s => (
                                        <div key={s.l} className="flex items-center gap-3">
                                            <span className="w-24 text-xs font-bold text-[#555]">{s.l}</span>
                                            <input type="text" placeholder={s.p} className="flex-1 bg-[#111] border border-[#333] rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none transition-colors placeholder:text-[#333]" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-[#1A1A1A]">
                                <button onClick={() => router.push('/es/artist/productor-maestro')} className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#222] rounded-xl text-xs font-bold text-[#888] hover:text-white transition-all"><ExternalLink size={13} /> Previsualizar</button>
                                <button className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all"><Save size={14} /> GUARDAR</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* SPOTIFY */}
                {activeTab === 'spotify' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex items-center justify-between">
                            <div><h2 className="text-xl font-black text-white mb-1">Spotify</h2><p className="text-sm text-[#666]">Importa canciones de Spotify a tu perfil DA GRABA.</p></div>
                            {spotifyConnected && <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-xl text-xs font-bold text-green-400"><CheckCircle2 size={13} /> Conectado</span>}
                        </div>
                        {!spotifyConnected ? (
                            <div className="flex flex-col items-center py-16 bg-[#0A0A0C] border border-[#1A1A1A] rounded-3xl text-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/30 flex items-center justify-center text-[#1DB954]"><SpotifyIcon /></div>
                                <div><h3 className="text-lg font-black text-white mb-2">Conecta tu cuenta de Spotify</h3><p className="text-sm text-[#666] max-w-sm mx-auto">Vincula tu perfil de artista para importar canciones y sincronizar métricas.</p></div>
                                <button onClick={() => setSpotifyConnected(true)} className="flex items-center gap-3 px-8 py-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-black text-sm rounded-2xl transition-all shadow-[0_0_30px_rgba(29,185,84,0.3)]"><SpotifyIcon /> CONECTAR CON SPOTIFY</button>
                                <p className="text-[10px] text-[#444]">OAuth2 oficial de Spotify. No almacenamos contraseñas.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#1DB954]/5 border border-[#1DB954]/20 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#1DB954]/20 flex items-center justify-center text-[#1DB954]"><SpotifyIcon /></div>
                                        <div><p className="text-sm font-bold text-white">Productor Maestro</p><p className="text-xs text-[#555]">42,800 seguidores en Spotify</p></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-[#111] border border-[#222] rounded-lg text-xs font-bold text-[#777] hover:text-white transition-all"><RefreshCw size={11} /> Sync</button>
                                        <button onClick={() => setSpotifyConnected(false)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-400"><X size={11} /> Desconectar</button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-[#444] uppercase tracking-widest">Tus Canciones</span>
                                    <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-lg text-xs font-bold text-[#1DB954] hover:bg-[#1DB954]/20 transition-all"><Download size={12} /> Importar Todo</button>
                                </div>
                                {MOCK_SPOTIFY.map(song => (
                                    <div key={song.id} className="flex items-center gap-4 p-4 bg-[#0A0A0C] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                                        <div className="w-9 h-9 rounded-lg bg-[#1DB954]/10 flex items-center justify-center text-[#1DB954] shrink-0"><Music size={14} /></div>
                                        <div className="flex-1 min-w-0"><p className="text-sm font-bold text-white truncate">{song.title}</p><p className="text-[11px] text-[#555]">{song.album} · {song.duration}</p></div>
                                        <span className="text-xs font-mono text-[#444]">{song.streams}</span>
                                        <button onClick={() => toggleImport(importedSpotify, setImportedSpotify, song.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${importedSpotify.has(song.id) ? 'bg-[#1DB954]/20 border border-[#1DB954]/40 text-[#1DB954]' : 'bg-[#111] border border-[#222] text-[#555] hover:text-white'}`}>
                                            {importedSpotify.has(song.id) ? <><CheckCircle2 size={12} /> Importado</> : <><Plus size={12} /> Importar</>}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* LAST.FM */}
                {activeTab === 'lastfm' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex items-center justify-between">
                            <div><h2 className="text-xl font-black text-white mb-1">Last.fm</h2><p className="text-sm text-[#666]">Sincroniza scrobbles e importa tus top tracks.</p></div>
                            {lastfmConnected && <span className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-bold text-red-400"><CheckCircle2 size={13} /> Conectado</span>}
                        </div>
                        {!lastfmConnected ? (
                            <div className="flex flex-col items-center py-16 bg-[#0A0A0C] border border-[#1A1A1A] rounded-3xl text-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 text-2xl"><LastFmIcon /></div>
                                <div><h3 className="text-lg font-black text-white mb-2">Conecta con Last.fm</h3><p className="text-sm text-[#666] max-w-sm mx-auto">Ingresa tu username de Last.fm para importar tu historial.</p></div>
                                <div className="flex gap-3">
                                    <input type="text" value={lastfmUser} onChange={e => setLastfmUser(e.target.value)} placeholder="Tu username de Last.fm" className="px-4 py-3 bg-[#111] border border-[#333] rounded-xl text-sm text-white focus:border-red-500 outline-none placeholder:text-[#333] w-56" />
                                    <button onClick={() => lastfmUser && setLastfmConnected(true)} className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-xl transition-all"><LastFmIcon /> CONECTAR</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-red-600/20 flex items-center justify-center text-red-500"><LastFmIcon /></div>
                                        <div><p className="text-sm font-bold text-white">@{lastfmUser || 'productor-maestro'}</p><p className="text-xs text-[#555]">64,360 scrobbles totales</p></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-[#111] border border-[#222] rounded-lg text-xs font-bold text-[#777] hover:text-white transition-all"><RefreshCw size={11} /> Sync</button>
                                        <button onClick={() => setLastfmConnected(false)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-400"><X size={11} /> Desconectar</button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-[#444] uppercase tracking-widest">Tus Top Tracks</span>
                                    <button className="flex items-center gap-1.5 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-lg text-xs font-bold text-red-400 hover:bg-red-600/20 transition-all"><Download size={12} /> Importar Todo</button>
                                </div>
                                {MOCK_LASTFM.map((song, i) => (
                                    <div key={song.id} className="flex items-center gap-4 p-4 bg-[#0A0A0C] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                                        <span className="text-[#333] font-mono text-sm w-5">#{i + 1}</span>
                                        <div className="flex-1"><p className="text-sm font-bold text-white">{song.title}</p><p className="text-[11px] text-[#555]">{song.scrobbles} scrobbles</p></div>
                                        <div className="w-20 bg-[#111] h-1.5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full" style={{ width: `${90 - i * 25}%` }} /></div>
                                        <button onClick={() => toggleImport(importedLastfm, setImportedLastfm, song.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${importedLastfm.has(song.id) ? 'bg-red-600/20 border border-red-600/40 text-red-400' : 'bg-[#111] border border-[#222] text-[#555] hover:text-white'}`}>
                                            {importedLastfm.has(song.id) ? <><CheckCircle2 size={12} /> Importado</> : <><Plus size={12} /> Importar</>}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* DAW PREFERENCIAS */}
                {activeTab === 'daw' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div><h2 className="text-xl font-black text-white mb-1">Preferencias del DAW</h2><p className="text-sm text-[#666]">Personaliza tu experiencia en la consola.</p></div>
                        {[
                            { t: 'Modo Oscuro Profundo', d: 'Negros puros (#000000) en lugar de grises oscuros.', on: true },
                            { t: 'Cargar último proyecto', d: 'Restaura faders y pistas al abrir el DAW.', on: true },
                            { t: 'Notificaciones de Render', d: 'Alertas push cuando un exporte MP4 termine.', on: false },
                            { t: 'Auto-guardar sesión', d: 'Guarda el estado del DAW cada 5 minutos.', on: true },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-[#0A0A0C] rounded-2xl border border-[#1A1A1A]">
                                <div><h3 className="text-sm font-bold text-white mb-0.5">{item.t}</h3><p className="text-xs text-[#555]">{item.d}</p></div>
                                <div className={`w-12 h-6 rounded-full relative cursor-pointer ${item.on ? 'bg-orange-600' : 'bg-[#222]'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.on ? 'right-1' : 'left-1'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* SUSCRIPCIÓN */}
                {activeTab === 'billing' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div><h2 className="text-xl font-black text-white mb-1">Suscripción y Límites</h2><p className="text-sm text-[#666]">Tu plan, créditos IA y almacenamiento.</p></div>
                        <div className="p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 rounded-2xl relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 opacity-10"><Shield size={100} /></div>
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 rounded-lg text-[9px] font-black tracking-widest uppercase mb-2 inline-block">Plan Activo</span>
                                    <h3 className="text-2xl font-black text-white mb-1">Pro + AI Infinite</h3>
                                    <p className="text-sm text-indigo-200">Facturación anual · Próximo cobro: 15 Dic, 2026</p>
                                </div>
                                <button className="px-6 py-3 bg-white text-black font-bold tracking-widest text-xs rounded-xl hover:scale-105 transition-all w-fit">GESTIONAR PLAN</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { l: 'Créditos IA (KIE)', i: <Zap size={15} className="text-yellow-500" />, cur: '450', max: '1000', note: 'Renovación mensual', c: 'from-yellow-600 to-yellow-400', pct: 45 },
                                { l: 'Almacenamiento', i: <HardDrive size={15} className="text-blue-500" />, cur: '42.5 GB', max: '50 GB', note: '⚠️ Cerca del límite', c: 'from-blue-600 to-red-500', pct: 85 },
                            ].map(item => (
                                <div key={item.l} className="bg-[#0A0A0C] border border-[#1A1A1A] p-5 rounded-2xl space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div><h4 className="text-sm font-bold text-white flex items-center gap-2">{item.i} {item.l}</h4><p className="text-xs text-[#555] mt-1">{item.note}</p></div>
                                        <span className="text-base font-black text-white">{item.cur} / {item.max}</span>
                                    </div>
                                    <div className="w-full bg-[#1A1A1A] h-2 rounded-full overflow-hidden"><div className={`bg-gradient-to-r ${item.c} h-full rounded-full`} style={{ width: `${item.pct}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── PAGOS TAB ─── */}
                {activeTab === 'pagos' && (
                    <div className="p-8 space-y-8 max-w-2xl mx-auto">

                        {/* Default Payment Method Selector */}
                        <div>
                            <h3 className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-3">Método Principal</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'stripe' as const, label: 'Stripe', icon: '⚡', color: 'text-purple-400', border: 'border-purple-500/30 hover:border-purple-400/60' },
                                    { id: 'paypal' as const, label: 'PayPal', icon: '🔵', color: 'text-blue-400', border: 'border-blue-500/30 hover:border-blue-400/60' },
                                    { id: 'card' as const, label: 'Tarjeta', icon: '💳', color: 'text-green-400', border: 'border-green-500/30 hover:border-green-400/60' },
                                ].map(method => (
                                    <button key={method.id} onClick={() => setDefaultPayment(method.id)}
                                        className={`flex flex-col items-center py-4 rounded-xl border-2 transition-all ${defaultPayment === method.id ? `${method.border} bg-white/5` : 'border-white/5 hover:border-white/10'}`}>
                                        <span className="text-2xl mb-2">{method.icon}</span>
                                        <span className={`text-xs font-black ${defaultPayment === method.id ? method.color : 'text-[#666]'}`}>{method.label}</span>
                                        {defaultPayment === method.id && <Check size={12} className="mt-1 text-green-400" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stripe */}
                        <div className="p-5 bg-[#0A0A0C] border border-[#1A1A1A] rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-lg">⚡</div>
                                    <div>
                                        <p className="text-sm font-black text-white">Stripe</p>
                                        <p className="text-[10px] text-[#555]">Acepta pagos directo en tu página</p>
                                    </div>
                                </div>
                                {stripeConnected
                                    ? <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-[10px] font-bold text-green-400">Conectado</span></div>
                                    : <button onClick={() => setStripeConnected(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black rounded-lg transition-all">CONECTAR</button>}
                            </div>
                            {stripeConnected && (
                                <div className="p-3 bg-[#111] border border-[#1A1A1A] rounded-xl flex items-center justify-between animate-in fade-in duration-200">
                                    <span className="text-xs text-[#666]">acct_1AbCdEfGhIjKlMnO</span>
                                    <button onClick={() => setStripeConnected(false)} className="text-[10px] font-bold text-red-400 hover:text-red-300">Desconectar</button>
                                </div>
                            )}
                        </div>

                        {/* PayPal */}
                        <div className="p-5 bg-[#0A0A0C] border border-[#1A1A1A] rounded-2xl space-y-3">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-lg">🔵</div>
                                <div>
                                    <p className="text-sm font-black text-white">PayPal</p>
                                    <p className="text-[10px] text-[#555]">Vincula tu cuenta PayPal para cobros</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <input type="email" placeholder="tu@paypal.com" value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)}
                                    className="flex-1 bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#3A3A3A] placeholder:text-[#333]" />
                                <button disabled={!paypalEmail.includes('@')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all ${paypalEmail.includes('@') ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-[#1A1A1A] text-[#444] cursor-not-allowed border border-[#2A2A2A]'}`}>GUARDAR</button>
                            </div>
                        </div>

                        {/* Credit/Debit Card */}
                        <div className="p-5 bg-[#0A0A0C] border border-[#1A1A1A] rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CreditCard size={18} className="text-green-400" />
                                    <div>
                                        <p className="text-sm font-black text-white">Tarjeta Débito / Crédito</p>
                                        <p className="text-[10px] text-[#555]">Visa · Mastercard · Discover</p>
                                    </div>
                                </div>
                                {/* No AMEX warning */}
                                <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                                    <AlertCircle size={10} className="text-red-400 shrink-0" />
                                    <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">No AMEX</span>
                                </div>
                            </div>

                            {/* Card Brand Badges */}
                            <div className="flex gap-2">
                                {[{ name: 'VISA', bg: 'bg-blue-900/40 border-blue-800/40 text-blue-300' }, { name: 'MC', bg: 'bg-orange-900/40 border-orange-800/40 text-orange-300' }, { name: 'DISC', bg: 'bg-orange-900/40 border-orange-700/40 text-orange-300' }].map(b => (
                                    <div key={b.name} className={`${b.bg} border px-2.5 py-1 rounded text-[9px] font-black`}>{b.name}</div>
                                ))}
                                <div className="bg-gray-900/40 border border-gray-700/40 text-gray-600 border px-2.5 py-1 rounded text-[9px] font-black line-through opacity-50">AMEX</div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-[9px] font-black text-[#444] uppercase tracking-widest">Número de tarjeta</label>
                                    <input type="text" placeholder="•••• •••• •••• ••••" maxLength={19}
                                        value={cardData.number}
                                        onChange={e => setCardData(p => ({ ...p, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() }))}
                                        className="w-full mt-1 bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#3A3A3A] placeholder:text-[#222] font-mono" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[9px] font-black text-[#444] uppercase tracking-widest">Vencimiento</label>
                                        <input type="text" placeholder="MM/AA" maxLength={5}
                                            value={cardData.expiry}
                                            onChange={e => setCardData(p => ({ ...p, expiry: e.target.value }))}
                                            className="w-full mt-1 bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#3A3A3A] placeholder:text-[#222]" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-[#444] uppercase tracking-widest">CVC</label>
                                        <input type="text" placeholder="•••" maxLength={3}
                                            value={cardData.cvc}
                                            onChange={e => setCardData(p => ({ ...p, cvc: e.target.value.replace(/\D/g, '') }))}
                                            className="w-full mt-1 bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#3A3A3A] placeholder:text-[#222]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-[#444] uppercase tracking-widest">Nombre en la tarjeta</label>
                                    <input type="text" placeholder="NOMBRE APELLIDO"
                                        value={cardData.name}
                                        onChange={e => setCardData(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                                        className="w-full mt-1 bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#3A3A3A] placeholder:text-[#222]" />
                                </div>
                            </div>

                            <button onClick={() => setCardSaved(true)}
                                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-xs tracking-widest rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                {cardSaved ? '✓ TARJETA GUARDADA' : 'GUARDAR TARJETA'}
                            </button>

                            <p className="text-[9px] text-[#333] text-center">🔒 Tu información de pago está segura y encriptada con TLS + Stripe Vault</p>
                        </div>
                    </div>
                )}
            </div>


            {/* Share Modal */}
            {shareOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShareOpen(null)}>
                    <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center"><h3 className="font-black text-white">Compartir Canción</h3><button onClick={() => setShareOpen(null)} className="text-[#555] hover:text-white"><X size={15} /></button></div>
                        <div className="flex items-center gap-2 p-3 bg-[#0A0A0C] border border-[#222] rounded-xl">
                            <span className="text-xs text-[#555] flex-1 truncate">dagraba.studio/track/{shareOpen}</span>
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
