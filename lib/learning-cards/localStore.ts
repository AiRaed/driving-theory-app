/**
 * Local-only Learning Cards store (Phase 5B).
 *
 * Writes stay under gitignored local-data/learning-cards/.
 * Never talks to Supabase. Safe while migration 0009 is unapplied.
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  canAdvanceCardStatus,
  effectiveClassification,
  normalizeTermKey,
  type ExplanationCard,
  type ExplanationFormat,
  type ExplanationOverride,
  type ExplanationRecommendation,
  type KeywordCard,
  type KeywordCardQuestionLink,
  type KeywordTerm,
  type LearningCardStatus,
  type SavedCard,
} from './types';
import { resolveExplanationSaveStatus } from './hints';

export const LOCAL_LEARNING_CARDS_DIR = path.join(
  process.cwd(),
  'local-data',
  'learning-cards'
);
export const LOCAL_LEARNING_CARDS_STORE = path.join(
  LOCAL_LEARNING_CARDS_DIR,
  'store.json'
);

export interface LearningCardsLocalState {
  keyword_terms: KeywordTerm[];
  keyword_cards: KeywordCard[];
  keyword_card_questions: KeywordCardQuestionLink[];
  explanation_cards: ExplanationCard[];
  saved_cards: SavedCard[];
  overrides: Record<
    string,
    {
      admin_override: ExplanationOverride | null;
      override_note: string;
      card_unnecessary: boolean;
      updated_at: string;
      updated_by?: string | null;
    }
  >;
}

function emptyState(): LearningCardsLocalState {
  return {
    keyword_terms: [],
    keyword_cards: [],
    keyword_card_questions: [],
    explanation_cards: [],
    saved_cards: [],
    overrides: {},
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

export function learningCardsStorePath(): string {
  return process.env.LOCAL_LEARNING_CARDS_STORE || LOCAL_LEARNING_CARDS_STORE;
}

export function readLocalLearningCards(): LearningCardsLocalState {
  const storePath = learningCardsStorePath();
  if (!existsSync(storePath)) return emptyState();
  try {
    const raw = JSON.parse(readFileSync(storePath, 'utf8'));
    return {
      ...emptyState(),
      ...raw,
      keyword_terms: raw.keyword_terms || [],
      keyword_cards: raw.keyword_cards || [],
      keyword_card_questions: raw.keyword_card_questions || [],
      explanation_cards: raw.explanation_cards || [],
      saved_cards: raw.saved_cards || [],
      overrides: raw.overrides || {},
    };
  } catch {
    return emptyState();
  }
}

export function writeLocalLearningCards(state: LearningCardsLocalState): void {
  const storePath = learningCardsStorePath();
  mkdirSync(path.dirname(storePath), { recursive: true });
  writeFileSync(storePath, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

export function upsertKeywordCard(input: {
  term_en: string;
  language: string;
  definition: string;
  translation?: string;
  image_url?: string | null;
  image_alt?: string | null;
  video_url?: string | null;
  notes?: string | null;
  status?: LearningCardStatus;
  created_by?: string | null;
}): KeywordCard {
  const state = readLocalLearningCards();
  const term_en = input.term_en.trim().replace(/\s+/g, ' ');
  const term_key = normalizeTermKey(term_en);
  const language = input.language.trim().toLowerCase();
  if (!state.keyword_terms.some((t) => t.term_key === term_key)) {
    state.keyword_terms.push({
      term_key,
      term_en,
      created_at: nowIso(),
      created_by: input.created_by || null,
    });
  }
  const existing = state.keyword_cards.find(
    (c) => c.term_key === term_key && c.language === language
  );
  if (input.status === 'published' && existing?.status !== 'published') {
    throw new Error(
      'Cannot create a published card; workflow is draft → submitted → approved → published'
    );
  }
  const card: KeywordCard = {
    id: existing?.id || randomUUID(),
    term_key,
    language,
    definition: input.definition,
    translation: input.translation ?? (language === 'en' ? term_en : ''),
    image_url: input.image_url ?? existing?.image_url ?? null,
    image_alt: input.image_alt ?? existing?.image_alt ?? null,
    video_url: input.video_url ?? existing?.video_url ?? null,
    status: existing?.status || 'draft',
    notes: input.notes ?? existing?.notes ?? null,
    created_at: existing?.created_at || nowIso(),
    updated_at: nowIso(),
    created_by: existing?.created_by || input.created_by || null,
    updated_by: input.created_by || null,
    published_at: existing?.published_at || null,
  };
  if (existing) {
    state.keyword_cards = state.keyword_cards.map((c) => (c.id === existing.id ? card : c));
  } else {
    state.keyword_cards.push(card);
  }
  writeLocalLearningCards(state);
  return card;
}

export function linkKeywordToQuestion(
  term_key: string,
  question_id: string,
  source_field: KeywordCardQuestionLink['source_field'] = null
): KeywordCardQuestionLink {
  const state = readLocalLearningCards();
  const link: KeywordCardQuestionLink = { term_key, question_id, source_field };
  const idx = state.keyword_card_questions.findIndex(
    (l) => l.term_key === term_key && l.question_id === question_id
  );
  if (idx >= 0) state.keyword_card_questions[idx] = link;
  else state.keyword_card_questions.push(link);
  writeLocalLearningCards(state);
  return link;
}

export function upsertExplanationCard(input: {
  question_id: string;
  language: string;
  explanation: string;
  format?: ExplanationFormat;
  image_url?: string | null;
  image_alt?: string | null;
  video_url?: string | null;
  notes?: string | null;
  status?: LearningCardStatus;
  created_by?: string | null;
  activate?: boolean;
}): ExplanationCard {
  const state = readLocalLearningCards();
  const language = input.language.trim().toLowerCase();
  const existing = state.explanation_cards.find(
    (c) => c.question_id === input.question_id && c.language === language
  );
  if (input.status === 'published' && input.activate !== true && existing?.status !== 'published') {
    throw new Error(
      'Cannot create a published card; workflow is draft → submitted → approved → published'
    );
  }
  const resolved = resolveExplanationSaveStatus({
    explanation: input.explanation,
    activate: input.activate === true,
    existingStatus: existing?.status || null,
  });
  const card: ExplanationCard = {
    id: existing?.id || randomUUID(),
    question_id: input.question_id,
    language,
    explanation: input.explanation,
    format: input.format || existing?.format || 'text',
    image_url: input.image_url ?? existing?.image_url ?? null,
    image_alt: input.image_alt ?? existing?.image_alt ?? null,
    video_url: input.video_url ?? existing?.video_url ?? null,
    status: resolved.status,
    notes: input.notes ?? existing?.notes ?? '[Draft example. Not DVSA-approved.]',
    created_at: existing?.created_at || nowIso(),
    updated_at: nowIso(),
    created_by: existing?.created_by || input.created_by || null,
    updated_by: input.created_by || null,
    published_at:
      resolved.status === 'published'
        ? resolved.published_at || existing?.published_at || null
        : null,
  };
  if (existing) {
    state.explanation_cards = state.explanation_cards.map((c) =>
      c.id === existing.id ? card : c
    );
  } else {
    state.explanation_cards.push(card);
  }
  writeLocalLearningCards(state);
  return card;
}

export function disableExplanationCard(
  question_id: string,
  language = 'en',
  updated_by?: string | null
): ExplanationCard | null {
  const state = readLocalLearningCards();
  const lang = language.trim().toLowerCase() || 'en';
  const existing = state.explanation_cards.find(
    (c) => c.question_id === question_id && c.language === lang
  );
  if (!existing) return null;
  existing.status = 'draft';
  existing.published_at = null;
  existing.updated_at = nowIso();
  existing.updated_by = updated_by || null;
  writeLocalLearningCards(state);
  return existing;
}

export function removeExplanationCard(
  question_id: string,
  language = 'en',
  updated_by?: string | null
): ExplanationCard | null {
  const state = readLocalLearningCards();
  const lang = language.trim().toLowerCase() || 'en';
  const existing = state.explanation_cards.find(
    (c) => c.question_id === question_id && c.language === lang
  );
  if (!existing) return null;
  existing.status = 'archived';
  existing.published_at = null;
  existing.updated_at = nowIso();
  existing.updated_by = updated_by || null;
  writeLocalLearningCards(state);
  return existing;
}

export function setCardStatus(
  kind: 'keyword' | 'explanation',
  id: string,
  to: LearningCardStatus,
  updated_by?: string | null
): KeywordCard | ExplanationCard {
  const state = readLocalLearningCards();
  if (kind === 'keyword') {
    const card = state.keyword_cards.find((c) => c.id === id);
    if (!card) throw new Error('Keyword card not found');
    if (!canAdvanceCardStatus(card.status, to)) {
      throw new Error(`Cannot move keyword card from ${card.status} to ${to}`);
    }
    card.status = to;
    card.updated_at = nowIso();
    card.updated_by = updated_by || null;
    if (to === 'published') card.published_at = nowIso();
    if (to !== 'published') card.published_at = to === 'approved' ? null : card.published_at;
    writeLocalLearningCards(state);
    return card;
  }
  const card = state.explanation_cards.find((c) => c.id === id);
  if (!card) throw new Error('Explanation card not found');
  if (!canAdvanceCardStatus(card.status, to)) {
    throw new Error(`Cannot move explanation card from ${card.status} to ${to}`);
  }
  card.status = to;
  card.updated_at = nowIso();
  card.updated_by = updated_by || null;
  if (to === 'published') card.published_at = nowIso();
  writeLocalLearningCards(state);
  return card;
}

export function saveOverride(
  question_id: string,
  patch: {
    admin_override?: ExplanationOverride | null;
    override_note?: string;
    card_unnecessary?: boolean;
    updated_by?: string | null;
  }
) {
  const state = readLocalLearningCards();
  const prev = state.overrides[question_id] || {
    admin_override: null,
    override_note: '',
    card_unnecessary: false,
    updated_at: nowIso(),
  };
  state.overrides[question_id] = {
    admin_override:
      patch.admin_override === undefined ? prev.admin_override : patch.admin_override,
    override_note: patch.override_note === undefined ? prev.override_note : patch.override_note,
    card_unnecessary:
      patch.card_unnecessary === undefined ? prev.card_unnecessary : patch.card_unnecessary,
    updated_at: nowIso(),
    updated_by: patch.updated_by ?? prev.updated_by ?? null,
  };
  writeLocalLearningCards(state);
  return state.overrides[question_id];
}

export function toggleSavedCard(input: {
  user_id: string;
  card_kind: 'keyword' | 'explanation';
  keyword_card_id?: string | null;
  explanation_card_id?: string | null;
}): { saved: boolean; row: SavedCard | null } {
  const state = readLocalLearningCards();
  const existing = state.saved_cards.find((s) => {
    if (s.user_id !== input.user_id || s.card_kind !== input.card_kind) return false;
    if (input.card_kind === 'keyword') return s.keyword_card_id === input.keyword_card_id;
    return s.explanation_card_id === input.explanation_card_id;
  });
  if (existing) {
    state.saved_cards = state.saved_cards.filter((s) => s.id !== existing.id);
    writeLocalLearningCards(state);
    return { saved: false, row: null };
  }
  const targetPublished =
    input.card_kind === 'keyword'
      ? state.keyword_cards.find((c) => c.id === input.keyword_card_id)?.status === 'published'
      : state.explanation_cards.find((c) => c.id === input.explanation_card_id)?.status ===
        'published';
  if (!targetPublished) {
    throw new Error('Only published cards can be saved');
  }
  const row: SavedCard = {
    id: randomUUID(),
    user_id: input.user_id,
    card_kind: input.card_kind,
    keyword_card_id: input.card_kind === 'keyword' ? input.keyword_card_id || null : null,
    explanation_card_id:
      input.card_kind === 'explanation' ? input.explanation_card_id || null : null,
    created_at: nowIso(),
  };
  state.saved_cards.push(row);
  writeLocalLearningCards(state);
  return { saved: true, row };
}

export function mergeRecommendation(
  rec: ExplanationRecommendation,
  override?: LearningCardsLocalState['overrides'][string]
) {
  const admin_override = override?.admin_override ?? null;
  const card_unnecessary = override?.card_unnecessary === true;
  return {
    ...rec,
    admin_override,
    override_note: override?.override_note || '',
    card_unnecessary,
    effective_classification: effectiveClassification(
      rec.recommended_classification,
      admin_override,
      card_unnecessary
    ),
  };
}
