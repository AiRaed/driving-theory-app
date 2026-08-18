'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TranslationLang } from '@/lib/translations';
import { t } from '@/lib/i18n/ui-strings';
import {
  getVocabHintDisplay,
  getVocabHintsForQuestion,
} from '@/lib/vocab-hints/store';

interface VocabHintsControlProps {
  questionId: string;
  translationLang: TranslationLang;
  className?: string;
}

/**
 * Compact vocabulary hint control.
 * Hidden when the question has no stored vocab hints.
 * Does not replace existing post-answer "Learning Hints".
 */
export default function VocabHintsControl({
  questionId,
  translationLang,
  className,
}: VocabHintsControlProps) {
  const [open, setOpen] = useState(false);
  const hints = getVocabHintsForQuestion(questionId);

  // Collapse when navigating to another question
  useEffect(() => {
    setOpen(false);
  }, [questionId]);

  if (hints.length === 0) {
    return null;
  }

  const hintLabel = t(translationLang, 'hint');
  const hideLabel = t(translationLang, 'hideHint');
  const helpLabel = t(translationLang, 'vocabHelp');

  return (
    <div className={cn('mb-3', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="lt-btn-ghost inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm"
        aria-expanded={open}
      >
        <span aria-hidden>💡</span>
        <span>{open ? hideLabel : hintLabel}</span>
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 space-y-2.5">
          <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
            {helpLabel}
          </p>
          {hints.map((hint) => {
            const display = getVocabHintDisplay(hint, translationLang);
            return (
              <div key={hint.term} className="text-sm">
                <div className="font-semibold text-[var(--text-primary)]">
                  {display.term}
                </div>
                <div
                  className="text-[var(--text-secondary)] mt-0.5 leading-relaxed"
                  dir={display.dir}
                  style={
                    display.dir === 'rtl'
                      ? { fontFeatureSettings: '"liga" 1, "kern" 1' }
                      : undefined
                  }
                >
                  {display.explanation}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
