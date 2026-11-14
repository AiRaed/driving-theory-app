-- =============================================================================
-- Learning Cards foundation (Phase 5A/5C)
-- =============================================================================
-- STATUS: APPLIED IN PRODUCTION. NEVER RE-EXECUTE / DO NOT APPLY again.
--         CREATE TABLE IF NOT EXISTS is not enough: DROP POLICY / DROP TRIGGER
--         would recreate RLS and triggers on live learning-card tables.
--
-- Operator rules:
--   - Already applied on the shared production project. Do not paste or re-run
--     this SQL in the Supabase SQL editor.
--   - Does NOT publish cards, translate the question bank, or change the live
--     758-question V2 learner bank.
--   - Does NOT modify questions.question_en / options / correct_answer /
--     explanation_en (official DVSA wording stays on the questions row).
--   - Does NOT touch profiles, payments, entitlements, or Stripe/IAP tables.
--   - Additive CREATE TABLE / INDEX / POLICY / TRIGGER only. No DROP TABLE.
--
-- Safe properties when eventually applied:
--   - Additive tables + RLS only
--   - Learners see published cards only
--   - Draft / submitted / approved cards stay admin-only (service role)
--   - Saved cards are owner-scoped (auth.uid())
-- =============================================================================

-- Workflow statuses match questions (0008). Learners: published only.
-- 'keyword_terms' is the reusable canonical English term (language-agnostic).

CREATE TABLE IF NOT EXISTS public.keyword_terms (
  term_key text PRIMARY KEY,
  term_en text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT keyword_terms_term_key_normalized
    CHECK (term_key = lower(btrim(term_en)))
);

CREATE TABLE IF NOT EXISTS public.keyword_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term_key text NOT NULL REFERENCES public.keyword_terms(term_key) ON UPDATE CASCADE ON DELETE CASCADE,
  language text NOT NULL,
  definition text NOT NULL DEFAULT '',
  -- The term as shown in `language` (empty / same as term_en for English).
  translation text NOT NULL DEFAULT '',
  image_url text,
  image_alt text,
  video_url text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'approved', 'published', 'archived')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at timestamptz,
  UNIQUE (term_key, language)
);

CREATE INDEX IF NOT EXISTS keyword_cards_status_idx
  ON public.keyword_cards (status);
CREATE INDEX IF NOT EXISTS keyword_cards_language_idx
  ON public.keyword_cards (language);

-- Question links are language-agnostic: one mapping serves every language card.
CREATE TABLE IF NOT EXISTS public.keyword_card_questions (
  term_key text NOT NULL REFERENCES public.keyword_terms(term_key) ON UPDATE CASCADE ON DELETE CASCADE,
  question_id text NOT NULL REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE,
  -- Optional locator for admin review (never shown in Mock Test).
  source_field text
    CHECK (source_field IS NULL OR source_field IN (
      'stem', 'option_1', 'option_2', 'option_3', 'option_4'
    )),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (term_key, question_id)
);

CREATE INDEX IF NOT EXISTS keyword_card_questions_question_id_idx
  ON public.keyword_card_questions (question_id);

-- Pedagogical recommendations: which official questions may benefit from a
-- custom Explanation Card. Admin may override any row, including creating a
-- card for image_is_enough items. Never treat as DVSA-approved.
CREATE TABLE IF NOT EXISTS public.explanation_card_recommendations (
  question_id text PRIMARY KEY REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE,
  topic text NOT NULL DEFAULT '',
  has_image boolean NOT NULL DEFAULT false,
  has_option_images boolean NOT NULL DEFAULT false,
  recommended_classification text NOT NULL
    CHECK (recommended_classification IN ('needs_explanation', 'image_is_enough', 'review_later')),
  rationale text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  suggested_format text NOT NULL CHECK (suggested_format IN ('text', 'diagram', 'image', 'video')),
  admin_override text
    CHECK (admin_override IS NULL OR admin_override IN (
      'needs_explanation', 'image_is_enough', 'review_later', 'unnecessary'
    )),
  override_note text,
  card_unnecessary boolean NOT NULL DEFAULT false,
  classifier_version text NOT NULL DEFAULT '5b.1',
  dvsa_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT explanation_rec_not_dvsa_approved CHECK (dvsa_approved = false)
);

CREATE INDEX IF NOT EXISTS explanation_card_recommendations_class_idx
  ON public.explanation_card_recommendations (recommended_classification);
CREATE INDEX IF NOT EXISTS explanation_card_recommendations_priority_idx
  ON public.explanation_card_recommendations (priority);
CREATE INDEX IF NOT EXISTS explanation_card_recommendations_topic_idx
  ON public.explanation_card_recommendations (topic);

