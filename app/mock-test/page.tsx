"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { questions, Question } from "@/data/questions";
import { cn } from "@/lib/utils";
import { shuffleArray } from "@/lib/shuffle";
import TTSButton from "@/components/TTSButton";
import DisclaimerModal from "@/components/DisclaimerModal";
import MockTestLockedModal from "@/components/MockTestLockedModal";
import PaywallModal from "@/components/PaywallModal";
import { useAccessGate } from "@/lib/hooks/useAccessGate";
import { createClient } from "@/lib/supabase/client";
import { 
  TranslationLang, 
  getTranslationLang, 
  setTranslationLang, 
  loadUrduTranslations,
  getQuestionPromptTranslation,
  getOptionTranslation,
  type TranslationData 
} from '@/lib/translations';

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

export default function MockTestPage() {
  const router = useRouter();
  const supabase = createClient();
  const { status, freeUsed, loading: accessLoading, refetch: refetchAccess } = useAccessGate();
  const [user, setUser] = useState<any>(null);
  
  // Determine access status - access_level === 'paid' is the ONLY gate
  const isPaid = status === 'paid';
  const [mockQuestions, setMockQuestions] = useState<QuestionWithShuffled[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [translationLang, setTranslationLangState] = useState<TranslationLang>('off');
  const [isMounted, setIsMounted] = useState(false);

  // Check authentication and access level
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

  // Clear mock test state when not paid (free users can't access mock test)
  useEffect(() => {
    if (!isPaid) {
      // Clear all mock test state
      setMockQuestions([]);
      setCurrentIndex(0);
      setSelectedOptionIndex(null);
      setAnswers([]);
      setIsFinished(false);
      
      // Clear localStorage session
      clearSession();
    }
  }, [isPaid]);

  // Load translation language from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setTranslationLangState(getTranslationLang());
  }, []);
  const [urTranslations, setUrTranslations] = useState<TranslationData | null>(null);

  // Load Urdu translations when needed
  useEffect(() => {
    if (translationLang === 'ur') {
      loadUrduTranslations().then(setUrTranslations);
    }
  }, [translationLang]);

  // Load Urdu translations automatically for hazard-awareness and road-signs topics
  // Since mock test includes questions from all topics, always load translations
  useEffect(() => {
    if (!urTranslations) {
      loadUrduTranslations().then(setUrTranslations);
    }
  }, []);

  // Update translation language
  const handleTranslationLangChange = (lang: TranslationLang) => {
    setTranslationLangState(lang);
    setTranslationLang(lang);
    if (lang === 'ur') {
      loadUrduTranslations().then(setUrTranslations);
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
   * 
   * IMPORTANT: This function is BLOCKED when user is not paid
   */
  const generateMockQuestions = (): QuestionWithShuffled[] => {
    // BLOCK question generation when not paid
    if (!isPaid) {
      return [];
    }
    
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

  // Restore session or initialize new test - BLOCKED when not paid
  const initializeTest = (forceNew: boolean = false) => {
    // BLOCK test initialization when not paid
    if (!isPaid) {
      setMockQuestions([]);
      setCurrentIndex(0);
      setSelectedOptionIndex(null);
      setAnswers([]);
      setIsFinished(false);
      return;
    }
    
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

  // Initialize on mount - only if paid
  useEffect(() => {
    if (isPaid && !accessLoading && user) {
      initializeTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaid, accessLoading, user]);

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

  // Handle option click - BLOCKED when not paid
  const handleOptionClick = (optionIndex: number) => {
    // Block all interactions when not paid
    if (!isPaid) return;
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

  // Show loading state while checking access
  if (accessLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center text-slate-600 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // Block page if user is not paid - access_level === 'paid' is the ONLY gate
  // Mock Test is locked for free users; only paid users can access
  if (!isPaid) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="text-center text-slate-600 font-medium">Mock Test requires paid access</div>
          </div>
        </div>
        <MockTestLockedModal
          isOpen={true}
          onClose={async () => {
            await refetchAccess();
            router.push('/practice');
          }}
        />
      </>
    );
  }

  // Show loading state for questions
  if (mockQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center text-slate-600 font-medium">Loading questions...</div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Results Card */}
          <div className="rounded-2xl border border-red-100/60 bg-gradient-to-br from-red-50/50 via-white to-red-50/30 p-6 sm:p-8 mt-4 mb-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
            {/* Premium red top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
            {/* Teal secondary accent line */}
            <div className="absolute top-1.5 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-300/40 to-transparent"></div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{pass ? "🎉" : "📝"}</span>
              <h1 className="text-xl font-bold text-[var(--navy)]">Mock Test Result</h1>
            </div>
            <p className="text-lg font-semibold mb-1 text-[var(--navy)]">
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
            <p className="text-sm text-[var(--muted-text)] mb-4" dir="rtl">
              راجع الأسئلة التي أخطأت بها لتقوية نقاط الضعف قبل الامتحان الحقيقي.
            </p>
            <button
              type="button"
              onClick={handleRetake}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                    className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-5 sm:p-6 mb-3 text-sm shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <p className="font-bold mb-2 text-slate-900 text-base">{question.promptEn}</p>
                    {(() => {
                      const promptTranslation = getQuestionPromptTranslation(
                        question,
                        translationLang,
                        urTranslations
                      );
                      if (!promptTranslation) return null;
                      return (
                        <p 
                          className="text-slate-700 mb-3 leading-[1.8] tracking-wide font-medium" 
                          dir="rtl" 
                          style={translationLang === 'ar' ? { fontFeatureSettings: '"liga" 1, "kern" 1' } : undefined}
                        >
                          {promptTranslation}
                        </p>
                      );
                    })()}
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Correct answer:</span> <span className="font-semibold text-green-700">{correctOption.en}</span>
                      {(() => {
                        const optionTranslation = getOptionTranslation(
                          correctOption,
                          translationLang,
                          urTranslations,
                          question.options,
                          question.id,
                          question.topic
                        );
                        if (!optionTranslation) return null;
                        return (
                          <>
                            {' · '}
                            <span 
                              dir="rtl" 
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header with Translation Switcher */}
        <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm border border-slate-300 bg-white hover:bg-gradient-to-br hover:from-slate-50 hover:to-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] font-semibold text-slate-800"
            >
              ← Back to dashboard
            </Link>
            <span className="hidden md:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-50 to-red-100/50 text-red-700 border border-red-200/60 shadow-sm">
              Mock Test
            </span>
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 flex-1 min-w-0">
              <span className="text-xs md:text-sm font-medium text-slate-600 whitespace-nowrap">
                <span className="md:hidden">{mockQuestions.length}Q</span>
                <span className="hidden md:inline">{mockQuestions.length} questions</span>
              </span>
              {/* Translation Switcher - Mobile */}
              {isMounted && (
                <div className="flex items-center gap-1 sm:hidden flex-shrink-0">
                  <span className="text-[10px] font-medium text-slate-600 whitespace-nowrap">Tr:</span>
                  <div className="inline-flex rounded-lg border border-red-200 bg-white p-0.5 shadow-sm" role="group" aria-label="Translation language selector">
                    <button
                      type="button"
                      onClick={() => handleTranslationLangChange('off')}
                      aria-pressed={translationLang === 'off'}
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-md transition-all duration-150 whitespace-nowrap",
                        translationLang === 'off'
                          ? "bg-[#D32F2F] text-white shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      Off
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTranslationLangChange('ar')}
                      aria-pressed={translationLang === 'ar'}
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-md transition-all duration-150 whitespace-nowrap",
                        translationLang === 'ar'
                          ? "bg-[#D32F2F] text-white shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      العربية
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTranslationLangChange('ur')}
                      aria-pressed={translationLang === 'ur'}
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-md transition-all duration-150 whitespace-nowrap",
                        translationLang === 'ur'
                          ? "bg-[#D32F2F] text-white shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      اردو
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Translation Switcher - Desktop */}
          {isMounted && (
            <div className="hidden sm:flex items-center gap-3 flex-wrap">
              <span className="text-xs font-medium text-slate-600">Translation:</span>
              <div className="inline-flex rounded-lg border border-red-200 bg-white p-0.5 shadow-sm" role="group" aria-label="Translation language selector">
                <button
                  type="button"
                  onClick={() => handleTranslationLangChange('off')}
                  aria-pressed={translationLang === 'off'}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 whitespace-nowrap",
                    translationLang === 'off'
                      ? "bg-[#D32F2F] text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  Off
                </button>
                <button
                  type="button"
                  onClick={() => handleTranslationLangChange('ar')}
                  aria-pressed={translationLang === 'ar'}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 whitespace-nowrap",
                    translationLang === 'ar'
                      ? "bg-[#D32F2F] text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  العربية
                </button>
                <button
                  type="button"
                  onClick={() => handleTranslationLangChange('ur')}
                  aria-pressed={translationLang === 'ur'}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 whitespace-nowrap",
                    translationLang === 'ur'
                      ? "bg-[#D32F2F] text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  اردو
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
        </div>
        {/* Mobile Disclaimer Modal */}
        <DisclaimerModal showArabic={translationLang === 'ar'} />
        {/* Question Card */}
        <div className="rounded-2xl border border-red-100/60 bg-gradient-to-br from-red-50/50 via-white to-red-50/30 p-6 sm:p-7 mt-4 shadow-xl relative overflow-hidden backdrop-blur-sm">
          {/* Premium red top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
          {/* Teal secondary accent line */}
          <div className="absolute top-1.5 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-300/40 to-transparent"></div>
          
          {/* Progress Section */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs text-[var(--muted-text)]/80 font-medium">
                Question {currentIndex + 1} of {mockQuestions.length}
              </div>
              <div className="text-xs text-[var(--muted-text)]/70">
                {Math.round(((currentIndex + 1) / mockQuestions.length) * 100)}% complete
              </div>
            </div>
            <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-full transition-all duration-500 ease-out shadow-sm"
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
            <h2 className="text-[19px] sm:text-[21px] font-bold text-slate-900 leading-[1.4] flex-1 min-w-0 break-words whitespace-normal">
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
              urTranslations
            );
            if (!translationText) return null;
            
            return (
              <p 
                className="text-[16px] sm:text-[17px] text-slate-800 font-semibold mb-3 leading-[1.8] tracking-wide" 
                dir="rtl" 
                style={translationLang === 'ar' ? { fontFeatureSettings: '"liga" 1, "kern" 1' } : undefined}
              >
                {translationText}
              </p>
            );
          })()}

          {/* Divider */}
          <div className="border-t border-slate-200/80 mb-4 mt-2"></div>

          {/* Options */}
          <div className="space-y-2.5 mb-4">
            {currentQuestion.optionsShuffled.map((option, index) => {
              const isSelected = effectiveSelectedIndex === index;
              const isCorrectOption = option.correct;
              const showCorrect = isAnswered && isCorrectOption;
              const showWrong = isAnswered && isSelected && !isCorrectOption;

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={isFinished}
                  className={cn(
                    "w-full text-left rounded-xl px-5 py-3.5 transition-all duration-200 ease-in-out border",
                    "shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]",
                    !isFinished && !isAnswered && "bg-white border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-white hover:border-red-300 hover:shadow-md",
                    isFinished && "cursor-not-allowed",
                    // Selected but not yet revealed (neutral state)
                    isSelected && !showCorrect && !showWrong && "bg-gradient-to-br from-blue-50 to-white border-blue-300 shadow-lg ring-2 ring-blue-200/50",
                    // Correct answer (shown after selection)
                    showCorrect && "bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg ring-2 ring-green-200/50",
                    // Wrong answer (user's selection)
                    showWrong && "bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg ring-2 ring-red-200/50",
                    isAnswered && "cursor-default"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {isSelected && !showCorrect && !showWrong && (
                      <span className="text-xl flex-shrink-0 mt-0.5 text-blue-600 font-bold">○</span>
                    )}
                    {(showCorrect || showWrong) && (
                      <span className={cn(
                        "text-xl flex-shrink-0 mt-0.5 font-bold transition-all duration-300",
                        showCorrect ? "text-green-600" : "text-red-600"
                      )}>
                        {showCorrect ? "✓" : "✕"}
                      </span>
                    )}
                    <div className="flex-1">
                      <div className={cn(
                        "font-bold text-[17px] sm:text-[18px] leading-relaxed",
                        isSelected && !showCorrect && !showWrong ? "text-blue-900" : 
                        showCorrect ? "text-green-800" :
                        showWrong ? "text-red-800" : "text-slate-900"
                      )}>{option.en}</div>
                      {(() => {
                        const translationText = getOptionTranslation(
                          option,
                          translationLang,
                          urTranslations,
                          currentQuestion.options,
                          currentQuestion.id,
                          currentQuestion.topic
                        );
                        if (!translationText) return null;
                        
                        return (
                          <div 
                            className={cn(
                              "text-[15px] sm:text-[16px] mt-2 leading-[1.8] tracking-wide font-medium",
                              isSelected && !showCorrect && !showWrong ? "text-blue-800/90" : 
                              showCorrect ? "text-green-700/90" :
                              showWrong ? "text-red-700/90" : "text-slate-700"
                            )} 
                            dir="rtl" 
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
              "inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold mb-5 transition-all duration-300 animate-in fade-in slide-in-from-top-2 shadow-md",
              isCorrect ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300" : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300"
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
                "h-12 w-full rounded-xl text-sm font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-red-200",
                "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50",
                "shadow-sm hover:shadow-md",
                currentIndex === 0 && "opacity-50 cursor-not-allowed"
              )}
            >
              ← Previous
            </button>
            <button
              onClick={handleRestart}
              className={cn(
                "h-12 w-full rounded-xl text-sm font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-red-200",
                "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50",
                "shadow-sm hover:shadow-md"
              )}
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
                "h-12 w-full rounded-xl text-sm font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-red-200",
                "bg-red-600 text-white hover:bg-red-700",
                "shadow-sm hover:shadow-md whitespace-nowrap",
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
