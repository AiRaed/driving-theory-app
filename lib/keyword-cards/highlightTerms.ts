/**
 * Split official question text into readable segments for Practice.
 * The stored question is never rewritten. A term is highlighted only when the
 * caller passes that card (it must already be linked to this question) and the
 * term or an approved alias appears with a real word boundary.
 * The longest overlapping match wins. Editorial inferences are not phrases here.
 */

import { normalizeMatchText, phraseRegex } from './matchKeywordDrafts';
import { canonicalKeywordTerm, normalizeKeywordTerm } from './rules';

export interface KeywordHighlightSource {
  id: string;
  term_en: string;
  aliases?: readonly string[] | null;
  status?: string | null;
  explanation_en?: string | null;
}

export interface KeywordTextSegment {
  text: string;
  keywordId: string | null;
}

interface Span {
  start: number;
  end: number;
  keywordId: string;
}

function phrasesFor(card: KeywordHighlightSource): string[] {
  const phrases: string[] = [];
  const seen = new Set<string>();
  const add = (value: string) => {
    const phrase = canonicalKeywordTerm(value);
    const key = normalizeKeywordTerm(phrase);
    if (key.length < 2 || seen.has(key)) return;
    seen.add(key);
    phrases.push(phrase);
  };
  add(card.term_en);
  for (const alias of card.aliases || []) add(alias);
  return phrases;
}

function canHighlight(card: KeywordHighlightSource): boolean {
  if (!card?.id || !canonicalKeywordTerm(card.term_en)) return false;
  if (card.status != null && card.status !== 'published') return false;
  if (card.explanation_en != null && !String(card.explanation_en).trim()) return false;
  return true;
}

export function segmentKeywordText(
  text: string,
  keywords: readonly KeywordHighlightSource[]
): KeywordTextSegment[] {
  const source = String(text ?? '');
  const cards = keywords.filter(canHighlight);
  if (!source || cards.length === 0) return [{ text: source, keywordId: null }];

  const normalized = normalizeMatchText(source);
  const spans: Span[] = [];
  for (const card of cards) {
    for (const phrase of phrasesFor(card)) {
      const pattern = phraseRegex(phrase);
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(normalized))) {
        const start = match.index;
        const end = start + match[0].length;
        if (end > start) spans.push({ start, end, keywordId: card.id });
        if (match[0].length === 0) {
          pattern.lastIndex += 1;
          break;
        }
      }
    }
  }

  spans.sort(
    (a, b) =>
      b.end - b.start - (a.end - a.start) || a.start - b.start || a.keywordId.localeCompare(b.keywordId)
  );
  const kept: Span[] = [];
  for (const span of spans) {
    const overlaps = kept.some((accepted) => span.start < accepted.end && span.end > accepted.start);
    if (!overlaps) kept.push(span);
  }
  kept.sort((a, b) => a.start - b.start || a.end - b.end);

  if (!kept.length) return [{ text: source, keywordId: null }];

  const segments: KeywordTextSegment[] = [];
  let cursor = 0;
  for (const span of kept) {
    if (span.start < cursor) continue;
    if (span.start > cursor) segments.push({ text: source.slice(cursor, span.start), keywordId: null });
    segments.push({ text: source.slice(span.start, span.end), keywordId: span.keywordId });
    cursor = span.end;
  }
  if (cursor < source.length) segments.push({ text: source.slice(cursor), keywordId: null });
  return segments;
}

export function highlightedKeywordIds(segments: readonly KeywordTextSegment[]): string[] {
  return segments.flatMap((segment) => (segment.keywordId ? [segment.keywordId] : []));
}
