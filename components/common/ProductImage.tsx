'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

/**
 * Product shot that degrades to an icon instead of a blank box.
 *
 * The images are remote URLs; one of them was already a hard 404, which left a
 * grey hole in the register grid. A visible placeholder keeps the tile legible.
 */
export const ProductImage: React.FC<Props> = ({ src, alt, className = '', sizes }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-white/5">
        <Package className="h-1/3 w-1/3 text-slate-300 dark:text-stone-600" aria-hidden />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
