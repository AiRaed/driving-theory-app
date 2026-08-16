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
  const response = await fetch('/api/billing/apple/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to verify Apple purchase');
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

    const transaction = await NativePurchases.purchaseProduct({
      productIdentifier: APPLE_FULL_ACCESS_PRODUCT_ID,
      productType: PURCHASE_TYPE.INAPP,
    });

    if (!transaction?.receipt) {
      return {
        ok: false,
        error: 'Purchase did not complete. Missing Apple receipt.',
      };
    }

    await verifyWithServer({
      platform: 'ios',
      productId: APPLE_FULL_ACCESS_PRODUCT_ID,
      transactionId: transaction.transactionId,
      receipt: transaction.receipt,
    });

    return { ok: true };
  } catch (error) {
    if (isUserCancelled(error)) {
      return { ok: false, cancelled: true, error: 'Purchase cancelled.' };
    }
    console.error('[appleIap] purchase error:', error);
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

    if (!owned.receipt) {
      return {
        ok: false,
        error: 'Could not read Apple receipt for restore. Please try again.',
      };
    }

    await verifyWithServer({
      platform: 'ios',
      productId: APPLE_FULL_ACCESS_PRODUCT_ID,
      transactionId: owned.transactionId,
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
 * Silent restore for login/launch: unlocks only if Apple ownership verifies on server.
 * Uses getPurchases only (no restorePurchases) to avoid Apple ID prompts on every launch.
 * Never throws; never grants access without server success.
 */
export async function silentRestoreAppleFullAccessIfOwned(): Promise<boolean> {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
    return false;
  }

  try {
    const { NativePurchases, PURCHASE_TYPE } = await loadNativePurchases();

    const supported = await NativePurchases.isBillingSupported();
    if (!supported?.isBillingSupported) {
      return false;
    }

    const { purchases } = await NativePurchases.getPurchases({
      productType: PURCHASE_TYPE.INAPP,
    });

    const owned = (purchases || []).find(
      (p) =>
        p.productIdentifier === APPLE_FULL_ACCESS_PRODUCT_ID ||
        (p as { productId?: string }).productId === APPLE_FULL_ACCESS_PRODUCT_ID
    );

    if (!owned?.receipt) {
      return false;
    }

    await verifyWithServer({
      platform: 'ios',
      productId: APPLE_FULL_ACCESS_PRODUCT_ID,
      transactionId: owned.transactionId,
      receipt: owned.receipt,
      restore: true,
    });

    return true;
  } catch {
    return false;
  }
}
