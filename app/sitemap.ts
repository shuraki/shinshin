import type { MetadataRoute } from 'next';
import { lastVerified, programs } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = lastVerified ? new Date(lastVerified) : undefined;
  return [
    { url: SITE_URL, lastModified, priority: 1 },
    { url: `${SITE_URL}/programs`, lastModified, priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified, priority: 0.7 },
    { url: `${SITE_URL}/match`, lastModified, priority: 0.6 },
    ...programs.map((p) => ({ url: `${SITE_URL}/programs/${p.id}`, lastModified: new Date(p.verified_at), priority: 0.8 })),
  ];
}
