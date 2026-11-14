-- =============================================================================
-- Content Production workspace (Phase 5D)
-- =============================================================================
-- STATUS: READY FOR A LATER APPROVED APPLY — DO NOT APPLY in this session.
--
-- Additive only. Does NOT alter migration 0009.
-- Does NOT modify questions.question_en / options / correct_answer / explanation_en.
-- Does NOT publish learning cards.
-- Does NOT touch profiles, payments, entitlements, or the 758-question V2 bank.
-- Learners have no access. Admin APIs use the service role.
-- Task status "published" is media production status, not DVSA publication.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.content_production_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_key text NOT NULL UNIQUE,
  title text NOT NULL,
  topic text NOT NULL DEFAULT '',
  suggested_format text NOT NULL DEFAULT 'text'
    CHECK (suggested_format IN ('text', 'diagram', 'image', 'video')),
  format text NOT NULL DEFAULT 'text'
    CHECK (format IN ('text', 'diagram', 'image', 'video')),
  priority text NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('high', 'medium', 'low')),
  classification text NOT NULL DEFAULT 'needs_explanation',
  rationale text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'ready_for_review', 'approved', 'published', 'skipped')),
  explanation_en_draft text NOT NULL DEFAULT '',
  english_revision int NOT NULL DEFAULT 1,
  notes text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'recommendation_group'
    CHECK (source IN ('recommendation_group', 'manual')),
  media_status text NOT NULL DEFAULT 'not_started'
    CHECK (media_status IN ('not_started', 'in_progress', 'ready_for_review', 'approved', 'published', 'skipped')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS content_production_tasks_status_idx
  ON public.content_production_tasks (status);
CREATE INDEX IF NOT EXISTS content_production_tasks_topic_idx
  ON public.content_production_tasks (topic);
CREATE INDEX IF NOT EXISTS content_production_tasks_format_idx
  ON public.content_production_tasks (format);
CREATE INDEX IF NOT EXISTS content_production_tasks_priority_idx
  ON public.content_production_tasks (priority);

CREATE TABLE IF NOT EXISTS public.content_production_task_questions (
  task_id uuid NOT NULL REFERENCES public.content_production_tasks(id) ON DELETE CASCADE,
  question_id text NOT NULL REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (task_id, question_id)
);

CREATE INDEX IF NOT EXISTS content_production_task_questions_qid_idx
  ON public.content_production_task_questions (question_id);

CREATE TABLE IF NOT EXISTS public.content_production_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.content_production_tasks(id) ON DELETE CASCADE,
  language text NOT NULL,
  body text NOT NULL DEFAULT '',
  review_status text NOT NULL DEFAULT 'not_started'
    CHECK (review_status IN ('not_started', 'in_progress', 'ready_for_review', 'approved')),
  english_revision int NOT NULL DEFAULT 1,
  stale boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (task_id, language)
);

CREATE INDEX IF NOT EXISTS content_production_translations_task_idx
  ON public.content_production_translations (task_id);

CREATE TABLE IF NOT EXISTS public.content_media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('image', 'diagram', 'video', 'voiceover')),
  language text,
  title text NOT NULL DEFAULT '',
  storage_path text NOT NULL DEFAULT '',
  public_url text NOT NULL DEFAULT '',
  mime_type text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'ready_for_review', 'approved', 'published', 'skipped')),
  notes text NOT NULL DEFAULT '',
  shared_visual boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT content_media_voiceover_language CHECK (
    kind <> 'voiceover' OR language IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS content_media_assets_kind_idx
  ON public.content_media_assets (kind);
CREATE INDEX IF NOT EXISTS content_media_assets_status_idx
  ON public.content_media_assets (status);

CREATE TABLE IF NOT EXISTS public.content_production_task_media (
  task_id uuid NOT NULL REFERENCES public.content_production_tasks(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES public.content_media_assets(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'visual' CHECK (role IN ('visual', 'voiceover')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (task_id, asset_id)
);

CREATE TABLE IF NOT EXISTS public.content_production_draft_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.content_production_tasks(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  source text NOT NULL DEFAULT 'official_explanation',
  applied boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION public.set_content_production_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_content_production_tasks_updated_at ON public.content_production_tasks;
CREATE TRIGGER set_content_production_tasks_updated_at
  BEFORE UPDATE ON public.content_production_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_content_production_tasks_updated_at();

ALTER TABLE public.content_production_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_production_task_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_production_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_production_task_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_production_draft_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "content_production_tasks_no_client" ON public.content_production_tasks;
CREATE POLICY "content_production_tasks_no_client"
  ON public.content_production_tasks FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "content_production_task_questions_no_client"
  ON public.content_production_task_questions;
CREATE POLICY "content_production_task_questions_no_client"
  ON public.content_production_task_questions FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "content_production_translations_no_client"
  ON public.content_production_translations;
CREATE POLICY "content_production_translations_no_client"
  ON public.content_production_translations FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "content_media_assets_no_client" ON public.content_media_assets;
CREATE POLICY "content_media_assets_no_client"
  ON public.content_media_assets FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "content_production_task_media_no_client"
  ON public.content_production_task_media;
CREATE POLICY "content_production_task_media_no_client"
  ON public.content_production_task_media FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "content_production_draft_events_no_client"
  ON public.content_production_draft_events;
CREATE POLICY "content_production_draft_events_no_client"
  ON public.content_production_draft_events FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE public.content_production_tasks IS
  'Admin daily production queue. Groups related DVSA IDs so one asset can serve many questions. Status published is media production, not learner publication.';
COMMENT ON TABLE public.content_media_assets IS
  'Reusable image/diagram/video/voiceover library. Shared visuals are language-agnostic; voiceovers are per language.';
COMMENT ON TABLE public.content_production_translations IS
  'Editable translations with independent review status. stale=true when English draft revision moves ahead.';
