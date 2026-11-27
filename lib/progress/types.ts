export const PRACTICE_CONTENT_VERSION = 'v2';

export interface ProgressQuestionRef {
  id: string;
  topicId: string;
}

export interface ProgressAnswer {
  questionId: string;
  topicId: string;
  isCorrect: boolean;
  selectedAnswer: number;
  attemptCount: number;
}

export interface TopicProgress {
  total: number;
  answered: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  completionPercent: number;
  accuracyPercent: number;
}

export interface ProgressSummary {
  contentVersion: typeof PRACTICE_CONTENT_VERSION;
  overall: TopicProgress;
  topics: Record<string, TopicProgress>;
}
