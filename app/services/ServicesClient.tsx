'use client';

import { useState } from 'react';
import { useT, useLocalized } from '@/lib/i18n';
import { SERVICES, CATEGORIES } from '@/lib/services';
import ServiceIndex from '@/components/ServiceIndex';
import Reveal from '@/components/Reveal';
import PageHeader from '@/components/PageHeader';
import BookingCTA from '@/components/BookingCTA';

export default function ServicesClient() {
  const t = useT();
  const L = useLocalized();
  const [active, setActive] = useState<string>('all');

  const shown = active === 'all' ? SERVICES : SERVICES.filter((s) => s.category === active);

  // Unfiltered, the menu is set the way a tasting menu is — grouped under its
  // courses, numbered continuously. Filtered, it collapses to a single run.
  const groups =
    active === 'all'
      ? CATEGORIES.map((c) => ({
          id: c.id,
          label: L(c.label),
          items: SERVICES.filter((s) => s.category === c.id),
        })).filter((g) => g.items.length > 0)
      : [{ id: active, label: '', items: shown }];

  let running = 1;

  return (
    <>
      <PageHeader
        eyebrow={t('services.eyebrow')}
        title={t('services.title')}
        subtitle={t('services.subtitle')}
      />

      <section className="py-section">
        <div className="shell">
          <div
            role="group"
            aria-label={t('services.eyebrow')}
            className="flex flex-wrap gap-x-2 gap-y-2"
          >
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

          <div className="mt-14 space-y-16 md:mt-20">
            {groups.map((group) => {
              const start = running;
              running += group.items.length;
              return (
                <div key={group.id}>
                  {group.label && (
                    <Reveal className="mb-7 flex items-center gap-5">
                      <h2 className="font-body text-label font-medium uppercase text-gold-text">
                        {group.label}
                      </h2>
                      <span aria-hidden="true" className="h-px flex-1 bg-ink/10" />
                      <span className="serial" aria-hidden="true">
                        {String(group.items.length).padStart(2, '0')}
                      </span>
                    </Reveal>
                  )}
                  <ServiceIndex services={group.items} startIndex={start} />
                </div>
              );
            })}
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
      className={`min-h-[44px] cursor-pointer border px-5 font-body text-label font-medium uppercase transition-colors duration-400 ease-luxe ${
        active
          ? 'border-ink bg-ink text-cream'
          : 'border-ink/15 text-ink-mid hover:border-ink hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
