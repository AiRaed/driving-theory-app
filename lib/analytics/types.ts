export type AnalyticsMode = 'practice' | 'mock';

export type AnalyticsEventName =
  | 'question_answered'
  | 'practice_started'
  | 'mock_test_started'
  | 'mock_test_completed'
  | 'free_limit_reached'
  | 'paywall_viewed'
  | 'checkout_clicked'
  | 'language_changed'
  | 'login'
  | 'signup_completed'
  | 'payment_success'
  | 'dashboard_viewed'
  | 'start_practice_clicked'
  | 'mock_test_clicked'
  | (string & {});

export type AnalyticsMetadata = Record<string, unknown>;

export type AttemptPayload = {
  userId: string;
  questionId: string;
  topic?: string | null;
  answerSelected?: string | null;
  correctAnswer?: string | null;
  isCorrect: boolean;
  mode: AnalyticsMode;
  language?: string | null;
  sessionId: string;
  /** Runtime client platform (ios|android|web) — not payment provider */
  platform?: string | null;
};

export type SessionStartPayload = {
  userId: string;
  mode: AnalyticsMode;
  language?: string | null;
  clientSessionId?: string | null;
  platform?: string | null;
};

export type SessionCompletePayload = {
  userId: string;
  clientSessionId: string;
  questionsAttempted?: number;
  correctAnswers?: number;
  score?: number | null;
  platform?: string | null;
};

export type SessionAction = 'start' | 'complete';

export type TrackBody = {
  event_name: AnalyticsEventName;
  metadata?: AnalyticsMetadata;
};

export type AttemptBody = {
  question_id: string;
  topic?: string | null;
  answer_selected?: string | null;
  correct_answer?: string | null;
  is_correct: boolean;
  mode: AnalyticsMode;
  language?: string | null;
  session_id: string;
  platform?: string | null;
};

export type SessionBody = {
  action: SessionAction;
  mode?: AnalyticsMode;
  language?: string | null;
  client_session_id: string;
  questions_attempted?: number;
  correct_answers?: number;
  score?: number | null;
  platform?: string | null;
};

export type AdminUserFilter =
  | 'all'
  | 'active_today'
  | 'free_limit'
  | 'paywall'
  | 'checkout'
  | 'paid'
  | 'not_paid'
  | 'lang_ar'
  | 'lang_ur'
  | 'lang_en'
  | 'lang_ro'
  | 'lang_pl'
  | 'lang_pt'
  | 'lang_bn'
  | 'lang_fa'
  | 'mock_started'
  | 'mock_completed';

export type UserLearningStatsRow = {
  user_id: string;
  questions_attempted: number;
  unique_questions_attempted: number;
  correct_answers: number;
  incorrect_answers: number;
  practice_sessions: number;
  mock_tests_started: number;
  mock_tests_completed: number;
  latest_mock_score: number | null;
  best_mock_score: number | null;
  free_questions_used: number;
  free_limit_reached: boolean;
  paywall_seen_count: number;
  checkout_clicked_count: number;
  has_purchased: boolean;
  preferred_language: string | null;
  last_language_used: string | null;
  first_activity_at: string | null;
  last_activity_at: string | null;
  /** Runtime platform of most recent activity: ios | android | web */
  last_platform: string | null;
  /** Unique runtime platforms seen for this user */
  platforms_used: string[] | null;
  updated_at: string;
};

export type QuestionAttemptRow = {
  id: string;
  user_id: string;
  question_id: string;
  topic: string | null;
  answer_selected: string | null;
  correct_answer: string | null;
  is_correct: boolean;
  mode: AnalyticsMode;
  language: string | null;
  session_id: string;
  created_at: string;
};

export type LearningSessionRow = {
  id: string;
  user_id: string;
  mode: AnalyticsMode;
  language: string | null;
  started_at: string;
  completed_at: string | null;
  questions_attempted: number;
  correct_answers: number;
  score: number | null;
  is_completed: boolean;
  client_session_id: string | null;
};

export type ProductEventRow = {
  id: string;
  user_id: string | null;
  event_name: string;
  metadata: AnalyticsMetadata;
  created_at: string;
};
