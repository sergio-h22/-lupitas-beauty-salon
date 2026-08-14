'use client';

import { useT, useLang } from '@/lib/i18n';
import { BUSINESS, ADDRESS_LINE, HOURS, DAY_ORDER, MAPS_QUERY } from '@/lib/business';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const DAY_LABEL: Record<number, { en: string; es: string }> = {
  0: { en: 'Sunday', es: 'Domingo' },
  1: { en: 'Monday', es: 'Lunes' },
  2: { en: 'Tuesday', es: 'Martes' },
  3: { en: 'Wednesday', es: 'Miércoles' },
  4: { en: 'Thursday', es: 'Jueves' },
  5: { en: 'Friday', es: 'Viernes' },
  6: { en: 'Saturday', es: 'Sábado' },
};

export default function LocationSection() {
  const t = useT();
  const { lang } = useLang();
  const today = new Date().getDay();

  return (
    <section className="py-section">
      <div className="shell">
        <SectionHeading eyebrow={t('location.eyebrow')} title={t('location.title')} align="left" />

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="aspect-[4/3] w-full overflow-hidden border border-ink/10 bg-cream-deep">
              <iframe
                title={`Map to ${BUSINESS.name}`}
                src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col justify-center">
            <address className="not-italic">
              <p className="font-display text-[1.5rem] text-ink">{BUSINESS.address.street}</p>
              <p className="mt-1 text-ink-muted">
                {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
              </p>
            </address>

            <p className="mt-4 text-sm text-ink-muted">{t('location.parking')}</p>

            <h3 className="mt-9 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink">
              {t('location.hours')}
            </h3>
            <dl className="mt-4 max-w-sm divide-y divide-ink/10 border-y border-ink/10">
              {DAY_ORDER.map((day) => {
                const h = HOURS.find((x) => x.day === day)!;
                const isToday = day === today;
                return (
                  <div
                    key={day}
                    className={`flex justify-between gap-6 py-2.5 text-sm ${
                      isToday ? 'font-semibold text-ink' : 'text-ink-muted'
                    }`}
                  >
                    <dt>{DAY_LABEL[day][lang]}</dt>
                    <dd className={h.open ? '' : 'text-rose-text'}>
                      {h.open ? `${fmt(h.open, lang)} – ${fmt(h.close!, lang)}` : t('location.closed')}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`tel:${BUSINESS.phoneHref}`} className="btn-primary">
                {t('location.callUs')}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                {t('location.directions')}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function fmt(hhmm: string, lang: 'en' | 'es') {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString(lang === 'es' ? 'es-US' : 'en-US', {
    hour: 'numeric',
    minute: m === 0 ? undefined : '2-digit',
  });
}
