'use client';

import Image from 'next/image';
import heroBarbershop from '@/public/barber-1.avif';
import React, { useState } from 'react';
import {useApp} from '../../context/AppContext';
import {BRAND_CONFIG} from '../../config/brand';
import {Modal} from '../common/Modal';
import {Reveal} from '../motion/Reveal';
import {Scissors, Calendar, Users, MessageSquare, CreditCard, Award, BarChart3, Check, ArrowRight, Star, ChevronDown, Play, PhoneCall, Tv} from 'lucide-react';

/** 20px-wide encode of the hero shot: Turbopack cannot generate a blur
  * placeholder for AVIF imports, so it is provided explicitly. */
const HERO_BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBwRXhpZgAATU0AKgAAAAgABAESAAMAAAABAAEAAAFCAAQAAAABAAALuAFDAAQAAAABAAAHyYdpAAQAAAABAAAAPgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFKADAAQAAAABAAAADQAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgADQAUAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMACQkJCQkJEAkJEBYQEBAWHhYWFhYeJh4eHh4eJi4mJiYmJiYuLi4uLi4uLjc3Nzc3N0BAQEBASEhISEhISEhISP/bAEMBCwwMEhESHxERH0szKjNLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS//dAAQAAv/aAAwDAQACEQMRAD8A8+fRMzRWQiGCSzSgHPI4U9hUdxo6yW5ljj2GEBCFBJdsnmuntrAeZcW8jsyo6DHQEtxnHtS2+ixSC5dZGUxTBVx7gHNcvO+51qC3tucpd6fEJcoBGCM7U5A7dTz2qt9hX++f0rorLTo5oSzEcMRyM/1q5/ZMXqP++f8A69O8u4rRP//Z';

const HERO_STATS = [
  { label: 'Today’s Revenue',   value: '$1,240.00',  foot: '↑ +18% vs last week', accent: false },
  { label: 'Appointments Today',value: '28 Booked',  foot: '98% show-up rate',    accent: false },
  { label: 'Live Walk-in Queue',value: '3 Waiting',  foot: 'Avg wait: ~18 mins',  accent: true  },
  { label: 'Active Chairs',     value: '4 / 5 Active', foot: '88% chair occupancy', accent: true },
] as const;

