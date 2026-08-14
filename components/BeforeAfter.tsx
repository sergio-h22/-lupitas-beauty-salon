'use client';

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
        className="relative aspect-[4/3] w-full select-none overflow-hidden bg-cream-deep"
      >
        {/* After (full width, underneath) */}
        <Panel src={afterSrc} caption={t('gallery.after')} />

        {/* Before (clipped to the slider position) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Panel src={beforeSrc} caption={t('gallery.before')} tone="deep" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-cream shadow-lg">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink" fill="none" stroke="currentColor" strokeWidth="2">
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
      <figcaption className="mt-3 text-sm font-medium text-ink">{label}</figcaption>
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
  const t = useT();

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />;
  }

  return (
    <div
      className={`placeholder-tile h-full w-full ${tone === 'deep' ? 'bg-cream-warm' : 'bg-cream-deep'}`}
    >
      <CameraIcon />
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em]">{caption}</span>
      <span className="px-6 text-xs">{t('gallery.placeholder')}</span>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.822 1.316Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
    </svg>
  );
}
