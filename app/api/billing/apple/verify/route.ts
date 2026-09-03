import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import {
  Environment,
  SignedDataVerifier,
  VerificationException,
  VerificationStatus,
} from '@apple/app-store-server-library';
import {
  APPLE_FULL_ACCESS_AMOUNT_PENCE,
  APPLE_FULL_ACCESS_PRODUCT_ID,
} from '@/lib/billing/appleProduct';

export const dynamic = 'force-dynamic';

// Root CA certificates used by @apple/app-store-server-library's JWS verifier.
// Sourced from the library's own unit-test fixture for verifying a "real" Apple chain.
const REAL_APPLE_ROOT_BASE64_ENCODED =
  'MIICQzCCAcmgAwIBAgIILcX8iNLFS5UwCgYIKoZIzj0EAwMwZzEbMBkGA1UEAwwSQXBwbGUgUm9vdCBDQSAtIEczMSYwJAYDVQQLDB1BcHBsZSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTETMBEGA1UECgwKQXBwbGUgSW5jLjELMAkGA1UEBhMCVVMwHhcNMTQwNDMwMTgxOTA2WhcNMzkwNDMwMTgxOTA2WjBnMRswGQYDVQQDDBJBcHBsZSBSb290IENBIC0gRzMxJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MRMwEQYDVQQKDApBcHBsZSBJbmMuMQswCQYDVQQGEwJVUzB2MBAGByqGSM49AgEGBSuBBAAiA2IABJjpLz1AcqTtkyJygRMc3RCV8cWjTnHcFBbZDuWmBSp3ZHtfTjjTuxxEtX/1H7YyYl3J6YRbTzBPEVoA/VhYDKX1DyxNB0cTddqXl5dvMVztK517IDvYuVTZXpmkOlEKMaNCMEAwHQYDVR0OBBYEFLuw3qFYM4iapIqZ3r6966/ayySrMA8GA1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgEGMAoGCCqGSM49BAMDA2gAMGUCMQCD6cHEFl4aXTQY2e3v9GwOAEZLuN+yRhHFD/3meoyhpmvOwgPUnPWTxnS4at+qIxUCMG1mihDK1A3UT82NQz60imOlM27jbdoXt2QfyFMm+YhidDkLF1vLUagM6BgD56KyKA==';

const APPLE_APPLE_ID = process.env.APPLE_APPLE_ID
  ? Number(process.env.APPLE_APPLE_ID)
  : undefined;

const APPLE_ROOT_CERTIFICATES = [Buffer.from(REAL_APPLE_ROOT_BASE64_ENCODED, 'base64')];

type AppleVerifyReceiptResponse = {
  status: number;
  environment?: string;
  receipt?: {
    bundle_id?: string;
    in_app?: AppleInAppPurchase[];
  };
  latest_receipt_info?: AppleInAppPurchase[];
};

type AppleInAppPurchase = {
  product_id?: string;
  transaction_id?: string;
  original_transaction_id?: string;
  purchase_date_ms?: string;
  cancellation_date_ms?: string;
};

