'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

/**
 * Client-side admin visibility for UI only.
 * Uses GET /api/admin/me which enforces ADMIN_EMAIL server-side via requireAdminApi.
 * Never treat a visible Admin link as authorization — /admin routes remain protected.
 */
export function useIsAdmin(user: User | null | undefined): {
  isAdmin: boolean;
  ready: boolean;
} {
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setIsAdmin(false);
      setReady(true);
      return;
    }

    setReady(false);
    setIsAdmin(false);

    fetch('/api/admin/me')
      .then(async (res) => {
        if (!res.ok) return { isAdmin: false };
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setIsAdmin(!!data?.isAdmin);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAdmin(false);
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.email]);

  return { isAdmin, ready };
}
