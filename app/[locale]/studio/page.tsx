'use client';

import { useDAWStore } from '@/store/useDAWStore';
import { Fader } from '@/components/daw/Fader';
import { AudioTimeline } from '@/components/daw/AudioTimeline';
import { DawTrackControl } from '@/components/daw/DawTrackControl';
import { PianoRoll } from '@/components/daw/PianoRoll';
import { TransportBar } from '@/components/daw/TransportBar';
import { SpectrumAnalyzer } from '@/components/daw/SpectrumAnalyzer';
import { StudioChat } from '@/components/daw/StudioChat';
import { Activity, Layers } from 'lucide-react';
import { PluginWindow } from '@/components/daw/PluginWindow';
import { TrackTypeModal } from '@/components/daw/TrackTypeModal';
import { StemExtractModal } from '@/components/daw/StemExtractModal';
import { DrumPadMidi } from '@/components/daw/DrumPadMidi';
import { MidiKeyboardComponent } from '@/components/daw/MidiKeyboardComponent';
import { useUserStore } from '@/store/useUserStore';
import { PlanLock } from '@/components/ui/PlanLock';
import { useState, useEffect } from 'react';

export default function Studio() {
    const plan = useUserStore((state) => state.plan);
    const faders = useDAWStore((state) => state.faders);
    const tracks = useDAWStore((state) => state.tracks);
    const addTrack = useDAWStore((state) => state.addTrack);
    const isTraining = useDAWStore((state) => state.isTraining);
    const activeBottomPanel = useDAWStore((state) => state.activeBottomPanel);
    const mixerBank = useDAWStore((state) => state.mixerBank);
    const setMixerBank = useDAWStore((state) => state.setMixerBank);
    const isFullMixer = useDAWStore((state) => state.isFullMixer);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [showStemModal, setShowStemModal] = useState(false);
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    const openPluginIds = useDAWStore((state) => state.openPluginIds);
    const closePlugin = useDAWStore((state) => state.closePlugin);

    if (!hasHydrated) return null;

    // PLAN GUARD: Studio requires at least 'pro'
    if (plan === 'free') {
        return <PlanLock requiredPlan="pro" featureName="AI Production Studio" />;
    }

    // Every track has a corresponding fader with same ID
    const activeFaders = faders;

    return (
        <div className="flex flex-col h-full w-full pointer-events-auto bg-[#0A0A0C]">

            {/* TOP HEADER: Pro Tools / Logic Transport Bar */}
            <TransportBar />

            {/* CENTER: Audio Timeline & Track Control Column */}
            <div className={`flex flex-1 w-full px-8 py-2 gap-4 z-20 max-w-[2000px] mx-auto overflow-hidden transition-all duration-300 ${isFullMixer ? 'hidden' : (activeBottomPanel !== 'closed' ? 'min-h-[250px]' : 'h-full pb-8')
                }`}>
                {/* Left Column: Track Controls */}
                <div className="w-[200px] bg-[#111113]/80 backdrop-blur-md border border-[#333] flex flex-col overflow-y-auto shadow-2xl rounded-md shrink-0 py-4 custom-scrollbar">
                    {tracks.map((track) => (
                        <DawTrackControl key={track.id} trackId={track.id} trackName={track.name} color={track.color} />
                    ))}

                    {/* Extract Stems button */}
                    <button
                        onClick={() => setShowStemModal(true)}
                        className="mt-4 mx-4 py-2 rounded bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 hover:from-cyan-600/30 hover:to-blue-600/30 hover:border-cyan-400/50 transition-all text-[10px] font-black tracking-widest flex items-center justify-center gap-2"
                    >
                        <Layers size={12} /> EXTRAER STEMS
                    </button>

                    <button
                        onClick={() => setShowTrackModal(true)}
                        className="mt-2 mx-4 py-2 border border-dashed border-[#444] rounded text-[#888] hover:text-white hover:border-[#888] transition-colors text-xs font-bold tracking-widest flex items-center justify-center gap-2"
                    >
                        + NEW TRACK
                    </button>
                </div>

                {/* Main Timeline Canvas */}
                <div className="flex-1 bg-[#1A1A1C]/90 backdrop-blur-md relative border border-[#333] shadow-2xl rounded-md overflow-hidden">
                    <AudioTimeline />
                </div>
            </div>

            {/* BOTTOM: Conditional Workspace Panel */}
            {activeBottomPanel !== 'closed' && (
                <div className={`w-full mt-auto flex flex-col items-center justify-end z-10 pb-0 overflow-hidden transition-all duration-300 ${isFullMixer ? 'h-full' : (activeBottomPanel === 'piano_roll' ? 'h-[60vh]' : 'h-[400px]')
                    }`}>

                    {/* MIXER VIEW - RESTORED AND SYNCED */}
                    {activeBottomPanel === 'mixer' && (
                        <div className="flex flex-col items-center w-full z-20">
                            {/* Fast Feedback: Spectrum Analyzer */}
                            <div className="w-full max-w-5xl h-[100px] mb-2 px-8 relative z-30">
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden">
                                    <SpectrumAnalyzer />
                                </div>
                            </div>

                            {/* Mixer Strip */}
                            <div className="w-full bg-[#111] border-t border-[#333] relative overflow-x-auto custom-scrollbar shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
                                {faders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-30 gap-2">
                                        <Layers size={20} />
                                        <p className="text-[10px] font-bold tracking-widest uppercase">Console Empty</p>
                                    </div>
                                ) : (
                                    <div className="min-w-fit mx-auto flex justify-center py-6 px-10 relative z-10 bg-gradient-to-b from-[#151517] to-[#0A0A0C]">
                                        <div className="flex gap-2 w-full justify-center">
                                            {activeFaders.map((fader) => (
                                                <Fader key={fader.id} id={fader.id} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PIANO ROLL VIEW */}
                    {activeBottomPanel === 'piano_roll' && (
                        <div className="w-full h-full relative z-20 transform-none">
                            <PianoRoll />
                        </div>
                    )}

                    {/* DRUM PAD MIDI VIEW */}
                    {activeBottomPanel === 'drums' && (
                        <div className="w-full h-full relative z-20 p-4">
                            <DrumPadMidi />
                        </div>
                    )}

                    {/* VIRTUAL KEYBOARD (KEYS) VIEW */}
                    {activeBottomPanel === 'keys' && (
                        <div className="w-full h-full relative z-20 p-4 flex justify-center">
                            <MidiKeyboardComponent />
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

            {/* FLOATING PLUGIN WINDOWS */}
            {openPluginIds.map((insertId) => {
                // Find which fader/track this insert belongs to
                const fader = faders.find(f => f.inserts.some(i => i.id === insertId));
                const insert = fader?.inserts.find(i => i.id === insertId);

                if (!fader || !insert) return null;

                return (
                    <PluginWindow
                        key={insertId}
                        trackId={fader.id}
                        insert={insert}
                        onClose={() => closePlugin(insertId)}
                    />
                );
            })}

            {/* TRACK TYPE MODAL */}
            {showTrackModal && (
                <TrackTypeModal
                    onSelect={(type, name) => {
                        addTrack(name, undefined, type);
                        setShowTrackModal(false);
                    }}
                    onClose={() => setShowTrackModal(false)}
                />
            )}

            {/* STEM EXTRACT MODAL */}
            {showStemModal && (
                <StemExtractModal onClose={() => setShowStemModal(false)} />
            )}
        </div>
    );
}
