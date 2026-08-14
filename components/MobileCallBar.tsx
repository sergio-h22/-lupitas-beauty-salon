'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '@/lib/i18n';
import { BUSINESS } from '@/lib/business';

/**
 * Phones are how a local salon actually gets booked, and the number is
 * otherwise below the fold on mobile. Hidden on the booking page, where it
 * would compete with the flow's own controls.
 */
export default function MobileCallBar() {
  const t = useT();
  const pathname = usePathname();

  if (pathname === '/book') return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-ink/15 bg-cream/95 backdrop-blur md:hidden">
      <a
        href={`tel:${BUSINESS.phoneHref}`}
        className="flex min-h-[56px] items-center justify-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
          />
        </svg>
        {t('location.callUs')}
      </a>
      <Link
        href="/book"
        className="flex min-h-[56px] items-center justify-center bg-ink text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-cream"
      >
        {t('nav.book')}
      </Link>
    </div>
  );
}
