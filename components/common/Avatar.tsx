'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type AvatarProps = {
  name: string;
  src?: string;
  /** Rendered pixel size. Drives both the box and the image request. */
  size?: number;
  className?: string;
  /** Ring colour class, e.g. `ring-blue-500/40`. */
  ring?: string;
};

/** Deterministic tint per person, so the same name always looks the same. */
const TINTS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
];

const tintFor = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TINTS[h % TINTS.length];
};

/** "Dr. Robert Vance" -> "RV"; "Julian Rossi" -> "JR". */
const initialsFor = (name: string) => {
  const parts = name
    .replace(/\b(dr|mr|mrs|ms|prof)\.?\b/gi, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * A person's picture, with initials as the fallback.
 *
 * The fallback is not decorative: the avatars are remote URLs, and a dead one
 * would otherwise leave an empty hole in a list. `onError` swaps to initials so
 * the row still identifies who it belongs to.
 */
export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 40,
  className = '',
  ring,
}) => {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${
        showImage ? 'bg-slate-200 dark:bg-white/10' : tintFor(name)
      } ${ring ? `ring-2 ring-inset ${ring}` : ''} ${className}`}
      style={{ width: size, height: size }}
      title={name}
    >
      {showImage ? (
        <Image
          src={src as string}
          alt={name}
          width={size}
          height={size}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="font-serif font-bold leading-none tracking-tight"
          style={{ fontSize: Math.max(10, Math.round(size * 0.38)) }}
        >
          {initialsFor(name)}
        </span>
      )}
      <span className="sr-only">{name}</span>
    </span>
  );
};
