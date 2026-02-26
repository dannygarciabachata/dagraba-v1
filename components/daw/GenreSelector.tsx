'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, ChevronDown, X, Sparkles } from 'lucide-react';
import { MUSIC_GENRES, COMMON_GENRES, Genre } from '@/lib/constants/genres';

interface GenreSelectorProps {
    onSelect: (genre: string) => void;
}

export function GenreSelector({ onSelect }: GenreSelectorProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    const toggleGroup = (name: string) => {
        setExpandedGroups(prev =>
            prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]
        );
    };

    const filteredGenres = useMemo(() => {
        if (!searchQuery) return MUSIC_GENRES;

        const filterRecursive = (genres: Genre[]): Genre[] => {
            return genres.reduce((acc: Genre[], genre) => {
                const matches = genre.name.toLowerCase().includes(searchQuery.toLowerCase());
                const childrenMatches = genre.children ? filterRecursive(genre.children) : [];

                if (matches || childrenMatches.length > 0) {
                    acc.push({
                        ...genre,
                        children: childrenMatches.length > 0 ? childrenMatches : genre.children
                    });
                }
                return acc;
            }, []);
        };

        return filterRecursive(MUSIC_GENRES);
    }, [searchQuery]);

    return (
        <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-bold tracking-widest text-silver-dark uppercase">Explorar Géneros</span>
                <span className="text-[10px] text-cyan-glow font-mono animate-pulse">EL EXPERTO SABE TODOS</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar items-center">
                {COMMON_GENRES.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => onSelect(genre)}
                        className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-silver-light hover:bg-cyan-glow/20 hover:border-cyan-glow hover:text-white transition-all active:scale-95"
                    >
                        {genre}
                    </button>
                ))}

                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="whitespace-nowrap px-4 py-2 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 text-xs text-cyan-glow hover:bg-cyan-glow/20 transition-all italic flex items-center gap-2"
                >
                    + Otros
                </button>
            </div>

            {/* FULL LIST MODAL / OVERLAY */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    <div className="relative w-full max-w-2xl bg-[#0B1015] border border-white/10 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[80vh]">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <Sparkles size={16} className="text-cyan-glow" />
                                <h3 className="text-sm font-bold tracking-widest text-white uppercase">Biblioteca de Géneros</h3>
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={18} className="text-silver-dark" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4 bg-black/40 border-b border-white/5">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-dark" size={16} />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Busca un género específico..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-silver-light focus:outline-none focus:border-cyan-glow/50 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* List Area */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {filteredGenres.map((genre) => (
                                    <GenreItem
                                        key={genre.name}
                                        genre={genre}
                                        onSelect={(name) => {
                                            onSelect(name);
                                            setIsMenuOpen(false);
                                        }}
                                        expandedGroups={expandedGroups}
                                        toggleGroup={toggleGroup}
                                        level={0}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function GenreItem({
    genre,
    onSelect,
    expandedGroups,
    toggleGroup,
    level
}: {
    genre: Genre;
    onSelect: (name: string) => void;
    expandedGroups: string[];
    toggleGroup: (name: string) => void;
    level: number;
}) {
    const hasChildren = genre.children && genre.children.length > 0;
    const isExpanded = expandedGroups.includes(genre.name);

    return (
        <div className="flex flex-col">
            <div
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer group ${level === 0 ? 'bg-white/5 hover:bg-white/10 border border-white/5' : 'hover:bg-white/5'
                    }`}
                onClick={() => {
                    if (hasChildren) {
                        toggleGroup(genre.name);
                    } else {
                        onSelect(genre.name);
                    }
                }}
            >
                <div className="flex-1 text-sm text-silver-light group-hover:text-white transition-colors">
                    {genre.name}
                </div>
                {hasChildren && (
                    isExpanded ? <ChevronDown size={14} className="text-cyan-glow" /> : <ChevronRight size={14} className="text-silver-dark" />
                )}
            </div>

            {hasChildren && isExpanded && (
                <div className="ml-4 flex flex-col gap-1 border-l border-white/10 pl-2 mt-1">
                    {genre.children!.map((child) => (
                        <GenreItem
                            key={child.name}
                            genre={child}
                            onSelect={onSelect}
                            expandedGroups={expandedGroups}
                            toggleGroup={toggleGroup}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
