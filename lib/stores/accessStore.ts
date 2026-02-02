import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface AccessState {
  loading: boolean;
  paid: boolean;
  freeUsed: number;
  lastFetch: number | null;
  refresh: () => Promise<void>;
  initialize: () => Promise<void>;
}

const THROTTLE_MS = 60000; // 60 seconds

export const useAccessStore = create<AccessState>((set, get) => ({
  loading: false,
  paid: false,
  freeUsed: 0,
  lastFetch: null,

  refresh: async () => {
    const state = get();
    const now = Date.now();

    // Throttle: don't fetch if last fetch was less than 60s ago
    if (state.lastFetch && now - state.lastFetch < THROTTLE_MS) {
      console.log('[AccessStore] Throttled: skipping fetch (last fetch was', Math.round((now - state.lastFetch) / 1000), 's ago)');
      return;
    }

    // Check if user is authenticated first
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('[AccessStore] No user, resetting to default');
      set({ loading: false, paid: false, freeUsed: 0, lastFetch: now });
      return;
    }

    try {
      set({ loading: true });
      console.log('[AccessStore] Fetching access status...');

      const response = await fetch('/api/access/status', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('[AccessStore] Unauthorized, resetting to default');
          set({ loading: false, paid: false, freeUsed: 0, lastFetch: now });
          return;
        }
        throw new Error('Failed to fetch access status');
      }

      const data = await response.json();
      const paid = data.paid === true && data.accessLevel === 'paid';
      const freeUsed = data.freeQuestionsUsed || 0;

      console.log('[AccessStore] Access status updated:', { paid, freeUsed, accessLevel: data.accessLevel });
      
      set({
        loading: false,
        paid,
        freeUsed,
        lastFetch: now,
      });
    } catch (err) {
      console.error('[AccessStore] Error fetching access:', err);
      set({ loading: false, paid: false, freeUsed: 0, lastFetch: now });
    }
  },

  initialize: async () => {
    const state = get();
    
    // Only initialize if not already initialized recently
    if (state.lastFetch === null) {
      console.log('[AccessStore] Initializing...');
      await get().refresh();
    } else {
      console.log('[AccessStore] Already initialized, skipping');
    }
  },
}));

// Hook for React components
export function useAccess() {
  const store = useAccessStore();
  
  return {
    loading: store.loading,
    paid: store.paid,
    freeUsed: store.freeUsed,
    refresh: store.refresh,
  };
}

