'use client';

import { useRouter } from 'next/navigation';
import { Activity, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { GenreSelector } from '@/components/daw/GenreSelector';

export default function Planer() {
    const router = useRouter();

    // Local state for the Record UI & Chat
    const [isRecording, setIsRecording] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [durationLimit, setDurationLimit] = useState(120); // 120 seconds = 2 minutes
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: '¡Hola! Soy John, tu Ingeniero y Productor Musical de Da Graba. Vamos a planear este hit. ¿Qué estilo o referencia tienes en mente hoy?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleChatSubmit = async () => {
        if (!chatInput.trim() || isTyping) return;

        const userMessage = chatInput.toLowerCase().trim();
        const triggers = ['dale', 'manos a la obra', 'empieza', 'ok', 'vamos', 'listo', 'arrancamos'];
        const shouldRedirect = triggers.some(t => userMessage.includes(t));

        setChatInput('');
        setMessages(prev => [...prev, { role: 'user', content: chatInput }]);

        if (shouldRedirect) {
            setIsTyping(true);
            // Simulate a brief AI "confirmation" before jumping
            setTimeout(() => {
                setIsRedirecting(true);
                setTimeout(() => {
                    router.push('/studio?session=true');
                }, 2000);
            }, 600);
            return;
        }

        setIsTyping(true);
        try {
            const response = await fetch('/api/ai/engineer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: chatInput,
                    history: messages
                })
            });

            const data = await response.json();
            if (data.message) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
            }
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, tuve un problema técnico. ¿Podemos intentar de nuevo?' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full items-center justify-center bg-[#0D0D0F] relative overflow-hidden pointer-events-auto">



            {/* MAIN CONTAINER - More centered and higher */}
            <div className="w-full max-w-4xl flex flex-col items-center gap-8 z-10 -mt-20">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center gap-4 mb-8">
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2">
                        <Activity size={14} className="text-cyan-glow animate-pulse" />
                        <span className="text-[10px] font-bold tracking-[0.3em] text-silver-light uppercase">Ingeniero John Activo</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl">
                        Planea Tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-blue-500">Próximo Hit</span>
                    </h1>
                    <p className="text-silver-dark max-w-lg text-sm leading-relaxed">
                        Define el estilo, la letra y la estructura con John antes de entrar al studio.
                    </p>
                </div>

                {/* Genre Selector */}
                <GenreSelector
                    onSelect={(genre: string) => {
                        setChatInput(`Quiero hacer un tema de ${genre}`);
                    }}
                />

                {/* AI AGENT CHAT BOX */}
                <div className="w-full bg-[#0B1015]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[500px]">
                    {/* Chat Header */}
                    <div className="bg-[#111720] border-b border-white/5 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse shadow-[0_0_8px_#00F0FF]" />
                            <span className="text-silver-light text-xs font-mono tracking-widest uppercase">John (Productor / Ingeniero)</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] text-silver-dark font-mono tracking-widest">LIMIT: 120s DEMO</span>
                            <span className="text-[10px] text-green-500 font-mono tracking-widest px-2 py-0.5 bg-green-500/10 rounded border border-green-500/20">EN LÍNEA</span>
                        </div>
                    </div>

                    {/* Chat Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 font-sans text-sm custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex items-start gap-4 w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'assistant' ? 'bg-gradient-to-br from-cyan-glow/20 to-blue-600/20 border border-cyan-glow' : 'bg-[#1C2633] border border-[#222]'}`}>
                                    {msg.role === 'assistant' ? <Activity size={14} className="text-cyan-glow" /> : <span className="text-[10px] font-bold text-white">TU</span>}
                                </div>
                                <div className={`px-5 py-3 text-silver-light shadow-xl rounded-2xl leading-relaxed ${msg.role === 'assistant' ? 'bg-[#1C2633]/80 border border-white/5 rounded-tl-sm' : 'bg-primary/20 border border-primary/30 rounded-tr-sm text-white'}`}>
                                    <p>{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-start gap-4 w-[85%]">
                                <div className="w-8 h-8 rounded-full bg-cyan-glow/20 border border-cyan-glow flex items-center justify-center shrink-0">
                                    <Activity size={14} className="text-cyan-glow animate-pulse" />
                                </div>
                                <div className="bg-[#1C2633]/80 border border-white/5 rounded-2xl rounded-tl-sm px-5 py-3 text-silver-light">
                                    <div className="flex gap-1.5 py-1">
                                        <div className="w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Input Area */}
                    <div className="p-4 bg-black/40 border-t border-white/5 flex gap-3 backdrop-blur-md">
                        <input
                            type="text"
                            placeholder="Describe tu visión musical (ej: Trap pesado con melodía oscura)..."
                            className="bg-[#131B24] border border-[#222] rounded-xl px-6 py-3 w-full text-sm text-silver-light focus:outline-none focus:border-cyan-glow/50 focus:bg-[#1a2530] transition-all placeholder:text-silver-dark/40"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                        />
                        <button
                            onClick={handleChatSubmit}
                            disabled={isRedirecting || !chatInput.trim()}
                            className="bg-primary hover:bg-orange-500 text-white rounded-xl px-8 py-3 text-xs font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(255,107,0,0.3)] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center uppercase tracking-widest"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>

            {/* FULLSCREEN REDIRECTING OVERLAY */}
            {isRedirecting && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto">
                    {/* The spectacular glowing DG Logo */}
                    <div className="w-64 h-64 rounded-3xl relative flex items-center justify-center shadow-[0_0_100px_rgba(255,107,0,0.8)] animate-pulse overflow-hidden border border-orange-500/30">
                        {/* Outer spinner ring */}
                        <div className="absolute inset-0 border-8 border-t-white border-r-transparent border-b-white/10 border-l-transparent rounded-3xl animate-spin z-10" />
                        <img src="/logo.jpg" alt="DA GRABA Loading Logo" className="w-full h-full object-cover" />
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3">
                            <Activity size={16} className="text-primary animate-bounce" />
                            <h2 className="text-xl font-bold tracking-widest text-[#E0E0E0]">ANALIZANDO IDEA...</h2>
                        </div>
                        <p className="text-silver-dark text-sm font-mono tracking-wide max-w-sm text-center">
                            Ingresando a la fase de creación IA...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
