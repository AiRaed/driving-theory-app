'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAccessStore } from '@/lib/stores/accessStore';

export default function AccessProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAccessStore((state: { initialize: () => Promise<void> }) => state.initialize);
  const supabase = createClient();

  useEffect(() => {
    // Initialize access store on app start
    initialize();

    // Re-initialize on auth state changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        console.log('[AccessProvider] Auth state changed:', event);
        initialize();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, supabase]);

  return <>{children}</>;
}

