import type { LearningCardsBackend } from '../learning-cards/backend';
import type { LearningCardStatus } from '../learning-cards/types';
import type { KeywordDraftFile } from './draftTypes';
import type { KeywordDraftImportResult } from './importDrafts';
import type {
  KeywordImageInput,
  KeywordInput,
  KeywordQuestionLink,
  KeywordRecord,
  KeywordSave,
  LearnerKeywordCard,
} from './types';

export interface KeywordCardsRepository {
  backend: LearningCardsBackend;
  list(filters?: { q?: string; status?: string }): Promise<{
    keywords: KeywordRecord[];
    links: KeywordQuestionLink[];
  }>;
  create(input: KeywordInput, userId?: string | null): Promise<KeywordRecord>;
  update(id: string, input: KeywordInput, userId?: string | null): Promise<KeywordRecord>;
  setStatus(id: string, to: LearningCardStatus, userId?: string | null): Promise<KeywordRecord>;
  setImage(id: string, image: KeywordImageInput, userId?: string | null): Promise<KeywordRecord>;
  remove(id: string): Promise<void>;
  link(keywordId: string, questionId: string, userId?: string | null): Promise<KeywordQuestionLink>;
  unlink(keywordId: string, questionId: string): Promise<void>;
  listPublishedForQuestion(questionId: string): Promise<LearnerKeywordCard[]>;
  listSaved(userId: string): Promise<LearnerKeywordCard[]>;
  addSave(userId: string, keywordId: string): Promise<KeywordSave>;
  toggleSave(userId: string, keywordId: string): Promise<{ saved: boolean }>;
  importDrafts(
    draft: KeywordDraftFile,
    officialQuestionIds: ReadonlySet<string>,
    userId?: string | null
  ): Promise<KeywordDraftImportResult>;
}
