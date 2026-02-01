'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UserAccess {
  access_level: 'free' | 'paid';
  free_questions_used: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserAccess(): UserAccess {
  const [access_level, setAccessLevel] = useState<'free' | 'paid'>('free');
  const [free_questions_used, setFreeQuestionsUsed] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/practice/check-access');
      
      if (!response.ok) {
        throw new Error('Failed to fetch access status');
      }

      const data = await response.json();
      setAccessLevel(data.access_level || 'free');
      setFreeQuestionsUsed(data.free_questions_used || 0);
    } catch (err) {
      console.error('Error fetching access:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch access status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccess();
  }, []);

  return {
    access_level,
    free_questions_used,
    loading,
    error,
    refetch: fetchAccess,
  };
}

