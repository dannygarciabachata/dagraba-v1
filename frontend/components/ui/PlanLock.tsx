'use client';

import React from 'react';
import { Lock, Crown, Star, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface PlanLockProps {
    requiredPlan: 'pro' | 'premium';
    featureName: string;
}

export const PlanLock = ({ requiredPlan, featureName }: PlanLockProps) => {
    const router = useRouter();
    const locale = useLocale();

    const isPremium = requiredPlan === 'premium';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-700">
            <div className="max-w-md w-full bg-[#0A0A0C] border border-white/5 rounded-[32px] p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
                {/* Decorative Glow */}
                <div className={`absolute -top-24 -left-24 w-48 h-48 blur-[100px] opacity-20 rounded-full transition-colors duration-1000 ${isPremium ? 'bg-orange-500' : 'bg-cyan-glow'}`} />
                <div className={`absolute -bottom-24 -right-24 w-48 h-48 blur-[100px] opacity-20 rounded-full transition-colors duration-1000 ${isPremium ? 'bg-orange-500' : 'bg-cyan-glow'}`} />

                {/* Icon Container */}
                <div className={`w-20 h-20 rounded-3xl mb-8 flex items-center justify-center relative ${isPremium ? 'bg-orange-500/10 text-orange-500' : 'bg-cyan-glow/10 text-cyan-glow'}`}>
                    <div className="absolute inset-0 rounded-3xl blur-2xl opacity-50 bg-inherit" />
                    {isPremium ? <Crown size={32} className="relative z-10" /> : <Star size={32} className="relative z-10" />}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-black border border-white/10 rounded-full flex items-center justify-center translate-x-1 -translate-y-1 shadow-lg">
                        <Lock size={12} className="text-white/40" />
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-2xl font-black text-white tracking-tighter mb-4 uppercase">
                    {featureName} <span className={isPremium ? 'text-orange-500' : 'text-cyan-glow'}>Locked</span>
                </h2>
                <p className="text-silver-dark text-sm leading-relaxed mb-10 px-4">
                    The {featureName} is a professional tool reserved for our <span className="text-white font-bold">{requiredPlan.toUpperCase()}</span> members. Upgrade now to unlock your full sonic potential.
                </p>

                {/* Action Buttons */}
                <div className="w-full flex flex-col gap-3">
                    <button
                        onClick={() => router.push(`/${locale}/pricing`)}
                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all group/btn ${isPremium
                                ? 'bg-orange-600 text-white hover:bg-orange-500 shadow-[0_10px_30px_rgba(255,107,0,0.2)]'
                                : 'bg-cyan-glow text-black hover:bg-white shadow-[0_10px_30px_rgba(0,240,255,0.2)]'
                            }`}
                    >
                        Explore {requiredPlan.toUpperCase()} Plans
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-white/40 hover:text-white transition-colors"
                    >
                        Back to Safety
                    </button>
                </div>
            </div>
        </div>
    );
};
