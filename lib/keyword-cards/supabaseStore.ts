/**
 * Supabase Keyword Cards repository.
 * Admin calls use the service role. Learner calls use the user client, so RLS
 * hides unpublished rows. The app also filters to published before returning
 * learner payloads.
 */

import type { LearningCardStatus } from '../learning-cards/types';
import { KeywordCardsNotMigratedError, isMissingKeywordCardsTable } from './errors';
import type { KeywordCardsRepository } from './repository';
import { executeKeywordDraftImport } from './importDrafts';
import type { KeywordDraftFile } from './draftTypes';
import {
  asKeywordRecord,
  assertImageOnly,
  assertReviewable,
  assertStatusTransition,
  isPublishedKeyword,
  prepareKeywordFields,
  toLearnerKeyword,
} from './rules';
import type {
  KeywordImageInput,
  KeywordInput,
  KeywordQuestionLink,
  KeywordRecord,
  KeywordSave,
} from './types';

type QueryError = { message?: string; code?: string; details?: string };

export type KeywordDb = {
  from: (table: string) => {
    select: (cols?: string) => KeywordQuery;
    insert: (row: unknown) => KeywordQuery;
    update: (row: unknown) => KeywordQuery;
    delete: () => KeywordQuery;
  };
};

type KeywordQuery = {
  select: (cols?: string) => KeywordQuery;
  eq: (col: string, val: unknown) => KeywordQuery;
  in: (col: string, val: unknown[]) => KeywordQuery;
  order: (col: string, opts?: { ascending?: boolean }) => KeywordQuery;
  maybeSingle: () => PromiseLike<{ data: unknown; error: QueryError | null }>;
  single: () => PromiseLike<{ data: unknown; error: QueryError | null }>;
  then: PromiseLike<{ data: unknown; error: QueryError | null }>['then'];
};

function mapDbError(error: QueryError, learnerEmpty: boolean): void {
  if (isMissingKeywordCardsTable(error)) {
    if (learnerEmpty) return;
    throw new KeywordCardsNotMigratedError(error.message);
  }
  const message = `${error.message || ''} ${error.details || ''}`;
  if (error.code === '23505') {
    if (message.includes('keyword_question_links')) {
      throw new Error('That question is already linked');
    }
    if (message.includes('keyword_saves')) {
      throw new Error('That keyword card is already saved');
    }
    throw new Error('A keyword card with this term already exists');
  }
  if (error.code === '23503') throw new Error('Official question was not found');
  throw new Error(error.message || 'Keyword cards query failed');
}

async function unwrap<T>(
  query: PromiseLike<{ data: unknown; error: QueryError | null }>,
  learnerEmpty: boolean
): Promise<T | null> {
  const { data, error } = await query;
  if (error) {
    if (isMissingKeywordCardsTable(error) && learnerEmpty) return null;
    mapDbError(error, learnerEmpty);
    return null;
  }
  return data as T;
}

function asLink(row: KeywordQuestionLink): KeywordQuestionLink {
  return {
    keyword_id: row.keyword_id,
    question_id: row.question_id,
    created_at: row.created_at,
    created_by: row.created_by ?? null,
  };
}

