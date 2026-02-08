'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { cn } from '@/lib/utils';
import { useAccess } from '@/lib/providers/AccessProvider';

interface PaywallOverlayProps {
  onPay?: () => void;
  loading?: boolean;
}

/**
 * PaywallOverlay - Supports both Stripe (web) and Google Play (Android)
 * Full screen overlay with backdrop blur
 * Web: "Continue to Payment – £9.99" (Stripe)
 * Android: "Unlock with Google Play" (Google Play Billing)
 * NO "Maybe later", NO free option
 * Does NOT disappear unless parent stops rendering it (when paid becomes true)
 */
export default function PaywallOverlay({ onPay, loading: externalLoading }: PaywallOverlayProps = {}) {
  const [loading, setLoading] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const router = useRouter();
  const { refresh } = useAccess();

  // Detect platform on mount
  useEffect(() => {
    setIsAndroid(Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android');
  }, []);

  const handleGooglePlayPurchase = async () => {
    setLoading(true);
    try {
      // Get PlayBilling plugin from Capacitor
      const PlayBilling = (window as any).Capacitor?.Plugins?.PlayBilling;
      if (!PlayBilling) {
        throw new Error('PlayBilling plugin not available');
      }

      // Initialize billing client
      await PlayBilling.init();

      // Get product ID (default to 'full_access')
      const productId = process.env.NEXT_PUBLIC_GOOGLE_PRODUCT_ID || 'full_access';

      // Launch purchase flow
      const purchaseResult = await PlayBilling.purchase({ productId });

      if (!purchaseResult || !purchaseResult.purchaseToken) {
        throw new Error('Purchase failed or incomplete');
      }

      // Verify purchase with server
      const verifyResponse = await fetch('/api/billing/google/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: purchaseResult.productId || productId,
          purchaseToken: purchaseResult.purchaseToken,
          platform: 'android',
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Failed to verify purchase');
      }

      // Refresh access status from Supabase
      await refresh();
      
      // Paywall will disappear when paid becomes true
      // No need to redirect - state update will handle it
    } catch (error) {
      console.error('Google Play purchase error:', error);
      alert(error instanceof Error ? error.message : 'Failed to complete purchase. Please try again.');
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // If user is already paid, refresh access and redirect to dashboard (no alert, no error)
      if (data.alreadyPaid === true) {
        // Refresh access status from Supabase to update paid state
        await refresh();
        // Redirect to dashboard - paywall will disappear when paid becomes true
        router.push('/dashboard');
        return;
      }

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
      // Only show alert for actual errors, not for alreadyPaid case
      alert(error instanceof Error ? error.message : 'Failed to start payment. Please try again.');
      setLoading(false);
    }
  };

  const handlePayment = onPay || (isAndroid ? handleGooglePlayPurchase : handleStripePayment);

  const isLoading = loading || externalLoading;

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

            {/* ONE button only - different text for Android vs Web */}
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className={cn(
                "w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-base",
                "hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "active:scale-[0.98]"
              )}
            >
              {isLoading 
                ? 'Processing...' 
                : isAndroid 
                  ? 'Buy on Google Play – £9.99' 
                  : 'Continue to Payment – £9.99'}
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              {isAndroid 
                ? 'Secure payment powered by Google Play' 
                : 'Secure payment powered by Stripe'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

