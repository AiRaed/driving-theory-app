# Phase 5A — Final live QA + Learning Cards foundation

**Status:** local only. Do **not** apply migration `0009`, publish cards, translate the bank, push, or deploy.

Official DVSA stem / options / correct answers were not edited.

---

## Part 1 — Live QA (2026-11-14)

Production: `https://www.lingotheory.org/`  
Shared Supabase: `anrtgdfbxjuhyglzyhih` (reads only; no inserts/updates).

| Check | Result |
|-------|--------|
| `GET /api/maintenance` | `200` `{ content_maintenance: false }` |
| `GET /api/questions/bank` | `200` `count=758` `source=database` |
| Unique IDs | 758 / 758 |
| ID shape | 445 `AB####` + 313 `BB####`. **0** V1 `AL-01` style |
| Topics | 14 (matches `TOPIC_META`) |
| Correct options | exactly one `correct: true` on all 758 |
| Stem images | 204, HEAD `200` `image/webp` |
| Image-answer questions | 27, option HEAD `200` `image/png` |
| Learner payload | `id, topic, promptEn, promptAr, options, keywords` — **no** `explanation_en` |
| `questions.keywords` | empty on all 758 published V2 rows |
| Official `explanation_en` | present on all 758 (admin/DB only) |
| `official_locked` | true on all 758; `official_source_id` matches `id` |
| Archived V1 | 742 rows, **invisible** to anon RLS (`*/0`) |
| Static fallback | not used (`useQuestionBank` empty on failure; live app type-imports `Question` only) |
| Practice HTML | `200`, no maintenance copy, no `AL-01` |
| Mock Test HTML | `307` → `/auth` (login required; not 503) |
| Checkout unauthenticated | `401 Unauthorized` (not maintenance 503). **No purchase made** |
| Accounts | 77 profiles (63 free / 14 paid) unchanged |
| Payments | 3 `stripe:paid` (other paid likely IAP). Unchanged |
| `content_bank_meta` | `active=v2`, expected 758, cutover `2026-11-14T20:19:46Z`. Source still `NOT_VERIFIED` |
| `keyword_cards` table | **not present** (PGRST205) — migration 0009 not applied |

### Practice (API + source; login not exercised)

- Scoring: `option.correct` after shuffle (`handleAnswerClick`). Re-select blocked.
- Next: disabled until an answer is selected.
- Previous: allowed; index `> 0`.
- Topics: chips from live bank topics + change-topic control.
- Image answers: `AnswerOptionContent` (text, image, or both). Media 200.
- VocabHintsControl is mounted in Practice but **hidden** on V2 (JSON still keyed by V1 IDs; DB `keywords` empty).
- Post-answer “Learning Hints” also empty on V2 (`keywords` empty).

### Mock Test (API + source; login not exercised)

- `QUESTION_COUNT = 50`; shuffle then slice (unique IDs). 200 simulated draws: **0** duplicates.
- Scoring: shuffled `option.correct`; results at 86% pass; wrong-answer review lists prompt + correct option.
- Resume invalidated unless `bankVersion === 'dvsa-v2-758'`.
- Paid-only (`decideMockAccess`). Free trial never unlocks Mock.
- **Local fix:** `VocabHintsControl` removed from Mock (exam integrity). Not deployed yet.

### Authenticated click-through gap

Practice and Mock require a signed-in user. No test account was created (that would be a live DB write). Scoring, navigation, uniqueness, paywall, and image rendering were verified from the live bank + current source.

### Critical bugs found → local-only fixes (not deployed)

1. **`render.yaml` still had `CONTENT_MAINTENANCE_MODE=true`.** Live dashboard is false. Next git deploy would pause Practice/Mock/purchases. Set to `"false"`.
2. **Admin PATCH blocked all `status=published` saves on `content_version=v2`.** After cutover this prevented explanation/media edits on already-live rows. Gate is now first-publish only (`isV2FirstPublishBlocked`). Official lock still strips stem/options/correct_answer.
3. **Mock Test mounted VocabHintsControl.** No-op on V2 today, but it would light up once keyword cards exist. Removed from Mock.

No official DVSA wording or correct answers were changed.

---

## Current hint / explanation / CMS / schema (inspection)

