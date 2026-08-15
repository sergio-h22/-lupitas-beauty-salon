'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useT } from '@/lib/i18n';

/**
 * Drag-to-compare. Keyboard-operable via the range input, which is the actual
 * control — the visual handle is decorative and marked aria-hidden.
 */
export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  label,
}: {
  beforeSrc?: string;
  afterSrc?: string;
  label: string;
}) {
  const t = useT();
  const [pos, setPos] = useState(50);
  const wrap = useRef<HTMLDivElement>(null);

  return (
    <figure className="group">
      <div
        ref={wrap}
        className="relative aspect-[4/3] w-full select-none overflow-hidden border border-ink/10 bg-bone-deep"
      >
        {/* After (full width, underneath) */}
        <Panel src={afterSrc} caption={t('gallery.after')} />

        {/* Before (clipped to the slider position) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Panel src={beforeSrc} caption={t('gallery.before')} tone="deep" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-sand"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-sand bg-bone">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-ink"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8 9-3 3 3 3m8-6 3 3-3 3" />
            </svg>
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={t('a11y.compareSlider')}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>

      <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-ink/10 pt-4">
        <span className="font-display text-[1.05rem] text-ink">{label}</span>
        <span className="font-body text-label font-medium uppercase text-ink-faint">
          {t('gallery.before')} / {t('gallery.after')}
        </span>
      </figcaption>
    </figure>
  );
}

function Panel({
  src,
  caption,
  tone = 'base',
}: {
  src?: string;
  caption: string;
  tone?: 'base' | 'deep';
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 768px) 45vw, 92vw"
        className="object-cover"
      />
    );
  }

  return (
    <div
      className={`placeholder-tile h-full w-full gap-3 ${
        tone === 'deep' ? 'bg-bone-warm' : 'bg-bone-deep'
      }`}
    >
      <span aria-hidden="true" className="absolute inset-3 border border-ink/10" />
      <span className="font-body text-label font-medium uppercase text-ink-faint">{caption}</span>
    </div>
  );
}
