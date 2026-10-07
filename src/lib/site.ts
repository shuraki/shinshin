export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shinshin-gray.vercel.app';

const REPO_ISSUES = 'https://github.com/shuraki/shinshin/issues/new';

export function reportUrl(programName?: string): string {
  const title = programName ? `טעות במידע: ${programName}` : 'טעות במידע באתר';
  const body = 'מה לא נכון? (אם אפשר, צרפו קישור למקור שמראה את המידע הנכון)\n\n';
  return `${REPO_ISSUES}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

const OG_IMAGE = { url: '/opengraph-image.jpg', width: 1200, height: 630, alt: 'שנה הבאה – כל שנות השירות במקום אחד' };

export function pageMeta({ title, description, path, index = true }: { title: string; description: string; path: string; index?: boolean }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: index ? undefined : { index: false },
    openGraph: { title, description, url: path, siteName: 'שנה הבאה', locale: 'he_IL', type: 'website' as const, images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image' as const, title, description, images: [OG_IMAGE.url] },
  };
}
