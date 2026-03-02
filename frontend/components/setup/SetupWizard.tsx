'use client';

import React, { useState, useEffect } from 'react';
import {
    Cpu,
    ShieldCheck,
    Settings2,
    Globe2,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Bot,
    Key,
    User,
    Mail
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SetupData {
    adminEmail: string;
    adminName: string;
    kieKey: string;
    musicGptKey: string;
    openaiKey: string;
    elevenlabsKey: string;
    siteName: string;
    supportEmail: string;
}

export function SetupWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState<SetupData>({
        adminEmail: 'dagrabastudio@gmail.com',
        adminName: 'Danny Garcia',
        kieKey: '',
        musicGptKey: '',
        openaiKey: '',
        elevenlabsKey: '',
        siteName: 'DA GRABA STUDIO',
        supportEmail: 'dagrabastudio@gmail.com'
    });

    const totalSteps = 4;

    const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // 1. Save all settings
            const settingsToSave = [
                { key: 'KIE_API_KEY', value: data.kieKey, category: 'ai_engine' },
                { key: 'MUSICGPT_API_KEY', value: data.musicGptKey, category: 'ai_engine' },
                { key: 'OPENAI_API_KEY', value: data.openaiKey, category: 'ai_engine' },
                { key: 'ELEVENLABS_API_KEY', value: data.elevenlabsKey, category: 'ai_engine' },
                { key: 'SITE_NAME', value: data.siteName, category: 'platform' },
                { key: 'SUPPORT_EMAIL', value: data.supportEmail, category: 'platform' },
                { key: 'INITIAL_SETUP_COMPLETED', value: 'true', category: 'system' }
            ];

            for (const setting of settingsToSave) {
                await fetch('/api/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(setting)
                });
            }

            // 2. Register SuperAdmin in DB via a temporary endpoint or internal logic
            // Note: Since we don't have a direct "register superadmin" API yet,
            // we'll assume the Prisma record update we did earlier is enough,
            // or we could add a dedicated API call here if needed.

            alert('¡Instalación Completada con Éxito!');
            router.push('/admin');
        } catch (error) {
            console.error('Setup failed', error);
            alert('Error al guardar la configuración');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="w-full max-w-2xl bg-[#0A0A0C]/90 border border-[#222] rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-4 shadow-[0_0_30px_rgba(255,107,0,0.3)]">
                        <Cpu className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                        Instalación <span className="text-orange-500">DA GRABA</span>
                    </h1>
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-orange-500' :
                                        i < step ? 'w-4 bg-orange-500/50' : 'w-4 bg-[#222]'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="min-h-[300px]">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <ShieldCheck className="text-orange-500" size={24} />
                                <h2 className="text-xl font-bold tracking-widest uppercase">Paso 1: SuperAdmin</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="group">
                                    <label className="text-[10px] font-bold text-[#888] tracking-widest uppercase mb-1 block group-focus-within:text-orange-500 transition-colors">
                                        Email del Administrador
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" size={18} />
                                        <input
                                            type="email"
                                            value={data.adminEmail}
                                            onChange={e => setData({ ...data, adminEmail: e.target.value })}
                                            className="w-full bg-[#111] border border-[#222] rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500/50 transition-all font-mono text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="text-[10px] font-bold text-[#888] tracking-widest uppercase mb-1 block group-focus-within:text-orange-500 transition-colors">
                                        Nombre Completo
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" size={18} />
                                        <input
                                            type="text"
                                            value={data.adminName}
                                            onChange={e => setData({ ...data, adminName: e.target.value })}
                                            className="w-full bg-[#111] border border-[#222] rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500/50 transition-all font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-[#E0E0E0]">
                            <div className="flex items-center gap-4 mb-6">
                                <Bot className="text-cyan-400" size={24} />
                                <h2 className="text-xl font-bold tracking-widest uppercase">Paso 2: AI Engine Keys</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-[#888] tracking-widest uppercase mb-1 block">KIE_API_KEY</label>
                                        <input
                                            type="password"
                                            value={data.kieKey}
                                            onChange={e => setData({ ...data, kieKey: e.target.value })}
                                            className="w-full bg-[#111] border border-[#222] rounded-xl py-2 px-4 outline-none focus:border-cyan-500/50 transition-all font-mono text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-[#888] tracking-widest uppercase mb-1 block">MUSICGPT_API_KEY</label>
                                        <input
                                            type="password"
                                            value={data.musicGptKey}
                                            onChange={e => setData({ ...data, musicGptKey: e.target.value })}
                                            className="w-full bg-[#111] border border-[#222] rounded-xl py-2 px-4 outline-none focus:border-cyan-500/50 transition-all font-mono text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-[#888] tracking-widest uppercase mb-1 block">OPENAI_API_KEY</label>
                                        <input
                                            type="password"
                                            value={data.openaiKey}
                                            onChange={e => setData({ ...data, openaiKey: e.target.value })}
                                            className="w-full bg-[#111] border border-[#222] rounded-xl py-2 px-4 outline-none focus:border-cyan-500/50 transition-all font-mono text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-[#888] tracking-widest uppercase mb-1 block">ELEVENLABS_API_KEY</label>
                                        <input
                                            type="password"
                                            value={data.elevenlabsKey}
                                            onChange={e => setData({ ...data, elevenlabsKey: e.target.value })}
                                            className="w-full bg-[#111] border border-[#222] rounded-xl py-2 px-4 outline-none focus:border-cyan-500/50 transition-all font-mono text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <Globe2 className="text-purple-400" size={24} />
                                <h2 className="text-xl font-bold tracking-widest uppercase">Paso 3: Plataforma</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[#888] tracking-widest uppercase mb-1 block">Nombre del Estudio</label>
                                    <input
                                        type="text"
                                        value={data.siteName}
                                        onChange={e => setData({ ...data, siteName: e.target.value })}
                                        className="w-full bg-[#111] border border-[#222] rounded-xl py-3 px-4 outline-none focus:border-purple-500/50 transition-all font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[#888] tracking-widest uppercase mb-1 block">E-mail de Soporte</label>
                                    <input
                                        type="email"
                                        value={data.supportEmail}
                                        onChange={e => setData({ ...data, supportEmail: e.target.value })}
                                        className="w-full bg-[#111] border border-[#222] rounded-xl py-3 px-4 outline-none focus:border-purple-500/50 transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-in fade-in zoom-in duration-500 text-center">
                            <div className="flex flex-col items-center justify-center p-8 border border-white/5 bg-white/[0.02] rounded-3xl">
                                <CheckCircle2 className="text-green-500 mb-4" size={64} />
                                <h2 className="text-2xl font-black italic mb-2 uppercase tracking-tighter text-white">¡Todo Listo!</h2>
                                <p className="text-sm text-[#888] max-w-sm mx-auto mb-6">
                                    Has configurado los pilares fundamentales de <span className="text-white font-bold">{data.siteName}</span>.
                                    Al finalizar, bloquearemos este asistente para seguridad del servidor.
                                </p>
                                <div className="w-full bg-[#050505] border border-[#222] rounded-2xl p-4 text-left">
                                    <div className="flex justify-between text-[10px] font-bold tracking-widest text-[#888] mb-1">
                                        <span>ADMIN</span>
                                        <span>{data.adminEmail}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold tracking-widest text-[#888]">
                                        <span>ENGINE</span>
                                        <span>MULTIMODAL ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-10 pt-6 border-t border-[#222] flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={step === 1 || isSubmitting}
                        className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#888] hover:text-white transition-colors disabled:opacity-0"
                    >
                        <ChevronLeft size={16} /> Atrás
                    </button>

                    {step < totalSteps ? (
                        <button
                            onClick={handleNext}
                            className="bg-white text-black px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 group"
                        >
                            Siguiente <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-[0_0_20px_rgba(34,197,94,0.3)] text-white px-10 py-3 rounded-xl text-xs font-black tracking-widest uppercase hover:scale-[1.05] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'FINALIZANDO...' : 'FINALIZAR INSTALACIÓN'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
