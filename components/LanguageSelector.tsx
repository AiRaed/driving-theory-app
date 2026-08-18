'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ENABLED_LANGUAGES, getLanguageMeta, type TranslationLang } from '@/lib/i18n/languages';
import { t } from '@/lib/i18n/ui-strings';

interface LanguageSelectorProps {
  value: TranslationLang;
  onChange: (lang: TranslationLang) => void;
  className?: string;
}

/**
 * Scalable translation language control.
 * Mobile / tablet / crowded desktop: current language + compact 🌐 menu.
 * Wide desktop with few languages: segmented row.
 * Options always come from ENABLED_LANGUAGES (single source of truth).
 */
export default function LanguageSelector({
  value,
  onChange,
  className,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = getLanguageMeta(value);
  const useSegmented = ENABLED_LANGUAGES.length <= 6;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const compactClass = useSegmented ? 'flex xl:hidden' : 'flex';
  const segmentedClass = useSegmented ? 'hidden xl:flex' : 'hidden';

  return (
    <div ref={rootRef} className={cn('relative flex items-center gap-2 min-w-0', className)}>
      <div className={cn('items-center gap-1.5 min-w-0 w-full', compactClass)}>
        <span className="text-[10px] sm:text-xs font-medium text-[var(--text-secondary)] whitespace-nowrap flex-shrink-0">
          <span className="sm:hidden">{t(value, 'translationShort')}</span>
          <span className="hidden sm:inline">{t(value, 'translation')}:</span>
        </span>
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <span
            className="lt-segmented-btn px-2 py-1 text-[11px] sm:text-xs truncate max-w-[9.5rem] data-[active=true]:pointer-events-none"
            data-active="true"
            aria-current="true"
          >
            <span aria-hidden className="mr-1">
              {selected.flag}
            </span>
            {selected.nativeName}
          </span>
          <button
            type="button"
            className="lt-btn-ghost flex-shrink-0 px-2 py-1 text-sm leading-none"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={t(value, 'languages')}
            onClick={() => setOpen((v) => !v)}
          >
            🌐
          </button>
        </div>
      </div>

      <div className={cn('items-center gap-3 flex-wrap', segmentedClass)}>
        <span className="text-xs font-medium text-[var(--text-secondary)]">{t(value, 'translation')}:</span>
        <div className="lt-segmented" role="group" aria-label={t(value, 'languages')}>
          {ENABLED_LANGUAGES.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => onChange(opt.code)}
              aria-pressed={value === opt.code}
              data-active={value === opt.code}
              className="lt-segmented-btn px-2.5 py-1.5 text-xs whitespace-nowrap"
              title={`${opt.nativeName} (${opt.englishName})`}
            >
              <span aria-hidden className="mr-1">
                {opt.flag}
              </span>
              {opt.nativeName}
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1.5 w-[min(18rem,calc(100vw-2rem))] max-h-[min(24rem,70vh)] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)] py-1"
          role="listbox"
          aria-label={t(value, 'languages')}
        >
          {ENABLED_LANGUAGES.map((opt) => {
            const active = value === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                role="option"
                aria-selected={active}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors',
                  active
                    ? 'bg-[var(--surface-2)] text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
                )}
                onClick={() => {
                  onChange(opt.code);
                  setOpen(false);
                }}
              >
                <span aria-hidden className="text-base w-6 text-center">
                  {opt.flag}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate font-medium" dir={opt.dir}>
                    {opt.nativeName}
                  </span>
                  {opt.nativeName !== opt.englishName && (
                    <span className="block text-[11px] text-[var(--text-secondary)] truncate">
                      {opt.englishName}
                    </span>
                  )}
                </span>
                {active && (
                  <span className="text-[var(--text-secondary)] text-xs" aria-hidden>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
