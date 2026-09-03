'use client';

import { Capacitor } from '@capacitor/core';
import {
  APPLE_FULL_ACCESS_FALLBACK_PRICE,
  APPLE_FULL_ACCESS_PRODUCT_ID,
} from '@/lib/billing/appleProduct';

export type ApplePurchaseResult =
  | { ok: true; alreadyOwned?: boolean }
  | { ok: false; cancelled?: boolean; error: string };

function isUserCancelled(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : JSON.stringify(error);
  const lower = message.toLowerCase();
  return (
    lower.includes('cancel') ||
    lower.includes('cancelled') ||
    lower.includes('canceled') ||
    lower.includes('user cancelled') ||
    lower.includes('user canceled') ||
    lower.includes('paymentcancelled') ||
    lower.includes('skerrorpaymentcancelled')
  );
}

async function loadNativePurchases() {
  const mod = await import('@capgo/native-purchases');
  return mod;
}

/**
 * Fetch localized App Store price string for Full Access.
 * Falls back to configured display price if StoreKit is unavailable.
 */
export async function fetchAppleFullAccessPrice(): Promise<string> {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
    return APPLE_FULL_ACCESS_FALLBACK_PRICE;
  }

  try {
    const { NativePurchases, PURCHASE_TYPE } = await loadNativePurchases();
    const supported = await NativePurchases.isBillingSupported();
    if (!supported?.isBillingSupported) {
      return APPLE_FULL_ACCESS_FALLBACK_PRICE;
    }

    const { product } = await NativePurchases.getProduct({
      productIdentifier: APPLE_FULL_ACCESS_PRODUCT_ID,
      productType: PURCHASE_TYPE.INAPP,
    });

    if (product?.priceString) {
      return product.priceString;
    }
  } catch (error) {
    console.warn('[appleIap] Failed to fetch product price:', error);
  }

  return APPLE_FULL_ACCESS_FALLBACK_PRICE;
}

async function verifyWithServer(body: Record<string, unknown>): Promise<void> {
  const controller = new AbortController();
  const timeoutMs = 20_000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log('[appleIap] Apple verify request started');
    const response = await fetch('/api/billing/apple/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    console.log('[appleIap] Apple verify request completed', {
      ok: response.ok,
      status: response.status,
    });

    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify Apple purchase');
    }
  } catch (error) {
    // Ensure we never leave an unresolved promise.
    if (error instanceof Error && (error.name === 'AbortError' || /aborted/i.test(error.message))) {
      throw new Error('Apple verification timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Launch Apple native purchase sheet for Full Access (non-consumable).
 * Unlocks only after server verification succeeds.
 */
export async function purchaseAppleFullAccess(): Promise<ApplePurchaseResult> {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
    return { ok: false, error: 'Apple In-App Purchase is only available on iOS.' };
  }

  try {
    const { NativePurchases, PURCHASE_TYPE } = await loadNativePurchases();

    const supported = await NativePurchases.isBillingSupported();
    if (!supported?.isBillingSupported) {
      return { ok: false, error: 'In-App Purchases are not available on this device.' };
    }

    let transaction = await NativePurchases.purchaseProduct({
      productIdentifier: APPLE_FULL_ACCESS_PRODUCT_ID,
      productType: PURCHASE_TYPE.INAPP,
    });

    // StoreKit 2 via this plugin can return either legacy `receipt` (local receipt file)
    // and/or `jwsRepresentation` (StoreKit 2 signed transaction). For verification,
    // prefer JWS when present.
    if (!transaction?.jwsRepresentation && !transaction?.receipt) {
      // On some iOS/TestFlight setups, the local app receipt file may not exist
      // at the exact moment `purchaseProduct()` resolves. Retry for a short window.
      const maxAttempts = 3;
      const delayMs = 1000;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.warn('[appleIap] Receipt missing after purchase; retrying getPurchases', {
          attempt,
          maxAttempts,
        });

        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, delayMs));

        const { purchases } = await NativePurchases.getPurchases({
          productType: PURCHASE_TYPE.INAPP,
        });

        const ownedWithReceipt = (purchases || []).find(
          (p) =>
            p.productIdentifier === APPLE_FULL_ACCESS_PRODUCT_ID ||
            (p as { productId?: string }).productId === APPLE_FULL_ACCESS_PRODUCT_ID
        );

        if (ownedWithReceipt?.receipt) {
          transaction = ownedWithReceipt as typeof transaction;
          break;
        }
      }

      if (!transaction?.receipt) {
        return {
          ok: false,
          error: 'Purchase did not complete. Missing Apple receipt.',
        };
      }
    }

    console.log('[appleIap] Native purchase returned verification payload', {
      hasReceipt: !!transaction?.receipt,
      hasJws: !!transaction?.jwsRepresentation,
    });
    await verifyWithServer({
      platform: 'ios',
      productId: APPLE_FULL_ACCESS_PRODUCT_ID,
      transactionId: transaction.transactionId,
      jwsRepresentation: transaction.jwsRepresentation,
      receipt: transaction.receipt,
      // Buy must never be treated as Restore. Server enforces fresh-purchase binding.
      restore: false,
    });

    return { ok: true };
  } catch (error) {
    if (isUserCancelled(error)) {
      return { ok: false, cancelled: true, error: 'Purchase cancelled.' };
    }
    console.error('[appleIap] purchase error:', error);
    if (error instanceof Error && (error.message || '').toLowerCase().includes('timed out')) {
      return { ok: false, error: 'Apple verification timed out. Please try again.' };
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to complete purchase. Please try again.',
    };
  }
}

/**
 * Restore non-consumable Full Access and verify with backend.
 * Does not unlock without a successful server verify.
 */
export async function restoreAppleFullAccess(): Promise<ApplePurchaseResult> {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
    return { ok: false, error: 'Restore Purchases is only available on iOS.' };
  }

  try {
    const { NativePurchases, PURCHASE_TYPE } = await loadNativePurchases();

    const supported = await NativePurchases.isBillingSupported();
    if (!supported?.isBillingSupported) {
      return { ok: false, error: 'In-App Purchases are not available on this device.' };
    }

    await NativePurchases.restorePurchases();

    const { purchases } = await NativePurchases.getPurchases({
      productType: PURCHASE_TYPE.INAPP,
    });

    const owned = (purchases || []).find(
      (p) =>
        p.productIdentifier === APPLE_FULL_ACCESS_PRODUCT_ID ||
        (p as { productId?: string }).productId === APPLE_FULL_ACCESS_PRODUCT_ID
    );

    if (!owned) {
      return {
        ok: false,
        error: 'No previous Full Access purchase found for this Apple ID.',
      };
    }

    if (!owned?.receipt && !owned?.jwsRepresentation) {
      return {
        ok: false,
        error: 'Could not read Apple verification payload for restore. Please try again.',
      };
    }

    await verifyWithServer({
      platform: 'ios',
      productId: APPLE_FULL_ACCESS_PRODUCT_ID,
      transactionId: owned.transactionId,
      jwsRepresentation: owned.jwsRepresentation,
      receipt: owned.receipt,
      restore: true,
    });

    return { ok: true, alreadyOwned: true };
  } catch (error) {
    if (isUserCancelled(error)) {
      return { ok: false, cancelled: true, error: 'Restore cancelled.' };
    }
    console.error('[appleIap] restore error:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to restore purchases. Please try again.',
    };
  }
}

/**
 * Disabled: automatic silent restore must never mark the current LingoTheory
 * account paid based on device Apple ID ownership.
 */
export async function silentRestoreAppleFullAccessIfOwned(): Promise<boolean> {
  return false;
}
