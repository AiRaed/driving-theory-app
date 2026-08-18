'use client';

import { cn } from '@/lib/utils';
import { ENABLED_LANGUAGES, type TranslationLang } from '@/lib/i18n/languages';
import { UI_EN } from '@/lib/i18n/ui-strings';

interface DashboardLanguagePickerProps {
  value: TranslationLang;
  onChange: (lang: TranslationLang) => void;
  className?: string;
}

/**
 * Always-visible language grid for the dashboard.
 * No dropdowns — every supported language is shown as a tappable card.
 * Languages come from ENABLED_LANGUAGES so new entries appear automatically.
 */
export default function DashboardLanguagePicker({
  value,
  onChange,
  className,
}: DashboardLanguagePickerProps) {
  return (
    <section className={cn('w-full', className)} aria-label={UI_EN.dashboardLanguageHeading}>
      <div className="mb-2.5">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {UI_EN.dashboardLanguageHeading}
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          {UI_EN.dashboardLanguageSubheading}
        </p>
      </div>
      <div
        className="grid gap-1.5 sm:gap-2 [grid-template-columns:repeat(auto-fill,minmax(7.25rem,1fr))]"
        role="listbox"
        aria-label={UI_EN.dashboardLanguageSubheading}
      >
        {ENABLED_LANGUAGES.map((language) => {
          const selected = value === language.code;
          return (
            <button
              key={language.code}
              type="button"
              role="option"
              aria-selected={selected}
              aria-label={language.englishName}
              onClick={() => onChange(language.code)}
              className={cn(
                'relative min-h-11 sm:min-h-10 px-2 py-2 rounded-[var(--radius-md)] border transition-all duration-150',
                'flex items-center justify-center active:scale-[0.98]',
                selected
                  ? 'border-[var(--lingo-red)] bg-[var(--lingo-red-soft)] ring-2 ring-[var(--lingo-red-muted)] shadow-sm'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--lingo-red-muted)] hover:bg-[var(--surface-secondary)]'
              )}
            >
              <span
                className={cn(
                  'block w-full text-center text-sm font-bold leading-tight px-4',
                  selected ? 'text-[var(--lingo-red)]' : 'text-[var(--text-primary)]'
                )}
                dir={language.dir}
                lang={language.urlCode}
              >
                {language.nativeName}
              </span>
              {selected && (
                <span
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[var(--lingo-red)] text-xs font-bold"
                  aria-hidden
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
