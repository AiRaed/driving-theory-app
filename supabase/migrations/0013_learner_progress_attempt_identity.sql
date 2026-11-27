-- Reject a reused practice attempt id when the question or answer differs.
-- 0012 stored the first history row, then still wrote progress for a later call
-- that reused the same id for another question with no progress row yet.
-- A matching retry whose progress row never landed may still be stored once.
-- Apply once in the Supabase SQL Editor after 0012. Do not edit 0012.

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
  existing_question_id text;
  existing_answer integer;
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
    SELECT h.question_id, h.selected_answer
      INTO existing_question_id, existing_answer
    FROM public.learner_attempt_history h
    WHERE h.user_id = p_user_id
      AND h.client_attempt_id = p_client_attempt_id;

    IF NOT FOUND
       OR existing_question_id IS DISTINCT FROM q.id
       OR existing_answer IS DISTINCT FROM p_selected_answer THEN
      RAISE EXCEPTION 'attempt id reused';
    END IF;

    SELECT * INTO row
    FROM public.learner_question_progress
    WHERE user_id = p_user_id
      AND question_id = q.id
      AND content_version = q.content_version;

    -- Same question and answer were already stored. Do not count them again.
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
