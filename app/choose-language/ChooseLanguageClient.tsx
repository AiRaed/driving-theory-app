'use client';

import { useMemo, useState } from 'react';
import BrandLogo from '@/components/BrandLogo';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import {
  ENABLED_LANGUAGES,
  getCampaignLang,
  parseUrlLang,
  type TranslationLang,
} from '@/lib/i18n/languages';

export default function ChooseLanguageClient() {
  const { setLang, t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [saving, setSaving] = useState<TranslationLang | null>(null);

  const highlighted = useMemo(() => {
    return parseUrlLang(searchParams.get('lang')) || getCampaignLang();
  }, [searchParams]);

  const nextPath = useMemo(() => {
    const raw = searchParams.get('next') || '/dashboard';
    if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/auth')) {
      return '/dashboard';
    }
    return raw;
  }, [searchParams]);

  const handleSelect = (code: TranslationLang) => {
    if (saving) return;
    setSaving(code);
    setLang(code);
    router.replace(nextPath);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth');
    router.refresh();
  };

  return (
    <div className="lt-page py-8 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 max-w-xl rounded-[1.35rem] bg-[var(--navy)] p-5 text-white">
          <span className="inline-flex rounded-xl bg-white px-2 py-1">
            <BrandLogo size="header" priority />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-[2rem]">
            {t('chooseLanguageTitle')}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            {ENABLED_LANGUAGES.map((l) => `${l.flag} ${l.nativeName}`).join('  ·  ')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ENABLED_LANGUAGES.map((language) => {
            const active = highlighted === language.code;
            const isSaving = saving === language.code;
            return (
              <button
                key={language.code}
                type="button"
                onClick={() => handleSelect(language.code)}
                disabled={!!saving}
                className={cn(
                  'lt-card text-left p-4 sm:p-5 min-h-[5.5rem] transition-all duration-150',
                  'hover:border-[var(--lingo-red)] hover:shadow-[var(--shadow-md)]',
                  'active:scale-[0.99] disabled:opacity-70',
                  active && 'border-[var(--lingo-red)] ring-2 ring-[var(--lingo-red-muted)] bg-[var(--lingo-red-soft)]/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl w-8 text-center" aria-hidden>
                    {language.flag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-tight"
                      dir={language.dir}
                    >
                      {language.nativeName}
                    </div>
                    {language.nativeName !== language.englishName && (
                      <div className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                        {language.englishName}
                      </div>
                    )}
                  </div>
                  {isSaving && (
                    <span className="text-xs text-[var(--text-secondary)]">{t('loading')}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-2"
          >
            {t('logOut')}
          </button>
        </div>
      </div>
    </div>
  );
}
