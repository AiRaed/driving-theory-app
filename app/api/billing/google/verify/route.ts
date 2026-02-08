import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

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
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, purchaseToken, platform } = body;

    if (!productId || !purchaseToken || platform !== 'android') {
      return NextResponse.json(
        { error: 'Missing required fields: productId, purchaseToken, platform' },
        { status: 400 }
      );
    }

    // Get environment variables
    const packageName = process.env.GOOGLE_PLAY_PACKAGE_NAME;
    const serviceAccountJson = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;

    if (!packageName || !serviceAccountJson) {
      console.error('Missing env: GOOGLE_PLAY_PACKAGE_NAME or GOOGLE_PLAY_SERVICE_ACCOUNT_JSON');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse service account JSON
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

    // Create Google Play Developer API client
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });

    const authClient = await auth.getClient();
    // TypeScript fix: cast auth client to any to bypass type checking
    // The auth client works correctly at runtime even though TypeScript doesn't recognize the type
    const androidpublisher = google.androidpublisher({
      version: 'v3',
      auth: authClient as any,
    });

    // Verify one-time purchase only (no subscriptions)
    const productResponse = await androidpublisher.purchases.products.get({
      packageName,
      productId,
      token: purchaseToken,
    });

    const purchaseData = productResponse.data;
    const purchaseState = purchaseData.purchaseState || null;
    const orderId = purchaseData.orderId || null;
    const consumptionState = purchaseData.consumptionState || null;

    // Verify purchase state: 0 = purchased, 1 = canceled
    if (purchaseState !== 0) {
      return NextResponse.json(
        { error: 'Purchase not completed or was canceled' },
        { status: 400 }
      );
    }

    // Acknowledge purchase if not already acknowledged
    // For non-consumable products, acknowledgment is required
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
        // Continue even if acknowledgment fails - purchase is still valid
      }
    }

    // Use service role key to update database (bypasses RLS)
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

    // Update profile to paid - THIS IS THE ONLY FLAG (same as Stripe)
    const { error: profileError } = await adminClient
      .from('profiles')
      .update({
        access_level: 'paid',
        paid_at: new Date().toISOString(),
        // stripe_customer_id remains null for Google Play purchases
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Store purchase in payments table
    // Calculate amount in smallest currency unit (pence for GBP)
    const amount = 999; // £9.99 in pence
    const currency = 'gbp';

    const { error: paymentError } = await adminClient
      .from('payments')
      .insert({
        user_id: user.id,
        provider: 'google_play',
        amount,
        currency,
        status: 'paid',
        // Store Google Play specific fields
        google_order_id: orderId,
        google_purchase_token: purchaseToken,
        google_product_id: productId,
      });

    if (paymentError) {
      // Log error but don't fail - profile is already updated
      console.error('Error inserting payment record:', paymentError);
      // Continue - profile update is the critical part
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[google/verify] Error:', error);
    
    // Handle Google API errors
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

