"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Question } from "@/data/questions";
import { cn } from "@/lib/utils";
import { shuffleArray } from "@/lib/shuffle";
import TTSButton from "@/components/TTSButton";
import AnswerOptionContent from "@/components/AnswerOptionContent";
import ArabicDraftNote from "@/components/ArabicDraftNote";
import DisclaimerModal from "@/components/DisclaimerModal";
import DvsaLicenceNotice from "@/components/DvsaLicenceNotice";
import { enLabel } from "@/lib/i18n/ui-strings";
import PaywallOverlay from "@/components/PaywallOverlay";
import ContentMaintenanceNotice from "@/components/ContentMaintenanceNotice";
import { useAccess } from '@/lib/providers/AccessProvider';
import { decideMockAccess } from '@/lib/access/entitlement';
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useQuestionBank } from "@/lib/questions/useQuestionBank";
import { useContentMaintenance } from "@/lib/hooks/useContentMaintenance";
import { 
  loadUrduTranslations,
  loadRomanianTranslations,
  loadPolishTranslations,
  loadPortugueseTranslations,
  loadBengaliTranslations,
  loadPersianTranslations,
  getQuestionPromptTranslation,
  getOptionTranslation,
  isLtrTranslationLang,
  type TranslationData 
} from '@/lib/translations';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import {
  analyticsLanguage,
  clearClientSessionId,
  getOrCreateClientSessionId,
  trackAttempt,
  trackEvent,
  trackSessionComplete,
  trackSessionStart,
} from '@/lib/analytics/client';
import {
  ACCOUNT_LOCAL_KEYS,
  ACCOUNT_SESSION_KEYS,
  readAccountJson,
  removeAccountKey,
  writeAccountJson,
} from '@/lib/account/clientAccountStorage';

interface AnswerRecord {
  questionId: string;
  correct: boolean;
  correctIndex: number;
  chosenIndex: number | null;
}

interface QuestionWithShuffled extends Question {
  optionsShuffled: { en: string; ar: string; correct: boolean }[];
}

interface MockSession {
  questionIds: string[];
  shuffledOptionIndices: Record<string, number[]>; // questionId -> shuffled option indices
  answers: AnswerRecord[];
  currentIndex: number;
  isFinished: boolean;
  /** Seconds already spent, so leaving the page does not restart the clock. */
  elapsedSec?: number;
  /** Invalidate in-progress mocks after DVSA bank cutover */
  bankVersion?: string;
}

const MOCK_PAGE_SHELL = 'relative min-h-screen bg-[#F7F9FC] pb-28 md:pb-10';

function formatMockTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function MockWave() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-14 w-full sm:h-16" viewBox="0 0 1200 80" preserveAspectRatio="none">
      <path d="M0 36c90 28 170-22 280-4 100 16 150 30 250 8 110-24 170-34 270-6 90 26 150 6 230-8 60-10 110 0 170 12v42H0Z" fill="rgba(22,140,186,0.55)" />
      <path d="M0 56c130 16 210-18 340 0 110 14 170 16 270 0 120-18 190-6 290 8 80 10 150 2 300-6v22H0Z" fill="rgba(22,140,186,0.28)" />
    </svg>
  );
}

const MOCK_BANK_VERSION = 'dvsa-v2-758';

/**
 * MOCK TEST CONFIGURATION CONSTANTS
 *
 * SAFEGUARDED - DO NOT MODIFY WITHOUT REVIEW
 *
 * Session cache is account-scoped (UI convenience). Authoritative Mock access
 * and learning analytics are server-side per Supabase user_id.
 *
 * QUESTION_COUNT: Number of questions per mock test
 * - Set to 50 to match DVSA official mock test standard
 * - Must not exceed total available questions in database
 * - Used in generateMockQuestions() to limit selection
 */
const QUESTION_COUNT = 50;
const MOCK_ANALYTICS_SESSION_KEY = ACCOUNT_SESSION_KEYS.mockAnalytics;

