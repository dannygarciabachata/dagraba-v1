'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Music, ListMusic, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface Playlist {
    id: string;
    name: string;
    description: string | null;
}

interface AddToPlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    trackId: string;
    trackTitle: string;
}

export function AddToPlaylistModal({ isOpen, onClose, trackId, trackTitle }: AddToPlaylistModalProps) {
    const t = useTranslations('Playlist');
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchPlaylists();
        }
    }, [isOpen]);

    const fetchPlaylists = async () => {
        try {
            const res = await fetch('/api/playlists');
            const data = await res.json();
            setPlaylists(data);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/playlists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newPlaylistName })
            });
            if (res.ok) {
                const newPlaylist = await res.json();
                setPlaylists(prev => [...prev, newPlaylist]);
                setNewPlaylistName('');
                setIsCreating(false);
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToPlaylist = async (playlistId: string) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/playlists/add-track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playlistId, sampleId: trackId })
            });
            if (res.ok) {
                setMessage(t('added'));
                setTimeout(() => {
                    setMessage('');
                    onClose();
                }, 1500);
            } else {
                setMessage(t('error'));
            }
        } catch (error) {
            console.error('Error adding to playlist:', error);
            setMessage(t('error'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white">{t('addToPlaylist')}</h2>
                            <p className="text-xs text-white/50 mt-1">{t('selectPlaylist', { track: trackTitle })}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/50 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {message && (
                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-lg flex items-center gap-2">
                            <Check size={16} /> {message}
                        </div>
                    )}

                    <div className="max-h-[300px] overflow-y-auto mb-6 custom-scrollbar pr-2">
                        {playlists.length === 0 && !isCreating ? (
                            <div className="text-center py-8">
                                <ListMusic className="mx-auto text-white/10 mb-3" size={48} />
                                <p className="text-white/40 text-sm">{t('noPlaylists')}</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {playlists.map(playlist => (
                                    <button
                                        key={playlist.id}
                                        onClick={() => handleAddToPlaylist(playlist.id)}
                                        disabled={isLoading}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group text-left"
                                    >
                                        <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                                            <Music size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-white">{playlist.name}</div>
                                        </div>
                                        <Plus size={18} className="text-white/20 group-hover:text-white transition-colors" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {!isCreating ? (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/10 rounded-2xl text-white/50 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all font-bold"
                        >
                            <Plus size={20} />
                            {t('createNew')}
                        </button>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <input
                                autoFocus
                                type="text"
                                placeholder={t('namePlaceholder')}
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="flex-1 p-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    onClick={handleCreatePlaylist}
                                    disabled={isLoading || !newPlaylistName.trim()}
                                    className="flex-1 p-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? t('creating') : t('create')}
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
