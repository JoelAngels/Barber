'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Fast out of the gate, long unhurried settle. Matches the view transitions. */
const EASE = 'power3.out';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Travel distance in px. */
  y?: number;
  x?: number;
  /** Seconds before the tween starts once in view. */
  delay?: number;
  duration?: number;
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: number;
  /** Start slightly scaled down — good for cards and media. */
  scale?: number;
  /** Viewport position that triggers the reveal. */
  start?: string;
  as?: 'div' | 'section' | 'ul' | 'header';
};

/**
 * Scroll-triggered entrance. Animates once, then unhooks.
 *
 * Deliberately built as `gsap.set` + a `ScrollTrigger.create` that fires a
 * `gsap.to` on enter, rather than handing a paused tween to ScrollTrigger.
 * The tween-coupled form can leave elements stranded at opacity 0 if the
 * trigger is created during a transient layout; here the worst case is that
 * content reveals early, never that it stays invisible.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  y = 28,
  x = 0,
  delay = 0,
  duration = 0.9,
  stagger,
  scale,
  start = 'top 85%',
  as: Tag = 'div',
}) => {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const targets: Element[] = stagger ? Array.from(el.children) : [el];
      if (!targets.length) return;

      gsap.set(targets, { opacity: 0, y, x, ...(scale ? { scale } : {}) });

      const trigger = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            x: 0,
            ...(scale ? { scale: 1 } : {}),
            duration,
            delay,
            ease: EASE,
            stagger: stagger ?? 0,
            // Hand the element back to CSS once it has landed, so hover
            // transforms on the cards aren't fighting a leftover matrix.
            clearProps: 'transform,opacity',
          });
        },
      });

      return () => trigger.kill();
    }, el);

    return () => ctx.revert();
  }, [y, x, delay, duration, stagger, scale, start]);

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {children}
    </Tag>
  );
};
