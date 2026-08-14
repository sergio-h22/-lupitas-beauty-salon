'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n';
import { BUSINESS } from '@/lib/business';
import Reveal from './Reveal';

export default function BookingCTA() {
  const t = useT();

  return (
    <section className="relative overflow-hidden bg-ink py-section">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,rgba(212,175,55,0.16)_0%,transparent_70%)]"
      />
      <div className="shell relative text-center">
        <Reveal>
          <div className="rule-gold mx-auto" />
          <h2 className="mt-6 text-[clamp(2rem,5vw,3.4rem)] !text-cream">{t('cta.title')}</h2>
          <p className="mx-auto mt-5 max-w-xl text-cream/70">{t('cta.body')}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/book" className="btn-ondark">
              {t('hero.cta1')}
            </Link>
            <a
              href={`tel:${BUSINESS.phoneHref}`}
              className="btn border border-cream/35 text-cream hover:border-cream hover:bg-cream hover:text-ink"
            >
              {BUSINESS.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
