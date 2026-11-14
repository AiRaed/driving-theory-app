/**
 * Idempotent Learning Cards import planner. Never publishes.
 * Does not talk to Supabase; the apply tool uses this plan.
 */

import type { LearningCardsLocalState } from './localStore';
import type { ExplanationRecommendation, LearningCardStatus } from './types';

const DRAFT: LearningCardStatus = 'draft';

export interface LearningCardsImportPlan {
  recommendations: Array<Record<string, unknown>>;
  keyword_terms: Array<Record<string, unknown>>;
  keyword_cards: Array<Record<string, unknown>>;
  keyword_card_questions: Array<Record<string, unknown>>;
  explanation_cards: Array<Record<string, unknown>>;
  coerced_from_published: string[];
  skipped_saved_cards: number;
  unique_recommendation_ids: number;
  published: false;
  dvsa_approved: false;
}

export function planLearningCardsImport(input: {
  recommendations: ExplanationRecommendation[];
  localState: LearningCardsLocalState;
}): LearningCardsImportPlan {
  const coerced_from_published: string[] = [];
  const recs = input.recommendations.map((r) => {
    const ov = input.localState.overrides[r.question_id];
    return {
      question_id: r.question_id,
      topic: r.topic || '',
      has_image: !!r.has_image,
      has_option_images: !!r.has_option_images,
      recommended_classification: r.recommended_classification,
      rationale: r.rationale,
      priority: r.priority,
      suggested_format: r.suggested_format,
      admin_override: ov?.admin_override ?? null,
      override_note: ov?.override_note || '',
      card_unnecessary: ov?.card_unnecessary === true,
      classifier_version: r.classifier_version,
      dvsa_approved: false,
    };
  });

  const keyword_terms = input.localState.keyword_terms.map((t) => ({
    term_key: t.term_key,
    term_en: t.term_en,
    created_at: t.created_at,
    created_by: t.created_by ?? null,
  }));

  const keyword_cards = input.localState.keyword_cards.map((c) => {
    let status: LearningCardStatus = c.status || DRAFT;
    if (status === 'published') {
      coerced_from_published.push(`keyword:${c.id}`);
      status = DRAFT;
    }
    return {
      id: c.id,
      term_key: c.term_key,
      language: c.language,
      definition: c.definition,
      translation: c.translation,
      image_url: c.image_url,
      image_alt: c.image_alt,
      video_url: c.video_url,
      status,
      notes: c.notes ?? null,
      created_at: c.created_at,
      updated_at: c.updated_at,
      created_by: c.created_by ?? null,
      updated_by: c.updated_by ?? null,
      published_at: null,
    };
  });

  const explanation_cards = input.localState.explanation_cards.map((c) => {
    let status: LearningCardStatus = c.status || DRAFT;
    if (status === 'published') {
      coerced_from_published.push(`explanation:${c.id}`);
      status = DRAFT;
    }
    return {
      id: c.id,
      question_id: c.question_id,
      language: c.language,
      explanation: c.explanation,
      format: c.format,
      image_url: c.image_url,
      image_alt: c.image_alt,
      video_url: c.video_url,
      status,
      notes: c.notes ?? null,
      created_at: c.created_at,
      updated_at: c.updated_at,
      created_by: c.created_by ?? null,
      updated_by: c.updated_by ?? null,
      published_at: null,
    };
  });

  return {
    recommendations: recs,
    keyword_terms,
    keyword_cards,
    keyword_card_questions: input.localState.keyword_card_questions.map((l) => ({
      term_key: l.term_key,
      question_id: l.question_id,
      source_field: l.source_field,
    })),
    explanation_cards,
    coerced_from_published,
    skipped_saved_cards: input.localState.saved_cards.length,
    unique_recommendation_ids: new Set(recs.map((r) => String(r.question_id))).size,
    published: false,
    dvsa_approved: false,
  };
}
