'use client';

import { useState, useEffect } from 'react';
import {
    Settings, User, Bell, Shield, CreditCard, Music2,
    Monitor, Globe, Volume2, Mic2, ChevronRight, Save,
    Palette, Keyboard, PlugZap, LogOut, Trash2, XCircle
} from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuth } from '@/context/AuthContext';
import { useUserStore } from '@/store/useUserStore';

const SECTIONS = [
    { id: 'cuenta', label: 'Cuenta', icon: User },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'estudio', label: 'Estudio / DAW', icon: Music2 },
    { id: 'apariencia', label: 'Apariencia', icon: Palette },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'privacidad', label: 'Privacidad', icon: Shield },
    { id: 'pagos', label: 'Pagos y Plan', icon: CreditCard },
    { id: 'atajos', label: 'Atajos de Teclado', icon: Keyboard },
    { id: 'integraciones', label: 'Integraciones', icon: PlugZap },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('cuenta');
    const { theme, setTheme } = useThemeStore();
    const { user, logout } = useAuth();
    const { plan, setPlan } = useUserStore();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex h-full w-full bg-[#0A0A0C] text-white overflow-hidden">

            {/* ── Left sidebar ── */}
            <div className="w-64 shrink-0 border-r border-white/5 flex flex-col py-8 px-4 gap-1 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 px-3 mb-6">
                    <Settings size={18} className="text-white/40" />
                    <h2 className="text-sm font-black tracking-widest uppercase text-white/60">Ajustes</h2>
                </div>

                {SECTIONS.map((s) => {
                    const Icon = s.icon;
                    const active = activeSection === s.id;
                    return (
                        <button
                            key={s.id}
                            onClick={() => setActiveSection(s.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left w-full transition-all ${active
                                ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <Icon size={16} className={active ? 'text-cyan-400' : ''} />
                            <span className="text-sm font-medium">{s.label}</span>
                            {active && <ChevronRight size={14} className="ml-auto" />}
                        </button>
                    );
                })}

                <div className="mt-auto pt-6 border-t border-white/5">
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-left w-full text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all border border-transparent"
                    >
                        <LogOut size={16} />
                        <span className="text-sm font-medium uppercase text-[10px] tracking-widest">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-10">

                {/* CUENTA */}
                {activeSection === 'cuenta' && (
                    <section className="flex flex-col gap-8 max-w-2xl">
                        <div>
                            <h1 className="text-xl font-black tracking-widest uppercase mb-1">Cuenta</h1>
                            <p className="text-white/30 text-sm">Gestiona tu información personal y credenciales</p>
                        </div>
                        {/* Avatar */}
                        <div className="flex items-center gap-6 p-6 bg-white/3 border border-white/5 rounded-2xl">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-3xl font-black shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                                👤
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="font-bold text-white">Productor Maestro</p>
                                <p className="text-sm text-white/40">productor@dagraba.studio</p>
                                <button className="text-[11px] font-bold tracking-widest uppercase text-cyan-400 hover:text-cyan-300 transition-colors">
                                    Cambiar foto
                                </button>
                            </div>
                        </div>
                        {/* Fields */}
                        {[
                            { label: 'Nombre artístico', placeholder: 'Productor Maestro', type: 'text' },
                            { label: 'Email', placeholder: 'productor@dagraba.studio', type: 'email' },
                            { label: 'Contraseña', placeholder: '••••••••', type: 'password' },
                        ].map((f) => (
                            <div key={f.label} className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold tracking-widest uppercase text-white/40">{f.label}</label>
                                <input
                                    type={f.type}
                                    placeholder={f.placeholder}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all"
                                />
                            </div>
                        ))}
                        <button className="self-start flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[11px] font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                            <Save size={14} /> Guardar Cambios
                        </button>

                        <div className="mt-12 pt-8 border-t border-white/5">
                            <h3 className="text-sm font-black tracking-widest uppercase text-red-500/60 mb-4">Zona de Peligro</h3>
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-[10px] font-black tracking-widest uppercase"
                                >
                                    <Trash2 size={14} /> Eliminar Cuenta
                                </button>
                            ) : (
                                <div className="flex flex-col gap-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl max-w-sm">
                                    <p className="text-[10px] text-red-400/80 font-medium">¿Estás seguro? Esta acción es irreversible y borrará todos tus proyectos y créditos.</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                alert("Cuenta eliminada correctamente.");
                                                logout();
                                            }}
                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[9px] font-black tracking-widest uppercase rounded"
                                        >
                                            Confirmar Borrado
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black tracking-widest uppercase rounded"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* AUDIO */}
                {activeSection === 'audio' && (
                    <section className="flex flex-col gap-8 max-w-2xl">
                        <div>
                            <h1 className="text-xl font-black tracking-widest uppercase mb-1">Audio</h1>
                            <p className="text-white/30 text-sm">Configuración de dispositivos y calidad de audio</p>
                        </div>
                        {[
                            { label: 'Dispositivo de salida', opts: ['MacBook Pro Speakers', 'HDMI Output', 'Headphones'] },
                            { label: 'Dispositivo de entrada (Mic)', opts: ['MacBook Pro Microphone', 'External Mic', 'Line In'] },
                            { label: 'Frecuencia de muestreo', opts: ['44100 Hz', '48000 Hz', '96000 Hz', '192000 Hz'] },
                            { label: 'Profundidad de bits', opts: ['16-bit', '24-bit', '32-bit float'] },
                            { label: 'Tamaño de buffer', opts: ['64 samples', '128 samples', '256 samples', '512 samples', '1024 samples'] },
                        ].map((s) => (
                            <div key={s.label} className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold tracking-widest uppercase text-white/40">{s.label}</label>
                                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all appearance-none">
                                    {s.opts.map((o) => <option key={o} value={o} className="bg-[#111]">{o}</option>)}
                                </select>
                            </div>
                        ))}
                        <button className="self-start flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[11px] font-black tracking-widest uppercase transition-all">
                            <Save size={14} /> Guardar
                        </button>
                    </section>
                )}

                {/* ESTUDIO */}
                {activeSection === 'estudio' && (
                    <section className="flex flex-col gap-8 max-w-2xl">
                        <div>
                            <h1 className="text-xl font-black tracking-widest uppercase mb-1">Estudio / DAW</h1>
                            <p className="text-white/30 text-sm">Opciones del espacio de trabajo de producción</p>
                        </div>
                        {[
                            { label: 'BPM por defecto', type: 'number', value: '120' },
                            { label: 'Compás por defecto', type: 'text', value: '4/4' },
                            { label: 'Altura de tracks por defecto (px)', type: 'number', value: '64' },
                        ].map((f) => (
                            <div key={f.label} className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold tracking-widest uppercase text-white/40">{f.label}</label>
                                <input defaultValue={f.value} type={f.type} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all" />
                            </div>
                        ))}
                        {[
                            { label: 'Auto-guardar proyecto cada 5 minutos' },
                            { label: 'Mostrar grid en timeline' },
                            { label: 'Snap al grid' },
                        ].map((toggle) => (
                            <div key={toggle.label} className="flex items-center justify-between p-4 bg-white/3 border border-white/5 rounded-xl">
                                <span className="text-sm text-white/60">{toggle.label}</span>
                                <div className="w-10 h-5 rounded-full bg-cyan-500 flex items-center justify-end pr-0.5 cursor-pointer">
                                    <div className="w-4 h-4 rounded-full bg-white shadow" />
                                </div>
                            </div>
                        ))}
                        <button className="self-start flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[11px] font-black tracking-widest uppercase transition-all">
                            <Save size={14} /> Guardar
                        </button>
                    </section>
                )}

                {/* APARIENCIA */}
                {activeSection === 'apariencia' && (
                    <section className="flex flex-col gap-8 max-w-2xl">
                        <div>
                            <h1 className="text-xl font-black tracking-widest uppercase mb-1">Apariencia</h1>
                            <p className="text-white/30 text-sm">Personaliza el aspecto visual del estudio</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-white/40">Tema</label>
                            <div className="flex gap-3">
                                {['dark', 'light'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTheme(t as 'dark' | 'light')}
                                        className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm uppercase tracking-widest transition-all ${mounted && theme === t
                                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                                            : 'border-white/10 bg-white/3 text-white/40 hover:border-white/20'
                                            }`}
                                    >
                                        {t === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-white/40">Color de acento</label>
                            <div className="flex gap-3 flex-wrap">
                                {['#00F0FF', '#FF6B00', '#A855F7', '#22C55E', '#F59E0B', '#EF4444'].map((c) => (
                                    <button key={c} className="w-10 h-10 rounded-full border-2 border-white/10 hover:scale-110 transition-transform" style={{ background: c }} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* PAGOS Y PLAN */}
                {activeSection === 'pagos' && (
                    <section className="flex flex-col gap-8 max-w-2xl">
                        <div>
                            <h1 className="text-xl font-black tracking-widest uppercase mb-1">Pagos y Plan</h1>
                            <p className="text-white/30 text-sm">Gestiona tu suscripción y métodos de pago</p>
                        </div>

                        <div className="p-6 bg-white/3 border border-white/5 rounded-2xl flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black tracking-widest uppercase text-white/40 mb-1">Plan Actual</p>
                                    <p className="text-2xl font-black text-white uppercase tracking-tighter">{mounted ? plan : '...'}</p>
                                </div>
                                <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black tracking-widest uppercase">
                                    {mounted ? 'Activo' : 'Cargando...'}
                                </div>
                            </div>

                            {plan !== 'free' && (
                                <div className="mt-4 pt-6 border-t border-white/5">
                                    <button
                                        onClick={() => {
                                            if (confirm("¿Estás seguro de que deseas cancelar tu suscripción? Seguirás teniendo acceso hasta el final del ciclo de facturación.")) {
                                                setPlan('free');
                                                alert("Suscripción cancelada.");
                                            }
                                        }}
                                        className="flex items-center gap-2 text-red-400/60 hover:text-red-400 transition-colors text-[10px] font-black tracking-widest uppercase"
                                    >
                                        <XCircle size={14} /> Terminar Suscripción
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="text-xs font-black tracking-widest uppercase text-white/60">Métodos de Pago</h3>
                            <div className="p-4 bg-white/3 border border-white/5 rounded-xl flex items-center justify-between group hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <CreditCard size={18} className="text-white/40" />
                                    <span className="text-sm text-white/60">•••• •••• •••• 4242</span>
                                </div>
                                <button className="text-[10px] font-black tracking-widest uppercase text-cyan-400 hover:text-cyan-300 transition-colors">Editar</button>
                            </div>
                        </div>
                    </section>
                )}

                {/* APARIENCIA */}
                {!['cuenta', 'audio', 'estudio', 'apariencia'].includes(activeSection) && (
                    <section className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center">
                            <Settings size={32} className="text-white/20" />
                        </div>
                        <h2 className="text-lg font-black tracking-widest uppercase text-white/30">
                            {SECTIONS.find(s => s.id === activeSection)?.label}
                        </h2>
                        <p className="text-white/20 text-sm max-w-xs">Esta sección estará disponible próximamente.</p>
                    </section>
                )}
            </div>
        </div>
    );
}
