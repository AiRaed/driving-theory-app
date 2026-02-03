import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Validate required environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('Missing env: STRIPE_SECRET_KEY');
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is already paid
    const { data: profile } = await supabase
      .from('profiles')
      .select('access_level')
      .eq('id', user.id)
      .single();

    if (profile?.access_level === 'paid') {
      return NextResponse.json(
        { error: 'User already has paid access' },
        { status: 400 }
      );
    }

    // Validate Stripe client
    if (!stripe) {
      return NextResponse.json(
        { error: 'Missing env: STRIPE_SECRET_KEY' },
        { status: 500 }
      );
    }

    const priceId = process.env.STRIPE_PRICE_ID_FULL_ACCESS;
    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing STRIPE_PRICE_ID_FULL_ACCESS' },
        { status: 500 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const successUrl = `${siteUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteUrl}/dashboard`;

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

