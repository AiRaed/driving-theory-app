-- =============================================================================
-- Keyword Cards foundation (LingoTheory V2)
-- =============================================================================
-- STATUS: DO NOT APPLY. Local migration file only.
--         Do not paste this into the Supabase SQL editor until an approved window.
--
-- Additive only:
--   - New tables, indexes, trigger, and RLS policies
--   - Does not ALTER public.saved_cards (existing explanation saves stay valid)
--   - Does not change public.keyword_cards / keyword_terms (older per-language rows)
--   - Does not UPDATE or rewrite public.questions text, answers, or explanations
--   - Does not publish any keyword
--
-- Why a new save table:
--   saved_cards.keyword_card_id references keyword_cards(id), and
--   saved_cards_one_target requires exactly that id or an explanation card id.
--   Keyword Cards here are one row per term (English + optional Arabic + one
--   image). A separate owner-scoped keyword_saves table keeps existing
--   saved_cards rows and constraints intact.
--
-- Learners see status = 'published' only. Admin writes use the service role
-- after the app checks ADMIN_EMAIL. There is no client write path.
-- Arabic columns are the first optional language. Add further languages later
-- as columns or a child table; do not overload this row.
-- Images only. Do not store a moving-picture reference on this table.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term_en text NOT NULL,
  term_normalized text NOT NULL,
  explanation_en text NOT NULL DEFAULT '',
  translation_ar text NOT NULL DEFAULT '',
  explanation_ar text NOT NULL DEFAULT '',
  image_url text,
  image_alt text,
  image_storage_path text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'approved', 'published', 'archived')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT keywords_term_normalized_key UNIQUE (term_normalized),
  CONSTRAINT keywords_term_normalized_check CHECK (
    term_normalized = lower(btrim(regexp_replace(term_en, '[[:space:]]+', ' ', 'g')))
    AND char_length(term_normalized) > 0
  ),
  CONSTRAINT keywords_published_at_check CHECK (
    (status = 'published' AND published_at IS NOT NULL)
    OR status <> 'published'
  )
);

CREATE INDEX IF NOT EXISTS keywords_status_idx
  ON public.keywords (status);
CREATE INDEX IF NOT EXISTS keywords_updated_at_idx
  ON public.keywords (updated_at DESC);

-- One keyword can attach to many official questions, and one question can
-- have many keywords. questions.id is the official DVSA item id (text).
CREATE TABLE IF NOT EXISTS public.keyword_question_links (
  keyword_id uuid NOT NULL REFERENCES public.keywords(id) ON UPDATE CASCADE ON DELETE CASCADE,
  question_id text NOT NULL REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (keyword_id, question_id)
);

CREATE INDEX IF NOT EXISTS keyword_question_links_question_id_idx
  ON public.keyword_question_links (question_id);

-- One saved row per user per keyword, even when the keyword is linked to
-- several questions. Owner is the signed-in profile, same as saved_cards.
CREATE TABLE IF NOT EXISTS public.keyword_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  keyword_id uuid NOT NULL REFERENCES public.keywords(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS keyword_saves_user_keyword_uidx
  ON public.keyword_saves (user_id, keyword_id);
CREATE INDEX IF NOT EXISTS keyword_saves_user_id_idx
  ON public.keyword_saves (user_id);

CREATE OR REPLACE FUNCTION public.set_keywords_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_keywords_updated_at ON public.keywords;
CREATE TRIGGER set_keywords_updated_at
  BEFORE UPDATE ON public.keywords
  FOR EACH ROW
  EXECUTE FUNCTION public.set_keywords_updated_at();

ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_question_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "keywords_select_published" ON public.keywords;
CREATE POLICY "keywords_select_published"
  ON public.keywords FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "keywords_no_client_insert" ON public.keywords;
CREATE POLICY "keywords_no_client_insert"
  ON public.keywords FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS "keywords_no_client_update" ON public.keywords;
CREATE POLICY "keywords_no_client_update"
  ON public.keywords FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "keywords_no_client_delete" ON public.keywords;
CREATE POLICY "keywords_no_client_delete"
  ON public.keywords FOR DELETE
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "keyword_question_links_select_if_published" ON public.keyword_question_links;
CREATE POLICY "keyword_question_links_select_if_published"
  ON public.keyword_question_links FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.keywords k
      WHERE k.id = keyword_question_links.keyword_id
        AND k.status = 'published'
    )
  );

DROP POLICY IF EXISTS "keyword_question_links_no_client_write" ON public.keyword_question_links;
CREATE POLICY "keyword_question_links_no_client_write"
  ON public.keyword_question_links FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "keyword_saves_select_own" ON public.keyword_saves;
CREATE POLICY "keyword_saves_select_own"
  ON public.keyword_saves FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "keyword_saves_insert_own_published" ON public.keyword_saves;
CREATE POLICY "keyword_saves_insert_own_published"
  ON public.keyword_saves FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.keywords k
      WHERE k.id = keyword_id
        AND k.status = 'published'
    )
  );

DROP POLICY IF EXISTS "keyword_saves_delete_own" ON public.keyword_saves;
CREATE POLICY "keyword_saves_delete_own"
  ON public.keyword_saves FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "keyword_saves_no_client_update" ON public.keyword_saves;
CREATE POLICY "keyword_saves_no_client_update"
  ON public.keyword_saves FOR UPDATE
  TO authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "keyword_saves_no_anon" ON public.keyword_saves;
CREATE POLICY "keyword_saves_no_anon"
  ON public.keyword_saves FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE public.keywords IS
  'Reusable driving-theory terms. English is canonical. Arabic is optional. Learners see published rows only. Not DVSA wording. Images only.';
COMMENT ON TABLE public.keyword_question_links IS
  'Many-to-many between keywords and official questions.id. Does not copy or edit question text.';
COMMENT ON TABLE public.keyword_saves IS
  'Per-user saved Keyword Cards. One row per keyword, independent of how many questions link to it.';
COMMENT ON COLUMN public.keywords.translation_ar IS
  'Optional Arabic gloss. Further languages should be added later without replacing term_en.';
COMMENT ON COLUMN public.keywords.explanation_ar IS
  'Optional Arabic explanation. Empty until an admin writes one.';
