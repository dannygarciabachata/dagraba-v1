'use client';

import React from 'react';
import { Mail, MessageSquare, Phone, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';

type PlanRole = 'ROOKIE' | 'CAPITAL' | 'LEYENDA';

interface SupportPortalProps {
    userRole: PlanRole;
}

export function SupportPortal({ userRole }: SupportPortalProps) {
    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tighter text-white">CENTRO DE SOPORTE DA GRABA</h2>
                <p className="text-silver-dark text-sm">Canal de comunicación exclusivo según tu plan <span className="text-primary font-bold">{userRole}</span>.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rookie Support - Always visible */}
                <Card className="p-6 flex flex-col items-center text-center gap-4 border-white/5 bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Email & Tickets</h3>
                        <p className="text-silver-dark text-xs mt-1">Respuesta en 24-48 horas hábiles.</p>
                    </div>
                    <button className="mt-2 w-full py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold hover:bg-blue-600/40 transition-colors">
                        ABRIR TICKET
                    </button>
                </Card>

                {/* Capital Support - Only for CAPITAL or LEYENDA */}
                <Card className={`p-6 flex flex-col items-center text-center gap-4 transition-all ${userRole === 'ROOKIE' ? 'opacity-40 grayscale pointer-events-none' : 'border-cyan-glow/20 bg-cyan-glow/5 hover:bg-cyan-glow/10'}`}>
                    <div className="p-3 rounded-full bg-cyan-glow/20 text-cyan-glow">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Live Chat</h3>
                        <p className="text-silver-dark text-xs mt-1">Chat prioritario con técnicos.</p>
                    </div>
                    {userRole === 'ROOKIE' ? (
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-cyan-glow font-bold uppercase tracking-widest">
                            <span>Nivel Requerido: Capital</span>
                        </div>
                    ) : (
                        <button className="mt-2 w-full py-2 bg-cyan-600/20 text-cyan-glow border border-cyan-500/30 rounded-lg text-xs font-bold hover:bg-cyan-600/40 transition-colors">
                            INICIAR CHAT
                        </button>
                    )}
                </Card>

                {/* Leyenda Support - Only for LEYENDA */}
                <Card className={`p-6 flex flex-col items-center text-center gap-4 transition-all ${userRole !== 'LEYENDA' ? 'opacity-40 grayscale pointer-events-none' : 'border-primary/20 bg-primary/5 hover:bg-primary/10 shadow-[0_0_20px_rgba(255,107,0,0.1)]'}`}>
                    <div className="p-3 rounded-full bg-primary/20 text-primary">
                        <Phone size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Acceso Directo</h3>
                        <p className="text-silver-dark text-xs mt-1">Llamada/WhatsApp con tu Productor.</p>
                    </div>
                    {userRole !== 'LEYENDA' ? (
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-primary font-bold uppercase tracking-widest">
                            <span>Nivel Requerido: Leyenda</span>
                        </div>
                    ) : (
                        <button className="mt-2 w-full py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-bold hover:bg-primary/40 transition-colors flex items-center justify-center gap-2">
                            CONTACTAR <ExternalLink size={12} />
                        </button>
                    )}
                </Card>
            </div>

            <div className="mt-4 p-4 rounded-xl border border-white/5 bg-white/2 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
                <h4 className="text-white text-sm font-bold">Estado del Sistema</h4>
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-500 text-xs font-mono uppercase tracking-widest">Normal - Todos los módulos operativos</span>
                </div>
            </div>
        </div>
    );
}
