'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic2, LayoutDashboard, SlidersHorizontal, User, Settings, Wand2 } from 'lucide-react';
import { CloudStatusPanel } from './CloudStatusPanel';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Planer', href: '/planer', icon: Mic2 },
    { name: 'Crear', href: '/crear', icon: Wand2 },
    { name: 'Studio', href: '/studio', icon: SlidersHorizontal },
    { name: 'Mastering', href: '/mastering', icon: SlidersHorizontal },
    { name: 'Profile', href: '/profile', icon: User },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-16 lg:w-48 h-full bg-[#0B1015]/80 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between py-6 z-50 shadow-[10px_0_30px_rgba(0,0,0,0.8)] relative">
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
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg transition-all duration-300 w-full group ${isActive
                                    ? 'bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow shadow-[0_0_15px_rgba(0,240,255,0.15)] glow-cyan'
                                    : 'text-silver-dark hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-cyan-glow' : 'text-silver-dark group-hover:text-white transition-colors'} />
                                <span className={`hidden lg:block text-sm font-medium tracking-wide ${isActive ? 'text-cyan-glow' : ''}`}>
                                    {item.name}
                                </span>
                                {isActive && (
                                    <span className="absolute left-0 w-1 h-8 bg-cyan-glow rounded-r-md shadow-[0_0_10px_rgba(0,240,255,1)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section: AI Status & Settings */}
            <div className="w-full flex flex-col gap-2">
                <CloudStatusPanel />

                <div className="w-full px-2 lg:px-4">
                    <button className="flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg w-full text-silver-dark hover:text-white hover:bg-white/5 transition-all group">
                        <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span className="hidden lg:block text-sm font-medium tracking-wide">Settings</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
