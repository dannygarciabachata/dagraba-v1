'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Gift, Music, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function UserWallet() {
    const { getIdToken } = useAuth();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const token = await getIdToken();
                if (!token) return;

                const res = await fetch('/api/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setBalance(data.user.balance || 0);
                }

                // Fetch transactions (we'll implement this API shortly)
                // For now, mock or fetch if exists
                const transRes = await fetch('/api/user/transactions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const transData = await transRes.json();
                if (transData.success) {
                    setTransactions(transData.transactions);
                }
            } catch (error) {
                console.error('Failed to fetch wallet data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWalletData();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-[#1A1A1C] to-[#0A0A0C] border border-[#333] rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00] opacity-[0.03] blur-[100px] -mr-32 -mt-32 group-hover:opacity-[0.05] transition-opacity" />

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                            <Wallet className="text-[#FF6B00]" size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[#666] tracking-widest uppercase">Tu Balance</h3>
                            <p className="text-[10px] text-[#444]">Fondos disponibles para retirar</p>
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-green-500 uppercase">Verificado</span>
                    </div>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white tracking-tighter">${balance.toLocaleString()}</span>
                    <span className="text-xl font-bold text-[#444]">USD</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-10">
                    <button className="flex items-center justify-center gap-2 py-4 bg-white text-black rounded-xl font-black text-xs tracking-widest hover:bg-gray-200 transition-all">
                        RETIRAR FONDOS <ArrowRight size={16} />
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 bg-[#111] border border-[#222] text-white rounded-xl font-black text-xs tracking-widest hover:bg-[#1A1A1C] transition-all">
                        HISTORIAL
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111] border border-[#222] rounded-xl p-5 flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <TrendingUp size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Regalos</p>
                        <p className="text-lg font-black text-white">$450.00</p>
                    </div>
                </div>
                <div className="bg-[#111] border border-[#222] rounded-xl p-5 flex items-center gap-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Gift size={20} className="text-purple-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Suscripciones</p>
                        <p className="text-lg font-black text-white">$1,200.00</p>
                    </div>
                </div>
                <div className="bg-[#111] border border-[#222] rounded-xl p-5 flex items-center gap-4">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Music size={20} className="text-orange-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Publishing</p>
                        <p className="text-lg font-black text-white">$0.00</p>
                    </div>
                </div>
            </div>

            {/* Publishing Banner */}
            <div className="bg-orange-600/10 border border-orange-500/20 rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/20 rounded-xl">
                        <ShieldCheck className="text-orange-400" size={28} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold leading-tight">Registra tus canciones en ASCAP/BMI</h4>
                        <p className="text-xs text-orange-200/50 mt-1">Gana regalías globales. Sistema cobra 50% de publishing.</p>
                    </div>
                </div>
                <button className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-black text-[10px] tracking-widest rounded-lg transition-all">
                    REGISTRAR AHORA
                </button>
            </div>
        </div>
    );
}
