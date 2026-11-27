"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AnswerOptionContent from "@/components/AnswerOptionContent";
import ContentMaintenanceNotice from "@/components/ContentMaintenanceNotice";
import DisclaimerModal from "@/components/DisclaimerModal";
import DvsaLicenceNotice from "@/components/DvsaLicenceNotice";
import MockCompletedReview from "@/components/MockCompletedReview";
import PaywallOverlay from "@/components/PaywallOverlay";
import TTSButton from "@/components/TTSButton";
import { decideMockAccess } from "@/lib/access/entitlement";
import {
  ACCOUNT_LOCAL_KEYS,
  ACCOUNT_SESSION_KEYS,
  readAccountJson,
  removeAccountKey,
  writeAccountJson,
} from "@/lib/account/clientAccountStorage";
import {
  analyticsLanguage,
  clearClientSessionId,
  getOrCreateClientSessionId,
  trackEvent,
  trackSessionComplete,
  trackSessionStart,
} from "@/lib/analytics/client";
import { useContentMaintenance } from "@/lib/hooks/useContentMaintenance";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { isLtrTranslationLang } from "@/lib/i18n/languages";
import { mockCopy, mockDir } from "@/lib/mock/copy";
import { mockOptionTranslation, mockPromptTranslation } from "@/lib/mock/display";
import {
  MOCK_DURATION_SEC,
  MOCK_QUESTION_COUNT,
  MOCK_SESSION_VERSION,
  applySelection,
  canSubmit,
  formatMockClock,
  needsUnansweredConfirmation,
  parseActiveExam,
  parseMockResult,
  parseStoredMockSession,
  remainingFromEndsAt,
  shouldAutoSubmit,
  timeTakenSeconds,
  unansweredCount,
  type ActiveMockQuestion,
  type MockTestResult,
  type StoredMockSession,
} from "@/lib/mock/exam";
import { useAccess } from "@/lib/providers/AccessProvider";
import { createClient } from "@/lib/supabase/client";
import {
  loadBengaliTranslations,
  loadPersianTranslations,
  loadPolishTranslations,
  loadPortugueseTranslations,
  loadRomanianTranslations,
  loadUrduTranslations,
  type TranslationData,
} from "@/lib/translations";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

const MOCK_PAGE_SHELL = "relative min-h-screen bg-[#F7F9FC] pb-28 md:pb-10";
const MOCK_ANALYTICS_SESSION_KEY = ACCOUNT_SESSION_KEYS.mockAnalytics;

function MockWave() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-14 w-full sm:h-16" viewBox="0 0 1200 80" preserveAspectRatio="none">
      <path d="M0 36c90 28 170-22 280-4 100 16 150 30 250 8 110-24 170-34 270-6 90 26 150 6 230-8 60-10 110 0 170 12v42H0Z" fill="rgba(22,140,186,0.55)" />
      <path d="M0 56c130 16 210-18 340 0 110 14 170 16 270 0 120-18 190-6 290 8 80 10 150 2 300-6v22H0Z" fill="rgba(22,140,186,0.28)" />
    </svg>
  );
}

/**
 * Exam integrity: no hints, vocab cards, or tappable keywords during an active Mock Test.
 * Official marking is returned only after the test is submitted.
 */
