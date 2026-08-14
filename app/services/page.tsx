import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Hair Services & Prices in Anaheim',
  description:
    "Haircuts, hair coloring, highlights, balayage, treatments, blowouts and special occasion styling at Lupita's Beauty Salon in Anaheim, CA. Book online.",
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
