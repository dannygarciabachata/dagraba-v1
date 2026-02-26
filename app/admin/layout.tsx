import React from 'react';
import { ShieldAlert, Server, Activity, Database, Settings, Terminal, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-[#050505] min-h-screen w-full text-silver-light font-mono overflow-hidden">
            {/* Immersive Spaceship Control Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-overlay" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FF6B00]/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-glow/5 blur-[150px] rounded-full" />

                {/* Grid Lines for technical aesthetic */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            {/* Admin Sidebar Navigation */}
            <aside className="w-16 hover:w-56 group transition-all duration-300 bg-[#0A0A0C]/90 backdrop-blur-xl border-r border-[#222] z-40 flex flex-col items-center py-6 shadow-[5px_0_30px_rgba(0,0,0,0.8)] relative">
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#FF6B00] to-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.5)] border border-[#FF6B00]/50 shrink-0">
                        <Terminal size={20} className="text-black" />
                    </div>
                </div>

                <nav className="flex flex-col gap-4 w-full px-2">
                    <AdminNavItem icon={<LayoutDashboard size={20} />} label="OVERVIEW" href="/admin" active />
                    <AdminNavItem icon={<Activity size={20} />} label="MODAL AI" href="/admin#modal" />
                    <AdminNavItem icon={<Database size={20} />} label="ASSETS" href="/admin#assets" />
                    <AdminNavItem icon={<ShieldAlert size={20} />} label="VAULT" href="/admin#vault" />
                    <AdminNavItem icon={<Server size={20} />} label="USERS" href="/admin#users" />
                </nav>

                <div className="mt-auto flex flex-col w-full p-2">
                    <AdminNavItem icon={<Settings size={20} />} label="CONFIG" href="/admin#config" />
                    <div className="mt-4 border-t border-[#333] pt-4 w-full overflow-hidden flex flex-col items-center group-hover:items-start group-hover:px-4">
                        <span className="text-[10px] text-[#FF6B00] font-bold tracking-widest flex items-center gap-2 max-w-full truncate">
                            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse shrink-0" />
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-1 whitespace-nowrap">ADMIN: DANNY</span>
                        </span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 overflow-y-auto overflow-x-hidden p-8 h-screen custom-scrollbar scroll-smooth">
                <div className="max-w-[1600px] mx-auto">
                    <header className="mb-8 border-b border-[#222] pb-4 flex items-end justify-between">
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                RACK CENTRAL
                            </h1>
                            <p className="text-xs text-[#888] tracking-widest mt-1 uppercase">Centro de Control de Nave Espacial</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-[#00F0FF] uppercase tracking-widest mb-1">Carga del Motor</span>
                                <div className="flex gap-1 h-3">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className={`w-1.5 rounded-sm ${i < 4 ? 'bg-[#00F0FF]' : 'bg-[#333]'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </header>
                    {children}
                </div>
            </main>
        </div>
    );
}

function AdminNavItem({ icon, label, href, active = false }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) {
    return (
        <a href={href} className="group/item flex items-center gap-4 px-3 py-2.5 rounded-md hover:bg-[#222] transition-colors relative w-full overflow-hidden">
            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B00] shadow-[0_0_10px_rgba(255,107,0,0.8)]" />}
            <div className={`shrink-0 ${active ? 'text-[#FF6B00]' : 'text-[#888] group-hover/item:text-white'}`}>
                {icon}
            </div>
            <span className={`text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${active ? 'text-white' : 'text-[#888] group-hover/item:text-white'}`}>
                {label}
            </span>
        </a>
    );
}
