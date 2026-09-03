-- =============================================================================
-- SAFE MANUAL RESET: one designated TEST LingoTheory account → free trial
-- Run in Supabase SQL Editor. Replace the email before executing.
-- DO NOT expose as a public API endpoint.
-- =============================================================================

-- 1) Preview
SELECT
  id,
  email,
  access_level,
  free_questions_used,
  paid_at,
  stripe_customer_id
FROM public.profiles
WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com');

-- 2) Reset authoritative entitlement
UPDATE public.profiles
SET
  access_level = 'free',
  free_questions_used = 0,
  paid_at = NULL,
  updated_at = now()
WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com');

-- 3) Optional analytics mirror
UPDATE public.user_learning_stats
SET
  free_questions_used = 0,
  free_limit_reached = false,
  has_purchased = false,
  updated_at = now()
WHERE user_id = (
  SELECT id FROM public.profiles
  WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com')
);

-- 4) Remove payment history for a clean retest (recommended)
--    Access status reads profiles only, but payment rows bind Apple/Google
--    transactions to this LingoTheory user. Deleting them prevents Restore
--    from re-attaching paid via an existing payments link.
DELETE FROM public.payments
WHERE user_id = (
  SELECT id FROM public.profiles
  WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com')
);

-- 5) Verify
SELECT id, email, access_level, free_questions_used, paid_at
FROM public.profiles
WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com');

-- =============================================================================
-- After reset, why the account stays free
-- =============================================================================
-- • Automatic silent Apple/Google restore on launch/login is DISABLED.
-- • Explicit Restore only succeeds if a payments row already links the store
--   transaction to THIS LingoTheory user (which step 4 deletes).
-- • Do NOT reopen old Stripe success URLs with a paid session_id for this user.
-- • Cross-platform Full Access returns only after a NEW verified purchase while
--   logged into this account (or after you manually set access_level=paid).
-- =============================================================================
