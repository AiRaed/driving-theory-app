-- =============================================================================
-- DVSA V2 content schema (Phase 3 PREPARATION)
-- =============================================================================
-- STATUS: READY FOR APPROVED APPLY (Phase 4A) — DO NOT APPLY until the operator
--         explicitly approves the shared localhost/production Supabase window.
--
-- Safe properties when eventually applied:
--   - Additive columns + new tables only
--   - Does NOT delete, archive, or republish existing questions
--   - Does NOT change maintenance flags, payments, or entitlements
--   - Learner RLS remains status = 'published' only (draft/submitted/approved
--     V2 rows stay invisible to Practice, Mock Test, and public APIs)
-- =============================================================================

-- Workflow statuses for progressive admin review.
-- Learners continue to see ONLY status = 'published' (policy unchanged below).
ALTER TABLE public.questions
  DROP CONSTRAINT IF EXISTS questions_status_check;

ALTER TABLE public.questions
  ADD CONSTRAINT questions_status_check
  CHECK (status IN ('draft', 'submitted', 'approved', 'published', 'archived'));

-- Option image URLs (27 image-option questions in Feb 2026 bank).
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS answer_1_image_url text,
  ADD COLUMN IF NOT EXISTS answer_2_image_url text,
  ADD COLUMN IF NOT EXISTS answer_3_image_url text,
  ADD COLUMN IF NOT EXISTS answer_4_image_url text;

-- Official DVSA item id (same as questions.id for V2; retained for audit).
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS official_source_id text;

-- Bank generation marker: 'v1' = current 742 bank; 'v2' = DVSA Feb 2026.
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS content_version text NOT NULL DEFAULT 'v1';

-- Internal media QA only. NEVER use 'dvsa_approved' — provisional derivatives
-- must stay unreviewed / needs_fix / reviewed (internal).
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS media_review_status text NOT NULL DEFAULT 'not_applicable'
    CHECK (media_review_status IN (
      'not_applicable',
      'unreviewed',
      'needs_fix',
      'reviewed'
    ));

-- When true, stem / option text / correct_answer are admin-read-only unless a
-- separately authorized correction process clears this flag.
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS official_locked boolean NOT NULL DEFAULT false;

-- Bare DVSA media filenames (audit / remapping); URLs live in image_* columns.
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS media_original_refs jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS questions_content_version_idx
  ON public.questions (content_version);

CREATE INDEX IF NOT EXISTS questions_official_source_id_idx
  ON public.questions (official_source_id);

CREATE INDEX IF NOT EXISTS questions_media_review_status_idx
  ON public.questions (media_review_status);

CREATE INDEX IF NOT EXISTS questions_status_content_version_idx
  ON public.questions (status, content_version);

-- -----------------------------------------------------------------------------
-- Media revision history (replace / rollback without editing app code)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.question_media_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id text NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  -- 'stem' | 'answer_1' | 'answer_2' | 'answer_3' | 'answer_4'
  slot text NOT NULL CHECK (slot IN ('stem', 'answer_1', 'answer_2', 'answer_3', 'answer_4')),
  version int NOT NULL DEFAULT 1,
  is_current boolean NOT NULL DEFAULT true,
  -- Original DVSA filename when known (e.g. AB2117a.gif)
  original_ref text,
  storage_path text,
  public_url text,
  sha256 text,
  mime_type text,
  byte_size int,
  -- Internal QA only — not a DVSA endorsement
  review_status text NOT NULL DEFAULT 'unreviewed'
    CHECK (review_status IN ('unreviewed', 'needs_fix', 'reviewed')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE (question_id, slot, version)
);

CREATE INDEX IF NOT EXISTS question_media_revisions_question_id_idx
  ON public.question_media_revisions (question_id);

CREATE INDEX IF NOT EXISTS question_media_revisions_current_idx
  ON public.question_media_revisions (question_id, slot)
  WHERE is_current = true;

ALTER TABLE public.question_media_revisions ENABLE ROW LEVEL SECURITY;

-- No learner/client access to revision history (admin uses service role).
DROP POLICY IF EXISTS "question_media_revisions_no_client_access"
  ON public.question_media_revisions;
CREATE POLICY "question_media_revisions_no_client_access"
  ON public.question_media_revisions FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- -----------------------------------------------------------------------------
-- Optional content cutover flag (service-role / admin only). Default keeps
-- learners on whatever is already published; cutover tooling flips this later.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_bank_meta (
  id text PRIMARY KEY DEFAULT 'default',
  active_content_version text NOT NULL DEFAULT 'v1',
  expected_published_count int NOT NULL DEFAULT 742,
  source_verification_status text NOT NULL DEFAULT 'NOT_VERIFIED'
    CHECK (source_verification_status IN ('NOT_VERIFIED', 'VERIFIED')),
  source_verification_notes text,
  cutover_notes text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

INSERT INTO public.content_bank_meta (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.content_bank_meta ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "content_bank_meta_no_client_access"
  ON public.content_bank_meta;
CREATE POLICY "content_bank_meta_no_client_access"
  ON public.content_bank_meta FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- Reaffirm learner policy: only published rows are selectable.
-- (Policy already exists from 0004; recreate is idempotent for clarity.)
DROP POLICY IF EXISTS "questions_select_published" ON public.questions;
CREATE POLICY "questions_select_published"
  ON public.questions FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

COMMENT ON COLUMN public.questions.media_review_status IS
  'Internal media QA. Provisional DVSA derivatives must remain unreviewed/needs_fix/reviewed — never claim DVSA approval.';
COMMENT ON COLUMN public.questions.official_locked IS
  'When true, licensed stem/options/correct_answer are read-only in admin except via authorized correction.';
COMMENT ON TABLE public.content_bank_meta IS
  'Cutover control plane. Do not set active_content_version=v2 or expected_published_count=758 until explicit cutover.';
