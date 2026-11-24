/**
 * Keyword taps must not become answer selections.
 * Callers stop the event before the surrounding option handler runs.
 */

export function isolateKeywordActivation(event: {
  preventDefault: () => void;
  stopPropagation: () => void;
}): void {
  event.preventDefault();
  event.stopPropagation();
}
