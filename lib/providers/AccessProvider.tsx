'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessContextType {
  loading: boolean;
  paid: boolean;
  freeUsed: number;
  refresh: (silent?: boolean) => Promise<void>;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

export function AccessProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [freeUsed, setFreeUsed] = useState(0);

  const refresh = async (silent: boolean = false) => {
    try {
      // Only show loading on initial load, not on silent refreshes
      if (!silent) {
        setLoading(true);
      }
      const response = await fetch('/api/access/status', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not logged in
          setPaid(false);
          setFreeUsed(0);
        } else {
          console.error('[AccessProvider] Failed to fetch access status');
        }
        return;
      }

      const data = await response.json();
      setPaid(data.paid === true && data.accessLevel === 'paid');
      setFreeUsed(data.freeQuestionsUsed || 0);
    } catch (error) {
      console.error('[AccessProvider] Error fetching access:', error);
      setPaid(false);
      setFreeUsed(0);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    refresh();
  }, []);

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

