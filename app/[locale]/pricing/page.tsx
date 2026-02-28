'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Check, Zap, Crown, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

const PLANS = [
    {
        id: 'free',
        name: 'Free Trial',
        price: '0',
        credits: '100',
        features: [
            '100 initial credits',
            'Max 2 minute generations',
            'Standard AI Models',
            'Community Support'
        ],
        icon: Zap,
        color: 'text-silver-dark',
        border: 'border-white/5',
        bg: 'bg-white/5'
    },
    {
        id: 'pro',
        name: 'Pro Artist',
        price: '19',
        credits: '2,500',
        features: [
            '2,500 credits per month',
            'Unlimited audio length',
            'V6 High-Fidelity Models',
            'Engineer John Priority',
            'Private generations'
        ],
        icon: Star,
        color: 'text-cyan-glow',
        border: 'border-cyan-glow/30',
        bg: 'bg-cyan-glow/10',
        popular: true
    },
    {
        id: 'premium',
        name: 'Premium Studio',
        price: '49',
        credits: '10,000',
        features: [
            '10,000 credits per month',
            'All Pro features included',
            'Multi-track stem extraction',
            'Advanced AI Mastering',
            'API Access (Beta)',
            '24/7 Dedicated Support'
        ],
        icon: Crown,
        color: 'text-orange-500',
        border: 'border-orange-500/30',
        bg: 'bg-orange-500/10'
    }
];

export default function PricingPage() {
    const locale = useLocale();
    const { plan, setPlan } = useUserStore();
    const [acceptedTerms, setAcceptedTerms] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isCurrentPlan = (id: string) => mounted && plan === id;

    return (
        <div className="flex flex-col h-full bg-[#050505] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col items-center pt-24 pb-16 px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
                    Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-blue-600">Sonic Edge</span>
                </h1>
                <p className="max-w-xl text-silver-dark text-lg leading-relaxed">
                    Scale your creativity with professional credits and advanced AI models tailored for every stage of your music career.
                </p>
            </div>

            {/* Plans Grid */}
            <div className="container max-w-6xl mx-auto px-6 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PLANS.map((p) => (
                        <div
                            key={p.id}
                            className={`relative group flex flex-col p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] ${p.border} ${p.bg} ${isCurrentPlan(p.id) ? 'ring-2 ring-cyan-glow shadow-[0_0_40px_rgba(0,240,255,0.1)]' : 'hover:shadow-2xl'}`}
                        >
                            {p.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-glow to-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest text-black shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-8">
                                <div className={`w-12 h-12 rounded-2xl ${p.bg} flex items-center justify-center ${p.color} border border-white/5`}>
                                    <p.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white">{p.name}</h3>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${p.color}`}>
                                        {p.credits} Credits
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-5xl font-black text-white tracking-tighter">${p.price}</span>
                                <span className="text-silver-dark font-medium">/mo</span>
                            </div>

                            <ul className="flex-1 space-y-4 mb-10">
                                {p.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-silver-light">
                                        <Check size={16} className={`${p.color} shrink-0 mt-0.5`} />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => {
                                    if (p.id !== 'free' && !acceptedTerms) {
                                        alert('Please accept the Terms of Service and Privacy Policy to continue.');
                                        return;
                                    }
                                    setPlan(p.id as any);
                                }}
                                disabled={isCurrentPlan(p.id)}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${p.id === 'pro'
                                    ? (acceptedTerms || (p.id as string) === 'free' ? 'bg-cyan-glow text-black hover:bg-white shadow-[0_10px_30px_rgba(0,240,255,0.3)]' : 'bg-white/10 text-white/30 cursor-not-allowed')
                                    : p.id === 'premium'
                                        ? (acceptedTerms || (p.id as string) === 'free' ? 'bg-orange-600 text-white hover:bg-orange-500 shadow-[0_10px_30px_rgba(234,88,12,0.3)]' : 'bg-white/10 text-white/30 cursor-not-allowed')
                                        : 'bg-white/5 text-white hover:bg-white/10'
                                    } ${isCurrentPlan(p.id) ? 'opacity-50 cursor-default' : ''}`}
                            >
                                {isCurrentPlan(p.id) ? 'Current Plan' : `Get ${p.name}`}
                                {!isCurrentPlan(p.id) && <ArrowRight size={14} />}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Terms Acceptance */}
                <div className="mt-12 flex items-center justify-center gap-3 py-6 px-8 rounded-2xl bg-white/[0.02] border border-white/5 max-w-2xl mx-auto shadow-inner">
                    <div
                        onClick={() => setAcceptedTerms(!acceptedTerms)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${acceptedTerms ? 'bg-cyan-glow border-cyan-glow shadow-[0_0_15px_rgba(0,240,255,0.5)]' : 'border-white/20 hover:border-white/40'}`}
                    >
                        {acceptedTerms && <Check size={14} className="text-black font-black" />}
                    </div>
                    <p className="text-xs text-silver-dark font-medium cursor-pointer select-none" onClick={() => setAcceptedTerms(!acceptedTerms)}>
                        I accept the <Link href={`/${locale}/terms`} className="text-white hover:text-cyan-glow underline underline-offset-4 decoration-white/20">Terms of Service</Link> and <Link href={`/${locale}/privacy`} className="text-white hover:text-cyan-glow underline underline-offset-4 decoration-white/20">Privacy Policy</Link> for iHOSTcast Ltd.
                    </p>
                </div>

                {/* Trust Footer */}
                <div className="mt-24 p-12 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-cyan-glow">
                            <ShieldCheck size={24} />
                            <h4 className="text-xl font-bold text-white tracking-tight">Enterprise Level Security</h4>
                        </div>
                        <p className="text-sm text-silver-dark max-w-md">Your audio and data are protected with 256-bit encryption. Professional rights and licensing included in all paid plans.</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-white">99.9%</span>
                            <span className="text-[10px] text-[#444] uppercase font-black">Uptime</span>
                        </div>
                        <div className="w-px h-12 bg-white/5" />
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-white">24/7</span>
                            <span className="text-[10px] text-[#444] uppercase font-black">Expert Help</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
