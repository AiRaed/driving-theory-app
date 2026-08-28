#!/usr/bin/env node
/**
 * Merge Persian question batch outputs into public/locales/fa.json (+ locales/fa.json)
 * Expects data/fa-batches/out-q-XX.json files shaped as:
 * { "TOPIC": { "ID": { "promptFa": "...", "options": [{ "fa": "..." }, ...] } } }
 * or flat: { "ID": { "topic", "promptFa", "options": [...] } }
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BATCH_DIR = path.join(ROOT, 'data/fa-batches');
const OUT_PUBLIC = path.join(ROOT, 'public/locales/fa.json');
const OUT_LOCALES = path.join(ROOT, 'locales/fa.json');
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

function looksPersian(text) {
  if (!text || typeof text !== 'string') return false;
  const t = text.trim();
  if (t.length < 2) return false;
  if (!/[\u0600-\u06FF]/.test(t)) return false;
  return true;
}

function mayKeepEnglish(option) {
  const t = String(option || '').trim();
  if (/^\d+([.,]\d+)?\s*(mph|mm|kg)$/i.test(t)) return true;
  if (/^[\d,]+\s*kg$/i.test(t)) return true;
  if (/^\d+[–\-]\d+\s*cm$/i.test(t)) return true;
  if (/^£[\d,]+(\s*fine)?$/i.test(t)) return true;
  if (/^(Puffin|Pelican|Zebra|Toucan|Van|ABS|ESC|MOT|DVLA|STOP|CPR|AED)$/i.test(t)) return true;
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
    const root = data.results || data;

    const entries = [];
    for (const [k, v] of Object.entries(root)) {
      if (k === 'meta') continue;
      if (v && typeof v === 'object' && (v.promptFa || v.options)) {
        entries.push({ id: k, topic: v.topic || enMap[k]?.topic, ...v });
      } else if (v && typeof v === 'object') {
        for (const [id, entry] of Object.entries(v)) {
          if (entry && typeof entry === 'object' && entry.promptFa) {
            entries.push({ id, topic: k, ...entry });
          }
        }
      }
    }

    for (const entry of entries) {
      const { id, topic, promptFa, options } = entry;
      const en = enMap[id];
      if (!en) {
        errors.push({ id, reason: 'unknown id' });
        continue;
      }
      const t = topic || en.topic;
      if (!looksPersian(promptFa)) {
        errors.push({ id, reason: 'bad promptFa' });
        skipped++;
        continue;
      }
      if (promptFa.trim() === en.promptEn.trim()) {
        errors.push({ id, reason: 'prompt still English' });
        skipped++;
        continue;
      }
      if (!Array.isArray(options) || options.length !== en.options.length) {
        errors.push({ id, reason: `options length ${options?.length} != ${en.options.length}` });
        skipped++;
        continue;
      }
      const faOpts = options.map((o) => (typeof o === 'string' ? o : o?.fa));
      if (
        faOpts.some((p, i) => {
          if (!p) return true;
          const same = String(p).trim() === en.options[i].trim();
          if (same && mayKeepEnglish(p)) return false;
          if (!looksPersian(p) && !mayKeepEnglish(p)) return true;
          return same && !mayKeepEnglish(p);
        })
      ) {
        errors.push({ id, reason: 'option missing/English' });
        skipped++;
        continue;
      }
      if (!store[t]) store[t] = {};
      store[t][id] = {
        promptFa: promptFa.trim(),
        options: faOpts.map((fa) => ({ fa: String(fa).trim() })),
      };
      merged++;
    }
  }

  const expected = Object.keys(enMap).length;
  let have = 0;
  for (const t of Object.keys(store)) have += Object.keys(store[t]).length;
  const missing = Object.keys(enMap).filter((id) => {
    const t = enMap[id].topic;
    return !store[t]?.[id]?.promptFa;
  });

  fs.mkdirSync(path.dirname(OUT_PUBLIC), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_LOCALES), { recursive: true });
  const json = JSON.stringify(store, null, 2) + '\n';
  fs.writeFileSync(OUT_PUBLIC, json);
  fs.writeFileSync(OUT_LOCALES, json);
  fs.writeFileSync(
    path.join(BATCH_DIR, 'merge-q-report.json'),
    JSON.stringify(
      {
        merged,
        skipped,
        expected,
        have,
        missingCount: missing.length,
        missing: missing.slice(0, 50),
        errors: errors.slice(0, 80),
        outFiles,
      },
      null,
      2
    )
  );
  console.log(
    JSON.stringify(
      {
        merged,
        skipped,
        expected,
        have,
        missingCount: missing.length,
        outFiles: outFiles.length,
        errors: errors.length,
      },
      null,
      2
    )
  );
}

main();
