'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n';
import { BUSINESS } from '@/lib/business';
import Reveal from './Reveal';

/**
 * The closer. Set at the largest display size on the page — larger than any
 * section heading — so the last thing a visitor reads is also the loudest.
 */
export default function BookingCTA() {
  const t = useT();

  return (
    <section className="relative overflow-hidden bg-ink py-section-lg">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(85%_65%_at_50%_0%,rgba(201,162,39,0.14)_0%,transparent_68%)]"
      />

      <div className="shell relative">
        <div className="max-w-4xl">
          <Reveal variant="rule" className="h-px w-16 bg-sand" />

          <Reveal as="h2" variant="mask" delay={0.08} className="mt-8 text-display-lg !text-bone">
            <span>{t('cta.title')}</span>
          </Reveal>

          <Reveal delay={0.18} className="mt-7 max-w-prose text-[1.02rem] leading-relaxed text-bone/60">
            {t('cta.body')}
          </Reveal>

          <Reveal delay={0.26} className="mt-11 flex flex-wrap items-center gap-4">
            <Link href="/book" className="btn-ondark">
              {t('hero.cta1')}
            </Link>
            <a href={`tel:${BUSINESS.phoneHref}`} className="btn-ondark-outline">
              {BUSINESS.phone}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
