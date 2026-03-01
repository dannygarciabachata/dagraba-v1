import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeStore {
    theme: Theme;
    setTheme: (t: Theme) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            theme: 'dark',
            setTheme: (t) => set({ theme: t }),
            toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
        }),
        { name: 'dagraba-theme' }
    )
);
