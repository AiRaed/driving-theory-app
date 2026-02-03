'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessContextType {
  loading: boolean;
  paid: boolean;
  free_questions_used: number;
  refresh: () => Promise<void>;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

/**
 * AccessProvider - SINGLE SOURCE OF TRUTH
 * Fetches /api/access/status ONCE on app load
 * NO localStorage, NO caching, NO assumptions
 * All payment state comes from Supabase profiles table
 */
export function AccessProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [free_questions_used, setFreeQuestionsUsed] = useState(0);

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
          setPaid(false);
          setFreeQuestionsUsed(0);
        }
        return;
      }

      const data = await response.json();
      // paid === true ONLY when profiles.access_level === 'paid'
      // free_questions_used comes from profiles.free_questions_used
      setPaid(data.paid === true);
      setFreeQuestionsUsed(data.free_questions_used || 0);
    } catch (error) {
      console.error('[AccessProvider] Error:', error);
      setPaid(false);
      setFreeQuestionsUsed(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ONCE on app load - no persistence between reloads
  useEffect(() => {
    refresh();
  }, []);

  return (
    <AccessContext.Provider value={{ loading, paid, free_questions_used, refresh }}>
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

