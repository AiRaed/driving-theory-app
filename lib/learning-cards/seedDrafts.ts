/**
 * Seed a small set of DRAFT example cards for admin testing.
 * Never publishes. Local store helper stays file-based; repository helper
 * can write drafts to Supabase after 0009, still unpublished.
 */

import { loadBundledRecommendations } from './recommendations';
import {
  linkKeywordToQuestion,
  readLocalLearningCards,
  upsertExplanationCard,
  upsertKeywordCard,
} from './localStore';
import type { LearningCardsRepository } from './repository';

const DRAFT_NOTE = 'DRAFT EXAMPLE for admin testing. Not DVSA-approved. Do not publish until reviewed.';

export function seedDraftExampleCards(created_by?: string | null) {
  const stateBefore = readLocalLearningCards();
  if (stateBefore.keyword_cards.length > 0 || stateBefore.explanation_cards.length > 0) {
    return {
      ok: true as const,
      skipped: true,
      published: false as const,
      message: 'Local store already has cards. Seed not re-run.',
      keyword_cards: stateBefore.keyword_cards.length,
      explanation_cards: stateBefore.explanation_cards.length,
    };
  }

  const recs = loadBundledRecommendations();
  const needs = recs.find((r) => r.recommended_classification === 'needs_explanation' && r.priority === 'high');
  const imageEnough = recs.find((r) => r.recommended_classification === 'image_is_enough');
  const review = recs.find((r) => r.recommended_classification === 'review_later');

  const kwEn = upsertKeywordCard({
    term_en: 'dual carriageway',
    language: 'en',
    definition:
      'A major road with traffic travelling in opposite directions, separated by a central reservation.',
    translation: 'dual carriageway',
    notes: DRAFT_NOTE,
    status: 'draft',
    created_by,
  });
  const kwAr = upsertKeywordCard({
    term_en: 'dual carriageway',
    language: 'ar',
    definition: 'طريق رئيسي يفصل حركة المرور في الاتجاهين المتعاكسين بحاجز أو مساحة وسطية.',
    translation: 'طريق مزدوج',
    notes: DRAFT_NOTE,
    status: 'draft',
    created_by,
  });
  const hsEn = upsertKeywordCard({
    term_en: 'hard shoulder',
    language: 'en',
    definition: 'The emergency lane at the side of a motorway, normally for stopping only in an emergency.',
    translation: 'hard shoulder',
    notes: DRAFT_NOTE,
    status: 'draft',
    created_by,
  });
  const hsAr = upsertKeywordCard({
    term_en: 'hard shoulder',
    language: 'ar',
    definition: 'المسار على جانب الطريق السريع والمخصص عادةً للتوقف في حالات الطوارئ فقط.',
    translation: 'الكتف الصلب',
    notes: DRAFT_NOTE,
    status: 'draft',
    created_by,
  });

  const linkIds = recs
    .filter((r) => r.topic === 'motorway-driving' || r.topic === 'rules-of-the-road')
    .slice(0, 4)
    .map((r) => r.question_id);
  for (const id of linkIds) {
    linkKeywordToQuestion('dual carriageway', id, 'stem');
    linkKeywordToQuestion('hard shoulder', id, 'stem');
  }

  const explanations = [];
  if (needs) {
    explanations.push(
      upsertExplanationCard({
        question_id: needs.question_id,
        language: 'en',
        format: needs.suggested_format,
        explanation:
          '[Draft example — not DVSA-approved.] Teach the reason behind the correct action, using a simple diagram if distances or right of way are involved.',
        notes: DRAFT_NOTE,
        status: 'draft',
        created_by,
      }),
      upsertExplanationCard({
        question_id: needs.question_id,
        language: 'ar',
        format: needs.suggested_format,
        explanation:
          '[مسودة تجريبية — ليست معتمدة من DVSA.] اشرح سبب الإجراء الصحيح. يمكن إضافة رسم للمسافات أو أولوية المرور لاحقاً.',
        notes: DRAFT_NOTE,
        status: 'draft',
        created_by,
      })
    );
  }
  if (imageEnough) {
    explanations.push(
      upsertExplanationCard({
        question_id: imageEnough.question_id,
        language: 'en',
        format: 'text',
        explanation:
          '[Draft example — not DVSA-approved.] Admin may still create a card even when the recommendation is image_is_enough.',
        notes: DRAFT_NOTE,
        status: 'draft',
        created_by,
      })
    );
  }
  if (review) {
    explanations.push(
      upsertExplanationCard({
        question_id: review.question_id,
        language: 'en',
        format: review.suggested_format,
        explanation:
          '[Draft example — not DVSA-approved.] Review-later items can still receive a draft card while a human decides.',
        notes: DRAFT_NOTE,
        status: 'draft',
        created_by,
      })
    );
  }

  const state = readLocalLearningCards();
  const publishedLeak =
    state.keyword_cards.some((c) => c.status === 'published') ||
    state.explanation_cards.some((c) => c.status === 'published');
  if (publishedLeak) {
    throw new Error('Seed must never publish cards');
  }

  return {
    ok: true as const,
    skipped: false,
    published: false as const,
    keyword_cards: [kwEn.id, kwAr.id, hsEn.id, hsAr.id],
    explanation_cards: explanations.map((c) => c.id),
    linked_questions: linkIds,
  };
}

