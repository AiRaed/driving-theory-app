'use client';

import { Capacitor, registerPlugin } from '@capacitor/core';
import { trackEvent } from '@/lib/analytics/trackEvent';
import {
  GOOGLE_FULL_ACCESS_FALLBACK_PRICE,
  GOOGLE_FULL_ACCESS_PRODUCT_ID,
  GOOGLE_FULL_ACCESS_PURCHASE_OPTION_ID,
} from '@/lib/billing/googleProduct';
import { sanitizeGoogleEvent } from '@/lib/billing/googlePurchaseDiagnostics';
import { runGooglePurchaseFlow, type GoogleTx } from '@/lib/billing/googlePurchaseFlow';
import { CONTENT_MAINTENANCE_API_MESSAGE } from '@/lib/maintenance/contentMaintenance';
import { fetchIsContentMaintenanceMode } from '@/lib/hooks/useContentMaintenance';

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

function isPurchaseLike(value: unknown): value is PlayBillingPurchase {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return typeof obj.purchaseToken === 'string' || typeof obj.productId === 'string';
}

/**
 * Native restore resolves JSObject { purchases: ArrayList<JSObject> }.
 * Capacitor often delivers that list as a real array, a single object, or
 * a numeric-key object — never assume .find() exists.
 */
function normalizePurchases(raw: unknown): PlayBillingPurchase[] {
  if (!raw) {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw.filter(isPurchaseLike);
  }
  if (typeof raw !== 'object') {
    return [];
  }

  const obj = raw as Record<string, unknown>;

  if (Array.isArray(obj.purchases)) {
    return obj.purchases.filter(isPurchaseLike);
  }
  if (Array.isArray(obj.products)) {
    return obj.products.filter(isPurchaseLike);
  }
  if (isPurchaseLike(obj.purchases)) {
    return [obj.purchases];
  }
  if (isPurchaseLike(obj.products)) {
    return [obj.products];
  }

  if (obj.purchases && typeof obj.purchases === 'object' && !Array.isArray(obj.purchases)) {
    const nested = normalizePurchases(obj.purchases);
    if (nested.length > 0) {
      return nested;
    }
  }
  if (obj.products && typeof obj.products === 'object' && !Array.isArray(obj.products)) {
    const nested = normalizePurchases(obj.products);
    if (nested.length > 0) {
      return nested;
    }
  }

  const numericKeys = Object.keys(obj).filter((key) => /^\d+$/.test(key));
  if (numericKeys.length > 0) {
    const fromKeys = numericKeys
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => obj[key])
      .filter(isPurchaseLike);
    if (fromKeys.length > 0) {
      return fromKeys;
    }
  }

  if (isPurchaseLike(obj)) {
    return [obj];
  }

  return [];
}

function findFullAccessPurchase(
  purchases: PlayBillingPurchase[]
): PlayBillingPurchase | undefined {
  return purchases.find(
    (purchase) =>
      purchase &&
      purchase.productId === GOOGLE_FULL_ACCESS_PRODUCT_ID &&
      typeof purchase.purchaseToken === 'string' &&
      purchase.purchaseToken.length > 0 &&
      purchase.status !== 'pending' &&
      purchase.purchaseState !== 2
  );
}

function purchasesFromCanonicalRestore(raw: unknown): PlayBillingPurchase[] | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const purchases = (raw as { purchases?: unknown }).purchases;
  if (!Array.isArray(purchases)) {
    return null;
  }
  return purchases.filter(isPurchaseLike);
}

function normalizePurchaseResult(raw: unknown): PlayBillingPurchase | null {
  return findFullAccessPurchase(normalizePurchases(raw)) ?? null;
}

async function activateFullAccessFromRestoreResult(
  rawRestore: unknown,
  options: { restore: boolean; notFoundMessage: string }
): Promise<GooglePurchaseResult> {
  const canonical = purchasesFromCanonicalRestore(rawRestore);
  const purchases = canonical ?? normalizePurchases(rawRestore);
  console.log('[googlePlay] restore lookup', {
    purchase_count: purchases.length,
    purchase_token_present: purchases.some(
      (purchase) => typeof purchase.purchaseToken === 'string' && purchase.purchaseToken.length > 0
    ),
  });

  const owned = findFullAccessPurchase(purchases);
  if (!owned || !owned.purchaseToken) {
    return { ok: false, error: options.notFoundMessage };
  }

  console.log('[googlePlay] full access ownership found', {
    productId: owned.productId,
    hasPurchaseToken: Boolean(owned.purchaseToken),
    status: owned.status,
    purchaseState: owned.purchaseState,
  });

  await verifyOwnedPurchase(owned, { restore: options.restore });
  return { ok: true, alreadyOwned: true };
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

type GoogleVerifyHttpResult =
  | { ok: true }
  | { ok: false; status?: number; message: string; timedOut?: boolean; network?: boolean };

async function verifyWithServer(body: Record<string, unknown>): Promise<GoogleVerifyHttpResult> {
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

    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: data.error || 'Failed to verify Google Play purchase',
      };
    }
    return { ok: true };
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === 'AbortError' || /aborted/i.test(error.message))
    ) {
      return {
        ok: false,
        message: 'Google Play verification timed out. Please try again.',
        timedOut: true,
      };
    }
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Failed to verify Google Play purchase',
      network: true,
    };
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

  const verified = await verifyWithServer({
    platform: 'android',
    productId: purchase.productId || GOOGLE_FULL_ACCESS_PRODUCT_ID,
    purchaseToken: purchase.purchaseToken,
    restore: options?.restore === true,
  });
  if (!verified.ok) {
    throw new Error(verified.message);
  }
}

