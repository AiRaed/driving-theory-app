/**
 * Keyword taps must not become answer selections.
 *
 * stopPropagation is not enough on its own. The keyword used to live inside
 * the answer control, and WebKit / Android WebView can retarget the click that
 * dismisses the keyword dialog onto whatever is underneath once the dialog
 * unmounts. Answer selection therefore checks both the event path and a short
 * shield armed when the dialog closes.
 */

const KEYWORD_SELECTORS = ['[data-testid="practice-keyword-term"]', '[data-keyword-control="true"]'];
const SHIELD_MS = 700;

type ClosestNode = {
  closest?: (selector: string) => unknown;
  parentElement?: ClosestNode | null;
};

let shieldUntil = 0;
let shieldTimer = 0;

export function isolateKeywordActivation(event: {
  preventDefault: () => void;
  stopPropagation: () => void;
}): void {
  event.preventDefault();
  event.stopPropagation();
}

function matchesKeyword(node: ClosestNode | null | undefined): boolean {
  if (!node?.closest) return false;
  return KEYWORD_SELECTORS.some((selector) => node.closest!(selector));
}

/** True when the event started on the keyword chip, including a text node inside it. */
export function eventHitsKeyword(event: { target: unknown }): boolean {
  const target = event.target as ClosestNode | null;
  if (matchesKeyword(target)) return true;
  return matchesKeyword(target?.parentElement);
}

export function answerActivationSuppressed(now = Date.now()): boolean {
  return now < shieldUntil;
}

function shieldListener(event: Event) {
  if (!answerActivationSuppressed()) return;
  const target = event.target;
  const element =
    target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
  if (!element) return;
  if (element.closest('[data-practice-keyword-root]')) return;
  if (element.closest('[data-keyword-control="true"]')) return;
  if (!element.closest('.practice-answer')) return;
  event.preventDefault();
  event.stopPropagation();
  if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
}

/** Ignore answer clicks briefly so a dialog-dismiss tap cannot fall through. */
export function suppressAnswerActivation(now = Date.now(), duration = SHIELD_MS): void {
  shieldUntil = Math.max(shieldUntil, now + duration);
  if (typeof document === 'undefined') return;
  document.addEventListener('click', shieldListener, true);
  document.addEventListener('pointerup', shieldListener, true);
  window.clearTimeout(shieldTimer);
  shieldTimer = window.setTimeout(() => {
    document.removeEventListener('click', shieldListener, true);
    document.removeEventListener('pointerup', shieldListener, true);
    shieldUntil = 0;
  }, duration);
}

export function shouldSelectAnswer(
  event: { target: unknown },
  now = Date.now()
): boolean {
  if (answerActivationSuppressed(now)) return false;
  if (eventHitsKeyword(event)) return false;
  return true;
}
