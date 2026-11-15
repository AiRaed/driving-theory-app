import type {
  ExplanationCard,
  ExplanationFormat,
  ExplanationOverride,
  ExplanationRecommendationRecord,
  KeywordCard,
  KeywordCardQuestionLink,
  KeywordSourceField,
  KeywordTerm,
  LearningCardKind,
  LearningCardStatus,
  SavedCard,
} from './types';
import type { LearningCardsBackend } from './backend';

export interface UpsertKeywordInput {
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
}

export interface UpsertExplanationInput {
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
  /** Admin Save Hint: publish immediately when explanation text is complete. */
  activate?: boolean;
}

export interface OverridePatch {
  admin_override?: ExplanationOverride | null;
  override_note?: string;
  card_unnecessary?: boolean;
  updated_by?: string | null;
}

export interface RecommendationListFilters {
  classification?: string;
  topic?: string;
  priority?: string;
  card_status?: string;
}

export interface PublishedForQuestion {
  question_id: string;
  language: string;
  keywords: KeywordCard[];
  terms: KeywordTerm[];
  explanation: ExplanationCard | null;
  dvsa_approved: false;
}

export interface SavedLibrary {
  saved: SavedCard[];
  keywords: KeywordCard[];
  explanations: ExplanationCard[];
}

export interface SeedDraftResult {
  ok: true;
  skipped: boolean;
  published: false;
  message?: string;
  keyword_cards: string[] | number;
  explanation_cards: string[] | number;
  linked_questions?: string[];
}

export interface LearningCardsRepository {
  backend: LearningCardsBackend;
  listKeywordCatalog(): Promise<{
    terms: KeywordTerm[];
    cards: KeywordCard[];
    links: KeywordCardQuestionLink[];
  }>;
  upsertKeywordCard(input: UpsertKeywordInput): Promise<KeywordCard>;
  linkKeywordToQuestion(
    term_key: string,
    question_id: string,
    source_field?: KeywordSourceField | null
  ): Promise<KeywordCardQuestionLink>;
  setCardStatus(
    kind: LearningCardKind,
    id: string,
    to: LearningCardStatus,
    updated_by?: string | null
  ): Promise<KeywordCard | ExplanationCard>;
  listExplanationCards(questionId?: string): Promise<ExplanationCard[]>;
  upsertExplanationCard(input: UpsertExplanationInput): Promise<ExplanationCard>;
  removeExplanationCard(
    questionId: string,
    language?: string,
    updated_by?: string | null
  ): Promise<ExplanationCard | null>;
  disableExplanationCard(
    questionId: string,
    language?: string,
    updated_by?: string | null
  ): Promise<ExplanationCard | null>;
  listReusableExplanationHints(): Promise<ExplanationCard[]>;
  listRecommendations(filters?: RecommendationListFilters): Promise<{
    rows: Array<ExplanationRecommendationRecord & { card_status: string }>;
    totals: Record<string, Record<string, number> | number>;
  }>;
  getRecommendation(
    questionId: string
  ): Promise<(ExplanationRecommendationRecord & { card_status: string }) | null>;
  saveOverride(
    questionId: string,
    patch: OverridePatch
  ): Promise<(ExplanationRecommendationRecord & { card_status: string }) | null>;
  getPublishedForQuestion(questionId: string, language: string): Promise<PublishedForQuestion>;
  listSavedForUser(userId: string): Promise<SavedLibrary>;
  toggleSavedCard(input: {
    user_id: string;
    card_kind: LearningCardKind;
    keyword_card_id?: string | null;
    explanation_card_id?: string | null;
  }): Promise<{ saved: boolean; row: SavedCard | null }>;
  seedDrafts(created_by?: string | null): Promise<SeedDraftResult>;
}
