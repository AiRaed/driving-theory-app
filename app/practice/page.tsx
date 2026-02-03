'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { questions } from '@/data/questions';
import { cn, toTitleCaseLabel } from '@/lib/utils';
import TTSButton from '@/components/TTSButton';
import DisclaimerModal from '@/components/DisclaimerModal';
import PaywallOverlay from '@/components/PaywallOverlay';
import { usePaywallStatus } from '@/lib/hooks/usePaywallStatus';
import { 
  TranslationLang, 
  getTranslationLang, 
  setTranslationLang, 
  loadUrduTranslations,
  getQuestionTranslation,
  getUrduOptionTranslation,
  type TranslationData 
} from '@/lib/translations';
import { getKeywordUrduTranslation } from '@/lib/keyword-translations';

// Arabic translations for topics
const topicArabicMap: Record<string, string> = {
  'alertness': 'الانتباه والتركيز',
  'hazard-awareness': 'التنبّه للمخاطر',
  'road-signs': 'إشارات الطريق',
  'safety-margins': 'مسافات الأمان',
  'rules-of-the-road': 'قوانين الطريق',
  'vulnerable-road-users': 'مستخدمي الطريق',
  'vehicle-handling': 'التحكم بالمركبة',
  'incidents': 'الحوادث والطوارئ',
  'documents': 'الوثائق والرخص',
  'motorway-driving': 'الطرق السريعة',
  'other-vehicles': 'المركبات الأخرى',
  'vehicle-loading': 'تحميل المركبة',
  'attitude': 'سلوك السائق',
  'safety-vehicle': 'سلامة المركبة',
};

