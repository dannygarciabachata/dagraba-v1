import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    orientation?: 'horizontal' | 'vertical';
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
    ({ className, orientation = 'horizontal', ...props }, ref) => {
        return (
            <input
                type="range"
                ref={ref}
                className={cn(
                    'appearance-none bg-transparent cursor-pointer',
                    // Custom track sizing and colors
                    '[&::-webkit-slider-runnable-track]:bg-carbon [&::-webkit-slider-runnable-track]:border [&::-webkit-slider-runnable-track]:border-silver-dark/30',
                    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-silver-light',
                    '[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,107,0,0.3)] hover:[&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(255,107,0,0.6)]',
                    {
                        'w-full h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:-mt-1': orientation === 'horizontal',
                        // Vertical slider hacks
                        '[writing-mode:vertical-lr] [direction:rtl] h-full w-2 [&::-webkit-slider-runnable-track]:w-2 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-carbon': orientation === 'vertical',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Slider.displayName = 'Slider';

export { Slider };
