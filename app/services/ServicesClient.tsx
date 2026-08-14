'use client';

import { useState } from 'react';
import { useT, useLocalized } from '@/lib/i18n';
import { SERVICES, CATEGORIES } from '@/lib/services';
import ServiceCard from '@/components/ServiceCard';
import Reveal from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';
import BookingCTA from '@/components/BookingCTA';

export default function ServicesClient() {
  const t = useT();
  const L = useLocalized();
  const [active, setActive] = useState<string>('all');

  const shown = active === 'all' ? SERVICES : SERVICES.filter((s) => s.category === active);

  return (
    <>
      <PageHeader eyebrow={t('services.eyebrow')} title={t('services.title')} subtitle={t('services.subtitle')} />

      <section className="py-section">
        <div className="shell">
          <div role="group" aria-label={t('services.eyebrow')} className="flex flex-wrap justify-center gap-2">
            <FilterButton active={active === 'all'} onClick={() => setActive('all')}>
              {t('services.all')}
            </FilterButton>
            {CATEGORIES.map((c) => (
              <FilterButton key={c.id} active={active === c.id} onClick={() => setActive(c.id)}>
                {L(c.label)}
              </FilterButton>
            ))}
          </div>

          <p aria-live="polite" className="sr-only">
            {shown.length} services
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((s, i) => (
              <Reveal key={s.id} delay={Math.min(i, 5) * 0.06}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BookingCTA />
    </>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] cursor-pointer border px-5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-250 ${
        active ? 'border-ink bg-ink text-cream' : 'border-ink/20 text-ink hover:border-ink'
      }`}
    >
      {children}
    </button>
  );
}
