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

  const fetchAccess = async (silent: boolean = false) => {
    try {
      // Only show loading state if not silent (for initial load)
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      // Use SINGLE SOURCE OF TRUTH: /api/access/status
      const response = await fetch('/api/access/status', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - user not logged in
          setStatus('locked');
          setError('Please log in to continue');
        } else {
          throw new Error('Failed to fetch access status');
        }
        return;
      }

      const data = await response.json();
      const paid = data.paid === true;
      const accessLevel = data.accessLevel || 'free';
      const freeQuestionsUsed = data.freeQuestionsUsed || 0;

      setFreeUsed(freeQuestionsUsed);

      // Determine status - access_level === 'paid' is the ONLY gate
      // If paid, always return 'paid' status regardless of free_questions_used
      if (paid && accessLevel === 'paid') {
        setStatus('paid');
      } else if (freeQuestionsUsed >= TRIAL_LIMIT) {
        setStatus('locked');
      } else {
        setStatus('trial');
      }
    } catch (err) {
      console.error('Error fetching access:', err);
      setError(err instanceof Error ? err.message : 'Couldn\'t verify access, please refresh');
      // Default to locked on error to be safe
      setStatus('locked');
    } finally {
      if (!silent) {
        setLoading(false);
      }
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
        fetchAccess(false); // Show loading on auth changes
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
      fetchAccess(true); // Silent refetch on focus
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAccess(true); // Silent refetch on visibility change
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
    refetch: () => fetchAccess(true), // Silent refetch to avoid loading screen
  };
}