/** Keep a pending Play result visible. findFullAccessPurchase drops pending on purpose. */
function selectPurchaseForFlow(raw: unknown): GoogleTx | null {
  const purchased = normalizePurchaseResult(raw);
  if (purchased) return purchased;
  const purchases = normalizePurchases(raw);
  return (
    purchases.find(
      (purchase) =>
        purchase.productId === GOOGLE_FULL_ACCESS_PRODUCT_ID &&
        (purchase.status === 'pending' || purchase.purchaseState === 2)
    ) ?? null
  );
}

/**
 * Launch Google Play purchase UI for permanent Full Access.
 * Unlocks only after server verification of a PURCHASED (non-pending) state.
 *
 * Native JS await timeout is 90s (GOOGLE_NATIVE_PURCHASE_TIMEOUT_MS).
 * The Play sheet is not cancelled, purchase() is not called again, and a late
 * native result is not auto-verified.
 */
export async function purchaseGoogleFullAccess(): Promise<GooglePurchaseResult> {
  console.log('[googlePlay] purchaseGoogleFullAccess start');
  if (await fetchIsContentMaintenanceMode()) {
    return { ok: false, error: CONTENT_MAINTENANCE_API_MESSAGE };
  }
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
        const initMessage = initError instanceof Error ? initError.message : 'init failed';
        console.error('[googlePlay] init failed or timed out; continuing to plugin.purchase', initMessage);
      }
    }

    console.log('[googlePlay] before plugin.purchase', {
      productId: GOOGLE_FULL_ACCESS_PRODUCT_ID,
      purchaseOptionId: GOOGLE_FULL_ACCESS_PURCHASE_OPTION_ID,
    });

    return await runGooglePurchaseFlow({
      isAndroid: () => true,
      productId: GOOGLE_FULL_ACCESS_PRODUCT_ID,
      parseError: parseBillingError,
      track: (name, data) => {
        void trackEvent(name, data);
      },
      purchase: async () => {
        const rawPurchase = await plugin.purchase({
          productId: GOOGLE_FULL_ACCESS_PRODUCT_ID,
          purchaseOptionId: GOOGLE_FULL_ACCESS_PURCHASE_OPTION_ID,
        });
        const selected = selectPurchaseForFlow(rawPurchase);
        console.log('[googlePlay] plugin.purchase resolved', {
          productId: selected?.productId ?? null,
          purchase_token_present:
            typeof selected?.purchaseToken === 'string' && selected.purchaseToken.length > 0,
          purchase_state: selected?.purchaseState ?? null,
          status: selected?.status ?? null,
        });
        return selected;
      },
      lookupOwned: async () => {
        const rawRestore = await withTimeout(
          plugin.restore(),
          RESTORE_QUERY_TIMEOUT_MS,
          'Google Play purchase lookup timed out. Please try again.'
        );
        return selectPurchaseForFlow(rawRestore);
      },
      verify: (body) => verifyWithServer(body),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to complete purchase. Please try again.';
    console.error('[googlePlay] purchase error:', message);
    void trackEvent(
      'purchase_failed',
      sanitizeGoogleEvent({
        platform: 'android',
        product_id: GOOGLE_FULL_ACCESS_PRODUCT_ID,
        source: 'google_play_iap',
        stage: 'purchase',
        error_category: 'native_purchase_error',
      })
    );
    return { ok: false, error: message };
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
    const rawRestore = await withTimeout(
      plugin.restore(),
      RESTORE_QUERY_TIMEOUT_MS,
      'Google Play restore timed out. Please try again.'
    );
    return activateFullAccessFromRestoreResult(rawRestore, {
      restore: true,
      notFoundMessage: 'No previous Full Access purchase found for this Google account.',
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to restore purchases. Please try again.';
    console.error('[googlePlay] restore error:', message);
    return { ok: false, error: message };
  }
}

/**
 * Disabled: automatic silent restore must never mark the current LingoTheory
 * account paid based on device Google Play ownership.
 */
export async function silentRestoreGoogleFullAccessIfOwned(): Promise<boolean> {
  return false;
}
