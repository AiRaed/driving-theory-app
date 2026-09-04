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

/** Server verify — matches Apple-style bounded fetch. */
const VERIFY_TIMEOUT_MS = 20_000;
/** BillingClient connect / init must not hang the Paywall. */
const BILLING_INIT_TIMEOUT_MS = 15_000;
/** Product details query for price + purchase offer. */
const GET_PRODUCT_TIMEOUT_MS = 15_000;
/** Owned-purchase query (ITEM_ALREADY_OWNED / Restore). */
const RESTORE_QUERY_TIMEOUT_MS = 20_000;
/**
 * Interactive Google Play purchase sheet.
 * Generous bound so a real user can approve payment; still settles if the
 * native bridge never resolves. Late native completion after timeout does
 * NOT auto-verify — entitlement only after a successful verify path.
 */
const NATIVE_PURCHASE_TIMEOUT_MS = 5 * 60_000;

const PURCHASE_CONFIRM_TIMEOUT_MESSAGE =
  'The Google Play purchase could not be confirmed. Please try again.';

/** Must match @CapacitorPlugin(name = "PlayBilling") on PlayBillingPlugin.java */
const PLAY_BILLING_PLUGIN_NAME = 'PlayBilling';

/** Skip a second native init() on Buy once paywall-load init has resolved in JS. */
let playBillingSingleton: PlayBillingPlugin | null = null;
let billingInitSucceeded = false;

function getInjectedPlayBilling(): PlayBillingPlugin | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const cap = (window as unknown as {
    Capacitor?: { Plugins?: Record<string, PlayBillingPlugin | undefined> };
  }).Capacitor;
  const injected = cap?.Plugins?.[PLAY_BILLING_PLUGIN_NAME];
  if (
    injected &&
    typeof injected.init === 'function' &&
    typeof injected.purchase === 'function'
  ) {
    return injected;
  }
  return null;
}

function getPlayBilling(): PlayBillingPlugin {
  if (playBillingSingleton) {
    return playBillingSingleton;
  }

  const injected = getInjectedPlayBilling();
  if (injected) {
    console.log('[googlePlay] using Capacitor.Plugins.PlayBilling (native injected)');
    playBillingSingleton = injected;
    return playBillingSingleton;
  }

  console.log('[googlePlay] using registerPlugin("PlayBilling")');
  playBillingSingleton = registerPlugin<PlayBillingPlugin>(PLAY_BILLING_PLUGIN_NAME);
  return playBillingSingleton;
}

function assertPlayBillingPlugin(plugin: PlayBillingPlugin): void {
  if (typeof plugin.init !== 'function' || typeof plugin.purchase !== 'function') {
    throw new Error(
      'PlayBilling plugin is missing init/purchase. Expected custom PlayBilling, not capgo NativePurchases.'
    );
  }
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

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

async function ensureBillingReady(): Promise<PlayBillingPlugin> {
  if (!isAndroidNative()) {
    throw new Error('Google Play Billing is only available on Android.');
  }
  const plugin = getPlayBilling();
  assertPlayBillingPlugin(plugin);
  if (billingInitSucceeded) {
    return plugin;
  }
  console.log('[googlePlay] before init');
  await withTimeout(
    plugin.init(),
    BILLING_INIT_TIMEOUT_MS,
    'Google Play Billing timed out. Please try again.'
  );
  billingInitSucceeded = true;
  console.log('[googlePlay] init success');
  return plugin;
}

async function verifyWithServer(body: Record<string, unknown>): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

  try {
    const response = await fetch('/api/billing/google/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify Google Play purchase');
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === 'AbortError' || /aborted/i.test(error.message))
    ) {
      throw new Error('Google Play verification timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
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
    const product = await withTimeout(
      plugin.getProduct({
        productId: GOOGLE_FULL_ACCESS_PRODUCT_ID,
        purchaseOptionId: GOOGLE_FULL_ACCESS_PURCHASE_OPTION_ID,
      }),
      GET_PRODUCT_TIMEOUT_MS,
      'Google Play product lookup timed out.'
    );
    if (product?.formattedPrice) {
      return product.formattedPrice;
    }
  } catch (error) {
    console.warn('[googlePlay] Failed to fetch product price:', error);
  }

  return GOOGLE_FULL_ACCESS_FALLBACK_PRICE;
}

