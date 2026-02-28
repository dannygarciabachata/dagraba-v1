'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Sparkles, Play, Music, Mic2, Cpu, ArrowRight, Star, Users, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { Footer } from '@/components/ui/Footer';

export default function LandingPage() {
  const t = useTranslations('Landing');
  const locale = useLocale();
  const { credits } = useUserStore();

  return (
    <div className="flex flex-col w-full bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-landing.png"
            alt="Da Graba Studio Hero"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/95 to-[#050505]" />
        </div>

        {/* Animated Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-glow/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[300px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container relative z-10 px-6 mx-auto flex flex-col items-center text-center">
          {/* Guest Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles size={14} className="text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-100">
              {t('guestBadge')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            {t('heroTitle1')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow via-blue-500 to-cyan-glow animate-gradient-x">
              {t('heroTitle2')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-lg md:text-xl text-silver-dark leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            {t('heroSubtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
            <Link
              href={`/${locale}/planer`}
              className="group flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-glow hover:text-white transition-all duration-300 shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-cyan-glow/40"
            >
              {t('ctaStart')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-xs rounded-2xl backdrop-blur-sm"
            >
              {t('ctaPricing')}
            </Link>
          </div>

          {/* Stats Footer */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mt-32 w-full max-w-5xl animate-in fade-in duration-1000 delay-500">
            {[
              { label: 'Creators', value: '500K+' },
              { label: 'AI Tracks', value: '2.5M+' },
              { label: 'V6 Models', value: '1,000+' },
              { label: 'Satisfaction', value: '99.9%' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl font-black text-white mb-1 tracking-tighter">{stat.value}</span>
                <span className="text-[10px] text-silver-dark font-black uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-[#0A0A0A] border-y border-white/5 relative">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col items-center mb-24 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-glow mb-4">Features</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">Everything You Need to <br /> Define Your Sound</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-cyan-glow/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-glow/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-cyan-glow/10 transition-all" />
              <div className="w-16 h-16 rounded-2xl bg-cyan-glow/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Music className="text-cyan-glow" size={32} />
              </div>
              <h4 className="text-2xl font-black mb-4 tracking-tight">{t('feature1Title')}</h4>
              <p className="text-silver-dark text-sm leading-relaxed mb-8">{t('feature1Desc')}</p>
              <div className="h-1 w-12 bg-cyan-glow rounded-full group-hover:w-full transition-all duration-700" />
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-orange-500/10 transition-all" />
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Mic2 className="text-orange-500" size={32} />
              </div>
              <h4 className="text-2xl font-black mb-4 tracking-tight">{t('feature2Title')}</h4>
              <p className="text-silver-dark text-sm leading-relaxed mb-8">{t('feature2Desc')}</p>
              <div className="h-1 w-12 bg-orange-500 rounded-full group-hover:w-full transition-all duration-700" />
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-purple-500/10 transition-all" />
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Cpu className="text-purple-500" size={32} />
              </div>
              <h4 className="text-2xl font-black mb-4 tracking-tight">{t('feature3Title')}</h4>
              <p className="text-silver-dark text-sm leading-relaxed mb-8">{t('feature3Desc')}</p>
              <div className="h-1 w-12 bg-purple-500 rounded-full group-hover:w-full transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 overflow-hidden bg-black">
        <div className="container px-6 mx-auto flex flex-col items-center">
          <p className="text-[10px] font-black tracking-widest text-[#444] uppercase mb-12">Trusted by the World's Best</p>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-24 opacity-20 grayscale hover:grayscale-0 transition-all duration-500">
            {['Universal', 'Warner', 'Sony', 'Netflix', 'Adobe', 'RollingStone'].map(brand => (
              <span key={brand} className="text-2xl font-black tracking-tighter uppercase">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-40 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 blur-[150px] rounded-full pointer-events-none" />
        </div>

        <div className="container relative z-10 px-6 mx-auto text-center flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 max-w-2xl leading-[0.95]">Ready to Create Your Masterpiece?</h2>
          <p className="text-silver-dark text-xl mb-12 max-w-lg">Get 100 free credits today and join the future of music production.</p>
          <Link
            href={`/${locale}/crear`}
            className="px-16 py-6 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 transition-all shadow-2xl hover:shadow-white/20"
          >
            Join Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
