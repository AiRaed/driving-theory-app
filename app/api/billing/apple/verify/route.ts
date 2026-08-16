import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import {
  APPLE_FULL_ACCESS_AMOUNT_PENCE,
  APPLE_FULL_ACCESS_PRODUCT_ID,
} from '@/lib/billing/appleProduct';

export const dynamic = 'force-dynamic';

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
    const { productId, platform, transactionId, receipt } = body;

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

    if (!receipt || typeof receipt !== 'string') {
      return NextResponse.json(
        { error: 'Apple receipt is required for verification' },
        { status: 400 }
      );
    }

    const expectedBundleId =
      process.env.APPLE_BUNDLE_ID ||
      process.env.NEXT_PUBLIC_APPLE_BUNDLE_ID ||
      'io.lingotheory.mobile';

    const verified = await verifyAppleReceipt(receipt, expectedBundleId, productId);
    if (!verified.ok) {
      return NextResponse.json({ error: verified.error }, { status: 400 });
    }

    if (
      transactionId &&
      transactionId !== verified.transactionId &&
      transactionId !== verified.originalTransactionId
    ) {
      console.warn('[apple/verify] Client transactionId mismatch', {
        transactionId,
        verifiedTransactionId: verified.transactionId,
      });
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

  let result = await postVerifyReceipt(
    'https://buy.itunes.apple.com/verifyReceipt',
    payload
  );

  // Sandbox receipt sent to production → retry sandbox
  if (result.status === 21007) {
    result = await postVerifyReceipt(
      'https://sandbox.itunes.apple.com/verifyReceipt',
      payload
    );
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
  payload: Record<string, unknown>
): Promise<AppleVerifyReceiptResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Apple verifyReceipt HTTP ${response.status}`);
  }

  return (await response.json()) as AppleVerifyReceiptResponse;
}
