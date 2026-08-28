#!/usr/bin/env node
/**
 * Merge + validate vocab batch outputs into data/vocab-hints.json
 * Usage: node tools/merge-vocab-batches.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HINTS_FILE = path.join(ROOT, 'data/vocab-hints.json');
const DICT_FILE = path.join(ROOT, 'data/vocab-dictionary.json');
const PROGRESS_FILE = path.join(ROOT, 'data/vocab-hints-progress.json');
const BATCH_DIR = path.join(ROOT, 'data/vocab-batches');
const QUESTIONS_FILE = path.join(ROOT, 'data/questions.ts');

const VOCAB_LANGS = ['en', 'ar', 'ur', 'ro', 'pl', 'pt', 'bn', 'fa'];
const MAX_HINTS = 3;
const MAX_TERM_LEN = 48;
const MAX_EXPLANATION_LEN = 160;

function normalizeForMatch(s) {
  return s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseQuestionsTs(src) {
  const questions = {};
  const idMatches = [...src.matchAll(/\{\s*\n\s*id:\s*"([^"]+)"/g)];
  for (let i = 0; i < idMatches.length; i++) {
    const start = idMatches[i].index;
    const end = i + 1 < idMatches.length ? idMatches[i + 1].index : src.length;
    const chunk = src.slice(start, end);
    const id = idMatches[i][1];
    const topic = chunk.match(/topic:\s*"([^"]+)"/)?.[1];
    const promptEnRaw = chunk.match(/promptEn:\s*"((?:\\.|[^"\\])*)"/)?.[1];
    if (!topic || !promptEnRaw) continue;
    const promptEn = promptEnRaw.replace(/\\"/g, '"');
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
    questions[id] = { id, topic, promptEn, options };
  }
  return questions;
}

function termAppears(term, ctx) {
  const needle = normalizeForMatch(term);
  if (!needle || needle.length < 2) return false;
  const hay = normalizeForMatch(
    [ctx.promptEn, ...ctx.options.map((o) => o.en)].join(' ')
  );
  return hay.includes(needle);
}

function isTrivial(term) {
  const t = normalizeForMatch(term);
  const trivial = new Set([
    'you','your','the','a','an','and','or','to','of','in','on','at','for','with','from',
    'what','when','where','why','how','should','must','can','will','do','does','is','are','be',
    'drive','driving','driver','car','road','vehicle','vehicles','this','that','these','those',
  ]);
  return trivial.has(t) || t.length <= 2;
}

function looksLikeLeakage(text, correctAnswers) {
  const patterns = [
    /\bcorrect answer\b/i,
    /\bright answer\b/i,
    /\byou should (always )?(choose|select|pick)\b/i,
    /\bthe answer is\b/i,
    /\bmust choose\b/i,
    /\boption [a-d]\b/i,
  ];
  if (patterns.some((re) => re.test(text))) return true;
  const norm = normalizeForMatch(text);
  for (const ans of correctAnswers) {
    const a = normalizeForMatch(ans);
    if (a.length >= 12 && (norm.includes(a) || a.includes(norm))) return true;
  }
  return false;
}

function validateHints(raw, ctx) {
  const errors = [];
  if (!Array.isArray(raw)) return { hints: [], errors: ['not array'] };
  const correctAnswers = ctx.options.filter((o) => o.correct).map((o) => o.en);
  const seen = new Set();
  const hints = [];
  for (const item of raw.slice(0, MAX_HINTS + 2)) {
    if (hints.length >= MAX_HINTS) break;
    if (!item || typeof item !== 'object') continue;
    const term = typeof item.term === 'string' ? item.term.trim() : '';
    if (!term || term.length > MAX_TERM_LEN || isTrivial(term)) {
      errors.push(`bad term: ${term || '(empty)'}`);
      continue;
    }
    const key = normalizeForMatch(term);
    if (seen.has(key)) {
      errors.push(`dup: ${term}`);
      continue;
    }
    if (!termAppears(term, ctx)) {
      errors.push(`missing in Q: ${term}`);
      continue;
    }
    const trSrc =
      item.translations && typeof item.translations === 'object'
        ? item.translations
        : item;
    const translations = {};
    let bad = false;
    for (const lang of VOCAB_LANGS) {
      const v = typeof trSrc[lang] === 'string' ? trSrc[lang].trim() : '';
      if (!v || v.length > MAX_EXPLANATION_LEN) {
        bad = true;
        errors.push(`lang ${lang} bad for ${term}`);
        break;
      }
      translations[lang] = v;
    }
    if (bad) continue;
    if (looksLikeLeakage(translations.en, correctAnswers)) {
      errors.push(`leak: ${term}`);
      continue;
    }
    const defMatch = ctx.promptEn.match(
      /what is (?:a |an |the )?['"]?([^'"?]+)['"]?\??/i
    );
    if (defMatch) {
      const defined = normalizeForMatch(defMatch[1]);
      if (defined === key || defined.includes(key) || key.includes(defined)) {
        errors.push(`def subject: ${term}`);
        continue;
      }
    }
    seen.add(key);
    hints.push({ term, translations });
  }
  return { hints, errors };
}

function main() {
  const questions = parseQuestionsTs(fs.readFileSync(QUESTIONS_FILE, 'utf8'));
  const hintsStore = JSON.parse(fs.readFileSync(HINTS_FILE, 'utf8'));
  const dictionary = JSON.parse(fs.readFileSync(DICT_FILE, 'utf8'));
  const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));

  const outFiles = fs
    .readdirSync(BATCH_DIR)
    .filter((f) => /^out-\d+\.json$/.test(f))
    .sort();

  let mergedQuestions = 0;
  let mergedHints = 0;
  let rejected = 0;
  const failed = [];

  for (const file of outFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, file), 'utf8'));
    // Accept either { "AL-01": [...] } or { results: { "AL-01": [...] } }
    const map = data.results && typeof data.results === 'object' ? data.results : data;
    for (const [id, rawHints] of Object.entries(map)) {
      if (id === 'meta' || id === 'results') continue;
      const ctx = questions[id];
      if (!ctx) {
        failed.push({ id, reason: 'unknown question id' });
        continue;
      }
      // Never overwrite existing non-empty approved sample unless empty placeholder
      if (id in hintsStore && Array.isArray(hintsStore[id])) {
        // Already processed — skip (protect sample)
        continue;
      }
      const { hints, errors } = validateHints(rawHints, ctx);
      if (errors.length && hints.length === 0 && Array.isArray(rawHints) && rawHints.length > 0) {
        failed.push({ id, reason: errors.join('; ') });
        rejected += 1;
        // Still mark as processed with empty if all rejected? Prefer leave for retry
        continue;
      }
      hintsStore[id] = hints;
      mergedQuestions += 1;
      mergedHints += hints.length;
      for (const h of hints) {
        const existingKey = Object.keys(dictionary).find(
          (k) => normalizeForMatch(k) === normalizeForMatch(h.term)
        );
        if (!existingKey) {
          dictionary[h.term] = { translations: { ...h.translations } };
        }
      }
      if (!progress.processedIds.includes(id)) progress.processedIds.push(id);
    }
  }

  progress.updatedAt = new Date().toISOString();
  progress.failedIds = failed.map((f) => f.id);
  progress.stats = {
    questionsProcessed: progress.processedIds.length,
    hintsCreated: Object.values(hintsStore).reduce(
      (n, a) => n + (Array.isArray(a) ? a.length : 0),
      0
    ),
    apiCalls: progress.stats?.apiCalls || 0,
    dictionaryHits: progress.stats?.dictionaryHits || 0,
    lastMerge: {
      files: outFiles.length,
      mergedQuestions,
      mergedHints,
      rejected,
      at: progress.updatedAt,
    },
  };

  fs.writeFileSync(HINTS_FILE, JSON.stringify(hintsStore, null, 2) + '\n');
  fs.writeFileSync(DICT_FILE, JSON.stringify(dictionary, null, 2) + '\n');
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2) + '\n');
  fs.writeFileSync(
    path.join(BATCH_DIR, 'last-merge-report.json'),
    JSON.stringify({ mergedQuestions, mergedHints, rejected, failed, outFiles }, null, 2)
  );

  console.log(
    JSON.stringify(
      {
        outFiles: outFiles.length,
        mergedQuestions,
        mergedHints,
        rejected,
        failed: failed.length,
        storeSize: Object.keys(hintsStore).length,
      },
      null,
      2
    )
  );
}

main();