export const MarketingPage: React.FC = () => {
  const { setActiveView, showToast } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form states
  const [demoForm, setDemoForm] = useState({ name: '', shopName: '', email: '', phone: '', chairs: '3-5' });
  const [trialForm, setTrialForm] = useState({ shopName: '', name: '', email: '', password: '' });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoModalOpen(false);
    showToast('Demo Scheduled!', `Thanks ${demoForm.name}. A Trimly specialist will call you shortly at ${demoForm.phone}.`, 'success');
  };

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrialModalOpen(false);
    showToast('Free Trial Activated!', `Welcome to ${BRAND_CONFIG.name}! Redirecting to your shop dashboard...`, 'success');
    setActiveView('dashboard');
  };

  return (
    <div className="relative isolate min-h-screen bg-[#FDFCFB] text-[#1A1A1A] selection:bg-blue-600 selection:text-white dark:bg-[#070A12] dark:text-stone-100">

      {/* Ambient page field. The dark theme was four different near-blacks
          (slate/zinc/stone/neutral) stacked section by section, which read as
          flat and muddy after the hero. One canvas, lit from a few points. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden dark:block">
        <div className="absolute -top-[10%] left-1/2 h-[42rem] w-[80rem] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute top-[30%] -left-[18%] h-[38rem] w-[52rem] rounded-full bg-indigo-600/8 blur-[130px]" />
        <div className="absolute top-[62%] -right-[15%] h-[34rem] w-[48rem] rounded-full bg-sky-500/8 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 h-[30rem] w-[70rem] -translate-x-1/2 rounded-full bg-blue-700/8 blur-[130px]" />
        <div className="absolute inset-0 grain opacity-[0.025]" />
      </div>
      
      {/* ==================================================================
          HERO — cinematic, always dark regardless of theme. The photograph is
          the surface; everything else floats above it on z-10.
          ================================================================== */}
      <section className="relative isolate overflow-hidden bg-slate-950">

        {/* --- Layer 0: the photograph ----------------------------------
            On phones the section is far taller than the frame is wide, so a
            full-bleed cover crops to a dark strip and the scrims finish it off.
            There it runs as a band behind the headline and fades to solid;
            from md up it is full bleed. */}
        <div className="absolute inset-x-0 top-0 h-[52%] md:h-full z-0 overflow-hidden">
          <Image
            src={heroBarbershop}
            alt="Interior of a premium barbershop: three leather chairs beneath warm pendant lights"
            fill
            priority
            placeholder="blur"
            blurDataURL={HERO_BLUR}
            sizes="100vw"
            className="object-cover object-[50%_40%] scale-105"
          />

          {/* Neutral, not blue: a blue multiply turns the amber pendant lights
              to grey mud. The warm room against blue CTAs is the contrast we
              actually want, so only the shadows get a cool cast. */}
          <div className="absolute inset-0 bg-slate-950/20" />
          <div className="absolute inset-0 bg-blue-950/20 mix-blend-soft-light" />

          {/* Vertical falloff: enough density at the top edge to carry the
              glass badge, open across the pendant lights so their glow
              survives, solid again where the band meets the copy below. */}
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/40 to-slate-950 md:from-slate-950/85 md:via-slate-950/15 md:to-slate-950" />

          {/* Scrim focused behind the copy — darkening the whole frame would
              flatten the photograph into a wash. Softer on phones, where the
              band is short and the type sits closer to the brickwork. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_50%,rgba(2,6,23,0.55)_0%,rgba(2,6,23,0.3)_50%,transparent_85%)] md:bg-[radial-gradient(ellipse_78%_52%_at_50%_44%,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.55)_45%,transparent_78%)]" />

          {/* Edge vignette holds the eye in the centre column. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(2,6,23,0.6)_100%)] md:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.65)_100%)]" />

          {/* Grain kills gradient banding across the large dark areas. */}
          <div className="absolute inset-0 grain" />
        </div>

        {/* --- Layer 1: ambient brand glow, echoing the pendant lamps ---- */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[34rem] w-[64rem] rounded-full bg-blue-500/20 blur-[120px] z-0"
        />

        {/* --- Layer 2: content ----------------------------------------- */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-44 md:pb-36 text-center">

          {/* Eyebrow */}
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs font-semibold text-white/85 backdrop-blur-md ring-1 ring-inset ring-white/5">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
            </span>
            <span className="tracking-wide">{BRAND_CONFIG.heroBadge}</span>
          </div>

          {/* Headline */}
          <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-backwards mt-7 font-serif text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.25rem] text-balance max-w-5xl mx-auto [text-shadow:0_2px_40px_rgb(2_6_23_/_0.6)]">
            Run your barbershop.
            <br />
            <span className="bg-linear-to-r from-blue-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
              Keep every chair busy.
            </span>
          </h1>

          {/* Subhead */}
          <p className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg md:text-xl text-pretty">
            The ultra-fast, mobile-first operating system for barbershops. Effortless online
            booking, a real-time walk-in queue, split staff commissions, and automated WhatsApp
            reminders.
          </p>

          {/* Calls to action */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards mx-auto mt-10 flex max-w-xl flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
            <button
              onClick={() => setTrialModalOpen(true)}
              className="group w-full whitespace-nowrap rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-[0_8px_30px_-6px_rgb(37_99_235_/_0.7)] transition-all hover:bg-blue-500 hover:shadow-[0_12px_40px_-6px_rgb(37_99_235_/_0.9)] active:scale-[0.98] sm:w-auto sm:text-base flex items-center justify-center gap-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setDemoModalOpen(true)}
              className="w-full whitespace-nowrap rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/15 active:scale-[0.98] sm:w-auto sm:text-base flex items-center justify-center gap-2"
            >
              <PhoneCall className="h-4 w-4 shrink-0 text-blue-300" />
              <span>Book a Demo</span>
            </button>

            <button
              onClick={() => setActiveView('booking')}
              className="group w-full whitespace-nowrap rounded-xl px-6 py-4 text-xs font-medium text-white/70 transition-colors hover:text-white sm:w-auto sm:text-sm flex items-center justify-center gap-2"
            >
              <Play className="h-3.5 w-3.5 shrink-0 fill-blue-300 text-blue-300 sm:h-4 sm:w-4" />
              <span className="underline decoration-white/25 underline-offset-4 group-hover:decoration-white/60">
                Try live customer booking
              </span>
            </button>
          </div>

          {/* Trust row */}
          <div className="animate-in fade-in duration-700 delay-500 fill-mode-backwards mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-widest text-white/65">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Check className="h-3.5 w-3.5 shrink-0 text-blue-300" /> 14-day free trial
            </span>
            <span aria-hidden className="hidden h-3 w-px bg-white/15 sm:block" />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Check className="h-3.5 w-3.5 shrink-0 text-blue-300" /> No credit card
            </span>
            <span aria-hidden className="hidden h-3 w-px bg-white/15 sm:block" />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Check className="h-3.5 w-3.5 shrink-0 text-blue-300" /> Setup in 3 minutes
            </span>
          </div>

          {/* Product preview — a lit screenshot floating over the room. */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-backwards mx-auto mt-16 max-w-5xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2 shadow-[0_40px_120px_-20px_rgb(2_6_23_/_0.9)] backdrop-blur-md">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white dark:bg-black/20">
                <div className="flex items-center justify-between border-b border-black/5 bg-stone-100 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 hidden font-mono text-xs text-black/50 dark:text-stone-400 sm:inline">
                      trimly.app/the-gentlemens-cut
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
                    <span className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
                    <span>Live Shop State Simulated</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 bg-stone-50 p-6 text-left dark:bg-black/20 sm:grid-cols-2 md:grid-cols-4">
                  {HERO_STATS.map(stat => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-white/[0.05] dark:backdrop-blur-sm"
                    >
                      <p className="text-xs text-slate-500 dark:text-stone-400">{stat.label}</p>
                      <p
                        className={`mt-1 font-serif text-2xl font-bold tabular ${
                          stat.accent
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-900 dark:text-stone-100'
                        }`}
                      >
                        {stat.value}
                      </p>
                      <span className="mt-1 inline-block text-[10px] font-semibold text-slate-500 dark:text-stone-400">
                        {stat.foot}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION GRID */}
      <section className="py-20 bg-stone-50 dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16" y={32}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Built for Barber Craftsmen</h2>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] dark:text-stone-100">
              Everything your barbershop needs. Nothing it doesn’t.
            </p>
            <p className="text-black/60 dark:text-stone-400 mt-4">
              Traditional salon software is bloated with unnecessary features for nail salons and spas. Trimly is razor-focused on barbershops, walk-ins, and high-frequency cuts.
            </p>
          </Reveal>

          {/* 7 Core Business Capabilities */}
          <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.09} y={40} scale={0.97}>
            
            {/* Feature 1: Online Booking */}
            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.04] dark:backdrop-blur-sm border border-black/5 dark:border-white/10 hover:border-blue-500/40 transition-all shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#1A1A1A] dark:text-stone-100">24/7 Mobile Online Booking</h3>
              <p className="text-black/60 dark:text-stone-400 text-sm mt-2 leading-relaxed">
                Allow clients to select services, pick their favorite barber, and pick open slots from your Instagram link-in-bio or Google Business profile.
              </p>
            </div>

            {/* Feature 2: Walk-in Queue */}
            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.04] dark:backdrop-blur-sm border border-black/5 dark:border-white/10 hover:border-blue-500/40 transition-all shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#1A1A1A] dark:text-stone-100">Smart Walk-in Queue & TV View</h3>
              <p className="text-black/60 dark:text-stone-400 text-sm mt-2 leading-relaxed">
                Manage walk-ins seamlessly alongside appointments. Calculate live wait times and display a clean queue monitor on your shop lobby TV.
              </p>
            </div>

            {/* Feature 3: Staff & Commissions */}
            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.04] dark:backdrop-blur-sm border border-black/5 dark:border-white/10 hover:border-blue-500/40 transition-all shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#1A1A1A] dark:text-stone-100">Staff Split & Commission Tracking</h3>
              <p className="text-black/60 dark:text-stone-400 text-sm mt-2 leading-relaxed">
                Automatically calculate barber split ratios (e.g., 60/40), tip distributions, and individual chair occupancy rates with one click.
              </p>
            </div>

            {/* Feature 4: WhatsApp Reminders */}
            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.04] dark:backdrop-blur-sm border border-slate-200 dark:border-white/10 hover:border-blue-500/40 transition-all shadow-xs group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-stone-100">WhatsApp & SMS Reminders</h3>
              <p className="text-slate-600 dark:text-stone-400 text-sm mt-2 leading-relaxed">
                Eliminate no-shows by sending automated 2-hour WhatsApp appointment confirmations and 4-week haircut re-booking nudges.
              </p>
            </div>

            {/* Feature 5: POS / Payments */}
            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.04] dark:backdrop-blur-sm border border-slate-200 dark:border-white/10 hover:border-blue-500/40 transition-all shadow-xs group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-stone-100">Integrated POS & Product Sales</h3>
              <p className="text-slate-600 dark:text-stone-400 text-sm mt-2 leading-relaxed">
                Accept contactless card payments, cash, deposits, and sell retail products (clays, oils, pomades) at checkout in seconds.
              </p>
            </div>

            {/* Feature 6: Client Loyalty CRM */}
            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.04] dark:backdrop-blur-sm border border-slate-200 dark:border-white/10 hover:border-blue-500/40 transition-all shadow-xs group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-stone-100">Client CRM & Haircut Formulas</h3>
              <p className="text-slate-600 dark:text-stone-400 text-sm mt-2 leading-relaxed">
                Keep detailed haircut notes (e.g. “#1.5 guard drop fade”), preferred barbers, visit history, and reward points for every client.
              </p>
            </div>

          </Reveal>

          {/* Feature 7 highlight: Analytics */}
          <Reveal className="mt-12 p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl" y={40} scale={0.98}>
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Executive Reports & Insights</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">Know your busiest days, highest earners, and top products</h3>
              <p className="text-slate-300 text-sm mt-2">
                Real-time visual charts showing revenue breakdowns, client retention rates, barber peak hours, and product inventory restocking alerts.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveView('dashboard');
              }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shrink-0 shadow-lg shadow-blue-600/20 transition-all whitespace-nowrap"
            >
              Explore Shop Dashboard →
            </button>
          </Reveal>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-20 bg-[#FDFCFB] dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-12" y={32}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Transparent Pricing</h2>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-stone-100">
              Simple plans that grow with your shop
            </p>
            <p className="text-slate-600 dark:text-stone-400 mt-3 text-sm sm:text-base">No hidden booking fees, no commission per client cut. Keep 100% of your earnings.</p>

            {/* Monthly / Annual Toggle */}
            <div className="mt-8 inline-flex items-center p-1 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                  billingCycle === 'monthly' ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-stone-100 shadow-xs' : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-200'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-200'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-blue-950 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/30">Save 20%</span>
              </button>
            </div>
          </Reveal>

          <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch" stagger={0.12} y={44} scale={0.97}>
            
            {/* Starter Plan */}
            <div className="p-8 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-stone-100">Starter</h3>
                <p className="text-slate-600 dark:text-stone-400 text-xs mt-1">Ideal for solo barbers or 1-2 chair boutique shops.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold font-serif text-slate-900 dark:text-stone-100">
                    ${billingCycle === 'annual' ? '29' : '35'}
                  </span>
                  <span className="text-slate-500 dark:text-stone-400 text-xs">/month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 dark:text-stone-300 mb-8">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Up to 2 Barber Chairs</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Unlimited Client Appointments</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Online Booking Page & Link</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Walk-in Queue Board</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Client Notes & Haircut CRM</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Basic Sales Reports</li>
                </ul>
              </div>
              <button
                onClick={() => setTrialModalOpen(true)}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-stone-100 font-bold text-xs transition-colors"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="p-8 rounded-2xl bg-white dark:bg-linear-to-b dark:from-zinc-900 dark:to-blue-950/30 border-2 border-blue-500 relative flex flex-col justify-between shadow-xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md whitespace-nowrap">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-stone-100">Growth</h3>
                <p className="text-slate-600 dark:text-stone-400 text-xs mt-1">For busy shops with 3-7 active chairs.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold font-serif text-slate-900 dark:text-stone-100">
                    ${billingCycle === 'annual' ? '69' : '85'}
                  </span>
                  <span className="text-slate-500 dark:text-stone-400 text-xs">/month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 dark:text-stone-300 mb-8">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Up to 7 Barber Chairs</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Everything in Starter</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Automated WhatsApp & SMS Reminders</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Barber Commission Split Calculator</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> POS & Retail Inventory Management</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Lobby TV Queue Display Mode</li>
                </ul>
              </div>
              <button
                onClick={() => setTrialModalOpen(true)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Multi-Location Plan */}
            <div className="p-8 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-stone-100">Multi-Location</h3>
                <p className="text-slate-600 dark:text-stone-400 text-xs mt-1">For shop chains, franchises, & 8+ chairs.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold font-serif text-slate-900 dark:text-stone-100">
                    ${billingCycle === 'annual' ? '149' : '179'}
                  </span>
                  <span className="text-slate-500 dark:text-stone-400 text-xs">/month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 dark:text-stone-300 mb-8">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Unlimited Chairs & Barbers</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Multiple Location Management</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Centralized Franchising Reports</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Dedicated Account Manager</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-blue-600 shrink-0" /> Custom API & POS Integration</li>
                </ul>
              </div>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-stone-100 font-bold text-xs transition-colors"
              >
                Contact Sales
              </button>
            </div>

          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-stone-50 dark:bg-white/[0.03] border-t border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-16" y={32}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Real Barbershop Owners</h2>
            <p className="text-3xl font-serif font-bold text-slate-900 dark:text-stone-100">Trusted by over 1,200 chairs worldwide</p>
          </Reveal>

          <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.1} y={40} scale={0.97}>
            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 shadow-xs">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-slate-700 dark:text-stone-300 italic leading-relaxed">
                “Our no-show rate dropped from 22% down to 2% within our first month using Trimly’s automatic WhatsApp reminders. It pays for itself 10x over.”
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                  alt="Marcus Vance, Barbershop Owner"
                  className="w-10 h-10 rounded-full object-cover border border-blue-500/30"
                width={40}
                  height={40}
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-stone-100">Marcus Vance</h4>
                  <p className="text-xs text-slate-500 dark:text-stone-400">Owner, The Gentlemen’s Cut (Downtown)</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 shadow-xs">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-slate-700 dark:text-stone-300 italic leading-relaxed">
                “The walk-in queue monitor on our lobby TV changed everything. Clients grab a coffee, check the screen, and know exactly when their chair is ready.”
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                  alt="Leo Rivera, Grooming Studio Owner"
                  className="w-10 h-10 rounded-full object-cover border border-blue-500/30"
                width={40}
                  height={40}
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-stone-100">Leo Rivera</h4>
                  <p className="text-xs text-slate-500 dark:text-stone-400">Owner, Apex Grooming Studio</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 shadow-xs">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-slate-700 dark:text-stone-300 italic leading-relaxed">
                “Saturday night payroll used to take me 2 hours of manual spreadsheet math. Now Trimly calculates barber commission splits and tip totals instantly.”
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
                  alt="Sam Chen, Head Barber"
                  className="w-10 h-10 rounded-full object-cover border border-blue-500/30"
                width={40}
                  height={40}
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-stone-100">Sam Chen</h4>
                  <p className="text-xs text-slate-500 dark:text-stone-400">Head Barber, Heritage Blade Lounge</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="py-20 bg-[#FDFCFB] dark:bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12" y={30}>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-stone-100">Frequently Asked Questions</h2>
            <p className="text-slate-600 dark:text-stone-400 text-sm mt-2">Everything you need to know about switching to Trimly.</p>
          </Reveal>

          <Reveal className="space-y-4" stagger={0.07} y={24}>
            {[
              {
                q: 'How fast can I set up Trimly for my shop?',
                a: 'You can set up your shop menu, barbers, and booking link in under 5 minutes. You can import your existing client list via CSV or start fresh right away.'
              },
              {
                q: 'Can customers book through Instagram and Google Business?',
                a: 'Yes! Trimly provides a clean, fast mobile link that embeds directly into your Instagram bio, Facebook page, Google Maps profile, or custom website.'
              },
              {
                q: 'How does the Walk-in Queue feature work?',
                a: 'Walk-ins scan a QR code at your shop entrance or sign up on a tablet. Trimly calculates wait time based on active chair durations and sends them an SMS when their chair is almost ready.'
              },
              {
                q: 'Does Trimly charge per booking or take a commission on cuts?',
                a: 'No! We charge a flat monthly subscription. You keep 100% of your service sales, tips, and product revenue.'
              },
              {
                q: 'Can I track barber commission splits and tips?',
                a: 'Yes. Trimly automatically tracks service and product sales per barber, calculates custom commission percentages (e.g. 60/40), and tracks cash & card tip payouts.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 dark:text-stone-100 flex items-center justify-between gap-4 text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-slate-600 dark:text-stone-400 text-sm leading-relaxed border-t border-slate-100 dark:border-white/10/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 dark:bg-[#05070D] border-t border-slate-200 dark:border-white/5 pt-16 pb-12 text-slate-600 dark:text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12" stagger={0.07} y={26}>
            <div className="sm:col-span-2 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Scissors className="w-4 h-4" />
                </div>
                <span className="font-serif text-xl font-bold text-slate-900 dark:text-stone-100">{BRAND_CONFIG.name}</span>
              </div>
              <p className="text-slate-600 dark:text-stone-400 max-w-sm mb-4 leading-relaxed">
                {BRAND_CONFIG.tagline} Built specifically for modern barbershops, grooming lounges, and hair artisans.
              </p>
              <p className="text-slate-500 dark:text-stone-500">© 2026 {BRAND_CONFIG.name} Inc. All rights reserved.</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-stone-200 text-sm mb-3">Product</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveView('booking')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Customer Booking</button></li>
                <li><button onClick={() => setActiveView('dashboard')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Shop Dashboard</button></li>
                <li><a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Walk-in Queue Board</a></li>
                <li><a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing Plans</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-stone-200 text-sm mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Barbershop Growth Guide</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">WhatsApp Marketing Kit</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Integration API Docs</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-stone-200 text-sm mb-3">Contact</h4>
              <ul className="space-y-2">
                <li>Email: {BRAND_CONFIG.contactEmail}</li>
                <li>Phone: {BRAND_CONFIG.demoPhone}</li>
                <li>Location: New York & London</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </footer>

      {/* DEMO MODAL */}
      <Modal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        title="Schedule a Trimly Live Demo"
        subtitle="See how Trimly keeps chairs filled and simplifies shop operations."
      >
        <form onSubmit={handleDemoSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={demoForm.name}
              onChange={e => setDemoForm({ ...demoForm, name: e.target.value })}
              placeholder="e.g. Marcus Vance"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/15 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Barbershop Name</label>
            <input
              type="text"
              required
              value={demoForm.shopName}
              onChange={e => setDemoForm({ ...demoForm, shopName: e.target.value })}
              placeholder="e.g. The Gentlemen's Cut"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/15 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={demoForm.email}
                onChange={e => setDemoForm({ ...demoForm, email: e.target.value })}
                placeholder="marcus@gentlemenscut.com"
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/15 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={demoForm.phone}
                onChange={e => setDemoForm({ ...demoForm, phone: e.target.value })}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/15 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Number of Chairs / Barbers</label>
            <select
              value={demoForm.chairs}
              onChange={e => setDemoForm({ ...demoForm, chairs: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/15 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            >
              <option value="1-2">1 - 2 Chairs</option>
              <option value="3-5">3 - 5 Chairs</option>
              <option value="6-10">6 - 10 Chairs</option>
              <option value="10+">10+ Chairs / Multiple Locations</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all"
          >
            Confirm Demo Booking
          </button>
        </form>
      </Modal>

      {/* FREE TRIAL MODAL */}
      <Modal
        isOpen={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
        title="Start Your 14-Day Free Trial"
        subtitle="No credit card required. Full access to all Growth features."
      >
        <form onSubmit={handleTrialSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Barbershop Name</label>
            <input
              type="text"
              required
              value={trialForm.shopName}
              onChange={e => setTrialForm({ ...trialForm, shopName: e.target.value })}
              placeholder="e.g. Apex Grooming Studio"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/15 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Owner Name</label>
            <input
              type="text"
              required
              value={trialForm.name}
              onChange={e => setTrialForm({ ...trialForm, name: e.target.value })}
              placeholder="e.g. Leo Rivera"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/15 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Work Email</label>
            <input
              type="email"
              required
              value={trialForm.email}
              onChange={e => setTrialForm({ ...trialForm, email: e.target.value })}
              placeholder="leo@apexbarber.com"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/15 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Create Password</label>
            <input
              type="password"
              required
              value={trialForm.password}
              onChange={e => setTrialForm({ ...trialForm, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/15 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all"
          >
            Launch My Shop Dashboard →
          </button>
        </form>
      </Modal>

    </div>
  );
};
