#!/usr/bin/env node
/**
 * Local-only DVSA workbook analyzer (exceljs).
 * Reads: local-data/dvsa/Car (Cat B) QB Feb 2026.xlsx
 * Does not modify the workbook, Supabase, or import questions.
 *
 * If the .xlsx is missing but a sibling .csv exists, builds the .xlsx once
 * into the gitignored folder so analysis can run.
 */

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const ROOT = path.resolve(__dirname, '..');
const DVSA_DIR = path.join(ROOT, 'local-data', 'dvsa');
const XLSX_NAME = 'Car (Cat B) QB Feb 2026.xlsx';
const CSV_NAME = 'Car (Cat B) QB Feb 2026.csv';
const XLSX_PATH = path.join(DVSA_DIR, XLSX_NAME);
const CSV_PATH = path.join(DVSA_DIR, CSV_NAME);

/** LingoTheory TOPIC_META labels (14 topics) — keep in sync with lib/questions/types.ts */
const LINGO_TOPICS = [
  { id: 'alertness', label_en: 'Alertness' },
  { id: 'attitude', label_en: 'Attitude' },
  { id: 'documents', label_en: 'Documents' },
  { id: 'hazard-awareness', label_en: 'Hazard Awareness' },
  { id: 'incidents', label_en: 'Incidents' },
  { id: 'motorway-driving', label_en: 'Motorway Driving' },
  { id: 'other-vehicles', label_en: 'Other Vehicles' },
  { id: 'road-signs', label_en: 'Road Signs' },
  { id: 'rules-of-the-road', label_en: 'Rules of the Road' },
  { id: 'safety-margins', label_en: 'Safety Margins' },
  { id: 'safety-vehicle', label_en: 'Safety Vehicle' },
  { id: 'vehicle-handling', label_en: 'Vehicle Handling' },
  { id: 'vehicle-loading', label_en: 'Vehicle Loading' },
  { id: 'vulnerable-road-users', label_en: 'Vulnerable Road Users' },
];

/** Map DVSA Topic column → LingoTheory topic id (null = no clear 1:1) */
const DVSA_TO_LINGO = {
  Alertness: 'alertness',
  Attitude: 'attitude',
  'Essential documents': 'documents',
  'Hazard awareness': 'hazard-awareness',
  'Incidents, accidents and emergencies': 'incidents',
  'Motorway rules': 'motorway-driving',
  'Other types of vehicle': 'other-vehicles',
  'Road and traffic signs': 'road-signs',
  'Rules of the road': 'rules-of-the-road',
  'Safety margins': 'safety-margins',
  'Safety and your vehicle': 'safety-vehicle',
  'Safety and your vehicle/motorcycle': 'safety-vehicle',
  'Vehicle handling': 'vehicle-handling',
  'Vehicle/motorcycle handling': 'vehicle-handling',
  'Vehicle loading': 'vehicle-loading',
  'Vehicle/motorcycle loading': 'vehicle-loading',
  'Vulnerable road users': 'vulnerable-road-users',
};

const EXPECTED_HEADERS = [
  'Item',
  'Topic',
  'Current Answer',
  'Stem',
  'Mark Answer',
  'OptionA',
  'OptionB',
  'OptionC',
  'OptionD',
  'Expl text',
  'List Amendments',
  'NI Exempt',
  'Stem.gif',
  'A.gif',
  'B.gif',
  'C.gif',
  'D.gif',
  'Stem HiRes',
  'A HiRes',
  'B HiRes',
  'C HiRes',
  'D HiRes',
  'Cat B Book XRefs',
];

const IMAGE_COLS = [
  'Stem.gif',
  'A.gif',
  'B.gif',
  'C.gif',
  'D.gif',
  'Stem HiRes',
  'A HiRes',
  'B HiRes',
  'C HiRes',
  'D HiRes',
];

