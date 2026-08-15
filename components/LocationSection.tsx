'use client';

import { useT, useLang } from '@/lib/i18n';
import { BUSINESS, HOURS, DAY_ORDER, MAPS_QUERY } from '@/lib/business';
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

export default function LocationSection({ index }: { index?: string }) {
  const t = useT();
  const { lang } = useLang();
  const today = new Date().getDay();

  return (
    <section className="py-section">
      <div className="shell">
        <SectionHeading
          index={index}
          eyebrow={t('location.eyebrow')}
          title={t('location.title')}
          align="left"
        />

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <div className="frame aspect-[4/3] w-full border border-ink/10 lg:aspect-[16/11]">
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

          <div className="lg:col-span-5">
            <Reveal>
              <address className="not-italic">
                <p className="text-display-sm text-ink">{BUSINESS.address.street}</p>
                <p className="mt-1.5 text-ink-muted">
                  {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                </p>
              </address>
              <p className="mt-5 max-w-prose text-sm leading-relaxed text-ink-muted">
                {t('location.parking')}
              </p>
            </Reveal>

            <Reveal delay={0.12} className="mt-10">
              <h3 className="font-body text-label font-medium uppercase text-ink">
                {t('location.hours')}
              </h3>
              <dl className="mt-5 border-t border-ink/10">
                {DAY_ORDER.map((day) => {
                  const h = HOURS.find((x) => x.day === day)!;
                  const isToday = day === today;
                  return (
                    <div
                      key={day}
                      className={`flex justify-between gap-6 border-b border-ink/10 py-3 text-sm ${
                        isToday ? 'font-medium text-ink' : 'text-ink-muted'
                      }`}
                    >
                      <dt className="flex items-center gap-2.5">
                        {isToday && (
                          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
                        )}
                        {DAY_LABEL[day][lang]}
                      </dt>
                      <dd className={h.open ? 'tabular-nums' : 'text-rose-text'}>
                        {h.open ? `${fmt(h.open, lang)} – ${fmt(h.close!, lang)}` : t('location.closed')}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </Reveal>

            <Reveal delay={0.2} className="mt-9 flex flex-wrap gap-3">
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
            </Reveal>
          </div>
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
