import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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

    // Get or create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    // Create profile if it doesn't exist
    if (!profile) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          access_level: 'free',
          free_questions_used: 0,
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return NextResponse.json(
          { error: 'Failed to create profile' },
          { status: 500 }
        );
      }
    }

    // Check if user is already paid
    if (profile?.access_level === 'paid') {
      return NextResponse.json(
        { error: 'User already has paid access' },
        { status: 400 }
      );
    }

    // Validate Stripe client
    if (!stripe) {
      console.error('Missing env: STRIPE_SECRET_KEY');
      return NextResponse.json(
        { error: 'Missing env: STRIPE_SECRET_KEY' },
        { status: 400 }
      );
    }

    // Get the price ID from environment variable
    const priceId = process.env.STRIPE_PRICE_ID_FULL_ACCESS;
    if (!priceId) {
      console.error('Missing env: STRIPE_PRICE_ID_FULL_ACCESS');
      return NextResponse.json(
        { error: 'Missing env: STRIPE_PRICE_ID_FULL_ACCESS' },
        { status: 400 }
      );
    }

    // Get the origin for success/cancel URLs
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const successUrl = `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/practice`;

    // Create Stripe Checkout session
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

