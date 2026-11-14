# Phase 5D — Admin Content Production Dashboard

**Status:** application code ready. Do **not** apply migration `0010`, write to live Supabase, publish cards, commit, push, or deploy in this session.

Official DVSA stem / options / correct answers / `explanation_en` stay locked. The 758-question V2 bank is unchanged. Migration `0009` was not edited.

---

## What this phase does

`/admin/content-production` is the daily workspace for systematically producing:

- English explanation drafts
- reusable images / diagrams / videos
- language-specific translations and voiceovers

It is **not** random one-off card creation. The 758 explanation recommendations are grouped into reusable **learning concepts** so one visual or video can cover many related DVSA IDs.

Task status `published` means **media production is done**. It does **not** publish Learning Cards and does **not** change DVSA content approval.

---

## Migration 0010 (unapplied)

File: `supabase/migrations/0010_content_production.sql`

Additive `CREATE TABLE` / indexes / RLS / trigger only.

| Table | Role |
|---|---|
| `content_production_tasks` | concept queue, English draft, production + media status |
| `content_production_task_questions` | many DVSA IDs per task |
| `content_production_translations` | per-language text + independent review + stale flag |
| `content_media_assets` | image / diagram / video / voiceover library |
| `content_production_task_media` | attach shared visual or language audio to a task |
| `content_production_draft_events` | audit for optional one-at-a-time grounded drafts |

No `ALTER`/`UPDATE`/`DELETE` on `questions`, `profiles`, payments, or 0009 learning-card tables.

---

## Runtime

| Environment | Backend |
|---|---|
| `next dev` (default) | gitignored `local-data/content-production/store.json` |
| `CONTENT_PRODUCTION_USE_SUPABASE=true` or production | Supabase (never gitignored JSON) |

Learner Practice still uses **published Learning Cards only**. Mock Test does not import this module.

---

## Activation (later approved window)

Do not run these now.

1. Confirm 0009 remains applied and 758 V2 questions are published.
2. Apply `supabase/migrations/0010_content_production.sql` in the SQL editor (additive only).
3. Deploy this app.
4. Admin → Content production → **Build queue from recommendations** (idempotent, creates concept tasks, does not generate explanations, does not publish).
5. Use **Next task**. Produce one concept at a time. Optional grounded English draft is one question, on click, never a batch.
6. Publish Learning Cards later from the existing 5C workflow after human review.
