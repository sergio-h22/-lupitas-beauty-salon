import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About the Salon',
  description:
    'Jaeso Studio is a boutique hair studio in Anaheim, CA — precision cutting, lived-in colour and unhurried appointments, one guest at a time.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <AboutClient />;
}