function cellText(value) {
  if (value == null || value === '') return '';
  if (typeof value === 'object') {
    if (value.richText) return value.richText.map((t) => t.text || '').join('');
    if (value.text != null) return String(value.text);
    if (value.result != null) return String(value.result);
    if (value.hyperlink) return String(value.text || value.hyperlink);
  }
  return String(value);
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseCsv(content) {
  const lines = [];
  let buf = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      buf += ch;
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && content[i + 1] === '\n') i++;
      if (buf.length) lines.push(buf);
      buf = '';
    } else {
      buf += ch;
    }
  }
  if (buf.length) lines.push(buf);
  return lines.map(parseCsvLine);
}

async function ensureXlsxFromCsv() {
  if (fs.existsSync(XLSX_PATH)) {
    return { created: false, source: XLSX_PATH };
  }
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(
      `Missing workbook:\n  ${XLSX_PATH}\nAlso no CSV fallback:\n  ${CSV_PATH}`
    );
  }

  const raw = fs.readFileSync(CSV_PATH, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(raw);
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Questions');
  for (const row of rows) {
    ws.addRow(row);
  }
  await wb.xlsx.writeFile(XLSX_PATH);
  return { created: true, source: CSV_PATH };
}

function rowToObject(headers, values) {
  const obj = {};
  for (let i = 0; i < headers.length; i++) {
    obj[headers[i]] = cellText(values[i]).trim();
  }
  return obj;
}

async function loadRows() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX_PATH);
  const ws = wb.worksheets[0];
  if (!ws) throw new Error('Workbook has no worksheets');

  const matrix = [];
  ws.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    const vals = [];
    const max = Math.max(row.cellCount, EXPECTED_HEADERS.length);
    for (let c = 1; c <= max; c++) {
      vals.push(row.getCell(c).value);
    }
    matrix.push({ rowNumber, vals });
  });

  if (matrix.length < 2) {
    throw new Error('Workbook has fewer than 2 rows (title + header)');
  }

  // Row 1 = title, Row 2 = headers (DVSA layout)
  let headerRowIdx = 0;
  for (let i = 0; i < Math.min(5, matrix.length); i++) {
    const texts = matrix[i].vals.map(cellText);
    if (texts[0] === 'Item' && texts[1] === 'Topic') {
      headerRowIdx = i;
      break;
    }
  }

  const headers = matrix[headerRowIdx].vals.map(cellText);
  const questions = [];
  for (let i = headerRowIdx + 1; i < matrix.length; i++) {
    const obj = rowToObject(headers, matrix[i].vals);
    const empty = !Object.values(obj).some((v) => v && String(v).trim());
    if (empty) continue;
    // Skip stray title-only leftovers
    if (!obj.Item && !obj.Stem) continue;
    questions.push({ ...obj, _row: matrix[i].rowNumber });
  }

  return {
    sheetName: ws.name,
    title: cellText(matrix[0]?.vals[0]),
    headers,
    headerRow: matrix[headerRowIdx].rowNumber,
    questions,
  };
}

