import { ReactNode } from 'react';
import { getLocale } from 'next-intl/server';
import "./globals.css";

export const metadata = {
    title: "DA GRABA STUDIO V1",
    description: "Immersive Audio Engineering Console",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
    const locale = await getLocale();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className="antialiased h-screen w-screen overflow-hidden flex text-silver-light selection:bg-cyan-glow/30"
                style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
            >
                {children}
            </body>
        </html>
    );
}
