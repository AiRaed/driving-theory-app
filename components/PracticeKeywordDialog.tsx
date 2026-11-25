'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ArabicDraftNote from '@/components/ArabicDraftNote';
import { keywordDisplay } from '@/lib/i18n/arabic/display';
import { useSessionUserId } from '@/lib/saved-cards/useSessionUserId';
import { keywordDialogCopy } from '@/lib/keyword-cards/dialog';
import { suppressAnswerActivation } from '@/lib/keyword-cards/keywordActivation';
import { clampKeywordIndex, keywordIndexForId, showsKeywordImage } from '@/lib/keyword-cards/rules';
import type { LearnerKeywordCard } from '@/lib/keyword-cards/types';
import {
  HINT_DIALOG_FOCUSABLE_SELECTOR,
  lockPageScroll,
  nextDialogFocusIndex,
} from '@/lib/learning-cards/hintDialog';

function listDialogFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(HINT_DIALOG_FOCUSABLE_SELECTOR)).filter(
    (el) => {
      if (el.getAttribute('aria-hidden') === 'true') return false;
      if (el.closest('[aria-hidden="true"]')) return false;
      if (el.hasAttribute('disabled')) return false;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    }
  );
}

function suppressBackground(portalRoot: HTMLElement): () => void {
  const changed: Array<{ el: HTMLElement; ariaHidden: string | null; inert: boolean }> = [];
  Array.from(document.body.children).forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    if (node === portalRoot || node.contains(portalRoot)) return;
    changed.push({
      el: node,
      ariaHidden: node.getAttribute('aria-hidden'),
      inert: node.inert,
    });
    node.setAttribute('aria-hidden', 'true');
    node.inert = true;
  });
  return () => {
    changed.forEach(({ el, ariaHidden, inert }) => {
      if (ariaHidden === null) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', ariaHidden);
      el.inert = inert;
    });
  };
}

