'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic2, LayoutDashboard, SlidersHorizontal, User, Settings, Wand2, Compass, Languages } from 'lucide-react';
import { CloudStatusPanel } from './CloudStatusPanel';
import { ThemeToggle } from './ThemeToggle';
import { useTranslations, useLocale } from 'next-intl';

const navItems = [
    { id: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
    { id: 'explorer', href: '/explorer', icon: Compass },
    { id: 'planer', href: '/planer', icon: Mic2 },
    { id: 'crear', href: '/crear', icon: Wand2 },
    { id: 'studio', href: '/studio', icon: SlidersHorizontal },
    { id: 'mastering', href: '/mastering', icon: SlidersHorizontal },
    { id: 'profile', href: '/profile', icon: User },
];

const locales = ['en', 'es', 'pt', 'fr', 'de', 'it', 'ja'];

export function Sidebar() {
    const t = useTranslations('Navigation');
    const tl = useTranslations('Languages');
    const pathname = usePathname();
    const currentLocale = useLocale();

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
        <aside className="w-16 lg:w-48 h-full flex flex-col justify-between py-6 z-50 relative"
            style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)', boxShadow: '10px 0 30px rgba(0,0,0,0.6)' }}
        >
            <div className="flex flex-col items-center lg:items-start w-full">
                {/* Logo Text/Icon */}
                <div className="w-full px-0 lg:px-6 mb-12 flex justify-center lg:justify-start">
                    <div className="w-14 h-14 lg:w-32 lg:h-32 rounded-2xl flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(255,107,0,0.6)] border border-orange-500/20 transform hover:scale-105 transition-transform duration-500">
                        <img src="/logo.jpg" alt="DA GRABA Logo" className="w-full h-full object-cover" />
                    </div>
                </div>
                {/* Navigation Links */}
                <nav className="flex flex-col gap-4 w-full px-2 lg:px-4">
                    {navItems.map((item) => {
                        const hrefWithLocale = getLocalizedHref(item.href);
                        const isActive = pathname.startsWith(hrefWithLocale);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                href={hrefWithLocale}
                                className={`flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg transition-all duration-300 w-full group ${isActive
                                    ? 'bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow shadow-[0_0_15px_rgba(0,240,255,0.15)] glow-cyan'
                                    : 'text-silver-dark hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-cyan-glow' : 'text-silver-dark group-hover:text-white transition-colors'} />
                                <span className={`hidden lg:block text-sm font-medium tracking-wide ${isActive ? 'text-cyan-glow' : ''}`}>
                                    {t(item.id)}
                                </span>
                                {isActive && (
                                    <span className="absolute left-0 w-1 h-8 bg-cyan-glow rounded-r-md shadow-[0_0_10px_rgba(0,240,255,1)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section: AI Status & Settings & Language */}
            <div className="w-full flex flex-col gap-2">
                <CloudStatusPanel />

                {/* Language Switcher */}
                <div className="w-full px-2 lg:px-4 mb-2">
                    <div className="relative group/lang">
                        <button className="flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg w-full text-silver-dark hover:text-white hover:bg-white/5 transition-all group">
                            <Languages size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="hidden lg:block text-sm font-medium tracking-wide">{tl(currentLocale)}</span>
                        </button>

                        {/* Dropdown content */}
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-200 z-[110] p-1 overflow-hidden">
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {locales.map((loc) => (
                                    <Link
                                        key={loc}
                                        href={getSwitchLocaleHref(loc)}
                                        className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg transition-colors ${currentLocale === loc ? 'bg-indigo-600 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <span className="uppercase text-[10px] w-6 opacity-50">{loc}</span>
                                        {tl(loc)}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full px-2 lg:px-4">
                    <Link
                        href={getLocalizedHref('/settings')}
                        className={`flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg w-full transition-all duration-300 group border ${pathname.startsWith(getLocalizedHref('/settings'))
                            ? 'bg-cyan-glow/10 border-cyan-glow/30 text-cyan-glow'
                            : 'text-silver-dark hover:text-white hover:bg-white/5 border-transparent'
                            }`}
                    >
                        <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span className="hidden lg:block text-sm font-medium tracking-wide">{t('settings')}</span>
                    </Link>
                </div>

                {/* Theme Toggle */}
                <div className="w-full px-2 lg:px-4 flex items-center gap-3 px-3 lg:px-5 py-2">
                    <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Tema</span>
                    <ThemeToggle />
                </div>

                {/* Legal Links Footer */}
                <div className="hidden lg:flex flex-col items-center gap-2 mt-4 text-[9px] text-white/40 font-mono tracking-widest uppercase pb-2">
                    <div className="flex gap-3">
                        <Link href={getLocalizedHref('/terms')} className="hover:text-cyan-400 transition-colors">Términos</Link>
                        <Link href={getLocalizedHref('/privacy')} className="hover:text-cyan-400 transition-colors">Privacidad</Link>
                    </div>
                    <Link href={getLocalizedHref('/cookies')} className="hover:text-cyan-400 transition-colors">Cookies</Link>
                </div>
            </div>
        </aside>
    );
}
