'use client';

import { useState, useEffect, useRef } from 'react';

interface PaywallStatus {
  loading: boolean;
  paid: boolean;
  trialUsed: number;
  trialLimit: number;
  refresh: (silent?: boolean) => Promise<void>;
}

/**
 * usePaywallStatus - SINGLE SOURCE OF TRUTH for paywall
 * Calls /api/paywall/status ONCE per session
 * Default state is LOCKED (paid=false) while loading
 * Only unlocks after confirmed paid=true
 * NEVER uses localStorage/sessionStorage
 * Keeps stable state during refresh to prevent flicker
 */
export function usePaywallStatus(): PaywallStatus {
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [trialUsed, setTrialUsed] = useState(0);
  const [trialLimit, setTrialLimit] = useState(15);
  
  // Keep stable state during refresh to prevent flicker
  const stablePaid = useRef(false);
  const stableTrialUsed = useRef(0);
  const stableTrialLimit = useRef(15);

  const refresh = async (silent: boolean = false) => {
    try {
      // While access is loading/refetching, DO NOT show paywall
      // Keep previous stable access state until the fetch completes
      // Only set loading=true on initial load, not on silent refreshes
      if (!silent) {
        setLoading(true);
      }
      
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
        if (!silent) {
          setLoading(false);
        }
        return;
      }

      const data = await response.json();
      
      // Only update state after fetch completes - prevents flicker
      // Update stable refs first, then state atomically
      const newPaid = data.paid === true;
      const newTrialUsed = data.trialUsed || 0;
      const newTrialLimit = data.trialLimit || 15;
      
      // Update stable refs
      stablePaid.current = newPaid;
      stableTrialUsed.current = newTrialUsed;
      stableTrialLimit.current = newTrialLimit;
      
      // Update state atomically to prevent intermediate states
      setPaid(newPaid);
      setTrialUsed(newTrialUsed);
      setTrialLimit(newTrialLimit);

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
      // Default to locked on error - but keep previous state if silent refresh
      if (!silent) {
        setPaid(false);
        setTrialUsed(0);
        setTrialLimit(15);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  // Initialize stable refs
  useEffect(() => {
    stablePaid.current = paid;
    stableTrialUsed.current = trialUsed;
    stableTrialLimit.current = trialLimit;
  }, [paid, trialUsed, trialLimit]);

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

