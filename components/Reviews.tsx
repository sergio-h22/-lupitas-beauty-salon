'use client';

import { useT } from '@/lib/i18n';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

/**
 * Placeholder testimonials. These carry no schema.org Review markup on
 * purpose — marking up invented reviews as real ones is a Google penalty
 * risk. Add AggregateRating only once these are genuine.
 */
const SLOTS = [1, 2, 3];

export default function Reviews() {
  const t = useT();

  return (
    <section className="bg-ink py-section">
      <div className="shell">
        <SectionHeading eyebrow={t('reviews.eyebrow')} title={t('reviews.title')} tone="light" />

        <ul className="mt-16 grid gap-8 md:grid-cols-3">
          {SLOTS.map((n, i) => (
            <Reveal as="li" key={n} delay={i * 0.09}>
              <blockquote className="flex h-full flex-col border border-cream/15 p-8">
                <Stars />
                <p className="mt-5 flex-1 font-display text-[1.05rem] italic leading-relaxed text-cream/80">
                  &ldquo;{t('reviews.placeholder')}&rdquo;
                </p>
                <footer className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold">
                  Client Name
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="currentColor">
          <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.4l-5.81 3.05 1.11-6.47-4.7-4.58 6.5-.95L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}
