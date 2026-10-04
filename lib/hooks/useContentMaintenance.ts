'use client';

import { useEffect, useState } from 'react';

/** Runtime check — Web and Capacitor WebViews share this endpoint. */
export async function fetchIsContentMaintenanceMode(): Promise<boolean> {
  try {
    const res = await fetch('/api/maintenance', {
      cache: 'no-store',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data?.content_maintenance === true;
  } catch {
    return false;
  }
}

/**
 * Runtime maintenance flag from the server (CONTENT_MAINTENANCE_MODE).
 * Shared by Web and Capacitor WebViews.
 */
export function useContentMaintenance(): {
  loading: boolean;
  enabled: boolean;
} {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchIsContentMaintenanceMode().then((on) => {
      if (!cancelled) {
        setEnabled(on);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { loading, enabled };
}
