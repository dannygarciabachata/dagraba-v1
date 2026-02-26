'use client';

import React from 'react';
import { Play, Activity, Clock, Database, Plus, Settings, Sparkles, ChevronRight, Music } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-12">
            {/* Header / Welcome Section */}
            <header className="relative flex justify-between items-end bg-[#0A0A0C] border border-white/5 p-8 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent pointer-events-none" />
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full" />
                
                <div className="relative z-10 flex flex-col gap-2">
                    <p className="text-orange-500 font-bold tracking-widest text-xs uppercase flex items-center gap-2">
                        <Sparkles size={12} className="animate-pulse" /> Nivel: Leyenda del Estudio
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2">
                        Bienvenido de vuelta, Productor.
                    </h1>
                    <p className="text-silver-dark max-w-xl text-sm leading-relaxed">
                        Tu ecosistema creativo está listo. Tienes <strong className="text-white">3 proyectos activos</strong> y <strong className="text-white">12 pistas generadas</strong> por inteligencia artificial esta semana.
                    </p>
                </div>

                <div className="relative z-10 hidden md:flex items-center gap-4">
                    <Link href="/crear">
                        <button className="h-12 px-8 bg-white text-black font-black tracking-widest text-xs rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            <Plus size={16} /> NUEVA OBRA
                        </button>
                    </Link>
                </div>
            </header>

            {/* Statistics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Pistas Generadas", value: "142", icon: <Music size={20} className="text-blue-500" />, trend: "+12% esta semana" },
                    { title: "Horas de Estudio", value: "38.5", icon: <Clock size={20} className="text-orange-500" />, trend: "+5hrs vs mes anterior" },
                    { title: "Proyectos Activos", value: "7", icon: <Activity size={20} className="text-purple-500" />, trend: "2 próximos a masterización" },
                    { title: "Almacenamiento", value: "85%", icon: <Database size={20} className="text-red-500" />, trend: "42.5 GB / 50 GB" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0A0A0C] border border-[#222] p-6 rounded-2xl flex flex-col gap-4 hover:border-white/10 transition-colors relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
                            {stat.icon}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#333] flex items-center justify-center">
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold text-silver-dark uppercase tracking-widest">{stat.title}</span>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-white">{stat.value}</p>
                            <p className="text-xs text-[#666] mt-1">{stat.trend}</p>
                        </div>
                    </div>
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Feed */}
                <section className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <Activity size={18} className="text-orange-500" /> Actividad Reciente
                        </h2>
                        <button className="text-xs font-bold text-silver-dark hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
                            Ver todo <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="bg-[#0A0A0C] border border-[#222] rounded-3xl overflow-hidden divide-y divide-[#222]">
                        {[
                            { title: "Neon Nights (Cyberpunk Edit)", type: "Generación IA", time: "Hace 2 horas", color: "from-blue-600 to-cyan-500" },
                            { title: "Acoustic Sunset V2", type: "Masterización", time: "Ayer, 18:30", color: "from-orange-500 to-red-500" },
                            { title: "Trap Beat 120BPM", type: "Extensión de Audio", time: "Hace 3 días", color: "from-purple-600 to-pink-500" },
                            { title: "Vocal Layer - Coro Dulce", type: "Voice Gen", time: "Hace 4 días", color: "from-emerald-500 to-teal-400" },
                        ].map((item, i) => (
                            <div key={i} className="p-6 flex items-center justify-between hover:bg-[#111] transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center overflow-hidden relative">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
                                        <Play size={16} className="text-white relative z-10 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">{item.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-[#666]">{item.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-[#555] font-medium">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Actions Panel */}
                <section className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Settings size={18} className="text-orange-500" /> Atajos Rápidos
                    </h2>
                    <div className="flex flex-col gap-3">
                        <Link href="/crear">
                            <div className="bg-gradient-to-br from-[#111] to-[#0A0A0C] border border-[#333] hover:border-orange-500/50 p-6 rounded-2xl flex items-center justify-between group cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(255,107,0,0.1)]">
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-orange-500 transition-colors">Crear Música IA</h3>
                                    <p className="text-xs text-[#666]">Invoca nuevos ritmos usando KIE</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-white group-hover:bg-orange-600 transition-colors">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </Link>
                        
                        <Link href="/studio">
                            <div className="bg-gradient-to-br from-[#111] to-[#0A0A0C] border border-[#333] hover:border-blue-500/50 p-6 rounded-2xl flex items-center justify-between group cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-500 transition-colors">Consola DAW</h3>
                                    <p className="text-xs text-[#666]">Mezcla, arregla y edita tus tracks</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </Link>
                        
                        <Link href="/mastering">
                            <div className="bg-gradient-to-br from-[#111] to-[#0A0A0C] border border-[#333] hover:border-purple-500/50 p-6 rounded-2xl flex items-center justify-between group cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-purple-500 transition-colors">Masterización AI</h3>
                                    <p className="text-xs text-[#666]">Dale brillo profesional a tus mezclas</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-white group-hover:bg-purple-600 transition-colors">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
