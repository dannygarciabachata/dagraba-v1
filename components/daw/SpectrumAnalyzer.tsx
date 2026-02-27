'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useDAWStore } from '@/store/useDAWStore';

interface SpectrumAnalyzerProps {
    analyzer?: AnalyserNode; // Optional: If provided, uses real audio data
    naked?: boolean; // If true, removes background and border
    isPlaying?: boolean; // Optional override
}

export function SpectrumAnalyzer({ analyzer, naked, isPlaying }: SpectrumAnalyzerProps) {
    const dawIsPlaying = useDAWStore((state) => state.isPlaying);
    const actualIsPlaying = isPlaying !== undefined ? isPlaying : dawIsPlaying;
    
    const isPlayingRef = useRef(actualIsPlaying);
    useEffect(() => {
        isPlayingRef.current = actualIsPlaying;
    }, [actualIsPlaying]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);

    // Smooth falloff state holding the max peaks
    const peaksRef = useRef<number[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Ensure canvas renders sharply on high-DPI displays
        const scale = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * scale;
        canvas.height = canvas.clientHeight * scale;
        ctx.scale(scale, scale);

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        let dataArray: Uint8Array;
        let bufferLength = 128; // Default if no analyzer

        if (analyzer) {
            bufferLength = analyzer.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        } else {
            dataArray = new Uint8Array(bufferLength);
        }

        // Initialize peaks array
        if (peaksRef.current.length !== bufferLength) {
            peaksRef.current = new Array(bufferLength).fill(0);
        }

        const renderFrame = () => {
            requestRef.current = requestAnimationFrame(renderFrame);

            if (!isPlayingRef.current) {
                // Dim the display when not playing
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Slowly decay any existing peaks
                peaksRef.current = peaksRef.current.map(p => p * 0.9);

                // Draw static low baseline
                const barWidth = Math.ceil(canvas.width / bufferLength);
                for (let i = 0; i < bufferLength; i++) {
                    const x = i * barWidth;
                    ctx.fillStyle = `rgba(255, 107, 0, 0.05)`;
                    ctx.fillRect(x, canvas.height - 2, barWidth - 1, 2);
                }
                return;
            }

            // Get audio data
            if (analyzer) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                analyzer.getByteFrequencyData(dataArray as any);
            } else {
                // Simulate data for visual placeholder
                const time = Date.now() / 1000;
                for (let i = 0; i < bufferLength; i++) {
                    // Create some dynamic peaks that look like music
                    const noise = Math.random() * 20;
                    const wave1 = Math.sin(time * 2 + i * 0.1) * 50 + 50;
                    const wave2 = Math.cos(time * 5 - i * 0.3) * 60 + 60;

                    // Emphasize bass (lower indices)
                    const bassBoost = i < 20 ? (20 - i) * 3 : 0;

                    // Attenuate highs
                    const highCut = i > 80 ? (i - 80) * 2 : 0;

                    let val = (wave1 + wave2) / 2 + noise + bassBoost - highCut;

                    // Occasional random spikes (like kick/snare)
                    if (Math.random() > 0.95 && i < 40) val += 80;

                    dataArray[i] = Math.max(0, Math.min(255, val));
                }
            }

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Calculate bar width (leaving some gap)
            // We use a subset of the buffer for better aesthetics (skipping the very highest dead frequencies)
            const displayBins = Math.floor(bufferLength * 0.7);
            const barWidth = (width / displayBins) - 1; // 1px gap
            let x = 0;

            const peaks = peaksRef.current;
            const gravity = 1.5; // Speed at which peaks fall

            for (let i = 0; i < displayBins; i++) {
                const value = dataArray[i];

                // Update peak for smooth falloff
                if (value > peaks[i]) {
                    peaks[i] = value;
                } else {
                    peaks[i] = Math.max(0, peaks[i] - gravity);
                }

                // Normalize values to canvas height
                const barHeight = (value / 255) * height;
                const peakHeight = (peaks[i] / 255) * height;

                // --- Draw Main Bar ---
                // Gradient from Metallic Gray to DA GRABA Naranja (#FF6B00)
                const barGradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
                barGradient.addColorStop(0, '#5A5A60');      // Metallic gray base
                barGradient.addColorStop(0.5, '#8C8C91');    // Lighter gray middle
                barGradient.addColorStop(1, '#FF6B00');      // Orange peak

                ctx.fillStyle = barGradient;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);

                // --- Draw Floating Peak (Cap) ---
                // To enhance the 2D/3D feel, draw a bright cap at the peak level
                ctx.fillStyle = '#FF9A4A'; // Slightly brighter orange for the cap
                ctx.fillRect(x, height - peakHeight - 2, barWidth, 2);

                x += barWidth + 1;
            }
        };

        renderFrame();

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [analyzer]);

    return (
        <div className={cn(
            "w-full h-full relative p-2 overflow-hidden",
            !naked && "bg-[#111113]/60 backdrop-blur-md rounded-lg border border-[#333] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
        )}>
            {/* Glassmorphism reflection highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-lg" />

            <canvas
                ref={canvasRef}
                className="w-full h-full block"
            />
        </div>
    );
}
