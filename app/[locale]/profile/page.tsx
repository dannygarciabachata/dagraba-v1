'use client';

import React, { useState } from 'react';
import { User, Settings, Shield, Bell, Zap, Save, Palette, Globe, HardDrive } from 'lucide-react';

export default function Profile() {
    const [activeTab, setActiveTab] = useState<'general' | 'daw' | 'billing'>('general');

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-12">
            {/* User Header Section */}
            <div className="bg-[#0A0A0C] border border-[#222] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-[#222] bg-[#111] overflow-hidden flex items-center justify-center shadow-2xl relative z-10 group cursor-pointer">
                        <User size={48} className="text-[#444] group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center backdrop-blur-sm transition-all text-xs font-bold text-white uppercase tracking-widest">
                            Cambiar
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full shadow-lg z-20 border border-white/20">
                        LEYENDA
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">Productor Maestro</h1>
                    <p className="text-silver-dark text-sm mb-4">contacto@dagraba.studio</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <span className="px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded-lg text-xs font-bold text-silver-light flex items-center gap-2">
                            <Zap size={14} className="text-yellow-500" /> Plan Pro Anual
                        </span>
                        <span className="px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded-lg text-xs font-bold text-silver-light flex items-center gap-2">
                            <User size={14} className="text-blue-500" /> Miembro desde 2024
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => setActiveTab('general')}
                        className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-3 text-sm font-bold tracking-wide transition-all ${activeTab === 'general' ? 'bg-white text-black' : 'text-silver-dark hover:bg-[#111] hover:text-white'}`}
                    >
                        <Settings size={18} /> Perfil General
                    </button>
                    <button 
                        onClick={() => setActiveTab('daw')}
                        className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-3 text-sm font-bold tracking-wide transition-all ${activeTab === 'daw' ? 'bg-white text-black' : 'text-silver-dark hover:bg-[#111] hover:text-white'}`}
                    >
                        <Palette size={18} /> Preferencias del DAW
                    </button>
                    <button 
                        onClick={() => setActiveTab('billing')}
                        className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-3 text-sm font-bold tracking-wide transition-all ${activeTab === 'billing' ? 'bg-white text-black' : 'text-silver-dark hover:bg-[#111] hover:text-white'}`}
                    >
                        <Shield size={18} /> Suscripción y Límites
                    </button>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 bg-[#0A0A0C] border border-[#222] rounded-3xl p-8 min-h-[500px]">
                    {activeTab === 'general' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Perfil General</h2>
                                <p className="text-sm text-[#888]">Administra tu información personal y datos de contacto.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Nombre de Usuario</label>
                                    <input type="text" defaultValue="Productor Maestro" className="w-full bg-[#111] border border-[#333] rounded-xl p-3.5 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Correo Electrónico</label>
                                    <input type="email" defaultValue="contacto@dagraba.studio" className="w-full bg-[#111] border border-[#333] rounded-xl p-3.5 text-sm text-white focus:border-blue-500 outline-none transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#888] uppercase tracking-wider">Idioma de la Interfaz</label>
                                    <div className="relative">
                                        <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" />
                                        <select className="w-full bg-[#111] border border-[#333] rounded-xl p-3.5 pl-12 text-sm text-white focus:border-blue-500 outline-none appearance-none cursor-pointer">
                                            <option value="es">Español (ES)</option>
                                            <option value="en">English (US)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-[#222] flex justify-end">
                                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest text-xs rounded-xl flex items-center gap-2 transition-all">
                                    <Save size={16} /> GUARDAR CAMBIOS
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'daw' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Preferencias del DAW</h2>
                                <p className="text-sm text-[#888]">Personaliza tu experiencia dentro de la consola del estudio.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-[#111] rounded-2xl border border-[#222]">
                                    <div>
                                        <h3 className="text-sm font-bold text-white mb-1">Modo Oscuro Profundo</h3>
                                        <p className="text-xs text-[#888]">Utiliza negros puros (#000000) en lugar de grises oscuros.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-[#111] rounded-2xl border border-[#222]">
                                    <div>
                                        <h3 className="text-sm font-bold text-white mb-1">Cargar último proyecto</h3>
                                        <p className="text-xs text-[#888]">Restaura los faders y pistas del último proyecto al abrir el DAW.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-[#111] rounded-2xl border border-[#222]">
                                    <div>
                                        <h3 className="text-sm font-bold text-white mb-1">Notificaciones de Render</h3>
                                        <p className="text-xs text-[#888]">Recibir alertas push cuando un exporte MP4 termine.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-[#333] rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-[#888] rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Suscripción y Límites</h2>
                                <p className="text-sm text-[#888]">Control de tu plan actual, límite de generación por IA y almacenamiento.</p>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 rounded-2xl relative overflow-hidden">
                                <div className="absolute -right-12 -top-12 opacity-10">
                                    <Shield size={120} />
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 rounded-lg text-[10px] font-black tracking-widest uppercase mb-3 inline-block">Plan Activo</span>
                                        <h3 className="text-2xl font-black text-white mb-1">Pro + AI Infinite</h3>
                                        <p className="text-sm text-indigo-200">Facturación anual. Próximo cobro: 15 Dic, 2026</p>
                                    </div>
                                    <button className="px-6 py-3 bg-white text-black font-bold tracking-widest text-xs rounded-xl hover:scale-105 transition-all w-fit">
                                        GESTIONAR PLAN
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#111] border border-[#222] p-6 rounded-2xl space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                <Zap size={16} className="text-yellow-500" /> Créditos IA (KIE)
                                            </h4>
                                            <p className="text-xs text-[#888] mt-1">Renovación mensual</p>
                                        </div>
                                        <span className="text-lg font-black text-white">450 / 1000</span>
                                    </div>
                                    <div className="w-full bg-[#222] h-2 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full w-[45%]" />
                                    </div>
                                </div>

                                <div className="bg-[#111] border border-[#222] p-6 rounded-2xl space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                <HardDrive size={16} className="text-blue-500" /> Almacenamiento
                                            </h4>
                                            <p className="text-xs text-[#888] mt-1">Pistas y proyectos del DAW</p>
                                        </div>
                                        <span className="text-lg font-black text-white">42.5 GB / 50 GB</span>
                                    </div>
                                    <div className="w-full bg-[#222] h-2 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-600 to-red-500 h-full w-[85%]" />
                                    </div>
                                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest text-right">Acercándose al límite</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
