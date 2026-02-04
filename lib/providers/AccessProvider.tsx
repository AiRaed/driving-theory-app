'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

interface AccessContextType {
  loading: boolean;
  paid: boolean;
  freeUsed: number;
  refresh: () => Promise<void>;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

/**
 * AccessProvider - SINGLE SOURCE OF TRUTH for access state
 * Fetches /api/access/status on load and on auth state changes
 * NO localStorage, NO caching, NO assumptions
 * paid === true ONLY when profiles.access_level === 'paid'
 * freeUsed comes from profiles.free_questions_used
 */
export function AccessProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [freeUsed, setFreeUsed] = useState(0);
  const supabase = createClient();

  const refresh = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/access/status', {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not logged in - default to unpaid
          setPaid(false);
          setFreeUsed(0);
        }
        return;
      }

      const data = await response.json();
      // paid === true ONLY when profiles.access_level === 'paid'
      // freeUsed comes from profiles.free_questions_used
      setPaid(data.paid === true);
      setFreeUsed(data.free_questions_used || 0);
    } catch (error) {
      console.error('[AccessProvider] Error:', error);
      // Default to unpaid on error
      setPaid(false);
      setFreeUsed(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on app load
  useEffect(() => {
    refresh();
  }, []);

  // Re-fetch on auth state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AccessContext.Provider value={{ loading, paid, freeUsed, refresh }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  const context = useContext(AccessContext);
  if (context === undefined) {
    throw new Error('useAccess must be used within AccessProvider');
  }
  return context;
}

