'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface KnobProps {
    value: number;
    min: number;
    max: number;
    onChange: (val: number) => void;
    className?: string;
    size?: number;
}

export function Knob({ value, min, max, onChange, className, size = 32 }: KnobProps) {
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const startVal = useRef(value);

    const range = max - min;
    const percentage = (value - min) / range;
    // Map 0-100% to -135 to +135 degrees (270 total sweep)
    const rotation = percentage * 270 - 135;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaY = startY.current - e.clientY;
            // 1 pixel = 1 step for now. Add shift key for precision later.
            const step = range / 100;
            let newVal = startVal.current + deltaY * step;
            newVal = Math.max(min, Math.min(max, newVal));
            onChange(Math.round(newVal));
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, min, max, onChange, range]);

    return (
        <div
            className={cn("relative rounded-full bg-carbon shadow-xl border border-silver-dark/40 flex items-center justify-center cursor-ns-resize", className)}
            style={{ width: size, height: size }}
            onMouseDown={(e) => {
                setIsDragging(true);
                startY.current = e.clientY;
                startVal.current = value;
            }}
        >
            <div
                className="absolute top-0 w-1 bg-primary rounded-t-full origin-bottom transition-transform duration-75"
                style={{ height: '50%', transform: `rotate(${rotation}deg)` }}
            />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-neutral-700 to-black shadow-inner" />
        </div>
    );
}
