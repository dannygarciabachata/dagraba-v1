'use client';

import React, { useEffect, useRef, useState } from 'react';

interface WaveformCanvasProps {
    audioUrl?: string;
    color: string;
    width: number;
    height: number;
}

// Global cache for waveforms to avoid re-decoding
const waveformCache = new Map<string, Float32Array>();

export function WaveformCanvas({ audioUrl, color, width, height }: WaveformCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!audioUrl || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let cancelled = false;

        async function drawWaveform() {
            if (!audioUrl) return;

            setIsLoading(true);

            try {
                let data: Float32Array;

                if (waveformCache.has(audioUrl)) {
                    data = waveformCache.get(audioUrl)!;
                } else {
                    // Fetch via proxy to avoid CORS
                    const proxyUrl = `/api/audio-proxy?url=${encodeURIComponent(audioUrl)}`;
                    const response = await fetch(proxyUrl);
                    const arrayBuffer = await response.arrayBuffer();

                    // Decode
                    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

                    // Downsample to 1000 points (or more if needed)
                    const rawData = audioBuffer.getChannelData(0);
                    const samplesPerPoint = Math.floor(rawData.length / 500); // 500 bars for waveform
                    data = new Float32Array(500);

                    for (let i = 0; i < 500; i++) {
                        let sum = 0;
                        for (let j = 0; j < samplesPerPoint; j++) {
                            sum += Math.abs(rawData[i * samplesPerPoint + j]);
                        }
                        data[i] = sum / samplesPerPoint;
                    }

                    waveformCache.set(audioUrl, data);
                    await audioCtx.close();
                }

                if (cancelled) return;

                // Render on canvas
                if (!ctx) return;
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.5;

                const barWidth = width / data.length;
                for (let i = 0; i < data.length; i++) {
                    const barHeight = data[i] * height * 2.5; // Scale for visibility
                    const x = i * barWidth;
                    const y = (height - barHeight) / 2;
                    ctx.fillRect(x, y, barWidth - 1, barHeight);
                }
            } catch (err) {
                console.error('[WaveformCanvas] Error:', err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        drawWaveform();

        return () => {
            cancelled = true;
        };
    }, [audioUrl, width, height, color]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isLoading ? 'opacity-20' : 'opacity-100'}`}
        />
    );
}
