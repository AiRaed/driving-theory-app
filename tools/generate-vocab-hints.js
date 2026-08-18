#!/usr/bin/env node
/**
 * Smart Vocabulary Hints — resumable AI enrichment
 *
 * Analyses UK driving theory questions and stores vocabulary hints in:
 *   data/vocab-hints.json
 * with a reusable dictionary cache:
 *   data/vocab-dictionary.json
 * progress:
 *   data/vocab-hints-progress.json
 *
 * Usage examples:
 *   node tools/generate-vocab-hints.mjs --sample=16 --dry-run
 *   node tools/generate-vocab-hints.mjs --sample=16
 *   node tools/generate-vocab-hints.mjs --ids=MW-01,SM-31
 *   node tools/generate-vocab-hints.mjs --limit=50
 *   node tools/generate-vocab-hints.mjs --force   # overwrite existing good hints
 *
 * Requires OPENAI_API_KEY in the environment (or .env.local).
 *
 * Does NOT modify question text, answers, translations, or scoring.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const QUESTIONS_FILE = path.join(ROOT, 'data/questions.ts');
const HINTS_FILE = path.join(ROOT, 'data/vocab-hints.json');
const DICT_FILE = path.join(ROOT, 'data/vocab-dictionary.json');
const PROGRESS_FILE = path.join(ROOT, 'data/vocab-hints-progress.json');
const ENV_LOCAL = path.join(ROOT, '.env.local');

const VOCAB_LANGS = ['en', 'ar', 'ur', 'ro', 'pl'];
const MAX_HINTS = 3;
const MAX_TERM_LEN = 48;
const MAX_EXPLANATION_LEN = 160;
const MODEL = process.env.OPENAI_VOCAB_MODEL || 'gpt-4o-mini';

function loadEnvLocal() {
  if (!fs.existsSync(ENV_LOCAL)) return;
  const text = fs.readFileSync(ENV_LOCAL, 'utf8');
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function parseArgs(argv) {
  const args = {
    sample: null,
    limit: null,
    ids: null,
    dryRun: false,
    force: false,
    sleepMs: 400,
  };
  for (const a of argv) {
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--force') args.force = true;
    else if (a.startsWith('--sample=')) args.sample = Number(a.split('=')[1]);
    else if (a.startsWith('--limit=')) args.limit = Number(a.split('=')[1]);
    else if (a.startsWith('--ids='))
      args.ids = a
        .split('=')[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    else if (a.startsWith('--sleep-ms=')) args.sleepMs = Number(a.split('=')[1]);
  }
  return args;
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function parseQuestionsTs(src) {
  const questions = [];
  // Split on question object starts that include id + topic + promptEn
  const idMatches = [...src.matchAll(/\{\s*\n\s*id:\s*"([^"]+)"/g)];
  for (let i = 0; i < idMatches.length; i++) {
    const start = idMatches[i].index;
    const end = i + 1 < idMatches.length ? idMatches[i + 1].index : src.length;
    const chunk = src.slice(start, end);
    const id = idMatches[i][1];
    const topic = chunk.match(/topic:\s*"([^"]+)"/)?.[1];
    const promptEnRaw = chunk.match(/promptEn:\s*"((?:\\.|[^"\\])*)"/)?.[1];
    if (!topic || !promptEnRaw) continue;
    const promptEn = promptEnRaw.replace(/\\"/g, '"').replace(/\\n/g, '\n');
    const options = [];
    const optionsMatch = chunk.match(/options:\s*\[([\s\S]*?)\]\s*,/);
    if (optionsMatch) {
      const optRe =
        /\{\s*en:\s*"((?:\\.|[^"\\])*)"\s*,\s*ar:\s*"((?:\\.|[^"\\])*)"\s*,\s*correct:\s*(true|false)\s*\}/g;
      let om;
      while ((om = optRe.exec(optionsMatch[1]))) {
        options.push({
          en: om[1].replace(/\\"/g, '"'),
          correct: om[3] === 'true',
        });
      }
    }
    questions.push({ id, topic, promptEn, options });
  }
  return questions;
}

function normalizeForMatch(s) {
  return s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
    'you',
    'your',
    'the',
    'a',
    'an',
    'and',
    'or',
    'to',
    'of',
    'in',
    'on',
    'at',
    'for',
    'with',
    'from',
    'what',
    'when',
    'where',
    'why',
    'how',
    'should',
    'must',
    'can',
    'will',
    'do',
    'does',
    'is',
    'are',
    'be',
    'drive',
    'driving',
    'driver',
    'car',
    'road',
    'vehicle',
    'vehicles',
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
  if (!Array.isArray(raw)) return { ok: false, errors: ['not an array'], hints: [] };
  const correctAnswers = ctx.options.filter((o) => o.correct).map((o) => o.en);
  const seen = new Set();
  const hints = [];

  for (const item of raw.slice(0, MAX_HINTS + 2)) {
    if (hints.length >= MAX_HINTS) break;
    if (!item || typeof item !== 'object') continue;
    const term = typeof item.term === 'string' ? item.term.trim() : '';
    if (!term || term.length > MAX_TERM_LEN || isTrivial(term)) {
      errors.push(`bad/trivial term: ${term || '(empty)'}`);
      continue;
    }
    const key = normalizeForMatch(term);
    if (seen.has(key)) {
      errors.push(`duplicate: ${term}`);
      continue;
    }
    if (!termAppears(term, ctx)) {
      errors.push(`not in question: ${term}`);
      continue;
    }

    const trSrc = item.translations && typeof item.translations === 'object' ? item.translations : item;
    const translations = {};
    let missing = false;
    for (const lang of VOCAB_LANGS) {
      const v = typeof trSrc[lang] === 'string' ? trSrc[lang].trim() : '';
      if (!v || v.length > MAX_EXPLANATION_LEN) {
        missing = true;
        break;
      }
      translations[lang] = v;
    }
    if (missing) {
      errors.push(`incomplete/too long translations: ${term}`);
      continue;
    }
    if (looksLikeLeakage(translations.en, correctAnswers)) {
      errors.push(`leakage: ${term}`);
      continue;
    }

    const defMatch = ctx.promptEn.match(
      /what is (?:a |an |the )?['"]?([^'"?]+)['"]?\??/i
    );
    if (defMatch) {
      const defined = normalizeForMatch(defMatch[1]);
      if (defined === key || defined.includes(key) || key.includes(defined)) {
        errors.push(`definition subject skipped: ${term}`);
        continue;
      }
    }

    seen.add(key);
    hints.push({ term, translations });
  }

  return { ok: true, errors, hints };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildPrompt(q) {
  const optionsText = q.options
    .map((o, i) => `${i + 1}. ${o.en}${o.correct ? ' [CORRECT]' : ''}`)
    .join('\n');

  return `You are enriching UK Driving Theory practice questions with vocabulary hints for non-native English learners.

TASK:
Identify 0–3 genuinely difficult English words or short phrases from this question that a learner might not know (British driving terminology, formal road terms, etc.).

RULES:
- Many easy questions need ZERO hints. Prefer fewer hints.
- Only include terms that actually appear in the question text or answer options.
- Explain ONLY the meaning as used in THIS driving-theory context.
- Do NOT reveal, hint at, or paraphrase the correct answer.
- Do NOT tell the user what to choose.
- Do NOT explain how to solve the question.
- English explanations: one short simple sentence for learners.
- Also provide natural concise explanations in Arabic (ar), Urdu (ur), Romanian (ro), and Polish (pl).
- Avoid ordinary words (you, road, car, drive, when, should, …).

Return ONLY valid JSON in this exact shape:
{"hints":[{"term":"hard shoulder","translations":{"en":"...","ar":"...","ur":"...","ro":"..."}}]}

If no useful vocabulary hints are needed, return: {"hints":[]}

QUESTION ID: ${q.id}
TOPIC: ${q.topic}
QUESTION: ${q.promptEn}
OPTIONS:
${optionsText}
`;
}

async function callOpenAI(apiKey, q) {
  const body = {
    model: MODEL,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You output only valid JSON for vocabulary hints. Never reveal quiz answers.',
      },
      { role: 'user', content: buildPrompt(q) },
    ],
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI HTTP ${res.status}: ${text.slice(0, 400)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Model returned non-JSON');
  }
  return {
    hints: Array.isArray(parsed.hints) ? parsed.hints : [],
    usage: data.usage || null,
  };
}

function applyDictionary(hints, dictionary) {
  return hints.map((h) => {
    const key = Object.keys(dictionary).find(
      (k) => normalizeForMatch(k) === normalizeForMatch(h.term)
    );
    if (!key) return h;
    // Reuse dictionary meaning when context-compatible (same term)
    return {
      term: h.term,
      translations: { ...dictionary[key].translations },
    };
  });
}

function updateDictionary(dictionary, hints) {
  for (const h of hints) {
    const existingKey = Object.keys(dictionary).find(
      (k) => normalizeForMatch(k) === normalizeForMatch(h.term)
    );
    if (!existingKey) {
      dictionary[h.term] = { translations: { ...h.translations } };
    }
  }
}

async function main() {
  loadEnvLocal();
  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env.OPENAI_API_KEY;

  console.log('[vocab-hints] Loading questions…');
  const questions = parseQuestionsTs(fs.readFileSync(QUESTIONS_FILE, 'utf8'));
  console.log(`[vocab-hints] Parsed ${questions.length} questions`);

  const hintsStore = readJson(HINTS_FILE, {});
  const dictionary = readJson(DICT_FILE, {});
  const progress = readJson(PROGRESS_FILE, {
    version: 1,
    updatedAt: new Date().toISOString(),
    processedIds: [],
    failedIds: [],
    skippedIds: [],
    stats: {
      questionsProcessed: 0,
      hintsCreated: 0,
      apiCalls: 0,
      dictionaryHits: 0,
    },
  });

  const processedSet = new Set(progress.processedIds || []);

  let queue = questions;
  if (args.ids?.length) {
    const idSet = new Set(args.ids);
    queue = questions.filter((q) => idSet.has(q.id));
  }

  // Prefer questions that look terminology-heavy for --sample
  if (args.sample && Number.isFinite(args.sample)) {
    const priority =
      /blind spot|carriageway|hard shoulder|contraflow|give way|stopping distance|level crossing|box junction|pelican|zebra|fog lights|tyre|national speed|one-way|overtaken|skid|motorway|reservation/i;
    const ranked = [...queue].sort((a, b) => {
      const as = priority.test(a.promptEn) ? 0 : 1;
      const bs = priority.test(b.promptEn) ? 0 : 1;
      return as - bs;
    });
    queue = ranked.slice(0, args.sample);
  }

  if (args.limit && Number.isFinite(args.limit)) {
    queue = queue.slice(0, args.limit);
  }

  if (!args.force) {
    queue = queue.filter((q) => {
      if (!(q.id in hintsStore) && !processedSet.has(q.id)) return true;
      // Already have an entry (including []) — skip unless force
      return false;
    });
  }

  console.log(`[vocab-hints] Queue size: ${queue.length}`);
  console.log(`[vocab-hints] Model: ${MODEL}`);
  console.log(`[vocab-hints] Dry run: ${args.dryRun}`);

  if (!args.dryRun && !apiKey) {
    console.error(
      '[vocab-hints] OPENAI_API_KEY is required (set in env or .env.local).'
    );
    process.exit(1);
  }

  let apiCalls = 0;
  let hintsCreated = 0;
  let dictHits = 0;

  for (let i = 0; i < queue.length; i++) {
    const q = queue[i];
    console.log(`\n[${i + 1}/${queue.length}] ${q.id} — ${q.promptEn.slice(0, 70)}…`);

    if (args.dryRun) {
      console.log('  (dry-run) would analyse this question');
      continue;
    }

    try {
      const { hints: rawHints, usage } = await callOpenAI(apiKey, q);
      apiCalls += 1;
      if (usage) {
        console.log(
          `  tokens: prompt=${usage.prompt_tokens} completion=${usage.completion_tokens}`
        );
      }

      // Prefer dictionary translations when term already known
      let merged = rawHints.map((h) => {
        const key = Object.keys(dictionary).find(
          (k) => normalizeForMatch(k) === normalizeForMatch(h.term || '')
        );
        if (key) {
          dictHits += 1;
          return { term: h.term, translations: dictionary[key].translations };
        }
        return h;
      });

      const validated = validateHints(merged, q);
      if (validated.errors.length) {
        console.log('  validation notes:', validated.errors.join('; '));
      }

      // One retry if model returned hints that all failed validation but raw was non-empty
      let finalHints = validated.hints;
      if (rawHints.length > 0 && finalHints.length === 0) {
        console.log('  retrying once after validation failure…');
        await sleep(args.sleepMs);
        const retry = await callOpenAI(apiKey, q);
        apiCalls += 1;
        const v2 = validateHints(retry.hints, q);
        finalHints = v2.hints;
        if (v2.errors.length) {
          console.log('  retry notes:', v2.errors.join('; '));
        }
      }

      finalHints = applyDictionary(finalHints, dictionary);
      updateDictionary(dictionary, finalHints);

      hintsStore[q.id] = finalHints;
      hintsCreated += finalHints.length;
      processedSet.add(q.id);
      progress.failedIds = (progress.failedIds || []).filter((id) => id !== q.id);

      console.log(`  saved ${finalHints.length} hint(s)`);
      finalHints.forEach((h) => console.log(`    • ${h.term}`));

      // Persist after each question (resumable)
      progress.processedIds = Array.from(processedSet);
      progress.updatedAt = new Date().toISOString();
      progress.stats = {
        questionsProcessed: processedSet.size,
        hintsCreated: Object.values(hintsStore).reduce(
          (n, arr) => n + (Array.isArray(arr) ? arr.length : 0),
          0
        ),
        apiCalls: (progress.stats?.apiCalls || 0) + 1,
        dictionaryHits: (progress.stats?.dictionaryHits || 0) + dictHits,
      };
      // Reset per-question dictHits counter accumulation carefully
      dictHits = 0;

      writeJson(HINTS_FILE, hintsStore);
      writeJson(DICT_FILE, dictionary);
      writeJson(PROGRESS_FILE, progress);

      await sleep(args.sleepMs);
    } catch (err) {
      console.error(`  FAILED ${q.id}:`, err.message || err);
      if (!progress.failedIds.includes(q.id)) progress.failedIds.push(q.id);
      writeJson(PROGRESS_FILE, progress);
      await sleep(args.sleepMs * 2);
    }
  }

  console.log('\n[vocab-hints] Done.');
  console.log(`  API calls this run: ${apiCalls}`);
  console.log(`  Hints created this run: ${hintsCreated}`);
  console.log(`  Store file: ${HINTS_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
