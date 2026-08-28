#!/usr/bin/env node
/**
 * Merge Persian vocab explanations into data/vocab-hints.json + vocab-dictionary.json
 * and write data/vocab-term-fa.json labels.
 * Expects data/fa-batches/out-vocab-XX.json as:
 *   { "term": "persian explanation", ... }
 *   { "term": { "fa": "...", "label": "..." } }
 *   [{ "term": "...", "fa": "...", "label": "..." }]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BATCH_DIR = path.join(ROOT, 'data/fa-batches');
const HINTS = path.join(ROOT, 'data/vocab-hints.json');
const DICT = path.join(ROOT, 'data/vocab-dictionary.json');
const TERM_FA = path.join(ROOT, 'data/vocab-term-fa.json');

function norm(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function main() {
  const hints = JSON.parse(fs.readFileSync(HINTS, 'utf8'));
  const dict = JSON.parse(fs.readFileSync(DICT, 'utf8'));
  const faMap = {};
  const labelMap = {};

  const files = fs
    .readdirSync(BATCH_DIR)
    .filter((f) => /^out-vocab-\d+\.json$/.test(f))
    .sort();

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, file), 'utf8'));
    const root = data.results || data;
    if (Array.isArray(root)) {
      for (const item of root) {
        if (item?.term && item?.fa) faMap[item.term] = String(item.fa).trim();
        if (item?.term && item?.label) labelMap[item.term] = String(item.label).trim();
      }
    } else {
      for (const [term, val] of Object.entries(root)) {
        if (typeof val === 'string') faMap[term] = val.trim();
        else if (val && typeof val === 'object') {
          if (typeof val.fa === 'string') faMap[term] = val.fa.trim();
          if (typeof val.label === 'string') labelMap[term] = val.label.trim();
        }
      }
    }
  }

  let appliedHints = 0;
  let missing = 0;
  const missingTerms = new Set();

  for (const list of Object.values(hints)) {
    for (const h of list || []) {
      if (!h.translations) h.translations = {};
      let fa = faMap[h.term];
      if (!fa) {
        const key = Object.keys(faMap).find((k) => norm(k) === norm(h.term));
        if (key) fa = faMap[key];
      }
      if (!fa && dict[h.term]?.translations?.fa) fa = dict[h.term].translations.fa;
      if (fa) {
        h.translations.fa = fa;
        appliedHints++;
      } else {
        missing++;
        missingTerms.add(h.term);
      }
    }
  }

  let appliedDict = 0;
  for (const [term, entry] of Object.entries(dict)) {
    if (!entry.translations) entry.translations = {};
    let fa = faMap[term];
    if (!fa) {
      const key = Object.keys(faMap).find((k) => norm(k) === norm(term));
      if (key) fa = faMap[key];
    }
    if (fa) {
      entry.translations.fa = fa;
      appliedDict++;
    }
  }

  const existingLabels = fs.existsSync(TERM_FA)
    ? JSON.parse(fs.readFileSync(TERM_FA, 'utf8'))
    : {};
  const mergedLabels = { ...existingLabels, ...labelMap };

  fs.writeFileSync(HINTS, JSON.stringify(hints, null, 2) + '\n');
  fs.writeFileSync(DICT, JSON.stringify(dict, null, 2) + '\n');
  fs.writeFileSync(TERM_FA, JSON.stringify(mergedLabels, null, 2) + '\n');
  fs.writeFileSync(
    path.join(BATCH_DIR, 'merge-vocab-report.json'),
    JSON.stringify(
      {
        files: files.length,
        faMapSize: Object.keys(faMap).length,
        labels: Object.keys(mergedLabels).length,
        appliedHints,
        appliedDict,
        missingHintOccurrences: missing,
        missingUniqueTerms: [...missingTerms].slice(0, 100),
        missingUniqueCount: missingTerms.size,
      },
      null,
      2
    )
  );
  console.log(
    JSON.stringify(
      {
        files: files.length,
        faMapSize: Object.keys(faMap).length,
        labels: Object.keys(mergedLabels).length,
        appliedHints,
        appliedDict,
        missingUniqueCount: missingTerms.size,
      },
      null,
      2
    )
  );
}

main();
