'use client';

import { Capacitor } from '@capacitor/core';
import { trackEvent } from '@/lib/analytics/trackEvent';
import {
  APPLE_FULL_ACCESS_FALLBACK_PRICE,
  APPLE_FULL_ACCESS_PRODUCT_ID,
} from '@/lib/billing/appleProduct';
import {
  classifyVerifyFailure,
  sanitizeAppleEvent,
} from '@/lib/billing/applePurchaseDiagnostics';
import { runApplePurchaseFlow } from '@/lib/billing/applePurchaseFlow';

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

async function verifyWithServer(body: Record<string, unknown>): Promise<{
  ok: true;
} | {
  ok: false;
  status?: number;
  message: string;
  timedOut?: boolean;
  network?: boolean;
}> {
  const controller = new AbortController();
  const timeoutMs = 20_000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log('[appleIap] Apple verify request started', {
      platform: 'ios',
      product_id: APPLE_FULL_ACCESS_PRODUCT_ID,
      jws_present: typeof body.jwsRepresentation === 'string' && body.jwsRepresentation.length > 0,
      legacy_receipt_present: typeof body.receipt === 'string' && body.receipt.length > 0,
      restore: body.restore === true,
    });
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
      error_category: response.ok
        ? undefined
        : classifyVerifyFailure({
            status: response.status,
            message: typeof data.error === 'string' ? data.error : '',
          }),
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message:
          typeof data.error === 'string' && data.error
            ? data.error
            : 'Failed to verify Apple purchase',
      };
    }
    return { ok: true };
  } catch (error) {
    const aborted =
      error instanceof Error && (error.name === 'AbortError' || /aborted/i.test(error.message));
    if (aborted) {
      return {
        ok: false,
        message: 'Apple verification timed out. Please try again.',
        timedOut: true,
      };
    }
    return {
      ok: false,
      message: 'Failed to verify Apple purchase',
      network: true,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Launch Apple native purchase sheet for Full Access (non-consumable).
 * Unlocks only after server verification succeeds.
 */
export async function purchaseAppleFullAccess(): Promise<ApplePurchaseResult> {
  try {
    const { NativePurchases, PURCHASE_TYPE } = await loadNativePurchases();
    return await runApplePurchaseFlow({
      isIos: () => Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios',
      isBillingSupported: async () => {
        const supported = await NativePurchases.isBillingSupported();
        return !!supported?.isBillingSupported;
      },
      purchaseProduct: () =>
        NativePurchases.purchaseProduct({
          productIdentifier: APPLE_FULL_ACCESS_PRODUCT_ID,
          productType: PURCHASE_TYPE.INAPP,
        }),
      getPurchases: async () => {
        const { purchases } = await NativePurchases.getPurchases({
          productType: PURCHASE_TYPE.INAPP,
        });
        return purchases || [];
      },
      verify: async (body) => {
        // Buy must never be treated as Restore. Server enforces fresh-purchase binding.
        const result = await verifyWithServer({ ...body, restore: false });
        return result;
      },
      track: (name, data) => {
        void trackEvent(name, sanitizeAppleEvent(data));
      },
      productId: APPLE_FULL_ACCESS_PRODUCT_ID,
    });
  } catch (error) {
    console.error('[appleIap] purchase error category', {
      cancelled: isUserCancelled(error),
    });
    if (isUserCancelled(error)) {
      return { ok: false, cancelled: true, error: 'Purchase cancelled.' };
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

    const verified = await verifyWithServer({
      platform: 'ios',
      productId: APPLE_FULL_ACCESS_PRODUCT_ID,
      transactionId: owned.transactionId,
      jwsRepresentation: owned.jwsRepresentation,
      receipt: owned.receipt,
      restore: true,
    });
    if (!verified.ok) {
      throw new Error(verified.message);
    }

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