-- Pedagogical explanation per official DVSA question id + language.
-- Does NOT overwrite questions.explanation_en (licensed DVSA Expl text).
CREATE TABLE IF NOT EXISTS public.explanation_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id text NOT NULL REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE,
  language text NOT NULL,
  explanation text NOT NULL DEFAULT '',
  format text NOT NULL DEFAULT 'text'
    CHECK (format IN ('text', 'diagram', 'image', 'video')),
  image_url text,
  image_alt text,
  video_url text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'approved', 'published', 'archived')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at timestamptz,
  UNIQUE (question_id, language)
);

CREATE INDEX IF NOT EXISTS explanation_cards_status_idx
  ON public.explanation_cards (status);
CREATE INDEX IF NOT EXISTS explanation_cards_question_id_idx
  ON public.explanation_cards (question_id);

CREATE TABLE IF NOT EXISTS public.saved_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_kind text NOT NULL CHECK (card_kind IN ('keyword', 'explanation')),
  keyword_card_id uuid REFERENCES public.keyword_cards(id) ON DELETE CASCADE,
  explanation_card_id uuid REFERENCES public.explanation_cards(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT saved_cards_one_target CHECK (
    (card_kind = 'keyword' AND keyword_card_id IS NOT NULL AND explanation_card_id IS NULL)
    OR (card_kind = 'explanation' AND explanation_card_id IS NOT NULL AND keyword_card_id IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS saved_cards_user_keyword_uidx
  ON public.saved_cards (user_id, keyword_card_id)
  WHERE keyword_card_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS saved_cards_user_explanation_uidx
  ON public.saved_cards (user_id, explanation_card_id)
  WHERE explanation_card_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS saved_cards_user_id_idx
  ON public.saved_cards (user_id);

-- Media replace / rollback for card image + video slots (admin/service only).
CREATE TABLE IF NOT EXISTS public.learning_card_media_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_kind text NOT NULL CHECK (card_kind IN ('keyword', 'explanation')),
  keyword_card_id uuid REFERENCES public.keyword_cards(id) ON DELETE CASCADE,
  explanation_card_id uuid REFERENCES public.explanation_cards(id) ON DELETE CASCADE,
  slot text NOT NULL CHECK (slot IN ('image', 'video')),
  version int NOT NULL DEFAULT 1,
  is_current boolean NOT NULL DEFAULT true,
  storage_path text,
  public_url text,
  sha256 text,
  mime_type text,
  byte_size int,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT learning_card_media_one_target CHECK (
    (card_kind = 'keyword' AND keyword_card_id IS NOT NULL AND explanation_card_id IS NULL)
    OR (card_kind = 'explanation' AND explanation_card_id IS NOT NULL AND keyword_card_id IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS learning_card_media_kw_slot_version_uidx
  ON public.learning_card_media_revisions (keyword_card_id, slot, version)
  WHERE keyword_card_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS learning_card_media_ex_slot_version_uidx
  ON public.learning_card_media_revisions (explanation_card_id, slot, version)
  WHERE explanation_card_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.set_keyword_cards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_keyword_cards_updated_at ON public.keyword_cards;
CREATE TRIGGER set_keyword_cards_updated_at
  BEFORE UPDATE ON public.keyword_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.set_keyword_cards_updated_at();

CREATE OR REPLACE FUNCTION public.set_explanation_cards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_explanation_cards_updated_at ON public.explanation_cards;
CREATE TRIGGER set_explanation_cards_updated_at
  BEFORE UPDATE ON public.explanation_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.set_explanation_cards_updated_at();

CREATE OR REPLACE FUNCTION public.set_explanation_card_recommendations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_explanation_card_recommendations_updated_at
  ON public.explanation_card_recommendations;
CREATE TRIGGER set_explanation_card_recommendations_updated_at
  BEFORE UPDATE ON public.explanation_card_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_explanation_card_recommendations_updated_at();

ALTER TABLE public.keyword_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_card_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explanation_card_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explanation_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_card_media_revisions ENABLE ROW LEVEL SECURITY;

-- Learners may read published cards + the terms/links needed to render them.
-- Unpublished cards stay invisible (admin uses service role).
DROP POLICY IF EXISTS "keyword_terms_select_if_published_card" ON public.keyword_terms;
CREATE POLICY "keyword_terms_select_if_published_card"
  ON public.keyword_terms FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.keyword_cards c
      WHERE c.term_key = keyword_terms.term_key
        AND c.status = 'published'
    )
  );

DROP POLICY IF EXISTS "keyword_cards_select_published" ON public.keyword_cards;
CREATE POLICY "keyword_cards_select_published"
  ON public.keyword_cards FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "keyword_card_questions_select_if_published" ON public.keyword_card_questions;
CREATE POLICY "keyword_card_questions_select_if_published"
  ON public.keyword_card_questions FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.keyword_cards c
      WHERE c.term_key = keyword_card_questions.term_key
        AND c.status = 'published'
    )
  );

-- Recommendations are admin/service only (not a learner surface).
DROP POLICY IF EXISTS "explanation_card_recommendations_no_client_access"
  ON public.explanation_card_recommendations;
CREATE POLICY "explanation_card_recommendations_no_client_access"
  ON public.explanation_card_recommendations FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "explanation_cards_select_published" ON public.explanation_cards;
CREATE POLICY "explanation_cards_select_published"
  ON public.explanation_cards FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- No client writes to card tables (admin APIs use service role).
-- SELECT remains the published-card policy above (permissive policies OR).
DROP POLICY IF EXISTS "keyword_terms_no_client_write" ON public.keyword_terms;
DROP POLICY IF EXISTS "keyword_terms_no_client_insert" ON public.keyword_terms;
CREATE POLICY "keyword_terms_no_client_insert"
  ON public.keyword_terms FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS "keyword_terms_no_client_update" ON public.keyword_terms;
CREATE POLICY "keyword_terms_no_client_update"
  ON public.keyword_terms FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "keyword_terms_no_client_delete" ON public.keyword_terms;
CREATE POLICY "keyword_terms_no_client_delete"
  ON public.keyword_terms FOR DELETE
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "keyword_cards_no_client_write" ON public.keyword_cards;
CREATE POLICY "keyword_cards_no_client_write"
  ON public.keyword_cards FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS "keyword_cards_no_client_update" ON public.keyword_cards;
CREATE POLICY "keyword_cards_no_client_update"
  ON public.keyword_cards FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "keyword_cards_no_client_delete" ON public.keyword_cards;
CREATE POLICY "keyword_cards_no_client_delete"
  ON public.keyword_cards FOR DELETE
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "keyword_card_questions_no_client_write" ON public.keyword_card_questions;
CREATE POLICY "keyword_card_questions_no_client_write"
  ON public.keyword_card_questions FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "explanation_cards_no_client_write" ON public.explanation_cards;
CREATE POLICY "explanation_cards_no_client_write"
  ON public.explanation_cards FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS "explanation_cards_no_client_update" ON public.explanation_cards;
CREATE POLICY "explanation_cards_no_client_update"
  ON public.explanation_cards FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "explanation_cards_no_client_delete" ON public.explanation_cards;
CREATE POLICY "explanation_cards_no_client_delete"
  ON public.explanation_cards FOR DELETE
  TO anon, authenticated
  USING (false);

-- Saved cards: signed-in user, own rows, published targets only.
DROP POLICY IF EXISTS "saved_cards_select_own" ON public.saved_cards;
CREATE POLICY "saved_cards_select_own"
  ON public.saved_cards FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "saved_cards_insert_own_published" ON public.saved_cards;
CREATE POLICY "saved_cards_insert_own_published"
  ON public.saved_cards FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND (
      (
        card_kind = 'keyword'
        AND keyword_card_id IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM public.keyword_cards c
          WHERE c.id = keyword_card_id AND c.status = 'published'
        )
      )
      OR (
        card_kind = 'explanation'
        AND explanation_card_id IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM public.explanation_cards c
          WHERE c.id = explanation_card_id AND c.status = 'published'
        )
      )
    )
  );

