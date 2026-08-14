'use client';

import { useState } from 'react';
import { useT, useLocalized } from '@/lib/i18n';
import PageHeader from '@/components/PageHeader';
import BeforeAfter from '@/components/BeforeAfter';
import PhotoPlaceholder from '@/components/PhotoPlaceholder';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import BookingCTA from '@/components/BookingCTA';

/**
 * Gallery items. Add `before`/`after` paths under /public/gallery and the
 * placeholders are replaced automatically — no other change needed.
 */
const ITEMS = [
  { id: 'g1', cat: 'color', label: { en: 'Balayage', es: 'Balayage' }, before: '', after: '' },
  { id: 'g2', cat: 'color', label: { en: 'Full color', es: 'Color completo' }, before: '', after: '' },
  { id: 'g3', cat: 'color', label: { en: 'Highlights', es: 'Rayitos' }, before: '', after: '' },
  { id: 'g4', cat: 'cuts', label: { en: 'Long layers', es: 'Capas largas' }, before: '', after: '' },
  { id: 'g5', cat: 'cuts', label: { en: 'Bob cut', es: 'Corte bob' }, before: '', after: '' },
  { id: 'g6', cat: 'styling', label: { en: 'Occasion styling', es: 'Peinado de ocasión' }, before: '', after: '' },
];

const FILTERS = [
  { id: 'all', label: { en: 'All', es: 'Todo' } },
  { id: 'cuts', label: { en: 'Haircuts', es: 'Cortes' } },
  { id: 'color', label: { en: 'Color', es: 'Color' } },
  { id: 'styling', label: { en: 'Styling', es: 'Peinados' } },
];

const VIDEO_SLOTS = [
  { en: 'Hair transformation', es: 'Transformación de cabello' },
  { en: 'Styling in the chair', es: 'Peinado en la silla' },
  { en: 'Salon atmosphere', es: 'Ambiente del salón' },
];

export default function GalleryClient() {
  const t = useT();
  const L = useLocalized();
  const [filter, setFilter] = useState('all');

  const shown = filter === 'all' ? ITEMS : ITEMS.filter((i) => i.cat === filter);

  return (
    <>
      <PageHeader eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} subtitle={t('gallery.subtitle')} />

      <section className="py-section">
        <div className="shell">
          <div role="group" aria-label={t('gallery.eyebrow')} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`min-h-[44px] cursor-pointer border px-5 font-body text-label font-medium uppercase transition-colors duration-400 ease-luxe ${
                  filter === f.id
                    ? 'border-ink bg-ink text-cream'
                    : 'border-ink/15 text-ink-mid hover:border-ink hover:text-ink'
                }`}
              >
                {L(f.label)}
              </button>
            ))}
          </div>

          <p aria-live="polite" className="sr-only">
            {shown.length} results
          </p>

          <div className="mt-14 grid gap-x-8 gap-y-12 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i, 5) * 0.06}>
                <BeforeAfter
                  label={L(item.label)}
                  beforeSrc={item.before || undefined}
                  afterSrc={item.after || undefined}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-deep py-section">
        <div className="shell">
          <SectionHeading
            index="02"
            eyebrow="Video"
            title={t('gallery.title')}
            subtitle={t('gallery.placeholder')}
            align="left"
          />
          <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3">
            {VIDEO_SLOTS.map((v, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <PhotoPlaceholder
                  label={L(v)}
                  ratio="aspect-[9/16]"
                  sizes="(min-width: 768px) 30vw, 90vw"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BookingCTA />
    </>
  );
}
