import {
  linkKeywordToQuestion,
  mergeRecommendation,
  readLocalLearningCards,
  saveOverride,
  setCardStatus,
  toggleSavedCard,
  upsertExplanationCard,
  upsertKeywordCard,
} from './localStore';
import { loadBundledRecommendations, countBy } from './recommendations';
import { seedDraftExampleCards } from './seedDrafts';
import { isLearnerVisibleCardStatus } from './types';
import type { LearningCardsRepository } from './repository';

function cardStatusMap() {
  const state = readLocalLearningCards();
  const out: Record<string, string> = {};
  const rank = ['archived', 'draft', 'submitted', 'approved', 'published'];
  for (const card of state.explanation_cards) {
    const prev = out[card.question_id];
    if (!prev || rank.indexOf(card.status) > rank.indexOf(prev)) {
      out[card.question_id] = card.status;
    }
  }
  return out;
}

function mergedRows() {
  const overrides = readLocalLearningCards().overrides;
  const statuses = cardStatusMap();
  return loadBundledRecommendations().map((r) => {
    const merged = mergeRecommendation(r, overrides[r.question_id]);
    return { ...merged, card_status: statuses[r.question_id] || 'none' };
  });
}

export function createLocalLearningCardsRepository(): LearningCardsRepository {
  return {
    backend: 'local',
    async listKeywordCatalog() {
      const state = readLocalLearningCards();
      return {
        terms: state.keyword_terms,
        cards: state.keyword_cards,
        links: state.keyword_card_questions,
      };
    },
    async upsertKeywordCard(input) {
      return upsertKeywordCard(input);
    },
    async linkKeywordToQuestion(term_key, question_id, source_field = null) {
      return linkKeywordToQuestion(term_key, question_id, source_field);
    },
    async setCardStatus(kind, id, to, updated_by) {
      return setCardStatus(kind, id, to, updated_by);
    },
    async listExplanationCards(questionId) {
      const state = readLocalLearningCards();
      return questionId
        ? state.explanation_cards.filter((c) => c.question_id === questionId)
        : state.explanation_cards;
    },
    async upsertExplanationCard(input) {
      return upsertExplanationCard({ ...input, status: input.status || 'draft' });
    },
    async listRecommendations(filters = {}) {
      let rows = mergedRows();
      if (filters.classification) {
        rows = rows.filter((r) => r.effective_classification === filters.classification);
      }
      if (filters.topic) rows = rows.filter((r) => r.topic === filters.topic);
      if (filters.priority) rows = rows.filter((r) => r.priority === filters.priority);
      if (filters.card_status === 'none') rows = rows.filter((r) => r.card_status === 'none');
      else if (filters.card_status) {
        rows = rows.filter((r) => r.card_status === filters.card_status);
      }
      const all = mergedRows();
      return {
        rows,
        totals: {
          recommended: countBy(all, 'recommended_classification'),
          effective: countBy(all, 'effective_classification'),
          priority: countBy(all, 'priority'),
          card_status: countBy(all, 'card_status'),
          unique_ids: all.length,
        },
      };
    },
    async getRecommendation(questionId) {
      return mergedRows().find((r) => r.question_id === questionId) || null;
    },
    async saveOverride(questionId, patch) {
      saveOverride(questionId, patch);
      return mergedRows().find((r) => r.question_id === questionId) || null;
    },
    async getPublishedForQuestion(questionId, language) {
      const state = readLocalLearningCards();
      const lang = language.trim().toLowerCase() || 'en';
      const termKeys = state.keyword_card_questions
        .filter((l) => l.question_id === questionId)
        .map((l) => l.term_key);
      const keywords = state.keyword_cards.filter(
        (c) =>
          termKeys.includes(c.term_key) &&
          c.language === lang &&
          isLearnerVisibleCardStatus(c.status)
      );
      const fallbackKeywords =
        lang !== 'en'
          ? state.keyword_cards.filter(
              (c) =>
                termKeys.includes(c.term_key) &&
                c.language === 'en' &&
                isLearnerVisibleCardStatus(c.status) &&
                !keywords.some((k) => k.term_key === c.term_key)
            )
          : [];
      const explanation =
        state.explanation_cards.find(
          (c) =>
            c.question_id === questionId &&
            c.language === lang &&
            isLearnerVisibleCardStatus(c.status)
        ) ||
        state.explanation_cards.find(
          (c) =>
            c.question_id === questionId &&
            c.language === 'en' &&
            isLearnerVisibleCardStatus(c.status)
        ) ||
        null;
      return {
        question_id: questionId,
        language: lang,
        keywords: [...keywords, ...fallbackKeywords],
        terms: state.keyword_terms.filter((t) => termKeys.includes(t.term_key)),
        explanation,
        dvsa_approved: false,
      };
    },
    async listSavedForUser(userId) {
      const state = readLocalLearningCards();
      const mine = state.saved_cards.filter((s) => s.user_id === userId);
      return {
        saved: mine,
        keywords: state.keyword_cards.filter(
          (c) =>
            isLearnerVisibleCardStatus(c.status) && mine.some((s) => s.keyword_card_id === c.id)
        ),
        explanations: state.explanation_cards.filter(
          (c) =>
            isLearnerVisibleCardStatus(c.status) &&
            mine.some((s) => s.explanation_card_id === c.id)
        ),
      };
    },
    async toggleSavedCard(input) {
      return toggleSavedCard(input);
    },
    async seedDrafts(created_by) {
      return seedDraftExampleCards(created_by);
    },
  };
}