| Surface | Today |
|---------|--------|
| `questions.keywords` jsonb | Empty on V2. Practice “Learning Hints” reads this after answer. |
| `data/vocab-hints.json` | 742 V1 IDs. `VocabHintsControl` lookup by question id → empty on V2. |
| `data/vocab-dictionary.json` | Term-keyed multilingual definitions (reuse later as **seed**, not live). |
| `questions.explanation_en` | Official DVSA “Expl text”, all 758 filled. **Not** sent to learners. |
| Admin `QuestionEditor` | Explanations, translations, media. Official stem/options/correct locked. **No keyword card UI.** |
| `/admin/content-review` | V2 workflow queue; copy already mentions keyword cards (not implemented). |
| Media | `question_media_revisions` + `POST /api/admin/questions/[id]/media`. |
| Payments / entitlements | `profiles.access_level`, `free_questions_used`, Stripe/IAP. Untouched. |

---

## Part 2 — Proposed schema (unapplied `0009_learning_cards.sql`)

Additive tables only. Does not `UPDATE`/`DELETE` `questions`, `profiles`, or `payments`.

### `keyword_terms`

Canonical English term. PK `term_key` = `lower(btrim(term_en))`.

### `keyword_cards` — UNIQUE `(term_key, language)`

Reusable card: `definition`, `translation` (term in that language), optional `image_url` / `image_alt` / `video_url`, workflow `status`.

### `keyword_card_questions`

Language-agnostic links: `(term_key, question_id)` → official V2 id (`AB####` / `BB####`). Optional `source_field` (`stem` \| `option_1`…`4`).

### `explanation_cards` — UNIQUE `(question_id, language)`

Pedagogical explanation keyed by official DVSA question id. Optional image/video. Workflow status.

**Does not overwrite `questions.explanation_en`.** Licensed DVSA Expl text stays on the question row. Learner Practice will later show **published** explanation cards only.

### `saved_cards`

Per signed-in `profiles.id`. `card_kind` `keyword` \| `explanation` with exactly one FK. Unique per user+card.

### `learning_card_media_revisions`

Admin replace/rollback for card `image` / `video` slots. No learner access.

### Workflow + RLS

Statuses: `draft` → `submitted` → `approved` → `published` (or `archived`).

- Learners: `SELECT` where `status = 'published'` only.
- Card writes: service role (admin APIs). No client writes.
- `saved_cards`: owner CRUD; insert only if target card is published.
- Revisions: deny anon/authenticated.

---

## Affected UI components

### Now (this phase)

| File | Change |
|------|--------|
| `app/mock-test/page.tsx` | Removed `VocabHintsControl` |
| `components/VocabHintsControl.tsx` | Documented Practice-only |
| `app/api/admin/questions/[id]/route.ts` | First-publish gate |
| `render.yaml` | Maintenance `false` (safety for a **future** deploy — not deploying now) |

### Later (do not wire until 0009 is applied and cards exist)

| Component | Role |
|-----------|------|
| `app/practice/page.tsx` | Inline tappable keywords; after-answer explanation + save |
| `components/KeywordInlineText.tsx` | **Practice only** — wrap stem/options; never import from Mock |
| `components/ExplanationCardPanel.tsx` | After answer in Practice |
| `components/SaveCardButton.tsx` | Signed-in save/unsave |
| `app/saved-cards/page.tsx` | Learner library (new) |
| `components/admin/KeywordCardEditor.tsx` | Create/edit/replace media; workflow |
| `components/admin/ExplanationCardEditor.tsx` | Per question id + language |
| `components/admin/QuestionEditor.tsx` | Linked cards panel; still cannot edit official stem/options/correct |
| `app/admin/content-review/page.tsx` | Card status filters |
| `app/admin/learning-cards/*` | Card CMS routes |
| `app/mock-test/page.tsx` | Stay clean during exam. Optional explanation on **results** only, later |

Mock Test during the exam: no hints, no tappable keywords, no explanation cards.

---

## Implementation plan (next phases — not this one)

1. **Stop.** Do not apply `0009`, seed cards, translate the bank, push, or deploy.
2. **Approved window:** apply `0009` on the shared Supabase project. Verify RLS (anon cannot see drafts; learner bank still 758 V2).
3. **Admin CMS:** CRUD + media revisions + workflow. Seed English keyword cards from `vocab-dictionary.json` as **drafts**. Link terms to V2 stems/options. Do not auto-publish.
4. **Practice:** published keyword cards → tappable terms; published explanation cards after answer; saved cards for signed-in users. Keep VocabHintsControl until published cards exist.
5. **Mock:** keep exam surface clean. Optionally show explanation cards on the results/wrong-answer review later.
6. **Deploy app** only after admin can publish a small reviewed card set and Practice smoke-tests pass.

Preserve: V2 758 bank, official wording, payments, accounts, entitlements, maintenance off.
