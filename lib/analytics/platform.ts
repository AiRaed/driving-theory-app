/**
 * Runtime app platform (where the user opens LingoTheory).
 * Distinct from payments.provider (stripe / apple / google_play).
 */
import { Capacitor } from '@capacitor/core';

export type RuntimePlatform = 'ios' | 'android' | 'web';

const ALLOWED = new Set<RuntimePlatform>(['ios', 'android', 'web']);

/** Normalize any client/server value to ios|android|web, or null if invalid. */
export function normalizeRuntimePlatform(raw: unknown): RuntimePlatform | null {
  if (typeof raw !== 'string') return null;
  const v = raw.trim().toLowerCase();
  if (ALLOWED.has(v as RuntimePlatform)) {
    return v as RuntimePlatform;
  }
  return null;
}

/**
 * Client-oriented: Capacitor.getPlatform() → ios | android | web.
 * On SSR / missing Capacitor → 'web'. Never throws.
 */
export function getClientRuntimePlatform(): RuntimePlatform {
  if (typeof window === 'undefined') {
    return 'web';
  }
  try {
    return normalizeRuntimePlatform(Capacitor.getPlatform()) ?? 'web';
  } catch {
    return 'web';
  }
}

export function platformDisplayLabel(platform: string | null | undefined): string {
  switch (platform) {
    case 'ios':
      return 'iOS';
    case 'android':
      return 'Android';
    case 'web':
      return 'Web';
    default:
      return '—';
  }
}

/**
 * Admin cell: primary = last platform; secondary = all platforms_used when multi.
 */
export function formatPlatformsForAdmin(
  lastPlatform: string | null | undefined,
  platformsUsed: string[] | null | undefined
): { primary: string; all: string | null } {
  const used = Array.isArray(platformsUsed)
    ? platformsUsed
        .map((p) => normalizeRuntimePlatform(p))
        .filter((p): p is RuntimePlatform => p != null)
    : [];
  const last = normalizeRuntimePlatform(lastPlatform);

  if (!last && used.length === 0) {
    return { primary: '—', all: null };
  }

  const ordered: RuntimePlatform[] = last
    ? [last, ...used.filter((p) => p !== last)]
    : used;

  const labels = ordered.map((p) => platformDisplayLabel(p));
  const primary = platformDisplayLabel(last ?? ordered[0]);
  const all = labels.length > 1 ? labels.join(' + ') : null;
  return { primary, all };
}
