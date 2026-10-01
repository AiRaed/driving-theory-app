/**
 * Privacy-safe Google Play purchase diagnostics.
 * Never include purchase tokens, receipts, service-account JSON, or emails.
 */

/** JS await bound for the Play Billing sheet. The native sheet is not cancelled. */
export const GOOGLE_NATIVE_PURCHASE_TIMEOUT_MS = 90_000;

export const GOOGLE_NATIVE_TIMEOUT_MESSAGE =
  'The Google Play purchase did not complete. Please try again.';

export const GOOGLE_PENDING_MESSAGE =
  'Your purchase is pending in Google Play. Access will unlock after Google confirms payment.';

export type GoogleErrorCategory =
  | 'user_cancelled'
  | 'billing_not_supported'
  | 'native_purchase_error'
  | 'native_timeout'
  | 'pending'
  | 'purchase_token_missing'
  | 'verify_timeout'
  | 'verify_4xx'
  | 'verify_5xx'
  | 'verify_network_error'
  | 'already_owned'
  | 'account_binding_error'
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
  'purchase_token_present',
  'purchase_state',
  'retry_count',
  'elapsed_ms',
]);

export function sanitizeGoogleEvent(
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

export function baseGoogleEvent(productId: string, extra?: Record<string, unknown>) {
  return sanitizeGoogleEvent({
    platform: 'android',
    product_id: productId,
    source: 'google_play_iap',
    ...extra,
  });
}

export function classifyGoogleVerifyFailure(input: {
  status?: number;
  message?: string;
  timedOut?: boolean;
  network?: boolean;
}): GoogleErrorCategory {
  if (input.timedOut) return 'verify_timeout';
  if (input.network) return 'verify_network_error';
  const message = (input.message || '').toLowerCase();
  if (
    message.includes('different lingotheory account') ||
    message.includes('linked to a different')
  ) {
    return 'account_binding_error';
  }
  if (message.includes('already owned') || message.includes('already own')) {
    return 'already_owned';
  }
  if (message.includes('pending')) return 'pending';
  const status = input.status;
  if (typeof status === 'number' && status >= 500) return 'verify_5xx';
  if (typeof status === 'number' && status >= 400) return 'verify_4xx';
  return 'unknown';
}
