'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    loginModalOpen: boolean;
    setLoginModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    signInWithGoogle: async () => { },
    loginModalOpen: false,
    setLoginModalOpen: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            // Auto-grant Admin status to official account
            if (currentUser?.email === 'dagrabastudio@gmail.com') {
                import('@/store/useUserStore').then((m) => {
                    const store = m.useUserStore.getState();
                    store.setPlan('premium');
                    store.setCredits(999999); // "Unlimited" for admin
                });
            }

            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            // Redirect to landing page after sign out
            window.location.href = '/';
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            setLoginModalOpen(false); // Close modal on success
            router.push('/pricing'); // Redirect to pricing after login
        } catch (error: any) {
            if (error.code === 'auth/popup-blocked') {
                console.warn("Popup blocked by browser. Falling back to redirect...");
                await signInWithRedirect(auth, provider);
            } else {
                console.error("Google sync failed", error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, signInWithGoogle, loginModalOpen, setLoginModalOpen }}>
            {children}
        </AuthContext.Provider>
    );
};
