import type { Metadata } from 'next';
import { Suspense } from 'react';
import { StripeProvider } from '@/components/StripeProvider';
import BookingFlow from './BookingFlow';
import BookingHeader from './BookingHeader';

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description:
    "Book a haircut, color, highlights or balayage at Lupita's Beauty Salon in Anaheim, CA. No account needed — takes about a minute.",
  alternates: { canonical: '/book' },
};

export default function BookPage() {
  return (
    <>
      <BookingHeader />
      <Suspense fallback={<div className="shell py-section" />}>
        <StripeProvider>
          <BookingFlow />
        </StripeProvider>
      </Suspense>
    </>
  );
}
