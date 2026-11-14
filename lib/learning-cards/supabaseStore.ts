/**
 * Supabase-backed Learning Cards repository.
 * Admin writes use the service role. Learner reads rely on RLS (published only)
 * plus an application-level published filter. Never auto-publishes.
 */

import {
  canAdvanceCardStatus,
  effectiveClassification,
  isLearnerVisibleCardStatus,
  normalizeTermKey,
  type ExplanationCard,
  type ExplanationRecommendation,
  type ExplanationRecommendationRecord,
  type KeywordCard,
  type KeywordCardQuestionLink,
  type KeywordTerm,
  type LearningCardStatus,
  type SavedCard,
} from './types';
import { LearningCardsNotMigratedError, isMissingLearningCardsTable } from './errors';
import { loadBundledRecommendations, countBy } from './recommendations';
import type { LearningCardsRepository } from './repository';

type FilterBuilder = {
  eq: (col: string, val: unknown) => FilterBuilder;
  in: (col: string, val: string[]) => FilterBuilder;
  maybeSingle: () => PromiseLike<{ data: unknown; error: QueryError | null }>;
  then: PromiseLike<{ data: unknown; error: QueryError | null }>['then'];
};

type QueryError = { message?: string; code?: string; details?: string };

export type LearningCardsSupabaseClient = {
  from: (table: string) => {
    select: (cols?: string) => FilterBuilder & {
      eq: (col: string, val: unknown) => FilterBuilder;
      in: (col: string, val: string[]) => FilterBuilder;
      order?: (col: string) => FilterBuilder;
    };
    insert: (row: unknown) => PromiseLike<{ data: unknown; error: QueryError | null }>;
    update: (row: unknown) => {
      eq: (col: string, val: unknown) => PromiseLike<{ data: unknown; error: QueryError | null }>;
    };
    upsert: (
      row: unknown,
      opts?: { onConflict?: string }
    ) => PromiseLike<{ data: unknown; error: QueryError | null }> & {
      select: (cols?: string) => FilterBuilder;
    };
    delete: () => {
      eq: (col: string, val: unknown) => {
        eq: (col: string, val: unknown) => PromiseLike<{ error: QueryError | null }>;
      } & PromiseLike<{ error: QueryError | null }>;
    };
  };
};

function missingOrThrow(error: QueryError | null, learnerEmpty: boolean) {
  if (!error) return;
  if (isMissingLearningCardsTable(error)) {
    if (learnerEmpty) return;
    throw new LearningCardsNotMigratedError(error.message);
  }
  throw new Error(error.message || 'Learning cards query failed');
}

async function selectAll<T>(
  client: LearningCardsSupabaseClient,
  table: string,
  learnerEmpty: boolean
): Promise<T[]> {
  const { data, error } = (await client.from(table).select('*')) as {
    data: T[] | null;
    error: QueryError | null;
  };
  if (error) {
    if (isMissingLearningCardsTable(error) && learnerEmpty) return [];
    missingOrThrow(error, learnerEmpty);
    return [];
  }
  return data || [];
}

type RecSource = ExplanationRecommendation & {
  admin_override?: ExplanationRecommendationRecord['admin_override'] | null;
  override_note?: string;
  card_unnecessary?: boolean;
};

