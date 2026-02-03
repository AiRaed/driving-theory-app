'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessContextType {
  loading: boolean;
  paid: boolean;
  refresh: () => Promise<void>;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

/**
 * AccessProvider - SINGLE SOURCE OF TRUTH
 * Fetches /api/access/status ONCE on app load
 * NO localStorage, NO caching, NO assumptions
 */
export function AccessProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);

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
        }
        return;
      }

      const data = await response.json();
      // paid === true ONLY when profiles.access_level === 'paid'
      setPaid(data.paid === true);
    } catch (error) {
      console.error('[AccessProvider] Error:', error);
      setPaid(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ONCE on app load - no persistence between reloads
  useEffect(() => {
    refresh();
  }, []);

  return (
    <AccessContext.Provider value={{ loading, paid, refresh }}>
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