DROP POLICY IF EXISTS "saved_cards_delete_own" ON public.saved_cards;
CREATE POLICY "saved_cards_delete_own"
  ON public.saved_cards FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Owners cannot retarget a save at another user or unpublished card.
DROP POLICY IF EXISTS "saved_cards_no_client_update" ON public.saved_cards;
CREATE POLICY "saved_cards_no_client_update"
  ON public.saved_cards FOR UPDATE
  TO authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "saved_cards_no_anon" ON public.saved_cards;
CREATE POLICY "saved_cards_no_anon"
  ON public.saved_cards FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- Revision history is admin/service only.
DROP POLICY IF EXISTS "learning_card_media_revisions_no_client_access"
  ON public.learning_card_media_revisions;
CREATE POLICY "learning_card_media_revisions_no_client_access"
  ON public.learning_card_media_revisions FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE public.keyword_cards IS
  'Reusable vocab cards keyed by term_key + language. Unpublished rows are admin-only.';
COMMENT ON TABLE public.explanation_card_recommendations IS
  'Admin-facing classification of whether a custom Explanation Card adds value. Not DVSA-approved. Admin may override any recommendation.';
COMMENT ON TABLE public.explanation_cards IS
  'Per-question pedagogical explanations keyed by official questions.id + language. Does not mutate licensed DVSA Expl text on questions.explanation_en.';
COMMENT ON TABLE public.saved_cards IS
  'Per-user saved Keyword / Explanation cards. Requires a signed-in profile.';
COMMENT ON TABLE public.learning_card_media_revisions IS
  'Admin media replace/rollback for learning cards. No learner access.';