/**
 * Verify Apple IAP and unlock Full Access in Supabase.
 * POST /api/billing/apple/verify
 * Body: {
 *   platform: "ios",
 *   productId: string,
 *   transactionId?: string,
 *   receipt: string,
 *   restore?: boolean
 * }
 *
 * Updates:
 * - profiles.access_level = 'paid'
 * - payments table with Apple purchase details
 *
 * Does NOT unlock on cancelled/failed/unverified purchases.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, platform, transactionId, receipt, jwsRepresentation } =
      body;

    if (platform !== 'ios') {
      return NextResponse.json(
        { error: 'Invalid platform. Expected ios.' },
        { status: 400 }
      );
    }

    if (!productId || productId !== APPLE_FULL_ACCESS_PRODUCT_ID) {
      return NextResponse.json(
        { error: 'Invalid or missing Apple product ID' },
        { status: 400 }
      );
    }

    const hasJws =
      typeof jwsRepresentation === 'string' && jwsRepresentation.trim().length > 0;
    const hasReceipt =
      typeof receipt === 'string' && receipt.trim().length > 0;

    if (!hasJws && !hasReceipt) {
      return NextResponse.json(
        { error: 'Apple JWS or receipt is required for verification' },
        { status: 400 }
      );
    }

    const expectedBundleId =
      process.env.APPLE_BUNDLE_ID ||
      process.env.NEXT_PUBLIC_APPLE_BUNDLE_ID ||
      'io.lingotheory.mobile';

    const verified = hasJws
      ? await verifyAppleJws(
          jwsRepresentation,
          expectedBundleId,
          productId,
          transactionId
        )
      : await verifyAppleReceipt(receipt, expectedBundleId, productId);
    if (!verified.ok) {
      return NextResponse.json({ error: verified.error }, { status: 400 });
    }

    if (
      transactionId &&
      transactionId !== verified.transactionId &&
      transactionId !== verified.originalTransactionId
    ) {
      return NextResponse.json(
        { error: 'Apple transactionId mismatch' },
        { status: 400 }
      );
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
      console.error('Missing env: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error: profileError } = await adminClient
      .from('profiles')
      .update({
        access_level: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('[apple/verify] Error updating profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
    console.log('[apple/verify] Entitlement write succeeded (profiles.access_level=paid)');

    const { error: paymentError } = await adminClient.from('payments').insert({
      user_id: user.id,
      provider: 'apple',
      amount: APPLE_FULL_ACCESS_AMOUNT_PENCE,
      currency: 'gbp',
      status: 'paid',
      apple_transaction_id: verified.transactionId,
      apple_original_transaction_id: verified.originalTransactionId,
      apple_product_id: productId,
    });

    if (paymentError) {
      const isDuplicate =
        paymentError.code === '23505' ||
        (paymentError.message || '').toLowerCase().includes('duplicate');
      if (!isDuplicate) {
        console.error('[apple/verify] Error inserting payment record:', paymentError);
      }
    } else {
      console.log('[apple/verify] Payment record insert succeeded (payments.provider=apple)');
    }

    try {
      const { markPaymentSuccess } = await import('@/lib/analytics/server');
      await markPaymentSuccess(user.id);
    } catch (analyticsErr) {
      console.error('[apple/verify] analytics markPaymentSuccess:', analyticsErr);
    }

    return NextResponse.json({
      ok: true,
      transactionId: verified.transactionId,
    });
  } catch (error) {
    console.error('[apple/verify] Error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to verify Apple purchase',
      },
      { status: 500 }
    );
  }
}

async function verifyAppleJws(
  jwsRepresentation: string,
  expectedBundleId: string,
  expectedProductId: string,
  expectedTransactionId?: string
): Promise<
  | {
      ok: true;
      transactionId: string;
      originalTransactionId: string | null;
    }
  | { ok: false; error: string }
> {
  const verifyInEnvironment = async (environment: Environment) => {
    if (environment === Environment.PRODUCTION && !APPLE_APPLE_ID) {
      return {
        ok: false as const,
        error:
          'Server configuration error: APPLE_APPLE_ID is required for production JWS verification',
      };
    }

    // enableOnlineChecks=false keeps this offline (no network calls during signature verification).
    const verifier = new SignedDataVerifier(
      APPLE_ROOT_CERTIFICATES,
      false,
      environment,
      expectedBundleId,
      environment === Environment.PRODUCTION ? APPLE_APPLE_ID : undefined
    );

    console.log('[apple/verify] verify StoreKit2 transaction JWS', {
      environment,
    });

    const decoded = await verifier.verifyAndDecodeTransaction(
      jwsRepresentation
    );

    if (decoded.productId !== expectedProductId) {
      return {
        ok: false as const,
        error: 'JWS productId does not match this app/product',
      };
    }

    const transactionIdFromPayload = decoded.transactionId;
    if (!transactionIdFromPayload) {
      return { ok: false as const, error: 'JWS missing transactionId' };
    }

    const originalTransactionId =
      decoded.originalTransactionId ?? decoded.transactionId ?? null;

    if (
      expectedTransactionId &&
      expectedTransactionId !== transactionIdFromPayload &&
      expectedTransactionId !== originalTransactionId
    ) {
      return {
        ok: false as const,
        error: 'Apple transactionId mismatch (JWS)',
      };
    }

    // Non-revocation check: presence of revocationDate indicates the transaction was revoked/refunded.
    if (decoded.revocationDate != null || decoded.revocationReason != null) {
      return { ok: false as const, error: 'Apple JWS transaction is revoked' };
    }

    return {
      ok: true as const,
      transactionId: transactionIdFromPayload,
      originalTransactionId,
    };
  };

  // Prefer Sandbox first (covers TestFlight builds).
  try {
    return await verifyInEnvironment(Environment.SANDBOX);
  } catch (e) {
    if (!(e instanceof VerificationException)) {
      return { ok: false, error: 'Apple JWS verification failed' };
    }
    if (e.status !== VerificationStatus.INVALID_ENVIRONMENT) {
      return { ok: false, error: 'Apple JWS verification failed' };
    }
  }

  // Then try Production.
  return verifyInEnvironment(Environment.PRODUCTION);
}

async function verifyAppleReceipt(
  receiptData: string,
  expectedBundleId: string,
  expectedProductId: string
): Promise<
  | {
      ok: true;
      transactionId: string;
      originalTransactionId: string | null;
    }
  | { ok: false; error: string }
> {
  const sharedSecret =
    process.env.APPLE_IAP_SHARED_SECRET || process.env.APPLE_SHARED_SECRET;

  const payload: Record<string, unknown> = {
    'receipt-data': receiptData,
    'exclude-old-transactions': true,
  };
  if (sharedSecret) {
    payload.password = sharedSecret;
  }

  let result: AppleVerifyReceiptResponse;
  try {
    result = await postVerifyReceipt(
      'https://buy.itunes.apple.com/verifyReceipt',
      payload,
      'production'
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes('timed out')
    ) {
      return { ok: false, error: 'Apple receipt verification timed out' };
    }
    throw error;
  }

  // Sandbox receipt sent to production → retry sandbox
  if (result.status === 21007) {
    console.log('[apple/verify] Sandbox fallback used');
    try {
      result = await postVerifyReceipt(
        'https://sandbox.itunes.apple.com/verifyReceipt',
        payload,
        'sandbox'
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes('timed out')
      ) {
        return { ok: false, error: 'Apple receipt verification timed out' };
      }
      throw error;
    }
  }

  if (result.status !== 0) {
    return {
      ok: false,
      error: `Apple receipt validation failed (status ${result.status})`,
    };
  }

  if (result.receipt?.bundle_id && result.receipt.bundle_id !== expectedBundleId) {
    return { ok: false, error: 'Receipt bundle ID does not match this app' };
  }

  const purchases = [
    ...(result.latest_receipt_info || []),
    ...(result.receipt?.in_app || []),
  ];

  const match = purchases.find(
    (p) =>
      p.product_id === expectedProductId &&
      !!p.transaction_id &&
      !p.cancellation_date_ms
  );

  if (!match?.transaction_id) {
    return {
      ok: false,
      error: 'No valid Full Access purchase found in Apple receipt',
    };
  }

  return {
    ok: true,
    transactionId: match.transaction_id,
    originalTransactionId: match.original_transaction_id || match.transaction_id,
  };
}

async function postVerifyReceipt(
  url: string,
  payload: Record<string, unknown>,
  env: 'production' | 'sandbox'
): Promise<AppleVerifyReceiptResponse> {
  const controller = new AbortController();
  const timeoutMs = 15_000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log(`[apple/verify] verifyReceipt started (${env})`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Apple verifyReceipt HTTP ${response.status}`);
    }

    const data = (await response.json()) as AppleVerifyReceiptResponse;
    console.log(`[apple/verify] verifyReceipt returned (${env})`, { status: data.status });
    return data;
  } catch (error) {
    if (error instanceof Error && (error.name === 'AbortError' || /aborted/i.test(error.message))) {
      throw new Error(`Apple verifyReceipt timed out (${env})`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
