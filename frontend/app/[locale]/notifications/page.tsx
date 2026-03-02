'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
    const t = useTranslations('Navigation');

    return (
        <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar bg-[#050505] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-2">
                <Bell size={28} className="text-orange-500" />
                <h1 className="text-3xl font-black text-white">{t('notifications') || 'Notificaciones'}</h1>
            </div>
            <p className="text-sm text-[#888] mb-12 max-w-2xl">
                Tus alertas de renderizado, interacciones y actualizaciones de sistema.
            </p>

            <div className="flex flex-col items-center justify-center py-20 bg-[#0A0A0C] border border-[#1A1A1A] rounded-2xl text-center">
                <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center text-[#333] mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Todo al día</h3>
                <p className="text-sm text-[#666] max-w-sm">
                    Actualmente no tienes notificaciones nuevas. Te avisaremos cuando tus stems estén listos o haya actividad en tus canciones.
                </p>
            </div>
        </div>
    );
}
