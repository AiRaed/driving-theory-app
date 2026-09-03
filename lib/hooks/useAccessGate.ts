'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  FREE_QUESTION_LIMIT,
  decidePracticeAccess,
  failClosedAccessState,
} from '@/lib/access/entitlement';

export type AccessStatus = 'paid' | 'trial' | 'locked';

export interface AccessGate {
  status: AccessStatus;
  freeUsed: number;
  trialLimit: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Legacy gate hook — same /api/access/status contract as AccessProvider.
 */
export function useAccessGate(): AccessGate {
  const [status, setStatus] = useState<AccessStatus>('locked');
  const [freeUsed, setFreeUsed] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusConfirmed, setStatusConfirmed] = useState(false);
  const supabase = createClient();

  const fetchAccess = async (silent: boolean = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      const response = await fetch('/api/access/status', {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        setStatusConfirmed(false);
        if (response.status === 401) {
          setStatus('locked');
          setFreeUsed(0);
          setError('Please log in to continue');
        } else {
          const closed = failClosedAccessState(freeUsed, statusConfirmed);
          setFreeUsed(closed.freeUsed);
          setStatus('locked');
          setError('Failed to fetch access status');
        }
        return;
      }

      const data = await response.json();
      const paid = data.paid === true;
      const freeQuestionsUsed =
        typeof data.free_questions_used === 'number'
          ? data.free_questions_used
          : 0;

      setFreeUsed(freeQuestionsUsed);
      setStatusConfirmed(true);

      const decision = decidePracticeAccess({
        paid,
        freeQuestionsUsed,
        statusConfirmed: true,
      });
      if (decision.paid) {
        setStatus('paid');
      } else if (decision.showPaywall) {
        setStatus('locked');
      } else if (decision.allow) {
        setStatus('trial');
      } else {
        setStatus('locked');
      }
    } catch (err) {
      console.error('Error fetching access:', err);
      setStatusConfirmed(false);
      setError(err instanceof Error ? err.message : "Couldn't verify access, please refresh");
      const closed = failClosedAccessState(freeUsed, statusConfirmed);
      setFreeUsed(closed.freeUsed);
      setStatus('locked');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setStatus('locked');
        setFreeUsed(0);
        setStatusConfirmed(false);
        setLoading(false);
        return;
      }
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (event === 'SIGNED_IN') {
          setStatusConfirmed(false);
          setFreeUsed(0);
          setStatus('locked');
        }
        fetchAccess(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    status,
    freeUsed,
    trialLimit: FREE_QUESTION_LIMIT,
    loading,
    error,
    refetch: () => fetchAccess(true),
  };
}
