'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export function LoginModal() {
    const { loginModalOpen, setLoginModalOpen, signInWithGoogle } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!loginModalOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            setLoginModalOpen(false);
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0B1015] border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
                {/* Glow Effects */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-glow/20 rounded-full blur-[100px] pointer-events-none" />

                <button
                    onClick={() => setLoginModalOpen(false)}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-black tracking-widest text-center text-white mb-2 uppercase">
                    {isRegistering ? 'Join Da Graba' : 'Welcome Back'}
                </h2>
                <p className="text-center text-white/50 text-sm mb-8">
                    {isRegistering ? 'Create your account to save projects' : 'Sign in to access your studio setup'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-colors"
                            required
                        />
                    </div>

                    {error && <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">{error}</div>}

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-xl text-white font-bold tracking-widest uppercase hover:scale-[1.02] transition-transform"
                    >
                        {isRegistering ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-center space-x-4 relative z-10">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="text-xs text-white/30 uppercase tracking-widest">or continue with</span>
                    <div className="h-px bg-white/10 flex-1" />
                </div>

                <div className="mt-6 space-y-3 relative z-10">
                    <button
                        onClick={signInWithGoogle}
                        type="button"
                        className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-white/50 relative z-10">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        type="button"
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-orange-400 hover:text-orange-300 font-bold ml-1 transition-colors"
                    >
                        {isRegistering ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
}
