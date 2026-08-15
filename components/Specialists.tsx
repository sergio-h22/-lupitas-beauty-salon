'use client';

import Link from 'next/link';
import { useLocalized, useT } from '@/lib/i18n';
import { SPECIALISTS } from '@/lib/specialists';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import PhotoPlaceholder from './PhotoPlaceholder';

export default function Specialists({ index }: { index?: string }) {
  const L = useLocalized();
  const t = useT();

  return (
    <section className="py-section">
      <div className="shell">
        <SectionHeading index={index} eyebrow={t('team.eyebrow')} title={t('team.title')} align="left" />

        <ul className="mt-14 grid gap-x-8 gap-y-14 md:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {SPECIALISTS.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 0.08} className="group">
              <PhotoPlaceholder
                label={s.name}
                src={s.photo || undefined}
                ratio="aspect-[4/5]"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              />

              <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-ink/10 pt-5">
                <h3 className="text-display-sm">{s.name}</h3>
                <span className="serial" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <p className="mt-2 font-body text-label font-medium uppercase text-gold-text">
                {L(s.role)}
              </p>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-muted">{L(s.bio)}</p>

              <Link href={`/book?specialist=${s.id}`} className="btn-quiet mt-5">
                {t('team.bookWith')} {s.name}
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
