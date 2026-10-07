// URL validation and verification utilities
export function isValidUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
}
}

export async function checkUrlAvailable(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return response.ok || response.status === 0; // 0 means no-cors worked
  } catch {
    return false;
  }
}

// Normalize Hebrew URLs (remove extra spaces, fix encoding)
export function normalizeUrl(url: string): string {
  if (!url) return '';
  return url
    .trim()
    .replace(/\s+/g, '')
    .replace(/שנת\s*שירות/g, 'shnat-sherut')
    .replace(/[^\x00-\x7F]/g, (char) => {
      return '%' + ('0' + char.charCodeAt(0).toString(16)).slice(-2);
    });
}

// Validate all URLs in seed data
export async function validateSeedDataUrls(programs: any[], organizations: any[]): Promise<{
  validUrls: string[];
  invalidUrls: string[];
  unreachableUrls: string[];
}> {
  const urls = new Set<string>();
  const results = {
    validUrls: [] as string[],
    invalidUrls: [] as string[],
    unreachableUrls: [] as string[],
  };

  // Collect all URLs
  organizations.forEach((org) => {
    if (org.official_website) urls.add(org.official_website);
    if (org.contact?.email) urls.add(`mailto:${org.contact.email}`);
  });

  programs.forEach((prog) => {
    if (prog.registration_url) urls.add(prog.registration_url);
  });

  // Validate each URL
  for (const url of urls) {
    if (url.startsWith('mailto:')) {
      results.validUrls.push(url);
      continue;
    }

    if (!isValidUrl(url)) {
      results.invalidUrls.push(url);
      continue;
    }

    const isReachable = await checkUrlAvailable(url);
    if (isReachable) {
      results.validUrls.push(url);
    } else {
      results.unreachableUrls.push(url);
    }
  }

  return results;
}
