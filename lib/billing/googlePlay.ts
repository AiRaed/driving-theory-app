'use client';

import { Capacitor, registerPlugin } from '@capacitor/core';
import {
  GOOGLE_FULL_ACCESS_FALLBACK_PRICE,
  GOOGLE_FULL_ACCESS_PRODUCT_ID,
  GOOGLE_FULL_ACCESS_PURCHASE_OPTION_ID,
} from '@/lib/billing/googleProduct';

export type GooglePurchaseResult =
  | { ok: true; alreadyOwned?: boolean }
  | { ok: false; cancelled?: boolean; pending?: boolean; error: string };

type PlayBillingProduct = {
  productId: string;
  title?: string;
  description?: string;
  formattedPrice?: string;
  priceCurrencyCode?: string;
  priceAmountMicros?: number;
  offerToken?: string;
  purchaseOptionId?: string;
};

type PlayBillingPurchase = {
  productId: string;
  purchaseToken: string;
  orderId?: string;
  acknowledged?: boolean;
  purchaseState?: number;
  purchaseTime?: number;
  status?: 'purchased' | 'pending';
};

type PlayBillingPlugin = {
  init(): Promise<{ success: boolean }>;
  getProduct(options: {
    productId: string;
    purchaseOptionId?: string;
  }): Promise<PlayBillingProduct>;
  purchase(options: {
    productId: string;
    purchaseOptionId?: string;
  }): Promise<PlayBillingPurchase>;
  restore(): Promise<{ purchases: PlayBillingPurchase[] }>;
};

function getPlayBilling(): PlayBillingPlugin {
  return registerPlugin<PlayBillingPlugin>('PlayBilling');
}

function isAndroidNative(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

function parseBillingError(error: unknown): {
  code?: string;
  message: string;
} {
  if (error && typeof error === 'object') {
    const e = error as { code?: string; message?: string };
    return {
      code: e.code,
      message: e.message || 'Unknown billing error',
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: String(error) };
}

async function ensureBillingReady(): Promise<PlayBillingPlugin> {
  if (!isAndroidNative()) {
    throw new Error('Google Play Billing is only available on Android.');
  }
  const plugin = getPlayBilling();
  await plugin.init();
  return plugin;
}

async function verifyWithServer(body: Record<string, unknown>): Promise<void> {
  const response = await fetch('/api/billing/google/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to verify Google Play purchase');
  }
}

/**
 * Fetch localized Google Play price for Full Access.
 * Falls back when product is unavailable or Billing is not ready.
 */
export async function fetchGoogleFullAccessPrice(): Promise<string> {
  if (!isAndroidNative()) {
    return GOOGLE_FULL_ACCESS_FALLBACK_PRICE;
  }

  try {
    const plugin = await ensureBillingReady();
    const product = await plugin.getProduct({
      productId: GOOGLE_FULL_ACCESS_PRODUCT_ID,
      purchaseOptionId: GOOGLE_FULL_ACCESS_PURCHASE_OPTION_ID,
    });
    if (product?.formattedPrice) {
      return product.formattedPrice;
    }
  } catch (error) {
    console.warn('[googlePlay] Failed to fetch product price:', error);
  }

  return GOOGLE_FULL_ACCESS_FALLBACK_PRICE;
}

async function verifyOwnedPurchase(purchase: PlayBillingPurchase): Promise<void> {
  if (!purchase.purchaseToken) {
    throw new Error('Purchase token missing.');
  }
  if (purchase.status === 'pending' || purchase.purchaseState === 2) {
    throw new Error('Purchase is still pending.');
  }

  await verifyWithServer({
    platform: 'android',
    productId: purchase.productId || GOOGLE_FULL_ACCESS_PRODUCT_ID,
    purchaseToken: purchase.purchaseToken,
  });
}

/**
 * Launch Google Play purchase UI for permanent Full Access.
 * Unlocks only after server verification of a PURCHASED (non-pending) state.
 */
export async function purchaseGoogleFullAccess(): Promise<GooglePurchaseResult> {
  if (!isAndroidNative()) {
    return { ok: false, error: 'Google Play Billing is only available on Android.' };
  }

  try {
    const plugin = await ensureBillingReady();

    let purchase: PlayBillingPurchase;
    try {
      purchase = await plugin.purchase({
        productId: GOOGLE_FULL_ACCESS_PRODUCT_ID,
        purchaseOptionId: GOOGLE_FULL_ACCESS_PURCHASE_OPTION_ID,
      });
    } catch (error) {
      const { code, message } = parseBillingError(error);
      if (code === 'USER_CANCELED') {
        return { ok: false, cancelled: true, error: 'Purchase cancelled.' };
      }
      if (code === 'ITEM_ALREADY_OWNED') {
        return restoreGoogleFullAccess();
      }
      return { ok: false, error: message };
    }

    if (purchase.status === 'pending' || purchase.purchaseState === 2) {
      return {
        ok: false,
        pending: true,
        error: 'Your payment is pending. Full Access will unlock once Google confirms the purchase.',
      };
    }

    await verifyOwnedPurchase(purchase);
    return { ok: true };
  } catch (error) {
    console.error('[googlePlay] purchase error:', error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to complete purchase. Please try again.',
    };
  }
}

/**
 * Restore owned Google Play Full Access and verify with backend.
 */
export async function restoreGoogleFullAccess(): Promise<GooglePurchaseResult> {
  if (!isAndroidNative()) {
    return { ok: false, error: 'Restore Purchases is only available on Android.' };
  }

  try {
    const plugin = await ensureBillingReady();
    const { purchases } = await plugin.restore();

    const owned = (purchases || []).find(
      (p) =>
        p.productId === GOOGLE_FULL_ACCESS_PRODUCT_ID &&
        p.purchaseToken &&
        p.status !== 'pending' &&
        p.purchaseState !== 2
    );

    if (!owned) {
      return {
        ok: false,
        error: 'No previous Full Access purchase found for this Google account.',
      };
    }

    await verifyOwnedPurchase(owned);
    return { ok: true, alreadyOwned: true };
  } catch (error) {
    console.error('[googlePlay] restore error:', error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to restore purchases. Please try again.',
    };
  }
}

/**
 * Silent restore for login/launch: unlocks only if Google ownership verifies on server.
 * Never throws; never grants access without server success.
 */
export async function silentRestoreGoogleFullAccessIfOwned(): Promise<boolean> {
  if (!isAndroidNative()) {
    return false;
  }

  try {
    const plugin = await ensureBillingReady();
    const { purchases } = await plugin.restore();

    const owned = (purchases || []).find(
      (p) =>
        p.productId === GOOGLE_FULL_ACCESS_PRODUCT_ID &&
        p.purchaseToken &&
        p.status !== 'pending' &&
        p.purchaseState !== 2
    );

    if (!owned) {
      return false;
    }

    await verifyOwnedPurchase(owned);
    return true;
  } catch {
    return false;
  }
}
