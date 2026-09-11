-- Platform tracking for Admin Users (additive — does not alter entitlement/payments)

ALTER TABLE public.user_learning_stats
  ADD COLUMN IF NOT EXISTS last_platform text,
  ADD COLUMN IF NOT EXISTS platforms_used text[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.user_learning_stats.last_platform IS
  'Runtime client platform of most recent activity: ios | android | web (Capacitor.getPlatform). Not payment provider.';

COMMENT ON COLUMN public.user_learning_stats.platforms_used IS
  'Unique set of runtime platforms seen for this user (ios/android/web). Append-only.';

-- Optional integrity: only allow known values when set
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_learning_stats_last_platform_check'
  ) THEN
    ALTER TABLE public.user_learning_stats
      ADD CONSTRAINT user_learning_stats_last_platform_check
      CHECK (
        last_platform IS NULL
        OR last_platform IN ('ios', 'android', 'web')
      );
  END IF;
END $$;
