/**
 * Local-only: transform DVSA Feb 2026 Cat B workbook → staging JSON + validation report.
 * Writes under gitignored local-data/dvsa/. Does not touch Supabase or the live bank.
 *
 * Usage: npx ts-node --compiler-options '{"module":"commonjs"}' tools/transform-dvsa-bank.ts
 */

import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import {
  DVSA_V2_EXPECTED_COUNT,
  countImageOptionQuestions,
  resolveMediaPresence,
  transformDvsaRow,
  validateTransformedBank,
  type DvsaRawRow,
  type DvsaStagingQuestion,
} from '../lib/questions/dvsaV2';

const ROOT = path.resolve(__dirname, '..');
const DVSA_DIR = path.join(ROOT, 'local-data', 'dvsa');
const XLSX_PATH = path.join(DVSA_DIR, 'Car (Cat B) QB Feb 2026.xlsx');
const CSV_PATH = path.join(DVSA_DIR, 'Car (Cat B) QB Feb 2026.csv');
const ANALYSIS_PATH = path.join(DVSA_DIR, 'analysis-report.json');
const MEDIA_DIR = path.join(DVSA_DIR, 'media');
const STAGING_DIR = path.join(DVSA_DIR, 'staging');
const OUT_QUESTIONS = path.join(STAGING_DIR, 'questions.v2.json');
const OUT_REPORT = path.join(STAGING_DIR, 'validation-report.json');

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

function cellText(value: unknown): string {
  if (value == null || value === '') return '';
  if (typeof value === 'object') {
    const v = value as {
      richText?: Array<{ text?: string }>;
      text?: string;
      result?: unknown;
      hyperlink?: string;
    };
    if (v.richText) return v.richText.map((t) => t.text || '').join('');
    if (v.text != null) return String(v.text);
    if (v.result != null) return String(v.result);
    if (v.hyperlink) return String(v.text || v.hyperlink);
  }
  return String(value);
}

function assessSourceVerification(): {
  status: 'NOT_VERIFIED' | 'VERIFIED';
  reason: string;
  workbook: string;
  analysis_bootstrap?: string;
} {
  let analysisBootstrap: string | undefined;
  if (fs.existsSync(ANALYSIS_PATH)) {
    try {
      const analysis = JSON.parse(fs.readFileSync(ANALYSIS_PATH, 'utf8')) as {
        bootstrap?: string;
      };
      analysisBootstrap = analysis.bootstrap;
    } catch {
      /* ignore */
    }
  }

  const officialMarker = path.join(DVSA_DIR, 'OFFICIAL_XLSX_VERIFIED');
  if (fs.existsSync(officialMarker)) {
    return {
      status: 'VERIFIED',
      reason: 'OFFICIAL_XLSX_VERIFIED marker present',
      workbook: XLSX_PATH,
      analysis_bootstrap: analysisBootstrap,
    };
  }

  if (
    analysisBootstrap &&
    /from sibling CSV|reconstructed|Created .* from sibling CSV/i.test(analysisBootstrap)
  ) {
    return {
      status: 'NOT_VERIFIED',
      reason:
        'XLSX was reconstructed from CSV by analyze-dvsa-workbook; official original XLSX not available. Source parity with DVSA official workbook is NOT verified.',
      workbook: XLSX_PATH,
      analysis_bootstrap: analysisBootstrap,
    };
  }

  if (!fs.existsSync(XLSX_PATH) && fs.existsSync(CSV_PATH)) {
    return {
      status: 'NOT_VERIFIED',
      reason: 'Only CSV present; no XLSX to verify against an official workbook.',
      workbook: CSV_PATH,
    };
  }

  return {
    status: 'NOT_VERIFIED',
    reason:
      'No OFFICIAL_XLSX_VERIFIED marker. Cannot declare source parity with the official DVSA workbook.',
    workbook: XLSX_PATH,
    analysis_bootstrap: analysisBootstrap,
  };
}

