'use client';

import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Users, CreditCard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Lun', ingresos: 4000 },
    { name: 'Mar', ingresos: 3000 },
    { name: 'Mié', ingresos: 5000 },
    { name: 'Jue', ingresos: 2780 },
    { name: 'Vie', ingresos: 6890 },
    { name: 'Sáb', ingresos: 8390 },
    { name: 'Dom', ingresos: 9490 },
];

export function FinancialVault() {
    return (
        <section id="vault" className="bg-[#0A0A0C]/80 backdrop-blur-md border border-[#333] rounded-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-6 mt-8">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-600 rounded-md">
                        <DollarSign size={20} className="text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-widest text-[#E0E0E0]">THE VAULT (FINANZAS)</h2>
                        <p className="text-xs text-[#888]">Monitor Stripe / PayPal</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Metrics Sidebar */}
                <div className="flex flex-col gap-4">
                    <MetricCard
                        title="Ingresos Hoy"
                        value="$1,245.00"
                        trend="+12%"
                        isUp={true}
                        icon={<DollarSign size={16} />}
                    />
                    <MetricCard
                        title="Suscriptores Leyenda"
                        value="84"
                        trend="+3"
                        isUp={true}
                        icon={<Users size={16} />}
                        color="text-[#FFD700]"
                    />
                    <MetricCard
                        title="Tasa de Churn"
                        value="2.4%"
                        trend="-0.5%"
                        isUp={false}
                        icon={<CreditCard size={16} />}
                        color="text-red-400"
                    />
                </div>

                {/* Main Graph Area */}
                <div className="col-span-1 lg:col-span-3 border border-[#333] rounded-md bg-[#111] p-4 flex flex-col relative h-[300px]">
                    <h3 className="text-xs text-[#888] font-bold tracking-widest mb-4">INGRESOS SEMANALES</h3>
                    <div className="flex-1 w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px', color: '#FFF' }}
                                    itemStyle={{ color: '#10B981' }}
                                    formatter={(value: unknown) => [`$${value}`, 'Ingresos']}
                                />
                                <Area type="monotone" dataKey="ingresos" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIngresos)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MetricCard({ title, value, trend, isUp, icon, color = "text-[#00F0FF]" }: { title: string, value: string, trend: string, isUp: boolean, icon: React.ReactNode, color?: string }) {
    return (
        <div className="bg-[#111] border border-[#333] rounded-md p-4 flex flex-col gap-2 relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
                {icon && React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 60 }) : icon}
            </div>
            <div className="flex items-center gap-2 text-[#888] text-[10px] font-bold tracking-widest uppercase">
                {icon} {title}
            </div>
            <div className="text-2xl font-black text-white tracking-tighter">
                {value}
            </div>
            <div className={`text-xs flex items-center gap-1 font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {trend} <span className="text-[#666] font-normal">vs semana pasada</span>
            </div>
        </div>
    );
}
