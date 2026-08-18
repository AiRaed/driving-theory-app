'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics/trackEvent';
import {
  fromAnalyticsLanguage,
  getLanguageMeta,
  getTranslationLang,
  hasChosenLanguageLocally,
  hasStoredTranslationLang,
  isRtlLang,
  markLanguageChosenLocally,
  parseUrlLang,
  setCampaignLang,
  setTranslationLang,
  toAnalyticsLanguage,
  type TranslationLang,
} from '@/lib/i18n/languages';
import { t as translate, type UiKey } from '@/lib/i18n/ui-strings';

interface LanguageContextValue {
  lang: TranslationLang;
  setLang: (lang: TranslationLang) => void;
  ready: boolean;
  needsOnboarding: boolean;
  isRtl: boolean;
  t: (key: UiKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

async function persistPreference(lang: TranslationLang): Promise<void> {
  try {
    await fetch('/api/language/preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ language: toAnalyticsLanguage(lang) }),
    });
  } catch {
    // Offline / unauthenticated — localStorage remains the source of truth.
  }
}

function captureCampaignLangFromLocation() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const urlLang = parseUrlLang(params.get('lang'));
  if (urlLang) setCampaignLang(urlLang);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<TranslationLang>('off');
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const supabase = createClient();

  const hydrate = useCallback(async () => {
    captureCampaignLangFromLocation();
    const local = getTranslationLang();
    setLangState(local);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setNeedsOnboarding(false);
        setReady(true);
        return;
      }

      const res = await fetch('/api/language/preference', {
        cache: 'no-store',
        credentials: 'include',
      });

      if (res.ok) {
        const data = (await res.json()) as { preferred_language?: string | null };
        if (data.preferred_language) {
          const serverLang = fromAnalyticsLanguage(data.preferred_language);
          setLangState(serverLang);
          setTranslationLang(serverLang);
          markLanguageChosenLocally();
          setNeedsOnboarding(false);
          setReady(true);
          return;
        }
      }
    } catch {
      // Fall through to local flags
    }

    if (hasChosenLanguageLocally() || hasStoredTranslationLang()) {
      markLanguageChosenLocally();
      void persistPreference(local);
      setNeedsOnboarding(false);
    } else {
      setNeedsOnboarding(true);
    }
    setReady(true);
  }, [supabase]);

  useEffect(() => {
    void hydrate();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setReady(false);
        void hydrate();
      } else if (event === 'TOKEN_REFRESHED') {
        void hydrate();
      }
      if (event === 'SIGNED_OUT') {
        setNeedsOnboarding(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [hydrate, supabase]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = getLanguageMeta(lang).urlCode;
  }, [lang]);

  const setLang = useCallback(
    (next: TranslationLang) => {
      const previous = lang;
      setLangState(next);
      setTranslationLang(next);
      markLanguageChosenLocally();
      setNeedsOnboarding(false);
      void persistPreference(next);
      void trackEvent('language_changed', {
        language: toAnalyticsLanguage(next),
        previous: toAnalyticsLanguage(previous),
      });
    },
    [lang]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      ready,
      needsOnboarding,
      isRtl: isRtlLang(lang),
      t: (key, vars) => translate(lang, key, vars),
    }),
    [lang, setLang, ready, needsOnboarding]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
