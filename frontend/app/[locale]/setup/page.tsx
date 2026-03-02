import React from 'react';
import { SetupWizard } from '@/components/setup/SetupWizard';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function SetupPage() {
    // Check if setup is already completed
    const setupStatus = await prisma.systemSetting.findUnique({
        where: { key: 'INITIAL_SETUP_COMPLETED' }
    });

    if (setupStatus?.value === 'true') {
        redirect('/admin');
    }

    return <SetupWizard />;
}
