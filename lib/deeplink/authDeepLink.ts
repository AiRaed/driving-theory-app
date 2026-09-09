const AUTH_HOSTS = new Set(['lingotheory.org', 'www.lingotheory.org']);

/**
 * Return path + query + hash for a LingoTheory /auth/ Universal or App Link.
 * Returns null when the URL should be ignored.
 */
export function authDeepLinkTarget(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();
    if (!AUTH_HOSTS.has(host)) {
      return null;
    }
    if (!url.pathname.startsWith('/auth/')) {
      return null;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function currentLocationKey(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}
