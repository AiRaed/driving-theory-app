'use client';

import { cn } from '@/lib/utils';
import type { TranslationLang } from '@/lib/i18n/languages';
import { getLanguageMeta, isRtlLang } from '@/lib/i18n/languages';
import { enLabel, getUiTranslation, type UiKey } from '@/lib/i18n/ui-strings';

interface BilingualLabelProps {
  /** UI dictionary key — English primary line comes from UI_EN. */
  keyName: UiKey;
  lang: TranslationLang;
  vars?: Record<string, string | number>;
  className?: string;
  primaryClassName?: string;
  translationClassName?: string;
  align?: 'center' | 'start';
}

/**
 * English-primary label with optional support translation underneath.
 * When lang is English (off), only the English line is shown.
 */
export default function BilingualLabel({
  keyName,
  lang,
  vars,
  className,
  primaryClassName,
  translationClassName,
  align = 'center',
}: BilingualLabelProps) {
  const primary = enLabel(keyName, vars);
  const secondary = getUiTranslation(lang, keyName, vars);
  const dir = isRtlLang(lang) ? 'rtl' : 'ltr';

  return (
    <span
      className={cn(
        'flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      <span className={cn('primary-label font-semibold leading-snug', primaryClassName)}>
        {primary}
      </span>
      {secondary && (
        <span
          className={cn(
            'translation-label text-[11px] sm:text-xs text-[var(--text-secondary)]/90 mt-0.5 leading-snug font-medium',
            translationClassName
          )}
          dir={dir}
          style={dir === 'rtl' ? { fontFeatureSettings: '"liga" 1, "kern" 1' } : undefined}
        >
          {secondary}
        </span>
      )}
    </span>
  );
}

/** Compact nav link: English + optional secondary line. */
export function BilingualNavLabel({
  keyName,
  lang,
  active,
}: {
  keyName: UiKey;
  lang: TranslationLang;
  active?: boolean;
}) {
  const primary = enLabel(keyName);
  const secondary = getUiTranslation(lang, keyName);
  const dir = getLanguageMeta(lang).dir;

  return (
    <span className="flex flex-col items-center leading-tight py-0.5">
      <span className={cn('font-semibold', active && 'text-[var(--lingo-red)]')}>{primary}</span>
      {secondary && (
        <span
          className="text-[9px] md:text-[10px] text-[var(--text-secondary)] font-medium mt-0.5"
          dir={dir}
          style={dir === 'rtl' ? { fontFeatureSettings: '"liga" 1, "kern" 1' } : undefined}
        >
          {secondary}
        </span>
      )}
    </span>
  );
}