async function verifyOwnedPurchase(
  purchase: PlayBillingPurchase,
  options?: { restore?: boolean }
): Promise<void> {
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
    restore: options?.restore === true,
  });
}

/**
 * Launch Google Play purchase UI for permanent Full Access.
 * Unlocks only after server verification of a PURCHASED (non-pending) state.
 */
export async function purchaseGoogleFullAccess(): Promise<GooglePurchaseResult> {
  console.log('[googlePlay] purchaseGoogleFullAccess start');
  if (!isAndroidNative()) {
    console.error('[googlePlay] not android native', {
      isNativePlatform: Capacitor.isNativePlatform(),
      platform: Capacitor.getPlatform(),
    });
    return { ok: false, error: 'Google Play Billing is only available on Android.' };
  }

  try {
    const plugin = getPlayBilling();
    assertPlayBillingPlugin(plugin);

    // Paywall load already connected BillingClient. Do not block Buy on a
    // second init() Promise that can stay unresolved in JS while native is ready.
    console.log('[googlePlay] before init');
    if (billingInitSucceeded) {
      console.log('[googlePlay] init success');
    } else {
      try {
        await withTimeout(
          plugin.init(),
          1000,
          'Google Play Billing init did not resolve; continuing to purchase.'
        );
        billingInitSucceeded = true;
        console.log('[googlePlay] init success');
      } catch (initError) {
        console.error('[googlePlay] init failed or timed out; continuing to plugin.purchase', initError);
      }
    }

    console.log('[googlePlay] before plugin.purchase', {
      productId: GOOGLE_FULL_ACCESS_PRODUCT_ID,
      purchaseOptionId: GOOGLE_FULL_ACCESS_PURCHASE_OPTION_ID,
    });

    let purchase: PlayBillingPurchase;
    try {
      purchase = await withTimeout(
        plugin.purchase({
          productId: GOOGLE_FULL_ACCESS_PRODUCT_ID,
          purchaseOptionId: GOOGLE_FULL_ACCESS_PURCHASE_OPTION_ID,
        }),
        NATIVE_PURCHASE_TIMEOUT_MS,
        PURCHASE_CONFIRM_TIMEOUT_MESSAGE
      );
      console.log('[googlePlay] plugin.purchase resolved', purchase);
    } catch (error) {
      console.error('[googlePlay] plugin.purchase rejected', error);
      const { code, message } = parseBillingError(error);
      if (code === 'USER_CANCELED') {
        return { ok: false, cancelled: true, error: 'Purchase cancelled.' };
      }
      if (message === PURCHASE_CONFIRM_TIMEOUT_MESSAGE) {
        return { ok: false, error: PURCHASE_CONFIRM_TIMEOUT_MESSAGE };
      }
      if (code === 'ITEM_ALREADY_OWNED') {
        // Claim/verify as a purchase for the current LingoTheory account (not restore).
        const { purchases } = await withTimeout(
          plugin.restore(),
          RESTORE_QUERY_TIMEOUT_MS,
          'Google Play purchase lookup timed out. Please try again.'
        );
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
            error: 'Product already owned, but purchase details were unavailable.',
          };
        }
        await verifyOwnedPurchase(owned, { restore: false });
        return { ok: true, alreadyOwned: true };
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
    const { purchases } = await withTimeout(
      plugin.restore(),
      RESTORE_QUERY_TIMEOUT_MS,
      'Google Play restore timed out. Please try again.'
    );

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

    await verifyOwnedPurchase(owned, { restore: true });
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
 * Disabled: automatic silent restore must never mark the current LingoTheory
 * account paid based on device Google Play ownership.
 */
export async function silentRestoreGoogleFullAccessIfOwned(): Promise<boolean> {
  return false;
}
