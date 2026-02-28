import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserPlan = 'free' | 'pro' | 'premium';

interface UserState {
    credits: number;
    plan: UserPlan;
    hasUsedTrial: boolean;
    // Actions
    setCredits: (credits: number) => void;
    deductCredits: (amount: number) => boolean;
    addCredits: (amount: number) => void;
    setPlan: (plan: UserPlan) => void;
    resetTrial: () => void;
    completeTrial: () => void;
}

/**
 * useUserStore manages the user's credits and subscription status.
 * It persists to localStorage so that guest credits are maintained 
 * until they register or clear their browser data.
 */
export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            credits: 100, // Initial guest credits
            plan: 'free',
            hasUsedTrial: false,

            setCredits: (credits) => set({ credits }),

            deductCredits: (amount) => {
                const currentCredits = get().credits;
                if (currentCredits >= amount) {
                    set({ credits: currentCredits - amount });
                    return true;
                }
                return false;
            },

            addCredits: (amount) => {
                set((state) => ({ credits: state.credits + amount }));
            },

            setPlan: (plan) => set({ plan }),

            resetTrial: () => set({ hasUsedTrial: false, credits: 100 }),

            completeTrial: () => set({ hasUsedTrial: true })
        }),
        {
            name: 'dagraba-user-storage',
        }
    )
);
