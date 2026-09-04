-- =============================================================================
-- SAFE MANUAL RESET: one designated TEST LingoTheory account
-- Run in Supabase SQL Editor. Replace the email before executing.
-- DO NOT expose as a public API endpoint.
-- =============================================================================

-- 1) Preview targeted user
SELECT
  id AS user_id,
  email,
  access_level,
  free_questions_used,
  paid_at,
  stripe_customer_id
FROM public.profiles
WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com');

-- Optional: peek progress row counts for that user
-- (run after confirming user_id from step 1)
/*
SELECT
  (SELECT count(*) FROM public.question_attempts qa
    WHERE qa.user_id = p.id) AS question_attempts,
  (SELECT count(*) FROM public.learning_sessions ls
    WHERE ls.user_id = p.id) AS learning_sessions,
  (SELECT count(*) FROM public.payments pay
    WHERE pay.user_id = p.id) AS payments
FROM public.profiles p
WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com');
*/

-- 2) Reset authoritative entitlement
UPDATE public.profiles
SET
  access_level = 'free',
  free_questions_used = 0,
  paid_at = NULL,
  updated_at = now()
WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com');

-- 3) Reset learning stats mirror (keep row; zero activity counters)
UPDATE public.user_learning_stats
SET
  questions_attempted = 0,
  unique_questions_attempted = 0,
  correct_answers = 0,
  incorrect_answers = 0,
  practice_sessions = 0,
  mock_tests_started = 0,
  mock_tests_completed = 0,
  latest_mock_score = NULL,
  best_mock_score = NULL,
  free_questions_used = 0,
  free_limit_reached = false,
  paywall_seen_count = 0,
  checkout_clicked_count = 0,
  has_purchased = false,
  first_activity_at = NULL,
  last_activity_at = NULL,
  updated_at = now()
WHERE user_id = (
  SELECT id FROM public.profiles
  WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com')
);

-- 4) Reset Practice / Mock attempt history + sessions for THIS user only
DELETE FROM public.question_attempts
WHERE user_id = (
  SELECT id FROM public.profiles
  WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com')
);

DELETE FROM public.learning_sessions
WHERE user_id = (
  SELECT id FROM public.profiles
  WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com')
);

-- Optional product events for this user only
DELETE FROM public.product_events
WHERE user_id = (
  SELECT id FROM public.profiles
  WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com')
);

-- 5) Remove payment bindings for a clean retest (recommended)
--    Access status reads profiles only, but payment rows bind Apple/Google
--    transactions to this LingoTheory user. Deleting them prevents Restore
--    from re-attaching paid via an existing payments link.
DELETE FROM public.payments
WHERE user_id = (
  SELECT id FROM public.profiles
  WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com')
);

-- 6) Verify
SELECT id, email, access_level, free_questions_used, paid_at
FROM public.profiles
WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com');

SELECT
  p.email,
  (SELECT count(*) FROM public.question_attempts qa WHERE qa.user_id = p.id) AS attempts,
  (SELECT count(*) FROM public.learning_sessions ls WHERE ls.user_id = p.id) AS sessions,
  (SELECT count(*) FROM public.payments pay WHERE pay.user_id = p.id) AS payments
FROM public.profiles p
WHERE lower(email) = lower('TEST_USER_EMAIL_HERE@example.com');

-- =============================================================================
-- After reset, why the account stays free
-- =============================================================================
-- • Automatic silent Apple/Google restore on launch/login is DISABLED.
-- • Explicit Restore only succeeds if a payments row already links the store
--   transaction to THIS LingoTheory user (which step 5 deletes).
-- • Do NOT reopen old Stripe success URLs with a paid session_id for this user.
-- • Cross-platform Full Access returns only after a NEW verified purchase while
--   logged into this account (or after you manually set access_level=paid).
-- • Client localStorage caches are account-scoped and cleared on logout/switch;
--   still hard-refresh or re-open the app after SQL reset for a clean UI.
-- =============================================================================
