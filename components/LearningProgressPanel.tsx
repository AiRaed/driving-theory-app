'use client';

import { cn } from '@/lib/utils';
import { formatCompletionPercent } from '@/lib/progress/calculate';
import { fillProgress, progressCopy, progressDir } from '@/lib/progress/copy';
import type { TopicProgress } from '@/lib/progress/types';

export function LearningProgressBar({
  progress,
  label,
}: {
  progress: TopicProgress;
  label: string;
}) {
  const correctWidth = progress.total > 0 ? (progress.correct / progress.total) * 100 : 0;
  const incorrectWidth = progress.total > 0 ? (progress.incorrect / progress.total) * 100 : 0;
  return (
    <div
      className="flex h-2 w-full overflow-hidden rounded-full bg-[#E6EDF5]"
      role="img"
      aria-label={label}
    >
      <div className="h-full bg-[#1B8A4A]" style={{ width: `${correctWidth}%` }} />
      <div className="h-full bg-[#D71920]" style={{ width: `${incorrectWidth}%` }} />
    </div>
  );
}

export function LearningProgressCounts({
  progress,
  lang,
  showRemaining = false,
  showCompleted = false,
}: {
  progress: TopicProgress;
  lang: string;
  showRemaining?: boolean;
  showCompleted?: boolean;
}) {
  const copy = progressCopy(lang);
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold leading-tight sm:text-xs">
      <span className="text-[#1B8A4A]">
        {copy.correct} {progress.correct}
      </span>
      <span className="text-[#D71920]">
        {copy.incorrect} {progress.incorrect}
      </span>
      {showRemaining ? (
        <span className="text-[#4E5D73]">
          {copy.remaining} {progress.unanswered}
        </span>
      ) : null}
      {showCompleted ? (
        <span className="text-[#102D4E]">
          {fillProgress(copy.completedOf, {
            answered: progress.answered,
            total: progress.total,
          })}
        </span>
      ) : null}
    </div>
  );
}

export function LearningProgressPanel({
  progress,
  lang,
  compact = false,
  showRemaining = false,
  showCompleted = true,
  title,
  saveError = false,
  status = 'ready',
  bare = false,
}: {
  progress: TopicProgress;
  lang: string;
  compact?: boolean;
  showRemaining?: boolean;
  showCompleted?: boolean;
  title?: string;
  saveError?: boolean;
  status?: 'loading' | 'ready' | 'error';
  bare?: boolean;
}) {
  const copy = progressCopy(lang);
  const dir = progressDir(lang);
  const visible = status === 'ready' ? progress : emptyTrack;
  const shownPercent = status === 'ready' ? formatCompletionPercent(progress.completionPercent) : '0';
  const barLabel = `${copy.completion} ${shownPercent}%`;

  return (
    <section
      dir={dir}
      lang={lang === 'ar' ? 'ar' : 'en'}
      className={cn(
        bare
          ? 'bg-transparent'
          : 'rounded-2xl border border-[#E6EDF5] bg-white shadow-[0_10px_30px_rgba(16,45,78,0.05)]',
        compact ? 'px-0 py-0' : bare ? 'px-0 py-0' : 'px-4 py-4 sm:px-5'
      )}
      aria-label={title || copy.title}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className={cn('font-bold text-[#102D4E]', compact ? 'text-sm' : 'text-base sm:text-lg')}>
          {title || copy.title}
        </h2>
        <p className={cn('shrink-0 font-bold text-[#168CBA]', compact ? 'text-sm' : 'text-lg')}>
          {status === 'ready' ? `${formatCompletionPercent(progress.completionPercent)}%` : '—'}
        </p>
      </div>
      <div className="mt-2">
        <LearningProgressBar progress={visible} label={barLabel} />
      </div>
      {status === 'loading' ? (
        <p className="mt-2 text-xs text-[#4E5D73]">{copy.loading}</p>
      ) : status === 'error' ? (
        <p className="mt-2 text-xs text-[#D71920]">{copy.unavailable}</p>
      ) : (
        <div className="mt-2">
          <LearningProgressCounts
            progress={progress}
            lang={lang}
            showRemaining={showRemaining}
            showCompleted={showCompleted}
          />
        </div>
      )}
      {saveError ? <p className="mt-2 text-xs text-[#D71920]">{copy.saveFailed}</p> : null}
    </section>
  );
}

const emptyTrack: TopicProgress = {
  total: 0,
  answered: 0,
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  completionPercent: 0,
  accuracyPercent: 0,
};

export default LearningProgressPanel;

export function TopicProgressBlock({
  progress,
  lang,
}: {
  progress: TopicProgress;
  lang: string;
}) {
  const copy = progressCopy(lang);
  const label = `${copy.completion} ${formatCompletionPercent(progress.completionPercent)}%`;
  return (
    <div className="mt-1.5 w-full min-w-0" dir={progressDir(lang)} lang={lang === 'ar' ? 'ar' : 'en'}>
      <span className="mb-1 flex items-center justify-between gap-2 text-[11px] font-bold leading-tight">
        <span className="text-[#168CBA]">{label}</span>
        <span className="text-[#102D4E]">
          {fillProgress(copy.completedOf, { answered: progress.answered, total: progress.total })}
        </span>
      </span>
      <LearningProgressBar progress={progress} label={label} />
      <div className="mt-1">
        <LearningProgressCounts progress={progress} lang={lang} showRemaining />
      </div>
    </div>
  );
}