/** Repository-backed seed so Supabase admin can create the same drafts. Never publishes. */
export async function seedDraftExampleCardsVia(
  repo: LearningCardsRepository,
  created_by?: string | null
) {
  const catalog = await repo.listKeywordCatalog();
  const explanationsExisting = await repo.listExplanationCards();
  if (catalog.cards.length > 0 || explanationsExisting.length > 0) {
    return {
      ok: true as const,
      skipped: true,
      published: false as const,
      message: 'Store already has cards. Seed not re-run.',
      keyword_cards: catalog.cards.length,
      explanation_cards: explanationsExisting.length,
    };
  }

  const recs = loadBundledRecommendations();
  const needs = recs.find(
    (r) => r.recommended_classification === 'needs_explanation' && r.priority === 'high'
  );
  const imageEnough = recs.find((r) => r.recommended_classification === 'image_is_enough');
  const review = recs.find((r) => r.recommended_classification === 'review_later');

  const kwEn = await repo.upsertKeywordCard({
    term_en: 'dual carriageway',
    language: 'en',
    definition:
      'A major road with traffic travelling in opposite directions, separated by a central reservation.',
    translation: 'dual carriageway',
    notes: DRAFT_NOTE,
    status: 'draft',
    created_by,
  });
  const kwAr = await repo.upsertKeywordCard({
    term_en: 'dual carriageway',
    language: 'ar',
    definition: 'طريق رئيسي يفصل حركة المرور في الاتجاهين المتعاكسين بحاجز أو مساحة وسطية.',
    translation: 'طريق مزدوج',
    notes: DRAFT_NOTE,
    status: 'draft',
    created_by,
  });
  const hsEn = await repo.upsertKeywordCard({
    term_en: 'hard shoulder',
    language: 'en',
    definition: 'The emergency lane at the side of a motorway, normally for stopping only in an emergency.',
    translation: 'hard shoulder',
    notes: DRAFT_NOTE,
    status: 'draft',
    created_by,
  });
  const hsAr = await repo.upsertKeywordCard({
    term_en: 'hard shoulder',
    language: 'ar',
    definition: 'المسار على جانب الطريق السريع والمخصص عادةً للتوقف في حالات الطوارئ فقط.',
    translation: 'الكتف الصلب',
    notes: DRAFT_NOTE,
    status: 'draft',
    created_by,
  });

  const linkIds = recs
    .filter((r) => r.topic === 'motorway-driving' || r.topic === 'rules-of-the-road')
    .slice(0, 4)
    .map((r) => r.question_id);
  for (const id of linkIds) {
    await repo.linkKeywordToQuestion('dual carriageway', id, 'stem');
    await repo.linkKeywordToQuestion('hard shoulder', id, 'stem');
  }

  const explanations = [];
  if (needs) {
    explanations.push(
      await repo.upsertExplanationCard({
        question_id: needs.question_id,
        language: 'en',
        format: needs.suggested_format,
        explanation:
          '[Draft example — not DVSA-approved.] Teach the reason behind the correct action, using a simple diagram if distances or right of way are involved.',
        notes: DRAFT_NOTE,
        status: 'draft',
        created_by,
      }),
      await repo.upsertExplanationCard({
        question_id: needs.question_id,
        language: 'ar',
        format: needs.suggested_format,
        explanation:
          '[مسودة تجريبية — ليست معتمدة من DVSA.] اشرح سبب الإجراء الصحيح. يمكن إضافة رسم للمسافات أو أولوية المرور لاحقاً.',
        notes: DRAFT_NOTE,
        status: 'draft',
        created_by,
      })
    );
  }
  if (imageEnough) {
    explanations.push(
      await repo.upsertExplanationCard({
        question_id: imageEnough.question_id,
        language: 'en',
        format: 'text',
        explanation:
          '[Draft example — not DVSA-approved.] Admin may still create a card even when the recommendation is image_is_enough.',
        notes: DRAFT_NOTE,
        status: 'draft',
        created_by,
      })
    );
  }
  if (review) {
    explanations.push(
      await repo.upsertExplanationCard({
        question_id: review.question_id,
        language: 'en',
        format: review.suggested_format,
        explanation:
          '[Draft example — not DVSA-approved.] Review-later items can still receive a draft card while a human decides.',
        notes: DRAFT_NOTE,
        status: 'draft',
        created_by,
      })
    );
  }

  const after = await repo.listKeywordCatalog();
  const afterEx = await repo.listExplanationCards();
  const publishedLeak =
    after.cards.some((c) => c.status === 'published') ||
    afterEx.some((c) => c.status === 'published');
  if (publishedLeak) {
    throw new Error('Seed must never publish cards');
  }

  return {
    ok: true as const,
    skipped: false,
    published: false as const,
    keyword_cards: [kwEn.id, kwAr.id, hsEn.id, hsAr.id],
    explanation_cards: explanations.map((c) => c.id),
    linked_questions: linkIds,
  };
}
