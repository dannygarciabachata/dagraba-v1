import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Sidebar } from "@/components/ui/Sidebar";
import { GlobalFooterPlayer } from "@/components/ui/GlobalFooterPlayer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

export const metadata: Metadata = {
  title: "DA GRABA STUDIO V1",
  description: "Immersive Audio Engineering Console",
};

const locales = ['en', 'es', 'pt', 'fr', 'de', 'it', 'ja'];

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased h-screen w-screen overflow-hidden flex text-silver-light selection:bg-cyan-glow/30"
        style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {/* Ambient background layer */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.08] mix-blend-overlay" />
              <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-cyan-glow/5 to-transparent blur-3xl opacity-40" />
            </div>

            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Fullscreen App Container */}
            <main className="relative z-10 flex-1 h-full flex flex-col overflow-y-auto overflow-x-hidden">
              {children}
            </main>

            {/* Persistent Audio Player */}
            <GlobalFooterPlayer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
