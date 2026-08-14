import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About the Salon',
  description:
    "Lupita's Beauty Salon is dedicated to helping every customer feel confident and beautiful through personalized hair care and professional styling in Anaheim, CA.",
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <AboutClient />;
}
