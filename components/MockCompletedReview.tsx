'use client';

import { useState } from 'react';
import { PracticeExplanationHint } from '@/components/PracticeLearningAids';
import PracticeKeywordControl from '@/components/PracticeKeywordControl';
import { isLtrTranslationLang, type TranslationLang } from '@/lib/i18n/languages';
import { mockCopy, mockDir } from '@/lib/mock/copy';
import { mockOptionTranslation, mockPromptTranslation } from '@/lib/mock/display';
import {
  formatMockClock,
  moveReviewIndex,
  reviewPosition,
  type MockAnswerView,
  type MockTestResult,
} from '@/lib/mock/exam';
import type { TranslationData } from '@/lib/translations';
import { cn } from '@/lib/utils';

function AnswerFace({
  answer,
  questionId,
  topic,
  lang,
  localeData,
}: {
  answer: MockAnswerView;
  questionId: string;
  topic: string;
  lang: TranslationLang;
  localeData: TranslationData | null;
}) {
  const translation = mockOptionTranslation(answer, { id: questionId, topic }, lang, localeData);
  return (
    <div className="mt-1">
      {answer.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={answer.image} alt="" className="mb-2 max-h-28 w-auto max-w-full object-contain" />
      ) : null}
      {answer.en ? (
        <p dir="ltr" lang="en" className="font-semibold text-[#102D4E]">
          {answer.en}
        </p>
      ) : null}
      {translation ? (
        <p
          dir={isLtrTranslationLang(lang) ? 'ltr' : 'rtl'}
          lang={lang === 'off' ? undefined : lang}
          className="mt-1 text-[var(--text-secondary)]"
        >
          {translation}
        </p>
      ) : null}
    </div>
  );
}

