'use client';

import Link from 'next/link';
import { useLocalized, useT, useLang } from '@/lib/i18n';
import { formatDuration } from '@/lib/booking';
import type { Service } from '@/lib/services';

export default function ServiceCard({ service }: { service: Service }) {
  const L = useLocalized();
  const t = useT();
  const { lang } = useLang();

  return (
    <article className="card flex flex-col p-7">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[1.3rem] leading-tight">{L(service.name)}</h3>
        {service.popular && (
          <span className="flex-none border border-gold-text/40 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-gold-text">
            {t('services.popular')}
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{L(service.blurb)}</p>

      <dl className="mt-6 flex items-baseline justify-between border-t border-ink/10 pt-4 text-sm">
        <div>
          <dt className="sr-only">Duration</dt>
          <dd className="text-ink-muted">{formatDuration(service.minutes, lang)}</dd>
        </div>
        <div className="text-right">
          <dt className="sr-only">Price</dt>
          <dd className="font-semibold text-ink">{service.price || t('services.quote')}</dd>
        </div>
      </dl>

      <Link
        href={`/book?service=${service.id}`}
        className="btn-outline mt-5 w-full"
        aria-label={`${t('services.book')} — ${L(service.name)}`}
      >
        {t('services.book')}
      </Link>
    </article>
  );
}
