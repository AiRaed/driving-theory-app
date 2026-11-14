# DVSA V2 import / cutover design

Phase 3 status: **preparation in local code only**.  
Do **not** apply migrations, import, upload media, flip maintenance flags, commit, push, or deploy until an explicit cutover window is approved.

## Goal

Replace the live **742**-question bank with the official DVSA February 2026 Car Category B bank (**758** questions). Full cutover — no dual learner bank.

## Shared Supabase (critical)

Localhost and production use the **same** Supabase project.

| Rule | Mechanism |
|------|-----------|
| Draft V2 never in Practice/Mock/public APIs | RLS `status = 'published'` only + repository selects published |
| Import never publishes | Importer forces `status=draft`, `content_version=v2` |
| Admin cannot publish V2 until cutover | `DVSA_V2_ALLOW_PUBLISH=true` required (default blocked) |
| Live completeness gate stays 742 | `EXPECTED_PUBLISHED_COUNT = 742` until cutover PR |
| Provisional images | `media_review_status=unreviewed` — never “DVSA-approved” |

## Source verification (do not silently mark verified)

Staging `source_verification.status = NOT_VERIFIED`.

Reason: XLSX was reconstructed from CSV by `analyze-dvsa-workbook`. Official original workbook parity is **not** verified.

- Reconstructed CSV/XLSX is sufficient for **local transform + dry-run import prep**.
- Official original-source verification is **still required** before claiming VERIFIED / final licensed cutover confidence.
- Place official XLSX + `OFFICIAL_XLSX_VERIFIED` marker under `local-data/dvsa/` when available; do not flip status in code without that evidence.

## Provisional media decision (Phase 3)

Manual visual review of 534 converted images is **deferred**.

- Use current derivatives as **provisional** assets.
- Mark `media_review_status=unreviewed` (or `needs_fix` after admin review).
- Progressive admin workflow replaces/improves images with revision history.
- Do **not** mark images DVSA-approved.

## Schema (migration `0008_dvsa_v2_content_schema.sql`)

**DO NOT APPLY YET.**

Additive only:

- Workflow: `draft | submitted | approved | published | archived`
- Option images: `answer_1..4_image_url`
- `official_source_id`, `content_version`, `official_locked`
- `media_review_status`: `not_applicable | unreviewed | needs_fix | reviewed`
- `media_original_refs` jsonb
- `question_media_revisions` (version history / rollback)
- `content_bank_meta` (active version + expected count + source verification) — admin/service only

Does **not** delete or archive existing questions.

## Admin dashboard workflow

| Concern | Behaviour |
|---------|-----------|
| Explanations / translations / keywords | Editable |
| Official stem, options, correct answer | Read-only when `official_locked` (V2 import default) |
| Images | Replace via `/api/admin/questions/[id]/media` — new revision, keep `original_ref`, rollback supported |
| Workflow | draft → submitted → approved → published (publish of v2 blocked until cutover env) |
| Queue UI | `/admin/content-review` filters `content_version=v2` + media review status |
| Media QA labels | Internal only (`unreviewed` / `needs_fix` / `reviewed`) |

Authorized correction of locked official text is a **separate** process (not shipped in Phase 3) — would require clearing `official_locked` under audited procedure.

## Importer

- Tool: `tools/import-dvsa-v2-to-supabase.ts`
- Script: `npm run import:dvsa-v2:dry-run`
- Mapper: `lib/questions/dvsaV2Import.ts`
- Default: **dry-run only** → writes `local-data/dvsa/staging/import-dry-run-report.json`
- Execute path intentionally **not implemented** in Phase 3 (hard stop) even with flags
- Future execute guards: `DVSA_V2_IMPORT_ENABLED=true` + `--execute --confirm-shared-supabase --i-understand-draft-only`
- IDs: official DVSA Item IDs (deterministic); distinct from current `AL-01`-style v1 IDs

## Hard-coded 742 + static fallback

**Keep until cutover day:**

