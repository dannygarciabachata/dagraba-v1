import React from 'react';
import { AITrainingModule } from '@/components/admin/AITrainingModule';
import { InstrumentBank } from '@/components/admin/InstrumentBank';
import { AssetManager } from '@/components/admin/AssetManager';
import { FinancialVault } from '@/components/admin/FinancialVault';
import { UserDatabase } from '@/components/admin/UserDatabase';
import { SystemConfig } from '@/components/admin/SystemConfig';

export default function AdminPage() {
    return (
        <div className="flex flex-col gap-8">
            <AITrainingModule />
            <InstrumentBank />
            <AssetManager />
            <FinancialVault />
            <UserDatabase />
            <SystemConfig />
        </div>
    );
}
