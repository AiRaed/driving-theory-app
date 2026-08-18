#!/usr/bin/env node
/**
 * Full-dataset validation report for vocab hints.
 * Usage: node tools/audit-vocab-hints.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HINTS_FILE = path.join(ROOT, 'data/vocab-hints.json');
const PROGRESS_FILE = path.join(ROOT, 'data/vocab-hints-progress.json');
const QUESTIONS_FILE = path.join(ROOT, 'data/questions.ts');
const LANGS = ['en', 'ar', 'ur', 'ro', 'pl', 'pt'];

function normalizeForMatch(s) {
  return String(s)
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseQuestionIdsAndPrompts(src) {
  const map = {};
  const idMatches = [...src.matchAll(/\{\s*\n\s*id:\s*"([^"]+)"/g)];
  for (let i = 0; i < idMatches.length; i++) {
    const start = idMatches[i].index;
    const end = i + 1 < idMatches.length ? idMatches[i + 1].index : src.length;
    const chunk = src.slice(start, end);
    const id = idMatches[i][1];
    const promptEn = chunk.match(/promptEn:\s*"((?:\\.|[^"\\])*)"/)?.[1]?.replace(/\\"/g, '"') || '';
    const options = [];
    const optionsMatch = chunk.match(/options:\s*\[([\s\S]*?)\]\s*,/);
    if (optionsMatch) {
      const optRe =
        /\{\s*en:\s*"((?:\\.|[^"\\])*)"\s*,\s*ar:\s*"((?:\\.|[^"\\])*)"\s*,\s*correct:\s*(true|false)\s*\}/g;
      let om;
      while ((om = optRe.exec(optionsMatch[1]))) {
        options.push({ en: om[1].replace(/\\"/g, '"'), correct: om[3] === 'true' });
      }
    }
    map[id] = { promptEn, options };
  }
  return map;
}

function main() {
  const questions = parseQuestionIdsAndPrompts(fs.readFileSync(QUESTIONS_FILE, 'utf8'));
  const questionIds = Object.keys(questions);
  const hints = JSON.parse(fs.readFileSync(HINTS_FILE, 'utf8'));
  const progress = fs.existsSync(PROGRESS_FILE)
    ? JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'))
    : { failedIds: [], processedIds: [] };

  let withHints = 0;
  let withoutHints = 0;
  let totalTerms = 0;
  const missingLang = { en: 0, ar: 0, ur: 0, ro: 0, pl: 0, pt: 0 };
  const termNotInQuestion = [];
  const duplicateTermsInQuestion = [];
  const suspiciousLeakage = [];
  const tooManyHints = [];
  const uniqueTerms = new Set();
  const unprocessed = [];

  const leakPatterns = [
    /\bcorrect answer\b/i,
    /\bthe answer is\b/i,
    /\byou should (always )?(choose|select|pick)\b/i,
    /\boption [a-d]\b/i,
  ];

  for (const id of questionIds) {
    if (!(id in hints)) {
      unprocessed.push(id);
      continue;
    }
    const list = hints[id];
    if (!Array.isArray(list) || list.length === 0) {
      withoutHints += 1;
      continue;
    }
    withHints += 1;
    if (list.length > 3) tooManyHints.push(id);
    const seen = new Set();
    const ctx = questions[id];
    const hay = normalizeForMatch(
      [ctx.promptEn, ...ctx.options.map((o) => o.en)].join(' ')
    );
    const correct = ctx.options.filter((o) => o.correct).map((o) => o.en);

    for (const h of list) {
      totalTerms += 1;
      const term = (h.term || '').trim();
      uniqueTerms.add(normalizeForMatch(term));
      const tkey = normalizeForMatch(term);
      if (seen.has(tkey)) duplicateTermsInQuestion.push({ id, term });
      seen.add(tkey);
      if (!hay.includes(tkey)) termNotInQuestion.push({ id, term });

      for (const lang of LANGS) {
        const v = h.translations?.[lang];
        if (!v || !String(v).trim()) missingLang[lang] += 1;
      }
      const en = h.translations?.en || '';
      if (leakPatterns.some((re) => re.test(en))) {
        suspiciousLeakage.push({ id, term, reason: 'pattern' });
      }
      const normEn = normalizeForMatch(en);
      for (const ans of correct) {
        const a = normalizeForMatch(ans);
        if (a.length >= 12 && (normEn.includes(a) || a.includes(normEn))) {
          suspiciousLeakage.push({ id, term, reason: 'matches correct answer' });
        }
      }
    }
  }

  const report = {
    totalQuestions: questionIds.length,
    questionsProcessedInStore: Object.keys(hints).length,
    questionsWithHints: withHints,
    questionsWithNoHints: withoutHints,
    unprocessedCount: unprocessed.length,
    unprocessedSample: unprocessed.slice(0, 20),
    totalVocabularyTermOccurrences: totalTerms,
    uniqueTerms: uniqueTerms.size,
    failedIds: progress.failedIds || [],
    missingTranslationsByLanguage: missingLang,
    duplicateTermsInQuestion: duplicateTermsInQuestion.length,
    duplicateSamples: duplicateTermsInQuestion.slice(0, 10),
    termNotInQuestion: termNotInQuestion.length,
    termNotInQuestionSamples: termNotInQuestion.slice(0, 10),
    suspiciousLeakage: suspiciousLeakage.length,
    suspiciousSamples: suspiciousLeakage.slice(0, 10),
    tooManyHints,
  };

  console.log(JSON.stringify(report, null, 2));
  fs.writeFileSync(
    path.join(ROOT, 'data/vocab-batches/audit-report.json'),
    JSON.stringify(report, null, 2) + '\n'
  );
}

main();
