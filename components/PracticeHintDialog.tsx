'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import ExplanationCardPanel from '@/components/ExplanationCardPanel';
import { suppressAnswerActivation } from '@/lib/keyword-cards/keywordActivation';
import {
  HINT_DIALOG_FOCUSABLE_SELECTOR,
  hintDialogCopy,
  isArabicHintLanguage,
  lockPageScroll,
  nextDialogFocusIndex,
  type PracticeHintCard,
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

export default function PracticeHintDialog({
  open,
  card,
  onClose,
  returnFocusRef,
  uiLanguage,
  requestSave,
  onSavedChange,
}: {
  open: boolean;
  card: PracticeHintCard | null;
  onClose: () => void;
  returnFocusRef?: { current: HTMLElement | null };
  uiLanguage?: string;
  /** Saved Cards supplies the same save request. Practice keeps the built-in request. */
  requestSave?: () => Promise<Response>;
  onSavedChange?: (saved: boolean) => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const focusTimerRef = useRef<number | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

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
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = nextDialogFocusIndex(items.length, index, event.shiftKey);
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

  if (
    !open ||
    !card ||
    (!String(card.explanation || '').trim() && !String(card.explanation_ar || '').trim())
  ) {
    return null;
  }
  if (typeof document === 'undefined') return null;

  const language = uiLanguage || card.language;
  const copy = hintDialogCopy(language);
  const arabicHeader = isArabicHintLanguage(language);

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

  return createPortal(
    <div ref={rootRef} data-practice-hint-root="" className="lt-hint-dialog-overlay">
      <div data-hint-backdrop="" className="lt-hint-dialog-backdrop" aria-hidden="true" />
      <div
        ref={dialogRef}
        id="practice-hint-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        dir="ltr"
        lang="en"
        data-testid="practice-hint-dialog"
        className="lt-hint-dialog-panel focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lingo-red)]"
      >
        <header className="lt-hint-dialog-header">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} dir="ltr" lang="en" className="lt-hint-dialog-kicker">
              <svg viewBox="0 0 24 24" aria-hidden className="lt-hint-dialog-icon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 4.5h6.2L18 8.2V19a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 7 19V6A1.5 1.5 0 0 1 8.5 4.5Z" />
                <path d="M14 4.8V8.4h3.6" />
                <path d="M9.5 12.2h5" />
                <path d="M9.5 15.2h5" />
              </svg>
              Explanation Hint
            </h2>
            {arabicHeader ? (
              <p dir={copy.dir} lang={copy.lang} className="lt-hint-dialog-kicker-ar">
                {copy.cardKicker}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="lt-hint-dialog-close"
            aria-label={copy.closeLabel}
            data-testid="practice-hint-close"
            onPointerDown={closeFromPointer}
            onClick={closeFromPointer}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="lt-hint-dialog-scroll">
          <ExplanationCardPanel
            card={card}
            descriptionId={descriptionId}
            uiLanguage={language}
            requestSave={requestSave}
            onSavedChange={onSavedChange}
          />
          <div className="lt-hint-dialog-footer">
            <button
              type="button"
              className="lt-btn-primary lt-hint-dialog-done"
              data-testid="practice-hint-got-it"
              onPointerDown={closeFromPointer}
              onClick={closeFromPointer}
            >
              {copy.gotItLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
