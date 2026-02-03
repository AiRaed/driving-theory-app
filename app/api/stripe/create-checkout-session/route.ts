import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    // If already paid, return success with alreadyPaid flag (NOT an error)
    const { data: profile } = await supabase
      .from('profiles')
      .select('access_level')
      .eq('id', user.id)
      .single();

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
