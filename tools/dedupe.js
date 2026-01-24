/* tools/dedupe.js
 * Usage:
 *   node tools/dedupe.js path/to/questions.json
 *
 * Output:
 *   - prints summary to console
 *   - writes reports:
 *       dedupe_exact.csv
 *       dedupe_near.csv
 */

const fs = require("fs");

function normText(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "") // Arabic diacritics
    .replace(/[^\p{L}\p{N}\s]/gu, " ")     // keep letters/numbers
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s) {
  const t = normText(s);
  if (!t) return [];
  return t.split(" ").filter(w => w.length >= 2);
}

function signatureExact(q) {
  // Exact signature uses promptEn + options EN text (sorted) + correct index
  const prompt = normText(q.promptEn);
  const opts = (q.options || []).map(o => normText(o.en)).sort().join("|");
  const correctIdx = (q.options || []).findIndex(o => o.correct === true);
  return `${q.topic}::${prompt}::${opts}::${correctIdx}`;
}

function bagCounts(tokens) {
  const m = new Map();
  for (const w of tokens) m.set(w, (m.get(w) || 0) + 1);
  return m;
}

function cosineSim(aTokens, bTokens) {
  const a = bagCounts(aTokens);
  const b = bagCounts(bTokens);
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;

  for (const [w, c] of a) aNorm += c * c;
  for (const [w, c] of b) bNorm += c * c;

  for (const [w, cA] of a) {
    const cB = b.get(w);
    if (cB) dot += cA * cB;
  }
  if (aNorm === 0 || bNorm === 0) return 0;
  return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm));
}

function jaccardSim(aTokens, bTokens) {
  const a = new Set(aTokens);
  const b = new Set(bTokens);
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function combinedText(q) {
  // Use English prompt + English options as similarity basis
  const prompt = q.promptEn || "";
  const opts = (q.options || []).map(o => o.en || "").join(" ");
  return `${prompt} ${opts}`;
}

function writeCSV(path, rows, header) {
  const out = [header.join(",")];
  for (const r of rows) {
    out.push(r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(","));
  }
  fs.writeFileSync(path, out.join("\n"), "utf8");
}

function main() {
  const input = process.argv[2];
  if (!input) {
    console.error("Usage: node tools/dedupe.js path/to/questions.json");
    process.exit(1);
  }

  const raw = fs.readFileSync(input, "utf8");
  const questions = JSON.parse(raw);

  console.log(`Loaded ${questions.length} questions`);

  // 1) Exact duplicates
  const exactMap = new Map();
  const exactPairs = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const sig = signatureExact(q);
    if (!exactMap.has(sig)) exactMap.set(sig, []);
    exactMap.get(sig).push(i);
  }

  for (const [sig, idxs] of exactMap) {
    if (idxs.length > 1) {
      for (let k = 1; k < idxs.length; k++) {
        const a = questions[idxs[0]];
        const b = questions[idxs[k]];
        exactPairs.push([
          a.id, b.id, a.topic,
          (a.promptEn || "").slice(0, 120)
        ]);
      }
    }
  }

  // 2) Near duplicates (similarity)
  // Tune thresholds:
  // - cosine >= 0.92 and jaccard >= 0.75 => very likely duplicate
  const NEAR_COS = 0.92;
  const NEAR_JAC = 0.75;

  // Bucket by topic to reduce comparisons
  const byTopic = new Map();
  for (const q of questions) {
    const t = q.topic || "unknown";
    if (!byTopic.has(t)) byTopic.set(t, []);
    byTopic.get(t).push(q);
  }

  const nearRows = [];
  let comparisons = 0;

  for (const [topic, arr] of byTopic) {
    // Pre-tokenize
    const toks = arr.map(q => tokenize(combinedText(q)));

    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        comparisons++;
        // quick short-circuit: different correct option text can still be dup,
        // so we don't filter by correctIdx.
        const cos = cosineSim(toks[i], toks[j]);
        if (cos < NEAR_COS) continue;
        const jac = jaccardSim(toks[i], toks[j]);
        if (jac < NEAR_JAC) continue;

        nearRows.push([
          arr[i].id,
          arr[j].id,
          topic,
          cos.toFixed(3),
          jac.toFixed(3),
          (arr[i].promptEn || "").slice(0, 90),
          (arr[j].promptEn || "").slice(0, 90)
        ]);
      }
    }
  }

  console.log(`Comparisons (within topic): ${comparisons}`);
  console.log(`Exact duplicate pairs: ${exactPairs.length}`);
  console.log(`Near-duplicate pairs: ${nearRows.length}`);

  writeCSV(
    "dedupe_exact.csv",
    exactPairs,
    ["idA", "idB", "topic", "prompt_preview"]
  );

  writeCSV(
    "dedupe_near.csv",
    nearRows,
    ["idA", "idB", "topic", "cosine", "jaccard", "promptA", "promptB"]
  );

  console.log("Wrote: dedupe_exact.csv, dedupe_near.csv");
  console.log("Tip: If near list is too big/small, adjust NEAR_COS / NEAR_JAC in the script.");
}

main();

