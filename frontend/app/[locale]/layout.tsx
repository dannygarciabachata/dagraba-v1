import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Sidebar } from "@/components/ui/Sidebar";
import { GlobalFooterPlayer } from "@/components/ui/GlobalFooterPlayer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";

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
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <AuthProvider>
          <ConvexClientProvider>
            {/* Ambient background layer */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.08] mix-blend-overlay" />
              <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-cyan-glow/5 to-transparent blur-3xl opacity-40" />
            </div>

            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Content Area (Main + Footer) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
              <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
                {children}
              </main>

              {/* Persistent Audio Player */}
              <GlobalFooterPlayer />
            </div>

            {/* Global Auth Modal */}
            <LoginModal />
          </ConvexClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
