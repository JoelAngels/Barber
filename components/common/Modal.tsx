'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollLock } from '../motion/SmoothScroll';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

const EASE = [0.16, 1, 0.3, 1] as const;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  // Lenis keeps scrolling through `overflow: hidden`, so the lock has to go
  // through the scroll provider rather than the body style alone.
  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Scrim blurs the page back rather than just dimming it. */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70"
          />

          {/* The panel arrives on a spring; children follow a beat later so the
              dialog reads as one object settling, not a block appearing. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320, mass: 0.7 }}
            className={`relative z-10 flex max-h-[90vh] w-full ${maxWidthClasses} flex-col overflow-hidden rounded-2xl border border-black/10 bg-white text-[#1A1A1A] shadow-2xl dark:border-white/10 dark:bg-zinc-900 dark:text-stone-100`}
          >
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.35, ease: EASE }}
              className="flex items-center justify-between border-b border-black/5 bg-stone-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/40"
            >
              <div>
                <h3 className="font-serif text-lg font-bold tracking-tight text-[#1A1A1A] dark:text-stone-100">
                  {title}
                </h3>
                {subtitle && (
                  <p className="mt-0.5 text-xs text-black/60 dark:text-stone-400">{subtitle}</p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-black/50 transition-colors hover:bg-black/5 hover:text-black dark:text-stone-400 dark:hover:bg-zinc-800 dark:hover:text-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.13, duration: 0.4, ease: EASE }}
              className="flex-1 overflow-y-auto p-6 scrollbar-thin"
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
