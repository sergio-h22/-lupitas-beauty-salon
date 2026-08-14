'use client';

import { useT } from '@/lib/i18n';
import Reveal from './Reveal';

export default function Promos() {
  const t = useT();

  const items = [
    { title: t('promos.newClient'), body: t('promos.newClientBody') },
    { title: t('promos.referral'), body: t('promos.referralBody') },
    { title: t('promos.seasonal'), body: t('promos.seasonalBody') },
  ];

  return (
    <section className="bg-cream-deep py-section">
      <div className="shell">
        <Reveal className="text-center">
          <p className="eyebrow">{t('promos.eyebrow')}</p>
        </Reveal>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 0.08}>
              <div className="h-full border border-gold/40 bg-cream p-8 text-center">
                <h3 className="font-display text-[1.25rem]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
