'use client';

import Link from 'next/link';
import { useLocalized, useT } from '@/lib/i18n';
import { SPECIALISTS } from '@/lib/specialists';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import PhotoPlaceholder from './PhotoPlaceholder';

export default function Specialists() {
  const L = useLocalized();
  const t = useT();

  return (
    <section className="py-section">
      <div className="shell">
        <SectionHeading eyebrow={t('team.eyebrow')} title={t('team.title')} />

        <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {SPECIALISTS.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 0.08}>
              <PhotoPlaceholder label={s.name} src={s.photo || undefined} />
              <h3 className="mt-6 font-display text-[1.35rem]">{s.name}</h3>
              <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-text">
                {L(s.role)}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{L(s.bio)}</p>
              <Link
                href={`/book?specialist=${s.id}`}
                className="mt-5 inline-flex min-h-[44px] items-center text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink underline decoration-gold decoration-2 underline-offset-[6px] hover:text-gold-text"
              >
                {t('team.bookWith')} {s.name}
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
