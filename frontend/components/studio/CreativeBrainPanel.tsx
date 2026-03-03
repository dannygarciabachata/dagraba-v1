import React from 'react';
import { Brain, Sparkles, Upload, Music, Wand2, Info } from 'lucide-react';
import { useDAWStore } from '@/store/useDAWStore';

export const CreativeBrainPanel: React.FC = () => {
    const {
        isCreativeMode,
        toggleCreativeMode,
        creativeInstruction,
        setCreativeInstruction,
        isProcessing,
        setIsProcessing
    } = useDAWStore();

    const handleDemoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        // Simulate analyzing full demo
        setTimeout(() => {
            setIsProcessing(false);
            console.log("Demo analysis complete. Proposed arrangements for tracks.");
        }, 3000);
    };

    return (
        <div className="w-full bg-[#111113]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/50">
                        <Brain className="text-purple-400" size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase italic">Cerebro Creativo</h2>
                        <p className="text-[10px] text-silver-dark font-medium tracking-wider">AI ARRANGER & COMPOSITION MODE</p>
                    </div>
                </div>

                {/* Creative Mode Toggle */}
                <button
                    onClick={() => toggleCreativeMode(!isCreativeMode)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isCreativeMode ? 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-white/10'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isCreativeMode ? 'left-7 shadow-lg' : 'left-1'}`} />
                </button>
            </div>

            {/* Instruction Field */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black tracking-widest text-silver-dark uppercase flex items-center gap-2">
                        <Sparkles size={12} className="text-purple-400" />
                        Instrucción Creativa
                    </label>
                    <div className="group relative">
                        <Info size={12} className="text-white/20 hover:text-white transition-colors cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#1a1a1c] border border-white/10 rounded-lg text-[10px] text-silver-dark leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                            Guía a la IA: "Crea un arreglo de bachata melancólico con el requinto haciendo adornos de blues".
                        </div>
                    </div>
                </div>
                <textarea
                    value={creativeInstruction}
                    onChange={(e) => setCreativeInstruction(e.target.value)}
                    placeholder="Describe el sentimiento o estilo del arreglo..."
                    className="w-full h-24 bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-silver-light placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none font-medium leading-relaxed"
                />
            </div>

            {/* Full Demo Analysis */}
            <div className="pt-4 border-t border-white/5">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-widest text-silver-dark uppercase">Análisis de Demo (Full Mix)</span>
                        <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-purple-500 animate-pulse' : 'bg-white/10'}`} />
                    </div>

                    <label className="flex items-center justify-center gap-3 py-4 px-4 rounded-xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group/upload">
                        <div className="p-2 bg-purple-500/20 rounded-lg group-hover/upload:scale-110 transition-transform">
                            <Upload size={16} className="text-purple-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-white tracking-widest uppercase">Cargar Demo Guía</span>
                            <span className="text-[9px] text-silver-dark font-medium">Análisis de armonía y tempo</span>
                        </div>
                        <input type="file" accept="audio/*" onChange={handleDemoUpload} className="hidden" />
                    </label>

                    {isProcessing && (
                        <div className="flex items-center gap-2 px-2 py-1 justify-center">
                            <Wand2 size={12} className="animate-bounce text-purple-400" />
                            <span className="text-[9px] font-bold text-silver-dark uppercase tracking-widest">IA Analizando Estructura...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Generator Button */}
            <button
                disabled={!isCreativeMode || isProcessing}
                className={`mt-2 flex items-center justify-center gap-2 py-4 rounded-xl border font-black tracking-[0.2em] transition-all duration-500 shadow-xl ${isCreativeMode
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-white/20 text-white hover:scale-[1.02] hover:shadow-purple-500/20 active:scale-[0.98]'
                        : 'bg-white/5 border-white/5 text-silver-dark cursor-not-allowed'
                    }`}
            >
                < Sparkles size={16} />
                <span>GENERAR ARREGLO DIGITAL</span>
            </button>
        </div>
    );
};
