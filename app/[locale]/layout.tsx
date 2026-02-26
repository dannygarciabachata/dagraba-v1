import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Sidebar } from "@/components/ui/Sidebar";
import { GlobalFooterPlayer } from "@/components/ui/GlobalFooterPlayer";

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
    <html lang={locale} className="dark">
      <body className="antialiased h-screen w-screen overflow-hidden flex bg-[#050505] text-silver-light selection:bg-cyan-glow/30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/20 via-[#050505] to-black">
        <NextIntlClientProvider messages={messages}>
          {/* Immersive Background Image/Texture layer */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Ambient noise for texture */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
            {/* Fake studio window glow reflection at the top */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-cyan-glow/5 to-transparent blur-3xl opacity-50" />
          </div>

          {/* Sidebar Navigation */}
          <Sidebar />

          {/* Fullscreen App Container without sidebars */}
          <main className="relative z-10 flex-1 h-full flex flex-col overflow-hidden">
            {children}
          </main>

          {/* Persistent Audio Player */}
          <GlobalFooterPlayer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
