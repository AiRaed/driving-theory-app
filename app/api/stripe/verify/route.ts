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
    // Validate Stripe client
    if (!stripe) {
      console.error('Missing env: STRIPE_SECRET_KEY');
      return NextResponse.json(
        { error: 'Missing env: STRIPE_SECRET_KEY' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent'],
    });

    // Verify the session belongs to this user
    if (session.metadata?.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Session does not belong to this user' },
        { status: 403 }
      );
    }

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Use service role key to update database (bypasses RLS)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.error('Missing env: SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json(
        { error: 'Missing env: SUPABASE_SERVICE_ROLE_KEY' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      console.error('Missing env: SUPABASE_URL');
      return NextResponse.json(
        { error: 'Missing env: SUPABASE_URL' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Update profile to paid
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

    // Create or update payment record
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
    const amount = session.amount_total || 0;
    
    const { error: paymentError } = await adminClient
      .from('payments')
      .upsert({
        user_id: user.id,
        stripe_checkout_session_id: session_id,
        stripe_payment_intent_id: paymentIntent?.id || null,
        amount: amount,
        currency: session.currency || 'gbp',
        status: 'paid',
      }, {
        onConflict: 'stripe_checkout_session_id',
      });

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      // Don't fail the request if payment record creation fails
      // The profile update is more important
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

