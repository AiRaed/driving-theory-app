'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAccess } from '@/lib/providers/AccessProvider';
import { isAccountDiagnosticsEnabled } from '@/lib/account/diagnosticsEnabled';
import {
  isCapacitorAndroid,
  isCapacitorWebView,
  isIOSDevice,
} from '@/lib/utils/platform';

type DiagnosticsPayload = {
  user_id: string;
  email: string | null;
  access_level: string;
  paid: boolean;
  free_questions_used: number;
  paid_at: string | null;
  counts: {
    question_attempts: number;
    practice_attempts: number;
    mock_attempts: number;
    learning_sessions: number;
    payments: number;
  };
  learning_stats: Record<string, unknown> | null;
  server_node_env: string | undefined;
};

function clientPlatform(): 'ios' | 'android' | 'web' {
  if (typeof window === 'undefined') return 'web';
  if (isCapacitorAndroid()) return 'android';
  if (isCapacitorWebView() && isIOSDevice()) return 'ios';
  if (isIOSDevice() && isCapacitorWebView()) return 'ios';
  try {
    const cap = (window as unknown as { Capacitor?: { getPlatform?: () => string } })
      .Capacitor;
    if (cap?.getPlatform?.() === 'ios') return 'ios';
  } catch {
    // ignore
  }
  return 'web';
}

/**
 * DEVELOPMENT-ONLY account diagnostic view.
 * Hidden in production unless NEXT_PUBLIC_ENABLE_ACCOUNT_DIAGNOSTICS=true.
 */
export default function AccountStatusDevPage() {
  const enabled = isAccountDiagnosticsEnabled();
  const { loading, statusConfirmed, paid, freeUsed, refresh } = useAccess();
  const [data, setData] = useState<DiagnosticsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const load = useCallback(async () => {
    if (!enabled) return;
    setFetching(true);
    setError(null);
    try {
      const res = await fetch('/api/dev/account-diagnostics', {
        cache: 'no-store',
        credentials: 'include',
      });
      if (res.status === 404) {
        setError('Diagnostics disabled');
        setData(null);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || `HTTP ${res.status}`);
        setData(null);
        return;
      }
      setData((await res.json()) as DiagnosticsPayload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setData(null);
    } finally {
      setFetching(false);
    }
  }, [enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!enabled) {
    return (
      <main style={{ padding: 24, fontFamily: 'monospace' }}>
        <p>Not found</p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 13,
        lineHeight: 1.5,
        maxWidth: 720,
      }}
    >
      <h1 style={{ fontSize: 18, marginBottom: 8 }}>
        Account diagnostics (dev)
      </h1>
      <p style={{ marginBottom: 16, opacity: 0.7 }}>
        No receipts, tokens, or secrets. Server is authoritative for entitlement
        and free_questions_used.
      </p>

      <section style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 14 }}>Client AccessProvider</h2>
        <pre>
          {JSON.stringify(
            {
              loading,
              statusConfirmed,
              paid,
              freeUsed,
              platform: clientPlatform(),
            },
            null,
            2
          )}
        </pre>
        <button type="button" onClick={() => void refresh()} style={{ marginRight: 8 }}>
          Refresh access
        </button>
        <button type="button" onClick={() => void load()} disabled={fetching}>
          {fetching ? 'Loading…' : 'Reload diagnostics'}
        </button>
      </section>

      {error && (
        <p style={{ color: '#b91c1c', marginBottom: 12 }}>Error: {error}</p>
      )}

      {data && (
        <section>
          <h2 style={{ fontSize: 14 }}>Server (authenticated user_id)</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}
