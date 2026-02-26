'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Wand2, Mic2, Scissors, PlayCircle, ChevronRight, MessageSquare, Mic, MicOff, Volume2 } from 'lucide-react';
import { useDAWStore } from '@/store/useDAWStore';

// Type definition for Web Speech API
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

export function StudioChat() {
    const addTrack = useDAWStore((state) => state.addTrack);
    const setTracks = useDAWStore((state) => state.setTracks);
    const clearTracks = useDAWStore((state) => state.clearTracks);
    const tracks = useDAWStore((state) => state.tracks);

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: '¡Estamos en el studio! El plan está listo. ¿Quieres que genere la primera mitad de los instrumentos o prefieres grabar algo tú primero?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = 'es-ES';

            recognition.onresult = (event: any) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                if (transcript.trim()) {
                    handleVoiceInput(transcript);
                }
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                if (isListening) recognition.start(); // Auto-restart if it should be listening
            };

            recognitionRef.current = recognition;
        }
    }, [isListening]);

    const playJohnVoice = async (text: string) => {
        try {
            setIsSpeaking(true);
            const response = await fetch('/api/ai/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error('Failed to fetch voice');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
            } else {
                const audio = new Audio(url);
                audioRef.current = audio;
                audio.play();
            }

            audioRef.current!.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(url);
            };
        } catch (error) {
            console.error('TTS Error:', error);
            setIsSpeaking(false);
        }
    };

    const triggerGeneration = () => {
        setIsTyping(true);
        setTimeout(() => {
            const demoTracks = [
                { id: 't-beat', name: 'Dark Trap Beat (AI)', color: '#FF6B00' },
                { id: 't-808', name: 'Heavy 808 Sub', color: '#B026FF' },
                { id: 't-melody', name: 'Dark Piano Melody', color: '#00F0FF' },
                { id: 't-perch', name: 'Percussion Loop', color: '#A4ECA1' }
            ];
            setTracks(demoTracks);
            const msg = "¡Listo! He abierto los tracks en el espacio de trabajo como por arte de magia. He configurado la batería, el bajo y la melodía principal. ¿Escuchamos esta primera parte?";
            setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
            setIsTyping(false);
            playJohnVoice(msg);
        }, 1500);
    };

    const handleSend = async (forcedInput?: string) => {
        const textToSend = forcedInput || input;
        if (!textToSend.trim() || isTyping) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: textToSend }]);

        const lowInput = textToSend.toLowerCase();
        if (lowInput.includes('genera') || lowInput.includes('mitad') || lowInput.includes('abre')) {
            triggerGeneration();
            return;
        }

        setIsTyping(true);
        // Simulation for now - will connect to specialized Production API
        setTimeout(() => {
            let response = "Entendido, estoy trabajando en ello...";

            if (lowInput.includes('continua') || lowInput.includes('sigue')) {
                response = "Perfecto, expandiendo la estructura. Añadiendo variaciones en el beat y texturas para el coro.";
            } else if (lowInput.includes('separa') || lowInput.includes('stems')) {
                response = "Iniciando proceso de separación de pistas (Stems). Procesando voz, percusión y armonía...";
            } else if (lowInput.includes('efecto') || lowInput.includes('bajo')) {
                response = "¡Entendido! Añadiendo un compresor y saturación al track del Bajo en el compás solicitado. John se encarga.";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsTyping(false);
            playJohnVoice(response);
        }, 1500);
    };

    const handleVoiceInput = (transcript: string) => {
        handleSend(transcript);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    return (
        <div className={`fixed right-8 bottom-32 z-50 transition-all duration-500 flex flex-col items-end ${isOpen ? 'w-80 h-[450px]' : 'w-12 h-12'}`}>

            {/* TOGGLE BUTTON */}
            <div className="flex flex-col gap-3">
                <button
                    onClick={toggleListening}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isListening ? 'bg-red-500 animate-pulse glow-red' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                >
                    {isListening ? <Mic className="text-white" size={20} /> : <MicOff className="text-silver-dark" size={20} />}
                </button>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isOpen ? 'bg-orange-600 scale-90' : 'bg-gradient-to-br from-cyan-glow to-blue-600 glow-cyan hover:scale-110'}`}
                >
                    {isOpen ? <ChevronRight className="text-white" /> : <MessageSquare className="text-white" />}
                </button>
            </div>

            {/* CHAT WINDOW */}
            <div className={`mt-4 w-full h-full bg-[#0B1015]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

                {/* Header */}
                <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-cyan-glow" />
                        <span className="text-xs font-bold tracking-widest text-[#E0E0E0]">ENGINEER FEEDBACK</span>
                    </div>
                    {isSpeaking && <Volume2 size={14} className="text-cyan-glow animate-pulse" />}
                </div>

                {/* Messages Panel */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${m.role === 'user'
                                ? 'bg-orange-600/20 border border-orange-500/30 text-white'
                                : 'bg-white/5 border border-white/10 text-silver-light'
                                }`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-1 ml-2">
                            <div className="w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1.5 h-1.5 bg-cyan-glow rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="px-3 py-2 flex gap-2 overflow-x-auto border-t border-white/5 bg-black/20 no-scrollbar">
                    <button
                        onClick={triggerGeneration}
                        className="whitespace-nowrap flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-silver-dark hover:text-cyan-glow transition-colors"
                    >
                        <Wand2 size={10} /> Generar Mitad
                    </button>
                    <button className="whitespace-nowrap flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-silver-dark hover:text-white transition-colors">
                        <PlayCircle size={10} /> Continuar
                    </button>
                    <button
                        onClick={clearTracks}
                        className="whitespace-nowrap flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-red-400 hover:text-red-300 transition-colors"
                    >
                        <Scissors size={10} /> Limpiar Todo
                    </button>
                    <button className="whitespace-nowrap flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-silver-dark hover:text-white transition-colors">
                        <Mic2 size={10} /> Grabar Hum
                    </button>
                </div>

                {/* Input Area */}
                <div className="p-3 bg-black/40 flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isListening ? "Te escucho..." : "Dime qué sigue..."}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-glow/50 transition-colors"
                    />
                    <button
                        onClick={() => handleSend()}
                        className="p-2 bg-orange-600 rounded-lg hover:bg-orange-500 transition-colors shadow-lg"
                    >
                        <Send size={14} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
