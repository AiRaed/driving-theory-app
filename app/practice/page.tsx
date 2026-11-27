'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn, toTitleCaseLabel } from '@/lib/utils';
import TTSButton from '@/components/TTSButton';
import VocabHintsControl from '@/components/VocabHintsControl';
import PracticeLearningAids, {
  PracticeExplanationHint,
} from '@/components/PracticeLearningAids';
import PracticeKeywordControl from '@/components/PracticeKeywordControl';
import { shouldSelectAnswer } from '@/lib/keyword-cards/keywordActivation';
import AnswerOptionContent from '@/components/AnswerOptionContent';
import ArabicDraftNote from '@/components/ArabicDraftNote';
import DisclaimerModal from '@/components/DisclaimerModal';
import DvsaLicenceNotice from '@/components/DvsaLicenceNotice';
import TopicGlyph from '@/components/TopicGlyph';
import BilingualLabel from '@/components/BilingualLabel';
import { enLabel } from '@/lib/i18n/ui-strings';
import PaywallOverlay from '@/components/PaywallOverlay';
import ContentMaintenanceNotice from '@/components/ContentMaintenanceNotice';
import { useAccess } from '@/lib/providers/AccessProvider';
import {
  FREE_QUESTION_LIMIT,
  decidePracticePageGate,
} from '@/lib/access/entitlement';
import { practiceCategoryIds } from '@/lib/questions/practiceCategory';
import { useQuestionBank } from '@/lib/questions/useQuestionBank';
import { useContentMaintenance } from '@/lib/hooks/useContentMaintenance';
import { 
  loadUrduTranslations,
  loadRomanianTranslations,
  loadPolishTranslations,
  loadPortugueseTranslations,
  loadBengaliTranslations,
  loadPersianTranslations,
  getQuestionTranslation,
  getUrduOptionTranslation,
  getRomanianOptionTranslation,
  getPolishOptionTranslation,
  getPortugueseOptionTranslation,
  getBengaliOptionTranslation,
  getPersianOptionTranslation,
  type TranslationData 
} from '@/lib/translations';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { getTopicTranslation, topicTranslationDir } from '@/lib/i18n/topics';
import {
  getKeywordUrduTranslation,
  getKeywordRomanianTranslation,
  getKeywordPolishTranslation,
  getKeywordPortugueseTranslation,
  getKeywordPersianTranslation,
} from '@/lib/keyword-translations';
import {
  analyticsLanguage,
  getOrCreateClientSessionId,
  trackAttempt,
  trackEvent,
  trackSessionStart,
} from '@/lib/analytics/client';
import { createClient } from '@/lib/supabase/client';
import {
  ACCOUNT_LOCAL_KEYS,
  readAccountJson,
  writeAccountJson,
} from '@/lib/account/clientAccountStorage';
import LearningProgressPanel from '@/components/LearningProgressPanel';
import { TopicProgressBlock } from '@/components/LearningProgressPanel';
import { emptyTopicProgress } from '@/lib/progress/calculate';
import { progressCopy } from '@/lib/progress/copy';
import { useLearnerProgress } from '@/lib/progress/useLearnerProgress';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function PracticeWave() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-14 w-full sm:h-16" viewBox="0 0 1200 80" preserveAspectRatio="none">
      <path d="M0 36c90 28 170-22 280-4 100 16 150 30 250 8 110-24 170-34 270-6 90 26 150 6 230-8 60-10 110 0 170 12v42H0Z" fill="rgba(22,140,186,0.55)" />
      <path d="M0 56c130 16 210-18 340 0 110 14 170 16 270 0 120-18 190-6 290 8 80 10 150 2 300-6v22H0Z" fill="rgba(22,140,186,0.28)" />
    </svg>
  );
}

function PracticeCarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15h16" />
      <path d="M6 15 8.2 9.6A2 2 0 0 1 10 8.5h4a2 2 0 0 1 1.8 1.1L18 15" />
      <path d="M5 15h14v3.2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V15Z" />
      <circle cx="8" cy="18.2" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="18.2" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function PracticePage() {
  // SINGLE SOURCE OF TRUTH: useAccess from AccessProvider
  const { loading, statusConfirmed, paid, freeUsed, refresh, silentRefresh } = useAccess();
  const { loading: maintenanceLoading, enabled: contentMaintenance } =
    useContentMaintenance();
  const supabase = createClient();
  const [accountUserId, setAccountUserId] = useState<string | null>(null);
  const {
    questions,
    urTranslations: bankUrdu,
    roTranslations: bankRo,
    plTranslations: bankPl,
    ptTranslations: bankPt,
    faTranslations: bankFa,
    source: bankSource,
  } = useQuestionBank();
  const { lang: translationLang } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [selectedKeywordIndex, setSelectedKeywordIndex] = useState<number | null>(null);
  void selectedKeywordIndex;
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());
  // Track which questions have already been counted to avoid double-counting
  const countedQuestionIds = useRef<Set<string>>(new Set());
  const practiceSessionKeyRef = useRef<string | null>(null);
  const freeLimitTrackedRef = useRef(false);
  const practiceStartedTopicsRef = useRef<Set<string>>(new Set());
  const answerClickLock = useRef<string | null>(null);
  const failedAttempt = useRef<{ key: string; id: string } | null>(null);
  // Wait until access status has succeeded. Starting /api/progress in parallel
  // refreshes the same session and can make /api/access/status fail closed.
  const learningProgress = useLearnerProgress(
    Boolean(accountUserId) && statusConfirmed,
    accountUserId
  );

  // Bind Practice UI cache to the authenticated LingoTheory account.
  useEffect(() => {
    const applyUser = (userId: string | null) => {
      setAccountUserId((prev) => {
        if (prev && prev !== userId) {
          setAnsweredQuestionIds(new Set());
          countedQuestionIds.current = new Set();
          practiceSessionKeyRef.current = null;
          practiceStartedTopicsRef.current = new Set();
          freeLimitTrackedRef.current = false;
          setCurrentQuestionIndex(0);
          setSelectedAnswerIndex(null);
        }
        return userId;
      });
    };

    void supabase.auth.getUser().then(({ data: { user } }) => {
      applyUser(user?.id ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const [urTranslations, setUrTranslations] = useState<TranslationData | null>(null);
  const [roTranslations, setRoTranslations] = useState<TranslationData | null>(null);
  const [plTranslations, setPlTranslations] = useState<TranslationData | null>(null);
  const [ptTranslations, setPtTranslations] = useState<TranslationData | null>(null);
  const [bnTranslations, setBnTranslations] = useState<TranslationData | null>(null);
  const [faTranslations, setFaTranslations] = useState<TranslationData | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [showTopicsGrid, setShowTopicsGrid] = useState<boolean>(true);
  const [showHints, setShowHints] = useState<boolean>(false); // Collapsed by default on mobile

  // Prefer DB Urdu when bank is from database; otherwise load locale file
  useEffect(() => {
    if (bankSource === 'database' && bankUrdu && Object.keys(bankUrdu).length > 0) {
      setUrTranslations(bankUrdu);
      return;
    }
    if (translationLang === 'ur') {
      loadUrduTranslations(true).then((data) => {
        if (data) setUrTranslations(data);
      });
    } else if (bankSource !== 'database') {
      setUrTranslations(null);
    }
  }, [translationLang, bankSource, bankUrdu]);

  // Prefer DB Romanian when bank is from database; otherwise load locale file
  useEffect(() => {
    if (bankSource === 'database' && bankRo && Object.keys(bankRo).length > 0) {
      setRoTranslations(bankRo);
      return;
    }
    if (translationLang === 'ro') {
      loadRomanianTranslations(true).then((data) => {
        if (data) setRoTranslations(data);
      });
    } else if (bankSource !== 'database') {
      setRoTranslations(null);
    }
  }, [translationLang, bankSource, bankRo]);

  // Prefer DB Polish when bank is from database; otherwise load locale file
  useEffect(() => {
    if (bankSource === 'database' && bankPl && Object.keys(bankPl).length > 0) {
      setPlTranslations(bankPl);
      return;
    }
    if (translationLang === 'pl') {
      loadPolishTranslations(true).then((data) => {
        if (data) setPlTranslations(data);
      });
    } else if (bankSource !== 'database') {
      setPlTranslations(null);
    }
  }, [translationLang, bankSource, bankPl]);

  // Prefer DB Portuguese when bank is from database; otherwise load locale file
  useEffect(() => {
    if (bankSource === 'database' && bankPt && Object.keys(bankPt).length > 0) {
      setPtTranslations(bankPt);
      return;
    }
    if (translationLang === 'pt') {
      loadPortugueseTranslations(true).then((data) => {
        if (data) setPtTranslations(data);
      });
    } else if (bankSource !== 'database') {
      setPtTranslations(null);
    }
  }, [translationLang, bankSource, bankPt]);

  useEffect(() => {
    if (translationLang === 'bn') {
      loadBengaliTranslations(true).then((data) => {
        if (data) setBnTranslations(data);
      });
    }
  }, [translationLang]);

  useEffect(() => {
    if (bankSource === 'database' && bankFa && Object.keys(bankFa).length > 0) {
      setFaTranslations(bankFa);
      return;
    }
    if (translationLang === 'fa') {
      loadPersianTranslations(true).then((data) => {
        if (data) setFaTranslations(data);
      });
    } else if (bankSource !== 'database') {
      setFaTranslations(null);
    }
  }, [translationLang, bankSource, bankFa]);

  // Load Urdu translations automatically for topics that have Urdu translations
  useEffect(() => {
    if (bankSource === 'database') return;
    if (translationLang === 'ur' && selectedTopic) {
      loadUrduTranslations(true).then((data) => {
        if (data) setUrTranslations(data);
      });
    }
  }, [selectedTopic, translationLang, bankSource]);

  // Load Romanian translations automatically for topics
  useEffect(() => {
    if (bankSource === 'database') return;
    if (translationLang === 'ro' && selectedTopic) {
      loadRomanianTranslations(true).then((data) => {
        if (data) setRoTranslations(data);
      });
    }
  }, [selectedTopic, translationLang, bankSource]);

  // Load Polish translations automatically for topics
  useEffect(() => {
    if (bankSource === 'database') return;
    if (translationLang === 'pl' && selectedTopic) {
      loadPolishTranslations(true).then((data) => {
        if (data) setPlTranslations(data);
      });
    }
  }, [selectedTopic, translationLang, bankSource]);

  // Load Portuguese translations automatically for topics
  useEffect(() => {
    if (bankSource === 'database') return;
    if (translationLang === 'pt' && selectedTopic) {
      loadPortugueseTranslations(true).then((data) => {
        if (data) setPtTranslations(data);
      });
    }
  }, [selectedTopic, translationLang, bankSource]);

  // Load Persian translations automatically for topics
  useEffect(() => {
    if (bankSource === 'database') return;
    if (translationLang === 'fa' && selectedTopic) {
      loadPersianTranslations(true).then((data) => {
        if (data) setFaTranslations(data);
      });
    }
  }, [selectedTopic, translationLang, bankSource]);

  const topicCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const question of questions) {
      counts.set(question.topic, (counts.get(question.topic) || 0) + 1);
    }
    return counts;
  }, [questions]);

  const topics = useMemo(
    () => practiceCategoryIds(questions.map((question) => question.topic)),
    [questions]
  );

  // Compute totals

  // Get questions for the selected topic
  const topicQuestions = useMemo(() => {
    if (!selectedTopic) return [];
    return questions.filter(q => q.topic === selectedTopic);
  }, [selectedTopic, questions]);

  // Get current question
  const currentQuestion = topicQuestions[currentQuestionIndex] || null;

  // Also ensure translations are loaded when question changes
  useEffect(() => {
    if (translationLang === 'ur' && currentQuestion && !urTranslations) {
      loadUrduTranslations(true).then((data) => {
        if (data) {
          setUrTranslations(data);
        }
      });
    }
    if (translationLang === 'ro' && currentQuestion && !roTranslations) {
      loadRomanianTranslations(true).then((data) => {
        if (data) {
          setRoTranslations(data);
        }
      });
    }
    if (translationLang === 'pl' && currentQuestion && !plTranslations) {
      loadPolishTranslations(true).then((data) => {
        if (data) {
          setPlTranslations(data);
        }
      });
    }
    if (translationLang === 'bn' && currentQuestion && !bnTranslations) {
      loadBengaliTranslations(true).then((data) => {
        if (data) {
          setBnTranslations(data);
        }
      });
    }
    if (translationLang === 'fa' && currentQuestion && !faTranslations) {
      loadPersianTranslations(true).then((data) => {
        if (data) {
          setFaTranslations(data);
        }
      });
    }
  }, [currentQuestion?.id, translationLang, urTranslations, roTranslations, plTranslations, ptTranslations, bnTranslations, faTranslations]);

  // Get shuffled options for current question (memoized by question.id)
  // Shuffle runs ONCE per question and remains stable during re-renders
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    // Shuffle the option objects using Fisher-Yates
    return shuffleArray([...currentQuestion.options]);
  }, [currentQuestion?.id]);

  // Account-scoped topic index cache (UI convenience only — not authoritative).
  const loadSavedIndex = (topic: string): number => {
    if (!accountUserId) return 0;
    const indices = readAccountJson<Record<string, number>>(
      accountUserId,
      ACCOUNT_LOCAL_KEYS.practiceLastIndex
    );
    return indices?.[topic] ?? 0;
  };

  const saveIndex = (topic: string, index: number) => {
    if (!accountUserId || !topic) return;
    const prev =
      readAccountJson<Record<string, number>>(
        accountUserId,
        ACCOUNT_LOCAL_KEYS.practiceLastIndex
      ) ?? {};
    writeAccountJson(accountUserId, ACCOUNT_LOCAL_KEYS.practiceLastIndex, {
      ...prev,
      [topic]: index,
    });
  };

  // Restore index when topic changes (per authenticated account)
  useEffect(() => {
    if (!accountUserId || !selectedTopic || topicQuestions.length === 0) {
      return;
    }
    const savedIndex = loadSavedIndex(selectedTopic);
    const validIndex = Math.max(0, Math.min(savedIndex, topicQuestions.length - 1));
    setCurrentQuestionIndex(validIndex);
    setSelectedAnswerIndex(null);
    setSelectedKeywordIndex(null);
    setShowHints(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountUserId, selectedTopic, topicQuestions.length]);

  // Save index when it changes
  useEffect(() => {
    if (accountUserId && selectedTopic && topicQuestions.length > 0) {
      saveIndex(selectedTopic, currentQuestionIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountUserId, currentQuestionIndex, selectedTopic]);

  // Handle topic selection
  const topicFromUrlApplied = useRef(false);

  useEffect(() => {
    if (topicFromUrlApplied.current || selectedTopic || topics.length === 0) return;
    const requested = new URLSearchParams(window.location.search).get('topic');
    if (!requested || !topics.includes(requested)) return;
    topicFromUrlApplied.current = true;
    setSelectedTopic(requested);
    setSelectedAnswerIndex(null);
    setSelectedKeywordIndex(null);
    setShowTopicsGrid(false);
  }, [topics, selectedTopic]);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    // Index will be restored by useEffect
    setSelectedAnswerIndex(null);
    setSelectedKeywordIndex(null);
    setShowTopicsGrid(false);
  };

  // Handle change topic button
  const handleChangeTopic = () => {
    setShowTopicsGrid(true);
    // Scroll to topics grid smoothly
    setTimeout(() => {
      const topicsElement = document.getElementById('topics-grid');
      if (topicsElement) {
        topicsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Start practice session once per topic selection
  useEffect(() => {
    if (!selectedTopic) return;
    if (practiceStartedTopicsRef.current.has(selectedTopic)) return;
    practiceStartedTopicsRef.current.add(selectedTopic);
    const key = `lt_practice_session_${selectedTopic}`;
    const sessionId = getOrCreateClientSessionId(key);
    practiceSessionKeyRef.current = sessionId;
    trackSessionStart({
      mode: 'practice',
      language: analyticsLanguage(translationLang),
      client_session_id: sessionId,
    });
    void trackEvent('practice_started', {
      topic: selectedTopic,
      language: analyticsLanguage(translationLang),
    });
  }, [selectedTopic, translationLang]);

  // Free limit reached (once)
  useEffect(() => {
    if (loading || paid) return;
    if ((freeUsed ?? 0) < FREE_QUESTION_LIMIT) return;
    if (freeLimitTrackedRef.current) return;
    freeLimitTrackedRef.current = true;
    void trackEvent('free_limit_reached', { free_used: freeUsed ?? 0 });
  }, [loading, paid, freeUsed]);

  // Handle answer selection. The first click updates the screen immediately.
  // Persistent progress is saved afterwards and does not block the answer.
  const handleAnswerClick = (index: number) => {
    if (selectedAnswerIndex !== null) return; // Prevent re-selection
    if (!currentQuestion) return;
    if (answerClickLock.current === currentQuestion.id) return;
    answerClickLock.current = currentQuestion.id;

    setSelectedAnswerIndex(index);
    const selected = shuffledOptions[index];
    if (accountUserId && typeof selected?.sourceIndex === 'number') {
      const key = `${currentQuestion.id}:${selected.sourceIndex}`;
      const clientAttemptId =
        failedAttempt.current?.key === key ? failedAttempt.current.id : crypto.randomUUID();
      void learningProgress.recordAnswer(currentQuestion.id, selected.sourceIndex, clientAttemptId).then((saved) => {
        if (saved) {
          failedAttempt.current = null;
          return;
        }
        failedAttempt.current = { key, id: clientAttemptId };
        answerClickLock.current = null;
        setSelectedAnswerIndex(null);
      });
    }

    // Analytics stays once per question for this practice visit.
    if (answeredQuestionIds.has(currentQuestion.id)) return;

    setAnsweredQuestionIds(prev => new Set([...Array.from(prev), currentQuestion.id]));

    const correctOpt =
      shuffledOptions.find((o) => o.correct) ||
      currentQuestion.options.find((o) => o.correct);
    const sessionId =
      practiceSessionKeyRef.current ||
      getOrCreateClientSessionId(`lt_practice_session_${selectedTopic || 'general'}`);
    practiceSessionKeyRef.current = sessionId;

    trackAttempt({
      question_id: currentQuestion.id,
      topic: currentQuestion.topic,
      answer_selected: selected?.en || '',
      correct_answer: correctOpt?.en || '',
      is_correct: selected?.correct === true,
      mode: 'practice',
      language: analyticsLanguage(translationLang),
      session_id: sessionId,
    });
    
    // NO optimistic update - trialUsed comes from Supabase only (via /api/paywall/status)
  };

  // Handle navigation
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswerIndex(null);
      setSelectedKeywordIndex(null);
      setShowHints(false); // Reset hints to collapsed when changing question
    }
  };

  const handleNext = async () => {
    // Block navigation when no answer is selected
    if (selectedAnswerIndex === null) return;
    
    // Increment usage on server ONLY when moving to next question (not on answer click)
    // This ensures we count each question only once
    // Only increment if not paid and question not already counted
    if (!paid && currentQuestion && !countedQuestionIds.current.has(currentQuestion.id)) {
      countedQuestionIds.current.add(currentQuestion.id);

      // Persist free usage server-side, then sync client from authoritative response
      fetch('/api/practice/increment-usage', {
        method: 'POST',
      })
        .then(async (response) => {
          if (!response.ok) {
            // Fail closed: refresh status; AccessProvider will lock on error
            await silentRefresh();
            return;
          }
          const data = await response.json().catch(() => null);
          if (data && typeof data.free_questions_used === 'number') {
            // Keep AccessProvider in sync via silent refresh (server is source of truth)
            await silentRefresh();
            return;
          }
          await silentRefresh();
        })
        .catch((error) => {
          console.error('Error incrementing usage:', error);
          void silentRefresh();
        });
    }
    
    if (currentQuestionIndex < topicQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswerIndex(null);
      setSelectedKeywordIndex(null);
      setShowHints(false); // Reset hints to collapsed when changing question
    }
  };

  const handleRestart = () => {
    // Session navigation only. Saved answers stay on the account.
    answerClickLock.current = null;
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setSelectedKeywordIndex(null);
    setShowHints(false); // Reset hints to collapsed when restarting
  };

  // Reset image error when question changes
  useEffect(() => {
    setImageError(false);
  }, [currentQuestionIndex, currentQuestion?.id]);

  // Reset selected answer when question changes
  useEffect(() => {
    answerClickLock.current = null;
    setSelectedAnswerIndex(null);
    setSelectedKeywordIndex(null);
  }, [currentQuestion?.id]);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Practice page gate: unconfirmed ≠ paywall.
  const pageGate = decidePracticePageGate({
    loading,
    paid: paid === true,
    freeQuestionsUsed: freeUsed ?? 0,
    statusConfirmed,
  });
  const showPaywall = pageGate === 'paywall';

  if (maintenanceLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-4 py-6">
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

  if (pageGate === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center text-slate-600 font-medium">{enLabel('loading')}</div>
        </div>
      </div>
    );
  }

  if (pageGate === 'retry') {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <p className="text-[var(--text-primary)] font-medium">
            We couldn&apos;t confirm your access status.
            <br />
            Please try again.
          </p>
          <button
            type="button"
            onClick={() => {
              void refresh();
            }}
            className="lt-btn-primary px-6 py-3 text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = topicQuestions.length
    ? Math.round(((currentQuestionIndex + 1) / topicQuestions.length) * 100)
    : 0;

  return (
    <div dir="ltr" className="relative min-h-screen bg-[#F7F9FC] pb-28 md:pb-10">
      {showPaywall && <PaywallOverlay />}

      <div className={cn(showPaywall && 'pointer-events-none blur-sm opacity-50')}>
      <div className={cn('mx-auto w-full min-w-0 px-4 py-4 sm:px-6 sm:py-6', showTopicsGrid ? 'max-w-[1120px]' : 'max-w-[1000px]')}>
        {showTopicsGrid ? (
          <>
            <section className="relative overflow-hidden rounded-[22px] bg-[#102D4E] px-4 pb-7 pt-4 text-white shadow-[0_12px_28px_rgba(16,45,78,0.12)] sm:px-7 sm:pb-8 sm:pt-6">
              <PracticeWave />
              <div className="relative z-[1] flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:h-14 sm:w-14">
                  <PracticeCarIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold tracking-tight sm:text-[1.7rem]">Practice</h1>
                  <p className="mt-0.5 text-xs font-medium leading-snug text-white/85 sm:text-sm">
                    Choose a topic to start practising questions.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1.5 text-center text-[11px] font-semibold leading-tight sm:px-3 sm:text-xs">
                  {translationLang === 'ar'
                    ? `${questions.length} سؤال مراجعة · ${topics.length} مواضيع`
                    : `${questions.length} revision questions · ${topics.length} topics`}
                </span>
              </div>
            </section>

            <div id="topics-grid" className="mt-4 grid grid-cols-1 gap-2.5 md:mt-5 md:grid-cols-3 md:gap-4">
              {topics.map((topic) => {
                const englishLabel = toTitleCaseLabel(topic);
                const topicLabel = translationLang === 'off' ? '' : getTopicTranslation(topic, translationLang);
                const isActive = selectedTopic !== '' && topic === selectedTopic;
                const count = topicCounts.get(topic) || 0;
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleTopicSelect(topic)}
                    data-active={isActive}
                    className={cn(
                      'relative flex min-h-14 w-full items-start gap-3 rounded-[14px] border border-[#D5DEE8] bg-white px-3.5 py-3 text-left shadow-[0_8px_20px_rgba(16,45,78,0.05)] md:min-h-[104px] md:px-4',
                      isActive && 'border-[#D71920] bg-[#FDECEE]'
                    )}
                  >
                    <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7F4F9] text-[#168CBA]">
                      <TopicGlyph topic={topic} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold leading-tight text-[#102D4E] md:text-base">{englishLabel}</span>
                      {topicLabel ? (
                        <span
                          className="mt-0.5 block text-xs leading-snug text-[#4E5D73]"
                          dir={topicTranslationDir(translationLang)}
                          lang={translationLang === 'ar' ? 'ar' : undefined}
                        >
                          {topicLabel}
                        </span>
                      ) : null}
                      <span className="mt-1 hidden text-xs font-medium text-[#4E5D73] md:block">
                        {count} {count === 1 ? 'question' : 'questions'}
                      </span>
                      {accountUserId && learningProgress.status === 'ready' ? (
                        <TopicProgressBlock
                          progress={learningProgress.summary.topics[topic] ?? emptyTopicProgress(count)}
                          lang={translationLang}
                        />
                      ) : null}
                    </span>
                    {isActive ? (
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D71920] text-white md:absolute md:-right-1.5 md:-top-1.5 md:shadow-[0_4px_10px_rgba(215,25,32,0.35)]">
                        <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12.5 9.5 17 19 7.5" />
                        </svg>
                      </span>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden className="mt-2.5 h-5 w-5 shrink-0 text-[#168CBA] md:hidden" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mx-auto mt-5 hidden max-w-4xl sm:block">
              <DvsaLicenceNotice lang={translationLang} showDistinction />
            </div>
            <DisclaimerModal lang={translationLang} />
          </>
        ) : null}

        {currentQuestion && !showTopicsGrid ? (
          <div dir="ltr">
            <button
              type="button"
              onClick={handleChangeTopic}
              className="mb-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#102D4E]"
              aria-label={enLabel('changeTopic')}
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6 9 12l6 6" />
              </svg>
              Practice
            </button>

            <article className="w-full min-w-0 overflow-hidden rounded-[22px] border border-[#E6EDF5] bg-white shadow-[0_12px_28px_rgba(16,45,78,0.06)]">
              <header className="relative overflow-hidden bg-[#102D4E] px-4 pb-6 pt-3.5 text-white sm:px-6 sm:pb-7 sm:pt-5">
                <PracticeWave />
                <div className="relative z-[1] flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white sm:h-11 sm:w-11">
                    <TopicGlyph topic={currentQuestion.topic} />
                  </span>
                  <h2 className="min-w-0 flex-1 text-base font-bold leading-tight sm:text-xl">
                    {toTitleCaseLabel(currentQuestion.topic)}
                  </h2>
                  <p className="shrink-0 text-right text-xs font-semibold text-white/90 sm:text-sm">
                    {enLabel('questionOf', { current: currentQuestionIndex + 1, total: topicQuestions.length })}
                  </p>
                </div>
              </header>

              {accountUserId ? (
              <div className="border-b border-[#E6EDF5] px-4 py-3 sm:px-6">
                <LearningProgressPanel
                  progress={
                    learningProgress.summary.topics[currentQuestion.topic] ??
                    emptyTopicProgress(topicQuestions.length)
                  }
                  lang={translationLang}
                  status={learningProgress.status}
                  compact
                  bare
                  showRemaining
                  showCompleted={false}
                  title={progressCopy(translationLang).completion}
                  saveError={learningProgress.saveError}
                />
              </div>
              ) : null}

              <div className="px-4 py-4 sm:px-7 sm:py-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E7F4F9]" aria-hidden>
                    <div className="h-full rounded-full bg-[#168CBA]" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-[#168CBA] sm:text-sm">
                    {enLabel('percentComplete', { percent: progressPercent })}
                  </span>
                </div>

            {/* Question Image */}
            {currentQuestion.image ? (
              !imageError ? (
                <div className={cn(
                  "flex justify-center",
                  // Mobile-only smaller images for Road Signs topic
                  selectedTopic === "road-signs" 
                    ? "w-full items-center overflow-hidden h-[160px] mb-3 md:h-auto md:mb-4" 
                    : "mb-4"
                )}>
                  <Image
                    src={currentQuestion.image}
                    alt="Question illustration"
                    width={400}
                    height={160}
                    className={cn(
                      "w-auto object-contain",
                      // Mobile-only constraint for Road Signs
                      selectedTopic === "road-signs" 
                        ? "max-h-full md:max-h-40" 
                        : "max-h-40"
                    )}
                    loading="lazy"
                    onError={handleImageError}
                    unoptimized
                  />
                </div>
              ) : (
                <div className={cn(
                  "flex justify-center",
                  selectedTopic === "road-signs" 
                    ? "mb-3 md:mb-4" 
                    : "mb-4"
                )}>
                  <div className={cn(
                    "flex items-center justify-center w-full max-w-md rounded-xl border border-[var(--border)]/60 bg-[var(--bg)]",
                    selectedTopic === "road-signs" 
                      ? "h-[160px] md:h-40" 
                      : "h-40"
                  )}>
                    <span className="text-xs text-[var(--muted-text)]/70">{enLabel('imageNotAvailable')}</span>
                  </div>
                </div>
              )
            ) : null}

            {/* English Prompt — Practice-only keyword cards (never in Mock Test) */}
            <PracticeLearningAids
              questionId={currentQuestion.id}
              language={translationLang === 'ar' ? 'ar' : 'en'}
              prompt={currentQuestion.promptEn}
            />

            {/* Translation Prompt */}
            {translationLang === 'ar' && currentQuestion.promptAr && (
              <div className="mb-3">
                <ArabicDraftNote show={currentQuestion.arabicReview === 'draft'} />
                <h3 className="text-start text-base font-semibold leading-[1.8] tracking-wide text-[#4E5D73] break-words sm:text-lg" dir="rtl" lang="ar" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                  {currentQuestion.promptAr}
                </h3>
              </div>
            )}
            {translationLang === 'ur' && currentQuestion && (() => {
              if (!urTranslations) {
                console.warn(`[Practice] Urdu translations not loaded for question ${currentQuestion.id}`);
                return null;
              }
              const translation = getQuestionTranslation(currentQuestion.id, currentQuestion.topic, 'ur', urTranslations);
              if (translation?.prompt) {
                return (
                  <h3 className="text-[16px] sm:text-[17px] text-[var(--text-primary)] font-semibold mb-3 leading-[1.8] tracking-wide" dir="rtl">
                    {translation.prompt}
                  </h3>
                );
              } else {
                console.warn(`[Practice] No Urdu translation found for question ${currentQuestion.id} in topic ${currentQuestion.topic}`);
              }
              return null;
            })()}
            {translationLang === 'ro' && currentQuestion && (() => {
              if (!roTranslations) {
                console.warn(`[Practice] Romanian translations not loaded for question ${currentQuestion.id}`);
                return null;
              }
              const translation = getQuestionTranslation(currentQuestion.id, currentQuestion.topic, 'ro', roTranslations);
              if (translation?.prompt) {
                return (
                  <h3 className="text-[16px] sm:text-[17px] text-[var(--text-primary)] font-semibold mb-3 leading-[1.8] tracking-wide" dir="ltr">
                    {translation.prompt}
                  </h3>
                );
              } else {
                console.warn(`[Practice] No Romanian translation found for question ${currentQuestion.id} in topic ${currentQuestion.topic}`);
              }
              return null;
            })()}
            {translationLang === 'pl' && currentQuestion && (() => {
              if (!plTranslations) {
                console.warn(`[Practice] Polish translations not loaded for question ${currentQuestion.id}`);
                return null;
              }
              const translation = getQuestionTranslation(currentQuestion.id, currentQuestion.topic, 'pl', plTranslations);
              if (translation?.prompt) {
                return (
                  <h3 className="text-[16px] sm:text-[17px] text-[var(--text-primary)] font-semibold mb-3 leading-[1.8] tracking-wide" dir="ltr">
                    {translation.prompt}
                  </h3>
                );
              } else {
                console.warn(`[Practice] No Polish translation found for question ${currentQuestion.id} in topic ${currentQuestion.topic}`);
              }
              return null;
            })()}
            {translationLang === 'pt' && currentQuestion && (() => {
              if (!ptTranslations) {
                console.warn(`[Practice] Portuguese translations not loaded for question ${currentQuestion.id}`);
                return null;
              }
              const translation = getQuestionTranslation(currentQuestion.id, currentQuestion.topic, 'pt', ptTranslations);
              if (translation?.prompt) {
                return (
                  <h3 className="text-[16px] sm:text-[17px] text-[var(--text-primary)] font-semibold mb-3 leading-[1.8] tracking-wide" dir="ltr">
                    {translation.prompt}
                  </h3>
                );
              } else {
                console.warn(`[Practice] No Portuguese translation found for question ${currentQuestion.id} in topic ${currentQuestion.topic}`);
              }
              return null;
            })()}
            {translationLang === 'bn' && currentQuestion && (() => {
              if (!bnTranslations) return null;
              const translation = getQuestionTranslation(currentQuestion.id, currentQuestion.topic, 'bn', bnTranslations);
              if (translation?.prompt) {
                return (
                  <h3 className="text-[16px] sm:text-[17px] text-[var(--text-primary)] font-semibold mb-3 leading-[1.8] tracking-wide" dir="ltr">
                    {translation.prompt}
                  </h3>
                );
              }
              return null;
            })()}
            {translationLang === 'fa' && currentQuestion && (() => {
              if (!faTranslations) {
                console.warn(`[Practice] Persian translations not loaded for question ${currentQuestion.id}`);
                return null;
              }
              const translation = getQuestionTranslation(currentQuestion.id, currentQuestion.topic, 'fa', faTranslations);
              if (translation?.prompt) {
                return (
                  <h3 className="text-[16px] sm:text-[17px] text-[var(--text-primary)] font-semibold mb-3 leading-[1.8] tracking-wide" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                    {translation.prompt}
                  </h3>
                );
              } else {
                console.warn(`[Practice] No Persian translation found for question ${currentQuestion.id} in topic ${currentQuestion.topic}`);
              }
              return null;
            })()}

            <div className="mt-4 flex items-center justify-between gap-3">
              <PracticeExplanationHint
                questionId={currentQuestion.id}
                language={translationLang === 'ar' ? 'ar' : 'en'}
              />
              <span className="practice-voice">
                <TTSButton
                  text={currentQuestion.promptEn}
                  options={shuffledOptions}
                  className="!h-auto !w-auto gap-2 rounded-full px-2 py-1 text-[#168CBA]"
                />
              </span>
            </div>

            <VocabHintsControl
              questionId={currentQuestion.id}
              translationLang={translationLang}
            />

            {/* Answer Options */}
            <div className="space-y-2.5 mb-4" role="radiogroup" aria-label="Answer options">
              {shuffledOptions.map((option, index) => {
                const isSelected = selectedAnswerIndex === index;
                // Determine correctness based ONLY on the option's correct boolean property
                const isCorrectOption = option.correct === true;
                const showAsCorrect = selectedAnswerIndex !== null && isCorrectOption;
                const showAsWrong = isSelected && !isCorrectOption;
                const optionState = showAsCorrect
                  ? 'correct'
                  : showAsWrong
                    ? 'wrong'
                    : isSelected
                      ? 'selected'
                      : undefined;

                return (
                  <div
                    key={index}
                    data-state={optionState}
                    className={cn(
                      'practice-answer lt-option',
                      selectedAnswerIndex !== null && 'cursor-default'
                    )}
                  >
                    <div
                      role="radio"
                      aria-checked={isSelected}
                      aria-disabled={selectedAnswerIndex !== null}
                      aria-label={option.en || 'Answer option'}
                      tabIndex={selectedAnswerIndex !== null ? -1 : 0}
                      className="practice-answer-hit"
                      onClick={(event) => {
                        if (!shouldSelectAnswer(event)) return;
                        handleAnswerClick(index);
                      }}
                      onKeyDown={(event) => {
                        if (event.target !== event.currentTarget) return;
                        if (event.key !== 'Enter' && event.key !== ' ') return;
                        event.preventDefault();
                        handleAnswerClick(index);
                      }}
                    />
                    <div className="practice-answer-body">
                      <AnswerOptionContent
                        option={option}
                        keywordQuestionId={currentQuestion.id}
                        keywordLanguage={translationLang === 'ar' ? 'ar' : 'en'}
                        enClassName={cn(
                          "font-bold text-[17px] sm:text-[18px] leading-relaxed",
                          isSelected && !showAsCorrect && !showAsWrong ? "text-[var(--lingo-red-dark)]" : 
                          showAsCorrect ? "text-[var(--correct)]" :
                          showAsWrong ? "text-[var(--wrong)]" : "text-[var(--text-primary)]"
                        )}
                      >
                        {translationLang === 'ar' && option.ar && (
                          <div className={cn(
                            "text-start break-words text-[15px] sm:text-[16px] mt-2 leading-[1.8] tracking-wide font-medium",
                            isSelected && !showAsCorrect && !showAsWrong ? "text-[var(--lingo-red-dark)]/90" : 
                            showAsCorrect ? "text-[var(--correct)]/90" :
                            showAsWrong ? "text-[var(--wrong)]/90" : "text-[var(--text-secondary)]"
                          )} dir="rtl" lang="ar" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>{option.ar}</div>
                        )}
                        {translationLang === 'ur' && urTranslations && (() => {
                          const urOption = getUrduOptionTranslation(
                            option.en,
                            currentQuestion.options,
                            urTranslations,
                            currentQuestion.id,
                            currentQuestion.topic
                          );
                          if (urOption) {
                            return (
                              <div className={cn(
                                "text-[15px] sm:text-[16px] mt-2 leading-[1.8] tracking-wide font-medium",
                                isSelected && !showAsCorrect && !showAsWrong ? "text-[var(--lingo-red-dark)]/90" : 
                                showAsCorrect ? "text-[var(--correct)]/90" :
                                showAsWrong ? "text-[var(--wrong)]/90" : "text-[var(--text-secondary)]"
                              )} dir="rtl">{urOption}</div>
                            );
                          }
                          return null;
                        })()}
                        {translationLang === 'ro' && roTranslations && (() => {
                          const roOption = getRomanianOptionTranslation(
                            option.en,
                            currentQuestion.options,
                            roTranslations,
                            currentQuestion.id,
                            currentQuestion.topic
                          );
                          if (roOption) {
                            return (
                              <div className={cn(
                                "text-[15px] sm:text-[16px] mt-2 leading-[1.8] tracking-wide font-medium",
                                isSelected && !showAsCorrect && !showAsWrong ? "text-[var(--lingo-red-dark)]/90" : 
                                showAsCorrect ? "text-[var(--correct)]/90" :
                                showAsWrong ? "text-[var(--wrong)]/90" : "text-[var(--text-secondary)]"
                              )} dir="ltr">{roOption}</div>
                            );
                          }
                          return null;
                        })()}
                        {translationLang === 'pl' && plTranslations && (() => {
                          const plOption = getPolishOptionTranslation(
                            option.en,
                            currentQuestion.options,
                            plTranslations,
                            currentQuestion.id,
                            currentQuestion.topic
                          );
                          if (plOption) {
                            return (
                              <div className={cn(
                                "text-[15px] sm:text-[16px] mt-2 leading-[1.8] tracking-wide font-medium",
                                isSelected && !showAsCorrect && !showAsWrong ? "text-[var(--lingo-red-dark)]/90" : 
                                showAsCorrect ? "text-[var(--correct)]/90" :
                                showAsWrong ? "text-[var(--wrong)]/90" : "text-[var(--text-secondary)]"
                              )} dir="ltr">{plOption}</div>
                            );
                          }
                          return null;
                        })()}
                        {translationLang === 'pt' && ptTranslations && (() => {
                          const ptOption = getPortugueseOptionTranslation(
                            option.en,
                            currentQuestion.options,
                            ptTranslations,
                            currentQuestion.id,
                            currentQuestion.topic
                          );
                          if (ptOption) {
                            return (
                              <div className={cn(
                                "text-[15px] sm:text-[16px] mt-2 leading-[1.8] tracking-wide font-medium",
                                isSelected && !showAsCorrect && !showAsWrong ? "text-[var(--lingo-red-dark)]/90" : 
                                showAsCorrect ? "text-[var(--correct)]/90" :
                                showAsWrong ? "text-[var(--wrong)]/90" : "text-[var(--text-secondary)]"
                              )} dir="ltr">{ptOption}</div>
                            );
                          }
                          return null;
                        })()}
                        {translationLang === 'bn' && bnTranslations && (() => {
                          const bnOption = getBengaliOptionTranslation(
                            option.en,
                            currentQuestion.options,
                            bnTranslations,
                            currentQuestion.id,
                            currentQuestion.topic
                          );
                          if (bnOption) {
                            return (
                              <div className={cn(
                                "text-[15px] sm:text-[16px] mt-2 leading-[1.8] tracking-wide font-medium",
                                isSelected && !showAsCorrect && !showAsWrong ? "text-[var(--lingo-red-dark)]/90" : 
                                showAsCorrect ? "text-[var(--correct)]/90" :
                                showAsWrong ? "text-[var(--wrong)]/90" : "text-[var(--text-secondary)]"
                              )} dir="ltr">{bnOption}</div>
                            );
                          }
                          return null;
                        })()}
                        {translationLang === 'fa' && faTranslations && (() => {
                          const faOption = getPersianOptionTranslation(
                            option.en,
                            currentQuestion.options,
                            faTranslations,
                            currentQuestion.id,
                            currentQuestion.topic
                          );
                          if (faOption) {
                            return (
                              <div className={cn(
                                "text-[15px] sm:text-[16px] mt-2 leading-[1.8] tracking-wide font-medium",
                                isSelected && !showAsCorrect && !showAsWrong ? "text-[var(--lingo-red-dark)]/90" : 
                                showAsCorrect ? "text-[var(--correct)]/90" :
                                showAsWrong ? "text-[var(--wrong)]/90" : "text-[var(--text-secondary)]"
                              )} dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>{faOption}</div>
                            );
                          }
                          return null;
                        })()}
                      </AnswerOptionContent>
                    </div>
                  </div>
                );
              })}
            </div>

            {(() => {
              // Filter hints by active language requirements
              const validHints = currentQuestion.keywords?.filter((keyword) => {
                // Check if it's a hint (starts with "hint")
                if (!keyword.term.startsWith('hint')) return false;
                
                // Check English: must have explainEn or explainAr that's actually English
                const hasEnglish = !!(keyword.explainEn || 
                  (keyword.explainAr && /^[A-Z]/.test(keyword.explainAr.trim()) && 
                   /[a-zA-Z]/.test(keyword.explainAr) && 
                   !/[\u0600-\u06FF]/.test(keyword.explainAr)));
                
                // Check Arabic: must have explainAr that's actually Arabic (not English)
                const hasArabic = !!(keyword.explainAr && 
                  !(/^[A-Z]/.test(keyword.explainAr.trim()) && 
                    /[a-zA-Z]/.test(keyword.explainAr) && 
                    !/[\u0600-\u06FF]/.test(keyword.explainAr)));
                
                // Check Urdu: must have translation in keyword-translations.ts
                const urduTranslation = getKeywordUrduTranslation(keyword.term);
                const hasUrdu = !!urduTranslation?.explainUr;

                // Check Romanian: must have translation in keyword-translations.ts
                const romanianTranslation = getKeywordRomanianTranslation(keyword.term);
                const hasRomanian = !!romanianTranslation?.explainRo;

                // Check Polish: must have translation in keyword-translations.ts
                const polishTranslation = getKeywordPolishTranslation(keyword.term);
                const hasPolish = !!polishTranslation?.explainPl;

                // Check Portuguese: must have translation in keyword-translations.ts
                const portugueseTranslation = getKeywordPortugueseTranslation(keyword.term);
                const hasPortuguese = !!portugueseTranslation?.explainPt;

                const persianTranslation = getKeywordPersianTranslation(keyword.term);
                const hasPersian = !!persianTranslation?.explainFa;

                if (translationLang === 'ro') {
                  return hasEnglish && hasRomanian;
                }
                if (translationLang === 'pl') {
                  return hasEnglish && hasPolish;
                }
                if (translationLang === 'pt') {
                  return hasEnglish && hasPortuguese;
                }
                if (translationLang === 'fa') {
                  return hasEnglish && hasPersian;
                }
                if (translationLang === 'bn') {
                  return hasEnglish;
                }
                if (translationLang === 'off') {
                  return hasEnglish;
                }
                // ar / ur: keep requiring EN + AR + UR
                return hasEnglish && hasArabic && hasUrdu;
              }) || [];

              // Only show hints section if there are valid hints
              if (selectedAnswerIndex === null || validHints.length === 0) {
                return null;
              }

              return (
                <div className="mb-3 mt-4 pt-4 border-t border-[var(--border)]/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Toggle Button */}
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="lt-btn-ghost flex items-center gap-2 mb-3 px-3 py-2 text-sm w-full sm:w-auto"
                  >
                    <span className="text-lg">💡</span>
                    <span className="flex-1 min-w-0">
                      {showHints ? (
                        <BilingualLabel keyName="hideLearningHints" lang={translationLang} align="start" />
                      ) : (
                        <BilingualLabel keyName="showLearningHints" lang={translationLang} align="start" />
                      )}
                    </span>
                    <span className={cn(
                      "ml-auto sm:ml-2 transition-transform duration-200",
                      showHints ? "rotate-180" : ""
                    )}>▼</span>
                  </button>

                  {/* Hints Content - Collapsible */}
                  {showHints && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="mb-3">
                        <h3 className="text-base font-semibold text-[var(--navy)]">
                          {enLabel('learningHints')}
                        </h3>
                      </div>
                      <p
                        className="text-[13px] sm:text-[14px] font-medium mb-4 text-[var(--muted-text)]/80 leading-relaxed"
                      >
                        {enLabel('learningHintsIntro')}
                      </p>
                      <div className="space-y-3">
                        {validHints.map((keyword, index) => {
                          const urduTranslation = getKeywordUrduTranslation(keyword.term);
                          const romanianTranslation = getKeywordRomanianTranslation(keyword.term);
                          const polishTranslation = getKeywordPolishTranslation(keyword.term);
                          const portugueseTranslation = getKeywordPortugueseTranslation(keyword.term);
                          const persianTranslation = getKeywordPersianTranslation(keyword.term);
                          // Get English text - prefer explainEn, fallback to explainAr if it's English
                          const englishText = keyword.explainEn || 
                            (keyword.explainAr && /^[A-Z]/.test(keyword.explainAr.trim()) && 
                             /[a-zA-Z]/.test(keyword.explainAr) && 
                             !/[\u0600-\u06FF]/.test(keyword.explainAr) ? keyword.explainAr : null);
                          
                          return (
                            <div
                              key={index}
                              className="rounded-[14px] border border-[#168CBA]/25 bg-[#E7F4F9] p-5"
                            >
                              <div className="flex items-start gap-3 mb-2">
                                <span className="mt-0.5 flex-shrink-0 text-sm font-bold text-[#168CBA]">{keyword.term}</span>
                                {translationLang === 'ar' && (
                                  <span className="text-[var(--muted-text)]/70 text-sm" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1', lineHeight: '1.8' }}>{keyword.ar}</span>
                                )}
                                {translationLang === 'ur' && urduTranslation && (
                                  <span className="text-[var(--muted-text)]/70 text-sm" dir="rtl" style={{ lineHeight: '1.8' }}>{urduTranslation.ur}</span>
                                )}
                                {translationLang === 'ro' && romanianTranslation && (
                                  <span className="text-[var(--muted-text)]/70 text-sm" dir="ltr" style={{ lineHeight: '1.8' }}>{romanianTranslation.ro}</span>
                                )}
                                {translationLang === 'pl' && polishTranslation && (
                                  <span className="text-[var(--muted-text)]/70 text-sm" dir="ltr" style={{ lineHeight: '1.8' }}>{polishTranslation.pl}</span>
                                )}
                                {translationLang === 'pt' && portugueseTranslation && (
                                  <span className="text-[var(--muted-text)]/70 text-sm" dir="ltr" style={{ lineHeight: '1.8' }}>{portugueseTranslation.pt}</span>
                                )}
                                {translationLang === 'fa' && persianTranslation && (
                                  <span className="text-[var(--muted-text)]/70 text-sm" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1', lineHeight: '1.8' }}>{persianTranslation.fa}</span>
                                )}
                              </div>
                              {translationLang === 'off' && englishText && (
                                <p className="text-sm text-[var(--navy)] leading-relaxed">
                                  {englishText}
                                </p>
                              )}
                              {translationLang === 'ar' && keyword.explainAr && (
                                <p className="text-sm text-[var(--navy)] leading-relaxed" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1', lineHeight: '1.8' }}>
                                  {keyword.explainAr}
                                </p>
                              )}
                              {translationLang === 'ur' && urduTranslation && (
                                <p className="text-sm text-[var(--navy)] leading-relaxed" dir="rtl" style={{ lineHeight: '1.8' }}>
                                  {urduTranslation.explainUr}
                                </p>
                              )}
                              {translationLang === 'ro' && romanianTranslation && (
                                <p className="text-sm text-[var(--navy)] leading-relaxed" dir="ltr">
                                  {romanianTranslation.explainRo}
                                </p>
                              )}
                              {translationLang === 'pl' && polishTranslation && (
                                <p className="text-sm text-[var(--navy)] leading-relaxed" dir="ltr">
                                  {polishTranslation.explainPl}
                                </p>
                              )}
                              {translationLang === 'pt' && portugueseTranslation && (
                                <p className="text-sm text-[var(--navy)] leading-relaxed" dir="ltr">
                                  {portugueseTranslation.explainPt}
                                </p>
                              )}
                              {translationLang === 'fa' && persianTranslation && (
                                <p className="text-sm text-[var(--navy)] leading-relaxed" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1', lineHeight: '1.8' }}>
                                  {persianTranslation.explainFa}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <PracticeKeywordControl
              questionId={currentQuestion.id}
              language={translationLang === 'ar' ? 'ar' : 'en'}
            />

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={cn(
                  'inline-flex min-h-12 items-center gap-1 rounded-xl border border-[#D5DEE8] bg-white px-3 text-sm font-semibold text-[#102D4E] sm:px-4',
                  currentQuestionIndex === 0 && 'cursor-not-allowed opacity-40'
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
                onClick={handleNext}
                disabled={currentQuestionIndex === topicQuestions.length - 1 || selectedAnswerIndex === null || showPaywall}
                className={cn(
                  'practice-next lt-btn-primary ml-auto min-h-12 gap-1.5 px-4 text-sm sm:px-5',
                  (currentQuestionIndex === topicQuestions.length - 1 || selectedAnswerIndex === null || showPaywall) && 'cursor-not-allowed'
                )}
              >
                {enLabel('next')}
                <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
              </div>
            </article>
          </div>
        ) : !showTopicsGrid ? (
          <div className="lt-card p-8 sm:p-10 mt-4 text-center text-[var(--text-secondary)]">
            <p className="text-lg font-medium text-[var(--text-primary)]">{enLabel('selectTopic')}</p>
          </div>
        ) : null}
      </div>
      </div>
    </div>
  );
}

