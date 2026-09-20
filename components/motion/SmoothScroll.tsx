'use client';

import React, { createContext, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollApi = {
  /** Jump or glide to an absolute offset / element. */
  scrollTo: (target: number | string | HTMLElement, opts?: { immediate?: boolean; offset?: number }) => void;
  /**
   * Hold the page still. Ref-counted, so a dialog opened from inside another
   * overlay cannot release the lock early. `body { overflow: hidden }` alone
   * does NOT stop Lenis — it keeps handling the wheel and scrolls underneath.
   */
  pushLock: () => void;
  popLock: () => void;
};

const SmoothScrollContext = createContext<ScrollApi>({
  scrollTo: () => {},
  pushLock: () => {},
  popLock: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * Drives the page with Lenis and hands scroll updates to GSAP's ScrollTrigger.
 *
 * Lenis 1.x scrolls the window natively rather than transforming a wrapper, so
 * `position: sticky` (the dashboard sidebar, the navbar) keeps working. It also
 * honours `prefers-reduced-motion` itself, and the ticker below is skipped
 * entirely in that case so nothing is interpolated.
 */
export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const lockCount = useRef(0);

  useLayoutEffect(() => {
    // Lenis honours reduced motion itself, but skipping it entirely also keeps
    // the GSAP ticker idle rather than interpolating frames nobody wants.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Exponential ease-out: quick to respond, long unhurried settle.
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch feels better than an interpolated one.
      syncTouch: false,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    // One clock for both libraries, or they fight over frames.
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Late-loading media changes document height; ScrollTrigger needs to re-measure.
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  const setLocked = (locked: boolean) => {
    const lenis = lenisRef.current;
    if (locked) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
  };

  const api: ScrollApi = {
    pushLock: () => {
      lockCount.current += 1;
      if (lockCount.current === 1) setLocked(true);
    },
    popLock: () => {
      lockCount.current = Math.max(0, lockCount.current - 1);
      if (lockCount.current === 0) setLocked(false);
    },
    scrollTo: (target, opts) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { immediate: opts?.immediate, offset: opts?.offset ?? 0 });
        return;
      }
      // Reduced motion, or Lenis not mounted: fall back to the platform.
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: opts?.immediate ? 'auto' : 'smooth' });
      }
    },
  };

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>;
};

/** Holds the page still for as long as `active` is true. */
export const useScrollLock = (active: boolean) => {
  const { pushLock, popLock } = useSmoothScroll();
  useEffect(() => {
    if (!active) return;
    pushLock();
    return popLock;
  }, [active, pushLock, popLock]);
};
