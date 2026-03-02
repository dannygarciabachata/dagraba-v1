'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { AITrainingModule } from '@/components/admin/AITrainingModule';
import { InstrumentBank } from '@/components/admin/InstrumentBank';
import { AssetManager } from '@/components/admin/AssetManager';
import { FinancialVault } from '@/components/admin/FinancialVault';
import { UserDatabase } from '@/components/admin/UserDatabase';
import { SystemConfig } from '@/components/admin/SystemConfig';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ShieldCheck
} from 'lucide-react';

function AdminPageContent() {
    const { user, isSuperAdmin, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState(tabParam || 'ai');

    useEffect(() => {
        if (tabParam && tabParam !== activeTab) {
            setActiveTab(tabParam);
        }
    }, [tabParam, activeTab]);

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
        <div className="flex flex-col gap-6 w-full min-h-screen">
            <div className="flex items-center gap-2 text-orange-500/60 pb-2 border-b border-white/5 mb-4">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black tracking-[0.2em] uppercase">SuperAdmin Session: {user?.email}</span>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'ai' && <AITrainingModule />}
                {activeTab === 'instruments' && <InstrumentBank />}
                {activeTab === 'assets' && <AssetManager />}
                {activeTab === 'finance' && <FinancialVault />}
                {activeTab === 'users' && <UserDatabase />}
                {activeTab === 'config' && <SystemConfig />}
            </div>
        </div>
    );
}

export default function AdminPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            </div>
        }>
            <AdminPageContent />
        </Suspense>
    );
}
