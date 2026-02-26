'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RefreshCw, Power } from 'lucide-react';
import { useDAWStore } from '@/store/useDAWStore';

export function CloudStatusPanel() {
    const cloudStatus = useDAWStore((state) => state.cloudStatus);
    const systemMessage = useDAWStore((state) => state.systemMessage);
    const setCloudStatus = useDAWStore((state) => state.setCloudStatus);

    const [showNotification, setShowNotification] = useState(false);

    const handleDeploy = async () => {
        if (cloudStatus === 'connecting' || cloudStatus === 'connected') return;

        setCloudStatus('connecting', 'Conectando con el cerebro en la nube...');

        try {
            const formData = new FormData();
            formData.append('type', 'audio');

            const res = await fetch('/api/train', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                setCloudStatus('connected', 'Motor V1 Activo.');
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 5000);
            } else {
                setCloudStatus('disconnected', 'Fallo en la conexión.');
            }
        } catch (error) {
            console.error(error);
            setCloudStatus('disconnected', 'Error de red.');
        }
    };

    return (
        <div className="w-full px-2 lg:px-4 mb-4">
            <div className="bg-black/30 backdrop-blur-md border border-white/5 lg:rounded-xl p-2 flex flex-col gap-2 shadow-inner ring-1 ring-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        {/* LED Indicator */}
                        <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] transition-colors duration-300 ${cloudStatus === 'connected' ? 'bg-[#00F0FF] text-[#00F0FF]' :
                            cloudStatus === 'connecting' ? 'bg-[#FF6B00] text-[#FF6B00] animate-pulse' :
                                'bg-[#333] text-transparent'
                            }`} />
                        <span className="text-[8px] font-black tracking-[0.2em] text-white/30 uppercase hidden lg:block whitespace-nowrap">
                            Modal Engine
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <button
                        onClick={handleDeploy}
                        disabled={cloudStatus === 'connecting' || cloudStatus === 'connected'}
                        className={`flex items-center justify-center gap-2 w-full py-1.5 rounded-lg transition-all duration-300 text-[9px] font-black tracking-widest border ${cloudStatus === 'connecting'
                            ? 'bg-[#FF6B00]/20 border-[#FF6B00]/30 text-[#FF6B00]'
                            : cloudStatus === 'connected'
                                ? 'bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                                : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/60 hover:text-white'
                            }`}
                    >
                        {cloudStatus === 'connecting' ? (
                            <RefreshCw size={10} className="animate-spin" />
                        ) : (
                            <Power size={10} className={cloudStatus === 'connected' ? 'animate-pulse' : ''} />
                        )}
                        <span className="hidden lg:block truncate">
                            {cloudStatus === 'connecting' ? 'WAITING' : cloudStatus === 'connected' ? 'MOTOR ON' : 'DEPLOY AI'}
                        </span>
                    </button>

                    {/* Compact status text */}
                    <div className="hidden lg:block px-1">
                        <p className={`text-[7px] font-medium leading-tight truncate ${cloudStatus === 'connected' ? 'text-cyan-400/60' : cloudStatus === 'connecting' ? 'text-orange-400/60' : 'text-neutral-600'}`}>
                            {cloudStatus === 'connected' ? 'CONEXIÓN ACTIVA' : cloudStatus === 'connecting' ? 'DESPLEGANDO...' : 'MOTOR EN REPOSO'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Global notification - preserved but subtle */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, y: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="fixed top-6 right-6 z-[100] bg-[#0A0A0C] border border-[#00F0FF]/50 shadow-2xl rounded-lg p-3 flex items-center gap-3 ring-1 ring-[#00F0FF]/20"
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#00A3FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                            <CheckCircle2 size={12} className="text-black" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black tracking-widest text-white uppercase">Engine Connected</p>
                            <p className="text-[9px] text-[#A0A0A0] mt-0.5">Motor V1 Activo.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
