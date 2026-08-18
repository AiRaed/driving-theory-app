#!/usr/bin/env node
/** Audit Bengali locale coverage vs English question bank */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function parseEnglish(src) {
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

const en = parseEnglish(fs.readFileSync(path.join(ROOT, 'data/questions.ts'), 'utf8'));
const plPath = path.join(ROOT, 'public/locales/bn.json');
const pl = fs.existsSync(plPath) ? JSON.parse(fs.readFileSync(plPath, 'utf8')) : {};

let have = 0;
let optionOk = 0;
const missing = [];
const stillEnglish = [];
const badOptions = [];
const arUrContamination = [];

for (const [id, q] of Object.entries(en)) {
  const entry = pl[q.topic]?.[id];
  if (!entry?.promptBn) {
    missing.push(id);
    continue;
  }
  have++;
  if (entry.promptBn.trim() === q.promptEn.trim()) stillEnglish.push(id);
  if (/[\u0600-\u06FF]/.test(entry.promptBn)) arUrContamination.push(id);
  const opts = entry.options || [];
  if (opts.length !== q.options.length) {
    badOptions.push({ id, reason: 'count' });
    continue;
  }
  const mayKeep = (t) =>
    /^\d+([.,]\d+)?\s*(mph|mm|kg)$/i.test(t) ||
    /^[\d,]+\s*kg$/i.test(t) ||
    /^\d+[–\-]\d+\s*cm$/i.test(t) ||
    /^£[\d,]+(\s*fine)?$/i.test(t) ||
    /^(Puffin|Pelican|Zebra|Toucan|Van|ABS|ESC|MOT|DVLA|STOP|CPR|AED)$/i.test(t);
  let ok = true;
  for (let i = 0; i < opts.length; i++) {
    const p = opts[i]?.bn || '';
    const same = p.trim() === q.options[i].trim();
    if (!p || /[\u0600-\u06FF]/.test(p) || (same && !mayKeep(p))) {
      ok = false;
      badOptions.push({ id, reason: `opt${i}` });
      break;
    }
  }
  if (ok) optionOk++;
}

const hints = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/vocab-hints.json'), 'utf8'));
let hintTotal = 0;
let hintWithBn = 0;
let hintMissingBn = 0;
for (const list of Object.values(hints)) {
  for (const h of list || []) {
    hintTotal++;
    if (h.translations?.bn?.trim()) hintWithBn++;
    else hintMissingBn++;
  }
}

const report = {
  totalQuestions: Object.keys(en).length,
  bengaliQuestions: have,
  missingQuestions: missing.length,
  missingSample: missing.slice(0, 30),
  stillEnglishPrompts: stillEnglish.length,
  badOptions: badOptions.length,
  optionsFullyTranslated: optionOk,
  arUrContamination: arUrContamination.length,
  vocabHintOccurrences: hintTotal,
  vocabWithBn: hintWithBn,
  vocabMissingBn: hintMissingBn,
};
console.log(JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(ROOT, 'data/bn-batches/audit-bn.json'), JSON.stringify(report, null, 2) + '\n');
