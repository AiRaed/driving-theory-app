#!/usr/bin/env node
/**
 * Merge Bengali vocab explanations into data/vocab-hints.json + vocab-dictionary.json
 * Expects data/bn-batches/out-vocab-XX.json as { "term": "bengali explanation", ... }
 * or [{ "term": "...", "bn": "..." }]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BATCH_DIR = path.join(ROOT, 'data/bn-batches');
const HINTS = path.join(ROOT, 'data/vocab-hints.json');
const DICT = path.join(ROOT, 'data/vocab-dictionary.json');

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
  const plMap = {};

  const files = fs
    .readdirSync(BATCH_DIR)
    .filter((f) => /^out-vocab-\d+\.json$/.test(f))
    .sort();

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, file), 'utf8'));
    const root = data.results || data;
    if (Array.isArray(root)) {
      for (const item of root) {
        if (item?.term && item?.bn) plMap[item.term] = String(item.bn).trim();
      }
    } else {
      for (const [term, val] of Object.entries(root)) {
        if (typeof val === 'string') plMap[term] = val.trim();
        else if (val && typeof val.bn === 'string') plMap[term] = val.bn.trim();
      }
    }
  }

  let appliedHints = 0;
  let missing = 0;
  const missingTerms = new Set();

  for (const list of Object.values(hints)) {
    for (const h of list || []) {
      if (!h.translations) h.translations = {};
      // find pl by exact or normalized term
      let pl = plMap[h.term];
      if (!pl) {
        const key = Object.keys(plMap).find((k) => norm(k) === norm(h.term));
        if (key) pl = plMap[key];
      }
      if (!pl && dict[h.term]?.translations?.bn) pl = dict[h.term].translations.bn;
      if (pl) {
        h.translations.bn = pl;
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
    let pl = plMap[term];
    if (!pl) {
      const key = Object.keys(plMap).find((k) => norm(k) === norm(term));
      if (key) pl = plMap[key];
    }
    if (pl) {
      entry.translations.bn = pl;
      appliedDict++;
    }
  }

  fs.writeFileSync(HINTS, JSON.stringify(hints, null, 2) + '\n');
  fs.writeFileSync(DICT, JSON.stringify(dict, null, 2) + '\n');
  fs.writeFileSync(
    path.join(BATCH_DIR, 'merge-vocab-report.json'),
    JSON.stringify(
      {
        files: files.length,
        bnMapSize: Object.keys(plMap).length,
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
        bnMapSize: Object.keys(plMap).length,
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
