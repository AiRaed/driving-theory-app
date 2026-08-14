-- Question bank CMS (topics + questions)
-- Safe additive migration: does not touch profiles/payments.

CREATE TABLE IF NOT EXISTS public.topics (
  id text PRIMARY KEY,
  label_en text NOT NULL,
  label_ar text,
  label_ur text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.questions (
  id text PRIMARY KEY,
  topic_id text NOT NULL REFERENCES public.topics(id) ON UPDATE CASCADE,
  question_en text NOT NULL,
  question_ar text NOT NULL DEFAULT '',
  question_ur text NOT NULL DEFAULT '',
  answer_1_en text NOT NULL DEFAULT '',
  answer_1_ar text NOT NULL DEFAULT '',
  answer_1_ur text NOT NULL DEFAULT '',
  answer_2_en text NOT NULL DEFAULT '',
  answer_2_ar text NOT NULL DEFAULT '',
  answer_2_ur text NOT NULL DEFAULT '',
  answer_3_en text NOT NULL DEFAULT '',
  answer_3_ar text NOT NULL DEFAULT '',
  answer_3_ur text NOT NULL DEFAULT '',
  answer_4_en text NOT NULL DEFAULT '',
  answer_4_ar text NOT NULL DEFAULT '',
  answer_4_ur text NOT NULL DEFAULT '',
  correct_answer int NOT NULL CHECK (correct_answer >= 1 AND correct_answer <= 4),
  explanation_en text,
  explanation_ar text,
  explanation_ur text,
  keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
  image_url text,
  image_alt text,
  status text NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'archived')),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS questions_topic_id_idx ON public.questions (topic_id);
CREATE INDEX IF NOT EXISTS questions_status_idx ON public.questions (status);
CREATE INDEX IF NOT EXISTS questions_updated_at_idx ON public.questions (updated_at DESC);

CREATE OR REPLACE FUNCTION public.set_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_questions_updated_at ON public.questions;
CREATE TRIGGER set_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_questions_updated_at();

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Learners: read published questions + all topics
CREATE POLICY "topics_select_all"
  ON public.topics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "questions_select_published"
  ON public.questions FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- No direct client writes — admin APIs use service role
CREATE POLICY "topics_no_client_write"
  ON public.topics FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "questions_no_client_write"
  ON public.questions FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

GRANT SELECT ON public.topics TO anon, authenticated;
GRANT SELECT ON public.questions TO anon, authenticated;
