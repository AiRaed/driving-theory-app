'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/** undefined while the session is loading, null when signed out, otherwise auth.uid(). */
export function useSessionUserId(): string | null | undefined {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return userId;
}
