/**
 * Account-scoped client cache helpers.
 *
 * Authoritative learning/entitlement data lives in Supabase keyed by auth user_id.
 * localStorage/sessionStorage may only hold temporary UI convenience and must
 * never be the source of truth — and must not leak between LingoTheory accounts
 * on the same device.
 */

export const ACCOUNT_LOCAL_KEYS = {
  practiceLastIndex: 'theory_last_index_v1',
  mockSession: 'mock_session_v1',
} as const;

export const ACCOUNT_SESSION_KEYS = {
  practiceAnalytics: 'lt_practice_analytics_session',
  mockAnalytics: 'lt_mock_analytics_session',
} as const;

/** Build a storage key scoped to a LingoTheory user_id. */
export function accountScopedKey(userId: string, baseKey: string): string {
  return `lt:u:${userId}:${baseKey}`;
}

/**
 * Remove account-specific client caches.
 * - If userId provided: clear that user's scoped keys + legacy unscoped keys.
 * - Always clears analytics sessionStorage session ids (ephemeral).
 * Does NOT clear language / install UI preferences (device UX, not entitlement).
 */
export function clearAccountClientCache(userId?: string | null): void {
  if (typeof window === 'undefined') return;

  try {
    // Legacy unscoped keys (pre-account-scoping) — always remove to stop cross-account leaks.
    localStorage.removeItem(ACCOUNT_LOCAL_KEYS.practiceLastIndex);
    localStorage.removeItem(ACCOUNT_LOCAL_KEYS.mockSession);

    if (userId) {
      localStorage.removeItem(
        accountScopedKey(userId, ACCOUNT_LOCAL_KEYS.practiceLastIndex)
      );
      localStorage.removeItem(
        accountScopedKey(userId, ACCOUNT_LOCAL_KEYS.mockSession)
      );
    }

    sessionStorage.removeItem(ACCOUNT_SESSION_KEYS.practiceAnalytics);
    sessionStorage.removeItem(ACCOUNT_SESSION_KEYS.mockAnalytics);
  } catch {
    // ignore storage failures
  }
}

export function readAccountJson<T>(userId: string, baseKey: string): T | null {
  if (typeof window === 'undefined' || !userId) return null;
  try {
    const raw = localStorage.getItem(accountScopedKey(userId, baseKey));
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeAccountJson(
  userId: string,
  baseKey: string,
  value: unknown
): void {
  if (typeof window === 'undefined' || !userId) return;
  try {
    localStorage.setItem(
      accountScopedKey(userId, baseKey),
      JSON.stringify(value)
    );
  } catch {
    // ignore
  }
}

export function removeAccountKey(userId: string, baseKey: string): void {
  if (typeof window === 'undefined' || !userId) return;
  try {
    localStorage.removeItem(accountScopedKey(userId, baseKey));
  } catch {
    // ignore
  }
}
