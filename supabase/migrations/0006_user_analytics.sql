-- User behavioural analytics (additive — does not alter payments/questions/auth data)

CREATE TABLE IF NOT EXISTS public.user_learning_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  questions_attempted integer NOT NULL DEFAULT 0,
  unique_questions_attempted integer NOT NULL DEFAULT 0,
  correct_answers integer NOT NULL DEFAULT 0,
  incorrect_answers integer NOT NULL DEFAULT 0,
  practice_sessions integer NOT NULL DEFAULT 0,
  mock_tests_started integer NOT NULL DEFAULT 0,
  mock_tests_completed integer NOT NULL DEFAULT 0,
  latest_mock_score integer,
  best_mock_score integer,
  free_questions_used integer NOT NULL DEFAULT 0,
  free_limit_reached boolean NOT NULL DEFAULT false,
  paywall_seen_count integer NOT NULL DEFAULT 0,
  checkout_clicked_count integer NOT NULL DEFAULT 0,
  has_purchased boolean NOT NULL DEFAULT false,
  preferred_language text,
  last_language_used text,
  first_activity_at timestamptz,
  last_activity_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.question_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  topic text,
  answer_selected text,
  correct_answer text,
  is_correct boolean NOT NULL DEFAULT false,
  mode text NOT NULL CHECK (mode IN ('practice', 'mock')),
  language text,
  session_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id, session_id)
);

CREATE TABLE IF NOT EXISTS public.learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode text NOT NULL CHECK (mode IN ('practice', 'mock')),
  language text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  questions_attempted integer NOT NULL DEFAULT 0,
  correct_answers integer NOT NULL DEFAULT 0,
  score integer,
  is_completed boolean NOT NULL DEFAULT false,
  client_session_id text
);

CREATE UNIQUE INDEX IF NOT EXISTS learning_sessions_user_client_uidx
  ON public.learning_sessions (user_id, client_session_id)
  WHERE client_session_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.product_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS question_attempts_user_id_idx ON public.question_attempts (user_id);
CREATE INDEX IF NOT EXISTS question_attempts_created_at_idx ON public.question_attempts (created_at DESC);
CREATE INDEX IF NOT EXISTS question_attempts_question_id_idx ON public.question_attempts (question_id);
CREATE INDEX IF NOT EXISTS question_attempts_topic_idx ON public.question_attempts (topic);
CREATE INDEX IF NOT EXISTS learning_sessions_user_id_idx ON public.learning_sessions (user_id);
CREATE INDEX IF NOT EXISTS learning_sessions_started_at_idx ON public.learning_sessions (started_at DESC);
CREATE INDEX IF NOT EXISTS product_events_user_id_idx ON public.product_events (user_id);
CREATE INDEX IF NOT EXISTS product_events_event_name_idx ON public.product_events (event_name);
CREATE INDEX IF NOT EXISTS product_events_created_at_idx ON public.product_events (created_at DESC);
CREATE INDEX IF NOT EXISTS user_learning_stats_last_activity_idx ON public.user_learning_stats (last_activity_at DESC);

CREATE OR REPLACE FUNCTION public.set_user_learning_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_user_learning_stats_updated_at ON public.user_learning_stats;
CREATE TRIGGER set_user_learning_stats_updated_at
  BEFORE UPDATE ON public.user_learning_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_learning_stats_updated_at();

ALTER TABLE public.user_learning_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_events ENABLE ROW LEVEL SECURITY;

-- No direct client access — app writes via service-role APIs only
CREATE POLICY "uls_no_client" ON public.user_learning_stats FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "qa_no_client" ON public.question_attempts FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "ls_no_client" ON public.learning_sessions FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "pe_no_client" ON public.product_events FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

-- Safe backfill: purchase + free usage from profiles only (no fabricated activity)
INSERT INTO public.user_learning_stats (
  user_id,
  free_questions_used,
  free_limit_reached,
  has_purchased,
  updated_at
)
SELECT
  p.id,
  COALESCE(p.free_questions_used, 0),
  COALESCE(p.free_questions_used, 0) >= 15,
  (p.access_level = 'paid'),
  now()
FROM public.profiles p
ON CONFLICT (user_id) DO UPDATE SET
  free_questions_used = EXCLUDED.free_questions_used,
  free_limit_reached = EXCLUDED.free_limit_reached OR public.user_learning_stats.free_limit_reached,
  has_purchased = EXCLUDED.has_purchased OR public.user_learning_stats.has_purchased,
  updated_at = now();
