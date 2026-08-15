import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Before & After Gallery',
  description:
    'Real hair transformations from Jaeso Studio in Anaheim, CA — haircuts, colour, highlights, balayage and styling.',
  alternates: { canonical: '/gallery' },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
