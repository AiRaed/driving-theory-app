'use client';

import { useState, useEffect } from 'react';

interface PaywallStatus {
  loading: boolean;
  paid: boolean;
  trialUsed: number;
  trialLimit: number;
  refresh: () => Promise<void>;
}

/**
 * usePaywallStatus - SINGLE SOURCE OF TRUTH for paywall
 * Calls /api/paywall/status ONCE per session
 * Default state is LOCKED (paid=false) while loading
 * Only unlocks after confirmed paid=true
 * NEVER uses localStorage/sessionStorage
 */
export function usePaywallStatus(): PaywallStatus {
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [trialUsed, setTrialUsed] = useState(0);
  const [trialLimit, setTrialLimit] = useState(15);

  const refresh = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/paywall/status', {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not logged in - default to locked
          setPaid(false);
          setTrialUsed(0);
          setTrialLimit(15);
        }
        return;
      }

      const data = await response.json();
      
      // Only unlock after confirmed paid=true
      setPaid(data.paid === true);
      setTrialUsed(data.trialUsed || 0);
      setTrialLimit(data.trialLimit || 15);

      // Safe console logs in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[usePaywallStatus]', {
          paid: data.paid,
          trialUsed: data.trialUsed,
          trialLimit: data.trialLimit,
          status: 'ready',
        });
      }
    } catch (error) {
      console.error('[usePaywallStatus] Error:', error);
      // Default to locked on error
      setPaid(false);
      setTrialUsed(0);
      setTrialLimit(15);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ONCE per session - no persistence between reloads
  useEffect(() => {
    // Safe console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[usePaywallStatus]', {
        status: 'loading',
      });
    }
    refresh();
  }, []);

  return {
    loading,
    paid,
    trialUsed,
    trialLimit,
    refresh,
  };
}

