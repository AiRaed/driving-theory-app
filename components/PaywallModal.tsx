'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PaywallModalProps {
  isOpen: boolean;
  onClose?: () => void;
  freeQuestionsUsed: number;
}

export default function PaywallModal({ isOpen, onClose, freeQuestionsUsed }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Lock scroll and prevent interactions when modal is open
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Prevent Escape key from closing
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      window.addEventListener('keydown', handleEscape, { capture: true });

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleEscape, { capture: true });
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        // Display the exact server error message, or fallback to generic message
        const errorMessage = data.error || 'Payment configuration error';
        throw new Error(errorMessage);
      }

      if (data.url) {
        // Redirect to Stripe Checkout
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

  return (
    <>
      {/* Backdrop - non-clickable, blocks all interactions */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        style={{ pointerEvents: 'auto' }}
        onClick={(e) => {
          // Prevent closing on backdrop click
          e.preventDefault();
          e.stopPropagation();
        }}
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ pointerEvents: 'auto' }}
        onClick={(e) => {
          // Prevent clicks from propagating
          e.stopPropagation();
        }}
      >
        <div 
          className="relative w-full max-w-md rounded-2xl border border-red-100/60 bg-gradient-to-br from-red-50/50 via-white to-red-50/30 shadow-2xl overflow-hidden"
          style={{ pointerEvents: 'auto' }}
          tabIndex={-1}
          onClick={(e) => {
            // Allow clicks inside modal
            e.stopPropagation();
          }}
        >
          {/* Premium red top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
          {/* Teal secondary accent line */}
          <div className="absolute top-1.5 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-300/40 to-transparent"></div>

          <div className="p-6 sm:p-8">
            {/* Close button removed - modal is non-dismissible */}

            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔒</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Unlock Unlimited Practice
              </h2>
              <p className="text-sm text-slate-600">
                You've used {freeQuestionsUsed} of 15 free questions
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <div className="font-semibold text-slate-900">Unlimited Practice Questions</div>
                  <div className="text-sm text-slate-600">Access all {freeQuestionsUsed}+ questions</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <div className="font-semibold text-slate-900">All Topics Included</div>
                  <div className="text-sm text-slate-600">Practice across all 13 topics</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <div className="font-semibold text-slate-900">One-Time Payment</div>
                  <div className="text-sm text-slate-600">£9.99 - No recurring charges</div>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className={cn(
                "w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-base",
                "hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "active:scale-[0.98]"
              )}
            >
              {loading ? 'Processing...' : 'Continue to Payment - £9.99'}
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

