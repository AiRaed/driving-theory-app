/**
 * Privacy-safe Apple purchase diagnostics.
 * Never include JWS, receipts, tokens, emails, or raw transaction payloads.
 */

export const APPLE_NATIVE_PURCHASE_TIMEOUT_MS = 90_000;

/**
 * Shown when the JS await gives up on StoreKit.
 * StoreKit may still be resolving independently — we do not start another purchase.
 */
export const APPLE_NATIVE_TIMEOUT_MESSAGE =
  'The App Store purchase did not complete. Please try again.';

export const APPLE_PURCHASE_EVENT_NAMES = [
  'purchase_started',
  'purchase_storekit_call_started',
  'purchase_native_returned',
  'purchase_cancelled',
  'purchase_pending',
  'purchase_failed',
  'purchase_receipt_missing',
  'purchase_verify_started',
  'purchase_verify_failed',
  'purchase_completed',
  'entitlement_granted',
] as const;

export type ApplePurchaseEventName = (typeof APPLE_PURCHASE_EVENT_NAMES)[number];

export type AppleErrorCategory =
  | 'user_cancelled'
  | 'billing_not_supported'
  | 'native_purchase_error'
  | 'native_timeout'
  | 'pending'
  | 'receipt_missing'
  | 'verify_timeout'
  | 'verify_4xx'
  | 'verify_5xx'
  | 'verify_network_error'
  | 'already_owned_other_account'
  | 'already_owned_current_account'
  | 'unknown';

const SAFE_KEYS = new Set([
  'platform',
  'product_id',
  'stage',
  'error_category',
  'error_code',
  'http_status',
  'source',
  'native_result_present',
  'jws_present',
  'legacy_receipt_present',
  'retry_count',
  'elapsed_ms',
]);

/** Drop anything that is not an allowlisted diagnostic field. */
export function sanitizeAppleEvent(
  data: Record<string, unknown> | null | undefined
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!data) return out;
  for (const [key, value] of Object.entries(data)) {
    if (!SAFE_KEYS.has(key)) continue;
    if (value == null) continue;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      out[key] = value;
    }
  }
  return out;
}

export function errorText(error: unknown): string {
  if (error instanceof Error) return error.message || '';
  if (typeof error === 'string') return error;
  return '';
}

/**
 * Ask to Buy / deferred is not a field on iOS Transaction in @capgo/native-purchases
 * (purchaseState is documented as Android-only). Only classify pending when the
 * plugin error text explicitly says so.
 */
export function isAskToBuyOrPendingMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('ask to buy') ||
    lower.includes('asktobuy') ||
    lower.includes('deferred') ||
    lower.includes('pending')
  );
}

export function isUserCancelledMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('cancel') ||
    lower.includes('cancelled') ||
    lower.includes('canceled') ||
    lower.includes('paymentcancelled') ||
    lower.includes('skerrorpaymentcancelled')
  );
}

export function classifyVerifyFailure(input: {
  status?: number;
  message?: string;
  timedOut?: boolean;
  network?: boolean;
}): AppleErrorCategory {
  if (input.timedOut) return 'verify_timeout';
  if (input.network) return 'verify_network_error';
  const message = (input.message || '').toLowerCase();
  if (
    message.includes('different lingotheory account') ||
    message.includes('already owns full access from an earlier purchase') ||
    message.includes('not linked to this lingotheory account')
  ) {
    return 'already_owned_other_account';
  }
  const status = input.status;
  if (typeof status === 'number' && status >= 500) return 'verify_5xx';
  if (typeof status === 'number' && status >= 400) return 'verify_4xx';
  return 'unknown';
}

export function baseAppleEvent(productId: string, extra?: Record<string, unknown>) {
  return sanitizeAppleEvent({
    platform: 'ios',
    product_id: productId,
    source: 'apple_iap',
    ...extra,
  });
}
