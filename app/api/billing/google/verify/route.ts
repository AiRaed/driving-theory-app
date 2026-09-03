import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GOOGLE_FULL_ACCESS_PRODUCT_ID } from '@/lib/billing/googleProduct';

export const dynamic = 'force-dynamic';

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
    const { productId, purchaseToken, platform, restore } = body;

    if (!productId || !purchaseToken || platform !== 'android') {
      return NextResponse.json(
        { error: 'Missing required fields: productId, purchaseToken, platform' },
        { status: 400 }
      );
    }

    if (productId !== GOOGLE_FULL_ACCESS_PRODUCT_ID) {
      return NextResponse.json({ error: 'Invalid Google Play product ID' }, { status: 400 });
    }

    const packageName = process.env.GOOGLE_PLAY_PACKAGE_NAME;
    const serviceAccountJson = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;

    if (!packageName || !serviceAccountJson) {
      console.error('Missing env: GOOGLE_PLAY_PACKAGE_NAME or GOOGLE_PLAY_SERVICE_ACCOUNT_JSON');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (error) {
      console.error('Failed to parse GOOGLE_PLAY_SERVICE_ACCOUNT_JSON:', error);
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
      return NextResponse.json(
        { error: 'Purchase is still pending' },
        { status: 400 }
      );
    }

    if (purchaseState !== 0) {
      return NextResponse.json(
        { error: 'Purchase not completed or was canceled' },
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

    const { data: existingPayment } = await adminClient
      .from('payments')
      .select('id, user_id')
      .eq('google_purchase_token', purchaseToken)
      .maybeSingle();

    if (existingPayment) {
      if (existingPayment.user_id !== user.id) {
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

      return NextResponse.json({ ok: true, alreadyVerified: true });
    }

    // Explicit restore: only refresh entitlement already bound to this account.
    if (restore === true) {
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
      } catch (ackError) {
        console.error('[google/verify] Failed to acknowledge purchase:', ackError);
      }
    }

    const { error: profileError } = await adminClient
      .from('profiles')
      .update({
        access_level: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    const amount = 999;
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
        console.error('Error inserting payment record:', paymentError);
      }
    }

    try {
      const { markPaymentSuccess } = await import('@/lib/analytics/server');
      await markPaymentSuccess(user.id);
    } catch (analyticsErr) {
      console.error('[google/verify] analytics markPaymentSuccess:', analyticsErr);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[google/verify] Error:', error);

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
