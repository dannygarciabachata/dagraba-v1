'use client';

import React, { useState } from 'react';
import { X, Heart, CreditCard, Check } from 'lucide-react';

interface GiftTier {
    id: string;
    emoji: string;
    name: string;
    amount: number;
    platformFee: number; // percentage
    description: string;
    color: string;
    glow: string;
}

const GIFT_TIERS: GiftTier[] = [
    { id: 'star', emoji: '⭐', name: 'Estrella', amount: 1, platformFee: 20, description: 'Para mostrar tu apoyo', color: 'text-yellow-400', glow: 'shadow-yellow-500/30' },
    { id: 'fire', emoji: '🔥', name: 'Fuego', amount: 5, platformFee: 20, description: '¡Eso está caliente!', color: 'text-orange-400', glow: 'shadow-orange-500/30' },
    { id: 'diamond', emoji: '💎', name: 'Diamante', amount: 20, platformFee: 15, description: 'Eres un fan verdadero', color: 'text-cyan-400', glow: 'shadow-cyan-500/30' },
    { id: 'crown', emoji: '👑', name: 'Corona', amount: 100, platformFee: 15, description: 'Tu artista es royalty', color: 'text-purple-400', glow: 'shadow-purple-500/30' },
    { id: 'rocket', emoji: '🚀', name: 'Rocket', amount: 1000, platformFee: 10, description: '¡Al infinito y más allá!', color: 'text-green-400', glow: 'shadow-green-500/30' },
    { id: 'legend', emoji: '🏆', name: 'Leyenda', amount: 100000, platformFee: 10, description: 'El regalo más épico', color: 'text-red-400', glow: 'shadow-red-500/30' },
];

interface GiftModalProps {
    artistName: string;
    onClose: () => void;
}

