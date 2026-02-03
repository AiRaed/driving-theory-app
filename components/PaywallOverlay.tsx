'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * PaywallOverlay - ONE component only
 * Full screen overlay with backdrop blur
 * ONE button: "Continue to Payment – £9.99"
 * NO "Maybe later", NO free option
 */
export default function PaywallOverlay() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop - blocks everything behind */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
        style={{
          pointerEvents: 'auto',
          touchAction: 'none',
          userSelect: 'none',
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
      
      {/* Overlay Content */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{
          pointerEvents: 'auto',
        }}
      >
        <div
          className="relative w-full max-w-md rounded-2xl border border-red-100/60 bg-gradient-to-br from-red-50/50 via-white to-red-50/30 shadow-2xl overflow-hidden"
          style={{
            pointerEvents: 'auto',
          }}
        >
          {/* Premium red top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
          {/* Teal secondary accent line */}
          <div className="absolute top-1.5 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-300/40 to-transparent"></div>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔒</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Unlock Full Access
              </h2>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <div className="font-semibold text-slate-900">Unlimited Practice Questions</div>
                  <div className="text-sm text-slate-600">Access all questions across all topics</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <div className="font-semibold text-slate-900">All Topics Included</div>
                  <div className="text-sm text-slate-600">Practice across all topics</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <div className="font-semibold text-slate-900">Mock Test Access</div>
                  <div className="text-sm text-slate-600">Take unlimited mock tests</div>
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

            {/* ONE button only */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className={cn(
                "w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-base",
                "hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "active:scale-[0.98]"
              )}
            >
              {loading ? 'Processing...' : 'Continue to Payment – £9.99'}
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

