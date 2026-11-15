import type { KeywordCardsRepository } from './repository';
import { executeKeywordDraftImport } from './importDrafts';
import type { KeywordDraftFile } from './draftTypes';
import {
  addKeywordSave,
  createKeyword,
  linkKeywordQuestion,
  listKeywords,
  listPublishedForQuestion,
  listSavedKeywords,
  removeKeyword,
  setKeywordImage,
  setKeywordStatus,
  toggleKeywordSave,
  unlinkKeywordQuestion,
  updateKeyword,
} from './localStore';

export function createLocalKeywordCardsRepository(): KeywordCardsRepository {
  const repository: KeywordCardsRepository = {
    backend: 'local',
    list: async (filters) => listKeywords(filters),
    create: async (input, userId) => createKeyword(input, userId),
    update: async (id, input, userId) => updateKeyword(id, input, userId),
    setStatus: async (id, to, userId) => setKeywordStatus(id, to, userId),
    setImage: async (id, image, userId) => setKeywordImage(id, image, userId),
    remove: async (id) => removeKeyword(id),
    link: async (keywordId, questionId, userId) =>
      linkKeywordQuestion(keywordId, questionId, userId),
    unlink: async (keywordId, questionId) => unlinkKeywordQuestion(keywordId, questionId),
    listPublishedForQuestion: async (questionId) => listPublishedForQuestion(questionId),
    listSaved: async (userId) => listSavedKeywords(userId),
    addSave: async (userId, keywordId) => addKeywordSave(userId, keywordId),
    toggleSave: async (userId, keywordId) => {
      const result = toggleKeywordSave(userId, keywordId);
      return { saved: result.saved };
    },
    importDrafts: (draft: KeywordDraftFile, officialQuestionIds, userId) =>
      importLocalDrafts(repository, draft, officialQuestionIds, userId),
  };
  return repository;
}

async function importLocalDrafts(
  repository: KeywordCardsRepository,
  draft: KeywordDraftFile,
  officialQuestionIds: ReadonlySet<string>,
  userId?: string | null
) {
  const existing = await repository.list();
  return executeKeywordDraftImport({
    draft,
    officialQuestionIds,
    existing: {
      keywords: existing.keywords,
      links: existing.links,
    },
    writer: {
      createDraft: async (input) =>
        repository.create(
          {
            term_en: input.term_en,
            explanation_en: input.explanation_en,
            translation_ar: '',
            explanation_ar: '',
            notes: input.notes,
          },
          userId
        ),
      updateDraftContent: async (id, input) => {
        const current = (await repository.list()).keywords.find((row) => row.id === id);
        if (!current || current.status !== 'draft') {
          throw new Error('Import refused to edit a keyword that is not a draft');
        }
        return repository.update(
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
      },
      link: async (keywordId, questionId) => {
        await repository.link(keywordId, questionId, userId);
      },
      removeCreated: async (id) => repository.remove(id),
    },
  });
}
