import type { Metadata } from "next";
import "./globals.css";

import { Sidebar } from "@/components/ui/Sidebar";

export const metadata: Metadata = {
  title: "DA GRABA STUDIO V1",
  description: "Immersive Audio Engineering Console",
};

import { GlobalFooterPlayer } from "@/components/ui/GlobalFooterPlayer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* 
        The body itself is the dark room. 
        We use a radial gradient to simulate a soft light hitting the center desk area from above.
      */}
      <body className="antialiased h-screen w-screen overflow-hidden flex bg-[#050505] text-silver-light selection:bg-cyan-glow/30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/20 via-[#050505] to-black">

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

      </body>
    </html>
  );
}
