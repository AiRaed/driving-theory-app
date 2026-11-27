import type { TranslationLang } from '@/lib/i18n/languages';
import {
  getQuestionPromptTranslation,
  isLocaleFileLang,
  type TranslationData,
} from '@/lib/translations';
import type { ActiveMockOption } from './exam';

type PromptSource = {
  id: string;
  topic: string;
  promptEn: string;
  promptAr?: string;
  promptExtra?: Record<string, string>;
};

function localeAnswer(
  option: { ur?: string; ro?: string; pl?: string; pt?: string; bn?: string; fa?: string } | undefined,
  lang: string
): string {
  if (!option) return '';
  if (lang === 'ur') return option.ur || '';
  if (lang === 'ro') return option.ro || '';
  if (lang === 'pl') return option.pl || '';
  if (lang === 'pt') return option.pt || '';
  if (lang === 'bn') return option.bn || '';
  if (lang === 'fa') return option.fa || '';
  return '';
}

export function mockPromptTranslation(
  question: PromptSource,
  lang: TranslationLang,
  localeData: TranslationData | null
): string {
  if (lang === 'off') return '';
  if (lang === 'ar') return question.promptAr || '';
  const extra = question.promptExtra?.[lang];
  if (extra) return extra;
  return getQuestionPromptTranslation(question, lang, localeData);
}

export function mockOptionTranslation(
  option: ActiveMockOption,
  question: { id: string; topic: string },
  lang: TranslationLang,
  localeData: TranslationData | null
): string {
  if (lang === 'off') return '';
  if (lang === 'ar') return option.ar || '';
  const extra = option.extra?.[lang];
  if (extra) return extra;
  if (!isLocaleFileLang(lang) || !localeData) return '';
  const stored = localeData[question.topic]?.[question.id]?.options?.[option.sourceIndex - 1];
  return localeAnswer(stored, lang);
}
