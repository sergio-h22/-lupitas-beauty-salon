'use client';

import { useT } from '@/lib/i18n';

/**
 * Stands in until real photography exists. Reserves its aspect ratio so
 * dropping a real image in later cannot shift the layout.
 */
export default function PhotoPlaceholder({
  label,
  ratio = 'aspect-[4/5]',
  src,
  className = '',
}: {
  label: string;
  ratio?: string;
  src?: string;
  className?: string;
}) {
  const t = useT();

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={label}
        className={`${ratio} w-full object-cover ${className}`}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <div className={`placeholder-tile ${ratio} w-full gap-3 ${className}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M18 9.75h.008v.008H18V9.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1-2.25-2.25V6.75Z" />
      </svg>
      <span className="px-5 text-xs font-medium">{label}</span>
      <span className="text-[0.6rem] uppercase tracking-[0.16em]">{t('gallery.placeholder')}</span>
    </div>
  );
}
