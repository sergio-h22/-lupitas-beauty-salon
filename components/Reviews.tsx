'use client';

import { useT } from '@/lib/i18n';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

/**
 * Placeholder testimonials. These carry no schema.org Review markup on
 * purpose — marking up invented reviews as real ones is a Google penalty
 * risk. Add `AggregateRating` only once these are genuine.
 */
const SLOTS = [1, 2, 3];

export default function Reviews({ index }: { index?: string }) {
  const t = useT();

  return (
    <section className="bg-ink py-section">
      <div className="shell">
        <SectionHeading
          index={index}
          eyebrow={t('reviews.eyebrow')}
          title={t('reviews.title')}
          tone="light"
          align="left"
        />

        {/* Hairline-separated columns rather than bordered boxes: the quote
            itself carries the weight, which is how an editorial page sets a
            testimonial. */}
        <ul className="mt-14 grid gap-x-10 gap-y-12 md:mt-20 md:grid-cols-3">
          {SLOTS.map((n, i) => (
            <Reveal as="li" key={n} delay={i * 0.09} className="border-t border-bone/15 pt-8">
              <blockquote className="flex h-full flex-col">
                <Stars />
                <p className="mt-6 flex-1 font-display text-[1.2rem] leading-relaxed text-bone/85">
                  &ldquo;{t('reviews.placeholder')}&rdquo;
                </p>
                <footer className="mt-7 flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-6 bg-sand" />
                  <span className="font-body text-label font-medium uppercase text-sand-soft">
                    Client Name
                  </span>
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
    <div className="flex gap-1.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-3 w-3 text-sand" fill="currentColor">
          <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.4l-5.81 3.05 1.11-6.47-4.7-4.58 6.5-.95L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}
