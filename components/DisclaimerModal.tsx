'use client';

import { useState } from 'react';
import { t } from '@/lib/i18n/ui-strings';
import { isRtlLang, type TranslationLang } from '@/lib/i18n/languages';

interface DisclaimerModalProps {
  lang?: TranslationLang;
  showArabic?: boolean;
  showRomanian?: boolean;
  showPolish?: boolean;
  showPortuguese?: boolean;
}

function resolveLang(props: DisclaimerModalProps): TranslationLang {
  if (props.lang) return props.lang;
  if (props.showArabic) return 'ar';
  if (props.showRomanian) return 'ro';
  if (props.showPolish) return 'pl';
  if (props.showPortuguese) return 'pt';
  return 'off';
}

export default function DisclaimerModal(props: DisclaimerModalProps) {
  const lang = resolveLang(props);
  const [isOpen, setIsOpen] = useState(false);
  const dir = isRtlLang(lang) ? 'rtl' : 'ltr';

  return (
    <>
      <div className="sm:hidden flex items-center justify-center gap-1.5 mt-2 mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 text-[10px] text-[var(--muted-text)]/70 hover:text-[var(--muted-text)] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>{t(lang, 'disclaimerShort')}</span>
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 sm:hidden max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">{t(lang, 'disclaimerTitle')}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                aria-label={t(lang, 'close')}
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-4 space-y-3">
              <p
                className="text-sm text-[var(--muted-text)] leading-relaxed"
                dir={dir}
                style={dir === 'rtl' ? { fontFeatureSettings: '"liga" 1, "kern" 1' } : undefined}
              >
                {t(lang, 'disclaimerBody')}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
