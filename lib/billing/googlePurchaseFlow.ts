/**
 * Observable Google Play Buy flow.
 * Product ID, package name, restore, and server verification rules stay in the caller/server.
 *
 * Native timeout default: 90s. The JS await stops so the paywall leaves "Processing…".
 * Play Billing is not cancelled and purchase() is not called again.
 */
import {
  baseGoogleEvent,
  classifyGoogleVerifyFailure,
  GOOGLE_NATIVE_PURCHASE_TIMEOUT_MS,
  GOOGLE_NATIVE_TIMEOUT_MESSAGE,
  GOOGLE_PENDING_MESSAGE,
  type GoogleErrorCategory,
} from './googlePurchaseDiagnostics';

export type GoogleTx = {
  productId?: string;
  purchaseToken?: string;
  purchaseState?: number;
  status?: 'purchased' | 'pending' | string;
};

export type GooglePurchaseResult =
  | { ok: true; alreadyOwned?: boolean }
  | {
      ok: false;
      cancelled?: boolean;
      pending?: boolean;
      error: string;
      errorCategory?: GoogleErrorCategory;
    };

export type GoogleVerifyClientResult =
  | { ok: true }
  | { ok: false; status?: number; message: string; timedOut?: boolean; network?: boolean };

export type GoogleBillingError = { code?: string; message: string };

export type GooglePurchaseFlowDeps = {
  isAndroid: () => boolean;
  purchase: () => Promise<GoogleTx | null | undefined>;
  /**
   * Existing Buy fallback for ITEM_ALREADY_OWNED or an unusable purchase result.
   * Not the explicit Restore button. Must not call purchase() again.
   */
  lookupOwned?: () => Promise<GoogleTx | null | undefined>;
  verify: (body: Record<string, unknown>) => Promise<GoogleVerifyClientResult>;
  track: (name: string, data: Record<string, unknown>) => void;
  parseError?: (error: unknown) => GoogleBillingError;
  productId: string;
  now?: () => number;
  timeoutMs?: number;
};

function defaultParseError(error: unknown): GoogleBillingError {
  if (error && typeof error === 'object') {
    const e = error as { code?: string; message?: string };
    return { code: e.code, message: e.message || 'Unknown billing error' };
  }
  if (error instanceof Error) return { message: error.message };
  return { message: String(error) };
}

export function isPendingPurchase(tx: GoogleTx | null | undefined): boolean {
  if (!tx) return false;
  return tx.status === 'pending' || tx.purchaseState === 2;
}

function hasToken(tx: GoogleTx | null | undefined): boolean {
  return typeof tx?.purchaseToken === 'string' && tx.purchaseToken.length > 0;
}

