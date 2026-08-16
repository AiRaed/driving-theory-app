"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Question } from "@/data/questions";
import { cn } from "@/lib/utils";
import { shuffleArray } from "@/lib/shuffle";
import TTSButton from "@/components/TTSButton";
import DisclaimerModal from "@/components/DisclaimerModal";
import PaywallOverlay from "@/components/PaywallOverlay";
import { useAccess } from '@/lib/providers/AccessProvider';
import { createClient } from "@/lib/supabase/client";
import { useQuestionBank } from "@/lib/questions/useQuestionBank";
import { 
  TranslationLang, 
  getTranslationLang, 
  setTranslationLang, 
  loadUrduTranslations,
  loadRomanianTranslations,
  getQuestionPromptTranslation,
  getOptionTranslation,
  type TranslationData 
} from '@/lib/translations';
import {
  analyticsLanguage,
  clearClientSessionId,
  getOrCreateClientSessionId,
  trackAttempt,
  trackEvent,
  trackSessionComplete,
  trackSessionStart,
} from '@/lib/analytics/client';

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
}

/**
 * MOCK TEST CONFIGURATION CONSTANTS
 * 
 * SAFEGUARDED - DO NOT MODIFY WITHOUT REVIEW
 * 
 * SESSION_KEY: Versioned session storage key
 * - Increment version (v1 -> v2) if session structure changes
 * - Prevents conflicts with old session data
 * 
 * QUESTION_COUNT: Number of questions per mock test
 * - Set to 50 to match DVSA official mock test standard
 * - Must not exceed total available questions in database
 * - Used in generateMockQuestions() to limit selection
 */
const SESSION_KEY = "mock_session_v1";
const QUESTION_COUNT = 50;
const MOCK_ANALYTICS_SESSION_KEY = "lt_mock_analytics_session";

