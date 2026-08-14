'use client';

import { useT } from '@/lib/i18n';
import PageHeader from '@/components/PageHeader';

export default function BookingHeader() {
  const t = useT();
  return <PageHeader eyebrow={t('nav.book')} title={t('booking.title')} subtitle={t('booking.subtitle')} />;
}