export function GiftModal({ artistName, onClose }: GiftModalProps) {
    const [selected, setSelected] = useState<GiftTier | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [useCustom, setUseCustom] = useState(false);
    const [step, setStep] = useState<'select' | 'confirm' | 'done'>('select');
    const [message, setMessage] = useState('');

    const finalAmount = useCustom ? parseFloat(customAmount) || 0 : selected?.amount || 0;
    const feePercent = selected?.platformFee ?? 15;
    const artistReceives = finalAmount * (1 - feePercent / 100);

    const handleConfirm = () => {
        if (finalAmount < 1) return;
        setStep('confirm');
    };

    const handlePay = () => {
        // In production: call Stripe payment link or API
        setStep('done');
    };

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[300] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#0F0F12] border border-[#222] rounded-2xl w-full max-w-lg animate-in zoom-in-95 fade-in duration-200 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#1A1A1A]">
                    <div>
                        <h2 className="font-black text-white text-base">Enviar Regalo 🎁</h2>
                        <p className="text-[11px] text-[#555] mt-0.5">a <span className="text-white font-bold">{artistName}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-[#555] hover:text-white"><X size={15} /></button>
                </div>

                {step === 'select' && (
                    <div className="p-6 space-y-5">
                        {/* Sticker Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            {GIFT_TIERS.map(tier => (
                                <button
                                    key={tier.id}
                                    onClick={() => { setSelected(tier); setUseCustom(false); }}
                                    className={`flex flex-col items-center py-4 px-2 rounded-xl border-2 transition-all duration-150 relative ${selected?.id === tier.id && !useCustom ? `border-white/30 bg-white/5 shadow-lg ${tier.glow}` : 'border-white/5 hover:border-white/15 hover:bg-white/[0.02]'}`}
                                >
                                    <span className="text-3xl mb-2 leading-none">{tier.emoji}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${tier.color}`}>{tier.name}</span>
                                    <span className="text-white font-black text-sm">
                                        ${tier.amount >= 1000 ? `${tier.amount / 1000}K` : tier.amount}
                                    </span>
                                    <span className="text-[9px] text-[#444] mt-0.5">{tier.description}</span>
                                    {selected?.id === tier.id && !useCustom && (
                                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                            <Check size={10} className="text-black" strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Custom Amount */}
                        <div>
                            <button onClick={() => { setUseCustom(true); setSelected(null); }} className={`w-full py-3 px-4 rounded-xl border-2 text-left transition-all ${useCustom ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/5 hover:border-white/15'}`}>
                                <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">Monto personalizado</span>
                                {useCustom && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm font-black text-white">$</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={100000}
                                            value={customAmount}
                                            onChange={e => setCustomAmount(e.target.value)}
                                            placeholder="1 – 100,000"
                                            autoFocus
                                            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#333] font-bold"
                                        />
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Message */}
                        {(selected || useCustom) && finalAmount >= 1 && (
                            <div className="animate-in fade-in duration-150">
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder={`Mensaje para ${artistName} (opcional)`}
                                    maxLength={120}
                                    className="w-full h-16 bg-[#0A0A0C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-xs text-white outline-none resize-none placeholder:text-[#333] custom-scrollbar"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleConfirm}
                            disabled={finalAmount < 1}
                            className={`w-full py-3.5 rounded-xl font-black text-sm tracking-widest transition-all ${finalAmount >= 1 ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:opacity-90 shadow-[0_0_25px_rgba(249,115,22,0.3)]' : 'bg-[#1A1A1A] text-[#444] cursor-not-allowed'}`}
                        >
                            {finalAmount >= 1 ? `ENVIAR $${finalAmount.toLocaleString()}` : 'SELECCIONA UN REGALO'}
                        </button>

                        <p className="text-[9px] text-[#333] text-center">
                            DA GRABA cobra un {feePercent}% por transacción. El artista recibe ${(finalAmount * (1 - feePercent / 100)).toFixed(2)}.
                        </p>
                    </div>
                )}

                {step === 'confirm' && (
                    <div className="p-6 space-y-5">
                        <div className="flex flex-col items-center py-6 text-center gap-3">
                            <span className="text-6xl">{useCustom ? '💝' : selected?.emoji}</span>
                            <div>
                                <div className="text-2xl font-black text-white">${finalAmount.toLocaleString()}</div>
                                <div className="text-[11px] text-[#555] mt-1">El artista recibe ${artistReceives.toFixed(2)} dopo {feePercent}% comisión</div>
                            </div>
                            {message && <p className="text-sm text-[#888] italic">"{message}"</p>}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-4 bg-[#0A0A0C] border border-[#222] rounded-xl">
                                <CreditCard size={18} className="text-[#555]" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-white">Tarjeta •••• 4242</p>
                                    <p className="text-[10px] text-[#555]">Visa · Vence 12/28</p>
                                </div>
                                <button className="text-[10px] font-bold text-orange-400 hover:text-orange-300">Cambiar</button>
                            </div>
                            <p className="text-[9px] text-[#333] text-center">No aceptamos American Express ❌</p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep('select')} className="flex-1 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-xs font-bold text-[#888] hover:text-white">Atrás</button>
                            <button onClick={handlePay} className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl text-sm font-black text-white hover:opacity-90 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                                CONFIRMAR Y PAGAR
                            </button>
                        </div>
                    </div>
                )}

                {step === 'done' && (
                    <div className="p-8 flex flex-col items-center text-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                            <Heart size={36} className="text-green-400" fill="currentColor" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white mb-1">¡Regalo Enviado!</h3>
                            <p className="text-sm text-[#666]">{artistName} ha recibido tu regalo de <span className="text-white font-bold">${finalAmount.toLocaleString()}</span> {useCustom ? '💝' : selected?.emoji}</p>
                        </div>
                        <button onClick={onClose} className="px-8 py-3 bg-white text-black font-black text-xs rounded-xl hover:bg-gray-100 transition-all">CERRAR</button>
                    </div>
                )}
            </div>
        </div>
    );
}
