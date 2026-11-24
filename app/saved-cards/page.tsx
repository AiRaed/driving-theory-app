'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PracticeHintDialog from '@/components/PracticeHintDialog';
import PracticeKeywordDialog from '@/components/PracticeKeywordDialog';
import { keywordDisplay } from '@/lib/i18n/arabic/display';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useSessionUserId } from '@/lib/saved-cards/useSessionUserId';
import type { LearnerKeywordCard } from '@/lib/keyword-cards/types';
import type { PracticeHintCard } from '@/lib/learning-cards/hintDialog';

type Filter = 'all' | 'keywords' | 'explanations';

type NewKeyword = {
  id: string;
  term_en: string;
  translation_ar?: string | null;
  explanation_en: string;
  explanation_ar?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  arabic_review?: 'approved' | 'draft' | null;
};

type LegacyKeyword = {
  id: string;
  term_key: string;
  definition: string;
  language: string;
  image_url?: string | null;
  image_alt?: string | null;
};

type ExplanationCard = {
  id: string;
  question_id: string;
  explanation: string;
  language: string;
  format?: string;
  image_url?: string | null;
  image_alt?: string | null;
  video_url?: string | null;
  explanation_ar?: string | null;
  arabic_review?: 'approved' | 'draft' | null;
};

type OpenKeyword = {
  kind: 'new' | 'legacy';
  card: LearnerKeywordCard;
};

function SavedWave() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-14 w-full sm:h-16"
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
    >
      <path
        d="M0 36c90 28 170-22 280-4 100 16 150 30 250 8 110-24 170-34 270-6 90 26 150 6 230-8 60-10 110 0 170 12v42H0Z"
        fill="rgba(22,140,186,0.55)"
      />
      <path
        d="M0 56c130 16 210-18 340 0 110 14 170 16 270 0 120-18 190-6 290 8 80 10 150 2 300-6v22H0Z"
        fill="rgba(22,140,186,0.28)"
      />
    </svg>
  );
}

function KeywordIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.2L6 20V5.5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function ExplanationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6.5h8M8 10.5h8M8 14.5h5" />
      <path d="M6.5 3.5h11a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function toLearnerKeyword(card: NewKeyword): LearnerKeywordCard {
  return {
    id: card.id,
    term_en: card.term_en,
    translation_ar: card.translation_ar || '',
    explanation_en: card.explanation_en || '',
    explanation_ar: card.explanation_ar || '',
    image_url: card.image_url || null,
    image_alt: card.image_alt || null,
    arabic_review: card.arabic_review === 'draft' || card.arabic_review === 'approved' ? card.arabic_review : undefined,
  };
}

function legacyToLearner(card: LegacyKeyword): LearnerKeywordCard {
  const arabic = card.language === 'ar';
  return {
    id: card.id,
    term_en: card.term_key,
    translation_ar: arabic ? card.term_key : '',
    explanation_en: arabic ? '' : card.definition,
    explanation_ar: arabic ? card.definition : '',
    image_url: card.image_url || null,
    image_alt: card.image_alt || null,
  };
}

function toHintCard(card: ExplanationCard): PracticeHintCard {
  return {
    id: card.id,
    explanation: card.explanation,
    format: card.format,
    language: card.language,
    image_url: card.image_url,
    image_alt: card.image_alt,
    video_url: card.video_url,
    explanation_ar: card.explanation_ar,
    arabic_review: card.arabic_review,
  };
}

