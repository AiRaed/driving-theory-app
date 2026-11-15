/**
 * Match curated driving-theory phrases to official question text.
 * A shorter phrase is dropped only when a longer accepted phrase contains it,
 * so "speed limit" is not also linked inside "national speed limit", while
 * "right-hand lane" and "lane closed" can both link when they merely overlap.
 * Wrong options are never searched.
 */

import { canonicalKeywordTerm, normalizeKeywordTerm } from './rules';
import type {
  EditorialPattern,
  EvidenceField,
  KeywordDraft,
  KeywordDraftLink,
  LexiconEntry,
  OfficialQuestionText,
} from './draftTypes';

export interface PreparedAlias {
  termIndex: number;
  alias: string;
  regex: RegExp;
}

interface RawHit {
  termIndex: number;
  alias: string;
  field: EvidenceField;
  start: number;
  end: number;
  snippet: string;
  grounding: 'source' | 'editorial';
}

const APOSTROPHE = /['’]/g;

export function normalizeMatchText(input: string): string {
  return String(input || '').replace(/[’‘]/g, "'").replace(/[“”]/g, '"');
}

export function phraseRegex(phrase: string): RegExp {
  const compact = phrase.trim().replace(/\s+/g, ' ');
  if (!compact) throw new Error('Empty keyword alias');
  let body = compact.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  body = body.replace(/\\'/g, "['’]");
  body = body.replace(/ /g, '\\s+');
  const numeric = /^\d+$/.test(compact);
  const source = numeric
    ? `(?<!\\d)${body}(?!\\d)`
    : `(?<![A-Za-z0-9])${body}(?![A-Za-z0-9])`;
  return new RegExp(source, 'gi');
}

export function prepareAliases(entries: LexiconEntry[]): PreparedAlias[] {
  return entries.flatMap((entry, termIndex) =>
    entry.aliases.map((alias) => ({
      termIndex,
      alias: alias.trim().replace(/\s+/g, ' '),
      regex: phraseRegex(alias),
    }))
  );
}

function snippetAround(original: string, start: number, end: number): string {
  const pad = 72;
  const from = Math.max(0, start - pad);
  const to = Math.min(original.length, end + pad);
  let text = original.slice(from, to).replace(/\s+/g, ' ').trim();
  if (from > 0) text = `…${text}`;
  if (to < original.length) text = `${text}…`;
  return text.slice(0, 240);
}

function collectFieldHits(
  field: EvidenceField,
  original: string,
  aliases: PreparedAlias[],
  grounding: 'source' | 'editorial',
  allowedTerms?: Set<number>
): RawHit[] {
  if (!original.trim()) return [];
  const normalized = normalizeMatchText(original);
  const hits: RawHit[] = [];
  for (const alias of aliases) {
    if (allowedTerms && !allowedTerms.has(alias.termIndex)) continue;
    alias.regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = alias.regex.exec(normalized))) {
      const start = match.index;
      const end = start + match[0].length;
      hits.push({
        termIndex: alias.termIndex,
        alias: alias.alias,
        field,
        start,
        end,
        snippet: snippetAround(original, start, end),
        grounding,
      });
      if (match[0].length === 0) break;
    }
  }
  return hits;
}

