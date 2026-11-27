'use client';

import { useEffect, useRef } from 'react';
import { LearningProgressBar } from '@/components/LearningProgressPanel';
import { formatCompletionPercent } from '@/lib/progress/calculate';
import { fillProgress, progressCopy, progressDir } from '@/lib/progress/copy';
import type { TopicProgress } from '@/lib/progress/types';

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

export default function RestartPracticeModal({
  open,
  lang,
  incorrectCount,
  incorrectState,
  totalCount,
  busy,
  onCancel,
  onRetryIncorrect,
  onRestartAll,
  completed,
}: {
  open: boolean;
  lang: string;
  incorrectCount: number;
  incorrectState: 'ready' | 'loading' | 'unavailable';
  totalCount: number;
  busy: boolean;
  onCancel: () => void;
  onRetryIncorrect: () => void;
  onRestartAll: () => void;
  /** Set when a finished topic is opened from the topic list. */
  completed?: { topicName: string; progress: TopicProgress } | null;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const copy = progressCopy(lang);
  const dir = progressDir(lang);
  const finished = completed ?? null;
  const canRetry = incorrectState === 'ready' && incorrectCount > 0 && !busy;
  const retryCount = incorrectState === 'ready' ? incorrectCount : '…';
  const retryHelp =
    incorrectState === 'unavailable'
      ? copy.unavailable
      : incorrectState === 'loading'
        ? copy.loading
        : incorrectCount > 0
          ? copy.retryIncorrectHelp
          : copy.retryNone;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#102D4E]/45 p-0 sm:items-center sm:p-4"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="restart-practice-title"
        tabIndex={-1}
        dir={dir}
        lang={lang === 'ar' ? 'ar' : 'en'}
        data-testid={finished ? 'completed-topic-modal' : 'restart-practice-modal'}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_18px_40px_rgba(16,45,78,0.18)] outline-none sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="restart-practice-title" className="text-lg font-bold leading-snug text-[#102D4E]">
          {finished ? fillProgress(copy.practiseAgain, { topic: finished.topicName }) : copy.restartTitle}
        </h2>
        {finished ? (
          <div className="mt-4 rounded-xl border border-[#E6EDF5] bg-[#F7F9FC] px-3 py-3">
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold text-[#4E5D73]">{copy.totalQuestions}</dt>
                <dd className="font-bold text-[#102D4E]">{finished.progress.total}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#1B8A4A]">{copy.correct}</dt>
                <dd className="font-bold text-[#1B8A4A]">{finished.progress.correct}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#D71920]">{copy.incorrect}</dt>
                <dd className="font-bold text-[#D71920]">{finished.progress.incorrect}</dd>
              </div>
            </dl>
            <div className="mt-3">
              <LearningProgressBar
                progress={finished.progress}
                label={`${copy.completion} ${formatCompletionPercent(finished.progress.completionPercent)}%`}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-4 space-y-4">
          <div>
            <button
              type="button"
              data-testid="retry-incorrect"
              onClick={onRetryIncorrect}
              disabled={!canRetry}
              className="lt-btn-primary h-auto w-full gap-2 whitespace-normal px-4 py-3 text-sm"
            >
              <RefreshIcon />
              <span>{fillProgress(copy.retryIncorrect, { n: retryCount })}</span>
            </button>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5C6B7A]">{retryHelp}</p>
          </div>

          <div>
            <button
              type="button"
              data-testid="restart-all"
              onClick={onRestartAll}
              disabled={busy}
              className="inline-flex min-h-12 w-full items-center justify-center whitespace-normal rounded-xl border border-[#D5DEE8] bg-white px-4 py-3 text-sm font-semibold text-[#102D4E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {fillProgress(copy.restartAll, { n: totalCount })}
            </button>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5C6B7A]">{copy.restartAllHelp}</p>
          </div>

          <button
            type="button"
            data-testid={finished ? 'completed-topic-cancel' : 'restart-cancel'}
            onClick={onCancel}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold text-[#102D4E]"
          >
            {copy.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