export default function MockTestPage() {
  const router = useRouter();
  const supabase = createClient();
  // SINGLE SOURCE OF TRUTH: useAccess from AccessProvider
  const { loading, paid } = useAccess();
  const [user, setUser] = useState<any>(null);
  
  const [mockQuestions, setMockQuestions] = useState<QuestionWithShuffled[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [translationLang, setTranslationLangState] = useState<TranslationLang>('off');
  const [isMounted, setIsMounted] = useState(false);
  const mockSessionIdRef = useRef<string | null>(null);
  const mockCompleteTrackedRef = useRef(false);
  const mockStartedTrackedRef = useRef(false);
  
  // Mock Test: always locked when !paid (no free mock test)
  // Once paid === true, Paywall must NEVER render
  // PaywallOverlay must render ONLY when:
  // 1. loading === false (access state loaded)
  // 2. paid === false
  // Do NOT render PaywallOverlay while loading === true
  const showPaywall = !loading && !paid;

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        router.push('/auth');
        return;
      }
    };
    
    checkAuth();
  }, [router, supabase]);


  // Load translation language from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setTranslationLangState(getTranslationLang());
  }, []);
  const [urTranslations, setUrTranslations] = useState<TranslationData | null>(null);
  const [roTranslations, setRoTranslations] = useState<TranslationData | null>(null);
  const { questions, urTranslations: bankUrdu, roTranslations: bankRo, source: bankSource, ready: bankReady } = useQuestionBank();

  const localeTranslations =
    translationLang === 'ro' ? roTranslations : translationLang === 'ur' ? urTranslations : null;

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

  // Update translation language
  const handleTranslationLangChange = (lang: TranslationLang) => {
    setTranslationLangState(lang);
    setTranslationLang(lang);
    void trackEvent('language_changed', {
      language: analyticsLanguage(lang),
      previous: analyticsLanguage(translationLang),
      mode: 'mock',
    });
    if (lang === "ur" && !(bankSource === "database" && bankUrdu && Object.keys(bankUrdu).length > 0)) {
      loadUrduTranslations().then(setUrTranslations);
    }
    if (lang === "ro" && !(bankSource === "database" && bankRo && Object.keys(bankRo).length > 0)) {
      loadRomanianTranslations().then(setRoTranslations);
    }
  };

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

  // Load session from localStorage
  const loadSession = (): MockSession | null => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load session:", e);
    }
    return null;
  };

  // Save session to localStorage
  const saveSession = (session: MockSession) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error("Failed to save session:", e);
    }
  };

  // Clear session from localStorage
  const clearSession = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error("Failed to clear session:", e);
    }
  };

  // Restore session or initialize new test
  const initializeTest = (forceNew: boolean = false) => {
    if (forceNew) {
      clearSession();
    }

    const savedSession = loadSession();
    
    if (savedSession && !forceNew && savedSession.shuffledOptionIndices) {
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
    });
  };

  // Initialize test when user is authenticated and question bank is ready
  useEffect(() => {
    if (user && bankReady && questions.length > 0) {
      initializeTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, bankReady, questions]);

  // Save session whenever state changes
  useEffect(() => {
    if (mockQuestions.length > 0) {
      // Build shuffled option indices map
      const shuffledOptionIndices = getShuffledOptionIndices(mockQuestions);
      
      saveSession({
        questionIds: mockQuestions.map(q => q.id),
        shuffledOptionIndices,
        answers,
        currentIndex,
        isFinished,
      });
    }
  }, [mockQuestions, answers, currentIndex, isFinished]);

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
    }
  };

  const handleFinish = () => {
    // Block finish when no answer is selected
    if (!isAnswered) return;
    setIsFinished(true);
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

  // Show minimal loading state only on initial mount (no full-page overlay)
  // Don't block UI for access status checks
  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center text-[var(--text-secondary)] font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // Show loading state while access is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center text-[var(--text-secondary)] font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // IMPORTANT: PaywallOverlay must render ONLY when:
  // !loading && !paid
  // Do NOT render PaywallOverlay while loading === true
  if (showPaywall) {
    return (
      <div className="min-h-screen bg-[var(--background)] relative">
        <PaywallOverlay />
        <div className="pointer-events-none blur-sm opacity-50">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="text-center text-[var(--text-secondary)] font-medium">Mock Test requires paid access</div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state for questions
  if (mockQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center text-[var(--text-secondary)] font-medium">Loading questions...</div>
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
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Results Card */}
          <div className="lt-card-accent p-6 sm:p-8 mt-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{pass ? "🎉" : "📝"}</span>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Mock Test Result</h1>
            </div>
            <p className="text-lg font-semibold mb-1 text-[var(--text-primary)]">
              You scored {correct} / {total} ({percent}%)
            </p>
            <p
              className={cn(
                "text-sm font-semibold mb-3 flex items-center gap-1.5",
                pass ? "text-[var(--correct)]" : "text-[var(--wrong)]"
              )}
            >
              <span>{pass ? "✓" : "✕"}</span>
              <span>{pass
                ? "PASS — Well done! You&apos;re above the recommended pass mark."
                : "FAIL — Keep practicing. Aim for at least 86% to pass the real test."}</span>
            </p>
            <p className="text-sm text-[var(--text-secondary)] mb-4" dir="rtl">
              راجع الأسئلة التي أخطأت بها لتقوية نقاط الضعف قبل الامتحان الحقيقي.
            </p>
            <button
              type="button"
              onClick={handleRetake}
              className="lt-btn-primary px-6 py-3 text-sm"
            >
              Retake
            </button>
          </div>

          {/* Wrong Answers Section */}
          {wrongAnswers.length > 0 && (
            <div className="space-y-3">
              {wrongAnswers.map((item, idx) => {
                const { answer, question } = item;
                const correctOption = question.optionsShuffled[answer.correctIndex];

                return (
                  <div
                    key={`${question.id}-${idx}`}
                    className="lt-card p-5 sm:p-6 mb-3 text-sm"
                  >
                    <p className="font-bold mb-2 text-[var(--text-primary)] text-base">{question.promptEn}</p>
                    {(() => {
                      const promptTranslation = getQuestionPromptTranslation(
                        question,
                        translationLang,
                        localeTranslations
                      );
                      if (!promptTranslation) return null;
                      return (
                        <p 
                          className="text-[var(--text-secondary)] mb-3 leading-[1.8] tracking-wide font-medium" 
                          dir={translationLang === 'ro' ? 'ltr' : 'rtl'} 
                          style={translationLang === 'ar' ? { fontFeatureSettings: '"liga" 1, "kern" 1' } : undefined}
                        >
                          {promptTranslation}
                        </p>
                      );
                    })()}
                    <p className="text-sm text-[var(--text-secondary)]">
                      <span className="font-semibold">Correct answer:</span> <span className="font-semibold text-[var(--correct)]">{correctOption.en}</span>
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
                              dir={translationLang === 'ro' ? 'ltr' : 'rtl'} 
                              style={translationLang === 'ar' ? { fontFeatureSettings: '"liga" 1, "kern" 1', lineHeight: '1.8' } : { lineHeight: '1.8' }}
                            >
                              {optionTranslation}
                            </span>
                          </>
                        );
                      })()}
                    </p>
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
  const correctIndex = currentQuestion.optionsShuffled.findIndex((opt) => opt.correct);

  return (
      <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header with Translation Switcher */}
        <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
            <Link
              href="/dashboard"
              className="lt-btn-ghost hidden sm:inline-flex px-4 py-2 text-sm"
            >
              ← Back to dashboard
            </Link>
            <span className="hidden md:inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--lingo-red-soft)] text-[var(--lingo-red)] border border-[var(--lingo-red-muted)]">
              Mock Test
            </span>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-start sm:gap-3 flex-1 min-w-0">
              <span className="text-xs md:text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap">
                <span className="md:hidden">{mockQuestions.length}Q</span>
                <span className="hidden md:inline">{mockQuestions.length} questions</span>
              </span>
              {/* Translation Switcher - Mobile */}
              {isMounted && (
                <div className="flex items-center gap-1.5 sm:hidden w-full min-w-0">
                  <span className="text-[10px] font-medium text-[var(--text-secondary)] whitespace-nowrap flex-shrink-0">
                    Tr:
                  </span>
                  <div
                    className="lt-segmented flex-1 min-w-0 flex-wrap justify-start"
                    role="group"
                    aria-label="Translation language selector"
                  >
                    <button
                      type="button"
                      onClick={() => handleTranslationLangChange('off')}
                      aria-pressed={translationLang === 'off'}
                      data-active={translationLang === 'off'}
                      className="lt-segmented-btn px-1.5 py-1 text-[11px] flex-1 min-w-[3.25rem]"
                    >
                      Off
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTranslationLangChange('ar')}
                      aria-pressed={translationLang === 'ar'}
                      data-active={translationLang === 'ar'}
                      className="lt-segmented-btn px-1.5 py-1 text-[11px] flex-1 min-w-[3.25rem]"
                    >
                      العربية
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTranslationLangChange('ur')}
                      aria-pressed={translationLang === 'ur'}
                      data-active={translationLang === 'ur'}
                      className="lt-segmented-btn px-1.5 py-1 text-[11px] flex-1 min-w-[3.25rem]"
                    >
                      اردو
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTranslationLangChange('ro')}
                      aria-pressed={translationLang === 'ro'}
                      data-active={translationLang === 'ro'}
                      className="lt-segmented-btn px-1.5 py-1 text-[11px] flex-1 min-w-[3.5rem]"
                    >
                      Română
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Translation Switcher - Desktop */}
          {isMounted && (
            <div className="hidden sm:flex items-center gap-3 flex-wrap">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Translation:</span>
              <div className="lt-segmented" role="group" aria-label="Translation language selector">
                <button
                  type="button"
                  onClick={() => handleTranslationLangChange('off')}
                  aria-pressed={translationLang === 'off'}
                  data-active={translationLang === 'off'}
                  className="lt-segmented-btn px-3 py-1.5 text-xs"
                >
                  Off
                </button>
                <button
                  type="button"
                  onClick={() => handleTranslationLangChange('ar')}
                  aria-pressed={translationLang === 'ar'}
                  data-active={translationLang === 'ar'}
                  className="lt-segmented-btn px-3 py-1.5 text-xs"
                >
                  العربية
                </button>
                <button
                  type="button"
                  onClick={() => handleTranslationLangChange('ur')}
                  aria-pressed={translationLang === 'ur'}
                  data-active={translationLang === 'ur'}
                  className="lt-segmented-btn px-3 py-1.5 text-xs"
                >
                  اردو
                </button>
                <button
                  type="button"
                  onClick={() => handleTranslationLangChange('ro')}
                  aria-pressed={translationLang === 'ro'}
                  data-active={translationLang === 'ro'}
                  className="lt-segmented-btn px-3 py-1.5 text-xs"
                >
                  Română
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Disclaimer Message - Desktop only */}
        <div className="hidden sm:block text-center mt-4 mb-2 max-w-5xl mx-auto">
          <p className="text-[10px] text-[var(--muted-text)]/70 leading-tight max-w-4xl mx-auto">
            <span className="mr-1">ℹ️</span>
            Disclaimer: This app provides practice questions designed to help learners prepare for the UK driving theory test. The questions are not official DVSA exam questions but are based on the same learning objectives and topics.
          </p>
          {translationLang === 'ar' && (
            <p className="text-xs text-[var(--muted-text)]/70 leading-relaxed mt-1.5" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
              تنويه: هذا التطبيق يقدّم أسئلة تدريبية للمساعدة في الاستعداد لاختبار القيادة النظري في المملكة المتحدة. الأسئلة ليست أسئلة الامتحان الرسمية، لكنها مبنية على نفس الأهداف التعليمية.
            </p>
          )}
          {translationLang === 'ro' && (
            <p className="text-xs text-[var(--muted-text)]/70 leading-relaxed mt-1.5" dir="ltr">
              Declinarea responsabilității: Această aplicație oferă întrebări de exersare menite să ajute cursanții să se pregătească pentru testul teoretic de conducere din Regatul Unit. Întrebările nu sunt întrebări oficiale de examen DVSA, dar se bazează pe aceleași obiective și teme de învățare.
            </p>
          )}
        </div>
        {/* Mobile Disclaimer Modal */}
        <DisclaimerModal showArabic={translationLang === 'ar'} showRomanian={translationLang === 'ro'} />
        {/* Question Card */}
        <div className="lt-card-accent p-6 sm:p-7 mt-4">
          {/* Progress Section */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs text-[var(--text-secondary)] font-medium">
                Question {currentIndex + 1} of {mockQuestions.length}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {Math.round(((currentIndex + 1) / mockQuestions.length) * 100)}% complete
              </div>
            </div>
            <div className="h-1.5 w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--lingo-red)] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentIndex + 1) / mockQuestions.length) * 100}%` }}
              />
            </div>
            {currentIndex + 1 === mockQuestions.length && (
              <p className="text-xs text-[var(--teal)] mt-2 font-medium">Final question! You&apos;re doing great.</p>
            )}
            {answers.filter(a => a && a.correct).length > 0 && (
              <p className="text-xs text-[var(--correct)] mt-2 font-medium">
                {answers.filter(a => a && a.correct).length} correct so far — keep it up!
              </p>
            )}
          </div>

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
          <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
            <h2 className="text-[19px] sm:text-[21px] font-bold text-[var(--text-primary)] leading-[1.4] flex-1 min-w-0 break-words whitespace-normal">
              {currentQuestion.promptEn}
            </h2>
            <div className="flex items-center gap-2 flex-shrink-0 mt-1">
              <TTSButton text={currentQuestion.promptEn} options={currentQuestion.optionsShuffled} />
            </div>
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
              <p 
                className="text-[16px] sm:text-[17px] text-[var(--text-primary)] font-semibold mb-3 leading-[1.8] tracking-wide" 
                dir={translationLang === 'ro' ? 'ltr' : 'rtl'} 
                style={translationLang === 'ar' ? { fontFeatureSettings: '"liga" 1, "kern" 1' } : undefined}
              >
                {translationText}
              </p>
            );
          })()}

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
                  onClick={() => handleOptionClick(index)}
                  disabled={isFinished}
                  data-state={optionState}
                  className={cn(
                    "lt-option active:scale-[0.99]",
                    isFinished && "cursor-not-allowed",
                    isAnswered && "cursor-default"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {isSelected && !showCorrect && !showWrong && (
                      <span className="text-xl flex-shrink-0 mt-0.5 text-[var(--lingo-red)] font-bold">○</span>
                    )}
                    {(showCorrect || showWrong) && (
                      <span className={cn(
                        "text-xl flex-shrink-0 mt-0.5 font-bold transition-all duration-300",
                        showCorrect ? "text-[var(--correct)]" : "text-[var(--wrong)]"
                      )}>
                        {showCorrect ? "✓" : "✕"}
                      </span>
                    )}
                    <div className="flex-1">
                      <div className={cn(
                        "font-bold text-[17px] sm:text-[18px] leading-relaxed",
                        isSelected && !showCorrect && !showWrong ? "text-[var(--lingo-red-dark)]" : 
                        showCorrect ? "text-[var(--correct)]" :
                        showWrong ? "text-[var(--wrong)]" : "text-[var(--text-primary)]"
                      )}>{option.en}</div>
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
                              "text-[15px] sm:text-[16px] mt-2 leading-[1.8] tracking-wide font-medium",
                              isSelected && !showCorrect && !showWrong ? "text-[var(--lingo-red-dark)]/90" : 
                              showCorrect ? "text-[var(--correct)]/90" :
                              showWrong ? "text-[var(--wrong)]/90" : "text-[var(--text-secondary)]"
                            )} 
                            dir={translationLang === 'ro' ? 'ltr' : 'rtl'} 
                            style={translationLang === 'ar' ? { fontFeatureSettings: '"liga" 1, "kern" 1' } : undefined}
                          >
                            {translationText}
                          </div>
                        );
                      })()}
                    </div>
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
              <span>{isCorrect ? "Excellent! Keep your focus." : "Review this carefully before the real test."}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 grid grid-cols-3 gap-3 md:flex md:justify-between md:items-center">
            {/* Base button styles - consistent for all buttons */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={cn(
                "lt-btn-ghost h-12 w-full text-sm",
                currentIndex === 0 && "opacity-50 cursor-not-allowed"
              )}
            >
              ← Previous
            </button>
            <button
              onClick={handleRestart}
              className="lt-btn-ghost h-12 w-full text-sm"
            >
              Restart
            </button>
            <button
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
                "lt-btn-primary h-12 w-full text-sm whitespace-nowrap",
                !isAnswered && "opacity-50 cursor-not-allowed"
              )}
            >
              {currentIndex === mockQuestions.length - 1 ? "Finish →" : "Next →"}
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
