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
    isSuperAdmin: boolean;
    loginModalOpen: boolean;
    setLoginModalOpen: (open: boolean) => void;
    getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    signInWithGoogle: async () => { },
    isSuperAdmin: false,
    loginModalOpen: false,
    setLoginModalOpen: () => { },
    getIdToken: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            const superAdminEmail = 'dagrabastudio@gmail.com';
            const isSuper = currentUser?.email === superAdminEmail;
            setIsSuperAdmin(isSuper);

            // Auto-grant Admin status to official account
            if (isSuper) {
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
            // Clear local store
            const { useUserStore } = await import('@/store/useUserStore');
            useUserStore.getState().clearUser();

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

    const getIdToken = async () => {
        if (!user) return null;
        try {
            return await user.getIdToken();
        } catch (error) {
            console.error("Failed to get ID token", error);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isSuperAdmin,
            loading,
            logout,
            signInWithGoogle,
            loginModalOpen,
            setLoginModalOpen,
            getIdToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};
