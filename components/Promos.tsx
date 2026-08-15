'use client';

import { useT } from '@/lib/i18n';
import Reveal from './Reveal';

/**
 * The three offers, set as a numbered band rather than three outlined boxes.
 * A promo strip is where a monochrome palette usually breaks — the temptation
 * is to reach for a colour so the offers "pop", and the moment they do, the
 * page has a fourth value in it and stops being the brand. These are typeset
 * instead: same ink, same hairlines, hierarchy from scale alone.
 */
export default function Promos({ index }: { index?: string }) {
  const t = useT();

  const items = [
    { title: t('promos.newClient'), body: t('promos.newClientBody') },
    { title: t('promos.referral'), body: t('promos.referralBody') },
    { title: t('promos.seasonal'), body: t('promos.seasonalBody') },
  ];

  return (
    <section className="bg-bone-deep py-section-sm">
      <div className="shell">
        <Reveal className="flex items-center gap-4">
          {index && (
            <>
              <span className="serial" aria-hidden="true">
                {index}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-ink/20" />
            </>
          )}
          <span className="eyebrow">{t('promos.eyebrow')}</span>
        </Reveal>

        <ul className="mt-10 grid border-t border-ink/10 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 0.08}
              className={`border-b border-ink/10 py-8 md:border-b-0 md:py-10 ${
                i > 0 ? 'md:border-l md:border-ink/10 md:pl-10' : 'md:pr-10'
              } ${i === 1 ? 'md:px-10' : ''}`}
            >
              <h3 className="text-display-sm">{item.title}</h3>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
