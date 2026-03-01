'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

/**
 * ThemeProvider — applies the correct class to <html> based on the theme store.
 * Renders no visible DOM — it's purely a side-effect component.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useThemeStore((s) => s.theme);

    useEffect(() => {
        const html = document.documentElement;
        if (theme === 'light') {
            html.classList.add('light');
        } else {
            html.classList.remove('light');
        }
    }, [theme]);

    return <>{children}</>;
}
