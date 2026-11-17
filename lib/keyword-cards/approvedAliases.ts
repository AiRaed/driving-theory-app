/**
 * Approved literal phrases for a canonical keyword.
 * These are the lexicon aliases (inflections and the same concept's official
 * names). Editorial patterns are not included: a shoulder check is not the
 * words "blind spot", so it must not be highlighted as that card.
 * This module is for the server and tests. The Practice client receives only
 * the aliases for the cards linked to the current question.
 */

import { EDITORIAL_PATTERNS, KEYWORD_LEXICON } from './draftLexicon';
import { canonicalKeywordTerm, normalizeKeywordTerm } from './rules';

const editorialPhrases = new Set(
  EDITORIAL_PATTERNS.flatMap((pattern) =>
    pattern.phrases.map((phrase) => normalizeKeywordTerm(phrase))
  )
);

const aliasesByTerm = new Map<string, string[]>();
for (const entry of KEYWORD_LEXICON) {
  const phrases: string[] = [];
  const seen = new Set<string>();
  for (const alias of entry.aliases) {
    const phrase = canonicalKeywordTerm(alias);
    const key = normalizeKeywordTerm(phrase);
    if (!key || editorialPhrases.has(key) || seen.has(key)) continue;
    seen.add(key);
    phrases.push(phrase);
  }
  aliasesByTerm.set(normalizeKeywordTerm(entry.term_en), phrases);
}

export function approvedAliasesForTerm(term: string): string[] {
  return aliasesByTerm.get(normalizeKeywordTerm(term)) || [];
}
