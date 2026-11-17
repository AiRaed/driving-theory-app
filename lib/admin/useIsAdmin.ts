'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

/**
 * Client-side admin visibility for UI only.
 * Uses GET /api/admin/me, which performs the server-side administrator check.
 * Never treat a visible Admin link as authorization — /admin routes remain protected.
 *
 * A user id is remembered only after that endpoint returns isAdmin: true, so a
 * cancelled in-flight check cannot leave the account menu blank for the rest of
 * the session. Remembering never compares emails in the browser.
 */
const confirmedAdminIds = new Set<string>();

export function useIsAdmin(user: User | null | undefined): {
  isAdmin: boolean;
  ready: boolean;
} {
  const userId = user?.id ?? null;
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      setReady(true);
      return;
    }

    let cancelled = false;
    const remembered = confirmedAdminIds.has(userId);
    setIsAdmin(remembered);
    setReady(remembered);

    fetch('/api/admin/me', { cache: 'no-store', credentials: 'same-origin' })
      .then(async (res) => {
        if (!res.ok) return { isAdmin: false };
        return res.json().catch(() => ({ isAdmin: false }));
      })
      .then((data: { isAdmin?: boolean }) => {
        const allowed = data?.isAdmin === true;
        if (allowed) confirmedAdminIds.add(userId);
        else confirmedAdminIds.delete(userId);
        if (!cancelled) {
          setIsAdmin(allowed);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAdmin(confirmedAdminIds.has(userId));
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { isAdmin, ready };
}
