'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { cn } from '@/lib/utils';
import { useAccess } from '@/lib/providers/AccessProvider';
import { trackEvent } from '@/lib/analytics/trackEvent';
import {
  fetchAppleFullAccessPrice,
  purchaseAppleFullAccess,
  restoreAppleFullAccess,
} from '@/lib/billing/appleIap';
import { APPLE_FULL_ACCESS_FALLBACK_PRICE } from '@/lib/billing/appleProduct';

interface PaywallOverlayProps {
  onPay?: () => void;
  loading?: boolean;
}

type NativePlatform = 'web' | 'android' | 'ios';

/**
 * PaywallOverlay - Stripe (web), Google Play (Android), Apple IAP (iOS)
 * Full screen overlay with backdrop blur
 * Web: "Continue to Payment — £4.99" (Stripe)
 * Android: "Buy on Google Play – £9.99" (Google Play Billing)
 * iOS: "Unlock Full Access — {App Store price}" + Restore Purchases (StoreKit)
 * NO "Maybe later", NO free option
 * Does NOT disappear unless parent stops rendering it (when paid becomes true)
 */
export default function PaywallOverlay({ onPay, loading: externalLoading }: PaywallOverlayProps = {}) {
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [platform, setPlatform] = useState<NativePlatform>('web');
  const [applePrice, setApplePrice] = useState(APPLE_FULL_ACCESS_FALLBACK_PRICE);
  const router = useRouter();
  const { refresh } = useAccess();

  const isAndroid = platform === 'android';
  const isIOS = platform === 'ios';

  // Detect platform on mount
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      setPlatform('web');
      return;
    }
    const nativePlatform = Capacitor.getPlatform();
    if (nativePlatform === 'android') {
      setPlatform('android');
    } else if (nativePlatform === 'ios') {
      setPlatform('ios');
    } else {
      setPlatform('web');
    }
  }, []);

  // Fetch localized App Store price on iOS
  useEffect(() => {
    if (!isIOS) return;
    let cancelled = false;
    (async () => {
      const price = await fetchAppleFullAccessPrice();
      if (!cancelled) setApplePrice(price);
    })();
    return () => {
      cancelled = true;
    };
  }, [isIOS]);

  // Paywall viewed once per mount
  useEffect(() => {
    void trackEvent('paywall_viewed');
  }, []);

  const handleGooglePlayPurchase = async () => {
    setLoading(true);
    void trackEvent('checkout_clicked');
    try {
      // Get PlayBilling plugin from Capacitor
      const PlayBilling = registerPlugin<any>('PlayBilling');
      if (!Capacitor.isNativePlatform()) {
        throw new Error('PlayBilling plugin not available');
      }
      // Initialize billing client
      await PlayBilling.init();

      // Get product ID (default to 'unlock_full_access' - must match Play Console)
      const productId = process.env.NEXT_PUBLIC_GOOGLE_PRODUCT_ID || 'unlock_full_access';

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

      void trackEvent('payment_success', { source: 'google_play_client' });

      // Refresh access status from Supabase
      await refresh();
      
      // Paywall will disappear when paid becomes true
      // No need to redirect - state update will handle it
    } catch (error) {
      console.error('Google Play purchase error:', error);
      alert(error instanceof Error ? error.message : 'Failed to complete purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplePurchase = async () => {
    setLoading(true);
    void trackEvent('checkout_clicked');
    try {
      const result = await purchaseAppleFullAccess();
      if (result.ok) {
        void trackEvent('payment_success', { source: 'apple_iap_client' });
        await refresh();
        return;
      }
      if (result.cancelled) {
        // User cancelled — do not unlock, no error alert
        return;
      }
      alert(result.error);
    } catch (error) {
      console.error('Apple IAP purchase error:', error);
      alert(error instanceof Error ? error.message : 'Failed to complete purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleRestore = async () => {
    setRestoring(true);
    try {
      const result = await restoreAppleFullAccess();
      if (result.ok) {
        void trackEvent('payment_success', { source: 'apple_iap_restore' });
        await refresh();
        return;
      }
      if (result.cancelled) {
        return;
      }
      alert(result.error);
    } catch (error) {
      console.error('Apple IAP restore error:', error);
      alert(error instanceof Error ? error.message : 'Failed to restore purchases. Please try again.');
    } finally {
      setRestoring(false);
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
        void trackEvent('checkout_clicked');
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

  const defaultPaymentHandler = isIOS
    ? handleApplePurchase
    : isAndroid
      ? handleGooglePlayPurchase
      : handleStripePayment;

  const handlePayment = onPay || defaultPaymentHandler;

  const isLoading = loading || externalLoading || restoring;

  const primaryButtonLabel = isLoading
    ? restoring
      ? 'Restoring...'
      : 'Processing...'
    : isIOS
      ? `Unlock Full Access — ${applePrice}`
      : isAndroid
        ? 'Buy on Google Play – £9.99'
        : 'Continue to Payment — £4.99';

  const oneTimePaymentDetail = isIOS
    ? `${applePrice} — No recurring charges`
    : isAndroid
      ? '£9.99 - No recurring charges'
      : '£4.99 — No recurring charges';

  const securePaymentCopy = isIOS
    ? 'Payment securely processed by Apple'
    : isAndroid
      ? 'Secure payment powered by Google Play'
      : 'Secure payment powered by Stripe';

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
          className="lt-card-accent relative w-full max-w-md shadow-[var(--shadow-md)]"
          style={{
            pointerEvents: 'auto',
          }}
        >
          <div className="p-6 sm:p-8 pt-7">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔒</div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                Unlock Full Access
              </h2>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-[var(--correct)] text-xl">✓</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Unlimited Practice Questions</div>
                  <div className="text-sm text-[var(--text-secondary)]">Access all questions across all topics</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[var(--correct)] text-xl">✓</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">All Topics Included</div>
                  <div className="text-sm text-[var(--text-secondary)]">Practice across all topics</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[var(--correct)] text-xl">✓</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Mock Test Access</div>
                  <div className="text-sm text-[var(--text-secondary)]">Take unlimited mock tests</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[var(--correct)] text-xl">✓</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">One-Time Payment</div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {oneTimePaymentDetail}
                  </div>
                </div>
              </div>
            </div>

            {/* Primary purchase button — platform-specific */}
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className={cn(
                "lt-btn-primary w-full py-3.5 text-base",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "active:scale-[0.98]"
              )}
            >
              {primaryButtonLabel}
            </button>

            {isIOS && (
              <button
                type="button"
                onClick={handleAppleRestore}
                disabled={isLoading}
                className={cn(
                  "w-full mt-3 py-2.5 text-sm font-medium",
                  "text-[var(--text-primary)] underline underline-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "active:opacity-80"
                )}
              >
                Restore Purchases
              </button>
            )}

            <p className="text-xs text-[var(--text-secondary)] text-center mt-4">
              {securePaymentCopy}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
