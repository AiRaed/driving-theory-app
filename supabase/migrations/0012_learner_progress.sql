-- Persistent practice learning progress.
-- One latest answer per user, question and content version.
-- Attempt history keeps earlier submissions for later analytics.
-- Mock Test attempts are not written here.
-- Account deletion: both tables reference auth.users ON DELETE CASCADE.
--
-- Additive only. Existing production rows stay in place.
-- CREATE TABLE IF NOT EXISTS keeps any rows already stored if the script is run again.
-- Apply once in the Supabase SQL Editor. Do not edit it after production apply.

CREATE TABLE IF NOT EXISTS public.learner_question_progress (
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  question_id text NOT NULL REFERENCES public.questions (id) ON UPDATE CASCADE ON DELETE CASCADE,
  content_version text NOT NULL,
  topic_id text NOT NULL,
  selected_answer integer NOT NULL CHECK (selected_answer BETWEEN 1 AND 4),
  is_correct boolean NOT NULL,
  attempt_count integer NOT NULL DEFAULT 1 CHECK (attempt_count >= 1),
  first_answered_at timestamptz NOT NULL DEFAULT now(),
  last_answered_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, question_id, content_version)
);

CREATE TABLE IF NOT EXISTS public.learner_attempt_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  question_id text NOT NULL REFERENCES public.questions (id) ON UPDATE CASCADE ON DELETE CASCADE,
  content_version text NOT NULL,
  topic_id text NOT NULL,
  selected_answer integer NOT NULL CHECK (selected_answer BETWEEN 1 AND 4),
  is_correct boolean NOT NULL,
  client_attempt_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, client_attempt_id)
);

CREATE INDEX IF NOT EXISTS learner_question_progress_user_version_idx
  ON public.learner_question_progress (user_id, content_version);

-- Phase 2 can list incorrect questions for one topic or, by omitting topic_id, across topics.
CREATE INDEX IF NOT EXISTS learner_question_progress_incorrect_idx
  ON public.learner_question_progress (user_id, content_version, topic_id)
  WHERE is_correct = false;

CREATE INDEX IF NOT EXISTS learner_attempt_history_user_question_idx
  ON public.learner_attempt_history (user_id, question_id, created_at DESC);

ALTER TABLE public.learner_question_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_attempt_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS learner_progress_select_own ON public.learner_question_progress;
CREATE POLICY learner_progress_select_own
  ON public.learner_question_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS learner_progress_no_client_write ON public.learner_question_progress;
DROP POLICY IF EXISTS learner_progress_no_client_insert ON public.learner_question_progress;
CREATE POLICY learner_progress_no_client_insert
  ON public.learner_question_progress
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS learner_progress_no_client_update ON public.learner_question_progress;
CREATE POLICY learner_progress_no_client_update
  ON public.learner_question_progress
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS learner_progress_no_client_delete ON public.learner_question_progress;
CREATE POLICY learner_progress_no_client_delete
  ON public.learner_question_progress
  FOR DELETE
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS learner_history_select_own ON public.learner_attempt_history;
CREATE POLICY learner_history_select_own
  ON public.learner_attempt_history
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS learner_history_no_client_write ON public.learner_attempt_history;
DROP POLICY IF EXISTS learner_history_no_client_insert ON public.learner_attempt_history;
CREATE POLICY learner_history_no_client_insert
  ON public.learner_attempt_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS learner_history_no_client_update ON public.learner_attempt_history;
CREATE POLICY learner_history_no_client_update
  ON public.learner_attempt_history
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS learner_history_no_client_delete ON public.learner_attempt_history;
CREATE POLICY learner_history_no_client_delete
  ON public.learner_attempt_history
  FOR DELETE
  TO anon, authenticated
  USING (false);

