'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { cn } from '@/lib/utils';
import { useAccess } from '@/lib/providers/AccessProvider';
import { trackEvent } from '@/lib/analytics/trackEvent';
import {
  fetchAppleFullAccessPrice,
  purchaseAppleFullAccess,
  restoreAppleFullAccess,
} from '@/lib/billing/appleIap';
import { APPLE_FULL_ACCESS_FALLBACK_PRICE } from '@/lib/billing/appleProduct';
import {
  fetchGoogleFullAccessPrice,
  purchaseGoogleFullAccess,
  restoreGoogleFullAccess,
} from '@/lib/billing/googlePlay';
import { GOOGLE_FULL_ACCESS_FALLBACK_PRICE } from '@/lib/billing/googleProduct';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import BilingualLabel from '@/components/BilingualLabel';
import { enLabel } from '@/lib/i18n/ui-strings';
import type { UiKey } from '@/lib/i18n/ui-strings';

interface PaywallOverlayProps {
  onPay?: () => void;
  loading?: boolean;
}

type NativePlatform = 'web' | 'android' | 'ios';

/**
 * PaywallOverlay - Stripe (web), Google Play (Android), Apple IAP (iOS)
 * Full screen overlay with backdrop blur
 * Web: "Continue to Payment — £4.99" (Stripe)
 * Android: "Buy on Google Play – {Google Play price}" (Google Play Billing)
 * iOS: "Unlock Full Access — {App Store price}" + Restore Purchases (StoreKit)
 * NO "Maybe later", NO free option
 * Does NOT disappear unless parent stops rendering it (when paid becomes true)
 */
export default function PaywallOverlay({ onPay, loading: externalLoading }: PaywallOverlayProps = {}) {
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [platform, setPlatform] = useState<NativePlatform>('web');
  const [applePrice, setApplePrice] = useState(APPLE_FULL_ACCESS_FALLBACK_PRICE);
  const [googlePrice, setGooglePrice] = useState(GOOGLE_FULL_ACCESS_FALLBACK_PRICE);
  const router = useRouter();
  const { refresh } = useAccess();
  const { lang } = useLanguage();

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

  // Fetch localized Google Play price on Android
  useEffect(() => {
    if (!isAndroid) return;
    let cancelled = false;
    (async () => {
      const price = await fetchGoogleFullAccessPrice();
      if (!cancelled) setGooglePrice(price);
    })();
    return () => {
      cancelled = true;
    };
  }, [isAndroid]);

  // Paywall viewed once per mount
  useEffect(() => {
    void trackEvent('paywall_viewed');
  }, []);

  const handleGooglePlayPurchase = async () => {
    console.log('[googlePlay] buy handler start');
    setLoading(true);
    void trackEvent('checkout_clicked');
    try {
      const result = await purchaseGoogleFullAccess();
      if (result.ok) {
        void trackEvent('payment_success', { source: 'google_play_client' });
        await refresh();
        return;
      }
      if (result.cancelled) {
        return;
      }
      if (result.pending) {
        alert(result.error);
        return;
      }
      alert(result.error);
    } catch (error) {
      console.error('Google Play purchase error:', error);
      alert(error instanceof Error ? error.message : enLabel('paywallPurchaseFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRestore = async () => {
    setRestoring(true);
    try {
      const result = await restoreGoogleFullAccess();
      if (result.ok) {
        void trackEvent('payment_success', { source: 'google_play_restore' });
        await refresh();
        return;
      }
      alert(result.error);
    } catch (error) {
      console.error('Google Play restore error:', error);
      alert(error instanceof Error ? error.message : enLabel('restoreFailed'));
    } finally {
      setRestoring(false);
    }
  };

  const handleApplePurchase = async () => {
    setLoading(true);
    void trackEvent('checkout_clicked');
    try {
      console.log('[paywall] iOS purchase: handler started');
      const result = await purchaseAppleFullAccess();
      console.log('[paywall] iOS purchase: purchaseAppleFullAccess resolved', {
        ok: result.ok,
        cancelled: 'cancelled' in result ? result.cancelled : undefined,
      });
      if (result.ok) {
        void trackEvent('payment_success', { source: 'apple_iap_client' });
        console.log('[paywall] iOS purchase: verification ok; refreshing access');
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
      alert(error instanceof Error ? error.message : enLabel('paywallPurchaseFailed'));
    } finally {
      console.log('[paywall] iOS purchase: finally reached; clearing loading');
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
      alert(error instanceof Error ? error.message : enLabel('restoreFailed'));
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
      alert(error instanceof Error ? error.message : enLabel('paywallPaymentFailed'));
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

  const primaryButtonKey: UiKey = isLoading
    ? restoring
      ? 'restoring'
      : 'processing'
    : isIOS
      ? 'paywallUnlockApple'
      : isAndroid
        ? 'paywallBuyGoogle'
        : 'paywallContinueStripe';

  const primaryButtonVars =
    primaryButtonKey === 'paywallUnlockApple'
      ? { price: applePrice }
      : primaryButtonKey === 'paywallBuyGoogle'
        ? { price: googlePrice }
        : undefined;

  const oneTimePaymentDetail = isIOS
    ? enLabel('paywallNoRecurring', { price: applePrice })
    : isAndroid
      ? enLabel('paywallNoRecurring', { price: googlePrice })
      : enLabel('paywallNoRecurring', { price: '£4.99' });

  const securePaymentCopy = isIOS
    ? enLabel('paywallSecureApple')
    : isAndroid
      ? enLabel('paywallSecureGoogle')
      : enLabel('paywallSecureStripe');

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
                {enLabel('paywallTitle')}
              </h2>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-[var(--correct)] text-xl">✓</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">{enLabel('paywallUnlimitedTitle')}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{enLabel('paywallUnlimitedBody')}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[var(--correct)] text-xl">✓</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">{enLabel('paywallTopicsTitle')}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{enLabel('paywallTopicsBody')}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[var(--correct)] text-xl">✓</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">{enLabel('paywallMockTitle')}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{enLabel('paywallMockBody')}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[var(--correct)] text-xl">✓</span>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">{enLabel('paywallOneTime')}</div>
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
                "lt-btn-primary w-full py-3.5 text-base flex flex-col items-center",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "active:scale-[0.98]"
              )}
            >
              <BilingualLabel
                keyName={primaryButtonKey}
                lang={lang}
                vars={primaryButtonVars}
                translationClassName="text-white/85"
              />
            </button>

            {isIOS && (
              <button
                type="button"
                onClick={handleAppleRestore}
                disabled={isLoading}
                className={cn(
                  "w-full mt-3 py-2.5 text-sm font-medium flex flex-col items-center",
                  "text-[var(--text-primary)] underline underline-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "active:opacity-80"
                )}
              >
                <BilingualLabel keyName="restorePurchases" lang={lang} />
              </button>
            )}

            {isAndroid && (
              <button
                type="button"
                onClick={handleGoogleRestore}
                disabled={isLoading}
                className={cn(
                  "w-full mt-3 py-2.5 text-sm font-medium flex flex-col items-center",
                  "text-[var(--text-primary)] underline underline-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "active:opacity-80"
                )}
              >
                <BilingualLabel keyName="restorePurchases" lang={lang} />
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
