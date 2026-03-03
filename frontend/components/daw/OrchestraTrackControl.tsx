import React, { useState } from 'react';
import { FileUp, FileMusic, Download, CheckCircle2, AlertCircle, Activity, Mic } from 'lucide-react';
import { useDAWStore } from '@/store/useDAWStore';
import { CommandMenu } from '@/components/studio/CommandMenu';

interface OrchestraTrackControlProps {
    trackId: string;
}

export function OrchestraTrackControl({ trackId }: OrchestraTrackControlProps) {
    const track = useDAWStore((state) => state.tracks.find((t) => t.id === trackId));
    const updateTrack = useDAWStore((state) => state.updateTrack);
    const detectADNTrigger = useDAWStore((state) => state.detectADNTrigger);
    const [isHovered, setIsHovered] = useState(false);

    if (!track) return null;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'audio') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Visual feedback
        updateTrack(trackId, { adnStatus: 'processing' });

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64Content = event.target?.result as string;

            // Update track state
            if (type === 'pdf') {
                updateTrack(trackId, { pdfUrl: file.name, referenceType: 'pdf' });
            } else {
                updateTrack(trackId, { audioReferenceUrl: file.name, referenceType: 'audio' });
            }

            // Trigger Backend Orchestra Processing
            try {
                const response = await fetch('/api/ai/orchestra', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        track_name: track.name,
                        genre: 'bachata',
                        pdf_data: type === 'pdf' ? base64Content.split(',')[1] : null,
                        audio_reference_data: type === 'audio' ? base64Content.split(',')[1] : null,
                        reference_type: type,
                        commands: track.commands || []
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    updateTrack(trackId, {
                        adnStatus: 'ready',
                        stemUrl: data.output_url || `/exports/${data.job_id}.mp3`
                    });
                } else {
                    updateTrack(trackId, { adnStatus: 'error' });
                }
            } catch (err) {
                console.error("Orchestra processing error:", err);
                updateTrack(trackId, { adnStatus: 'error' });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        detectADNTrigger(trackId, newName);
    };

    return (
        <div
            className="w-full bg-[#111113]/60 backdrop-blur-xl border border-white/5 rounded-xl p-4 flex flex-col gap-4 group transition-all hover:bg-[#111113]/80 hover:border-white/10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header: Name & ADN Badge */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                    <div
                        className="w-2 h-8 rounded-full"
                        style={{ backgroundColor: track.color }}
                    />
                    <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={track.name}
                                onChange={handleNameChange}
                                className="bg-transparent border-none text-sm font-bold tracking-wider text-white focus:outline-none focus:ring-0 p-0 w-full uppercase"
                                placeholder="NOMBRE DEL INSTRUMENTO"
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-[0.2em] border ${track.instrumentMaterial === 'metal'
                                ? 'bg-orange-500/10 border-orange-500/50 text-orange-500'
                                : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-500'
                                }`}>
                                ADN: {track.instrumentMaterial?.toUpperCase() || 'NYLON'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center shrink-0">
                    {track.adnStatus === 'processing' && (
                        <div className="flex items-center gap-2 text-primary animate-pulse">
                            <Activity size={14} className="animate-spin" />
                            <span className="text-[10px] font-bold uppercase">Procesando...</span>
                        </div>
                    )}
                    {track.adnStatus === 'ready' && (
                        <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle2 size={14} />
                            <span className="text-[10px] font-bold uppercase">Ready</span>
                        </div>
                    )}
                    {track.adnStatus === 'error' && (
                        <div className="flex items-center gap-2 text-red-500">
                            <AlertCircle size={14} />
                            <span className="text-[10px] font-bold uppercase">Error</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions Grid: PDF vs Audio Reference */}
            <div className="grid grid-cols-2 gap-2">
                {/* Import PDF */}
                <label className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all cursor-pointer group/btn ${track.referenceType === 'pdf' ? 'bg-primary/20 border-primary/50 text-white' : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}>
                    <FileUp size={14} className={track.referenceType === 'pdf' ? 'text-primary' : 'text-silver-dark'} />
                    <span className="text-[10px] font-black tracking-widest uppercase">
                        {track.pdfUrl ? 'PDF LISTO' : 'SCORE PDF'}
                    </span>
                    <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'pdf')}
                    />
                </label>

                {/* Audio Reference */}
                <label className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all cursor-pointer group/btn ${track.referenceType === 'audio' ? 'bg-purple-500/20 border-purple-500/50 text-white' : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}>
                    <Mic size={14} className={track.referenceType === 'audio' ? 'text-purple-400' : 'text-silver-dark'} />
                    <span className="text-[10px] font-black tracking-widest uppercase">
                        {track.audioReferenceUrl ? 'DEMO LISTO' : 'REF AUDIO'}
                    </span>
                    <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'audio')}
                    />
                </label>
            </div>

            {/* Stem Output / Actions */}
            <div className="grid grid-cols-1 gap-2">
                <button
                    disabled={!track.stemUrl}
                    onClick={() => track.stemUrl && window.open(track.stemUrl, '_blank')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all ${track.stemUrl
                        ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/30 text-green-400 hover:from-green-600/30 hover:to-emerald-600/30'
                        : 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed'
                        }`}
                >
                    <Download size={14} />
                    <span className="text-[10px] font-black tracking-widest uppercase">BAJAR ARREGLO ADN</span>
                </button>
            </div>

            {/* Score Preview / Linked Info */}
            {track.pdfUrl && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 border border-white/5">
                    <FileMusic size={12} className="text-[#FF6B00]" />
                    <span className="text-[9px] font-mono text-[#666] truncate">{track.pdfUrl}</span>
                </div>
            )}

            {/* Musical Command Library */}
            <CommandMenu trackId={trackId} />
        </div>
    );
}
