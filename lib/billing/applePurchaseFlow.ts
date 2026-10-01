/**
 * Observable Apple Buy flow. Verification rules live on the server; this only
 * sequences the existing client steps and records safe diagnostics.
 *
 * Native purchase timeout (default 90s): the JS await stops so the paywall can
 * leave "Processing…". The underlying StoreKit sheet is not cancelled and we
 * do NOT call purchaseProduct again. A late StoreKit result is ignored here so
 * we do not verify or start a second transaction automatically.
 */
import {
  APPLE_NATIVE_PURCHASE_TIMEOUT_MS,
  APPLE_NATIVE_TIMEOUT_MESSAGE,
  baseAppleEvent,
  classifyVerifyFailure,
  errorText,
  isAskToBuyOrPendingMessage,
  isUserCancelledMessage,
  type AppleErrorCategory,
} from './applePurchaseDiagnostics';

export type AppleTx = {
  transactionId?: string;
  jwsRepresentation?: string;
  receipt?: string;
  productIdentifier?: string;
  productId?: string;
};

export type ApplePurchaseResult =
  | { ok: true; alreadyOwned?: boolean }
  | { ok: false; cancelled?: boolean; error: string; errorCategory?: AppleErrorCategory };

export type VerifyClientResult =
  | { ok: true }
  | { ok: false; status?: number; message: string; timedOut?: boolean; network?: boolean };

export type ApplePurchaseFlowDeps = {
  isIos: () => boolean;
  isBillingSupported: () => Promise<boolean>;
  /** Must be invoked at most once per Buy. */
  purchaseProduct: () => Promise<AppleTx | null | undefined>;
  getPurchases: () => Promise<AppleTx[]>;
  verify: (body: Record<string, unknown>) => Promise<VerifyClientResult>;
  track: (name: string, data: Record<string, unknown>) => void;
  productId: string;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
  timeoutMs?: number;
  receiptRetryAttempts?: number;
  receiptRetryDelayMs?: number;
};

const DEFAULT_RECEIPT_RETRIES = 3;
const DEFAULT_RECEIPT_DELAY_MS = 1000;

function sleepDefault(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function matchesProduct(tx: AppleTx, productId: string): boolean {
  return tx.productIdentifier === productId || tx.productId === productId;
}

function hasPayload(tx: AppleTx | null | undefined): boolean {
  return !!(tx?.jwsRepresentation || tx?.receipt);
}

export async function runApplePurchaseFlow(
  deps: ApplePurchaseFlowDeps
): Promise<ApplePurchaseResult> {
  const productId = deps.productId;
  const now = deps.now ?? (() => Date.now());
  const sleep = deps.sleep ?? sleepDefault;
  const timeoutMs = deps.timeoutMs ?? APPLE_NATIVE_PURCHASE_TIMEOUT_MS;
  const started = now();
  const elapsed = () => Math.max(0, now() - started);
  const track = (name: string, extra?: Record<string, unknown>) => {
    deps.track(name, baseAppleEvent(productId, { elapsed_ms: elapsed(), ...extra }));
  };

  if (!deps.isIos()) {
    track('purchase_failed', {
      stage: 'platform',
      error_category: 'unknown',
    });
    return { ok: false, error: 'Apple In-App Purchase is only available on iOS.', errorCategory: 'unknown' };
  }

  let supported = false;
  try {
    supported = await deps.isBillingSupported();
  } catch {
    supported = false;
  }

  if (!supported) {
    track('purchase_failed', {
      stage: 'billing_supported',
      error_category: 'billing_not_supported',
    });
    return {
      ok: false,
      error: 'In-App Purchases are not available on this device.',
      errorCategory: 'billing_not_supported',
    };
  }

  track('purchase_started', { stage: 'native_ready' });
  track('purchase_storekit_call_started', { stage: 'purchase_product' });

  let purchaseCalls = 0;
  let transaction: AppleTx | null | undefined;
  try {
    transaction = await new Promise<AppleTx | null | undefined>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('NATIVE_TIMEOUT'));
      }, timeoutMs);
      purchaseCalls += 1;
      deps
        .purchaseProduct()
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
    const message = errorText(error);
    if (message === 'NATIVE_TIMEOUT' || message.toLowerCase().includes('native_timeout')) {
      track('purchase_failed', {
        stage: 'purchase_product',
        error_category: 'native_timeout',
      });
      return {
        ok: false,
        error: APPLE_NATIVE_TIMEOUT_MESSAGE,
        errorCategory: 'native_timeout',
      };
    }
    if (isUserCancelledMessage(message)) {
      track('purchase_cancelled', {
        stage: 'purchase_product',
        error_category: 'user_cancelled',
      });
      return { ok: false, cancelled: true, error: 'Purchase cancelled.', errorCategory: 'user_cancelled' };
    }
    if (isAskToBuyOrPendingMessage(message)) {
      track('purchase_pending', {
        stage: 'purchase_product',
        error_category: 'pending',
      });
      return {
        ok: false,
        error: 'Your App Store purchase is waiting for approval. Full Access will unlock after it is approved.',
        errorCategory: 'pending',
      };
    }
    track('purchase_failed', {
      stage: 'purchase_product',
      error_category: 'native_purchase_error',
    });
    return {
      ok: false,
      error: message || 'Failed to complete purchase. Please try again.',
      errorCategory: 'native_purchase_error',
    };
  }

  if (purchaseCalls !== 1) {
    // Defensive: never a second StoreKit buy from this path.
    track('purchase_failed', { stage: 'purchase_product', error_category: 'unknown' });
    return { ok: false, error: 'Failed to complete purchase. Please try again.', errorCategory: 'unknown' };
  }

  track('purchase_native_returned', {
    stage: 'purchase_product',
    native_result_present: !!transaction,
    jws_present: !!transaction?.jwsRepresentation,
    legacy_receipt_present: !!transaction?.receipt,
  });

  const maxAttempts = deps.receiptRetryAttempts ?? DEFAULT_RECEIPT_RETRIES;
  const delayMs = deps.receiptRetryDelayMs ?? DEFAULT_RECEIPT_DELAY_MS;

  if (!hasPayload(transaction)) {
    // Same as before: only pull a legacy receipt from getPurchases after purchaseProduct.
    // Do not call purchaseProduct again.
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await sleep(delayMs);
      const purchases = await deps.getPurchases();
      const owned = (purchases || []).find(
        (p) => matchesProduct(p, productId) && !!p.receipt
      );
      if (owned?.receipt) {
        transaction = owned;
        break;
      }
    }
  }

  if (!hasPayload(transaction)) {
    track('purchase_receipt_missing', {
      stage: 'receipt',
      error_category: 'receipt_missing',
      retry_count: maxAttempts,
      native_result_present: !!transaction,
      jws_present: false,
      legacy_receipt_present: false,
    });
    return {
      ok: false,
      error: 'Purchase did not complete. Missing Apple receipt.',
      errorCategory: 'receipt_missing',
    };
  }

  track('purchase_verify_started', {
    stage: 'verify',
    jws_present: !!transaction?.jwsRepresentation,
    legacy_receipt_present: !!transaction?.receipt,
    native_result_present: true,
  });

  const verified = await deps.verify({
    platform: 'ios',
    productId,
    transactionId: transaction?.transactionId,
    jwsRepresentation: transaction?.jwsRepresentation,
    receipt: transaction?.receipt,
    restore: false,
  });

  if (!verified.ok) {
    const category = classifyVerifyFailure({
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
      error: verified.message || 'Failed to verify Apple purchase',
      errorCategory: category,
    };
  }

  track('purchase_completed', { stage: 'verify' });
  return { ok: true };
}