-- 0013 replaces this function. Re-running the replacement below would drop that
-- attempt-identity check, so stop when it is already installed.
DO $guard$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'record_learner_practice_answer'
      AND pg_get_functiondef(p.oid) LIKE '%attempt id reused%'
  ) THEN
    RAISE EXCEPTION '0012 stopped: attempt identity is already installed. Do not replace record_learner_practice_answer from this script.';
  END IF;
END
$guard$;

CREATE OR REPLACE FUNCTION public.record_learner_practice_answer(
  p_user_id uuid,
  p_question_id text,
  p_selected_answer integer,
  p_client_attempt_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  q public.questions%ROWTYPE;
  inserted_id uuid;
  row public.learner_question_progress%ROWTYPE;
BEGIN
  IF p_user_id IS NULL OR p_question_id IS NULL OR p_client_attempt_id IS NULL THEN
    RAISE EXCEPTION 'missing progress fields';
  END IF;
  IF p_selected_answer < 1 OR p_selected_answer > 4 THEN
    RAISE EXCEPTION 'invalid answer';
  END IF;

  SELECT * INTO q
  FROM public.questions
  WHERE id = p_question_id
    AND status = 'published'
    AND content_version = 'v2';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'question not in active bank';
  END IF;

  INSERT INTO public.learner_attempt_history (
    user_id,
    question_id,
    content_version,
    topic_id,
    selected_answer,
    is_correct,
    client_attempt_id
  ) VALUES (
    p_user_id,
    q.id,
    q.content_version,
    q.topic_id,
    p_selected_answer,
    q.correct_answer = p_selected_answer,
    p_client_attempt_id
  )
  ON CONFLICT (user_id, client_attempt_id) DO NOTHING
  RETURNING id INTO inserted_id;

  IF inserted_id IS NULL THEN
    SELECT * INTO row
    FROM public.learner_question_progress
    WHERE user_id = p_user_id
      AND question_id = q.id
      AND content_version = q.content_version;

    -- Same client attempt already stored. Do not count it again.
    -- If that attempt never reached the progress row, fall through and store it once.
    IF FOUND THEN
      RETURN jsonb_build_object(
        'duplicate', true,
        'question_id', q.id,
        'topic_id', q.topic_id,
        'is_correct', row.is_correct,
        'selected_answer', row.selected_answer,
        'attempt_count', row.attempt_count
      );
    END IF;
  END IF;

  INSERT INTO public.learner_question_progress (
    user_id,
    question_id,
    content_version,
    topic_id,
    selected_answer,
    is_correct,
    attempt_count,
    first_answered_at,
    last_answered_at
  ) VALUES (
    p_user_id,
    q.id,
    q.content_version,
    q.topic_id,
    p_selected_answer,
    q.correct_answer = p_selected_answer,
    1,
    now(),
    now()
  )
  ON CONFLICT (user_id, question_id, content_version) DO UPDATE SET
    topic_id = EXCLUDED.topic_id,
    selected_answer = EXCLUDED.selected_answer,
    is_correct = EXCLUDED.is_correct,
    attempt_count = public.learner_question_progress.attempt_count + 1,
    last_answered_at = now()
  RETURNING * INTO row;

  RETURN jsonb_build_object(
    'duplicate', false,
    'question_id', row.question_id,
    'topic_id', row.topic_id,
    'is_correct', row.is_correct,
    'selected_answer', row.selected_answer,
    'attempt_count', row.attempt_count
  );
END;
$$;

REVOKE ALL ON FUNCTION public.record_learner_practice_answer(uuid, text, integer, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_learner_practice_answer(uuid, text, integer, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.record_learner_practice_answer(uuid, text, integer, uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.record_learner_practice_answer(uuid, text, integer, uuid) TO service_role;

GRANT SELECT ON public.learner_question_progress TO authenticated;
GRANT SELECT ON public.learner_attempt_history TO authenticated;
GRANT ALL ON public.learner_question_progress TO service_role;
GRANT ALL ON public.learner_attempt_history TO service_role;
