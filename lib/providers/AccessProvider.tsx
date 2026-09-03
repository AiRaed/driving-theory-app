'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  failClosedAccessState,
} from '@/lib/access/entitlement';

interface AccessContextType {
  loading: boolean;
  /** True only after a successful /api/access/status response for the current session */
  statusConfirmed: boolean;
  paid: boolean;
  freeUsed: number;
  refresh: () => Promise<void>;
  silentRefresh: () => Promise<void>;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

/**
 * AccessProvider - client cache of server entitlement.
 * Authoritative source: profiles.access_level + profiles.free_questions_used via /api/access/status.
 *
 * Rules:
 * - paid === true ONLY when server returns paid === true
 * - API/network errors NEVER grant paid
 * - API/network errors NEVER reset freeUsed to 0 (that would unlock the free trial)
 * - Opening the app / login NEVER auto-promotes a user to paid (no silent store restore)
 */
export function AccessProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [statusConfirmed, setStatusConfirmed] = useState(false);
  const [paid, setPaid] = useState(false);
  const [freeUsed, setFreeUsed] = useState(0);
  const statusConfirmedRef = useRef(false);
  const freeUsedRef = useRef(0);
  const supabase = createClient();

  const applyFailClosed = () => {
    const closed = failClosedAccessState(
      freeUsedRef.current,
      statusConfirmedRef.current
    );
    setPaid(closed.paid);
    setFreeUsed(closed.freeUsed);
    freeUsedRef.current = closed.freeUsed;
    setStatusConfirmed(false);
    statusConfirmedRef.current = false;
  };

  const fetchAccessStatus = async (setLoadingState: boolean = true) => {
    const controller = new AbortController();
    const timeoutMs = 10_000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      if (setLoadingState) {
        setLoading(true);
      }

      const response = await fetch('/api/access/status', {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Logged out — clear account-specific state
          setPaid(false);
          setFreeUsed(0);
          freeUsedRef.current = 0;
          setStatusConfirmed(false);
          statusConfirmedRef.current = false;
          return false;
        }

        applyFailClosed();
        return false;
      }

      const data = await response.json();
      const nextPaid = data.paid === true;
      const nextFreeUsed =
        typeof data.free_questions_used === 'number'
          ? data.free_questions_used
          : 0;

      setPaid(nextPaid);
      setFreeUsed(nextFreeUsed);
      freeUsedRef.current = nextFreeUsed;
      setStatusConfirmed(true);
      statusConfirmedRef.current = true;
      return nextPaid;
    } catch (error) {
      console.error('[AccessProvider] Error:', error);
      applyFailClosed();
      return false;
    } finally {
      clearTimeout(timeoutId);
      if (setLoadingState) {
        setLoading(false);
      }
    }
  };

  const refresh = async () => {
    await fetchAccessStatus(true);
  };

  const silentRefresh = async () => {
    await fetchAccessStatus(false);
  };

  // Fetch on app load only — do NOT silent-restore store purchases here.
  // Store restore must be an explicit user action (Restore Purchases).
  useEffect(() => {
    void fetchAccessStatus(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch on auth state changes; clear stale account state on sign-out.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setPaid(false);
        setFreeUsed(0);
        freeUsedRef.current = 0;
        setStatusConfirmed(false);
        statusConfirmedRef.current = false;
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        void fetchAccessStatus(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  return (
    <AccessContext.Provider
      value={{ loading, statusConfirmed, paid, freeUsed, refresh, silentRefresh }}
    >
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
