'use client';

import { useState, useEffect } from 'react';

interface PaywallStatus {
  loading: boolean;
  paid: boolean;
  trialUsed: number;
  trialLimit: number;
  hydrated: boolean;
  refresh: () => Promise<void>;
}

/**
 * usePaywallStatus - SINGLE SOURCE OF TRUTH for paywall
 * Calls /api/paywall/status ONCE per session
 * hydrated flag ensures paywall NEVER renders until first successful fetch
 * NEVER uses localStorage/sessionStorage
 */
export function usePaywallStatus(): PaywallStatus {
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [trialUsed, setTrialUsed] = useState(0);
  const [trialLimit, setTrialLimit] = useState(15);
  const [hydrated, setHydrated] = useState(false);

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
          // Not logged in - default to locked but don't set hydrated
          setPaid(false);
          setTrialUsed(0);
          setTrialLimit(15);
          // DO NOT set hydrated=true on error - prevents paywall from showing
        }
        return;
      }

      const data = await response.json();
      
      // Normalize freeUsed: if null/undefined from DB => 0
      const normalizedTrialUsed = data.trialUsed ?? 0;
      const normalizedTrialLimit = data.trialLimit ?? 15;
      
      // Only unlock after confirmed paid=true
      setPaid(data.paid === true);
      setTrialUsed(normalizedTrialUsed);
      setTrialLimit(normalizedTrialLimit);
      
      // Set hydrated=true ONLY after successful fetch
      setHydrated(true);

      // Safe console logs in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[usePaywallStatus]', {
          paid: data.paid,
          trialUsed: normalizedTrialUsed,
          trialLimit: normalizedTrialLimit,
          hydrated: true,
          status: 'ready',
        });
      }
    } catch (error) {
      console.error('[usePaywallStatus] Error:', error);
      // Default to locked on error - DO NOT set hydrated=true
      // This prevents paywall from showing on error
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
        hydrated: false,
      });
    }
    refresh();
  }, []);

  return {
    loading,
    paid,
    trialUsed,
    trialLimit,
    hydrated,
    refresh,
  };
}

