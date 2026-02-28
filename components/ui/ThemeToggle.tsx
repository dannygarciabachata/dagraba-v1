'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';

export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className={`relative flex items-center justify-between w-14 h-7 rounded-full border px-1 transition-all duration-300 ${isDark
                    ? 'bg-[#1A1A2A] border-[#333] hover:border-[#555]'
                    : 'bg-amber-100 border-amber-300 hover:border-amber-400'
                }`}
        >
            {/* Track icons */}
            <Moon
                size={11}
                className={`shrink-0 transition-all duration-200 ${isDark ? 'text-cyan-400' : 'text-gray-300'}`}
            />
            <Sun
                size={11}
                className={`shrink-0 transition-all duration-200 ${isDark ? 'text-gray-600' : 'text-amber-500'}`}
            />

            {/* Sliding pill */}
            <span
                className={`absolute top-1 w-5 h-5 rounded-full shadow-md transition-all duration-300 ${isDark
                        ? 'left-1 bg-gradient-to-br from-[#4040AA] to-[#222244] shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                        : 'left-7 bg-gradient-to-br from-amber-400 to-orange-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    }`}
            />
        </button>
    );
}
