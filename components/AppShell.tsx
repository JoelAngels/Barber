'use client';

import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppProvider, useApp } from '@/context/AppContext';
import { SmoothScroll, useSmoothScroll } from '@/components/motion/SmoothScroll';
import { Navbar } from '@/components/common/Navbar';
import { ToastContainer } from '@/components/common/Toast';
import { NewBookingModal } from '@/components/common/NewBookingModal';
import { TvLobbyMode } from '@/components/dashboard/TvLobbyMode';
import { MarketingPage } from '@/components/marketing/MarketingPage';
import { CustomerBooking } from '@/components/booking/CustomerBooking';
import { ShopDashboard } from '@/components/dashboard/ShopDashboard';

/** Editorial easing — quick to leave, long to settle. */
const EASE = [0.16, 1, 0.3, 1] as const;

const VIEWS = {
  marketing: MarketingPage,
  booking: CustomerBooking,
  dashboard: ShopDashboard,
} as const;

const MainContent: React.FC = () => {
  const { activeView } = useApp();
  const { scrollTo } = useSmoothScroll();
  const firstRender = useRef(true);

  // A view swap is a page change: start it at the top, and let ScrollTrigger
  // re-measure once the incoming tree has painted.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 320);
    return () => window.clearTimeout(id);
  }, [activeView, scrollTo]);

  const View = VIEWS[activeView];

  // Only the marketing hero is designed to sit under a transparent bar; the
  // other views need the height back.
  const needsSpacer = activeView !== 'marketing';

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 overflow-x-clip">
        {needsSpacer && <div aria-hidden className="h-16 sm:h-20" />}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 16, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.995 }}
            transition={{ duration: 0.45, ease: EASE }}
            onAnimationComplete={() => ScrollTrigger.refresh()}
          >
            <View />
          </motion.div>
        </AnimatePresence>
      </main>

      <NewBookingModal />
      <TvLobbyMode />
      <ToastContainer />
    </div>
  );
};

export default function AppShell() {
  return (
    <AppProvider>
      <SmoothScroll>
        <MainContent />
      </SmoothScroll>
    </AppProvider>
  );
}