// Urdu translations for topics
const topicUrduMap: Record<string, string> = {
  'alertness': 'چوکسی',
  'hazard-awareness': 'خطرات سے آگاہی',
  'road-signs': 'سڑک کے اشارے',
  'safety-margins': 'محفوظ فاصلے',
  'rules-of-the-road': 'سڑک کے قواعد',
  'vulnerable-road-users': 'کمزور سڑک استعمال کرنے والے',
  'vehicle-handling': 'گاڑی پر کنٹرول',
  'incidents': 'حادثات',
  'documents': 'دستاویزات',
  'motorway-driving': 'موٹر وے پر ڈرائیونگ',
  'other-vehicles': 'دیگر گاڑیاں',
  'vehicle-loading': 'گاڑی کی لوڈنگ',
  'attitude': 'رویہ',
  'safety-vehicle': 'گاڑی کی حفاظت',
};

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PracticePage() {
  // SINGLE SOURCE OF TRUTH: usePaywallStatus from /api/paywall/status
  const { loading, paid, trialUsed, trialLimit, refresh } = usePaywallStatus();
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [selectedKeywordIndex, setSelectedKeywordIndex] = useState<number | null>(null);
  const [translationLang, setTranslationLangState] = useState<TranslationLang>('off');
  const [isMounted, setIsMounted] = useState(false);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());
  // Track which questions have already been counted to avoid double-counting
  const countedQuestionIds = useRef<Set<string>>(new Set());

  // Load translation language from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    setTranslationLangState(getTranslationLang());
  }, []);
  const [urTranslations, setUrTranslations] = useState<TranslationData | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [showTopicsGrid, setShowTopicsGrid] = useState<boolean>(true);
  const [showHints, setShowHints] = useState<boolean>(false); // Collapsed by default on mobile

  // Load Urdu translations when needed
  useEffect(() => {
    if (translationLang === 'ur') {
      // Force reload to ensure we have the latest translations
      loadUrduTranslations(true).then((data) => {
        if (data) {
          setUrTranslations(data);
        }
      });
    } else {
      // Clear translations when switching away from Urdu
      setUrTranslations(null);
    }
  }, [translationLang]);

  // Load Urdu translations automatically for topics that have Urdu translations
  useEffect(() => {
    if (translationLang === 'ur' && selectedTopic) {
      const topicsWithUrdu = [
        'alertness',
        'hazard-awareness',
        'road-signs',
        'safety-margins',
        'rules-of-the-road',
        'safety-vehicle',
        'attitude',
        'other-vehicles',
        'documents',
        'vulnerable-road-users',
        'vehicle-handling',
        'incidents',
        'motorway-driving',
        'vehicle-loading'
      ];
      
      // Always load translations when Urdu is selected and a topic is chosen
      loadUrduTranslations(true).then((data) => {
        if (data) {
          setUrTranslations(data);
        }
      });
    }
  }, [selectedTopic, translationLang]);

  // Update translation language
  const handleTranslationLangChange = (lang: TranslationLang) => {
    setTranslationLangState(lang);
    setTranslationLang(lang);
    if (lang === 'ur') {
      // Force reload to ensure we have the latest translations
      loadUrduTranslations(true).then((data) => {
        if (data) {
          setUrTranslations(data);
        }
      });
    } else {
      setUrTranslations(null);
    }
  };

  // Get all unique topics
  const topics = useMemo(() => {
    const uniqueTopics = Array.from(new Set(questions.map(q => q.topic)));
    return uniqueTopics;
  }, []);

  // Compute totals
  const totalQuestions = questions.length;
  const totalTopics = topics.length;

  // Get questions for the selected topic
  const topicQuestions = useMemo(() => {
    if (!selectedTopic) return [];
    return questions.filter(q => q.topic === selectedTopic);
  }, [selectedTopic]);

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
  }, [currentQuestion?.id, translationLang, urTranslations]);

  // Get shuffled options for current question (memoized by question.id)
  // Shuffle runs ONCE per question and remains stable during re-renders
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    // Shuffle the option objects using Fisher-Yates
    return shuffleArray([...currentQuestion.options]);
  }, [currentQuestion?.id]);

  // Load saved index from localStorage
  const loadSavedIndex = (topic: string): number => {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = localStorage.getItem('theory_last_index_v1');
      if (saved) {
        const indices: Record<string, number> = JSON.parse(saved);
        return indices[topic] ?? 0;
      }
    } catch (e) {
      console.error('Failed to load saved index:', e);
    }
    return 0;
  };

  // Save current index to localStorage
  const saveIndex = (topic: string, index: number) => {
    if (typeof window === 'undefined' || !topic) return;
    try {
      const saved = localStorage.getItem('theory_last_index_v1');
      const indices: Record<string, number> = saved ? JSON.parse(saved) : {};
      indices[topic] = index;
      localStorage.setItem('theory_last_index_v1', JSON.stringify(indices));
    } catch (e) {
      console.error('Failed to save index:', e);
    }
  };

  // Restore index when topic changes
  useEffect(() => {
    if (selectedTopic && topicQuestions.length > 0) {
      const savedIndex = loadSavedIndex(selectedTopic);
      // Clamp index to valid range
      const validIndex = Math.max(0, Math.min(savedIndex, topicQuestions.length - 1));
      setCurrentQuestionIndex(validIndex);
      setSelectedAnswerIndex(null);
      setSelectedKeywordIndex(null);
      setShowHints(false); // Reset hints to collapsed when topic changes
    }
  }, [selectedTopic, topicQuestions.length]);

  // Save index when it changes
  useEffect(() => {
    if (selectedTopic && topicQuestions.length > 0) {
      saveIndex(selectedTopic, currentQuestionIndex);
    }
  }, [currentQuestionIndex, selectedTopic]);

  // Handle topic selection
  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    // Index will be restored by useEffect
    setSelectedAnswerIndex(null);
    setSelectedKeywordIndex(null);
    // Hide topics grid on mobile after selection
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setShowTopicsGrid(false);
    }
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

  // Handle answer selection - INSTANT client-side only, no network calls
  const handleAnswerClick = (index: number) => {
    if (selectedAnswerIndex !== null) return; // Prevent re-selection
    if (!currentQuestion) return;
    
    // Check if already answered this question
    if (answeredQuestionIds.has(currentQuestion.id)) {
      setSelectedAnswerIndex(index);
      return;
    }
    
    // INSTANT UI update - no async, no network calls, no loading
    setSelectedAnswerIndex(index);
    
    // Update local state
    setAnsweredQuestionIds(prev => new Set([...Array.from(prev), currentQuestion.id]));
    
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
      
      // Fire-and-forget: increment usage in background, don't block UI
      fetch('/api/practice/increment-usage', {
        method: 'POST',
      }).then(response => {
        if (response.ok) {
          // Refresh paywall status from Supabase to get updated trialUsed
          // This ensures Web and Android stay in sync
          refresh().catch(err => console.error('Error refreshing access:', err));
        }
      }).catch(error => {
        console.error('Error incrementing usage:', error);
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
    setSelectedAnswerIndex(null);
    setSelectedKeywordIndex(null);
  }, [currentQuestion?.id]);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Determine correctness based ONLY on the selected option's correct boolean property
  const selectedOption = selectedAnswerIndex !== null ? shuffledOptions[selectedAnswerIndex] : null;
  const isCorrect = selectedOption?.correct === true;

  // Practice: allow 15 total answers across all topics before showing paywall
  // canAccessPractice = paid OR trialUsed < trialLimit
  const canAccessPractice = paid || trialUsed < trialLimit;
  const showPaywall = !canAccessPractice;

  // IMPORTANT: Default UI state is LOCKED while loading (show PaywallOverlay)
  // Only unlock after confirmed paid=true
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative">
        <PaywallOverlay />
        <div className="pointer-events-none blur-sm opacity-50">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="text-center text-slate-600 font-medium">Checking access...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative">
      {/* Paywall Overlay - blocks everything when locked */}
      {showPaywall && <PaywallOverlay />}
      
      {/* Content - blurred and non-interactive when paywall is shown */}
      <div
        className={cn(
          showPaywall && "pointer-events-none blur-sm opacity-50"
        )}
      >
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Compact Summary Row */}
        <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm border border-slate-300 bg-white hover:bg-gradient-to-br hover:from-slate-50 hover:to-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] font-semibold text-slate-800"
            >
              ← Back to dashboard
            </Link>
            <span className="hidden md:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-50 to-red-100/50 text-red-700 border border-red-200/60 shadow-sm">
              Practice
            </span>
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 flex-1 min-w-0">
              <span className="text-xs md:text-sm font-medium text-slate-600 whitespace-nowrap">
                <span className="md:hidden">{totalQuestions}Q · {totalTopics}T</span>
                <span className="hidden md:inline">{totalQuestions} questions · {totalTopics} topics</span>
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

        {/* Mobile: Selected Topic Bar (shown when grid is hidden) */}
        {selectedTopic && !showTopicsGrid && (
          <div className="md:hidden mb-4">
            <div className="flex items-start justify-between gap-3 px-4 py-2.5 rounded-xl border border-red-200/60 bg-gradient-to-br from-red-50/50 via-white to-red-50/30 shadow-md">
              {/* Title stack: English + Translation (mobile: stacked vertically, full width) */}
              <div className="flex-1 min-w-0 flex flex-col gap-1 pr-2">
                {/* English topic name - first line, full width */}
                <div className="font-semibold text-base text-slate-800 leading-tight w-full block">
                  {toTitleCaseLabel(selectedTopic)}
                </div>
                {/* Translation - second line, directly under English, full width */}
                {translationLang === 'ar' && topicArabicMap[selectedTopic] && (
                  <div className="text-sm text-slate-600/80 font-normal leading-tight w-full block text-right" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                    {topicArabicMap[selectedTopic]}
                  </div>
                )}
                {translationLang === 'ur' && topicUrduMap[selectedTopic] && (
                  <div className="text-sm text-slate-600/80 font-normal leading-tight w-full block text-right" dir="rtl">
                    {topicUrduMap[selectedTopic]}
                  </div>
                )}
              </div>
              {/* Change button: stays on the right, doesn't wrap */}
              <button
                onClick={handleChangeTopic}
                className="flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97] whitespace-nowrap self-start"
              >
                Change topic
              </button>
            </div>
          </div>
        )}

        {/* Topic Selection - Chips */}
        <div 
          id="topics-grid"
          className={cn(
            "relative mb-8 transition-all duration-500 ease-out",
            // Hide on mobile when topic is selected
            !showTopicsGrid && "hidden md:block"
          )}>
          {/* Responsive grid: 2 cols on mobile (<=640px), 3 cols on sm, 5 cols on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:grid-rows-3">
            {topics.map((topic) => {
              const englishLabel = toTitleCaseLabel(topic);
              const arabicSubtitle = topicArabicMap[topic] || '';
              const isActive = topic === selectedTopic;
              return (
                <button
                  key={topic}
                  onClick={() => handleTopicSelect(topic)}
                  className={cn(
                    "rounded-xl border text-left transition-all duration-200 ease-in-out",
                    "hover:shadow-md active:scale-[0.97]",
                    // Mobile: consistent height and padding
                    "py-2.5 px-3 md:py-[3px] md:px-4",
                    // Mobile: consistent min-height for alignment
                    "min-h-[64px] sm:min-h-[56px] md:min-h-[40px]",
                    "flex flex-col justify-center",
                    isActive
                      ? "border-red-700/30 bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800" 
                      : "bg-gradient-to-br from-red-50/50 via-white to-red-50/30 border-red-100/60 text-slate-800 hover:from-red-50/70 hover:via-white hover:to-red-50/40 hover:border-red-200/80 hover:shadow-md"
                  )}
                >
                  <div className="flex items-start gap-1.5 md:gap-2 w-full">
                    {isActive && (
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white flex-shrink-0 mt-0.5"></div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col">
                      {/* English title: always on top */}
                      <div className={cn(
                        "font-semibold text-xs md:text-xs leading-tight",
                        "line-clamp-2 sm:line-clamp-1 md:line-clamp-1",
                        "overflow-hidden",
                        isActive ? "text-white" : "text-slate-800"
                      )}>{englishLabel}</div>
                      {/* Translation subtitle: always below English, smaller and muted */}
                      {translationLang === 'ar' && arabicSubtitle && (
                        <div 
                          className={cn(
                            "text-[10px] md:text-[11px] font-normal mt-1 leading-tight",
                            "line-clamp-1 overflow-hidden text-ellipsis",
                            isActive ? "text-white/80" : "text-slate-600/70"
                          )} 
                          dir="rtl" 
                          style={{ 
                            fontFeatureSettings: '"liga" 1, "kern" 1'
                          }}
                        >
                          {arabicSubtitle}
                        </div>
                      )}
                      {translationLang === 'ur' && topicUrduMap[topic] && (
                        <div 
                          className={cn(
                            "text-[10px] md:text-[11px] font-normal mt-1 leading-tight",
                            "line-clamp-1 overflow-hidden text-ellipsis",
                            isActive ? "text-white/80" : "text-slate-600/70"
                          )} 
                          dir="rtl"
                        >
                          {topicUrduMap[topic]}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
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

            {/* Question Display */}
        {currentQuestion ? (
          <div className="rounded-2xl border border-red-100/60 bg-gradient-to-br from-red-50/50 via-white to-red-50/30 p-6 sm:p-7 mt-4 shadow-xl relative overflow-hidden backdrop-blur-sm">
            {/* Premium red top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
            {/* Teal secondary accent line */}
            <div className="absolute top-1.5 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-300/40 to-transparent"></div>
            
            {/* Progress Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs text-[var(--muted-text)]/80 font-medium">
                  Question {currentQuestionIndex + 1} of {topicQuestions.length}
                </div>
                <div className="text-xs text-[var(--muted-text)]/70">
                  {Math.round(((currentQuestionIndex + 1) / topicQuestions.length) * 100)}% complete
                </div>
              </div>
              <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${((currentQuestionIndex + 1) / topicQuestions.length) * 100}%` }}
                />
              </div>
              {currentQuestionIndex + 1 === topicQuestions.length && (
                <p className="text-xs text-[var(--teal)] mt-2 font-medium">Almost there! Keep going.</p>
              )}
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
                    <span className="text-xs text-[var(--muted-text)]/70">Image not available</span>
                  </div>
                </div>
              )
            ) : null}

            {/* English Prompt */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h2 className="text-[19px] sm:text-[21px] font-bold text-slate-900 leading-[1.4] flex-1 min-w-0 break-words whitespace-normal">
                {currentQuestion.promptEn}
              </h2>
              <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                <TTSButton text={currentQuestion.promptEn} options={shuffledOptions} />
              </div>
            </div>

            {/* Translation Prompt */}
            {translationLang === 'ar' && currentQuestion.promptAr && (
              <h3 className="text-[16px] sm:text-[17px] text-slate-800 font-semibold mb-3 leading-[1.8] tracking-wide" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                {currentQuestion.promptAr}
              </h3>
            )}
            {translationLang === 'ur' && currentQuestion && (() => {
              if (!urTranslations) {
                console.warn(`[Practice] Urdu translations not loaded for question ${currentQuestion.id}`);
                return null;
              }
              const translation = getQuestionTranslation(currentQuestion.id, currentQuestion.topic, 'ur', urTranslations);
              if (translation?.prompt) {
                return (
                  <h3 className="text-[16px] sm:text-[17px] text-slate-800 font-semibold mb-3 leading-[1.8] tracking-wide" dir="rtl">
                    {translation.prompt}
                  </h3>
                );
              } else {
                console.warn(`[Practice] No Urdu translation found for question ${currentQuestion.id} in topic ${currentQuestion.topic}`);
              }
              return null;
            })()}

            {/* Divider */}
            <div className="border-t border-slate-200/80 mb-4 mt-2"></div>

            {/* Answer Options */}
            <div className="space-y-2.5 mb-4">
              {shuffledOptions.map((option, index) => {
                const isSelected = selectedAnswerIndex === index;
                // Determine correctness based ONLY on the option's correct boolean property
                const isCorrectOption = option.correct === true;
                const showAsCorrect = selectedAnswerIndex !== null && isCorrectOption;
                const showAsWrong = isSelected && !isCorrectOption;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={selectedAnswerIndex !== null}
                    className={cn(
                      "w-full text-left rounded-xl px-5 py-3.5 transition-all duration-200 ease-in-out border",
                      "shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]",
                      // Neutral (unanswered) state
                      selectedAnswerIndex === null && "bg-white border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-white hover:border-red-300 hover:shadow-md",
                      // Selected but not yet revealed (neutral state)
                      isSelected && !showAsCorrect && !showAsWrong && "bg-gradient-to-br from-blue-50 to-white border-blue-300 shadow-lg ring-2 ring-blue-200/50",
                      // Correct answer (shown after selection)
                      showAsCorrect && "bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg ring-2 ring-green-200/50",
                      // Wrong answer (user's selection)
                      showAsWrong && "bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg ring-2 ring-red-200/50",
                      selectedAnswerIndex !== null && "cursor-default"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {isSelected && !showAsCorrect && !showAsWrong && (
                        <span className="text-xl flex-shrink-0 mt-0.5 text-blue-600 font-bold">○</span>
                      )}
                      {(showAsCorrect || showAsWrong) && (
                        <span className={cn(
                          "text-xl flex-shrink-0 mt-0.5 font-bold transition-all duration-300",
                          showAsCorrect ? "text-green-600" : "text-red-600"
                        )}>
                          {showAsCorrect ? "✓" : "✕"}
                        </span>
                      )}
                      <div className="flex-1">
                        <div className={cn(
                          "font-bold text-[17px] sm:text-[18px] leading-relaxed",
                          isSelected && !showAsCorrect && !showAsWrong ? "text-blue-900" : 
                          showAsCorrect ? "text-green-800" :
                          showAsWrong ? "text-red-800" : "text-slate-900"
                        )}>{option.en}</div>
                        {translationLang === 'ar' && option.ar && (
                          <div className={cn(
                            "text-[15px] sm:text-[16px] mt-2 leading-[1.8] tracking-wide font-medium",
                            isSelected && !showAsCorrect && !showAsWrong ? "text-blue-800/90" : 
                            showAsCorrect ? "text-green-700/90" :
                            showAsWrong ? "text-red-700/90" : "text-slate-700"
                          )} dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>{option.ar}</div>
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
                                isSelected && !showAsCorrect && !showAsWrong ? "text-blue-800/90" : 
                                showAsCorrect ? "text-green-700/90" :
                                showAsWrong ? "text-red-700/90" : "text-slate-700"
                              )} dir="rtl">{urOption}</div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback Badge */}
            {selectedAnswerIndex !== null && (
              <div className={cn(
                "inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold mb-5 transition-all duration-300 animate-in fade-in slide-in-from-top-2 shadow-md",
                isCorrect ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300" : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300"
              )}>
                <span className="text-lg font-bold">{isCorrect ? "✓" : "✕"}</span>
                <span>{isCorrect ? "Well done! You've got this." : "Not quite. Review the explanation below."}</span>
              </div>
            )}

            {/* Learning Hints Section - Shown after answering */}
            {(() => {
              // Filter hints to only show those with all 3 languages (EN/AR/UR)
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
                
                // Only show if all three languages exist
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
                    className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-all duration-200 text-sm font-medium text-[var(--navy)] hover:shadow-sm active:scale-[0.98] w-full sm:w-auto"
                  >
                    <span className="text-lg">💡</span>
                    <span>{showHints ? "Hide Learning Hints" : "Show Learning Hints"}</span>
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
                          Learning Hints
                        </h3>
                      </div>
                      {translationLang === 'off' && (
                        <p className="text-[13px] sm:text-[14px] font-medium mb-4 text-[var(--muted-text)]/80 leading-relaxed">
                          Learning hints: Understanding these concepts helps you answer correctly
                        </p>
                      )}
                      {translationLang === 'ar' && (
                        <p className="text-[13px] sm:text-[14px] font-medium mb-4 text-[var(--muted-text)]/80 leading-[1.8] tracking-wide" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                          نصائح تعليمية: فهم هذه الكلمات يساعدك في الإجابة الصحيحة
                        </p>
                      )}
                      {translationLang === 'ur' && (
                        <p className="text-[13px] sm:text-[14px] font-medium mb-4 text-[var(--muted-text)]/80 leading-[1.8] tracking-wide" dir="rtl">
                          تعلیمی اشارات: ان الفاظ کو سمجھنا آپ کو صحیح جواب دینے میں مدد کرتا ہے
                        </p>
                      )}
                      <div className="space-y-3">
                        {validHints.map((keyword, index) => {
                          const urduTranslation = getKeywordUrduTranslation(keyword.term);
                          // Get English text - prefer explainEn, fallback to explainAr if it's English
                          const englishText = keyword.explainEn || 
                            (keyword.explainAr && /^[A-Z]/.test(keyword.explainAr.trim()) && 
                             /[a-zA-Z]/.test(keyword.explainAr) && 
                             !/[\u0600-\u06FF]/.test(keyword.explainAr) ? keyword.explainAr : null);
                          
                          return (
                            <div
                              key={index}
                              className="bg-gradient-to-br from-teal-50/80 via-white to-cyan-50/50 border border-teal-200/60 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-teal-300/80"
                            >
                              <div className="flex items-start gap-3 mb-2">
                                <span className="text-teal-700 font-bold text-sm flex-shrink-0 mt-0.5">{keyword.term}</span>
                                {translationLang === 'ar' && (
                                  <span className="text-[var(--muted-text)]/70 text-sm" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1', lineHeight: '1.8' }}>{keyword.ar}</span>
                                )}
                                {translationLang === 'ur' && urduTranslation && (
                                  <span className="text-[var(--muted-text)]/70 text-sm" dir="rtl" style={{ lineHeight: '1.8' }}>{urduTranslation.ur}</span>
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
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={cn(
                    "px-6 py-3 rounded-xl text-sm border border-slate-300 bg-white hover:bg-gradient-to-br hover:from-slate-50 hover:to-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] font-semibold text-slate-800",
                    currentQuestionIndex === 0 && "opacity-50 cursor-not-allowed hover:translate-y-0"
                  )}
                >
                  ← Previous
                </button>
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-xl text-sm border border-slate-300 bg-white hover:bg-gradient-to-br hover:from-slate-50 hover:to-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] font-semibold text-slate-800"
                >
                  Restart
                </button>
              </div>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === topicQuestions.length - 1 || selectedAnswerIndex === null || showPaywall}
                className={cn(
                  "px-6 py-3 rounded-xl text-sm bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] font-semibold",
                  (currentQuestionIndex === topicQuestions.length - 1 || selectedAnswerIndex === null || showPaywall) && "opacity-50 cursor-not-allowed hover:translate-y-0"
                )}
              >
                Next →
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-8 sm:p-10 mt-4 text-center text-slate-600 shadow-xl">
            <p className="text-lg font-medium">Please select a topic to start practicing.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

