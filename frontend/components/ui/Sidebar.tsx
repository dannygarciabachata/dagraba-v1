'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic2, LayoutDashboard, SlidersHorizontal, User, Settings, Wand2, Compass, Languages, LogIn, LogOut, Library, Bell } from 'lucide-react';
import { CloudStatusPanel } from './CloudStatusPanel';
import { ThemeToggle } from './ThemeToggle';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { useUserStore } from '@/store/useUserStore';
import { Coins } from 'lucide-react';

const navItems = [
    { id: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
    { id: 'explorer', href: '/explorer', icon: Compass },
    { id: 'planer', href: '/planer', icon: Mic2 },
    { id: 'crear', href: '/crear', icon: Wand2 },
    { id: 'studio', href: '/studio', icon: SlidersHorizontal },
    { id: 'mastering', href: '/mastering', icon: SlidersHorizontal },
    { id: 'library', href: '/library', icon: Library },
    { id: 'notifications', href: '/notifications', icon: Bell },
    { id: 'profile', href: '/profile', icon: User },
];

const locales = ['en', 'es', 'pt', 'fr', 'de', 'it', 'ja'];

export function Sidebar() {
    const t = useTranslations('Navigation');
    const tl = useTranslations('Languages');
    const pathname = usePathname();
    const currentLocale = useLocale();

    const { user, logout, setLoginModalOpen } = useAuth();
    const [mounted, setMounted] = React.useState(false);
    const credits = useUserStore(state => state.credits);
    const plan = useUserStore(state => state.plan);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Helper to get localized href
    const getLocalizedHref = (href: string) => `/${currentLocale}${href}`;

    // Helper to switch locale while keeping the path
    const getSwitchLocaleHref = (newLocale: string) => {
        if (!pathname) return `/${newLocale}`;
        const segments = pathname.split('/');
        segments[1] = newLocale;
        return segments.join('/');
    };

    return (
        <aside className="w-16 lg:w-64 h-full flex flex-col justify-between py-8 z-50 relative transition-all duration-500"
            style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)', boxShadow: '10px 0 30px rgba(0,0,0,0.6)' }}
        >
            <div className="flex flex-col items-center w-full">
                {/* Logo Text/Icon */}
                <div className="w-full px-4 mb-10 flex justify-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(255,107,0,0.3)] border border-orange-500/10 transform hover:scale-110 transition-all duration-500 cursor-pointer">
                        <img src="/logo.jpg" alt="DA GRABA Logo" className="w-full h-full object-cover" />
                    </div>
                </div>
                {/* Navigation Links */}
                <nav className="flex flex-col gap-2 w-full px-3">
                    {navItems.filter(item => {
                        // Restricted items for guest users
                        if (!user && (item.id === 'dashboard' || item.id === 'library' || item.id === 'notifications')) {
                            return false;
                        }
                        return true;
                    }).map((item) => {
                        const hrefWithLocale = getLocalizedHref(item.href);
                        const isActive = pathname.startsWith(hrefWithLocale);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                href={hrefWithLocale}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 w-full group relative ${isActive
                                    ? 'bg-white/5 text-cyan-glow shadow-[inset_0_0_20px_rgba(0,240,255,0.05)]'
                                    : 'text-silver-dark hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={22} className={isActive ? 'text-cyan-glow' : 'text-silver-dark group-hover:text-white group-hover:scale-110 transition-all'} />
                                <span className={`hidden lg:block text-xs font-bold tracking-[0.1em] uppercase transition-all ${isActive ? 'text-cyan-glow opacity-100' : 'opacity-60 group-hover:opacity-100'
                                    }`}>
                                    {t(item.id)}
                                </span>
                                {isActive && (
                                    <span className="absolute left-0 w-1 h-6 bg-cyan-glow rounded-r-full shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section: AI Status & Settings & Language */}
            <div className="w-full flex flex-col gap-4 pb-4">
                <CloudStatusPanel />

                <div className="flex flex-col gap-1 px-3">
                    {/* Language Switcher */}
                    <div className="relative group/lang">
                        <button className="flex items-center gap-4 px-4 py-3 rounded-xl w-full text-silver-dark hover:text-white hover:bg-white/5 transition-all group">
                            <Languages size={20} className="group-hover:rotate-12 transition-transform opacity-60 group-hover:opacity-100" />
                            <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{tl(currentLocale)}</span>
                        </button>

                        {/* Dropdown content */}
                        <div className="absolute bottom-full left-4 mb-2 w-48 bg-[#0D0D0F] border border-white/5 rounded-2xl shadow-2xl opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-300 z-[110] p-1.5 overflow-hidden backdrop-blur-xl">
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {locales.map((loc) => (
                                    <Link
                                        key={loc}
                                        href={getSwitchLocaleHref(loc)}
                                        className={`flex items-center gap-3 px-4 py-2 text-[10px] font-bold rounded-lg transition-colors ${currentLocale === loc ? 'bg-orange-500/20 text-orange-500' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <span className="uppercase text-[8px] w-6 opacity-30">{loc}</span>
                                        {tl(loc)}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full px-2 lg:px-4 flex flex-col gap-2">
                        {/* Credits Display */}
                        <div className="mx-1 p-4 rounded-2xl bg-[#0D0D0F] border border-white/5 flex flex-col gap-3 group/credits hover:border-orange-500/20 transition-all duration-700 shadow-inner">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-[0_0_10px_rgba(255,107,0,0.1)]">
                                        <Coins size={14} className="group-hover/credits:rotate-[360deg] transition-transform duration-1000" />
                                    </div>
                                    <span className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase">WALLET</span>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-white tracking-tighter tabular-nums text-shadow-glow">
                                    {mounted ? credits : '...'}
                                </span>
                                <span className="text-[8px] font-black text-orange-500/60 uppercase tracking-widest">TOKENS</span>
                            </div>
                        </div>

                        <Link
                            href={getLocalizedHref('/settings')}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl w-full transition-all duration-300 group ${pathname.startsWith(getLocalizedHref('/settings'))
                                ? 'bg-white/5 text-cyan-glow'
                                : 'text-silver-dark hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Settings size={20} className="group-hover:rotate-[30deg] transition-transform duration-500 opacity-60 group-hover:opacity-100" />
                            <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{t('settings')}</span>
                        </Link>

                        {user ? (
                            <button
                                onClick={() => logout()}
                                title="Sign Out"
                                className="flex items-center justify-start gap-4 px-4 py-3 mb-1 rounded-xl w-full transition-all duration-300 group text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer border border-transparent hover:border-red-500/20"
                            >
                                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
                                <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => setLoginModalOpen(true)}
                                className="flex items-center justify-start gap-4 px-4 py-3 mb-1 rounded-xl w-full transition-all duration-300 group text-orange-500/80 hover:text-orange-400 hover:bg-orange-500/5 cursor-pointer"
                            >
                                <LogIn size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                                <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">Sign In</span>
                            </button>
                        )}
                    </div>

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between px-6 py-2">
                        <span className="hidden lg:block text-[8px] font-black uppercase tracking-[0.3em] text-[#333]">TEMA</span>
                        <ThemeToggle />
                    </div>

                    {/* Legal Links Footer */}
                    <div className="hidden lg:flex flex-col items-center gap-1.5 mt-2 px-4 text-[8px] text-[#444] font-black tracking-widest uppercase pb-2 text-center">
                        <div className="flex gap-4">
                            <Link href={getLocalizedHref('/terms')} className="hover:text-white transition-colors">Términos</Link>
                            <Link href={getLocalizedHref('/privacy')} className="hover:text-white transition-colors">Privacidad</Link>
                        </div>
                        <div className="opacity-40 leading-relaxed">
                            © 2026 Da Graba Studio v1
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
