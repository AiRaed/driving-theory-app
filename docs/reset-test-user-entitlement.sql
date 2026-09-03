-- =============================================================================
-- SAFE MANUAL RESET: one designated test user → unpaid free trial
-- Run in Supabase SQL Editor. Replace the email below before executing.
-- DO NOT expose this as a public API endpoint.
-- =============================================================================

-- 1) Preview the target user (confirm id / current entitlement)
SELECT
  id,
  email,
  access_level,
  free_questions_used,
  paid_at,
  stripe_customer_id
FROM public.profiles
WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com');

-- 2) Reset profile entitlement (authoritative paid/free gate)
UPDATE public.profiles
SET
  access_level = 'free',
  free_questions_used = 0,
  paid_at = NULL,
  -- Keep stripe_customer_id unless you also want a clean Stripe customer link:
  -- stripe_customer_id = NULL,
  updated_at = now()
WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com');

-- 3) Optional: clear analytics mirror so admin UI matches
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

-- 4) Optional: remove payment rows so admin/history does not show prior purchases.
--    Access status itself does NOT read payments — only profiles.access_level.
--    Still recommended for clean test accounts.
DELETE FROM public.payments
WHERE user_id = (
  SELECT id FROM public.profiles
  WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com')
);

-- 5) Verify
SELECT
  id,
  email,
  access_level,
  free_questions_used,
  paid_at
FROM public.profiles
WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com');

-- =============================================================================
-- IMPORTANT: why a reset user can become paid again without paying
-- =============================================================================
-- Stripe:
--   - Returning to /payment/success?session_id=<OLD_PAID_SESSION> can re-verify
--     that session and set access_level=paid again if metadata.user_id matches.
--   - Mitigation: do not reuse old success URLs; use a fresh unpaid checkout only.
--
-- Google Play / Apple:
--   - Explicit "Restore Purchases" still verifies device-store ownership and can
--     mark the *currently logged-in* profile paid if that store account owns IAP.
--   - Automatic silent restore on app launch/login has been removed.
--   - Mitigation for testing: use a store sandbox account that does NOT own the
--     product, or test on a device/account without the purchase, and avoid tapping
--     Restore Purchases on a store account that already bought Full Access.
-- =============================================================================
