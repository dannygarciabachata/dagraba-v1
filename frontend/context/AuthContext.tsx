'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter, useParams } from 'next/navigation';

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
    const [loginModalOpen, setLoginModalOpenState] = useState(false);

    // Enhanced setLoginModalOpen with tracing
    const setLoginModalOpen = (value: boolean) => {
        console.log('[DEBUG] setLoginModalOpen called with:', value, new Error().stack);
        setLoginModalOpenState(value);
    };

    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || 'es';

    useEffect(() => {
        console.log('[DEBUG] AuthProvider mounted with locale:', locale);
        return () => console.log('[DEBUG] AuthProvider unmounted');
    }, [locale]);

    useEffect(() => {
        console.log('[DEBUG] loginModalOpen state changed to:', loginModalOpen);
    }, [loginModalOpen]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log('[DEBUG] onAuthStateChanged fired, user:', currentUser?.email || 'null');
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

            // [NEW] Detect Geolocation and Sink Profile
            if (currentUser) {
                try {
                    // Fetch location from IP (privacy-friendly, no popup)
                    const geoRes = await fetch('https://ipapi.co/json/').catch(() => null);
                    if (!geoRes?.ok) {
                        console.warn("[GEO] Geolocation service unavailable (CORS or network error)");
                        setLoading(false); // Ensure we don't block
                        return;
                    }
                    const geoData = await geoRes.json();

                    if (geoData.city && geoData.country_name) {
                        const token = await currentUser.getIdToken();
                        const profileRes = await fetch('/api/user/profile', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                location: `${geoData.city}, ${geoData.region}`,
                                city: geoData.city,
                                country: geoData.country_name,
                                isFirstSync: !localStorage.getItem(`dagraba_synced_${currentUser.uid}`)
                            })
                        });
                        const profileData = await profileRes.json();

                        if (profileData.isNewUser && !isSuper) {
                            import('@/store/useUserStore').then((m) => {
                                const store = m.useUserStore.getState();
                                store.setCredits(100); // Welcome Gift
                                console.log("[AUTH] Welcome credits granted: 100");
                            });
                        }

                        localStorage.setItem(`dagraba_synced_${currentUser.uid}`, 'true');
                        console.log(`[GEO] Location synced: ${geoData.city}, ${geoData.region}`);
                    }
                } catch (geoError) {
                    console.error("Failed to sync geolocation:", geoError);
                }
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
            window.location.href = `/${locale}`;
        } catch (error) {
            console.error('[DEBUG] logout error:', error);
            router.push(`/${locale}`);
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            console.log('[DEBUG] signInWithGoogle starting...');
            const result = await signInWithPopup(auth, provider);
            console.log('[DEBUG] signInWithGoogle success, user:', result.user.email);
            setLoginModalOpen(false); // Close modal on success
            router.push(`/${locale}/pricing`);
        } catch (error: any) {
            console.error('[DEBUG] signInWithGoogle error:', error);
            if (error.code === 'auth/popup-blocked') {
                console.warn("[DEBUG] Popup blocked, falling back to redirect...");
                await signInWithRedirect(auth, provider);
            } else {
                alert(`Error de autenticación: ${error.message}`);
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
