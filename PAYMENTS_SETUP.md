# Payments Setup Guide

This guide explains how to set up Stripe payments for the driving theory app.

## Environment Variables

Add the following environment variables to your `.env.local` file (for local development) or your hosting platform's environment variables (for production):

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key (test or live)
STRIPE_PRICE_ID=price_...     # Your Stripe price ID for the £9.99 one-time payment

# Supabase (if not already set)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Getting Your Stripe Keys

### 1. Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com) and create an account
2. Complete the account setup process

### 2. Get Your API Keys
1. Log in to your Stripe Dashboard
2. Go to **Developers** → **API keys**
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
4. Copy the **Secret key** - this is your `STRIPE_SECRET_KEY`

**Important:** 
- Use `sk_test_...` keys for testing
- Use `sk_live_...` keys for production
- Never commit secret keys to version control

### 3. Create a Product and Price
1. In Stripe Dashboard, go to **Products** → **Add product**
2. Fill in:
   - **Name**: "Unlimited Practice Access" (or similar)
   - **Description**: "One-time payment for unlimited practice questions"
   - **Pricing**: 
     - **Price**: £9.99
     - **Billing**: One time
     - **Currency**: GBP
3. Click **Save product**
4. Copy the **Price ID** (starts with `price_...`) - this is your `STRIPE_PRICE_ID`

## Database Setup

### Run Migrations
The app includes a migration to add the `free_questions_used` column to the profiles table. Make sure to run this migration in your Supabase project:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the migration file: `supabase/migrations/0002_add_free_questions_used.sql`

Or if using Supabase CLI:
```bash
supabase db push
```

## Testing in Test Mode

### 1. Use Test Mode Keys
Make sure you're using test mode keys (`sk_test_...` and a test price ID) in your `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...  # Test price ID
```

### 2. Test Card Numbers
Stripe provides test card numbers for testing payments:

**Successful Payment:**
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Declined Payment:**
- Card number: `4000 0000 0000 0002`
- Use this to test payment failure scenarios

### 3. Test the Flow
1. Start your development server: `npm run dev`
2. Log in to your app
3. Go to Practice mode
4. Answer 15 questions (you'll see the count increment)
5. On the 16th attempt to continue, the paywall should appear
6. Click "Continue to Payment"
7. Use test card `4242 4242 4242 4242` to complete payment
8. You should be redirected to `/payment/success`
9. After verification, you should be redirected to dashboard
10. Try Practice again - paywall should not appear

### 4. Verify in Stripe Dashboard
1. Go to Stripe Dashboard → **Payments**
2. You should see test payments with status "Succeeded"
3. Check the payment details to verify metadata (user_id) is stored

### 5. Verify in Supabase
1. Go to Supabase Dashboard → **Table Editor** → `profiles`
2. Find your test user
3. Verify:
   - `access_level` is set to `paid`
   - `paid_at` has a timestamp
   - `free_questions_used` shows the count before payment

4. Check `payments` table:
   - Should have a record with `status = 'paid'`
   - `stripe_checkout_session_id` should match the session from Stripe

## Production Setup

### 1. Switch to Live Mode
1. In Stripe Dashboard, toggle to **Live mode** (top right)
2. Get your live API keys (starts with `sk_live_...`)
3. Create a live product/price
4. Update your production environment variables with live keys

### 2. Webhook Setup (Optional but Recommended)
For production, set up webhooks to handle payment events:

1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` env var

**Note:** The current implementation uses redirect-based verification, but webhooks provide more reliable payment confirmation.

## Troubleshooting

### Paywall Not Appearing
- Check that `free_questions_used` is being incremented (check Supabase)
- Verify user is not already `paid` in the profiles table
- Check browser console for errors

### Payment Verification Fails
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify the session_id is being passed correctly in the URL
- Check server logs for detailed error messages

### Environment Variables Not Loading
- Make sure `.env.local` is in the project root (not committed to git)
- Restart your development server after adding env vars
- For production, set env vars in your hosting platform's dashboard

## Security Notes

- Never expose `STRIPE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Always use environment variables for sensitive keys
- Use test keys for development, live keys only for production
- Regularly rotate your API keys
- Monitor Stripe Dashboard for suspicious activity

