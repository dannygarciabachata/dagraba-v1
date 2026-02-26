import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDAWStore } from '@/store/useDAWStore';

export function StudioMonitor({ className = '' }: { className?: string }) {
    const masterLevel = useDAWStore((state) => state.masterLevel);
    const isPlaying = useDAWStore((state) => state.isPlaying);

    // Calculate pulse intensity: 1.0 (base) to 1.05 (max kick)
    // We dampen it so it's "cool" but not distracting
    const pulseScale = useMemo(() => {
        if (!isPlaying) return 1;
        const level = masterLevel; // 0 to 1
        return 1 + (level * 0.05); // Max 5% expansion
    }, [masterLevel, isPlaying]);

    // Woofer specific pulse (stronger)
    const wooferScale = useMemo(() => {
        if (!isPlaying) return 1;
        return 1 + (masterLevel * 0.12); // Max 12% expansion for the cone
    }, [masterLevel, isPlaying]);

    return (
        <div className={`flex flex-col items-center justify-center w-64 h-96 ${className}`}>
            {/* Speaker Cabinet (The wooden box) */}
            <motion.div
                animate={{ scale: pulseScale }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-full h-full bg-[#1A1A1C] border border-[#222] rounded-md shadow-[-20px_0_50px_rgba(0,0,0,0.8),20px_0_50px_rgba(0,0,0,0.8),inset_0_4px_10px_rgba(255,255,255,0.02)] flex flex-col items-center py-8 relative justify-between"
            >

                {/* Wood Grain Texture Overlay */}
                <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay opacity-10 pointer-events-none rounded-md" />

                {/* Top Tweeter */}
                <div className="w-24 h-24 rounded-full bg-[#2A2A2D] border-2 border-[#111] shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)] flex items-center justify-center relative z-10">
                    <div className="w-12 h-12 rounded-full bg-black/80 blur-[2px] absolute" />
                    {/* Tweeter Cone Details */}
                    <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#3A3A3D] shadow-[0_0_10px_rgba(0,0,0,0.9)]" />
                        <div className="absolute w-[2px] h-3 bg-[#444] top-8" />
                        <div className="absolute w-[2px] h-3 bg-[#444] top-[48px] -rotate-[120deg] left-10" />
                        <div className="absolute w-[2px] h-3 bg-[#444] top-[48px] rotate-[120deg] right-10" />
                    </div>
                </div>

                {/* Bottom Woofer */}
                <div className="w-48 h-48 rounded-full bg-[#202022] border-[4px] border-[#0a0a0a] shadow-[inset_0_10px_30px_rgba(0,0,0,0.9),0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center relative mt-auto z-10">
                    {/* White Woofer Cone - Animated scale for vibration */}
                    <motion.div
                        animate={{ scale: wooferScale }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="w-36 h-36 rounded-full bg-gradient-to-br from-[#f0f0f0] to-[#aaaaaa] shadow-[inset_0_-5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center"
                    >
                        {/* Center Dust Cap */}
                        <div className="w-16 h-16 rounded-full bg-[#d0d0d0] border border-white/40 shadow-[0_2px_5px_rgba(0,0,0,0.2)]" />
                    </motion.div>
                </div>

            </motion.div>

            {/* Monitor Base Shadow - Also pulse slightly */}
            <motion.div
                animate={{ scaleX: pulseScale, opacity: 0.7 + (masterLevel * 0.3) }}
                className="w-48 h-4 bg-black/90 blur-xl mt-2 rounded-full"
            />
        </div>
    );
}
