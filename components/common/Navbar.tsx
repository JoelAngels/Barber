'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useScrollLock } from '../motion/SmoothScroll';
import { BRAND_CONFIG } from '../../config/brand';
import {
  Scissors,
  Sun,
  Moon,
  Calendar,
  LayoutDashboard,
  Globe,
  Menu,
  X,
  Plus,
  ChevronRight,
} from 'lucide-react';

type ViewId = 'marketing' | 'booking' | 'dashboard';

const NAVIGATION_ITEMS: {
  id: ViewId;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: 'marketing',
    label: 'Website',
    shortLabel: 'Site',
    description: 'Public showcase, barbers, services & story',
    icon: Globe,
  },
  {
    id: 'booking',
    label: 'Customer Booking',
    shortLabel: 'Book',
    description: 'Online appointment scheduling & live queue',
    icon: Calendar,
  },
  {
    id: 'dashboard',
    label: 'Shop OS Dashboard',
    shortLabel: 'Shop OS',
    description: 'Queue board, calendar, POS, inventory & CRM',
    icon: LayoutDashboard,
  },
];

/** Distance scrolled before the bar leaves its transparent state. */
const SOLIDIFY_AT = 24;

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, theme, toggleTheme, setQuickWalkInModalOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Lenis scrolls the window natively, so a plain scroll listener tracks it.
    const onScroll = () => setScrolled(window.scrollY > SOLIDIFY_AT);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hold the page still while the drawer is open. Lenis ignores
  // `overflow: hidden`, so this has to go through the scroll provider.
  useScrollLock(mobileMenuOpen);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  // A drawer left open across a resize would be stranded off-canvas at md.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => e.matches && setMobileMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const handleSelectView = (viewId: ViewId) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  /**
   * Only the marketing view puts a dark photographic hero behind the bar, so
   * only there can it float transparently with light-on-dark type. The open
   * drawer also forces the solid state, or it would hang off a clear bar.
   */
  const overHero = activeView === 'marketing' && !scrolled && !mobileMenuOpen;

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out ${
        overHero
          ? 'border-b border-transparent bg-transparent'
          : mobileMenuOpen
            // Match the drawer exactly; a translucent bar above an opaque
            // drawer reads as a two-tone seam.
            ? 'border-b border-slate-200 bg-white shadow-xs dark:border-white/10 dark:bg-[#181818]'
            : 'border-b border-slate-200/80 bg-white/85 shadow-xs backdrop-blur-xl dark:border-white/10 dark:bg-[#1A1A1A]/85'
      }`}
    >
      {/* Height stays fixed on purpose: the dashboard's sticky sidebar and the
          shell's spacer are both offset against it. */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:h-20 sm:gap-4 sm:px-6 lg:px-8">
        {/* Logo & brand */}
        <div className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <button
            onClick={() => handleSelectView('marketing')}
            className="group flex min-w-0 items-center gap-2 text-left focus:outline-none sm:gap-3"
            aria-label="Trimly Home"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-600/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-8deg] sm:h-10 sm:w-10">
              <Scissors className="h-4 w-4 stroke-[2.5] sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h1
                className={`truncate font-serif text-lg font-bold leading-none tracking-tight transition-colors duration-500 sm:text-2xl ${
                  overHero ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                TRIMLY.
              </h1>
              <p
                className={`mt-0.5 hidden text-[9px] font-bold uppercase tracking-widest transition-colors duration-500 sm:mt-1 sm:block sm:text-[10px] md:hidden lg:block ${
                  overHero ? 'text-white/60' : 'text-slate-500 dark:text-white/50'
                }`}
              >
                {BRAND_CONFIG.sampleShop.name} • London
              </p>
            </div>
          </button>
        </div>

        {/* Desktop view switcher */}
        <nav
          aria-label="Main Navigation"
          className={`hidden shrink-0 items-center rounded-full border p-1 transition-colors duration-500 md:flex ${
            overHero
              ? 'border-white/15 bg-white/10 backdrop-blur-md'
              : 'border-slate-200 bg-slate-100 shadow-xs dark:border-white/10 dark:bg-white/10'
          }`}
        >
          {NAVIGATION_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectView(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 font-bold text-white shadow-md shadow-blue-600/20'
                    : overHero
                      ? 'text-white/70 hover:bg-white/10 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {/* Full labels only once there is room — at md they crush the
                    wordmark against the switcher. */}
                <span className="lg:hidden">{item.shortLabel}</span>
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => {
              setQuickWalkInModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 sm:px-4 sm:py-2.5 lg:px-5"
            title="Fast Check-in Walk-in Customer or Appointment"
            aria-label="New Booking"
          >
            <Plus className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="inline text-[11px] sm:hidden">Book</span>
            <span className="hidden sm:inline">New Booking</span>
          </button>

          <button
            onClick={toggleTheme}
            className={`shrink-0 rounded-full border p-2 transition-colors duration-500 sm:p-2.5 ${
              overHero
                ? 'border-white/15 bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
                : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20'
            }`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className={`h-4 w-4 ${overHero ? 'text-white' : 'text-blue-600'}`} />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className={`shrink-0 rounded-xl border p-2 transition-colors duration-500 md:hidden ${
              overHero
                ? 'border-white/15 bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
                : 'border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
            }`}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down drawer */}
      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#181818] md:hidden"
          >
            <div className="max-h-[calc(100dvh-4rem)] space-y-2 overflow-y-auto px-4 py-4 scrollbar-thin">
              <div className="px-2 pb-1 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-stone-500">
                Navigation Views
              </div>

              {NAVIGATION_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => handleSelectView(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl p-3 text-left transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'border border-slate-200/60 bg-slate-50 text-slate-800 hover:bg-slate-100 dark:border-white/5 dark:bg-white/5 dark:text-stone-200 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs font-bold tracking-wide">
                          <span>{item.label}</span>
                          {isActive && (
                            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>
                        <p
                          className={`mt-0.5 truncate text-[11px] ${
                            isActive ? 'text-white/80' : 'text-slate-500 dark:text-stone-400'
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400 dark:text-stone-500'
                      }`}
                    />
                  </motion.button>
                );
              })}

              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setQuickWalkInModalOpen(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/20 transition-transform active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Walk-in or Appointment</span>
                </button>
              </div>

              <div className="flex items-center justify-between px-1 pb-1 pt-2 text-[11px] text-slate-500 dark:text-stone-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>London Soho • Open Now</span>
                </span>
                <span>Closes 8:00 PM</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
