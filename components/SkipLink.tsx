'use client';

import { useT } from '@/lib/i18n';

export default function SkipLink() {
  const t = useT();
  return (
    <a
      href="#main"
      className="absolute left-2 top-2 z-[100] -translate-y-24 bg-ink px-5 py-3 text-sm font-semibold text-bone transition-transform focus:translate-y-0"
    >
      {t('a11y.skip')}
    </a>
  );
}
