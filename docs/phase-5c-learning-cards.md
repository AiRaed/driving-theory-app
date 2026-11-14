# Phase 5C — Learning Cards persistent Supabase storage

**Status:** code ready. Do **not** apply migration `0009`, write to live Supabase, publish cards, push, or deploy until an approved window.

Official DVSA stem / options / correct answers / `explanation_en` were not edited. The 758-question V2 bank is unchanged.

---

## What this phase does

Admin create/edit of Learning Cards is prepared to persist in Supabase so it no longer depends on gitignored `local-data/learning-cards/store.json` or a new app deploy per card.

Until 0009 is applied:

- Local admin still uses `local-data/learning-cards/store.json`
- Production never reads that JSON file
- Learner Practice APIs return **empty published cards** if the tables are missing (no crash)
- No cards are published

---

## Migration 0009 audit (unapplied)

File: `supabase/migrations/0009_learning_cards.sql`

| Check | Result |
|---|---|
| Additive only | `CREATE TABLE IF NOT EXISTS` / indexes / RLS / triggers. No `ALTER`/`UPDATE`/`DELETE` on `questions`, `profiles`, or `payments` |
| Official bank | No writes to `question_en`, options, `correct_answer`, `explanation_en` |
| Learner reads | `SELECT` where `status = 'published'` only |
| Admin writes | Service role. Client insert/update/delete on card tables denied |
| Saved cards | `user_id = auth.uid()`, insert only if target is published, no client UPDATE |
| Recommendations | Admin/service only (`USING false` for anon/authenticated) |
| Workflow | `draft` → `submitted` → `approved` → `published` (or `archived`) |
| Formats | `text` / `diagram` / `image` / `video` |
| Overrides | `admin_override`, `card_unnecessary`, `dvsa_approved` CHECK false |
| EN/AR | `language` text; unique `(term_key, language)` and `(question_id, language)` |

---

## Runtime backend

| Environment | Backend |
|---|---|
| `next dev` (default) | local JSON |
| `LEARNING_CARDS_USE_SUPABASE=true` | Supabase |
| Production (`NODE_ENV=production` / Render) | Supabase (never gitignored JSON) |

Learner Practice fetches `/api/learning-cards/for-question` at runtime, so a **published** card appears without another deploy.

Mock Test does not import learning-card UI. Exam surface stays clean.

Saved cards are stamped with the signed-in `user.id` (body `user_id` is ignored).

---

## Import (idempotent, default dry-run)

Source:

- 758 bundled recommendations: `data/explanation-recommendations.json`
- Local drafts: `local-data/learning-cards/store.json`

Any local `published` status is **coerced to draft** on import. Saved-card rows are not imported (users save after publish).

```bash
npm run import:learning-cards:dry-run
# later, after 0009, approved window only:
npm run import:learning-cards:apply
```

Apply requires `--apply --confirm-shared-supabase`. `--publish` is refused.

---

## Activation steps (later approved window)

Do not run these now. They are the later operator checklist.

1. Record backup counts (questions published V2 = 758, profiles, payments).
2. Apply `supabase/migrations/0009_learning_cards.sql` to project `anrtgdfbxjuhyglzyhih` in the SQL editor. Additive only — no question/account/payment writes.
3. Verify the bank and new tables:

```sql
select to_regclass('public.keyword_cards');
select count(*) from public.questions
  where status = 'published' and content_version = 'v2';
select count(*) from public.keyword_cards where status = 'published';
```

Expect: table exists, 758 published V2 questions, **0** published cards.

4. `npm run import:learning-cards:dry-run` then, if the report shows `published: false` and 758 unique recommendation IDs, `npm run import:learning-cards:apply`.
5. Confirm import:

```sql
select count(*) from public.explanation_card_recommendations; -- 758
select count(*) from public.keyword_cards where status = 'published'; -- 0
select count(*) from public.explanation_cards where status = 'published'; -- 0
```

6. Deploy this app. Production already uses the Supabase code path (never gitignored JSON). `LEARNING_CARDS_USE_SUPABASE=true` on Render is optional documentation.
7. Admin: author → submit → approve. Publish **individual** cards after human review. No automatic publication.
8. Practice fetches published cards at runtime (no extra deploy). Mock Test stays without learning aids.
9. Saved Cards: sign in as user A, save a published card, confirm user B does not see it.

---

## Not done in this phase

- Migration not applied
- No live Supabase writes
- No published cards
- No git commit / push / deploy
- Question bank, accounts, purchases, entitlements untouched