export async function runGooglePurchaseFlow(
  deps: GooglePurchaseFlowDeps
): Promise<GooglePurchaseResult> {
  const productId = deps.productId;
  const now = deps.now ?? (() => Date.now());
  const parseError = deps.parseError ?? defaultParseError;
  const timeoutMs = deps.timeoutMs ?? GOOGLE_NATIVE_PURCHASE_TIMEOUT_MS;
  const started = now();
  const elapsed = () => Math.max(0, now() - started);
  const track = (name: string, extra?: Record<string, unknown>) => {
    deps.track(name, baseGoogleEvent(productId, { elapsed_ms: elapsed(), ...extra }));
  };

  if (!deps.isAndroid()) {
    track('purchase_failed', { stage: 'platform', error_category: 'unknown' });
    return {
      ok: false,
      error: 'Google Play Billing is only available on Android.',
      errorCategory: 'unknown',
    };
  }

  track('purchase_started', { stage: 'native_ready' });
  track('purchase_googleplay_call_started', { stage: 'purchase' });

  let purchaseCalls = 0;
  let raw: GoogleTx | null | undefined;
  try {
    raw = await new Promise<GoogleTx | null | undefined>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('NATIVE_TIMEOUT')), timeoutMs);
      purchaseCalls += 1;
      Promise.resolve()
        .then(() => deps.purchase())
        .then((value) => {
          clearTimeout(timer);
          resolve(value);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  } catch (error) {
    const parsed = parseError(error);
    const message = parsed.message || '';
    if (message === 'NATIVE_TIMEOUT' || message === GOOGLE_NATIVE_TIMEOUT_MESSAGE) {
      track('purchase_failed', {
        stage: 'purchase',
        error_category: 'native_timeout',
        ...(parsed.code ? { error_code: parsed.code } : {}),
      });
      return {
        ok: false,
        error: GOOGLE_NATIVE_TIMEOUT_MESSAGE,
        errorCategory: 'native_timeout',
      };
    }
    if (parsed.code === 'USER_CANCELED') {
      track('purchase_cancelled', {
        stage: 'purchase',
        error_category: 'user_cancelled',
        error_code: 'USER_CANCELED',
      });
      return {
        ok: false,
        cancelled: true,
        error: 'Purchase cancelled.',
        errorCategory: 'user_cancelled',
      };
    }
    if (parsed.code === 'BILLING_UNAVAILABLE') {
      track('purchase_failed', {
        stage: 'purchase',
        error_category: 'billing_not_supported',
        error_code: 'BILLING_UNAVAILABLE',
      });
      return {
        ok: false,
        error: message || 'Google Play Billing is unavailable.',
        errorCategory: 'billing_not_supported',
      };
    }
    if (parsed.code === 'ITEM_ALREADY_OWNED') {
      const owned = deps.lookupOwned ? await deps.lookupOwned() : null;
      if (owned && isPendingPurchase(owned)) {
        track('purchase_pending', {
          stage: 'already_owned',
          error_category: 'pending',
          purchase_state: owned.purchaseState ?? 2,
          purchase_token_present: hasToken(owned),
        });
        return { ok: false, pending: true, error: GOOGLE_PENDING_MESSAGE, errorCategory: 'pending' };
      }
      if (owned && hasToken(owned)) {
        return verifyOwned(deps, track, owned, true);
      }
      track('purchase_failed', {
        stage: 'already_owned',
        error_category: 'already_owned',
        error_code: 'ITEM_ALREADY_OWNED',
        purchase_token_present: false,
      });
      return {
        ok: false,
        error: 'Product already owned, but purchase details were unavailable.',
        errorCategory: 'already_owned',
      };
    }
    track('purchase_failed', {
      stage: 'purchase',
      error_category: 'native_purchase_error',
      ...(parsed.code ? { error_code: parsed.code } : {}),
    });
    return {
      ok: false,
      error: message || 'Failed to complete purchase. Please try again.',
      errorCategory: 'native_purchase_error',
    };
  }

  if (purchaseCalls !== 1) {
    track('purchase_failed', { stage: 'purchase', error_category: 'unknown' });
    return { ok: false, error: 'Failed to complete purchase. Please try again.', errorCategory: 'unknown' };
  }

  track('purchase_native_returned', {
    stage: 'purchase',
    native_result_present: !!raw,
    purchase_token_present: hasToken(raw),
    ...(typeof raw?.purchaseState === 'number' ? { purchase_state: raw.purchaseState } : {}),
  });

  if (isPendingPurchase(raw)) {
    track('purchase_pending', {
      stage: 'purchase',
      error_category: 'pending',
      purchase_state: raw?.purchaseState ?? 2,
      purchase_token_present: hasToken(raw),
    });
    return { ok: false, pending: true, error: GOOGLE_PENDING_MESSAGE, errorCategory: 'pending' };
  }

  let usable = hasToken(raw) && !isPendingPurchase(raw) ? raw : null;
  if (!usable && deps.lookupOwned) {
    usable = (await deps.lookupOwned()) ?? null;
    if (usable && isPendingPurchase(usable)) {
      track('purchase_pending', {
        stage: 'lookup',
        error_category: 'pending',
        purchase_state: usable.purchaseState ?? 2,
      });
      return { ok: false, pending: true, error: GOOGLE_PENDING_MESSAGE, errorCategory: 'pending' };
    }
  }

  if (!usable || !hasToken(usable) || isPendingPurchase(usable)) {
    track('purchase_token_missing', {
      stage: 'token',
      error_category: 'purchase_token_missing',
      native_result_present: !!raw,
      purchase_token_present: false,
    });
    return {
      ok: false,
      error:
        'Purchase completed, but Full Access details were unavailable. Try Restore Purchases.',
      errorCategory: 'purchase_token_missing',
    };
  }

  return verifyOwned(deps, track, usable, false);
}

async function verifyOwned(
  deps: GooglePurchaseFlowDeps,
  track: (name: string, extra?: Record<string, unknown>) => void,
  purchase: GoogleTx,
  alreadyOwned: boolean
): Promise<GooglePurchaseResult> {
  track('purchase_verify_started', {
    stage: 'verify',
    purchase_token_present: true,
    native_result_present: true,
    ...(typeof purchase.purchaseState === 'number'
      ? { purchase_state: purchase.purchaseState }
      : {}),
  });

  const verified = await deps.verify({
    platform: 'android',
    productId: purchase.productId || deps.productId,
    purchaseToken: purchase.purchaseToken,
    restore: false,
  });

  if (!verified.ok) {
    const category = classifyGoogleVerifyFailure({
      status: verified.status,
      message: verified.message,
      timedOut: verified.timedOut,
      network: verified.network,
    });
    track('purchase_verify_failed', {
      stage: 'verify',
      error_category: category,
      ...(typeof verified.status === 'number' ? { http_status: verified.status } : {}),
    });
    return {
      ok: false,
      error: verified.message || 'Failed to verify Google Play purchase',
      errorCategory: category,
    };
  }

  track('purchase_completed', { stage: 'verify' });
  return alreadyOwned ? { ok: true, alreadyOwned: true } : { ok: true };
}
