'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export type AccessStatus = 'paid' | 'trial' | 'locked';

export interface AccessGate {
  status: AccessStatus;
  freeUsed: number;
  trialLimit: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const TRIAL_LIMIT = 15;

export function useAccessGate(): AccessGate {
  const [status, setStatus] = useState<AccessStatus>('trial');
  const [freeUsed, setFreeUsed] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/practice/check-access');
      
      if (!response.ok) {
        throw new Error('Failed to fetch access status');
      }

      const data = await response.json();
      const accessLevel = data.access_level || 'free';
      const freeQuestionsUsed = data.free_questions_used || 0;

      setFreeUsed(freeQuestionsUsed);

      // Determine status
      if (accessLevel === 'paid') {
        setStatus('paid');
      } else if (freeQuestionsUsed >= TRIAL_LIMIT) {
        setStatus('locked');
      } else {
        setStatus('trial');
      }
    } catch (err) {
      console.error('Error fetching access:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch access status');
      // Default to locked on error to be safe
      setStatus('locked');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAccess();
  }, []);

  // Re-check access on auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        fetchAccess();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-check access when window regains focus (e.g., returning from Stripe checkout)
  useEffect(() => {
    const handleFocus = () => {
      fetchAccess();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAccess();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    status,
    freeUsed,
    trialLimit: TRIAL_LIMIT,
    loading,
    error,
    refetch: fetchAccess,
  };
}

