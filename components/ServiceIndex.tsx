'use client';

import Link from 'next/link';
import { useLocalized, useT, useLang } from '@/lib/i18n';
import { formatDuration } from '@/lib/booking';
import type { Service } from '@/lib/services';
import Reveal from './Reveal';

/**
 * The service menu, set as an index rather than a grid of cards.
 *
 * A bordered card grid is the single most recognisable "small business
 * website" pattern there is. A numbered index — the way a tasting menu or a
 * lookbook contents page is set — carries the same information with far more
 * authority, scans faster, and lets the row itself become the hit target.
 */
export default function ServiceIndex({
  services,
  startIndex = 1,
}: {
  services: Service[];
  /** Lets a page continue numbering across filtered sets. */
  startIndex?: number;
}) {
  const L = useLocalized();
  const t = useT();
  const { lang } = useLang();

  return (
    <ul className="border-b border-ink/10">
      {services.map((s, i) => (
        <Reveal as="li" key={s.id} delay={Math.min(i, 6) * 0.05} className="group border-t border-ink/10">
          <Link
            href={`/book?service=${s.id}`}
            aria-label={`${t('services.book')} — ${L(s.name)}`}
            className="relative -mx-gutter grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-3
                       px-gutter py-8 transition-colors duration-400 ease-luxe
                       hover:bg-cream-deep/70 md:grid-cols-[3.5rem_minmax(0,1fr)_7rem_10rem_2rem] md:gap-x-8 md:py-10"
          >
            <span className="serial pt-1 md:pt-2" aria-hidden="true">
              {String(startIndex + i).padStart(2, '0')}
            </span>

            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-display-sm text-ink transition-transform duration-600 ease-luxe md:group-hover:translate-x-1.5">
                  {L(s.name)}
                </h3>
                {s.popular && (
                  <span className="font-body text-label font-medium uppercase text-gold-text">
                    · {t('services.popular')}
                  </span>
                )}
              </span>
              <span className="mt-2.5 block max-w-prose text-sm leading-relaxed text-ink-muted">
                {L(s.blurb)}
              </span>

              {/* Meta moves inline beneath the name on small screens, where a
                  five-column row would compress into unreadable slivers. */}
              <span className="mt-4 flex items-center gap-4 font-body text-label font-medium uppercase text-ink-faint md:hidden">
                <span>{formatDuration(s.minutes, lang)}</span>
                <span aria-hidden="true">/</span>
                <span className="text-ink">{s.price || t('services.quote')}</span>
              </span>
            </span>

            <span className="hidden pt-2 font-body text-label font-medium uppercase text-ink-faint md:block">
              {formatDuration(s.minutes, lang)}
            </span>

            <span className="hidden pt-2 text-right font-body text-label-lg font-medium uppercase text-ink md:block">
              {s.price || t('services.quote')}
            </span>

            <span
              aria-hidden="true"
              className="justify-self-end pt-1 text-ink-faint transition-[transform,color] duration-600 ease-luxe
                         group-hover:translate-x-1 group-hover:text-gold-text md:pt-2"
            >
              <Arrow />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h15m0 0-6-6m6 6-6 6" />
    </svg>
  );
}
