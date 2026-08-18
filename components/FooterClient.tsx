'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export default function FooterClient() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">LingoTheory</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t('footerTagline')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/terms"
              className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--lingo-red)] transition-colors"
            >
              {t('terms')}
            </Link>
            <Link
              href="/privacy"
              className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--lingo-red)] transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/support"
              className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--lingo-red)] transition-colors"
            >
              {t('support')}
            </Link>
          </div>
        </div>
        <div className="border-t border-[var(--border)] pt-4 space-y-1">
          <p className="text-xs text-[var(--text-secondary)]">
            {t('support')}:{' '}
            <a
              href="mailto:support@lingotheory.org"
              className="font-medium hover:text-[var(--lingo-red)] transition-colors"
            >
              support@lingotheory.org
            </a>
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Created by Raed Mahfoud — Independent AI Product Creator
          </p>
        </div>
      </div>
    </footer>
  );
}