export default function MockCompletedReview({
  result,
  lang,
  localeData,
  onNewTest,
  onDashboard,
}: {
  result: MockTestResult;
  lang: TranslationLang;
  localeData: TranslationData | null;
  onNewTest: () => void;
  onDashboard: () => void;
}) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const dir = mockDir(lang);
  const aidLanguage = lang === 'ar' ? 'ar' : 'en';
  const motivation =
    result.reviews.length === 0
      ? mockCopy(lang, 'perfectMotivation')
      : result.passed
        ? mockCopy(lang, 'passMotivation')
        : mockCopy(lang, 'failMotivation');

  if (reviewOpen && result.reviews.length > 0) {
    const index = Math.min(reviewIndex, result.reviews.length - 1);
    const item = result.reviews[index];
    const position = reviewPosition(result.reviews, index);
    const promptTranslation = mockPromptTranslation(
      {
        id: item.questionId,
        topic: item.topic,
        promptEn: item.promptEn,
        promptAr: item.promptAr,
        promptExtra: item.promptExtra,
      },
      lang,
      localeData
    );
    return (
      <article
        data-testid="mock-review"
        className="w-full min-w-0 overflow-hidden rounded-[22px] border border-[#E6EDF5] bg-white shadow-[0_12px_28px_rgba(16,45,78,0.06)]"
      >
        <header className="bg-[#102D4E] px-4 py-4 text-white sm:px-6">
          <p className="text-sm font-semibold" dir={dir} data-testid="mock-review-position">
            {position
              ? mockCopy(lang, position.kind === 'unanswered' ? 'unansweredPosition' : 'incorrectPosition', {
                  current: position.current,
                  total: position.total,
                })
              : null}
          </p>
        </header>
        <div className="px-4 py-5 sm:px-7">
          <p
            className={cn(
              'mb-4 inline-flex rounded-full px-3 py-1 text-xs font-bold',
              item.outcome === 'unanswered'
                ? 'bg-[#E7F4F9] text-[#168CBA]'
                : 'bg-[#fdecee] text-[#d71920]'
            )}
            dir={dir}
          >
            {item.outcome === 'unanswered' ? mockCopy(lang, 'unanswered') : mockCopy(lang, 'incorrectLabel')}
          </p>
          {item.image ? (
            <div className="mb-4 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="Question illustration" className="max-h-40 w-auto object-contain" />
            </div>
          ) : null}
          <div dir="ltr" lang="en">
            <p className="text-base font-bold leading-relaxed text-[#102D4E] sm:text-lg">{item.promptEn}</p>
          </div>
          {promptTranslation ? (
            <p
              dir={isLtrTranslationLang(lang) ? 'ltr' : 'rtl'}
              lang={lang === 'off' ? undefined : lang}
              className="mt-3 text-[var(--text-secondary)] leading-relaxed"
            >
              {promptTranslation}
            </p>
          ) : null}

          <section className="mt-5 rounded-2xl border border-[#E6EDF5] bg-[#F7F9FC] p-4 sm:p-5">
            <div dir={dir}>
              <h3 className="text-sm font-bold text-[#102D4E]">{mockCopy(lang, 'yourAnswer')}</h3>
              {item.selected ? (
                <AnswerFace
                  answer={item.selected}
                  questionId={item.questionId}
                  topic={item.topic}
                  lang={lang}
                  localeData={localeData}
                />
              ) : (
                <p className="mt-1 font-semibold text-[#168CBA]">{mockCopy(lang, 'unanswered')}</p>
              )}
            </div>
            <div dir={dir} className="mt-4 border-t border-[#E6EDF5] pt-4">
              <h3 className="text-sm font-bold text-[#19a58c]">{mockCopy(lang, 'correctAnswer')}</h3>
              <AnswerFace
                answer={item.correct}
                questionId={item.questionId}
                topic={item.topic}
                lang={lang}
                localeData={localeData}
              />
            </div>
            <div dir={dir} className="mt-4 border-t border-[#E6EDF5] pt-4">
              <h3 className="text-sm font-bold text-[#102D4E]">{mockCopy(lang, 'dvsaExplanation')}</h3>
              <div data-testid="mock-dvsa-explanation" className="mt-2 space-y-2">
                {item.explanationEn ? (
                  <p dir="ltr" lang="en" className="whitespace-pre-wrap leading-relaxed text-[#102D4E]">
                    {item.explanationEn}
                  </p>
                ) : (
                  <p className="text-[var(--text-secondary)]">{mockCopy(lang, 'explanationMissing')}</p>
                )}
                {lang === 'ar' && item.explanationAr ? (
                  <p dir="rtl" lang="ar" className="whitespace-pre-wrap leading-relaxed text-[var(--text-secondary)]">
                    {item.explanationAr}
                  </p>
                ) : null}
                {lang !== 'off' && lang !== 'ar' && item.explanationExtra?.[lang] ? (
                  <p
                    dir={isLtrTranslationLang(lang) ? 'ltr' : 'rtl'}
                    lang={lang}
                    className="whitespace-pre-wrap leading-relaxed text-[var(--text-secondary)]"
                  >
                    {item.explanationExtra[lang]}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
              <PracticeExplanationHint questionId={item.questionId} language={aidLanguage} />
            </div>
            <PracticeKeywordControl
              questionId={item.questionId}
              language={aidLanguage}
              sectionLabel={mockCopy(lang, 'keywordSection')}
            />
          </section>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap" dir={dir}>
            <button
              type="button"
              onClick={() => setReviewIndex((current) => moveReviewIndex(current, -1, result.reviews.length))}
              disabled={index === 0}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#D5DEE8] bg-white px-4 text-sm font-semibold text-[#102D4E] disabled:opacity-40"
            >
              {mockCopy(lang, 'previous')}
            </button>
            <button
              type="button"
              onClick={() => setReviewIndex((current) => moveReviewIndex(current, 1, result.reviews.length))}
              disabled={index === result.reviews.length - 1}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#D5DEE8] bg-white px-4 text-sm font-semibold text-[#102D4E] disabled:opacity-40"
            >
              {mockCopy(lang, 'next')}
            </button>
            <button
              type="button"
              onClick={() => setReviewOpen(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#102D4E] px-4 text-sm font-semibold text-white sm:ml-auto"
            >
              {mockCopy(lang, 'backToResults')}
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      data-testid="mock-result"
      className="w-full min-w-0 overflow-hidden rounded-[22px] border border-[#E6EDF5] bg-white shadow-[0_12px_28px_rgba(16,45,78,0.06)]"
    >
      <header className="bg-[#102D4E] px-4 py-5 text-white sm:px-7">
        <p className="text-sm font-semibold text-white/80" dir={dir}>
          {result.score} / {result.total}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="text-4xl font-bold tabular-nums" data-testid="mock-result-score">
            {result.score}
            <span className="text-2xl font-semibold text-white/70">/{result.total}</span>
          </p>
          <span
            data-testid="mock-pass-mark"
            className={cn(
              'rounded-full px-3 py-1 text-sm font-bold',
              result.passed ? 'bg-[#e5f7f3] text-[#0d7a64]' : 'bg-[#fdecee] text-[#d71920]'
            )}
          >
            {result.passed ? mockCopy(lang, 'pass') : mockCopy(lang, 'fail')}
          </span>
        </div>
      </header>
      <div className="px-4 py-5 sm:px-7" dir={dir}>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#e5f7f3] px-3 py-3">
            <dt className="text-xs font-semibold text-[#0d7a64]">{mockCopy(lang, 'correctCount')}</dt>
            <dd className="text-2xl font-bold text-[#0d7a64]">{result.correct}</dd>
          </div>
          <div className="rounded-2xl bg-[#fdecee] px-3 py-3">
            <dt className="text-xs font-semibold text-[#d71920]">{mockCopy(lang, 'incorrectCount')}</dt>
            <dd className="text-2xl font-bold text-[#d71920]">{result.incorrect}</dd>
          </div>
          {result.unanswered > 0 ? (
            <div className="rounded-2xl bg-[#E7F4F9] px-3 py-3">
              <dt className="text-xs font-semibold text-[#168CBA]">{mockCopy(lang, 'unansweredCount')}</dt>
              <dd className="text-2xl font-bold text-[#168CBA]">{result.unanswered}</dd>
            </div>
          ) : null}
          <div className="rounded-2xl bg-[#F7F9FC] px-3 py-3">
            <dt className="text-xs font-semibold text-[#102D4E]">{mockCopy(lang, 'accuracy')}</dt>
            <dd className="text-2xl font-bold text-[#102D4E]">{result.percent}%</dd>
          </div>
          <div className="rounded-2xl bg-[#F7F9FC] px-3 py-3">
            <dt className="text-xs font-semibold text-[#102D4E]">{mockCopy(lang, 'timeTaken')}</dt>
            <dd className="text-2xl font-bold tabular-nums text-[#102D4E]">
              {formatMockClock(result.timeTakenSec)}
            </dd>
          </div>
        </dl>

        <p className="mt-5 text-base font-semibold leading-relaxed text-[#102D4E]">{motivation}</p>
        {result.reviews.length === 0 ? (
          <p className="mt-2 text-sm font-medium text-[#0d7a64]">{mockCopy(lang, 'congratsBody')}</p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{mockCopy(lang, 'hazardNote')}</p>

        <div className="mt-6 flex flex-col gap-2">
          {result.reviews.length > 0 ? (
            <button
              type="button"
              data-testid="mock-review-open"
              onClick={() => {
                setReviewIndex(0);
                setReviewOpen(true);
              }}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#168CBA] px-4 text-sm font-bold text-white"
            >
              {mockCopy(lang, 'reviewIncorrect', { n: result.reviews.length })}
            </button>
          ) : (
            <p className="text-base font-bold text-[#0d7a64]">{mockCopy(lang, 'congratsTitle')}</p>
          )}
          <button
            type="button"
            onClick={onNewTest}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#102D4E] px-4 text-sm font-bold text-white"
          >
            {mockCopy(lang, 'newMock')}
          </button>
          <button
            type="button"
            onClick={onDashboard}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#D5DEE8] bg-white px-4 text-sm font-semibold text-[#102D4E]"
          >
            {mockCopy(lang, 'backToDashboard')}
          </button>
        </div>
      </div>
    </article>
  );
}
