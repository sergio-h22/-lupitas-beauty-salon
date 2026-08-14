import type { MetadataRoute } from 'next';
import { BUSINESS } from '@/lib/business';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: '', priority: 1 },
    { path: '/services', priority: 0.9 },
    { path: '/book', priority: 0.9 },
    { path: '/gallery', priority: 0.7 },
    { path: '/about', priority: 0.6 },
  ];

  return routes.map((r) => ({
    url: `${BUSINESS.siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: r.priority,
  }));
}
