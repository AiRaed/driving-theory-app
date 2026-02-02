import { create } from 'zustand';

interface AccessState {
  loading: boolean;
  paid: boolean;
  freeUsed: number;
  refresh: () => Promise<void>;
  initialize: () => Promise<void>;
}

// App is now 100% free - no paywall, no access restrictions
export const useAccessStore = create<AccessState>(() => ({
  loading: false,
  paid: true, // Always true - app is free
  freeUsed: 0, // Not used anymore

  refresh: async () => {
    // No-op: app is free, no need to check access
  },
  
  initialize: async () => {
    // No-op: app is free, no need to initialize access
  },
}));

// Hook for React components
export function useAccess() {
  const store = useAccessStore();
  
  return {
    loading: false, // Always false - no loading needed
    paid: true, // Always true - app is free
    freeUsed: 0, // Not used anymore
    refresh: async () => {}, // No-op
  };
}

