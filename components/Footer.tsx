'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useT, useLang } from '@/lib/i18n';
import { BUSINESS, HOURS, DAY_ORDER, MAPS_QUERY } from '@/lib/business';
import Logo from './Logo';
import BrandMark from './BrandMark';

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
    <footer className="bg-ink text-bone/60">
      <div className="shell grid gap-12 py-section-sm md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-measure text-sm leading-relaxed">{BUSINESS.positioning[lang]}</p>
          <p className="mt-6 font-body text-label font-medium uppercase text-sand-soft">
            {t('welcome.appointment')}
          </p>
        </div>

        <div className="lg:col-span-3">
          <h3 className="font-body text-label font-medium uppercase text-bone">
            {t('location.eyebrow')}
          </h3>
          <address className="mt-5 not-italic text-sm leading-relaxed">
            {BUSINESS.address.street}
            <br />
            {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
          </address>
          <a
            href={`tel:${BUSINESS.phoneHref}`}
            className="mt-4 inline-flex min-h-[44px] items-center font-body text-label-lg font-medium uppercase text-sand-soft transition-colors duration-400 ease-luxe hover:text-bone"
          >
            {BUSINESS.phone}
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block min-h-[44px] py-2 text-sm underline decoration-bone/25 underline-offset-4 transition-colors duration-400 ease-luxe hover:text-bone"
          >
            {t('location.directions')}
          </a>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-body text-label font-medium uppercase text-bone">
            {t('location.hours')}
          </h3>
          <dl className="mt-5 space-y-2 text-sm">
            {DAY_ORDER.map((day) => {
              const h = HOURS.find((x) => x.day === day)!;
              return (
                <div key={day} className="flex justify-between gap-4">
                  <dt>{DAY_LABEL[day][lang]}</dt>
                  <dd className={h.open ? 'tabular-nums' : 'text-alert-soft'}>
                    {h.open ? `${fmt(h.open, lang)} – ${fmt(h.close!, lang)}` : t('location.closed')}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="lg:col-span-3">
          <h3 className="font-body text-label font-medium uppercase text-bone">
            {t('newsletter.title')}
          </h3>
          <NewsletterForm />
          <h3 className="mt-9 font-body text-label font-medium uppercase text-bone">
            {t('footer.social')}
          </h3>
          <p className="mt-3 text-sm">{t('footer.socialSoon')}</p>
        </div>
      </div>

      {/* The signature again as a sign-off, at the scale of a page rather than
          a business card. It is what makes a footer feel like the end of a
          brand's page rather than the bottom of a template.

          The figure is dropped here: at this width it would tower over the
          columns above and read as an illustration rather than a signature.
          Held at 10% — the signature is a hairline stroke, and below that it
          stops resolving as a word at all. */}
      <div className="shell overflow-hidden pb-4">
        <BrandMark
          variant="word"
          className="h-[clamp(7rem,26vw,20rem)] w-auto select-none text-bone/10"
        />
      </div>

      <div className="border-t border-bone/10">
        <div className="shell flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS.name}. {t('footer.rights')}
          </p>
          <nav aria-label="Footer" className="flex gap-8">
            <Link href="/services" className="transition-colors duration-400 ease-luxe hover:text-bone">
              {t('nav.services')}
            </Link>
            <Link href="/book" className="transition-colors duration-400 ease-luxe hover:text-bone">
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
    return <p className="mt-5 text-sm text-sand-soft">{t('newsletter.thanks')}</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Demo only — wire to an email provider before launch.
        setSent(true);
      }}
      className="mt-5"
    >
      <label htmlFor="newsletter-email" className="block text-sm leading-relaxed">
        {t('newsletter.body')}
      </label>
      <div className="mt-4 flex">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletter.placeholder')}
          className="min-h-[48px] w-full border border-bone/20 bg-transparent px-3.5 font-body text-sm text-bone transition-colors duration-250 placeholder:text-bone/35 focus:border-sand focus:outline-none"
        />
        <button
          type="submit"
          className="min-h-[48px] cursor-pointer whitespace-nowrap border border-bone bg-bone px-5 font-body text-label font-medium uppercase text-ink transition-colors duration-400 ease-luxe hover:border-sand-soft hover:bg-sand-soft"
        >
          {t('newsletter.submit')}
        </button>
      </div>
    </form>
  );
}
