import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Before & After Gallery',
  description:
    "Real hair transformations from Lupita's Beauty Salon in Anaheim, CA — haircuts, color, highlights, balayage and styling.",
  alternates: { canonical: '/gallery' },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
