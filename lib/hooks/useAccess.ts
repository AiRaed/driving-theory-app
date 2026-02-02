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

      // Use SINGLE SOURCE OF TRUTH: /api/access/status
      const response = await fetch('/api/access/status', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - user not logged in
          setIsPaid(false);
          setFreeUsed(0);
          setError('Please log in to continue');
        } else {
          throw new Error('Failed to fetch access status');
        }
        return;
      }

      const data = await response.json();
      setIsPaid(data.paid === true && data.accessLevel === 'paid');
      setFreeUsed(data.freeQuestionsUsed || 0);
    } catch (err) {
      console.error('Error fetching access:', err);
      setError(err instanceof Error ? err.message : 'Couldn\'t verify access, please refresh');
      // Default to not paid on error
      setIsPaid(false);
      setFreeUsed(0);
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