async function loadRawRows(): Promise<DvsaRawRow[]> {
  if (!fs.existsSync(XLSX_PATH)) {
    throw new Error(
      `Missing workbook ${XLSX_PATH}. Run npm run analyze:dvsa first (builds XLSX from CSV if needed).`
    );
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX_PATH);
  const ws = wb.worksheets[0];
  if (!ws) throw new Error('Workbook has no worksheets');

  const headerRow = ws.getRow(2);
  const headers: string[] = [];
  headerRow.eachCell((cell, col) => {
    headers[col] = cellText(cell.value).trim();
  });

  for (let i = 0; i < EXPECTED_HEADERS.length; i++) {
    const got = headers[i + 1] || '';
    if (got !== EXPECTED_HEADERS[i]) {
      console.warn(
        `Header col ${i + 1}: expected "${EXPECTED_HEADERS[i]}", got "${got}"`
      );
    }
  }

  const rows: DvsaRawRow[] = [];
  for (let r = 3; r <= ws.rowCount; r++) {
    const excelRow = ws.getRow(r);
    const obj: Record<string, string> = {};
    for (let c = 1; c <= EXPECTED_HEADERS.length; c++) {
      const key = headers[c] || EXPECTED_HEADERS[c - 1];
      obj[key] = cellText(excelRow.getCell(c).value).trim();
    }
    if (!obj.Item) continue;
    rows.push(obj as DvsaRawRow);
  }
  return rows;
}

async function main() {
  const source = assessSourceVerification();
  console.log(`Source verification: ${source.status}`);
  console.log(`  ${source.reason}`);

  const rawRows = await loadRawRows();
  const questions: DvsaStagingQuestion[] = [];
  const transformErrors: Array<{ id: string; errors: string[] }> = [];

  for (const row of rawRows) {
    const result = transformDvsaRow(row);
    if (result.ok) questions.push(result.question);
    else transformErrors.push({ id: result.id, errors: result.errors });
  }

  const validation = validateTransformedBank(questions, DVSA_V2_EXPECTED_COUNT);
  const imageOptionQuestions = countImageOptionQuestions(questions);

  if (!fs.existsSync(MEDIA_DIR)) {
    fs.mkdirSync(MEDIA_DIR, { recursive: true });
  }
  const mediaExists = (filename: string) =>
    fs.existsSync(path.join(MEDIA_DIR, filename));
  const media = resolveMediaPresence(validation.imageFilenames, mediaExists);

  fs.mkdirSync(STAGING_DIR, { recursive: true });

  const stagingPayload = {
    generated_at: new Date().toISOString(),
    phase: 'local-staging-only',
    expected_count: DVSA_V2_EXPECTED_COUNT,
    source_verification: source,
    note: 'Licensed DVSA content — do not commit or publish this file.',
    questions,
  };

  fs.writeFileSync(OUT_QUESTIONS, JSON.stringify(stagingPayload, null, 2), 'utf8');

  const report = {
    generated_at: new Date().toISOString(),
    phase: 'local-staging-only',
    source_verification: source,
    transform: {
      input_rows: rawRows.length,
      transformed: questions.length,
      transform_errors: transformErrors,
    },
    validation: {
      ...validation,
      imageOptionQuestions,
    },
    media: {
      media_dir: MEDIA_DIR,
      referenced_unique: media.resolved.length + media.unresolved.length,
      resolved_count: media.resolved.length,
      unresolved_count: media.unresolved.length,
      unresolved_sample: media.unresolved.slice(0, 40),
      note:
        media.unresolved.length > 0
          ? 'Place official DVSA media files into local-data/dvsa/media/ using the referenced filenames. Do not invent assets.'
          : 'All referenced media files found under local-data/dvsa/media/.',
    },
    outputs: {
      questions: OUT_QUESTIONS,
      report: OUT_REPORT,
    },
    ok: validation.ok && transformErrors.length === 0,
  };

  fs.writeFileSync(OUT_REPORT, JSON.stringify(report, null, 2), 'utf8');

  console.log(`Transformed: ${questions.length} / expected ${DVSA_V2_EXPECTED_COUNT}`);
  console.log(`Validation ok: ${report.ok}`);
  console.log(`Image-option questions: ${imageOptionQuestions}`);
  console.log(`Unresolved media: ${media.unresolved.length}`);
  console.log(`Wrote ${OUT_QUESTIONS}`);
  console.log(`Wrote ${OUT_REPORT}`);

  if (transformErrors.length) {
    console.error('Transform errors:', transformErrors.slice(0, 10));
  }
  if (validation.errors.length) {
    console.error('Validation errors:', validation.errors.slice(0, 20));
  }

  if (!report.ok) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