function analyze(data, bootstrap) {
  const issues = [];
  const missing = {
    item: [],
    topic: [],
    answer: [],
    stem: [],
    optionA: [],
    optionB: [],
    optionC: [],
    optionD: [],
    expl: [],
  };
  const topicCounts = {};
  const answerCounts = {};
  const imageRefCounts = Object.fromEntries(IMAGE_COLS.map((c) => [c, 0]));
  const questionsWithAnyImage = new Set();
  const questionsWithOptionImages = [];
  const questionsMissingAllOptions = [];
  const idSeen = new Map();
  const duplicateIds = [];
  const invalidIds = [];
  const invalidAnswers = [];
  const trailingTopicWhitespace = [];
  const unmappedTopics = new Set();

  // Header structure
  const headerMismatch = [];
  for (let i = 0; i < EXPECTED_HEADERS.length; i++) {
    if ((data.headers[i] || '') !== EXPECTED_HEADERS[i]) {
      headerMismatch.push({
        col: i + 1,
        expected: EXPECTED_HEADERS[i],
        actual: data.headers[i] || '(missing)',
      });
    }
  }
  if (headerMismatch.length) {
    issues.push({
      type: 'header_mismatch',
      detail: headerMismatch.slice(0, 10),
    });
  }

  for (const q of data.questions) {
    const id = (q.Item || '').trim();
    const topic = (q.Topic || '').trim();
    const rawTopic = q.Topic || '';
    const answer = (q['Current Answer'] || '').trim();
    const stem = (q.Stem || '').trim();
    const opts = {
      A: (q.OptionA || '').trim(),
      B: (q.OptionB || '').trim(),
      C: (q.OptionC || '').trim(),
      D: (q.OptionD || '').trim(),
    };
    const expl = (q['Expl text'] || '').trim();

    if (!id) missing.item.push(q._row);
    else {
      if (!/^[A-Z]{2}\d{4}$/.test(id)) invalidIds.push({ id, row: q._row });
      if (idSeen.has(id)) duplicateIds.push({ id, rows: [idSeen.get(id), q._row] });
      else idSeen.set(id, q._row);
    }

    if (!topic) missing.topic.push(id || q._row);
    else {
      if (rawTopic !== topic) trailingTopicWhitespace.push(id || q._row);
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      if (!(topic in DVSA_TO_LINGO)) unmappedTopics.add(topic);
    }

    if (!answer) missing.answer.push(id || q._row);
    else {
      const norm = answer.toUpperCase();
      answerCounts[answer] = (answerCounts[answer] || 0) + 1;
      if (!/^[ABCD]$/i.test(answer)) {
        invalidAnswers.push({ id, answer, row: q._row });
      } else if (answer !== norm) {
        invalidAnswers.push({
          id,
          answer,
          row: q._row,
          note: 'non-uppercase letter',
        });
      }
    }

    if (!stem) missing.stem.push(id || q._row);

    for (const k of ['A', 'B', 'C', 'D']) {
      if (!opts[k]) missing[`option${k}`].push(id || q._row);
    }
    if (!opts.A && !opts.B && !opts.C && !opts.D) {
      questionsMissingAllOptions.push(id);
    }

    if (!expl) missing.expl.push(id || q._row);

    let hasImg = false;
    let hasOptImg = false;
    for (const col of IMAGE_COLS) {
      const v = (q[col] || '').trim();
      if (v) {
        imageRefCounts[col]++;
        hasImg = true;
        if (col !== 'Stem.gif' && col !== 'Stem HiRes') hasOptImg = true;
      }
    }
    if (hasImg) questionsWithAnyImage.add(id);
    if (hasOptImg) questionsWithOptionImages.push(id);

    // Correct answer points at empty option (and no option image)
    if (/^[ABCD]$/i.test(answer)) {
      const letter = answer.toUpperCase();
      const optKey = `Option${letter}`;
      const gifKey = `${letter}.gif`;
      const hiKey = `${letter} HiRes`;
      const optText = opts[letter];
      const hasOptMedia = !!(q[gifKey] || q[hiKey]);
      if (!optText && !hasOptMedia) {
        issues.push({
          type: 'correct_answer_empty_option',
          id,
          answer: letter,
        });
      }
    }
  }

  // Topic comparison
  const lingoById = Object.fromEntries(LINGO_TOPICS.map((t) => [t.id, t]));
  const mappedCounts = {};
  for (const t of LINGO_TOPICS) mappedCounts[t.id] = 0;
  for (const [dvsaTopic, count] of Object.entries(topicCounts)) {
    const lid = DVSA_TO_LINGO[dvsaTopic];
    if (lid) mappedCounts[lid] = (mappedCounts[lid] || 0) + count;
  }

  const topicComparison = LINGO_TOPICS.map((t) => ({
    lingo_id: t.id,
    lingo_label: t.label_en,
    dvsa_topics: Object.entries(DVSA_TO_LINGO)
      .filter(([, id]) => id === t.id)
      .map(([name]) => name),
    count: mappedCounts[t.id] || 0,
  }));

  const dvsaOnly = Object.keys(topicCounts).filter((t) => !(t in DVSA_TO_LINGO));

  const report = {
    generated_at: new Date().toISOString(),
    workbook: XLSX_PATH,
    bootstrap: bootstrap.created
      ? `Created ${XLSX_NAME} from sibling CSV (CSV left unchanged)`
      : 'Read existing .xlsx',
    sheet: data.sheetName,
    title: data.title,
    header_row: data.headerRow,
    totals: {
      questions: data.questions.length,
      unique_ids: idSeen.size,
      duplicate_ids: duplicateIds.length,
      topics_dvsa: Object.keys(topicCounts).length,
      topics_lingo: LINGO_TOPICS.length,
      with_any_image_ref: questionsWithAnyImage.size,
      with_option_image_refs: questionsWithOptionImages.length,
      missing_all_four_options: questionsMissingAllOptions.length,
    },
    topic_counts_dvsa: Object.fromEntries(
      Object.entries(topicCounts).sort((a, b) => a[0].localeCompare(b[0]))
    ),
    answer_letter_counts: answerCounts,
    image_reference_counts: imageRefCounts,
    missing_data: {
      item: missing.item.length,
      topic: missing.topic.length,
      current_answer: missing.answer.length,
      stem: missing.stem.length,
      optionA: missing.optionA.length,
      optionB: missing.optionB.length,
      optionC: missing.optionC.length,
      optionD: missing.optionD.length,
      expl_text: missing.expl.length,
      samples: {
        missing_all_options: questionsMissingAllOptions.slice(0, 15),
        invalid_ids: invalidIds.slice(0, 10),
        invalid_answers: invalidAnswers.slice(0, 10),
        duplicate_ids: duplicateIds.slice(0, 10),
      },
    },
    structural_issues: {
      header_mismatches: headerMismatch.length,
      invalid_ids: invalidIds.length,
      invalid_answers: invalidAnswers.length,
      duplicate_ids: duplicateIds.length,
      topics_with_trailing_whitespace_rows: trailingTopicWhitespace.length,
      unmapped_dvsa_topics: [...unmappedTopics],
      correct_answer_empty_option: issues.filter(
        (i) => i.type === 'correct_answer_empty_option'
      ).length,
    },
    topic_comparison_vs_lingotheory: {
      note:
        'DVSA uses 17 topic labels (incl. motorcycle variants). Mapped onto the 14 LingoTheory TOPIC_META topics.',
      lingo_topics: topicComparison,
      dvsa_topics_without_mapping: dvsaOnly,
      name_mismatches: [
        {
          dvsa: 'Essential documents',
          lingo: 'Documents',
          mapped_to: 'documents',
        },
        {
          dvsa: 'Hazard awareness',
          lingo: 'Hazard Awareness',
          mapped_to: 'hazard-awareness',
        },
        {
          dvsa: 'Incidents, accidents and emergencies',
          lingo: 'Incidents',
          mapped_to: 'incidents',
        },
        {
          dvsa: 'Motorway rules',
          lingo: 'Motorway Driving',
          mapped_to: 'motorway-driving',
        },
        {
          dvsa: 'Other types of vehicle',
          lingo: 'Other Vehicles',
          mapped_to: 'other-vehicles',
        },
        {
          dvsa: 'Road and traffic signs',
          lingo: 'Road Signs',
          mapped_to: 'road-signs',
        },
        {
          dvsa: 'Safety and your vehicle (+ /motorcycle)',
          lingo: 'Safety Vehicle',
          mapped_to: 'safety-vehicle',
        },
        {
          dvsa: 'Vehicle handling (+ /motorcycle)',
          lingo: 'Vehicle Handling',
          mapped_to: 'vehicle-handling',
        },
        {
          dvsa: 'Vehicle loading (+ /motorcycle)',
          lingo: 'Vehicle Loading',
          mapped_to: 'vehicle-loading',
        },
      ],
    },
  };

  return report;
}

