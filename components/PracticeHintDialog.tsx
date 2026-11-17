'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import ExplanationCardPanel from '@/components/ExplanationCardPanel';
import {
  HINT_DIALOG_FOCUSABLE_SELECTOR,
  hintDialogCopy,
  hintFormatLabel,
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

  if (
    !open ||
    !card ||
    (!String(card.explanation || '').trim() && !String(card.explanation_ar || '').trim())
  ) {
    return null;
  }
  if (typeof document === 'undefined') return null;

  const copy = hintDialogCopy(uiLanguage || card.language);
  const formatLabel = hintFormatLabel(card.format, uiLanguage || card.language);

  return createPortal(
    <div ref={rootRef} data-practice-hint-root="" className="lt-hint-dialog-overlay">
      <div data-hint-backdrop="" className="absolute inset-0 bg-black/40" aria-hidden="true" />
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
        <div className="lt-hint-dialog-grabber" aria-hidden="true">
          <span />
        </div>
        <div className="flex shrink-0 items-start gap-3 border-b border-[var(--border)] px-5 pb-3 pt-3">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} dir={copy.dir} lang={copy.lang} className="text-lg font-bold text-[var(--text-primary)]">
              {copy.title}
            </h2>
            <p className="mt-1 text-[13px] font-semibold text-[var(--text-secondary)]">
              <span>{copy.languageLabel}</span>
              <span aria-hidden="true"> · </span>
              <span>{formatLabel}</span>
            </p>
          </div>
          <button
            type="button"
            className="lt-btn-ghost h-11 w-11 shrink-0 p-0"
            aria-label={copy.closeLabel}
            data-testid="practice-hint-close"
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
          <ExplanationCardPanel
            card={card}
            descriptionId={descriptionId}
            requestSave={requestSave}
            onSavedChange={onSavedChange}
          />
        </div>
        <div className="lt-hint-dialog-footer">
          <button
            type="button"
            className="lt-btn-primary w-full px-4 py-3 text-sm"
            data-testid="practice-hint-got-it"
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
