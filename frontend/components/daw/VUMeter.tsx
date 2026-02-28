import { cn } from '@/lib/utils';

interface VUMeterProps {
    level: number; // 0 to 127
    className?: string;
}

export function VUMeter({ level, className }: VUMeterProps) {
    // Simple segmentation
    const totalSegments = 30;
    const activeSegments = Math.round((level / 127) * totalSegments);

    return (
        <div className={cn("flex flex-col justify-end bg-black/40 rounded-sm overflow-hidden p-[1px] gap-[1px] border border-white/5 shadow-inner relative", className)}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
            {Array.from({ length: totalSegments }).map((_, i) => {
                const segmentIndex = totalSegments - 1 - i;
                const isActive = segmentIndex < activeSegments;
                let colorClass = '';

                if (isActive) {
                    if (segmentIndex > totalSegments - 4) {
                        colorClass = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
                    } else if (segmentIndex > totalSegments - 10) {
                        colorClass = 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]';
                    } else {
                        colorClass = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
                    }
                } else {
                    colorClass = 'bg-white/5';
                }

                return (
                    <div
                        key={i}
                        className={cn("w-full h-[3px] transition-all duration-75 rounded-[0.5px]", colorClass)}
                    />
                );
            })}
        </div>
    );
}