export function createSupabaseLearningCardsRepository(
  client: LearningCardsSupabaseClient,
  opts: { learnerEmptyOnMissing?: boolean } = {}
): LearningCardsRepository {
  const learnerEmpty = opts.learnerEmptyOnMissing === true;

  async function recRows(): Promise<
    Array<ExplanationRecommendationRecord & { card_status: string }>
  > {
    const recs = await selectAll<RecSource>(
      client,
      'explanation_card_recommendations',
      learnerEmpty
    );
    const cards = await selectAll<ExplanationCard>(client, 'explanation_cards', learnerEmpty);
    const statuses: Record<string, string> = {};
    const rank = ['archived', 'draft', 'submitted', 'approved', 'published'];
    for (const card of cards) {
      const prev = statuses[card.question_id];
      if (!prev || rank.indexOf(card.status) > rank.indexOf(prev)) {
        statuses[card.question_id] = card.status;
      }
    }
    const bundled = loadBundledRecommendations();
    const dbById = new Map(recs.map((r) => [r.question_id, r]));
    const source: RecSource[] =
      recs.length >= bundled.length && recs.length > 0
        ? recs
        : bundled.map((b) => {
            const row = dbById.get(b.question_id);
            return row ? { ...b, ...row, dvsa_approved: false as const } : { ...b };
          });
    return source.map((r) => {
      const admin_override = r.admin_override || null;
      const card_unnecessary = r.card_unnecessary === true;
      return {
        question_id: r.question_id,
        topic: r.topic,
        has_image: !!r.has_image,
        has_option_images: !!r.has_option_images,
        recommended_classification: r.recommended_classification,
        rationale: r.rationale,
        priority: r.priority,
        suggested_format: r.suggested_format,
        classifier_version: r.classifier_version,
        dvsa_approved: false as const,
        admin_override,
        override_note: String(r.override_note || ''),
        card_unnecessary,
        effective_classification: effectiveClassification(
          r.recommended_classification,
          admin_override,
          card_unnecessary
        ),
        card_status: statuses[r.question_id] || 'none',
      };
    });
  }

  return {
    backend: 'supabase',
    async listKeywordCatalog() {
      const terms = await selectAll<KeywordTerm>(client, 'keyword_terms', learnerEmpty);
      const cards = await selectAll<KeywordCard>(client, 'keyword_cards', learnerEmpty);
      const links = await selectAll<KeywordCardQuestionLink>(
        client,
        'keyword_card_questions',
        learnerEmpty
      );
      return { terms, cards, links };
    },
    async upsertKeywordCard(input) {
      const term_en = input.term_en.trim().replace(/\s+/g, ' ');
      const term_key = normalizeTermKey(term_en);
      const language = input.language.trim().toLowerCase();
      const termRes = await client.from('keyword_terms').upsert(
        {
          term_key,
          term_en,
        },
        { onConflict: 'term_key' }
      );
      missingOrThrow(termRes.error, false);
      const existing = (await selectAll<KeywordCard>(client, 'keyword_cards', false)).find(
        (c) => c.term_key === term_key && c.language === language
      );
      if (input.status === 'published' && existing?.status !== 'published') {
        throw new Error('Cannot create a published card; workflow is draft → submitted → approved → published');
      }
      const status: LearningCardStatus = existing?.status || 'draft';
      const row: Record<string, unknown> = {
        term_key,
        language,
        definition: input.definition,
        translation: input.translation ?? (language === 'en' ? term_en : ''),
        image_url: input.image_url ?? existing?.image_url ?? null,
        image_alt: input.image_alt ?? existing?.image_alt ?? null,
        video_url: input.video_url ?? existing?.video_url ?? null,
        status,
        notes: input.notes ?? existing?.notes ?? null,
        created_by: existing?.created_by || input.created_by || null,
        updated_by: input.created_by || null,
        published_at: existing?.published_at || null,
      };
      if (existing?.id) row.id = existing.id;
      const upserted = await client.from('keyword_cards').upsert(row, {
        onConflict: 'term_key,language',
      });
      missingOrThrow(upserted.error, false);
      const cards = await selectAll<KeywordCard>(client, 'keyword_cards', false);
      const found = cards.find((c) => c.term_key === term_key && c.language === language);
      if (!found) throw new Error('Failed to upsert keyword card');
      return found;
    },
    async linkKeywordToQuestion(term_key, question_id, source_field = null) {
      const link = { term_key, question_id, source_field };
      const res = await client
        .from('keyword_card_questions')
        .upsert(link, { onConflict: 'term_key,question_id' });
      missingOrThrow(res.error, false);
      return link;
    },
    async setCardStatus(kind, id, to, updated_by) {
      const table = kind === 'keyword' ? 'keyword_cards' : 'explanation_cards';
      const { data, error } = (await client.from(table).select('*').eq('id', id).maybeSingle()) as {
        data: KeywordCard | ExplanationCard | null;
        error: QueryError | null;
      };
      missingOrThrow(error, false);
      if (!data) throw new Error(`${kind} card not found`);
      if (!canAdvanceCardStatus(data.status, to)) {
        throw new Error(`Cannot move ${kind} card from ${data.status} to ${to}`);
      }
      const patch: Record<string, unknown> = {
        status: to,
        updated_by: updated_by || null,
        published_at: to === 'published' ? new Date().toISOString() : to === 'approved' ? null : data.published_at,
      };
      const upd = await client.from(table).update(patch).eq('id', id);
      missingOrThrow(upd.error, false);
      return { ...data, ...patch, status: to } as KeywordCard | ExplanationCard;
    },
    async listExplanationCards(questionId) {
      const rows = await selectAll<ExplanationCard>(client, 'explanation_cards', learnerEmpty);
      return questionId ? rows.filter((c) => c.question_id === questionId) : rows;
    },
    async upsertExplanationCard(input) {
      const language = input.language.trim().toLowerCase();
      const existing = (await selectAll<ExplanationCard>(client, 'explanation_cards', false)).find(
        (c) => c.question_id === input.question_id && c.language === language
      );
      if (input.status === 'published' && existing?.status !== 'published') {
        throw new Error('Cannot create a published card; workflow is draft → submitted → approved → published');
      }
      const status: LearningCardStatus = existing?.status || 'draft';
      const row: Record<string, unknown> = {
        question_id: input.question_id,
        language,
        explanation: input.explanation,
        format: input.format || existing?.format || 'text',
        image_url: input.image_url ?? existing?.image_url ?? null,
        image_alt: input.image_alt ?? existing?.image_alt ?? null,
        video_url: input.video_url ?? existing?.video_url ?? null,
        status,
        notes: input.notes ?? existing?.notes ?? 'Not DVSA-approved.',
        created_by: existing?.created_by || input.created_by || null,
        updated_by: input.created_by || null,
        published_at: existing?.published_at || null,
      };
      if (existing?.id) row.id = existing.id;
      const upserted = await client.from('explanation_cards').upsert(row, {
        onConflict: 'question_id,language',
      });
      missingOrThrow(upserted.error, false);
      const cards = await selectAll<ExplanationCard>(client, 'explanation_cards', false);
      const found = cards.find(
        (c) => c.question_id === input.question_id && c.language === language
      );
      if (!found) throw new Error('Failed to upsert explanation card');
      return found;
    },
    async listRecommendations(filters = {}) {
      let rows = await recRows();
      if (filters.classification) {
        rows = rows.filter((r) => r.effective_classification === filters.classification);
      }
      if (filters.topic) rows = rows.filter((r) => r.topic === filters.topic);
      if (filters.priority) rows = rows.filter((r) => r.priority === filters.priority);
      if (filters.card_status === 'none') rows = rows.filter((r) => r.card_status === 'none');
      else if (filters.card_status) rows = rows.filter((r) => r.card_status === filters.card_status);
      const all = await recRows();
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
      const rows = await recRows();
      return rows.find((r) => r.question_id === questionId) || null;
    },
    async saveOverride(questionId, patch) {
      const current = await recRows().then((rows) => rows.find((r) => r.question_id === questionId));
      const bundled = loadBundledRecommendations().find((r) => r.question_id === questionId);
      if (!current && !bundled) return null;
      const base = current || bundled!;
      const row = {
        question_id: questionId,
        topic: base.topic,
        has_image: base.has_image,
        has_option_images: base.has_option_images,
        recommended_classification: base.recommended_classification,
        rationale: base.rationale,
        priority: base.priority,
        suggested_format: base.suggested_format,
        classifier_version: base.classifier_version,
        dvsa_approved: false,
        admin_override:
          patch.admin_override === undefined ? current?.admin_override ?? null : patch.admin_override,
        override_note:
          patch.override_note === undefined ? current?.override_note || '' : patch.override_note,
        card_unnecessary:
          patch.card_unnecessary === undefined
            ? current?.card_unnecessary === true
            : patch.card_unnecessary,
        updated_by: patch.updated_by || null,
      };
      const res = await client
        .from('explanation_card_recommendations')
        .upsert(row, { onConflict: 'question_id' });
      missingOrThrow(res.error, false);
      return recRows().then((rows) => rows.find((r) => r.question_id === questionId) || null);
    },
    async getPublishedForQuestion(questionId, language) {
      const lang = language.trim().toLowerCase() || 'en';
      const links = (
        await selectAll<KeywordCardQuestionLink>(client, 'keyword_card_questions', true)
      ).filter((l) => l.question_id === questionId);
      const termKeys = links.map((l) => l.term_key);
      const allKw = await selectAll<KeywordCard>(client, 'keyword_cards', true);
      const keywords = allKw.filter(
        (c) =>
          termKeys.includes(c.term_key) &&
          c.language === lang &&
          isLearnerVisibleCardStatus(c.status)
      );
      const fallback =
        lang !== 'en'
          ? allKw.filter(
              (c) =>
                termKeys.includes(c.term_key) &&
                c.language === 'en' &&
                isLearnerVisibleCardStatus(c.status) &&
                !keywords.some((k) => k.term_key === c.term_key)
            )
          : [];
      const explanations = await selectAll<ExplanationCard>(client, 'explanation_cards', true);
      const explanation =
        explanations.find(
          (c) =>
            c.question_id === questionId &&
            c.language === lang &&
            isLearnerVisibleCardStatus(c.status)
        ) ||
        explanations.find(
          (c) =>
            c.question_id === questionId &&
            c.language === 'en' &&
            isLearnerVisibleCardStatus(c.status)
        ) ||
        null;
      const terms = (await selectAll<KeywordTerm>(client, 'keyword_terms', true)).filter((t) =>
        termKeys.includes(t.term_key)
      );
      return {
        question_id: questionId,
        language: lang,
        keywords: [...keywords, ...fallback],
        terms,
        explanation,
        dvsa_approved: false as const,
      };
    },
    async listSavedForUser(userId) {
      const saved = (await selectAll<SavedCard>(client, 'saved_cards', true)).filter(
        (s) => s.user_id === userId
      );
      const keywords = (await selectAll<KeywordCard>(client, 'keyword_cards', true)).filter(
        (c) =>
          isLearnerVisibleCardStatus(c.status) && saved.some((s) => s.keyword_card_id === c.id)
      );
      const explanations = (
        await selectAll<ExplanationCard>(client, 'explanation_cards', true)
      ).filter(
        (c) =>
          isLearnerVisibleCardStatus(c.status) && saved.some((s) => s.explanation_card_id === c.id)
      );
      return { saved, keywords, explanations };
    },
    async toggleSavedCard(input) {
      const catalogKw = await selectAll<KeywordCard>(client, 'keyword_cards', false);
      const catalogEx = await selectAll<ExplanationCard>(client, 'explanation_cards', false);
      const published =
        input.card_kind === 'keyword'
          ? catalogKw.find((c) => c.id === input.keyword_card_id)?.status === 'published'
          : catalogEx.find((c) => c.id === input.explanation_card_id)?.status === 'published';
      if (!published) throw new Error('Only published cards can be saved');
      const saved = (await selectAll<SavedCard>(client, 'saved_cards', false)).filter(
        (s) => s.user_id === input.user_id
      );
      const existing = saved.find((s) => {
        if (s.card_kind !== input.card_kind) return false;
        if (input.card_kind === 'keyword') return s.keyword_card_id === input.keyword_card_id;
        return s.explanation_card_id === input.explanation_card_id;
      });
      if (existing) {
        const del = client.from('saved_cards').delete().eq('id', existing.id);
        const res = await (del as unknown as PromiseLike<{ error: QueryError | null }>);
        missingOrThrow(res.error, false);
        return { saved: false, row: null };
      }
      const row = {
        user_id: input.user_id,
        card_kind: input.card_kind,
        keyword_card_id: input.card_kind === 'keyword' ? input.keyword_card_id || null : null,
        explanation_card_id:
          input.card_kind === 'explanation' ? input.explanation_card_id || null : null,
      };
      const ins = await client.from('saved_cards').insert(row);
      missingOrThrow(ins.error, false);
      const created = (await selectAll<SavedCard>(client, 'saved_cards', false)).find((s) => {
        if (s.user_id !== input.user_id || s.card_kind !== input.card_kind) return false;
        if (input.card_kind === 'keyword') return s.keyword_card_id === input.keyword_card_id;
        return s.explanation_card_id === input.explanation_card_id;
      });
      return {
        saved: true,
        row: created || ({ ...row, id: 'pending', created_at: new Date().toISOString() } as SavedCard),
      };
    },
    async seedDrafts(created_by) {
      const existing = await selectAll<KeywordCard>(client, 'keyword_cards', false);
      const existingEx = await selectAll<ExplanationCard>(client, 'explanation_cards', false);
      if (existing.length > 0 || existingEx.length > 0) {
        return {
          ok: true as const,
          skipped: true,
          published: false as const,
          message: 'Store already has cards. Seed not re-run.',
          keyword_cards: existing.length,
          explanation_cards: existingEx.length,
        };
      }
      const { seedDraftExampleCardsVia } = await import('./seedDrafts');
      return seedDraftExampleCardsVia(this, created_by);
    },
  };
}
