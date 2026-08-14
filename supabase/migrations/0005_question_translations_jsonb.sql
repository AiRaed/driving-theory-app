-- Additive: extensible translations map (does not drop flat ar/ur columns).
-- Flat question_ar / question_ur / answer_*_ar / answer_*_ur remain for search + learner compat.
-- Canonical multi-language payload lives in translations JSONB keyed by language code.

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS source_id text;

CREATE INDEX IF NOT EXISTS questions_translations_gin_idx
  ON public.questions USING gin (translations);

COMMENT ON COLUMN public.questions.translations IS
  'Map of lang code -> { question, answers[4], explanation }. e.g. {"ar":{...},"ur":{...},"fr":{...}}';