export function createSupabaseKeywordCardsRepository(
  client: KeywordDb,
  opts: { learnerEmptyOnMissing?: boolean } = {}
): KeywordCardsRepository {
  const learnerEmpty = opts.learnerEmptyOnMissing === true;

  async function getRow(id: string): Promise<KeywordRecord | null> {
    const data = await unwrap<KeywordRecord | null>(
      client.from('keywords').select('*').eq('id', id).maybeSingle(),
      learnerEmpty
    );
    return data ? asKeywordRecord(data) : null;
  }

  async function requireRow(id: string): Promise<KeywordRecord> {
    const row = await getRow(id);
    if (!row) throw new Error('Keyword card not found');
    return row;
  }

  return {
    backend: 'supabase',
    async list(filters) {
      const data = await unwrap<KeywordRecord[]>(
        client.from('keywords').select('*').order('term_en', { ascending: true }),
        learnerEmpty
      );
      const links = await unwrap<KeywordQuestionLink[]>(
        client.from('keyword_question_links').select('*'),
        learnerEmpty
      );
      const q = String(filters?.q || '').trim().toLowerCase();
      const keywords = (data || [])
        .map(asKeywordRecord)
        .filter((row) => {
          if (filters?.status && row.status !== filters.status) return false;
          if (!q) return true;
          return (
            row.term_en.toLowerCase().includes(q) ||
            row.term_normalized.includes(q) ||
            row.translation_ar.toLowerCase().includes(q) ||
            row.explanation_en.toLowerCase().includes(q)
          );
        })
        .sort((a, b) => a.term_en.localeCompare(b.term_en));
      return { keywords, links: (links || []).map(asLink) };
    },
    async create(input, userId) {
      const fields = prepareKeywordFields(input);
      const inserted = await unwrap<KeywordRecord>(
        client
          .from('keywords')
          .insert({
            ...fields,
            image_storage_path: null,
            status: 'draft',
            created_by: userId || null,
            updated_by: userId || null,
            published_at: null,
            reviewed_at: null,
            reviewed_by: null,
          })
          .select('*')
          .single(),
        false
      );
      if (!inserted) throw new Error('Keyword card not found');
      const row = asKeywordRecord(inserted);
      if (row.status !== 'draft') {
        throw new Error('New keyword cards must stay unpublished');
      }
      return row;
    },
    async update(id, input, userId) {
      const existing = await requireRow(id);
      const fields = prepareKeywordFields(input);
      const imageChanged = (fields.image_url || null) !== (existing.image_url || null);
      if (existing.status === 'published' || existing.status === 'approved') {
        assertReviewable(
          { explanation_en: fields.explanation_en },
          existing.status === 'published' ? 'published' : 'approved'
        );
      }
      const updated = await unwrap<KeywordRecord>(
        client
          .from('keywords')
          .update({
            ...fields,
            image_storage_path: fields.image_url
              ? imageChanged
                ? null
                : existing.image_storage_path
              : null,
            updated_by: userId || null,
          })
          .eq('id', id)
          .select('*')
          .single(),
        false
      );
      if (!updated) throw new Error('Keyword card not found');
      return asKeywordRecord(updated);
    },
    async setStatus(id, to: LearningCardStatus, userId) {
      const existing = await requireRow(id);
      assertStatusTransition(existing.status, to);
      assertReviewable(existing, to);
      const stamp = new Date().toISOString();
      const updated = await unwrap<KeywordRecord>(
        client
          .from('keywords')
          .update({
            status: to,
            updated_by: userId || null,
            published_at: to === 'published' ? stamp : null,
            reviewed_at: to === 'approved' || to === 'published' ? stamp : existing.reviewed_at,
            reviewed_by:
              to === 'approved' || to === 'published' ? userId || null : existing.reviewed_by,
          })
          .eq('id', id)
          .select('*')
          .single(),
        false
      );
      if (!updated) throw new Error('Keyword card not found');
      return asKeywordRecord(updated);
    },
    async setImage(id, image: KeywordImageInput, userId) {
      const existing = await requireRow(id);
      const image_url = String(image.image_url || '').trim() || null;
      assertImageOnly(image_url);
      const updated = await unwrap<KeywordRecord>(
        client
          .from('keywords')
          .update({
            image_url,
            image_alt: image_url
              ? String(image.image_alt || existing.image_alt || '').trim() || null
              : null,
            image_storage_path: image_url
              ? image.image_storage_path === undefined
                ? image_url === existing.image_url
                  ? existing.image_storage_path
                  : null
                : image.image_storage_path
              : null,
            updated_by: userId || null,
          })
          .eq('id', id)
          .select('*')
          .single(),
        false
      );
      if (!updated) throw new Error('Keyword card not found');
      return asKeywordRecord(updated);
    },
    async remove(id) {
      const existing = await requireRow(id);
      if (existing.status === 'published') {
        throw new Error('Unpublish the keyword card before deleting it');
      }
      await unwrap(client.from('keyword_saves').delete().eq('keyword_id', id), false);
      await unwrap(client.from('keyword_question_links').delete().eq('keyword_id', id), false);
      await unwrap(client.from('keywords').delete().eq('id', id), false);
    },
    async link(keywordId, questionId, userId) {
      await requireRow(keywordId);
      const question_id = String(questionId || '').trim();
      if (!question_id) throw new Error('Official question is required');
      const existing = await unwrap<KeywordQuestionLink | null>(
        client
          .from('keyword_question_links')
          .select('*')
          .eq('keyword_id', keywordId)
          .eq('question_id', question_id)
          .maybeSingle(),
        false
      );
      if (existing) return asLink(existing);
      const inserted = await unwrap<KeywordQuestionLink>(
        client
          .from('keyword_question_links')
          .insert({
            keyword_id: keywordId,
            question_id,
            created_by: userId || null,
          })
          .select('*')
          .single(),
        false
      );
      if (!inserted) throw new Error('Official question was not found');
      return asLink(inserted);
    },
    async unlink(keywordId, questionId) {
      await requireRow(keywordId);
      await unwrap(
        client
          .from('keyword_question_links')
          .delete()
          .eq('keyword_id', keywordId)
          .eq('question_id', String(questionId || '').trim()),
        false
      );
    },
    async listPublishedForQuestion(questionId) {
      const links = await unwrap<Array<{ keyword_id: string }>>(
        client.from('keyword_question_links').select('keyword_id').eq('question_id', questionId),
        learnerEmpty
      );
      const ids = (links || []).map((row) => row.keyword_id);
      if (ids.length === 0) return [];
      const rows = await unwrap<KeywordRecord[]>(
        client.from('keywords').select('*').in('id', ids),
        learnerEmpty
      );
      return (rows || [])
        .map(asKeywordRecord)
        .filter(isPublishedKeyword)
        .sort((a, b) => a.term_en.localeCompare(b.term_en))
        .map(toLearnerKeyword);
    },
    async listSaved(userId) {
      const saves = await unwrap<KeywordSave[]>(
        client.from('keyword_saves').select('*').eq('user_id', userId),
        learnerEmpty
      );
      const ids = Array.from(new Set((saves || []).map((row) => row.keyword_id)));
      if (ids.length === 0) return [];
      const rows = await unwrap<KeywordRecord[]>(
        client.from('keywords').select('*').in('id', ids),
        learnerEmpty
      );
      return (rows || [])
        .map(asKeywordRecord)
        .filter(isPublishedKeyword)
        .sort((a, b) => a.term_en.localeCompare(b.term_en))
        .map(toLearnerKeyword);
    },
    async addSave(userId, keywordId) {
      const keyword = await getRow(keywordId);
      if (!keyword || !isPublishedKeyword(keyword)) {
        throw new Error('Only published keyword cards can be saved');
      }
      const existing = await unwrap<KeywordSave | null>(
        client
          .from('keyword_saves')
          .select('*')
          .eq('user_id', userId)
          .eq('keyword_id', keywordId)
          .maybeSingle(),
        learnerEmpty
      );
      if (existing) return existing;
      const inserted = await unwrap<KeywordSave>(
        client
          .from('keyword_saves')
          .insert({ user_id: userId, keyword_id: keywordId })
          .select('*')
          .single(),
        false
      );
      if (!inserted) throw new Error('Only published keyword cards can be saved');
      return inserted;
    },
    async toggleSave(userId, keywordId) {
      const existing = await unwrap<KeywordSave | null>(
        client
          .from('keyword_saves')
          .select('*')
          .eq('user_id', userId)
          .eq('keyword_id', keywordId)
          .maybeSingle(),
        learnerEmpty
      );
      if (existing) {
        await unwrap(
          client.from('keyword_saves').delete().eq('id', existing.id).eq('user_id', userId),
          false
        );
        return { saved: false };
      }
      await this.addSave(userId, keywordId);
      return { saved: true };
    },
    async importDrafts(draft: KeywordDraftFile, officialQuestionIds, userId) {
      const existing = await this.list();
      return executeKeywordDraftImport({
        draft,
        officialQuestionIds,
        existing: { keywords: existing.keywords, links: existing.links },
        writer: {
          createDraft: async (input) => {
            const row = await this.create(
              {
                term_en: input.term_en,
                explanation_en: input.explanation_en,
                translation_ar: '',
                explanation_ar: '',
                notes: input.notes,
              },
              userId
            );
            return { id: row.id, status: row.status };
          },
          updateDraftContent: async (id, input) => {
            const current = await getRow(id);
            if (!current || current.status !== 'draft') {
              throw new Error('Import refused to edit a keyword that is not a draft');
            }
            const row = await this.update(
              id,
              {
                term_en: input.term_en,
                explanation_en: input.explanation_en,
                translation_ar: current.translation_ar,
                explanation_ar: current.explanation_ar,
                image_url: current.image_url,
                image_alt: current.image_alt,
                notes: input.notes,
              },
              userId
            );
            return { id: row.id, status: row.status };
          },
          link: async (keywordId, questionId) => {
            await this.link(keywordId, questionId, userId);
          },
          removeCreated: async (id) => this.remove(id),
        },
      });
    },
  };
}
