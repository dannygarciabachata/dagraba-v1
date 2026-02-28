'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, BookOpen, Cookie } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const links = [
        { href: '/terms', label: 'Términos', icon: BookOpen },
        { href: '/privacy', label: 'Privacidad', icon: Shield },
        { href: '/cookies', label: 'Cookies', icon: Cookie },
    ];

    // Remove locale prefix for matching
    const currentPath = pathname?.replace(/^\/[a-z]{2}/, '') || '';

    return (
        <div className="min-h-screen bg-[#0A0A0C] text-[#E0E0E0] font-sans selection:bg-cyan-500/30 selection:text-cyan-100 flex flex-col items-center">

            {/* Header / Nav */}
            <div className="w-full bg-[#111113]/80 backdrop-blur-xl border-b border-[#222] sticky top-0 z-50 shadow-2xl">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00] to-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.5)] group-hover:shadow-[0_0_25px_rgba(255,107,0,0.8)] transition-all">
                            <span className="text-black font-black tracking-tighter text-xs">DG</span>
                        </div>
                        <span className="font-bold tracking-widest text-[#FFF] text-sm uppercase group-hover:text-cyan-400 transition-colors">Da Graba Studio</span>
                    </Link>

                    <nav className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                        {links.map((link) => {
                            const isActive = currentPath === link.href || currentPath.startsWith(link.href);
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${isActive
                                            ? 'bg-[#222] text-cyan-400 shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)] border border-white/5'
                                            : 'text-[#888] hover:text-[#E0E0E0] hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={14} className={isActive ? "text-cyan-400" : "text-[#666]"} />
                                    <span className="hidden sm:inline-block">{link.label}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/* Document Content */}
            <main className="w-full max-w-3xl mx-auto px-6 py-12 md:py-20 flex-1">
                <article className="prose prose-invert prose-orange max-w-none">
                    {children}
                </article>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-[#222] bg-[#0A0A0C] py-8 mt-auto">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="text-[#666] text-xs font-mono tracking-widest uppercase mb-2">
                        © 2026 DAGRABA STUDIO & ODGMUSIC LATIN WORLDWIDE PUBLISHING
                    </p>
                    <p className="text-[#444] text-[10px] tracking-widest uppercase">
                        Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
