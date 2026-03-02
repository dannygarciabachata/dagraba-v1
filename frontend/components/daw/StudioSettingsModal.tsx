
import React, { useEffect, useState } from 'react';
import { X, Settings, Keyboard, Mic, Speaker, RefreshCw } from 'lucide-react';
import { useDAWStore } from '@/store/useDAWStore';
import { audioEngine } from '@/lib/audio/WebAudioEngine';

interface StudioSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function StudioSettingsModal({ isOpen, onClose }: StudioSettingsModalProps) {
    const [inputs, setInputs] = useState<MediaDeviceInfo[]>([]);
    const [outputs, setOutputs] = useState<MediaDeviceInfo[]>([]);
    const [midiDevices, setMidiDevices] = useState<WebMidi.MIDIInput[]>([]);

    const audioInputId = useDAWStore(state => state.audioInputDeviceId);
    const audioOutputId = useDAWStore(state => state.audioOutputDeviceId);
    const midiInputId = useDAWStore(state => state.midiInputId);

    const setAudioDevices = useDAWStore(state => state.setAudioDevices);
    const setMidiInputId = useDAWStore(state => state.setMidiInputId);

    const refreshDevices = async () => {
        const { inputs: audioInputs, outputs: audioOutputs } = await audioEngine.getAudioDevices();
        setInputs(audioInputs);
        setOutputs(audioOutputs);

        if (navigator.requestMIDIAccess) {
            try {
                const midi = await navigator.requestMIDIAccess();
                const inputs: WebMidi.MIDIInput[] = [];
                midi.inputs.forEach(input => inputs.push(input));
                setMidiDevices(inputs);
            } catch (e) {
                console.error('MIDI not supported', e);
            }
        }
    };

    useEffect(() => {
        if (isOpen) {
            refreshDevices();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
            <div className="bg-[#1C1C1E] border border-white/10 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-2">
                        <Settings size={18} className="text-[#FF6B00]" />
                        <h2 className="text-sm font-bold tracking-widest text-white uppercase">Configuración de Hardware</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 overflow-y-auto">

                    {/* MIDI Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/80">
                                <Keyboard size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">MIDI Controller (USB)</span>
                            </div>
                            <button onClick={refreshDevices} className="p-1 text-[#FF6B00] hover:text-[#FF8B30] transition-colors" title="Refrescar">
                                <RefreshCw size={14} />
                            </button>
                        </div>
                        <select
                            value={midiInputId || ''}
                            onChange={(e) => setMidiInputId(e.target.value || null)}
                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00] appearance-none"
                        >
                            <option value="">Ninguno</option>
                            {midiDevices.map(dev => (
                                <option key={dev.id} value={dev.id}>{dev.name || 'MIDI Device'}</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-white/40 italic">
                            * Conecta tu piano USB y selecciónalo aquí para tocar instrumentos virtuales.
                        </p>
                    </div>

                    {/* Audio Input Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/80">
                            <Mic size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Entrada de Audio (Microphone/Line)</span>
                        </div>
                        <select
                            value={audioInputId || ''}
                            onChange={(e) => setAudioDevices(e.target.value || null, audioOutputId)}
                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                        >
                            <option value="">Seleccionar entrada...</option>
                            {inputs.map(dev => (
                                <option key={dev.deviceId} value={dev.deviceId}>{dev.label || `Entrada ${dev.deviceId.slice(0, 4)}`}</option>
                            ))}
                        </select>
                    </div>

                    {/* Audio Output Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white/80">
                            <Speaker size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Salida de Audio (Monitores/Auriculares)</span>
                        </div>
                        <select
                            value={audioOutputId || ''}
                            onChange={(e) => setAudioDevices(audioInputId, e.target.value || null)}
                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                        >
                            <option value="">Seleccionar salida...</option>
                            {outputs.map(dev => (
                                <option key={dev.deviceId} value={dev.deviceId}>{dev.label || `Salida ${dev.deviceId.slice(0, 4)}`}</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-white/40 italic">
                            * Asegúrate de que los drivers de tu tarjeta de sonido estén actualizados.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 bg-black/20 border-t border-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-[#FF6B00] hover:bg-[#FF8B30] text-black text-[10px] font-black tracking-widest px-6 py-2 rounded transition-all shadow-lg hover:shadow-[#FF6B00]/20"
                    >
                        ACEPTAR
                    </button>
                </div>
            </div>
        </div>
    );
}