1. `EXPECTED_PUBLISHED_COUNT = 742`
2. Static fallback `data/questions.ts` when DB gate fails
3. Maintenance mode (`CONTENT_MAINTENANCE_MODE`) — do not change in Phase 3

**Cutover sequence (later):**

1. Enable maintenance mode (hides Practice/Mock content paths; does not expose incomplete V2)
2. Snapshot/export published v1 bank
3. Apply 0008 (if not already)
4. Upload provisional media to storage (deterministic paths)
5. Draft-import 758 (still draft) → admin spot-check
6. Completeness validate at 758 on draft set
7. Single PR: flip `EXPECTED_PUBLISHED_COUNT` → 758, archive v1 published, publish v2, disable static learner fallback
8. Invalidate mock sessions (below)
9. Verify gate green; disable maintenance

Maintenance must **not** fall through to obsolete static content as a “live” product experience during cutover — keep maintenance UI as the learner surface until gate passes.

## Mock session / historical data

Preserve: accounts, purchases, entitlements, analytics.

Invalidate safely:

- Clear client mock resume keys (`localStorage` / Capacitor preferences for in-progress mocks)
- Mark in-progress server `learning_sessions` (mock) as abandoned where applicable
- Historical attempts keyed to removed v1 IDs remain for analytics; resume must not load missing IDs
- Free-question counters stay on account

## Phase 3 deliverables (this prep)

| Artifact | Path |
|----------|------|
| Migration (unapplied) | `supabase/migrations/0008_dvsa_v2_content_schema.sql` |
| Import mapper | `lib/questions/dvsaV2Import.ts` |
| Dry-run importer | `tools/import-dvsa-v2-to-supabase.ts` |
| Types / gate (742 retained) | `lib/questions/types.ts` |
| Admin media versioning API | `app/api/admin/questions/[id]/media/route.ts` |
| Official lock on PATCH | `app/api/admin/questions/[id]/route.ts` |
| Editor + review queue | `components/admin/QuestionEditor.tsx`, `app/admin/content-review/page.tsx` |

## Step-by-step execution plan (future — not now)

1. **Confirm** official workbook verification path (or accept NOT_VERIFIED risk in writing).
2. Run `npm run import:dvsa-v2:dry-run` and review report (no DB).
3. Schedule cutover window; notify that localhost=prod Supabase.
4. Snapshot DB + storage.
5. Apply migration **0008** only.
6. Upload 534 provisional derivatives to `question-images` / CDN with deterministic names from conversion manifest.
7. Enable draft execute importer (implement write path in a dedicated PR) — insert 758 as draft only.
8. Admin progressive review (explanations, media, keywords) via `/admin/content-review`.
9. Maintenance ON → publish flip → `EXPECTED_PUBLISHED_COUNT=758` → remove static learner fallback → mock invalidation → verify → Maintenance OFF.
10. Rollback plan: republish archived v1, restore expected count 742, restore snapshot if needed.

## Risks

| Risk | Mitigation |
|------|------------|
| Accidental V2 publish on shared project | Publish block + RLS + draft-only import |
| Incomplete publish breaks gate → static 742 shown | Maintenance ON during cutover; remove static only after 758 gate |
| ID overlap with v1 | Dry-run collision check; V2 uses AB#### IDs |
| Provisional bad images | `unreviewed` + revision/rollback |
| Unverified source | Keep NOT_VERIFIED until official workbook |
| Mock resume on dead IDs | Explicit invalidation step |
| Media upload before migration | Revisions table required; order: migrate → upload → import |

## Explicit non-goals (Phase 3 prep)

- No live DB writes, migrations, storage uploads
- No maintenance / payment / entitlement changes
- No commit, push, deploy
- No publishing licensed content
- No automatic claim of source VERIFIED
- No marking images DVSA-approved

## Next safe execution step

```bash
npm run import:dvsa-v2:dry-run
```

Review `local-data/dvsa/staging/import-dry-run-report.json`.  
Then **stop**. Do not apply `0008` or import until an approved cutover window.
