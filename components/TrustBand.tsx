'use client';

import { useT } from '@/lib/i18n';
import Reveal from './Reveal';

/**
 * The four things a first-time visitor most needs to know, placed in the first
 * screen after the hero. Every line restates a fact already on the page — this
 * band exists to answer the objections that decide a booking (Do they speak my
 * language? Where do I park? Is this near me? How long will this take?) before
 * the visitor has to go looking for them.
 */
export default function TrustBand() {
  const t = useT();

  const items = [t('trust.appointment'), t('trust.oneChair'), t('trust.consult'), t('trust.quickBook')];

  return (
    <section aria-label="At a glance" className="border-b border-ink/10 bg-bone">
      <ul className="shell grid grid-cols-2 md:grid-cols-4">
        {items.map((item, i) => (
          <Reveal
            as="li"
            key={item}
            delay={i * 0.06}
            className={`flex items-center gap-3 py-6 md:py-7 ${
              i % 2 === 1 ? 'border-l border-ink/10 pl-5' : ''
            } ${i >= 2 ? 'border-t border-ink/10 md:border-t-0' : ''} ${
              i === 2 ? 'md:border-l md:border-ink/10 md:pl-5' : ''
            }`}
          >
            <span aria-hidden="true" className="h-1 w-1 flex-none rounded-full bg-sand" />
            <span className="font-body text-label font-medium uppercase text-ink-mid">{item}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
