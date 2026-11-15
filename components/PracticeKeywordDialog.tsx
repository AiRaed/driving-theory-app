'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { keywordDialogCopy } from '@/lib/keyword-cards/dialog';
import { clampKeywordIndex, showsKeywordImage } from '@/lib/keyword-cards/rules';
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
}: {
  open: boolean;
  keywords: LearnerKeywordCard[];
  language: string;
  onClose: () => void;
  returnFocusRef?: { current: HTMLElement | null };
}) {
  const titleId = useId();
  const descriptionId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [index, setIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const keywordKey = keywords.map((item) => item.id).join('|');

  useEffect(() => {
    setIndex(0);
  }, [keywordKey, open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch('/api/keyword-cards/saved')
      .then(async (res) => {
        if (!res.ok) return { keywords: [] as Array<{ id: string }> };
        return res.json();
      })
      .then((body) => {
        if (cancelled) return;
        setSavedIds((body.keywords || []).map((item: { id: string }) => item.id));
      })
      .catch(() => {
        if (!cancelled) setSavedIds([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    const dialog = dialogRef.current;
    if (!root || !dialog) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement && !dialog.contains(document.activeElement)
        ? document.activeElement
        : returnFocusRef?.current ?? null;

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
      document.removeEventListener('keydown', onKeyDown);
      releaseBackground();
      unlockScroll();
      const restore =
        previouslyFocused && document.contains(previouslyFocused)
          ? previouslyFocused
          : returnFocusRef?.current;
      restore?.focus({ preventScroll: true });
    };
  }, [open, returnFocusRef]);

  if (!open || keywords.length === 0) return null;
  if (typeof document === 'undefined') return null;

  const copy = keywordDialogCopy(language);
  const keyword = keywords[clampKeywordIndex(keywords.length, index)];
  const saved = savedIds.includes(keyword.id);
  const showImage = showsKeywordImage(keyword);

  const toggleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/keyword-cards/saved', {
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
    } catch {
      setSaveError('Could not save');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div ref={rootRef} data-practice-keyword-root="" className="lt-hint-dialog-overlay">
      <div data-keyword-backdrop="" className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div
        ref={dialogRef}
        id="practice-keyword-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        dir={copy.dir}
        lang={copy.lang}
        data-testid="practice-keyword-dialog"
        className="lt-hint-dialog-panel focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lingo-red)]"
      >
        <div className="lt-hint-dialog-grabber" aria-hidden="true">
          <span />
        </div>
        <div className="flex shrink-0 items-start gap-3 border-b border-[var(--border)] px-5 pb-3 pt-3">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-bold text-[var(--text-primary)]">
              {copy.title}
            </h2>
            {keywords.length > 1 ? (
              <p className="mt-1 text-[13px] font-semibold text-[var(--text-secondary)]">
                {index + 1} / {keywords.length}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="lt-btn-ghost h-11 w-11 shrink-0 p-0"
            aria-label={copy.closeLabel}
            data-testid="practice-keyword-close"
            onClick={() => onCloseRef.current()}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="lt-hint-dialog-scroll">
          {keywords.length > 1 ? (
            <div className="mb-4 flex flex-wrap items-center gap-2">
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
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--lingo-red)]">
            Keyword Card
          </p>
          <h3 dir="ltr" lang="en" className="mt-1 text-xl font-bold text-[var(--text-primary)]">
            {keyword.term_en}
          </h3>
          {keyword.translation_ar.trim() ? (
            <p dir="rtl" lang="ar" className="mt-1 text-base font-semibold text-[var(--text-primary)]">
              {keyword.translation_ar}
            </p>
          ) : null}
          <p
            id={descriptionId}
            dir="ltr"
            lang="en"
            className="mt-3 text-base leading-7 text-[var(--text-primary)] whitespace-pre-wrap"
          >
            {keyword.explanation_en}
          </p>
          {keyword.explanation_ar.trim() ? (
            <p
              dir="rtl"
              lang="ar"
              className="mt-3 text-base leading-7 text-[var(--text-primary)] whitespace-pre-wrap"
            >
              {keyword.explanation_ar}
            </p>
          ) : null}
          {showImage && keyword.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={keyword.image_url}
              alt={keyword.image_alt || copy.imageAltFallback}
              className="mt-3 h-auto w-full max-h-72 object-contain rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-secondary)]"
            />
          ) : null}
          <div className="mt-3">
            <button
              type="button"
              className="lt-btn-ghost px-3 py-1.5 text-xs"
              data-testid="practice-keyword-save"
              disabled={saving}
              onClick={() => void toggleSave()}
            >
              {saved ? copy.unsaveLabel : copy.saveLabel}
            </button>
            {saveError ? <p className="mt-1 text-[11px] text-[var(--wrong)]">{saveError}</p> : null}
          </div>
          <p dir={copy.dir} lang={copy.lang} className="mt-3 text-[11px] text-[var(--text-secondary)]">
            {copy.disclaimer}
          </p>
        </div>
        <div className="lt-hint-dialog-footer">
          <button
            type="button"
            className="lt-btn-primary w-full px-4 py-3 text-sm"
            data-testid="practice-keyword-got-it"
            onClick={() => onCloseRef.current()}
          >
            {copy.gotItLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