function printConcise(report) {
  const lines = [];
  lines.push('=== DVSA Workbook Analysis ===');
  lines.push(`File: ${path.basename(report.workbook)}`);
  lines.push(`Bootstrap: ${report.bootstrap}`);
  lines.push(`Title: ${report.title}`);
  lines.push('');
  lines.push(`Total questions: ${report.totals.questions}`);
  lines.push(`Unique IDs: ${report.totals.unique_ids}`);
  lines.push(`DVSA topics: ${report.totals.topics_dvsa} | LingoTheory topics: ${report.totals.topics_lingo}`);
  lines.push(`With image refs: ${report.totals.with_any_image_ref} (option images: ${report.totals.with_option_image_refs})`);
  lines.push('');
  lines.push('--- Topic counts (DVSA) ---');
  for (const [t, n] of Object.entries(report.topic_counts_dvsa)) {
    const map = DVSA_TO_LINGO[t] ? ` → ${DVSA_TO_LINGO[t]}` : ' → UNMAPPED';
    lines.push(`  ${n.toString().padStart(3)}  ${t}${map}`);
  }
  lines.push('');
  lines.push('--- Mapped onto 14 LingoTheory topics ---');
  for (const t of report.topic_comparison_vs_lingotheory.lingo_topics) {
    lines.push(`  ${t.count.toString().padStart(3)}  ${t.lingo_label} (${t.lingo_id})`);
  }
  lines.push('');
  lines.push('--- Missing data ---');
  const m = report.missing_data;
  lines.push(
    `  Item:${m.item} Topic:${m.topic} Answer:${m.current_answer} Stem:${m.stem} Expl:${m.expl_text}`
  );
  lines.push(
    `  Options A/B/C/D empty: ${m.optionA}/${m.optionB}/${m.optionC}/${m.optionD}`
  );
  lines.push(
    `  Rows missing all 4 options: ${report.totals.missing_all_four_options} (image-option questions; sample: ${m.samples.missing_all_options.slice(0, 5).join(', ') || '—'})`
  );
  lines.push('');
  lines.push('--- Structural issues ---');
  const s = report.structural_issues;
  lines.push(`  Header mismatches: ${s.header_mismatches}`);
  lines.push(`  Invalid IDs: ${s.invalid_ids}`);
  lines.push(`  Invalid / non-uppercase answers: ${s.invalid_answers}${m.samples.invalid_answers.length ? ' → ' + JSON.stringify(m.samples.invalid_answers) : ''}`);
  lines.push(`  Duplicate IDs: ${s.duplicate_ids}`);
  lines.push(`  Topic trailing whitespace rows: ${s.topics_with_trailing_whitespace_rows}`);
  lines.push(`  Correct answer with empty option+no media: ${s.correct_answer_empty_option}`);
  lines.push(`  Unmapped DVSA topics: ${s.unmapped_dvsa_topics.length ? s.unmapped_dvsa_topics.join(', ') : 'none'}`);
  lines.push('');
  lines.push('--- Answer letters ---');
  lines.push(`  ${JSON.stringify(report.answer_letter_counts)}`);
  lines.push('');
  lines.push('--- Image reference columns ---');
  for (const [col, n] of Object.entries(report.image_reference_counts)) {
    if (n) lines.push(`  ${col}: ${n}`);
  }
  return lines.join('\n');
}

async function main() {
  const bootstrap = await ensureXlsxFromCsv();
  const data = await loadRows();
  const report = analyze(data, bootstrap);

  const outDir = path.join(ROOT, 'local-data', 'dvsa');
  const jsonPath = path.join(outDir, 'analysis-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const text = printConcise(report);
  console.log(text);
  console.log(`\nFull JSON: ${jsonPath}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
