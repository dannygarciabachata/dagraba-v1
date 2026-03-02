'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Library, FolderOpen, Music, HardDrive } from 'lucide-react';

export default function LibraryPage() {
    const t = useTranslations('Navigation');

    return (
        <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar bg-[#050505] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-2">
                <Library size={28} className="text-orange-500" />
                <h1 className="text-3xl font-black text-white">{t('library') || 'Librería'}</h1>
            </div>
            <p className="text-sm text-[#888] mb-12 max-w-2xl">
                Tus colecciones personales, stems extraídos y proyectos guardados estarán disponibles aquí.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0A0A0C] border border-[#1A1A1A] rounded-2xl p-6 hover:border-orange-500/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                        <FolderOpen size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Proyectos DAW</h3>
                    <p className="text-xs text-[#666]">Sesiones del estudio y mezclas guardadas.</p>
                </div>

                <div className="bg-[#0A0A0C] border border-[#1A1A1A] rounded-2xl p-6 hover:border-cyan-500/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                        <Music size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Stems Extraídos</h3>
                    <p className="text-xs text-[#666]">Tus asilamientos vocales e instrumentales listos para usar.</p>
                </div>

                <div className="bg-[#0A0A0C] border border-[#1A1A1A] rounded-2xl p-6 hover:border-purple-500/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                        <HardDrive size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Presets y Cadenas</h3>
                    <p className="text-xs text-[#666]">Configuraciones peronsales de EQ y Masterización.</p>
                </div>
            </div>
        </div>
    );
}