export default function MockTestPage() {
  const router = useRouter();
  const supabase = createClient();
  const { loading, statusConfirmed, paid } = useAccess();
  const { loading: maintenanceLoading, enabled: contentMaintenance } = useContentMaintenance();
  const { lang: translationLang, t, isRtl } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<ActiveMockQuestion[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [result, setResult] = useState<MockTestResult | null>(null);
  const [startError, setStartError] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [localeData, setLocaleData] = useState<TranslationData | null>(null);
  const generation = useRef(0);
  const resultRef = useRef<MockTestResult | null>(null);
  const submittingRef = useRef(false);
  const autoSubmittedRef = useRef(false);
  const sessionRef = useRef<StoredMockSession | null>(null);
  const userIdRef = useRef<string | null>(null);
  const analyticsRef = useRef<string | null>(null);
  const startedTrackedRef = useRef(false);
  const completedTrackedRef = useRef(false);
  userIdRef.current = user?.id ?? null;
  resultRef.current = result;

  const mockAccess = decideMockAccess({
    paid: paid === true,
    statusConfirmed,
  });
  const showPaywall = !loading && mockAccess.showPaywall;
  const remaining = endsAt == null ? MOCK_DURATION_SEC : remainingFromEndsAt(endsAt, now);
  const liveRef = useRef({
    attemptId,
    questions,
    selections,
    endsAt,
    currentIndex,
    result,
  });
  liveRef.current = { attemptId, questions, selections, endsAt, currentIndex, result };

  useEffect(() => {
    const applyUser = (nextUser: User | null) => {
      setUser((prev) => {
        if (prev?.id && nextUser?.id && prev.id !== nextUser.id) {
          generation.current += 1;
          setQuestions([]);
          setAttemptId(null);
          setSelections({});
          setCurrentIndex(0);
          setEndsAt(null);
          setResult(null);
          resultRef.current = null;
          autoSubmittedRef.current = false;
          startedTrackedRef.current = false;
          completedTrackedRef.current = false;
          clearClientSessionId(MOCK_ANALYTICS_SESSION_KEY);
        }
        return nextUser;
      });
      if (!nextUser) router.push("/auth");
    };
    void supabase.auth.getUser().then(({ data: { user: authUser } }) => applyUser(authUser));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [router, supabase]);

  useEffect(() => {
    let cancelled = false;
    const load =
      translationLang === "ur"
        ? loadUrduTranslations
        : translationLang === "ro"
          ? loadRomanianTranslations
          : translationLang === "pl"
            ? loadPolishTranslations
            : translationLang === "pt"
              ? loadPortugueseTranslations
              : translationLang === "bn"
                ? loadBengaliTranslations
                : translationLang === "fa"
                  ? loadPersianTranslations
                  : null;
    if (!load) {
      setLocaleData(null);
      return;
    }
    void load().then((data) => {
      if (!cancelled) setLocaleData(data);
    });
    return () => {
      cancelled = true;
    };
  }, [translationLang]);

  useEffect(() => {
    if (!user?.id || questions.length === 0 || !attemptId || endsAt == null) {
      sessionRef.current = null;
      return;
    }
    const session: StoredMockSession = {
      version: MOCK_SESSION_VERSION,
      attemptId,
      questions,
      selections,
      currentIndex,
      endsAt,
      result,
    };
    sessionRef.current = session;
    writeAccountJson(user.id, ACCOUNT_LOCAL_KEYS.mockSession, session);
  }, [user?.id, questions, selections, currentIndex, endsAt, result, attemptId]);

  useEffect(() => {
    return () => {
      const userId = userIdRef.current;
      const session = sessionRef.current;
      if (!userId || !session) return;
      writeAccountJson(userId, ACCOUNT_LOCAL_KEYS.mockSession, session);
    };
  }, []);

  useEffect(() => {
    if (!endsAt || result) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [endsAt, result]);

  async function submitCurrent(reason: "manual" | "timer") {
    const snapshot = liveRef.current;
    if (!canSubmit({ submitted: !!resultRef.current, submitting: submittingRef.current })) return;
    if (!snapshot.attemptId || snapshot.questions.length !== MOCK_QUESTION_COUNT || snapshot.endsAt == null) {
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(false);
    setConfirmOpen(false);
    const elapsedSec = timeTakenSeconds(
      MOCK_DURATION_SEC - remainingFromEndsAt(snapshot.endsAt)
    );
    try {
      const response = await fetch("/api/mock-test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: snapshot.attemptId,
          questionIds: snapshot.questions.map((question) => question.id),
          selections: snapshot.questions.reduce<Record<string, number | null>>((all, question) => {
            all[question.id] = snapshot.selections[question.id] ?? null;
            return all;
          }, {}),
          elapsedSec,
        }),
      });
      const payload = await response.json().catch(() => null);
      const parsed = response.ok ? parseMockResult(payload) : null;
      if (!parsed || parsed.attemptId !== snapshot.attemptId) {
        throw new Error("submit");
      }
      resultRef.current = parsed;
      setResult(parsed);
      if (!completedTrackedRef.current) {
        completedTrackedRef.current = true;
        const sid = analyticsRef.current || getOrCreateClientSessionId(MOCK_ANALYTICS_SESSION_KEY);
        trackSessionComplete({
          mode: "mock",
          client_session_id: sid,
          questions_attempted: parsed.correct + parsed.incorrect,
          correct_answers: parsed.correct,
          score: parsed.score,
        });
        void trackEvent("mock_test_completed", {
          score: parsed.score,
          total: parsed.total,
          language: analyticsLanguage(translationLang),
        });
      }
    } catch {
      setSubmitError(true);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (!endsAt || resultRef.current || autoSubmittedRef.current) return;
    if (!shouldAutoSubmit(remainingFromEndsAt(endsAt, now))) return;
    autoSubmittedRef.current = true;
    void submitCurrent("timer");
    // submitCurrent reads the latest snapshot from liveRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt, now]);

  async function loadExam(userId: string, forceNew: boolean, token: number) {
    if (!forceNew) {
      const saved = parseStoredMockSession(readAccountJson(userId, ACCOUNT_LOCAL_KEYS.mockSession));
      if (saved && token === generation.current) {
        resultRef.current = saved.result;
        setAttemptId(saved.attemptId);
        setQuestions(saved.questions);
        setSelections(saved.selections);
        setCurrentIndex(saved.currentIndex);
        setEndsAt(saved.endsAt);
        setResult(saved.result);
        setStartError(false);
        startedTrackedRef.current = true;
        completedTrackedRef.current = !!saved.result;
        liveRef.current = {
          attemptId: saved.attemptId,
          questions: saved.questions,
          selections: saved.selections,
          endsAt: saved.endsAt,
          currentIndex: saved.currentIndex,
          result: saved.result,
        };
        if (!saved.result && shouldAutoSubmit(remainingFromEndsAt(saved.endsAt))) {
          autoSubmittedRef.current = true;
          void submitCurrent("timer");
        }
        return;
      }
    }

    setStartError(false);
    removeAccountKey(userId, ACCOUNT_LOCAL_KEYS.mockSession);
    resultRef.current = null;
    autoSubmittedRef.current = false;
    setQuestions([]);
    setSelections({});
    setCurrentIndex(0);
    setEndsAt(null);
    setAttemptId(null);
    setResult(null);
    try {
      const response = await fetch("/api/mock-test/start", { method: "POST" });
      const payload = await response.json().catch(() => null);
      if (token !== generation.current) return;
      if (response.status === 401) {
        router.push("/auth");
        return;
      }
      if (response.status === 403) {
        setStartError(true);
        return;
      }
      const exam = response.ok ? parseActiveExam(payload) : null;
      if (!exam) {
        setStartError(true);
        return;
      }
      const nextEndsAt = Date.now() + MOCK_DURATION_SEC * 1000;
      setAttemptId(exam.attemptId);
      setQuestions(exam.questions);
      setSelections({});
      setCurrentIndex(0);
      setEndsAt(nextEndsAt);
      setResult(null);
      autoSubmittedRef.current = false;
      completedTrackedRef.current = false;
      if (!startedTrackedRef.current || forceNew) {
        clearClientSessionId(MOCK_ANALYTICS_SESSION_KEY);
        const sid = getOrCreateClientSessionId(MOCK_ANALYTICS_SESSION_KEY);
        analyticsRef.current = sid;
        trackSessionStart({
          mode: "mock",
          language: analyticsLanguage(translationLang),
          client_session_id: sid,
        });
        void trackEvent("mock_test_started", {
          question_count: exam.questions.length,
          language: analyticsLanguage(translationLang),
        });
        startedTrackedRef.current = true;
      }
    } catch {
      if (token === generation.current) setStartError(true);
    }
  }

  useEffect(() => {
    if (!user?.id || !mockAccess.allow || contentMaintenance || maintenanceLoading) return;
    const token = ++generation.current;
    void loadExam(user.id, false, token);
    // loadExam closes over the latest access gate listed below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, mockAccess.allow, contentMaintenance, maintenanceLoading]);

  function requestFinish() {
    if (!canSubmit({ submitted: !!result, submitting })) return;
    if (shouldAutoSubmit(remaining)) {
      autoSubmittedRef.current = true;
      void submitCurrent("timer");
      return;
    }
    const missing = unansweredCount(
      questions.map((question) => question.id),
      selections
    );
    if (needsUnansweredConfirmation(missing, "manual")) {
      setConfirmOpen(true);
      return;
    }
    void submitCurrent("manual");
  }

  if (maintenanceLoading) {
    return (
      <div className={MOCK_PAGE_SHELL}>
        <div className="mx-auto max-w-[1000px] px-4 py-6 text-center font-medium text-[var(--text-secondary)]">
          {t("loading")}
        </div>
      </div>
    );
  }

  if (contentMaintenance) return <ContentMaintenanceNotice />;

  if (!user) {
    return (
      <div className={MOCK_PAGE_SHELL}>
        <div className="mx-auto max-w-[1000px] px-4 py-6 text-center font-medium text-[var(--text-secondary)]">
          {t("loading")}
        </div>
      </div>
    );
  }

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
        <div className="mx-auto max-w-[1000px] px-4 py-6 text-center font-medium text-[var(--text-secondary)]">
          {t("loading")}
        </div>
      </div>
    );
  }

  if (showPaywall || !mockAccess.allow) {
    return (
      <div className={`${MOCK_PAGE_SHELL} relative`}>
        <PaywallOverlay />
        <div className="pointer-events-none blur-sm opacity-50">
          <div className="mx-auto max-w-5xl px-4 py-6 text-center font-medium text-[var(--text-secondary)]">
            {t("mockRequiresPaid")}
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div dir="ltr" className={MOCK_PAGE_SHELL}>
        <div className="mx-auto w-full min-w-0 max-w-[1000px] px-4 py-4 sm:px-6 sm:py-6">
          <MockCompletedReview
            result={result}
            lang={translationLang}
            localeData={localeData}
            onNewTest={() => {
              if (!user?.id) return;
              startedTrackedRef.current = false;
              const token = ++generation.current;
              void loadExam(user.id, true, token);
            }}
            onDashboard={() => router.push("/dashboard")}
          />
          <div className="mx-auto mt-5 hidden max-w-4xl sm:block">
            <DvsaLicenceNotice lang={translationLang} showDistinction />
          </div>
          <DisclaimerModal lang={translationLang} />
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={MOCK_PAGE_SHELL}>
        <div className="mx-auto max-w-[1000px] px-4 py-6 text-center">
          <p className="font-medium text-[var(--text-secondary)]">
            {startError ? mockCopy(translationLang, "startFailed") : t("loadingQuestions")}
          </p>
          {startError ? (
            <button
              type="button"
              className="mt-4 inline-flex min-h-12 items-center rounded-xl bg-[#102D4E] px-4 text-sm font-bold text-white"
              onClick={() => {
                if (!user?.id) return;
                const token = ++generation.current;
                void loadExam(user.id, true, token);
              }}
            >
              {mockCopy(translationLang, "retry")}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedSource = selections[currentQuestion.id];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const promptTranslation = mockPromptTranslation(currentQuestion, translationLang, localeData);
  const missing = unansweredCount(
    questions.map((question) => question.id),
    selections
  );
  const chromeDir = isRtl ? "rtl" : "ltr";

  return (
    <div dir="ltr" className={MOCK_PAGE_SHELL}>
      <div className="mx-auto w-full min-w-0 max-w-[1000px] px-4 py-4 sm:px-6 sm:py-6">
        <article
          data-testid="mock-active"
          className="w-full min-w-0 overflow-hidden rounded-[22px] border border-[#E6EDF5] bg-white shadow-[0_12px_28px_rgba(16,45,78,0.06)]"
        >
          <header className="relative overflow-hidden bg-[#102D4E] px-4 pb-6 pt-3.5 text-white sm:px-6 sm:pb-7 sm:pt-5">
            <MockWave />
            <div className="relative z-[1] flex flex-wrap items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 sm:h-11 sm:w-11">
                <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="3.5" width="12" height="17" rx="2" />
                  <path d="M9 8h6M9 12h6M9 16h3" />
                </svg>
              </span>
              <div className="min-w-[9rem] flex-1" dir={chromeDir}>
                <h2 className="text-base font-bold leading-tight sm:text-xl">{t("mockTest")}</h2>
                <p className="text-xs font-semibold text-white/90 sm:text-sm">
                  {t("questionOf", { current: currentIndex + 1, total: questions.length })}
                </p>
              </div>
              <p
                data-testid="mock-timer"
                className={cn(
                  "shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold tabular-nums",
                  remaining <= 60 && "text-[#ffd6d6]"
                )}
                aria-live="polite"
                aria-label={mockCopy(translationLang, "timeRemaining")}
              >
                {formatMockClock(remaining)}
              </p>
            </div>
          </header>

          <div className="px-4 py-4 sm:px-7 sm:py-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E7F4F9]" aria-hidden>
                <div className="h-full rounded-full bg-[#168CBA]" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="shrink-0 text-xs font-semibold text-[#168CBA] sm:text-sm">
                {t("percentComplete", { percent: progressPercent })}
              </span>
            </div>

            {currentQuestion.image ? (
              <div
                className={cn(
                  "flex justify-center",
                  currentQuestion.topic === "road-signs"
                    ? "mb-3 h-[160px] w-full items-center overflow-hidden md:mb-3 md:h-auto"
                    : "mb-3"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentQuestion.image}
                  alt="Question illustration"
                  className={cn(
                    "w-auto object-contain",
                    currentQuestion.topic === "road-signs" ? "max-h-full md:max-h-40" : "max-h-40"
                  )}
                />
              </div>
            ) : null}

            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 dir="ltr" lang="en" className="text-base font-bold leading-relaxed text-[#102D4E] sm:text-lg">
                  {currentQuestion.promptEn}
                </h1>
                {promptTranslation ? (
                  <p
                    dir={isLtrTranslationLang(translationLang) ? "ltr" : "rtl"}
                    lang={translationLang === "off" ? undefined : translationLang}
                    className="mt-2 leading-relaxed text-[var(--text-secondary)]"
                  >
                    {promptTranslation}
                  </p>
                ) : null}
              </div>
              <span className="practice-voice shrink-0">
                <TTSButton
                  text={currentQuestion.promptEn}
                  options={currentQuestion.options}
                  className="!h-auto !w-auto gap-2 rounded-full px-2 py-1 text-[#168CBA]"
                />
              </span>
            </div>

            <div role="radiogroup" aria-label={t("mockTest")} className="space-y-3">
              {currentQuestion.options.map((option) => {
                const selected = selectedSource === option.sourceIndex;
                const optionTranslation = mockOptionTranslation(
                  option,
                  currentQuestion,
                  translationLang,
                  localeData
                );
                return (
                  <button
                    key={`${currentQuestion.id}-${option.sourceIndex}`}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    data-testid="mock-option"
                    data-source-index={option.sourceIndex}
                    data-state={selected ? "selected" : undefined}
                    onClick={() => {
                      if (resultRef.current) return;
                      setSelections((current) =>
                        applySelection(current, currentQuestion.id, option.sourceIndex)
                      );
                    }}
                    className={cn(
                      "mock-answer practice-answer lt-option w-full text-left",
                      selected && "border-[#168CBA] bg-[#E7F4F9]"
                    )}
                  >
                    <AnswerOptionContent
                      option={{ en: option.en, image: option.image || undefined }}
                      enClassName="font-semibold text-[#102D4E]"
                    >
                      {optionTranslation ? (
                        <span
                          dir={isLtrTranslationLang(translationLang) ? "ltr" : "rtl"}
                          lang={translationLang === "off" ? undefined : translationLang}
                          className="mt-1 block text-sm text-[var(--text-secondary)]"
                        >
                          {optionTranslation}
                        </span>
                      ) : null}
                    </AnswerOptionContent>
                  </button>
                );
              })}
            </div>

            {submitError ? (
              <p className="mt-4 text-sm font-semibold text-[#d71920]" dir={mockDir(translationLang)}>
                {mockCopy(translationLang, "submitFailed")}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center" dir={chromeDir}>
              <button
                type="button"
                onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                disabled={currentIndex === 0}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#D5DEE8] bg-white px-4 text-sm font-semibold text-[#102D4E] disabled:opacity-40"
              >
                {t("previous")}
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))
                }
                disabled={currentIndex === questions.length - 1}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#168CBA] px-4 text-sm font-bold text-white disabled:opacity-40"
              >
                {t("next")}
              </button>
              <button
                type="button"
                data-testid="mock-finish"
                onClick={requestFinish}
                disabled={submitting}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#102D4E] px-4 text-sm font-bold text-white sm:ml-auto"
              >
                {submitting ? mockCopy(translationLang, "submitting") : mockCopy(translationLang, "finishTest")}
              </button>
            </div>
          </div>
        </article>
        <div className="mx-auto mt-5 hidden max-w-4xl sm:block">
          <DvsaLicenceNotice lang={translationLang} showDistinction />
        </div>
        <DisclaimerModal lang={translationLang} />
      </div>

      {confirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#102D4E]/50 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mock-unanswered-title"
            dir={mockDir(translationLang)}
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
          >
            <h2 id="mock-unanswered-title" className="text-lg font-bold text-[#102D4E]">
              {mockCopy(translationLang, "unansweredTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {mockCopy(translationLang, "unansweredBody", { n: missing })}
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-[#D5DEE8] bg-white px-4 text-sm font-semibold text-[#102D4E]"
                onClick={() => setConfirmOpen(false)}
              >
                {mockCopy(translationLang, "keepGoing")}
              </button>
              <button
                type="button"
                data-testid="mock-confirm-submit"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[#102D4E] px-4 text-sm font-bold text-white"
                onClick={() => void submitCurrent("manual")}
              >
                {mockCopy(translationLang, "submitAnyway")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
