#!/usr/bin/env node
/**
 * Merge Polish question batch outputs into public/locales/pl.json (+ locales/pl.json)
 * Expects data/pl-batches/out-q-XX.json files shaped as:
 * { "TOPIC": { "ID": { "promptPl": "...", "options": [{ "pl": "..." }, ...] } } }
 * or flat: { "ID": { "topic", "promptPl", "options": [...] } }
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BATCH_DIR = path.join(ROOT, 'data/pl-batches');
const OUT_PUBLIC = path.join(ROOT, 'public/locales/pl.json');
const OUT_LOCALES = path.join(ROOT, 'locales/pl.json');
const QUESTIONS = path.join(ROOT, 'data/questions.ts');

function parseEnglishQuestions(src) {
  const map = {};
  const idMatches = [...src.matchAll(/\{\s*\n\s*id:\s*"([^"]+)"/g)];
  for (let i = 0; i < idMatches.length; i++) {
    const start = idMatches[i].index;
    const end = i + 1 < idMatches.length ? idMatches[i + 1].index : src.length;
    const chunk = src.slice(start, end);
    const id = idMatches[i][1];
    const topic = chunk.match(/topic:\s*"([^"]+)"/)?.[1];
    const promptEn = chunk.match(/promptEn:\s*"((?:\\.|[^"\\])*)"/)?.[1]?.replace(/\\"/g, '"');
    const options = [];
    const om = chunk.match(/options:\s*\[([\s\S]*?)\]\s*,/);
    if (om) {
      const re =
        /\{\s*en:\s*"((?:\\.|[^"\\])*)"\s*,\s*ar:\s*"((?:\\.|[^"\\])*)"\s*,\s*correct:\s*(true|false)\s*\}/g;
      let m;
      while ((m = re.exec(om[1]))) options.push(m[1].replace(/\\"/g, '"'));
    }
    if (topic && promptEn) map[id] = { topic, promptEn, options };
  }
  return map;
}

function looksPolish(text) {
  if (!text || typeof text !== 'string') return false;
  const t = text.trim();
  if (t.length < 2) return false;
  // Reject if identical to English source (checked by caller) or mostly Arabic/Urdu
  if (/[\u0600-\u06FF]/.test(t)) return false;
  return true;
}

/** Options that may match English on purpose (units, UK proper names) — same as RO locale. */
function mayKeepEnglish(option) {
  const t = String(option || '').trim();
  if (/^\d+([.,]\d+)?\s*(mph|mm)$/i.test(t)) return true;
  if (/^(Puffin|Pelican|Zebra|Toucan|Van|ABS|ESC|MOT|DVLA|STOP)$/i.test(t)) return true;
  return false;
}

function main() {
  const enMap = parseEnglishQuestions(fs.readFileSync(QUESTIONS, 'utf8'));
  let store = {};
  if (fs.existsSync(OUT_PUBLIC)) {
    try {
      store = JSON.parse(fs.readFileSync(OUT_PUBLIC, 'utf8'));
    } catch {
      store = {};
    }
  }

  const outFiles = fs
    .readdirSync(BATCH_DIR)
    .filter((f) => /^out-q-\d+\.json$/.test(f))
    .sort();

  let merged = 0;
  let skipped = 0;
  const errors = [];

  for (const file of outFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, file), 'utf8'));
    // Support nested by topic OR flat by id with topic field OR { results: ... }
    const root = data.results || data;

    const entries = [];
    for (const [k, v] of Object.entries(root)) {
      if (k === 'meta') continue;
      if (v && typeof v === 'object' && (v.promptPl || v.options)) {
        // flat: id -> { topic?, promptPl, options }
        entries.push({ id: k, topic: v.topic || enMap[k]?.topic, ...v });
      } else if (v && typeof v === 'object') {
        // topic -> { id -> entry }
        for (const [id, entry] of Object.entries(v)) {
          if (entry && typeof entry === 'object' && entry.promptPl) {
            entries.push({ id, topic: k, ...entry });
          }
        }
      }
    }

    for (const entry of entries) {
      const { id, topic, promptPl, options } = entry;
      const en = enMap[id];
      if (!en) {
        errors.push({ id, reason: 'unknown id' });
        continue;
      }
      const t = topic || en.topic;
      if (!looksPolish(promptPl)) {
        errors.push({ id, reason: 'bad promptPl' });
        skipped++;
        continue;
      }
      if (promptPl.trim() === en.promptEn.trim()) {
        errors.push({ id, reason: 'prompt still English' });
        skipped++;
        continue;
      }
      if (!Array.isArray(options) || options.length !== en.options.length) {
        errors.push({ id, reason: `options length ${options?.length} != ${en.options.length}` });
        skipped++;
        continue;
      }
      const plOpts = options.map((o) => (typeof o === 'string' ? o : o?.pl));
      if (
        plOpts.some((p, i) => {
          if (!looksPolish(p)) return true;
          const same = p.trim() === en.options[i].trim();
          return same && !mayKeepEnglish(p);
        })
      ) {
        errors.push({ id, reason: 'option missing/English' });
        skipped++;
        continue;
      }
      if (!store[t]) store[t] = {};
      store[t][id] = {
        promptPl: promptPl.trim(),
        options: plOpts.map((pl) => ({ pl: String(pl).trim() })),
      };
      merged++;
    }
  }

  // Coverage
  const expected = Object.keys(enMap).length;
  let have = 0;
  for (const t of Object.keys(store)) have += Object.keys(store[t]).length;
  const missing = Object.keys(enMap).filter((id) => {
    const t = enMap[id].topic;
    return !store[t]?.[id]?.promptPl;
  });

  fs.mkdirSync(path.dirname(OUT_PUBLIC), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_LOCALES), { recursive: true });
  const json = JSON.stringify(store, null, 2) + '\n';
  fs.writeFileSync(OUT_PUBLIC, json);
  fs.writeFileSync(OUT_LOCALES, json);
  fs.writeFileSync(
    path.join(BATCH_DIR, 'merge-q-report.json'),
    JSON.stringify({ merged, skipped, expected, have, missingCount: missing.length, missing: missing.slice(0, 50), errors: errors.slice(0, 80), outFiles }, null, 2)
  );
  console.log(JSON.stringify({ merged, skipped, expected, have, missingCount: missing.length, outFiles: outFiles.length, errors: errors.length }, null, 2));
}

main();
