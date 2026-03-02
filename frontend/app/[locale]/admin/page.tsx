import React, { useEffect } from 'react';
import { AITrainingModule } from '@/components/admin/AITrainingModule';
import { InstrumentBank } from '@/components/admin/InstrumentBank';
import { AssetManager } from '@/components/admin/AssetManager';
import { FinancialVault } from '@/components/admin/FinancialVault';
import { UserDatabase } from '@/components/admin/UserDatabase';
import { SystemConfig } from '@/components/admin/SystemConfig';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const { user, isSuperAdmin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !isSuperAdmin)) {
            router.push('/');
        }
    }, [user, isSuperAdmin, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user || !isSuperAdmin) return null;

    return (
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto w-full pb-12">
            <header className="flex flex-col gap-2 mb-4">
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Panel de Control Superadmin</h1>
                <p className="text-silver-dark text-sm">Acceso privilegiado para {user?.email}</p>
            </header>
            <AITrainingModule />
            <InstrumentBank />
            <AssetManager />
            <FinancialVault />
            <UserDatabase />
            <SystemConfig />
        </div>
    );
}