/** Drop a hit when a longer hit on the same field fully contains it. */
export function suppressContainedHits(hits: RawHit[]): RawHit[] {
  const ordered = [...hits].sort((a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start);
  const kept: RawHit[] = [];
  for (const hit of ordered) {
    const nested = kept.some(
      (accepted) =>
        accepted.field === hit.field &&
        accepted.start <= hit.start &&
        accepted.end >= hit.end &&
        accepted.end - accepted.start > hit.end - hit.start
    );
    if (!nested) kept.push(hit);
  }
  return kept;
}

function pushEvidence(link: KeywordDraftLink, hit: RawHit) {
  const duplicate = link.evidence.some(
    (item) => item.field === hit.field && item.alias.toLowerCase() === hit.alias.toLowerCase()
  );
  if (duplicate || link.evidence.length >= 3) return;
  link.evidence.push({
    field: hit.field,
    alias: hit.alias,
    grounding: hit.grounding,
    snippet: hit.snippet,
  });
}

export function matchQuestionKeywords(
  question: OfficialQuestionText,
  entries: LexiconEntry[],
  aliases: PreparedAlias[],
  editorial: EditorialPattern[]
): Array<{ termIndex: number; link: KeywordDraftLink }> {
  const fields: Array<[EvidenceField, string]> = [
    ['prompt', question.prompt],
    ['correct_answer', question.correctAnswer],
    ['explanation', question.explanation],
  ];
  let hits: RawHit[] = [];
  for (const [field, text] of fields) {
    hits = hits.concat(collectFieldHits(field, text, aliases, 'source'));
  }
  hits = suppressContainedHits(hits);

  const byTerm = new Map<number, KeywordDraftLink>();
  for (const hit of hits) {
    let link = byTerm.get(hit.termIndex);
    if (!link) {
      link = { question_id: question.id, grounding: 'source', evidence: [] };
      byTerm.set(hit.termIndex, link);
    }
    pushEvidence(link, hit);
  }

  const editorialAliases: PreparedAlias[] = [];
  for (const pattern of editorial) {
    const termIndex = entries.findIndex((entry) => entry.term_en === pattern.term_en);
    if (termIndex < 0) throw new Error(`Editorial pattern has no keyword: ${pattern.term_en}`);
    if (byTerm.has(termIndex)) continue;
    for (const phrase of pattern.phrases) {
      editorialAliases.push({ termIndex, alias: phrase, regex: phraseRegex(phrase) });
    }
  }
  if (editorialAliases.length) {
    let editorialHits: RawHit[] = [];
    for (const [field, text] of fields) {
      editorialHits = editorialHits.concat(
        collectFieldHits(field, text, editorialAliases, 'editorial')
      );
    }
    editorialHits = suppressContainedHits(editorialHits);
    for (const hit of editorialHits) {
      let link = byTerm.get(hit.termIndex);
      if (!link) {
        link = { question_id: question.id, grounding: 'editorial', evidence: [] };
        byTerm.set(hit.termIndex, link);
      }
      pushEvidence(link, hit);
    }
  }

  return Array.from(byTerm.entries())
    .map(([termIndex, link]) => ({ termIndex, link }))
    .sort((a, b) => entries[a.termIndex].term_en.localeCompare(entries[b.termIndex].term_en));
}

export function draftIdFor(term: string): string {
  const slug = normalizeKeywordTerm(term)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `kw_${slug}`;
}

export function notesFor(entry: LexiconEntry, hasEditorial: boolean): string | null {
  const parts = [
    entry.label_origin === 'editorial_label'
      ? 'Canonical name is an editorial label for a phrase in the official text. Confirm the name before import.'
      : null,
    hasEditorial
      ? 'At least one question is linked from a described action rather than the keyword itself.'
      : null,
    entry.review_note || null,
    entry.watch_coverage
      ? 'Linked wherever the words appear. Check that the coverage is not wider than the card needs.'
      : null,
  ].filter(Boolean);
  return parts.length ? parts.join(' ') : null;
}

export function buildKeywordDrafts(
  questions: OfficialQuestionText[],
  entries: LexiconEntry[],
  editorial: EditorialPattern[]
): KeywordDraft[] {
  const aliases = prepareAliases(entries);
  const grouped = entries.map(() => new Map<string, KeywordDraftLink>());
  for (const question of questions) {
    for (const match of matchQuestionKeywords(question, entries, aliases, editorial)) {
      grouped[match.termIndex].set(question.id, match.link);
    }
  }

  const drafts: KeywordDraft[] = [];
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const links = Array.from(grouped[index].values()).sort((a, b) =>
      a.question_id.localeCompare(b.question_id)
    );
    if (!links.length) continue;
    const sourceCount = links.filter((link) => link.grounding === 'source').length;
    const editorialCount = links.length - sourceCount;
    const grounding =
      sourceCount && editorialCount ? 'mixed' : editorialCount ? 'editorial' : 'source';
    const matched = new Set<string>();
    for (const link of links) {
      for (const item of link.evidence) matched.add(item.alias);
    }
    const reviewFlag = Boolean(entry.review_flag) || grounding !== 'source';
    const reviewConcern = reviewFlag
      ? entry.review_concern ||
        (entry.label_origin === 'editorial_label'
          ? 'terminology'
          : grounding !== 'source'
            ? 'mapping'
            : 'explanation')
      : null;
    const term_en = canonicalKeywordTerm(entry.term_en);
    drafts.push({
      draft_id: draftIdFor(term_en),
      term_en,
      term_normalized: normalizeKeywordTerm(term_en),
      explanation_en: entry.explanation_en.trim(),
      example_en: String(entry.example_en || '').trim(),
      translation_ar: '',
      explanation_ar: '',
      image_url: null,
      image_alt: null,
      image_storage_path: null,
      image_recommended: Boolean(entry.image_concept),
      image_concept: entry.image_concept,
      priority: entry.priority,
      status: 'draft',
      published: false,
      label_origin: entry.label_origin || 'source_term',
      grounding,
      review_flag: reviewFlag,
      review_note: entry.review_note || null,
      review_concern: reviewConcern,
      previous_explanation_en: entry.previous_explanation_en?.trim() || null,
      watch_coverage: Boolean(entry.watch_coverage),
      notes: notesFor({ ...entry, review_flag: reviewFlag }, editorialCount > 0),
      aliases: entry.aliases.map((alias) => alias.trim().replace(/\s+/g, ' ')),
      matched_forms: Array.from(matched).sort((a, b) => a.localeCompare(b)),
      question_ids: links.map((link) => link.question_id),
      links,
    });
  }
  drafts.sort((a, b) => a.term_normalized.localeCompare(b.term_normalized));
  return drafts;
}

export function aliasAppearsInSnippet(alias: string, snippet: string): boolean {
  const pattern = phraseRegex(alias);
  const haystack = normalizeMatchText(snippet).replace(/^…/, '').replace(/…$/, '');
  pattern.lastIndex = 0;
  if (pattern.test(haystack)) return true;
  const compactAlias = alias.toLowerCase().replace(APOSTROPHE, "'").replace(/\s+/g, ' ');
  const compactSnippet = normalizeMatchText(snippet).toLowerCase().replace(APOSTROPHE, "'").replace(/\s+/g, ' ');
  return compactSnippet.includes(compactAlias);
}
