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
import { failClosedAccessState } from '@/lib/access/entitlement';
import { clearAccountClientCache } from '@/lib/account/clientAccountStorage';

interface AccessContextType {
  loading: boolean;
  /** True only after a successful /api/access/status for the current account */
  statusConfirmed: boolean;
  paid: boolean;
  freeUsed: number;
  refresh: () => Promise<void>;
  silentRefresh: () => Promise<void>;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

function clearAccountState(
  setPaid: (v: boolean) => void,
  setFreeUsed: (v: number) => void,
  setStatusConfirmed: (v: boolean) => void,
  freeUsedRef: { current: number },
  statusConfirmedRef: { current: boolean }
) {
  setPaid(false);
  setFreeUsed(0);
  freeUsedRef.current = 0;
  setStatusConfirmed(false);
  statusConfirmedRef.current = false;
}

/**
 * Client cache of server entitlement for the authenticated LingoTheory account.
 *
 * Authoritative: profiles.access_level + profiles.free_questions_used via /api/access/status
 * Never grants paid on errors. Never resets freeUsed to 0 on errors.
 * Never auto-restores Apple/Google store purchases.
 */
export function AccessProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [statusConfirmed, setStatusConfirmed] = useState(false);
  const [paid, setPaid] = useState(false);
  const [freeUsed, setFreeUsed] = useState(0);
  const statusConfirmedRef = useRef(false);
  const freeUsedRef = useRef(0);
  const lastUserIdRef = useRef<string | null>(null);
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
          clearAccountState(
            setPaid,
            setFreeUsed,
            setStatusConfirmed,
            freeUsedRef,
            statusConfirmedRef
          );
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

  useEffect(() => {
    void fetchAccessStatus(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUserId = session?.user?.id ?? null;

      if (event === 'SIGNED_OUT') {
        clearAccountClientCache(lastUserIdRef.current);
        clearAccountClientCache(null);
        lastUserIdRef.current = null;
        clearAccountState(
          setPaid,
          setFreeUsed,
          setStatusConfirmed,
          freeUsedRef,
          statusConfirmedRef
        );
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN') {
        // Drop previous account entitlement + device caches BEFORE hydrating B.
        if (
          lastUserIdRef.current &&
          nextUserId &&
          lastUserIdRef.current !== nextUserId
        ) {
          clearAccountClientCache(lastUserIdRef.current);
        }
        // Always clear legacy unscoped keys + analytics session ids on sign-in.
        clearAccountClientCache(null);
        clearAccountState(
          setPaid,
          setFreeUsed,
          setStatusConfirmed,
          freeUsedRef,
          statusConfirmedRef
        );
        lastUserIdRef.current = nextUserId;
        void fetchAccessStatus(true);
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        if (nextUserId) {
          lastUserIdRef.current = nextUserId;
        }
        void fetchAccessStatus(false);
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
