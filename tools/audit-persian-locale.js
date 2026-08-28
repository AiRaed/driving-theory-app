#!/usr/bin/env node
/** Audit Persian locale coverage vs English question bank */
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

const URDU_MARK = /[ےٹڈڑںھ]/;
const ARABIC_MARK = /[ةى]/;
const PERSIAN_SCRIPT = /[\u0600-\u06FF]/;

const en = parseEnglish(fs.readFileSync(path.join(ROOT, 'data/questions.ts'), 'utf8'));
const faPath = path.join(ROOT, 'public/locales/fa.json');
const fa = fs.existsSync(faPath) ? JSON.parse(fs.readFileSync(faPath, 'utf8')) : {};

let have = 0;
let optionOk = 0;
let optionTotal = 0;
let optionTranslated = 0;
const missing = [];
const stillEnglish = [];
const badOptions = [];
const emptyStrings = [];
const urduContamination = [];
const arabicContamination = [];

function mayKeep(t) {
  return (
    /^\d+([.,]\d+)?\s*(mph|mm|kg)$/i.test(t) ||
    /^[\d,]+\s*kg$/i.test(t) ||
    /^\d+[–\-]\d+\s*cm$/i.test(t) ||
    /^£[\d,]+(\s*fine)?$/i.test(t) ||
    /^(Puffin|Pelican|Zebra|Toucan|Van|ABS|ESC|MOT|DVLA|STOP|CPR|AED)$/i.test(t)
  );
}

for (const [id, q] of Object.entries(en)) {
  const entry = fa[q.topic]?.[id];
  optionTotal += q.options.length;
  if (!entry?.promptFa) {
    missing.push(id);
    continue;
  }
  have++;
  if (!entry.promptFa.trim()) emptyStrings.push(id);
  if (entry.promptFa.trim() === q.promptEn.trim()) stillEnglish.push(id);
  if (URDU_MARK.test(entry.promptFa)) urduContamination.push(id);
  if (ARABIC_MARK.test(entry.promptFa)) arabicContamination.push(id);
  const opts = entry.options || [];
  if (opts.length !== q.options.length) {
    badOptions.push({ id, reason: 'count' });
    continue;
  }
  let ok = true;
  for (let i = 0; i < opts.length; i++) {
    const p = opts[i]?.fa || '';
    const same = p.trim() === q.options[i].trim();
    if (!p) {
      ok = false;
      badOptions.push({ id, reason: `opt${i}-empty` });
      break;
    }
    if (same && !mayKeep(p)) {
      ok = false;
      badOptions.push({ id, reason: `opt${i}-english` });
      break;
    }
    if (!mayKeep(p) && !PERSIAN_SCRIPT.test(p)) {
      ok = false;
      badOptions.push({ id, reason: `opt${i}-script` });
      break;
    }
    optionTranslated++;
  }
  if (ok) optionOk++;
}

const hints = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/vocab-hints.json'), 'utf8'));
let hintTotal = 0;
let hintWithFa = 0;
let hintMissingFa = 0;
let hintEnglishFa = 0;
for (const list of Object.values(hints)) {
  for (const h of list || []) {
    hintTotal++;
    const text = h.translations?.fa?.trim() || '';
    if (text) {
      hintWithFa++;
      if (!PERSIAN_SCRIPT.test(text)) hintEnglishFa++;
    } else hintMissingFa++;
  }
}

const ui = fs.readFileSync(path.join(ROOT, 'lib/i18n/ui-strings.ts'), 'utf8');
const enKeys = [...ui.matchAll(/export const UI_EN = \{([\s\S]*?)\} as const/g)][0]?.[1] || '';
const expectedUi = [...enKeys.matchAll(/^\s+([a-zA-Z0-9]+):/gm)].map((m) => m[1]);
const faBlock = ui.slice(ui.indexOf('const fa: UiDict'), ui.indexOf('export const UI_STRINGS'));
const presentUi = [...faBlock.matchAll(/^\s+([a-zA-Z0-9]+):/gm)].map((m) => m[1]);
const missingUi = expectedUi.filter((k) => !presentUi.includes(k));

const topicsSrc = fs.readFileSync(path.join(ROOT, 'lib/i18n/topics.ts'), 'utf8');
const topicIds = [...topicsSrc.matchAll(/alertness:|'([a-z-]+)':/g)]
  .map((m) => m[1] || 'alertness')
  .filter((v, i, a) => a.indexOf(v) === i);
const faTopics = topicsSrc.slice(topicsSrc.indexOf('fa: {'), topicsSrc.indexOf('};', topicsSrc.indexOf('fa: {')));
const translatedTopics = [...faTopics.matchAll(/^\s+'?([a-z-]+)'?:/gm)].map((m) => m[1]);
const missingTopics = [
  'alertness',
  'hazard-awareness',
  'road-signs',
  'safety-margins',
  'rules-of-the-road',
  'vulnerable-road-users',
  'vehicle-handling',
  'incidents',
  'documents',
  'motorway-driving',
  'other-vehicles',
  'vehicle-loading',
  'attitude',
  'safety-vehicle',
].filter((t) => !faTopics.includes(`${t}:`) && !faTopics.includes(`'${t}':`));

const report = {
  totalQuestions: Object.keys(en).length,
  persianQuestions: have,
  missingQuestions: missing.length,
  missingSample: missing.slice(0, 30),
  stillEnglishPrompts: stillEnglish.length,
  emptyStrings: emptyStrings.length,
  badOptions: badOptions.length,
  optionsTotal: optionTotal,
  optionsTranslated: optionTranslated,
  questionsWithAllOptions: optionOk,
  urduContamination: urduContamination.length,
  arabicContamination: arabicContamination.length,
  vocabHintOccurrences: hintTotal,
  vocabWithFa: hintWithFa,
  vocabMissingFa: hintMissingFa,
  vocabFaLooksEnglish: hintEnglishFa,
  uiKeysExpected: expectedUi.length,
  uiKeysPresent: presentUi.length,
  missingUiKeys: missingUi,
  topicsExpected: 14,
  topicsTranslated: 14 - missingTopics.length,
  missingTopics,
};
console.log(JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(ROOT, 'data/fa-batches/audit-fa.json'), JSON.stringify(report, null, 2) + '\n');
