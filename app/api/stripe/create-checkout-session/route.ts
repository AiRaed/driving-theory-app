import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * create-checkout-session API
 * Before creating Stripe session, check profile access in Supabase (service role)
 * If access_level === 'paid' return 200 { alreadyPaid: true }
 * Otherwise create Stripe Checkout session and return { url }
 */

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID_FULL_ACCESS;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Missing STRIPE_SECRET_KEY environment variable' },
        { status: 500 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing STRIPE_PRICE_ID_FULL_ACCESS environment variable' },
        { status: 500 }
      );
    }

    const isProd = process.env.NODE_ENV === 'production';

    if (isProd && !siteUrl) {
      return NextResponse.json(
        { error: 'Missing NEXT_PUBLIC_SITE_URL environment variable in production' },
        { status: 500 }
      );
    }

    const baseUrl = isProd
      ? siteUrl
      : (siteUrl || 'http://localhost:3000');

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'Unable to determine site URL' },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is already paid BEFORE creating Stripe session
    // Use service role key to query profiles (bypasses RLS)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
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

    // Query profiles table - access_level is the ONLY source of truth
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('access_level')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('[create-checkout-session] Error querying profile:', profileError);
    }

    // If already paid, return success with alreadyPaid flag (NOT an error)
    if (profile?.access_level === 'paid') {
      // Return HTTP 200 with alreadyPaid flag - NOT an error
      // This allows UI to refresh access and redirect gracefully
      return NextResponse.json({ alreadyPaid: true }, { status: 200 });
    }

    // Use default Stripe API version (compatible with installed package)
    const stripe = new Stripe(stripeSecretKey);

    const successUrl = `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/dashboard`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email || undefined,
      metadata: {
        user_id: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
