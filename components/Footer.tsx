'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useT, useLang } from '@/lib/i18n';
import { BUSINESS, ADDRESS_LINE, HOURS, DAY_ORDER, MAPS_QUERY } from '@/lib/business';
import Logo from './Logo';

const DAY_LABEL: Record<number, { en: string; es: string }> = {
  0: { en: 'Sunday', es: 'Domingo' },
  1: { en: 'Monday', es: 'Lunes' },
  2: { en: 'Tuesday', es: 'Martes' },
  3: { en: 'Wednesday', es: 'Miércoles' },
  4: { en: 'Thursday', es: 'Jueves' },
  5: { en: 'Friday', es: 'Viernes' },
  6: { en: 'Saturday', es: 'Sábado' },
};

export default function Footer() {
  const t = useT();
  const { lang } = useLang();

  return (
    <footer className="mt-section bg-ink text-cream/75">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">{BUSINESS.positioning[lang]}</p>
          <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold">
            Se habla español
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream">
            {t('location.eyebrow')}
          </h3>
          <address className="not-italic text-sm leading-relaxed">
            {BUSINESS.address.street}
            <br />
            {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
          </address>
          <a
            href={`tel:${BUSINESS.phoneHref}`}
            className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-gold hover:text-cream"
          >
            {BUSINESS.phone}
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block min-h-[44px] py-2 text-sm underline underline-offset-4 hover:text-cream"
          >
            {t('location.directions')}
          </a>
        </div>

        <div>
          <h3 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream">
            {t('location.hours')}
          </h3>
          <dl className="space-y-1.5 text-sm">
            {DAY_ORDER.map((day) => {
              const h = HOURS.find((x) => x.day === day)!;
              return (
                <div key={day} className="flex justify-between gap-4">
                  <dt>{DAY_LABEL[day][lang]}</dt>
                  <dd className={h.open ? '' : 'text-rose'}>
                    {h.open ? `${fmt(h.open, lang)} – ${fmt(h.close!, lang)}` : t('location.closed')}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div>
          <h3 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream">
            {t('newsletter.title')}
          </h3>
          <NewsletterForm />
          <h3 className="mb-3 mt-8 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream">
            {t('footer.social')}
          </h3>
          <p className="text-sm">{t('footer.socialSoon')}</p>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="shell flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS.name}. {t('footer.rights')}
          </p>
          <nav aria-label="Footer" className="flex gap-6">
            <Link href="/services" className="hover:text-cream">
              {t('nav.services')}
            </Link>
            <Link href="/book" className="hover:text-cream">
              {t('nav.book')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function fmt(hhmm: string, lang: 'en' | 'es') {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString(lang === 'es' ? 'es-US' : 'en-US', {
    hour: 'numeric',
    minute: m === 0 ? undefined : '2-digit',
  });
}

function NewsletterForm() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return <p className="text-sm text-gold">{t('newsletter.thanks')}</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Demo only — wire to an email provider before launch.
        setSent(true);
      }}
      className="flex flex-col gap-2"
    >
      <label htmlFor="newsletter-email" className="text-sm">
        {t('newsletter.body')}
      </label>
      <div className="flex">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletter.placeholder')}
          className="min-h-[48px] w-full border border-cream/25 bg-transparent px-3 text-sm text-cream placeholder:text-cream/40 focus:border-gold"
        />
        <button
          type="submit"
          className="min-h-[48px] cursor-pointer whitespace-nowrap bg-gold px-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors duration-250 hover:bg-cream"
        >
          {t('newsletter.submit')}
        </button>
      </div>
    </form>
  );
}
