'use client';

import { useDAWStore } from '@/store/useDAWStore';
import { Fader } from '@/components/daw/Fader';
import { AudioTimeline } from '@/components/daw/AudioTimeline';
import { DawTrackControl } from '@/components/daw/DawTrackControl';
import { PianoRoll } from '@/components/daw/PianoRoll';
import { TransportBar } from '@/components/daw/TransportBar';
import { SpectrumAnalyzer } from '@/components/daw/SpectrumAnalyzer';
import { StudioChat } from '@/components/daw/StudioChat';
import { Activity } from 'lucide-react';

export default function Studio() {
    const faders = useDAWStore((state) => state.faders);
    const tracks = useDAWStore((state) => state.tracks);
    const addTrack = useDAWStore((state) => state.addTrack);
    const isTraining = useDAWStore((state) => state.isTraining);
    const activeBottomPanel = useDAWStore((state) => state.activeBottomPanel);
    const mixerBank = useDAWStore((state) => state.mixerBank);
    const setMixerBank = useDAWStore((state) => state.setMixerBank);
    const isFullMixer = useDAWStore((state) => state.isFullMixer);

    // Every track has a corresponding fader with same ID
    const activeFaders = faders;

    return (
        <div className="flex flex-col h-full w-full pointer-events-auto bg-[#0A0A0C]">

            {/* TOP HEADER: Pro Tools / Logic Transport Bar */}
            <TransportBar />

            {/* CENTER: Audio Timeline & Track Control Column */}
            {!isFullMixer && (
                <div className={`flex flex-1 w-full px-8 py-2 gap-4 z-20 max-w-[2000px] mx-auto overflow-hidden transition-all duration-300 ${activeBottomPanel !== 'closed' ? 'min-h-[250px]' : 'h-full pb-8'}`}>
                    {/* Left Column: Track Controls */}
                    <div className="w-[200px] bg-[#111113]/80 backdrop-blur-md border border-[#333] flex flex-col overflow-y-auto shadow-2xl rounded-md shrink-0 py-4 custom-scrollbar">
                        {tracks.map((track) => (
                            <DawTrackControl key={track.id} trackId={track.id} trackName={track.name} color={track.color} />
                        ))}
                        <button
                            onClick={() => addTrack()}
                            className="mt-4 mx-4 py-2 border border-dashed border-[#444] rounded text-[#888] hover:text-white hover:border-[#888] transition-colors text-xs font-bold tracking-widest flex items-center justify-center gap-2"
                        >
                            + NEW TRACK
                        </button>
                    </div>

                    {/* Main Timeline Canvas */}
                    <div className="flex-1 bg-[#1A1A1C]/90 backdrop-blur-md relative border border-[#333] shadow-2xl rounded-md overflow-hidden">
                        <AudioTimeline />
                    </div>
                </div>
            )}

            {/* BOTTOM: Conditional Workspace Panel */}
            {activeBottomPanel !== 'closed' && (
                <div className={`w-full mt-auto flex flex-col items-center justify-end z-10 pb-0 overflow-hidden transition-all duration-300 ${isFullMixer ? 'h-full' : (activeBottomPanel === 'piano_roll' ? 'h-[60vh]' : 'h-[400px]')
                    }`}>

                    {/* MIXER VIEW */}
                    {activeBottomPanel === 'mixer' && (
                        <div className="flex flex-col items-center w-full z-20">
                            {/* Spectrum Analyzer in High-End Glass Frame */}
                            <div className="w-full max-w-5xl h-[120px] mb-4 px-8 relative z-30 group">
                                <div className="absolute inset-x-8 inset-y-0 bg-black/40 backdrop-blur-2xl border border-white/5 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
                                    <SpectrumAnalyzer />
                                </div>
                            </div>

                            {/* Mixer Toolbar (Modern Bank Switch) */}
                            <div className="w-full max-w-7xl px-8 flex justify-between items-center mb-4 relative z-20">
                                <div className="flex flex-col">
                                    <h4 className="text-[10px] font-black tracking-[0.3em] text-[#444] uppercase mb-1">Mixing Console</h4>
                                    <div className="h-0.5 w-12 bg-orange-600/50" />
                                </div>

                                <div className="flex bg-[#0A0A0C] p-1 border border-white/5 rounded-lg shadow-2xl ring-1 ring-black/80">
                                    <button
                                        onClick={() => setMixerBank(1)}
                                        className={`px-6 py-1.5 text-[10px] font-black tracking-widest rounded-md transition-all ${mixerBank === 1 ? 'bg-gradient-to-b from-[#444] to-[#222] text-white shadow-lg border border-white/10' : 'text-[#444] hover:text-[#888]'}`}
                                    >
                                        CH 1-16
                                    </button>
                                    <button
                                        onClick={() => setMixerBank(2)}
                                        className={`px-6 py-1.5 text-[10px] font-black tracking-widest rounded-md transition-all ${mixerBank === 2 ? 'bg-gradient-to-b from-[#444] to-[#222] text-white shadow-lg border border-white/10' : 'text-[#444] hover:text-[#888]'}`}
                                    >
                                        CH 17-32
                                    </button>
                                </div>
                            </div>

                            <div className="w-full bg-[#111] border-t-2 border-black relative overflow-x-auto custom-scrollbar shadow-[0_-20px_60px_rgba(0,0,0,0.8)]">
                                <div className="absolute inset-0 bg-transparent opacity-10 mix-blend-overlay pointer-events-none" />

                                <div className="min-w-fit mx-auto flex justify-center py-10 px-12 relative z-10 bg-gradient-to-b from-[#151517] to-[#0A0A0C]">
                                    <div className="flex gap-1 w-full justify-center">
                                        {activeFaders.slice((mixerBank - 1) * 16, mixerBank * 16).map((fader) => (
                                            <Fader key={fader.id} id={fader.id} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PIANO ROLL VIEW */}
                    {activeBottomPanel === 'piano_roll' && (
                        <div className="w-full h-full relative z-20 transform-none">
                            <PianoRoll />
                        </div>
                    )}
                </div>
            )}

            {/* FULLSCREEN TRAINING / PROCESSING OVERLAY */}
            {isTraining && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto">
                    {/* The spectacular glowing DG Logo */}
                    <div className="w-64 h-64 rounded-full relative flex items-center justify-center shadow-[0_0_100px_rgba(255,107,0,0.8)] animate-pulse overflow-hidden border border-orange-500/30">
                        {/* Outer spinner ring */}
                        <div className="absolute inset-0 border-8 border-t-white border-r-transparent border-b-white/10 border-l-transparent rounded-full animate-spin z-10" />
                        <img src="/logo_circular.png" alt="DA GRABA Loading Logo" className="w-full h-full object-cover scale-110" />
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3">
                            <Activity size={16} className="text-primary animate-bounce" />
                            <h2 className="text-xl font-bold tracking-widest text-[#E0E0E0]">PROCESANDO EN MODAL</h2>
                        </div>
                        <p className="text-silver-dark text-sm font-mono tracking-wide max-w-sm text-center">
                            Aplicando clonación vocal y auto-mezclando niveles en la consola...
                        </p>
                    </div>
                </div>
            )}

            {/* AI PRODUCTION CHAT */}
            <StudioChat />
        </div>
    );
}
