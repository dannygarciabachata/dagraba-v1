import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MasteringSettings {
    // Gate
    gateThreshold: number;
    gateAttack: number;
    gateRelease: number;
    
    // EQ
    eqHighpass: number;
    eqTilt: number;
    eqSideGain: number;
    eqSideFreq: number;
    
    // Leveler
    levelerTarget: number;
    levelerBrake: number;
    levelerMaxPlus: number;
    levelerMaxMinus: number;
    
    // Knee Compressor
    compStrength: number;
    compAttack: number;
    compRelease: number;
    compKnee: number;
    compMakeup: number;
    
    // Multiband (interpolated low/high)
    mbStrengthLow: number;
    mbStrengthHigh: number;
    mbAttackLow: number;
    mbAttackHigh: number;
    mbCrossoverLow: number;
    mbCrossoverHigh: number;
    
    // Limiter & Brickwall
    limStrength: number;
    limAttack: number;
    limRelease: number;
    limCeiling: number;

    // Legacy/Quick controls (for compatibility if needed)
    inputDrive: number;
    stereoWidth: number;

    // Bypasses
    gateBypass: boolean;
    eqBypass: boolean;
    levelerBypass: boolean;
    compBypass: boolean;
    mbBypass: boolean;
    limBypass: boolean;
}

export interface MasteringProject {
    id: string;
    name: string;
    date: string;
    audioUrl: string | null;
    audioId?: string;
    dna: string;
    settings: MasteringSettings;
    frequencyData?: number[]; // Snapshot of final spectral balance
}

interface MasteringState {
    history: MasteringProject[];
    currentModule: 'gate' | 'eq' | 'leveler' | 'compressor' | 'multiband' | 'limiter';
    setCurrentModule: (module: 'gate' | 'eq' | 'leveler' | 'compressor' | 'multiband' | 'limiter') => void;
    addToHistory: (project: Omit<MasteringProject, 'date'>) => void;
    deleteFromHistory: (id: string) => void;
    getProjectById: (id: string) => MasteringProject | undefined;
    cleanupOldHistory: () => void;
}

export const useMasteringStore = create<MasteringState>()(
    persist(
        (set, get) => ({
            history: [],
            currentModule: 'leveler',
            setCurrentModule: (module) => set({ currentModule: module }),
            addToHistory: (project) => {
                const newProject = {
                    ...project,
                    date: new Date().toISOString(),
                };
                set((state) => {
                    // Remove any existing entry with the same ID to prevent duplication
                    const filteredHistory = state.history.filter(p => p.id !== project.id);
                    return {
                        history: [newProject, ...filteredHistory],
                    };
                });
            },
            deleteFromHistory: (id) => {
                set((state) => ({
                    history: state.history.filter((p) => p.id !== id),
                }));
            },
            getProjectById: (id) => {
                return get().history.find((p) => p.id === id);
            },
            cleanupOldHistory: () => {
                const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
                const now = Date.now();
                set((state) => ({
                    history: state.history.filter((p) => {
                        const projectDate = new Date(p.date).getTime();
                        return (now - projectDate) < NINETY_DAYS_MS;
                    }),
                }));
            },
        }),
        {
            name: 'mastering-history-storage',
        }
    )
);
