import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GOOGLE_FULL_ACCESS_PRODUCT_ID } from '@/lib/billing/googleProduct';

export const dynamic = 'force-dynamic';

async function logGoogleVerifyFailure(
  userId: string | null,
  fields: { stage: string; http_status: number; error_category: string }
): Promise<void> {
  console.log('[google/verify] rejected', {
    stage: fields.stage,
    http_status: fields.http_status,
    error_category: fields.error_category,
  });
  if (!userId) return;
  try {
    const { recordProductEvent } = await import('@/lib/analytics/server');
    await recordProductEvent(userId, 'purchase_verify_failed', {
      platform: 'android',
      source: 'google_play_iap',
      stage: fields.stage,
      http_status: fields.http_status,
      error_category: fields.error_category,
      product_id: GOOGLE_FULL_ACCESS_PRODUCT_ID,
    });
  } catch {
    console.error('[google/verify] diagnostic event failed');
  }
}

/**
 * Verify Google Play purchase and update Supabase
 * POST /api/billing/google/verify
 * Body: { productId: string, purchaseToken: string, platform: "android" }
 *
 * Verifies purchase with Google Play Developer API and updates:
 * - profiles.access_level = 'paid'
 * - payments table with Google Play purchase details
 */
export async function POST(request: NextRequest) {
  let authedUserId: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('[google/verify] rejected', { stage: 'auth', http_status: 401, error_category: 'unknown' });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    authedUserId = user.id;

    const body = await request.json();
    const { productId, purchaseToken, platform, restore } = body;

    console.log('[google/verify] request received', {
      platform: platform === 'android' ? 'android' : null,
      restore: restore === true,
      purchase_token_present: typeof purchaseToken === 'string' && purchaseToken.length > 0,
      product_id: typeof productId === 'string' ? productId : null,
    });

    if (!productId || !purchaseToken || platform !== 'android') {
      await logGoogleVerifyFailure(user.id, {
        stage: 'payload',
        http_status: 400,
        error_category: 'purchase_token_missing',
      });
      return NextResponse.json(
        { error: 'Missing required fields: productId, purchaseToken, platform' },
        { status: 400 }
      );
    }

    if (productId !== GOOGLE_FULL_ACCESS_PRODUCT_ID) {
      await logGoogleVerifyFailure(user.id, {
        stage: 'product',
        http_status: 400,
        error_category: 'verify_4xx',
      });
      return NextResponse.json({ error: 'Invalid Google Play product ID' }, { status: 400 });
    }

    const packageName = process.env.GOOGLE_PLAY_PACKAGE_NAME;
    const serviceAccountJson = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;

    if (!packageName || !serviceAccountJson) {
      console.error('[google/verify] missing server configuration');
      await logGoogleVerifyFailure(user.id, {
        stage: 'config',
        http_status: 500,
        error_category: 'verify_5xx',
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch {
      console.error('[google/verify] service account JSON could not be parsed');
      await logGoogleVerifyFailure(user.id, {
        stage: 'config',
        http_status: 500,
        error_category: 'verify_5xx',
      });
      return NextResponse.json(
        { error: 'Invalid service account configuration' },
        { status: 500 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });

    const authClient = await auth.getClient();
    const androidpublisher = google.androidpublisher({
      version: 'v3',
      // googleapis client typing is loose for credential clients
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      auth: authClient as any,
    });

    const productResponse = await androidpublisher.purchases.products.get({
      packageName,
      productId,
      token: purchaseToken,
    });

    const purchaseData = productResponse.data;
    const purchaseState = purchaseData.purchaseState ?? null;
    const orderId = purchaseData.orderId || null;

    // 0 = purchased, 1 = canceled, 2 = pending
    if (purchaseState === 2) {
      await logGoogleVerifyFailure(user.id, {
        stage: 'purchase_state',
        http_status: 400,
        error_category: 'pending',
      });
      return NextResponse.json(
        { error: 'Purchase is still pending' },
        { status: 400 }
      );
    }

    if (purchaseState !== 0) {
      await logGoogleVerifyFailure(user.id, {
        stage: 'purchase_state',
        http_status: 400,
        error_category: 'verify_4xx',
      });
      return NextResponse.json(
        { error: 'Purchase not completed or was canceled' },
        { status: 400 }
      );
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
      console.error('[google/verify] missing supabase server configuration');
      await logGoogleVerifyFailure(user.id, {
        stage: 'config',
        http_status: 500,
        error_category: 'verify_5xx',
      });
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

    const { data: existingPayment } = await adminClient
      .from('payments')
      .select('id, user_id')
      .eq('google_purchase_token', purchaseToken)
      .maybeSingle();

    if (existingPayment) {
      if (existingPayment.user_id !== user.id) {
        await logGoogleVerifyFailure(user.id, {
          stage: 'account_binding',
          http_status: 403,
          error_category: 'account_binding_error',
        });
        return NextResponse.json(
          {
            error:
              'This Google Play purchase is linked to a different LingoTheory account. Sign in to that account for Full Access.',
          },
          { status: 403 }
        );
      }

      await adminClient
        .from('profiles')
        .update({
          access_level: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      console.log('[google/verify] verification success (already bound to this account)');
      console.log('[google/verify] entitlement write succeeded');
      return NextResponse.json({ ok: true, alreadyVerified: true });
    }

    // Explicit restore: only refresh entitlement already bound to this account.
    if (restore === true) {
      await logGoogleVerifyFailure(user.id, {
        stage: 'restore_unbound',
        http_status: 403,
        error_category: 'already_owned',
      });
      return NextResponse.json(
        {
          error:
            'No Full Access purchase is linked to this LingoTheory account. Purchase while logged in, or sign in to the account that bought Full Access.',
        },
        { status: 403 }
      );
    }

    // Acknowledge purchase if not already acknowledged (required for non-consumable)
    if (!purchaseData.acknowledgementState || purchaseData.acknowledgementState === 0) {
      try {
        await androidpublisher.purchases.products.acknowledge({
          packageName,
          productId,
          token: purchaseToken,
        });
        console.log('[google/verify] Purchase acknowledged successfully');
      } catch {
        console.error('[google/verify] Failed to acknowledge purchase');
      }
    }

    console.log('[google/verify] verification success', {
      purchase_state: purchaseState,
      purchase_token_present: true,
    });

    const { error: profileError } = await adminClient
      .from('profiles')
      .update({
        access_level: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('[google/verify] entitlement write failed');
      await logGoogleVerifyFailure(user.id, {
        stage: 'entitlement',
        http_status: 500,
        error_category: 'verify_5xx',
      });
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
    console.log('[google/verify] entitlement write succeeded');

    // Metadata/accounting only (GBP pence). Does NOT determine Google Play billing price —
    // Play Console / device product details are authoritative for what the user pays.
    const amount = 499;
    const currency = 'gbp';

    const { error: paymentError } = await adminClient.from('payments').insert({
      user_id: user.id,
      provider: 'google_play',
      amount,
      currency,
      status: 'paid',
      google_order_id: orderId,
      google_purchase_token: purchaseToken,
      google_product_id: productId,
    });

    if (paymentError) {
      const isDuplicate =
        paymentError.code === '23505' ||
        (paymentError.message || '').toLowerCase().includes('duplicate');
      if (!isDuplicate) {
        console.error('[google/verify] payment record insert failed');
      }
    }

    try {
      const { markPaymentSuccess } = await import('@/lib/analytics/server');
      await markPaymentSuccess(user.id);
    } catch {
      console.error('[google/verify] analytics markPaymentSuccess failed');
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const httpStatus = message.includes('410') ? 400 : 500;
    console.error('[google/verify] error_category', httpStatus >= 500 ? 'verify_5xx' : 'verify_4xx');
    await logGoogleVerifyFailure(authedUserId, {
      stage: 'google_api',
      http_status: httpStatus,
      error_category: httpStatus >= 500 ? 'verify_5xx' : 'verify_4xx',
    });

    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        return NextResponse.json(
          { error: 'Google Play API authentication failed' },
          { status: 500 }
        );
      }
      if (error.message.includes('410')) {
        return NextResponse.json(
          { error: 'Purchase token is no longer valid' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify purchase' },
      { status: 500 }
    );
  }
}