export default function PracticeKeywordDialog({
  open,
  keywords,
  language,
  onClose,
  returnFocusRef,
  initialKeywordId,
  dialogId = 'practice-keyword-dialog',
  performSave,
  onSavedChange,
  initialSavedIds,
}: {
  open: boolean;
  keywords: LearnerKeywordCard[];
  language: string;
  onClose: () => void;
  returnFocusRef?: { current: HTMLElement | null };
  /** Opens this card immediately. The learner does not pick it again. */
  initialKeywordId?: string | null;
  dialogId?: string;
  /** Saved Cards supplies the same save request. Practice keeps the built-in request. */
  performSave?: (keywordId: string) => Promise<Response>;
  onSavedChange?: (keywordId: string, saved: boolean) => void;
  /** Ids already saved when the dialog opens. Practice leaves this unset. */
  initialSavedIds?: string[];
}) {
  const sessionUserId = useSessionUserId();
  const titleId = useId();
  const descriptionId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const focusTimerRef = useRef<number | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const initialSavedRef = useRef(initialSavedIds);
  initialSavedRef.current = initialSavedIds;
  const [index, setIndex] = useState(() =>
    open ? keywordIndexForId(keywords, initialKeywordId) : 0
  );
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const keywordKey = keywords.map((item) => item.id).join('|');
  const selectionKey = `${open ? 'open' : 'closed'}|${keywordKey}|${initialKeywordId || ''}`;
  const [selectionScope, setSelectionScope] = useState(selectionKey);
  if (selectionScope !== selectionKey) {
    setSelectionScope(selectionKey);
    setIndex(open ? keywordIndexForId(keywords, initialKeywordId) : 0);
  }

  useEffect(() => {
    if (!open) return;
    setSavedIds([]);
    if (!sessionUserId) return;
    let cancelled = false;
    fetch('/api/keyword-cards/saved', { cache: 'no-store', credentials: 'same-origin' })
      .then(async (res) => {
        if (!res.ok) return { keywords: [] as Array<{ id: string }>, user_id: '' };
        return res.json();
      })
      .then((body) => {
        if (cancelled) return;
        if (body.user_id && body.user_id !== sessionUserId) return;
        const ids = (body.keywords || []).map((item: { id: string }) => item.id);
        setSavedIds(Array.from(new Set([...ids, ...(initialSavedRef.current || [])])));
      })
      .catch(() => {
        if (!cancelled) setSavedIds([...(initialSavedRef.current || [])]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, sessionUserId]);

  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    const dialog = dialogRef.current;
    if (!root || !dialog) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement && !dialog.contains(document.activeElement)
        ? document.activeElement
        : returnFocusRef?.current ?? null;

    if (focusTimerRef.current != null) {
      window.clearTimeout(focusTimerRef.current);
      focusTimerRef.current = null;
    }
    dialog.focus({ preventScroll: true });
    const releaseBackground = suppressBackground(root);
    const unlockScroll = lockPageScroll(document, window.scrollY, (y) => window.scrollTo(0, y));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = listDialogFocusable(dialog);
      event.preventDefault();
      if (items.length === 0) {
        dialog.focus({ preventScroll: true });
        return;
      }
      const current = items.indexOf(document.activeElement as HTMLElement);
      const next = nextDialogFocusIndex(items.length, current, event.shiftKey);
      items[next]?.focus();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      // Arm this before the portal unmounts, so the dismiss click cannot land
      // on the answer that was underneath the dialog.
      suppressAnswerActivation();
      document.removeEventListener('keydown', onKeyDown);
      releaseBackground();
      unlockScroll();
      const restore =
        previouslyFocused && document.contains(previouslyFocused)
          ? previouslyFocused
          : returnFocusRef?.current;
      focusTimerRef.current = window.setTimeout(() => {
        focusTimerRef.current = null;
        restore?.focus({ preventScroll: true });
      }, 480);
    };
  }, [open, returnFocusRef]);

  if (!open || keywords.length === 0) return null;
  if (typeof document === 'undefined') return null;

  const closeDialog = () => {
    suppressAnswerActivation();
    // Unmount on a later turn. Removing the dialog inside the current click
    // lets WebKit and Android WebView deliver that click to the answer beneath it.
    window.setTimeout(() => onCloseRef.current(), 0);
  };
  const closeFromPointer = (event: { button?: number; preventDefault: () => void; stopPropagation: () => void }) => {
    if (event.button != null && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    closeDialog();
  };

  const copy = keywordDialogCopy(language);
  const keyword = keywords[clampKeywordIndex(keywords.length, index)];
  const keywordView = keywordDisplay({
    language,
    term_en: keyword.term_en,
    translation_ar: keyword.translation_ar,
    explanation_en: keyword.explanation_en,
    explanation_ar: keyword.explanation_ar,
    arabic_review: keyword.arabic_review,
  });
  const saved = savedIds.includes(keyword.id);
  const showImage = showsKeywordImage(keyword);

  const toggleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = performSave
        ? await performSave(keyword.id)
        : await fetch('/api/keyword-cards/saved', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword_id: keyword.id }),
          });
      const data = await res.json();
      if (res.status === 401) {
        setSaveError(copy.loginToSave);
        return;
      }
      if (!res.ok) {
        setSaveError(data.error || 'Could not save');
        return;
      }
      setSavedIds((current) =>
        data.saved ? Array.from(new Set([...current, keyword.id])) : current.filter((id) => id !== keyword.id)
      );
      onSavedChange?.(keyword.id, !!data.saved);
    } catch {
      setSaveError('Could not save');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div ref={rootRef} data-practice-keyword-root="" className="lt-keyword-card-overlay">
      <div data-keyword-backdrop="" className="lt-keyword-card-backdrop" aria-hidden="true" />
      <div
        ref={dialogRef}
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        dir="ltr"
        lang="en"
        data-testid="practice-keyword-dialog"
        className="lt-keyword-card-panel focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lingo-red)]"
      >
        <header className="lt-keyword-card-header">
          <div className="min-w-0 flex-1">
            <p className="lt-keyword-card-kicker" dir={copy.dir} lang={copy.lang}>
              <svg className="lt-keyword-card-book" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 5.2A2.2 2.2 0 0 1 7.2 3H19v15.2H7.2A2.2 2.2 0 0 0 5 20.4V5.2Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <path d="M5 20.4h14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M8.5 7.2h7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              {copy.cardKicker}
            </p>
            <h2
              id={titleId}
              dir="ltr"
              lang="en"
              data-testid="practice-keyword-term-title"
              data-keyword-id={keyword.id}
              className="lt-keyword-card-title"
            >
              {keyword.term_en}
            </h2>
            {keywordView.showArabic && keywordView.arabicTerm ? (
              <p dir="rtl" lang="ar" className="lt-keyword-card-translation">
                {keywordView.arabicTerm}
              </p>
            ) : null}
            {keywords.length > 1 ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor="practice-keyword-picker">
                  {copy.chooseLabel}
                </label>
                <select
                  id="practice-keyword-picker"
                  className="lt-input min-w-0 flex-1"
                  aria-label={copy.chooseLabel}
                  value={keyword.id}
                  onChange={(event) => {
                    const next = keywords.findIndex((item) => item.id === event.target.value);
                    setIndex(next < 0 ? 0 : next);
                  }}
                >
                  {keywords.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.term_en}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="lt-btn-ghost px-3 py-2 text-sm"
                  data-testid="practice-keyword-previous"
                  disabled={index === 0}
                  onClick={() => setIndex((current) => Math.max(0, current - 1))}
                >
                  {copy.previousLabel}
                </button>
                <button
                  type="button"
                  className="lt-btn-ghost px-3 py-2 text-sm"
                  data-testid="practice-keyword-next"
                  disabled={index >= keywords.length - 1}
                  onClick={() => setIndex((current) => Math.min(keywords.length - 1, current + 1))}
                >
                  {copy.nextLabel}
                </button>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="lt-keyword-card-close"
            aria-label={copy.closeLabel}
            data-testid="practice-keyword-close"
            onPointerDown={closeFromPointer}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              closeDialog();
            }}
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="lt-keyword-card-scroll">
          {showImage && keyword.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={keyword.image_url}
              alt={keyword.image_alt || copy.imageAltFallback}
              className="lt-keyword-card-image object-contain"
            />
          ) : null}
          <p
            id={descriptionId}
            dir="ltr"
            lang="en"
            className="lt-keyword-card-copy"
          >
            {keywordView.englishDefinition}
          </p>
          {keywordView.showArabic ? (
            <div className="mt-3">
              <ArabicDraftNote show={keywordView.draft} />
              {keywordView.arabicDefinition ? (
                <p dir="rtl" lang="ar" className="lt-keyword-card-copy">
                  {keywordView.arabicDefinition}
                </p>
              ) : null}
            </div>
          ) : null}
          {keywordView.fallback ? (
            <p dir="ltr" lang="en" className="mt-2 text-[11px] text-[var(--text-secondary)]">
              Arabic definition is not on this card yet. Showing the English definition.
            </p>
          ) : null}
          <button
            type="button"
            className={saved ? 'lt-keyword-save is-saved' : 'lt-keyword-save'}
            aria-pressed={saved}
            data-testid="practice-keyword-save"
            disabled={saving}
            onClick={() => void toggleSave()}
          >
            <svg className="lt-keyword-save-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v14l-6.5-3.4L5.5 20V6A1.5 1.5 0 0 1 7 4.5Z"
                fill={saved ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
            {saved ? copy.unsaveLabel : copy.saveLabel}
          </button>
          {saveError ? <p className="mt-1 text-[11px] text-[var(--wrong)]">{saveError}</p> : null}
          <p dir={copy.dir} lang={copy.lang} className="lt-keyword-card-note">
            {copy.disclaimer}
          </p>
          <button
            type="button"
            className="lt-btn-primary lt-keyword-card-done"
            data-testid="practice-keyword-got-it"
            onPointerDown={closeFromPointer}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              closeDialog();
            }}
          >
            {copy.gotItLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