export default function MockTestPage() {
  const router = useRouter();
  const supabase = createClient();
  // SINGLE SOURCE OF TRUTH: useAccess from AccessProvider
  const { loading, statusConfirmed, paid } = useAccess();
  const { loading: maintenanceLoading, enabled: contentMaintenance } =
    useContentMaintenance();
  const { lang: translationLang } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  
  const [mockQuestions, setMockQuestions] = useState<QuestionWithShuffled[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const mockSessionIdRef = useRef<string | null>(null);
  const mockCompleteTrackedRef = useRef(false);
  const mockStartedTrackedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);
  const sessionRef = useRef<MockSession | null>(null);
  userIdRef.current = user?.id ?? null;
  
  // Mock Test is PAID ONLY — free_questions_used never unlocks Mock.
  useEffect(() => {
    if (!mockQuestions.length || isFinished) return;
    const id = window.setInterval(() => setElapsedSec((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, [mockQuestions.length, isFinished]);

  const mockAccess = decideMockAccess({
    paid: paid === true,
    statusConfirmed,
  });
  const showPaywall = !loading && mockAccess.showPaywall;

  // Check authentication + reset in-memory Mock state on account switch
  useEffect(() => {
    const applyUser = (nextUser: User | null) => {
      setUser((prev) => {
        if (prev?.id && nextUser?.id && prev.id !== nextUser.id) {
          setMockQuestions([]);
          setCurrentIndex(0);
          setSelectedOptionIndex(null);
          setAnswers([]);
          setIsFinished(false);
          setElapsedSec(0);
          mockSessionIdRef.current = null;
          mockCompleteTrackedRef.current = false;
          mockStartedTrackedRef.current = false;
          clearClientSessionId(MOCK_ANALYTICS_SESSION_KEY);
        }
        return nextUser;
      });
      if (!nextUser) {
        router.push('/auth');
      }
    };

    void supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      applyUser(authUser);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const [urTranslations, setUrTranslations] = useState<TranslationData | null>(null);
  const [roTranslations, setRoTranslations] = useState<TranslationData | null>(null);
  const [plTranslations, setPlTranslations] = useState<TranslationData | null>(null);
  const [ptTranslations, setPtTranslations] = useState<TranslationData | null>(null);
  const [bnTranslations, setBnTranslations] = useState<TranslationData | null>(null);
  const [faTranslations, setFaTranslations] = useState<TranslationData | null>(null);
  const {
    questions,
    urTranslations: bankUrdu,
    roTranslations: bankRo,
    plTranslations: bankPl,
    ptTranslations: bankPt,
    faTranslations: bankFa,
    source: bankSource,
    ready: bankReady,
  } = useQuestionBank();

  const localeTranslations =
    translationLang === 'fa'
      ? faTranslations
      : translationLang === 'bn'
      ? bnTranslations
      : translationLang === 'pt'
      ? ptTranslations
      : translationLang === 'pl'
        ? plTranslations
        : translationLang === 'ro'
          ? roTranslations
          : translationLang === 'ur'
            ? urTranslations
            : null;

  // Prefer DB Urdu when the published bank is loaded; otherwise fall back to locale JSON.
  useEffect(() => {
    if (bankSource === "database" && bankUrdu && Object.keys(bankUrdu).length > 0) {
      setUrTranslations(bankUrdu);
      return;
    }
    if (translationLang === "ur" || !urTranslations) {
      loadUrduTranslations().then(setUrTranslations);
    }
  }, [bankSource, bankUrdu, translationLang]);

  // Prefer DB Romanian when the published bank is loaded; otherwise fall back to locale JSON.
  useEffect(() => {
    if (bankSource === "database" && bankRo && Object.keys(bankRo).length > 0) {
      setRoTranslations(bankRo);
      return;
    }
    if (translationLang === "ro") {
      loadRomanianTranslations().then(setRoTranslations);
    }
  }, [bankSource, bankRo, translationLang]);

  // Prefer DB Polish when the published bank is loaded; otherwise fall back to locale JSON.
  useEffect(() => {
    if (bankSource === "database" && bankPl && Object.keys(bankPl).length > 0) {
      setPlTranslations(bankPl);
      return;
    }
    if (translationLang === "pl") {
      loadPolishTranslations().then(setPlTranslations);
    }
  }, [bankSource, bankPl, translationLang]);

  // Prefer DB Portuguese when the published bank is loaded; otherwise fall back to locale JSON.
  useEffect(() => {
    if (bankSource === "database" && bankPt && Object.keys(bankPt).length > 0) {
      setPtTranslations(bankPt);
      return;
    }
    if (translationLang === "pt") {
      loadPortugueseTranslations().then(setPtTranslations);
    }
  }, [bankSource, bankPt, translationLang]);

  useEffect(() => {
    if (translationLang === 'bn') {
      loadBengaliTranslations().then(setBnTranslations);
    }
  }, [translationLang]);

  useEffect(() => {
    if (bankSource === "database" && bankFa && Object.keys(bankFa).length > 0) {
      setFaTranslations(bankFa);
      return;
    }
    if (translationLang === "fa") {
      loadPersianTranslations().then(setFaTranslations);
    }
  }, [bankSource, bankFa, translationLang]);

  /**
   * MOCK TEST QUESTION GENERATION LOGIC
   * 
   * SAFEGUARDED IMPLEMENTATION - DO NOT MODIFY WITHOUT REVIEW
   * 
   * Current Behavior:
   * - Generates a fresh set of 50 random questions on every new test attempt
   * - Uses simple random shuffle of ALL questions from the database
   * - Takes first 50 questions after shuffle (no duplicates guaranteed by slice)
   * - Shuffles options for each selected question
   */
  const generateMockQuestions = (): QuestionWithShuffled[] => {
    // SAFEGUARD: Ensure questions array exists and is not empty
    if (!questions || questions.length === 0) {
      console.error('Mock Test: Questions array is empty or undefined');
      return [];
    }

    // SAFEGUARD: Create a copy to avoid mutating original questions array
    const questionsCopy = [...questions];
    
    // Random shuffle: Fisher-Yates style using sort comparator
    // This ensures different question order on each test attempt
    const shuffled = questionsCopy.sort(() => Math.random() - 0.5);
    
    // SAFEGUARD: Ensure we don't request more questions than available
    const count = Math.min(QUESTION_COUNT, questions.length);
    
    // Take first N questions after shuffle (guarantees no duplicates)
    // Map each question to include shuffled options
    return shuffled.slice(0, count).map(q => ({
      ...q,
      // Shuffle options for each question to randomize answer positions
      optionsShuffled: shuffleArray(q.options)
    }));
  };

  // Helper to get shuffled option indices mapping
  const getShuffledOptionIndices = (questions: QuestionWithShuffled[]): Record<string, number[]> => {
    const indices: Record<string, number[]> = {};
    for (const q of questions) {
      // Find the mapping: for each shuffled option, find its original index
      const mapping: number[] = [];
      for (const shuffledOpt of q.optionsShuffled) {
        const origIdx = q.options.findIndex(opt => 
          opt.en === shuffledOpt.en && opt.ar === shuffledOpt.ar && opt.correct === shuffledOpt.correct
        );
        if (origIdx !== -1) mapping.push(origIdx);
      }
      indices[q.id] = mapping;
    }
    return indices;
  };

  // Load session from account-scoped localStorage (cache only)
  const loadSession = (): MockSession | null => {
    if (!user?.id) return null;
    return readAccountJson<MockSession>(user.id, ACCOUNT_LOCAL_KEYS.mockSession);
  };

  // Save session to account-scoped localStorage
  const saveSession = (session: MockSession) => {
    if (!user?.id) return;
    writeAccountJson(user.id, ACCOUNT_LOCAL_KEYS.mockSession, session);
  };

  // Clear session from account-scoped localStorage
  const clearSession = () => {
    if (!user?.id) return;
    removeAccountKey(user.id, ACCOUNT_LOCAL_KEYS.mockSession);
  };

  // Restore session or initialize new test
  const initializeTest = (forceNew: boolean = false) => {
    if (forceNew) {
      clearSession();
      setElapsedSec(0);
    }

    const savedSession = loadSession();

    // Drop incompatible saved mocks (pre-V2 IDs / missing bankVersion).
    if (
      savedSession &&
      !forceNew &&
      savedSession.bankVersion !== MOCK_BANK_VERSION
    ) {
      clearSession();
    } else if (savedSession && !forceNew && savedSession.shuffledOptionIndices) {
      // Restore from saved session
      const restoredQuestions = savedSession.questionIds
        .map(id => {
          const q = questions.find(q => q.id === id);
          if (!q) return null;
          const shuffledIndices = savedSession.shuffledOptionIndices[id];
          if (!shuffledIndices) return null;
          return {
            ...q,
            optionsShuffled: shuffledIndices.map(idx => q.options[idx])
          };
        })
        .filter((q): q is QuestionWithShuffled => q !== null);
      
      if (restoredQuestions.length === savedSession.questionIds.length) {
        setMockQuestions(restoredQuestions);
        setCurrentIndex(savedSession.currentIndex);
        setAnswers(savedSession.answers);
        setIsFinished(savedSession.isFinished);
        setElapsedSec(typeof savedSession.elapsedSec === 'number' ? savedSession.elapsedSec : 0);
        mockSessionIdRef.current = getOrCreateClientSessionId(MOCK_ANALYTICS_SESSION_KEY);
        // Don't re-fire started/completed for restored sessions
        mockStartedTrackedRef.current = true;
        mockCompleteTrackedRef.current = !!savedSession.isFinished;
        
        // Restore selected option for current question
        const currentAnswer = savedSession.answers[savedSession.currentIndex];
        setSelectedOptionIndex(currentAnswer?.chosenIndex ?? null);
        return;
      }
    }

    // Initialize new test
    const newQuestions = generateMockQuestions();
    setMockQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setAnswers([]);
    setIsFinished(false);
    setElapsedSec(0);
    mockCompleteTrackedRef.current = false;
    mockStartedTrackedRef.current = false;
    clearClientSessionId(MOCK_ANALYTICS_SESSION_KEY);
    const sid = getOrCreateClientSessionId(MOCK_ANALYTICS_SESSION_KEY);
    mockSessionIdRef.current = sid;
    trackSessionStart({
      mode: 'mock',
      language: analyticsLanguage(translationLang),
      client_session_id: sid,
    });
    void trackEvent('mock_test_started', {
      question_count: newQuestions.length,
      language: analyticsLanguage(translationLang),
    });
    mockStartedTrackedRef.current = true;
    
    // Build shuffled option indices map
    const shuffledOptionIndices = getShuffledOptionIndices(newQuestions);
    
    // Save initial session
    saveSession({
      questionIds: newQuestions.map(q => q.id),
      shuffledOptionIndices,
      answers: [],
      currentIndex: 0,
      isFinished: false,
      elapsedSec: 0,
      bankVersion: MOCK_BANK_VERSION,
    });
  };

  // Initialize test when user is authenticated and question bank is ready
  useEffect(() => {
    if (user && bankReady && questions.length > 0) {
      initializeTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, bankReady, questions]);

  const persistCurrent = (overrides?: Partial<Pick<MockSession, 'answers' | 'currentIndex' | 'isFinished' | 'elapsedSec'>>) => {
    if (!user?.id || mockQuestions.length === 0) return;
    const session: MockSession = {
      questionIds: mockQuestions.map((q) => q.id),
      shuffledOptionIndices: getShuffledOptionIndices(mockQuestions),
      answers: overrides?.answers ?? answers,
      currentIndex: overrides?.currentIndex ?? currentIndex,
      isFinished: overrides?.isFinished ?? isFinished,
      elapsedSec: overrides?.elapsedSec ?? elapsedSec,
      bankVersion: MOCK_BANK_VERSION,
    };
    sessionRef.current = session;
    saveSession(session);
  };

  // Save session whenever state changes, including the running clock.
  useEffect(() => {
    if (!user?.id || mockQuestions.length === 0) {
      sessionRef.current = null;
      return;
    }
    persistCurrent();
    // persistCurrent closes over the latest session fields listed below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockQuestions, answers, currentIndex, isFinished, elapsedSec, user?.id]);

  // Flush the latest snapshot if the page unmounts before the effect runs.
  useEffect(() => {
    return () => {
      const userId = userIdRef.current;
      const session = sessionRef.current;
      if (!userId || !session) return;
      writeAccountJson(userId, ACCOUNT_LOCAL_KEYS.mockSession, session);
    };
  }, []);

  // Reset selected option when question changes (if no saved answer exists)
  useEffect(() => {
    const currentAnswer = answers[currentIndex];
    if (currentAnswer === undefined) {
      setSelectedOptionIndex(null);
    }
  }, [currentIndex, answers]);

  // Handle option click
  const handleOptionClick = (optionIndex: number) => {
    if (isFinished) return;

    const currentQuestion = mockQuestions[currentIndex];
    const selectedOption = currentQuestion.optionsShuffled[optionIndex];
    const isCorrect = selectedOption.correct;
    const correctIndex = currentQuestion.optionsShuffled.findIndex((opt) => opt.correct);

    setSelectedOptionIndex(optionIndex);

    // Save answer at the current question index (allows updating previous answers)
    const newAnswer: AnswerRecord = {
      questionId: currentQuestion.id,
      correct: isCorrect,
      correctIndex,
      chosenIndex: optionIndex,
    };

    const newAnswers = [...answers];
    newAnswers[currentIndex] = newAnswer;
    setAnswers(newAnswers);
    persistCurrent({ answers: newAnswers });

    const sid =
      mockSessionIdRef.current ||
      getOrCreateClientSessionId(MOCK_ANALYTICS_SESSION_KEY);
    mockSessionIdRef.current = sid;
    const correctOpt = currentQuestion.optionsShuffled[correctIndex];
    trackAttempt({
      question_id: currentQuestion.id,
      topic: currentQuestion.topic,
      answer_selected: selectedOption.en,
      correct_answer: correctOpt?.en || '',
      is_correct: isCorrect,
      mode: 'mock',
      language: analyticsLanguage(translationLang),
      session_id: sid,
    });
  };

  // Handle navigation
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      // Restore previous answer state if exists
      const prevAnswer = answers[newIndex];
      setSelectedOptionIndex(prevAnswer?.chosenIndex ?? null);
      persistCurrent({ currentIndex: newIndex });
    }
  };

  const handleNext = () => {
    // Block navigation when no answer is selected
    if (!isAnswered) return;
    
    if (currentIndex < mockQuestions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      // Restore next answer state if exists
      const nextAnswer = answers[newIndex];
      setSelectedOptionIndex(nextAnswer?.chosenIndex ?? null);
      persistCurrent({ currentIndex: newIndex });
    }
  };

  const handleFinish = () => {
    // Block finish when no answer is selected
    if (!isAnswered) return;
    setIsFinished(true);
    persistCurrent({ isFinished: true });
  };

  // Record mock completion once when finished (uses latest answers state)
  useEffect(() => {
    if (!isFinished || mockCompleteTrackedRef.current) return;
    if (mockQuestions.length === 0) return;
    mockCompleteTrackedRef.current = true;
    const answered = answers.filter((a) => a);
    const correct = answered.filter((a) => a.correct).length;
    const total = mockQuestions.length;
    const sid =
      mockSessionIdRef.current ||
      getOrCreateClientSessionId(MOCK_ANALYTICS_SESSION_KEY);
    trackSessionComplete({
      mode: 'mock',
      client_session_id: sid,
      questions_attempted: answered.length || total,
      correct_answers: correct,
      score: correct,
    });
    void trackEvent('mock_test_completed', {
      score: correct,
      total,
      language: analyticsLanguage(translationLang),
    });
  }, [isFinished, answers, mockQuestions, translationLang]);

  // Handle retake
  const handleRetake = () => {
    initializeTest(true);
  };

  // Handle restart (reset to question 0 without regenerating questions)
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setAnswers([]);
    setElapsedSec(0);
    persistCurrent({ answers: [], currentIndex: 0, elapsedSec: 0 });
  };

  // Calculate score
  const correctCount = answers.filter((a) => a && a.correct).length;

  // Get wrong answers
  const wrongAnswers = answers
    .map((answer, idx) => ({
      answer,
      question: mockQuestions[idx],
    }))
    .filter((item) => item.answer && !item.answer.correct);

  if (maintenanceLoading) {
    return (
      <div className={MOCK_PAGE_SHELL}>
        <div className="mx-auto max-w-[1000px] px-4 py-6">
          <div className="text-center text-[var(--text-secondary)] font-medium">
            {enLabel('loading')}
          </div>
        </div>
      </div>
    );
  }

  if (contentMaintenance) {
    return <ContentMaintenanceNotice />;
  }

  // Show minimal loading state only on initial mount (no full-page overlay)
  // Don't block UI for access status checks
  if (!user) {
    return (
      <div className={MOCK_PAGE_SHELL}>
        <div className="mx-auto max-w-[1000px] px-4 py-6">
          <div className="text-center text-[var(--text-secondary)] font-medium">{enLabel('loading')}</div>
        </div>
      </div>
    );
  }

  // Show loading while entitlement loads; block Mock until confirmed paid.
  if (loading || !statusConfirmed) {
    if (!loading && !statusConfirmed) {
      return (
        <div className={`${MOCK_PAGE_SHELL} relative`}>
          <PaywallOverlay />
        </div>
      );
    }
    return (
      <div className={MOCK_PAGE_SHELL}>
        <div className="mx-auto max-w-[1000px] px-4 py-6">
          <div className="text-center text-[var(--text-secondary)] font-medium">{enLabel('loading')}</div>
        </div>
      </div>
    );
  }

  // Mock Test paywall for confirmed unpaid accounts
  if (showPaywall || !mockAccess.allow) {
    return (
      <div className={`${MOCK_PAGE_SHELL} relative`}>
        <PaywallOverlay />
        <div className="pointer-events-none blur-sm opacity-50">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="text-center text-[var(--text-secondary)] font-medium">{enLabel('mockRequiresPaid')}</div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state for questions
  if (mockQuestions.length === 0) {
    return (
      <div className={MOCK_PAGE_SHELL}>
        <div className="mx-auto max-w-[1000px] px-4 py-6">
          <div className="text-center text-[var(--text-secondary)] font-medium">{enLabel('loadingQuestions')}</div>
        </div>
      </div>
    );
  }

  // Show results screen
  if (isFinished) {
    // Compute results
    const total = mockQuestions.length;
    const correct = correctCount;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const pass = percent >= 86; // DVSA-style pass threshold

    return (
      <div dir="ltr" className={MOCK_PAGE_SHELL}>
        <div className="mx-auto w-full min-w-0 max-w-[1000px] px-4 py-4 sm:px-6 sm:py-6">
          <article className="mb-6 w-full min-w-0 overflow-hidden rounded-[22px] border border-[#E6EDF5] bg-white shadow-[0_12px_28px_rgba(16,45,78,0.06)]">
            <header className="relative overflow-hidden bg-[#102D4E] px-4 pb-6 pt-3.5 text-white sm:px-6 sm:pb-7 sm:pt-5">
              <MockWave />
              <div className="relative z-[1] flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 sm:h-11 sm:w-11">
                  <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="3.5" width="12" height="17" rx="2" />
                    <path d="M9 8h6M9 12h6M9 16h3" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base font-bold leading-tight sm:text-xl">{enLabel('mockTest')}</h1>
                  <p className="text-xs font-semibold text-white/90 sm:text-sm">{enLabel('mockResult')}</p>
                </div>
                <p className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold tabular-nums">
                  {formatMockTime(elapsedSec)}
                </p>
              </div>
            </header>
            <div className="px-4 py-5 sm:px-7 sm:py-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{pass ? "🎉" : "📝"}</span>
              <h2 className="text-xl font-bold text-[#102D4E]">{enLabel('mockResult')}</h2>
            </div>
            <p className="text-lg font-semibold mb-1 text-[var(--text-primary)]">
              {enLabel('youScored', { correct, total, percent })}
            </p>
            <p
              className={cn(
                "text-sm font-semibold mb-3 flex items-center gap-1.5",
                pass ? "text-[var(--correct)]" : "text-[var(--wrong)]"
              )}
            >
              <span>{pass ? "✓" : "✕"}</span>
              <span>{pass ? enLabel('passMessage') : enLabel('failMessage')}</span>
            </p>
            <button
              type="button"
              onClick={handleRetake}
              className="practice-next lt-btn-primary mt-2 min-h-12 px-5 text-sm"
            >
              {enLabel('retake')}
            </button>
            </div>
          </article>

          {/* Wrong Answers Section */}
          {wrongAnswers.length > 0 && (
            <div className="space-y-3">
              {wrongAnswers.map((item, idx) => {
                const { answer, question } = item;
                const correctOption = question.optionsShuffled[answer.correctIndex];

                return (
                  <div
                    key={`${question.id}-${idx}`}
                    dir="ltr"
                    className="lt-card p-5 sm:p-6 mb-3 text-sm"
                  >
                    <p dir="ltr" lang="en" className="font-bold mb-2 text-[var(--text-primary)] text-base">{question.promptEn}</p>
                    {(() => {
                      const promptTranslation = getQuestionPromptTranslation(
                        question,
                        translationLang,
                        localeTranslations
                      );
                      if (!promptTranslation) return null;
                      return (
                        <div className="mb-3">
                          <ArabicDraftNote show={translationLang === 'ar' && question.arabicReview === 'draft'} />
                          <p 
                            className="text-start break-words text-[var(--text-secondary)] leading-[1.8] tracking-wide font-medium" 
                            dir={isLtrTranslationLang(translationLang) ? 'ltr' : 'rtl'}
                            lang={translationLang === 'ar' ? 'ar' : undefined}
                            style={translationLang === 'ar' ? { fontFeatureSettings: '"liga" 1, "kern" 1' } : undefined}
                          >
                            {promptTranslation}
                          </p>
                        </div>
                      );
                    })()}
                    <div className="text-sm text-[var(--text-secondary)]">
                      <span className="font-semibold">{enLabel('correctAnswer')}</span>{' '}
                      <div className="inline-block align-middle mt-1">
                        <AnswerOptionContent
                          option={correctOption}
                          enClassName="font-semibold text-[var(--correct)] inline"
                          imageClassName="max-h-16"
                        >
                          {(() => {
                            const optionTranslation = getOptionTranslation(
                              correctOption,
                              translationLang,
                              localeTranslations,
                              question.options,
                              question.id,
                              question.topic
                            );
                            if (!optionTranslation) return null;
                            return (
                              <>
                                {' · '}
                                <span
                                  dir={isLtrTranslationLang(translationLang) ? 'ltr' : 'rtl'}
                                  lang={translationLang === 'ar' ? 'ar' : undefined}
                                  style={
                                    translationLang === 'ar'
                                      ? { fontFeatureSettings: '"liga" 1, "kern" 1', lineHeight: '1.8' }
                                      : { lineHeight: '1.8' }
                                  }
                                >
                                  {optionTranslation}
                                </span>
                              </>
                            );
                          })()}
                        </AnswerOptionContent>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show current question
  const currentQuestion = mockQuestions[currentIndex];
  const currentAnswer = answers[currentIndex];
  // Use saved answer if available, otherwise use current selection
  const effectiveSelectedIndex = currentAnswer?.chosenIndex ?? selectedOptionIndex;
  const isAnswered = currentAnswer !== undefined || selectedOptionIndex !== null;
  const isCorrect = isAnswered && (
    currentAnswer?.correct || 
    (selectedOptionIndex !== null && currentQuestion.optionsShuffled[selectedOptionIndex].correct)
  );

  const progressPercent = Math.round(((currentIndex + 1) / mockQuestions.length) * 100);

  return (
    <div dir="ltr" className={MOCK_PAGE_SHELL}>
      <div className="mx-auto w-full min-w-0 max-w-[1000px] px-4 py-4 sm:px-6 sm:py-6">
        <article className="w-full min-w-0 overflow-hidden rounded-[22px] border border-[#E6EDF5] bg-white shadow-[0_12px_28px_rgba(16,45,78,0.06)]">
          <header className="relative overflow-hidden bg-[#102D4E] px-4 pb-6 pt-3.5 text-white sm:px-6 sm:pb-7 sm:pt-5">
            <MockWave />
            <div className="relative z-[1] flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 sm:h-11 sm:w-11">
                <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="3.5" width="12" height="17" rx="2" />
                  <path d="M9 8h6M9 12h6M9 16h3" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold leading-tight sm:text-xl">{enLabel('mockTest')}</h2>
                <p className="text-xs font-semibold text-white/90 sm:text-sm">
                  {enLabel('questionOf', { current: currentIndex + 1, total: mockQuestions.length })}
                </p>
              </div>
              <p className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold tabular-nums" aria-live="polite">
                {formatMockTime(elapsedSec)}
              </p>
            </div>
          </header>

          <div className="px-4 py-4 sm:px-7 sm:py-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E7F4F9]" aria-hidden>
                <div className="h-full rounded-full bg-[#168CBA]" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="shrink-0 text-xs font-semibold text-[#168CBA] sm:text-sm">
                {enLabel('percentComplete', { percent: progressPercent })}
              </span>
            </div>
            {currentIndex + 1 === mockQuestions.length && (
              <p className="mb-3 text-xs font-medium text-[#168CBA]">{enLabel('finalQuestion')}</p>
            )}
            {answers.filter(a => a && a.correct).length > 0 && (
              <p className="mb-3 text-xs font-medium text-[var(--correct)]">
                {enLabel('correctSoFar', { n: answers.filter(a => a && a.correct).length })}
              </p>
            )}

          {/* Question Image */}
          {currentQuestion.image && (
            <div className={cn(
              "flex justify-center",
              // Mobile-only smaller images for Road Signs topic
              currentQuestion.topic === "road-signs" 
                ? "w-full items-center overflow-hidden h-[160px] mb-3 md:h-auto md:mb-3" 
                : "mb-3"
            )}>
              <img
                src={currentQuestion.image}
                alt="Question illustration"
                className={cn(
                  "w-auto object-contain",
                  // Mobile-only constraint for Road Signs
                  currentQuestion.topic === "road-signs" 
                    ? "max-h-full md:max-h-40" 
                    : "max-h-40"
                )}
              />
            </div>
          )}

          {/* Question Prompt */}
          <div className="mb-2 flex items-start justify-between gap-2 sm:gap-3">
            <h2 dir="ltr" lang="en" className="min-w-0 flex-1 break-words text-[1.4rem] font-bold leading-[1.3] tracking-tight text-[#102D4E] sm:text-[1.7rem]">
              {currentQuestion.promptEn}
            </h2>
            <span className="practice-voice mt-1 shrink-0">
              <TTSButton
                text={currentQuestion.promptEn}
                options={currentQuestion.optionsShuffled}
                className="!h-auto !w-auto gap-2 rounded-full px-2 py-1 text-[#168CBA]"
              />
            </span>
          </div>
          {/* Translation Prompt */}
          {(() => {
            const translationText = getQuestionPromptTranslation(
              currentQuestion,
              translationLang,
              localeTranslations
            );
            if (!translationText) return null;
            
            return (
              <div className="mb-3">
                <ArabicDraftNote show={translationLang === 'ar' && currentQuestion.arabicReview === 'draft'} />
                <p 
                  className="text-start break-words text-[16px] sm:text-[17px] text-[var(--text-primary)] font-semibold leading-[1.8] tracking-wide" 
                  dir={isLtrTranslationLang(translationLang) ? 'ltr' : 'rtl'}
                  lang={translationLang === 'ar' ? 'ar' : undefined}
                  style={translationLang === 'ar' ? { fontFeatureSettings: '"liga" 1, "kern" 1' } : undefined}
                >
                  {translationText}
                </p>
              </div>
            );
          })()}

          {/* Exam integrity: no hints, vocab cards, or tappable keywords during Mock. */}

          {/* Divider */}
          <div className="border-t border-[var(--border)] mb-4 mt-2"></div>

          {/* Options */}
          <div className="space-y-2.5 mb-4">
            {currentQuestion.optionsShuffled.map((option, index) => {
              const isSelected = effectiveSelectedIndex === index;
              const isCorrectOption = option.correct;
              const showCorrect = isAnswered && isCorrectOption;
              const showWrong = isAnswered && isSelected && !isCorrectOption;
              const optionState = showCorrect
                ? 'correct'
                : showWrong
                  ? 'wrong'
                  : isSelected
                    ? 'selected'
                    : undefined;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleOptionClick(index)}
                  disabled={isFinished}
                  data-state={optionState}
                  className={cn(
                    "practice-answer lt-option w-full text-left",
                    isAnswered && "cursor-default"
                  )}
                >
                  <div className="practice-answer-body">
                    <AnswerOptionContent
                      option={option}
                      enClassName={cn(
                        "font-bold text-[17px] sm:text-[18px] leading-relaxed",
                        isSelected && !showCorrect && !showWrong ? "text-[var(--lingo-red-dark)]" : 
                        showCorrect ? "text-[var(--correct)]" :
                        showWrong ? "text-[var(--wrong)]" : "text-[var(--text-primary)]"
                      )}
                    >
                      {(() => {
                        const translationText = getOptionTranslation(
                          option,
                          translationLang,
                          localeTranslations,
                          currentQuestion.options,
                          currentQuestion.id,
                          currentQuestion.topic
                        );
                        if (!translationText) return null;
                        
                        return (
                          <div 
                            className={cn(
                              "text-start break-words text-[15px] sm:text-[16px] mt-2 leading-[1.8] tracking-wide font-medium",
                              isSelected && !showCorrect && !showWrong ? "text-[var(--lingo-red-dark)]/90" : 
                              showCorrect ? "text-[var(--correct)]/90" :
                              showWrong ? "text-[var(--wrong)]/90" : "text-[var(--text-secondary)]"
                            )} 
                            dir={isLtrTranslationLang(translationLang) ? 'ltr' : 'rtl'}
                            lang={translationLang === 'ar' ? 'ar' : undefined}
                            style={translationLang === 'ar' ? { fontFeatureSettings: '"liga" 1, "kern" 1' } : undefined}
                          >
                            {translationText}
                          </div>
                        );
                      })()}
                    </AnswerOptionContent>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Badge */}
          {isAnswered && (
            <div className={cn(
              "inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold mb-5 transition-all duration-300 animate-in fade-in slide-in-from-top-2",
              isCorrect
                ? "bg-[var(--correct-soft)] text-[var(--correct)] border border-[var(--correct)]/30"
                : "bg-[var(--wrong-soft)] text-[var(--wrong)] border border-[var(--wrong)]/30"
            )}>
              <span className="text-lg font-bold">{isCorrect ? "✓" : "✕"}</span>
              <span>{isCorrect ? enLabel('excellentFocus') : enLabel('reviewCarefully')}</span>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={cn(
                'inline-flex min-h-12 items-center gap-1 rounded-xl border border-[#D5DEE8] bg-white px-3 text-sm font-semibold text-[#102D4E] sm:px-4',
                currentIndex === 0 && 'cursor-not-allowed opacity-40'
              )}
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6 9 12l6 6" />
              </svg>
              {enLabel('previous')}
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex min-h-12 items-center rounded-xl border border-[#D5DEE8] bg-white px-3 text-sm font-semibold text-[#102D4E] sm:px-4"
            >
              {enLabel('restart')}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isAnswered) return;
                if (currentIndex === mockQuestions.length - 1) {
                  handleFinish();
                } else {
                  handleNext();
                }
              }}
              disabled={!isAnswered}
              className={cn(
                'practice-next lt-btn-primary ml-auto min-h-12 gap-1.5 px-4 text-sm sm:px-5',
                !isAnswered && 'cursor-not-allowed'
              )}
            >
              {currentIndex === mockQuestions.length - 1 ? enLabel('finish') : enLabel('next')}
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          </div>
        </article>
        <div className="mx-auto mt-5 hidden max-w-4xl sm:block">
          <DvsaLicenceNotice lang={translationLang} showDistinction />
        </div>
        <DisclaimerModal lang={translationLang} />
      </div>
    </div>
  );
}