export default function SavedCardsPage() {
  const { lang } = useLanguage();
  const arabicUi = lang === 'ar';
  const sessionUserId = useSessionUserId();
  const requestRef = useRef(0);
  const [filter, setFilter] = useState<Filter>('all');
  const [keywords, setKeywords] = useState<NewKeyword[]>([]);
  const [legacyKeywords, setLegacyKeywords] = useState<LegacyKeyword[]>([]);
  const [explanations, setExplanations] = useState<ExplanationCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openKeyword, setOpenKeyword] = useState<OpenKeyword | null>(null);
  const [openExplanation, setOpenExplanation] = useState<ExplanationCard | null>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);

  const clearCollection = () => {
    setKeywords([]);
    setLegacyKeywords([]);
    setExplanations([]);
    setOpenKeyword(null);
    setOpenExplanation(null);
  };

  const load = useCallback((mode: 'initial' | 'refresh' = 'initial') => {
    const ticket = ++requestRef.current;
    const owner = sessionUserId;
    if (mode === 'initial') {
      clearCollection();
      setLoading(true);
    }
    if (owner === null) {
      setError('Log in to view saved cards.');
      setLoading(false);
      return;
    }
    const belongsToOwner = (body: { user_id?: string }) =>
      owner === undefined || !body?.user_id || body.user_id === owner;
    Promise.all([
      fetch('/api/learning-cards/saved', { cache: 'no-store', credentials: 'same-origin' }).then(
        async (res) => ({ res, body: await res.json() })
      ),
      fetch('/api/keyword-cards/saved', { cache: 'no-store', credentials: 'same-origin' }).then(
        async (res) => ({ res, body: await res.json() })
      ),
    ])
      .then(([legacy, keyword]) => {
        if (ticket !== requestRef.current) return;
        if (!belongsToOwner(legacy.body) || !belongsToOwner(keyword.body)) return;
        if (legacy.res.status === 401 || keyword.res.status === 401) {
          clearCollection();
          setError('Log in to view saved cards.');
          return;
        }
        if (!legacy.res.ok) throw new Error(legacy.body.error || 'Failed');
        setError(keyword.res.ok ? null : keyword.body.error || null);
        setLegacyKeywords(legacy.body.keywords || []);
        setExplanations(legacy.body.explanations || []);
        setKeywords(keyword.res.ok ? keyword.body.keywords || [] : []);
      })
      .catch((reason) => {
        if (ticket !== requestRef.current) return;
        setError(reason instanceof Error ? reason.message : 'Failed');
      })
      .finally(() => {
        if (ticket === requestRef.current) setLoading(false);
      });
  }, [sessionUserId]);

  useEffect(() => {
    clearCollection();
    load('initial');
  }, [load]);

  const showKeywords = filter !== 'explanations';
  const showExplanations = filter !== 'keywords';
  const keywordCards = [
    ...keywords.map((card) => ({ kind: 'new' as const, card })),
    ...legacyKeywords.map((card) => ({ kind: 'legacy' as const, card })),
  ];
  const visibleKeywords = showKeywords ? keywordCards : [];
  const visibleExplanations = showExplanations ? explanations : [];
  const visibleCount = visibleKeywords.length + visibleExplanations.length;
  const empty = !loading && !error && visibleCount === 0;

  const saveNewKeyword = (keywordId: string) =>
    fetch('/api/keyword-cards/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword_id: keywordId }),
    });

  const saveLegacyKeyword = (keywordId: string) =>
    fetch('/api/learning-cards/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        card_kind: 'keyword',
        keyword_card_id: keywordId,
        explanation_card_id: null,
      }),
    });

  const saveExplanation = (explanationCardId: string) =>
    fetch('/api/learning-cards/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        card_kind: 'explanation',
        explanation_card_id: explanationCardId,
      }),
    });

  const forgetKeyword = (kind: OpenKeyword['kind'], id: string) => {
    if (kind === 'new') {
      setKeywords((current) => current.filter((card) => card.id !== id));
      return;
    }
    setLegacyKeywords((current) => current.filter((card) => card.id !== id));
  };

  return (
    <div dir="ltr" className="min-h-screen overflow-x-clip bg-[#F7F9FC] pb-28 md:pb-10">
      <div className="mx-auto w-full min-w-0 max-w-[1120px] px-4 py-4 sm:px-6 sm:py-6">
        <section className="relative overflow-hidden rounded-[22px] bg-[#102D4E] px-4 pb-7 pt-4 text-white shadow-[0_12px_28px_rgba(16,45,78,0.12)] sm:px-7 sm:pb-8 sm:pt-6">
          <SavedWave />
          <div className="relative z-[1] flex items-center gap-3 sm:gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:h-14 sm:w-14">
              <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.2L6 20V5.5a1 1 0 0 1 1-1Z" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-tight sm:text-[1.7rem]">Saved Cards</h1>
              <p className="mt-0.5 text-xs font-medium leading-snug text-white/85 sm:text-sm">
                Your saved keywords and explanations.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Saved card type">
          {(
            [
              ['all', 'All', 'الكل'],
              ['keywords', 'Keywords', 'كلمات'],
              ['explanations', 'Explanations', 'شروح'],
            ] as const
          ).map(([value, label, arabicLabel]) => {
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                className={
                  active
                    ? 'min-h-11 rounded-full bg-[#D71920] px-4 text-sm font-semibold text-white'
                    : 'min-h-11 rounded-full border border-[#D5DEE8] bg-white px-4 text-sm font-semibold text-[#102D4E]'
                }
                onClick={() => setFilter(value)}
              >
                {arabicUi ? arabicLabel : label}
              </button>
            );
          })}
        </div>

        {loading ? <p className="mt-6 text-sm text-[#4E5D73]">Loading saved cards…</p> : null}
        {error ? (
          <p className="mt-6 text-sm font-medium text-[#102D4E]" role="status">
            {error}
          </p>
        ) : null}
        {empty ? (
          <div className="mt-6 rounded-[14px] border border-[#D5DEE8] bg-white px-4 py-8 text-center shadow-[0_8px_20px_rgba(16,45,78,0.05)]">
            <p className="text-sm font-semibold text-[#102D4E]">Nothing saved in this view.</p>
            <p className="mt-1 text-sm text-[#4E5D73]">
              Save a keyword or an explanation from{' '}
              <Link href="/practice" className="font-semibold text-[#168CBA]">
                Practice
              </Link>
              .
            </p>
          </div>
        ) : null}

        {visibleCount > 0 ? (
          <ul className="mt-4 grid grid-cols-1 gap-4 min-[640px]:grid-cols-2 min-[640px]:gap-[18px] min-[1100px]:grid-cols-3 xl:grid-cols-4">
            {visibleKeywords.map(({ kind, card }) => {
              const learner = kind === 'new' ? toLearnerKeyword(card) : legacyToLearner(card);
              const display = keywordDisplay({
                language: arabicUi ? 'ar' : 'en',
                term_en: learner.term_en,
                translation_ar: learner.translation_ar,
                explanation_en: learner.explanation_en,
                explanation_ar: learner.explanation_ar,
                arabic_review: learner.arabic_review,
              });
              const preview = display.showArabic && display.arabicDefinition
                ? display.arabicDefinition
                : display.englishDefinition;
              return (
                <li key={`${kind}-${card.id}`} className="h-full min-w-0">
                  <article
                    aria-label={`Keyword Card ${learner.term_en}`}
                    className="flex h-full min-w-0 flex-col overflow-hidden rounded-[14px] border border-[#D5DEE8] bg-white shadow-[0_8px_20px_rgba(16,45,78,0.05)]"
                  >
                    <div className="h-1.5 bg-[#168CBA]" />
                    <div className="flex min-w-0 flex-1 flex-col p-4">
                      <div className="flex items-center gap-2 text-[#168CBA]">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#168CBA]/10">
                          <KeywordIcon />
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em]">Keyword</span>
                      </div>
                      <h2 dir="ltr" lang="en" className="mt-3 line-clamp-2 break-words text-base font-bold leading-snug text-[#102D4E]">
                        {learner.term_en}
                      </h2>
                      {display.arabicTerm ? (
                        <p dir="rtl" lang="ar" className="mt-1 line-clamp-2 break-words text-start text-sm font-semibold leading-snug text-[#102D4E]">
                          {display.arabicTerm}
                        </p>
                      ) : null}
                      {learner.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={learner.image_url}
                          alt={learner.image_alt || ''}
                          className="mt-3 h-14 w-full rounded-lg border border-[#D5DEE8] object-contain"
                        />
                      ) : null}
                      {preview ? (
                        <p
                          dir={display.showArabic && display.arabicDefinition ? 'rtl' : 'ltr'}
                          lang={display.showArabic && display.arabicDefinition ? 'ar' : 'en'}
                          className="mt-2 line-clamp-3 break-words text-start text-sm leading-5 text-[#4E5D73]"
                        >
                          {preview}
                        </p>
                      ) : null}
                      <div className="mt-auto pt-3">
                      <button
                        type="button"
                        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#168CBA] px-4 text-sm font-bold text-white"
                        onClick={(event) => {
                          returnFocusRef.current = event.currentTarget;
                          setOpenExplanation(null);
                          setOpenKeyword({ kind, card: learner });
                        }}
                      >
                        View
                      </button>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}

            {visibleExplanations.map((card) => {
              const arabicPreview = arabicUi && String(card.explanation_ar || '').trim();
              const preview = arabicPreview ? String(card.explanation_ar) : card.explanation;
              return (
                <li key={card.id} className="h-full min-w-0">
                  <article
                    aria-label={`Explanation Card ${card.question_id}`}
                    className="flex h-full min-w-0 flex-col overflow-hidden rounded-[14px] border border-[#D5DEE8] bg-white shadow-[0_8px_20px_rgba(16,45,78,0.05)]"
                  >
                    <div className="h-1.5 bg-[#D71920]" />
                    <div className="flex min-w-0 flex-1 flex-col p-4">
                      <div className="flex items-center gap-2 text-[#D71920]">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#D71920]/10">
                          <ExplanationIcon />
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em]">Explanation</span>
                      </div>
                      <h2 dir="ltr" lang="en" className="mt-3 line-clamp-2 break-words text-base font-bold leading-snug text-[#102D4E]">
                        {card.question_id}
                      </h2>
                      {card.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={card.image_url}
                          alt={card.image_alt || ''}
                          className="mt-3 h-14 w-full rounded-lg border border-[#D5DEE8] object-contain"
                        />
                      ) : null}
                      {preview ? (
                        <p
                          dir={arabicPreview ? 'rtl' : 'ltr'}
                          lang={arabicPreview ? 'ar' : 'en'}
                          className="mt-2 line-clamp-3 break-words text-start text-sm leading-5 text-[#4E5D73]"
                        >
                          {preview}
                        </p>
                      ) : null}
                      <div className="mt-auto pt-3">
                      <button
                        type="button"
                        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#D71920] px-4 text-sm font-bold text-white"
                        onClick={(event) => {
                          returnFocusRef.current = event.currentTarget;
                          setOpenKeyword(null);
                          setOpenExplanation(card);
                        }}
                      >
                        View
                      </button>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <PracticeKeywordDialog
        open={!!openKeyword}
        keywords={openKeyword ? [openKeyword.card] : []}
        language={arabicUi ? 'ar' : 'en'}
        initialKeywordId={openKeyword?.card.id}
        returnFocusRef={returnFocusRef}
        performSave={openKeyword?.kind === 'legacy' ? saveLegacyKeyword : saveNewKeyword}
        initialSavedIds={openKeyword ? [openKeyword.card.id] : undefined}
        onSavedChange={(id, saved) => {
          if (!saved && openKeyword) forgetKeyword(openKeyword.kind, id);
        }}
        onClose={() => {
          setOpenKeyword(null);
          load('refresh');
        }}
      />
      <PracticeHintDialog
        open={!!openExplanation}
        card={openExplanation ? toHintCard(openExplanation) : null}
        uiLanguage={arabicUi ? 'ar' : 'en'}
        returnFocusRef={returnFocusRef}
        requestSave={
          openExplanation ? () => saveExplanation(openExplanation.id) : undefined
        }
        onSavedChange={(saved) => {
          if (!saved && openExplanation) {
            const id = openExplanation.id;
            setExplanations((current) => current.filter((card) => card.id !== id));
          }
        }}
        onClose={() => {
          setOpenExplanation(null);
          load('refresh');
        }}
      />
    </div>
  );
}
