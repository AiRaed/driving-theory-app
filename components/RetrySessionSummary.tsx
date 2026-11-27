'use client';

import { fillProgress, progressCopy, progressDir } from '@/lib/progress/copy';

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-[#5C6B7A]">{label}</span>
      <span className="font-bold text-[#102D4E]" dir="ltr">
        {value}
      </span>
    </div>
  );
}

export default function RetrySessionSummary({
  lang,
  reviewed,
  corrected,
  remaining,
  totalCount,
  busy,
  onRetryRemaining,
  onRestartAll,
  onBack,
}: {
  lang: string;
  reviewed: number;
  corrected: number;
  remaining: number;
  totalCount: number;
  busy: boolean;
  onRetryRemaining: () => void;
  onRestartAll: () => void;
  onBack: () => void;
}) {
  const copy = progressCopy(lang);
  return (
    <div dir={progressDir(lang)} lang={lang === 'ar' ? 'ar' : 'en'} data-testid="retry-summary">
      <h3 className="text-base font-bold text-[#102D4E]">{copy.retrySessionLabel}</h3>
      <div className="mt-4 space-y-2 rounded-xl border border-[#E6EDF5] bg-[#F7F9FC] p-4">
        <SummaryRow label={copy.reviewed} value={reviewed} />
        <SummaryRow label={copy.corrected} value={corrected} />
        <SummaryRow label={copy.remainingIncorrect} value={remaining} />
      </div>
      {remaining === 0 ? (
        <p className="mt-4 text-sm font-semibold leading-relaxed text-[#1B8A4A]">{copy.allCorrected}</p>
      ) : null}
      <div className="mt-5 space-y-3">
        {remaining > 0 ? (
          <button
            type="button"
            onClick={onRetryRemaining}
            disabled={busy}
            className="lt-btn-primary h-auto w-full whitespace-normal px-4 py-3 text-sm disabled:cursor-not-allowed"
          >
            {fillProgress(copy.retryRemaining, { n: remaining })}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onRestartAll}
          disabled={busy}
          className="inline-flex min-h-12 w-full items-center justify-center whitespace-normal rounded-xl border border-[#D5DEE8] bg-white px-4 py-3 text-sm font-semibold text-[#102D4E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {fillProgress(copy.restartAll, { n: totalCount })}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold text-[#102D4E]"
        >
          {copy.backToTopics}
        </button>
      </div>
    </div>
  );
}
