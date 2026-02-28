'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Music, Github, Twitter, Instagram } from 'lucide-react';

export const Footer = () => {
    const locale = useLocale();
    const t = useTranslations('Footer');

    return (
        <footer className="w-full bg-black border-t border-white/5 pt-20 pb-10">
            <div className="container px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    {/* Brand */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                <Music size={20} className="text-black" />
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase italic">Da Graba</span>
                        </div>
                        <p className="text-silver-dark text-xs leading-relaxed max-w-[240px]">
                            Defining the future of AI-powered music production. Professional tools for the next generation of sound.
                        </p>
                        <div className="flex gap-4">
                            <Twitter size={16} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                            <Instagram size={16} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                            <Github size={16} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Studio</h4>
                        <ul className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest">
                            <li><Link href={`/${locale}/planer`} className="text-silver-dark hover:text-cyan-glow transition-colors">AI Mixer</Link></li>
                            <li><Link href={`/${locale}/crear`} className="text-silver-dark hover:text-orange-500 transition-colors">AI Creator</Link></li>
                            <li><Link href={`/${locale}/mastering`} className="text-silver-dark hover:text-purple-500 transition-colors">AI Mastering</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">iHOSTcast</h4>
                        <ul className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest">
                            <li><Link href={`/${locale}/pricing`} className="text-silver-dark hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href={`/${locale}/about`} className="text-silver-dark hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href={`/`} className="text-silver-dark hover:text-white transition-colors">Affiliates</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Legal</h4>
                        <ul className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest">
                            <li><Link href={`/${locale}/terms`} className="text-silver-dark hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href={`/${locale}/privacy`} className="text-silver-dark hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href={`/${locale}/cookies`} className="text-silver-dark hover:text-white transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
                        © 2026 iHOSTcast Ltd. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">System Status: Optimal</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
