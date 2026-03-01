'use client';

import { useRouter } from 'next/navigation';
import { Activity, Loader2, Sparkles, Music, Edit3, Compass, AudioWaveform, Mic2, Cpu, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { GenreSelector } from '@/components/daw/GenreSelector';
import { useUserStore } from '@/store/useUserStore';
import { useAuth } from '@/context/AuthContext';

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
    const { credits, deductCredits } = useUserStore();
    const { user, setLoginModalOpen } = useAuth();

    const handleChatSubmit = async () => {
        if (!chatInput.trim() || isTyping) return;

        const userMessage = chatInput.toLowerCase().trim();
        const triggers = ['dale', 'manos a la obra', 'empieza', 'ok', 'vamos', 'listo', 'arrancamos'];
        const shouldRedirect = triggers.some(t => userMessage.includes(t));

        setChatInput('');
        setMessages(prev => [...prev, { role: 'user', content: chatInput }]);

        if (shouldRedirect) {
            if (credits < 20) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Parece que se te han acabado los créditos de prueba. ¡Regístrate gratis para obtener más y guardar tus proyectos!' }]);
                setTimeout(() => setLoginModalOpen(true), 1500);
                return;
            }

            setIsTyping(true);
            // Simulate a brief AI "confirmation" before jumping
            setTimeout(() => {
                const deducted = deductCredits(20); // Deduct 20 credits to start a session
                if (deducted) {
                    setIsRedirecting(true);
                    setTimeout(() => {
                        router.push('/studio?session=true');
                    }, 2000);
                } else {
                    setMessages(prev => [...prev, { role: 'assistant', content: 'No tienes suficientes créditos para esta acción. Por favor, regístrate.' }]);
                    setLoginModalOpen(true);
                }
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
        <div className="flex flex-col h-full w-full items-center bg-[#0D0D0F] relative overflow-y-auto custom-scrollbar overflow-x-hidden pointer-events-auto">

            {/* HERO SECTION (DA GRABA Style Landing) */}
            <div className="w-full max-w-6xl flex flex-col items-center gap-12 pt-20 pb-16 z-10 px-6">

                {/* Headlines & Badges */}
                <div className="flex flex-col items-center text-center gap-6 mb-8 w-full">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2">
                        <span>🤩</span> <span className="text-xs font-bold text-white tracking-widest uppercase">No need payment</span>
                        <div className="w-px h-3 bg-white/20 mx-2" />
                        <span className="text-xs text-orange-400 font-bold tracking-widest uppercase flex items-center gap-1"><Sparkles size={12} />Just describe what to create</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-tight">
                        Create Songs, Sound Effects & <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">much more for free</span>
                    </h1>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    <div className="bg-[#111] border border-[#222] hover:border-orange-500/50 p-6 rounded-2xl transition-all cursor-pointer group">
                        <div className="bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Music className="text-orange-500" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Create Music</h3>
                        <p className="text-[#888] text-sm leading-relaxed">Our simple and powerful prompt box to create songs, beats, and instrumentals.</p>
                    </div>

                    <div className="bg-[#111] border border-[#222] hover:border-orange-500/50 p-6 rounded-2xl transition-all cursor-pointer group">
                        <div className="bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Edit3 className="text-orange-500" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Edit Audio</h3>
                        <p className="text-[#888] text-sm leading-relaxed">Upload any song or audio, and describe what you want to do, extract, remix or anything.</p>
                    </div>

                    <div className="bg-[#111] border border-[#222] hover:border-orange-500/50 p-6 rounded-2xl transition-all cursor-pointer group">
                        <div className="bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Compass className="text-orange-500" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Explore Library</h3>
                        <p className="text-[#888] text-sm leading-relaxed">Discover music and sound effects. Royalty Free. Unlimited Streaming. Unlimited Downloads.</p>
                    </div>

                    <div className="bg-[#111] border border-[#222] hover:border-orange-500/50 p-6 rounded-2xl transition-all cursor-pointer group">
                        <div className="bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <AudioWaveform className="text-orange-500" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Create Sound Effects</h3>
                        <p className="text-[#888] text-sm leading-relaxed">Make sound effects, samples, loops and soundscapes easily with hyper realism.</p>
                    </div>

                    <div className="bg-[#111] border border-[#222] hover:border-orange-500/50 p-6 rounded-2xl transition-all cursor-pointer group">
                        <div className="bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Mic2 className="text-orange-500" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Text to Speech</h3>
                        <p className="text-[#888] text-sm leading-relaxed">Explore over a thousand realistic AI voices and clone any voice within just seconds.</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-600/20 to-yellow-600/10 border border-orange-500/30 p-6 rounded-2xl transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
                        <div className="bg-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                            <Sparkles className="text-white" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2 relative z-10">DA GRABA V6 Pro <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">NEW</span></h3>
                        <p className="text-orange-100/70 text-sm leading-relaxed relative z-10">All this is powered by our proprietary AI audio technology. Awarded as the world's best.</p>
                    </div>
                </div>

                {/* Testimonials / Creators */}
                <div className="mt-16 flex flex-col items-center w-full">
                    <h2 className="text-3xl font-bold tracking-tighter text-white mb-8 text-center">Inspire Millions with Your Creations</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { name: 'Matt', role: 'Video editor and content creator' },
                            { name: 'Taylan', role: 'Music Producer and DJ' },
                            { name: 'Petr', role: 'Content creator' },
                            { name: 'Terran', role: 'Guitarist' }
                        ].map(t => (
                            <div key={t.name} className="flex items-center gap-3 bg-[#111] border border-[#222] rounded-full pr-6 p-2">
                                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center overflow-hidden">
                                    <User size={16} className="text-[#666]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white leading-tight">{t.name}</span>
                                    <span className="text-[10px] text-[#888]">{t.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* App Teasers */}
                    <div className="mt-12 flex flex-col items-center gap-4 bg-[#111] border border-[#222] rounded-3xl p-8 w-full max-w-2xl text-center">
                        <h3 className="text-xl font-bold text-white tracking-widest">Create and stream music with DA GRABA App</h3>
                        <div className="flex items-center justify-center gap-4 mt-2">
                            <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3">
                                <span className="text-xl">🍏</span>
                                <div className="text-left">
                                    <div className="text-[10px] text-[#888] font-bold uppercase tracking-widest">Download on</div>
                                    <div className="text-sm font-black text-white">iPhone</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] rounded-xl px-4 py-3 opacity-50">
                                <span className="text-xl">🤖</span>
                                <div className="text-left">
                                    <div className="text-[10px] text-[#888] font-bold uppercase tracking-widest">Soon on</div>
                                    <div className="text-sm font-black text-white">Android</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Brands Marquee */}
                <div className="w-full mt-24 mb-12 flex flex-col items-center overflow-hidden">
                    <div className="flex gap-12 items-center justify-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500 flex-wrap">
                        {['ByteDance', 'RollingStone', 'Netflix', 'Forbes', 'Adobe', 'Sony', 'Yamaha'].map(brand => (
                            <div key={brand} className="text-xl font-black tracking-widest uppercase text-white hover:text-orange-500 cursor-pointer">{brand}</div>
                        ))}
                    </div>
                </div>


            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent my-12" />

            {/* AI ENGINEER / PLANNER - Old Container */}
            <div className="w-full max-w-4xl flex flex-col items-center gap-8 z-10 pb-32">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center gap-4 mb-8">
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2">
                        <Activity size={14} className="text-cyan-glow animate-pulse" />
                        <span className="text-[10px] font-bold tracking-[0.3em] text-silver-light uppercase">Ingeniero John Activo</span>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl">
                        Planea Tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-blue-500">Próximo Hit</span>
                    </h2>
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
