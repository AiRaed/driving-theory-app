# Phase 5B — Explanation recommendations + Learning Cards (local)

**Status:** local only. Do **not** apply migration `0009`, publish cards, push, or deploy.

Recommendations are pedagogical suggestions only. They are **not DVSA-approved**. Official DVSA stem, options, correct answers, and `explanation_en` were not edited.

---

## Product decision

Not every one of the 758 V2 questions needs a custom Explanation Card.

| Classification | Meaning |
|---|---|
| `needs_explanation` | A custom card is educationally useful |
| `image_is_enough` | Official question, image, answer, and existing official explanation are sufficient; a custom card is not a priority |
| `review_later` | Uncertain; human judgement required |

Admin may override any recommendation, create a card for **any** question (including `image_is_enough`), or mark a card unnecessary.

---

## Classifier 5b.1 totals (758 unique IDs)

| Classification | Count |
|---|---|
| needs_explanation | 416 |
| image_is_enough | 221 |
| review_later | 121 |
| **Total** | **758** |

| Priority | Count |
|---|---|
| high | 257 |
| medium | 166 |
| low | 335 |

| Suggested format | Count |
|---|---|
| text | 400 |
| image | 203 |
| diagram | 86 |
| video | 69 |

Bundled IDs/recs (no licensed stems): `data/explanation-recommendations.json`  
Full local report: `local-data/dvsa/staging/explanation-classification-report.json`

---

## Admin

- Question editor: Explanation Recommendation panel + Keyword Card editor
- `/admin/learning-cards`: filters and counts by classification, topic, priority, card status
- Questions list: the same rec filters plus a rec column
- Override field: `needs_explanation` / `image_is_enough` / `review_later` / `unnecessary`, plus “mark card unnecessary”
- Workflow: draft → submitted → approved → published (or archived)
- Seed: small **draft** examples only; never auto-publish
- Official stem / options / correct answer remain read-only when `official_locked`

## Learner

- Practice: published keyword cards are tappable in the prompt; explanation cards appear after answering; Save Card
- `/saved-cards`: signed-in user’s saved Keyword + Explanation cards
- Mock Test: **no** hints, keyword taps, explanation cards, or save UI during the exam
- English + Arabic first; other ISO language codes remain valid

## Storage

Until 0009 is applied in an approved window, cards and overrides live in gitignored `local-data/learning-cards/store.json`. APIs refuse `LEARNING_CARDS_USE_SUPABASE=true`.

### Unapplied 0009 additions (local schema only)

- `explanation_card_recommendations` (classification, rationale, priority, format, admin_override, card_unnecessary, `dvsa_approved` CHECK false)
- `explanation_cards.format` (`text` / `diagram` / `image` / `video`)
- RLS: recommendations are admin/service only; learners see published cards only

---

## Activation (later approved window)

1. Review classifications in `/admin/learning-cards` and override as needed.
2. Author draft cards; advance draft → submitted → approved. **Do not publish yet.**
3. Apply `0009_learning_cards.sql` in a dedicated maintenance window (additive tables + RLS only).
4. Load recommendations + reviewed cards into Supabase. Never auto-publish.
5. Publish individual cards after human review. Practice will then show them; Mock Test stays clean.
