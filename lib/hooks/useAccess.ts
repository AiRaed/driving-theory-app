'use client';

import { useState, useEffect } from 'react';

interface Access {
  isPaid: boolean;
  freeUsed: number;
  refreshProfile: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to access user's payment status and free question usage
 * Returns isPaid boolean, freeUsed count, and refreshProfile function
 */
export function useAccess(): Access {
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [freeUsed, setFreeUsed] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/practice/check-access');
      
      if (!response.ok) {
        throw new Error('Failed to fetch access status');
      }

      const data = await response.json();
      setIsPaid(data.access_level === 'paid');
      setFreeUsed(data.free_questions_used || 0);
    } catch (err) {
      console.error('Error fetching access:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch access status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return {
    isPaid,
    freeUsed,
    refreshProfile,
    loading,
    error,
  };
}

