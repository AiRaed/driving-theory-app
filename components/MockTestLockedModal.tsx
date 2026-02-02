'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAccess } from '@/lib/hooks/useAccess';

interface MockTestLockedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MockTestLockedModal({ isOpen, onClose }: MockTestLockedModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshProfile } = useAccess();

  if (!isOpen) return null;

  const handleTryPractice = async () => {
    onClose();
    await refreshProfile();
    router.push('/practice');
  };

  const handleUnlockAccess = async () => {
    setLoading(true);
    setError(null);

    try {
      // First, check if user is already paid (SINGLE SOURCE OF TRUTH)
      const statusResponse = await fetch('/api/access/status', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        if (statusData.paid === true && statusData.accessLevel === 'paid') {
          // User is already paid, don't call checkout
          setError('User already has paid access');
          setLoading(false);
          // Close modal and refresh
          onClose();
          router.refresh();
          return;
        }
      }

      // User is not paid, proceed with checkout
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Payment configuration error';
        throw new Error(errorMessage);
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        // Profile will be refreshed after payment success on payment/success page
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  const handleMaybeLater = async () => {
    onClose();
    await refreshProfile();
    router.push('/practice');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-2xl border border-red-100/60 bg-gradient-to-br from-red-50/50 via-white to-red-50/30 shadow-2xl overflow-hidden">
          {/* Premium red top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
          {/* Teal secondary accent line */}
          <div className="absolute top-1.5 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-300/40 to-transparent"></div>

          <div className="p-6 sm:p-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔒</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Mock Test is locked
              </h2>
              <p className="text-sm text-slate-600">
                Try Practice for free (15 questions) or unlock full access.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              {/* Primary: Try Practice (Free) */}
              <button
                onClick={handleTryPractice}
                className={cn(
                  "w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-base",
                  "hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl",
                  "active:scale-[0.98]"
                )}
              >
                Try Practice (Free)
              </button>

              {/* Secondary: Unlock Full Access */}
              <button
                onClick={handleUnlockAccess}
                disabled={loading}
                className={cn(
                  "w-full py-3.5 rounded-xl border-2 border-red-600 bg-white text-red-700 font-semibold text-base",
                  "hover:bg-red-50 transition-all duration-200 shadow-md hover:shadow-lg",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "active:scale-[0.98]"
                )}
              >
                {loading ? 'Processing...' : 'Unlock Full Access – £9.99'}
              </button>

              {/* Optional: Maybe later */}
              <button
                onClick={handleMaybeLater}
                className={cn(
                  "w-full py-2.5 rounded-xl text-slate-600 font-medium text-sm",
                  "hover:bg-slate-50 transition-all duration-200",
                  "active:scale-[0.98]"
                )}
              >
                Maybe later
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center mt-4">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

