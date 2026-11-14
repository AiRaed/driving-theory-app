/**
 * DVSA V2 batch importer — Phase 4A.
 *
 * DEFAULT MODE: dry-run only (writes local report under local-data/dvsa/staging/).
 * Does NOT connect to Supabase unless ALL execute guards pass.
 *
 * Safety:
 * - Never publishes (status forced to draft)
 * - Never deletes/archives existing questions
 * - Never flips EXPECTED_PUBLISHED_COUNT or maintenance flags
 * - Shared Supabase: draft rows stay invisible via RLS until explicit cutover
 * - Media URLs left null on import; private storage_path recorded on revisions
 *
 * Usage:
 *   npm run import:dvsa-v2:dry-run
 *
 * Execute (after explicit approval + migration 0008 + private media upload):
 *   DVSA_V2_IMPORT_ENABLED=true npx ts-node --compiler-options '{"module":"commonjs"}' \
 *     tools/import-dvsa-v2-to-supabase.ts --execute --confirm-shared-supabase --i-understand-draft-only
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { DVSA_V2_EXPECTED_COUNT } from '../lib/questions/dvsaV2';
import { EXPECTED_PUBLISHED_COUNT } from '../lib/questions/types';

/** Pre-cutover live bank size — draft import must not change this. */
const PRE_CUTOVER_PUBLISHED_COUNT = 742;
import {
  buildDryRunReport,
  createDerivativeUrlResolver,
  defaultStagingPaths,
  loadConversionManifest,
  loadStagingBundle,
  stagingQuestionToDraftRow,
  type DvsaV2DbRow,
  type MediaRevisionSeed,
} from '../lib/questions/dvsaV2Import';

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function loadEnvLocal(cwd = process.cwd()) {
  const envPath = path.join(cwd, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

type UploadManifestEntry = {
  original_ref: string;
  storage_path: string;
  bucket: string;
  derivative_sha256?: string | null;
};

function loadUploadManifest(cwd: string): Map<string, UploadManifestEntry> {
  const p = path.join(cwd, 'local-data/dvsa/staging/media-upload-manifest.phase-4a.json');
  if (!fs.existsSync(p)) return new Map();
  const raw = JSON.parse(fs.readFileSync(p, 'utf8')) as {
    entries?: UploadManifestEntry[];
  };
  const map = new Map<string, UploadManifestEntry>();
  for (const e of raw.entries || []) {
    if (e?.original_ref) map.set(e.original_ref, e);
  }
  return map;
}

async function main() {
  const cwd = process.cwd();
  const paths = defaultStagingPaths(cwd);
  const execute = hasFlag('--execute');
  const confirmShared = hasFlag('--confirm-shared-supabase');
  const draftOnly = hasFlag('--i-understand-draft-only');
  const importEnabled = (process.env.DVSA_V2_IMPORT_ENABLED || '').trim() === 'true';

  console.log('=== DVSA V2 importer (Phase 4A) ===');
  console.log(`Expected count: ${DVSA_V2_EXPECTED_COUNT}`);
  console.log(`Staging: ${paths.stagingQuestions}`);
  console.log(`Mode: ${execute ? 'EXECUTE REQUESTED' : 'dry-run'}`);
  console.log(
    `Pre-cutover published gate: ${PRE_CUTOVER_PUBLISHED_COUNT} (post-cutover learner gate: ${EXPECTED_PUBLISHED_COUNT})`
  );

  if (!fs.existsSync(paths.stagingQuestions)) {
    throw new Error(`Missing staging file: ${paths.stagingQuestions}`);
  }
  if (!fs.existsSync(paths.conversionManifest)) {
    throw new Error(`Missing conversion manifest: ${paths.conversionManifest}`);
  }

  const bundle = loadStagingBundle(paths.stagingQuestions);
  const manifest = loadConversionManifest(paths.conversionManifest);
  const resolveUrl = createDerivativeUrlResolver(manifest, {
    publicBasePath: process.env.DVSA_V2_MEDIA_BASE_PATH || '/dvsa-media',
  });

  const sv = bundle.source_verification;
  console.log(
    `Source verification: ${sv?.status || 'MISSING'} — ${sv?.reason || 'no reason'}`
  );
  if (sv?.status === 'VERIFIED') {
    console.warn(
      'WARNING: staging claims VERIFIED. Confirm official original workbook before trusting that label.'
    );
  } else {
    console.warn(
      'Source remains NOT_VERIFIED in metadata (do not silently mark verified). Licensing may be settled separately.'
    );
  }

  const rows: DvsaV2DbRow[] = [];
  const revisions: MediaRevisionSeed[] = [];
  const warnings: string[] = [];

  bundle.questions.forEach((q, index) => {
    const mapped = stagingQuestionToDraftRow(q, resolveUrl, index + 1);
    rows.push(mapped.row);
    revisions.push(...mapped.revisions);
    warnings.push(...mapped.warnings);
  });

  // Safety: never allow published in mapped payload
  for (const row of rows) {
    if (row.status !== 'draft') {
      throw new Error(`Refusing non-draft status for ${row.id}`);
    }
    if (row.content_version !== 'v2') {
      throw new Error(`Refusing non-v2 content_version for ${row.id}`);
    }
    if (!row.official_locked) {
      throw new Error(`Refusing unlocked official row for ${row.id}`);
    }
  }

  const report = buildDryRunReport(bundle, rows, warnings, revisions.length);
  fs.mkdirSync(path.dirname(paths.dryRunReport), { recursive: true });
  fs.writeFileSync(paths.dryRunReport, JSON.stringify(report, null, 2));
  fs.writeFileSync(
    paths.dryRunRowsSample,
    JSON.stringify(
      {
        note: 'Sample only — full licensed bank stays in questions.v2.json',
        sample: rows.slice(0, 3),
        revision_sample: revisions.slice(0, 5),
      },
      null,
      2
    )
  );

  console.log(`Dry-run report: ${paths.dryRunReport}`);
  console.log(`Rows ready (draft): ${rows.length}`);
  console.log(`Media revision seeds: ${revisions.length}`);
  console.log(`Unresolved media slots: ${report.unresolved_media_slots}`);
  console.log(`ok=${report.ok} errors=${report.errors.length}`);

  if (!execute) {
    console.log('\nDry-run complete. No Supabase connection attempted.');
    console.log(
      'Next: Phase 4A safety prepare / apply migration 0008 only after explicit approval.'
    );
    return;
  }

  // ---- Execute path (still draft-only; blocked without guards) ----
  if (!importEnabled || !confirmShared || !draftOnly) {
    console.error('\nEXECUTE BLOCKED. Required:');
    console.error('  DVSA_V2_IMPORT_ENABLED=true');
    console.error('  --execute --confirm-shared-supabase --i-understand-draft-only');
    console.error('Also: migration 0008 must already be applied; media uploaded; ID overlap checked.');
    process.exitCode = 2;
    return;
  }

  if (!report.ok) {
    console.error('\nEXECUTE BLOCKED: dry-run report not ok.');
    console.error(report.errors);
    process.exitCode = 2;
    return;
  }

  loadEnvLocal(cwd);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exitCode = 2;
    return;
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Schema gate: migration 0008 columns must exist
  const { error: schemaErr } = await admin
    .from('questions')
    .select('id,content_version,media_review_status,official_locked')
    .limit(1);
  if (schemaErr) {
    console.error('\nEXECUTE BLOCKED: migration 0008 schema not available.');
    console.error(schemaErr.message);
    process.exitCode = 2;
    return;
  }

  const { data: existing, error: existingErr } = await admin.from('questions').select('id,status');
  if (existingErr) {
    console.error('Failed to load existing question ids:', existingErr.message);
    process.exitCode = 1;
    return;
  }
  const existingById = new Map(
    (existing || []).map((r: { id: string; status: string }) => [r.id, r.status])
  );
  const overlapPublished = rows.filter((r) => existingById.get(r.id) === 'published');
  if (overlapPublished.length > 0) {
    console.error(
      `\nEXECUTE BLOCKED: ${overlapPublished.length} V2 ids collide with published rows.`
    );
    console.error(overlapPublished.slice(0, 20).map((r) => r.id).join(', '));
    process.exitCode = 2;
    return;
  }

  const { count: publishedCount, error: pubErr } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');
  if (pubErr || publishedCount !== PRE_CUTOVER_PUBLISHED_COUNT) {
    console.error(
      `\nEXECUTE BLOCKED: published count is ${publishedCount}, expected ${PRE_CUTOVER_PUBLISHED_COUNT} before cutover.`
    );
    process.exitCode = 2;
    return;
  }

  const uploadMap = loadUploadManifest(cwd);
  // Strip public image URLs for draft import — private storage_path only on revisions.
  const draftRows = rows.map((row) => ({
    ...row,
    image_url: null,
    answer_1_image_url: null,
    answer_2_image_url: null,
    answer_3_image_url: null,
    answer_4_image_url: null,
    image_alt: row.image_alt
      ? 'Illustration pending private media attach / admin review'
      : null,
  }));

  const draftRevisions = revisions.map((rev) => {
    const up = uploadMap.get(rev.original_ref);
    return {
      ...rev,
      public_url: null as string | null,
      storage_path: up?.storage_path || rev.storage_path,
      sha256: up?.derivative_sha256 || rev.sha256,
      review_status: 'unreviewed' as const,
    };
  });

  console.log(`\nInserting ${draftRows.length} draft v2 rows (service role)...`);
  const batchSize = 50;
  let inserted = 0;
  for (let i = 0; i < draftRows.length; i += batchSize) {
    const batch = draftRows.slice(i, i + batchSize);
    // Skip ids that already exist as non-published v2 (idempotent re-run)
    const toInsert = batch.filter((r) => {
      const st = existingById.get(r.id);
      if (!st) return true;
      if (st === 'published') return false;
      return false; // already present — skip (use admin tools to replace)
    });
    if (toInsert.length === 0) continue;
    const { error: insErr } = await admin.from('questions').insert(toInsert);
    if (insErr) {
      console.error(`Insert failed at offset ${i}:`, insErr.message);
      process.exitCode = 1;
      return;
    }
    inserted += toInsert.length;
  }

  console.log(`Inserted ${inserted} question rows (skipped existing ids).`);

  // Media revisions (requires question rows to exist)
  let revInserted = 0;
  for (let i = 0; i < draftRevisions.length; i += batchSize) {
    const batch = draftRevisions.slice(i, i + batchSize);
    const { error: revErr } = await admin.from('question_media_revisions').insert(batch);
    if (revErr) {
      console.error(`Revision insert failed at offset ${i}:`, revErr.message);
      process.exitCode = 1;
      return;
    }
    revInserted += batch.length;
  }
  console.log(`Inserted ${revInserted} media revision seeds (public_url=null, unreviewed).`);

  const { count: stillPublished } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');
  const { count: draftV2 } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'draft')
    .eq('content_version', 'v2');

  console.log(`\nPost-import: published=${stillPublished} (must stay ${PRE_CUTOVER_PUBLISHED_COUNT})`);
  console.log(`Post-import: draft v2=${draftV2}`);
  if (stillPublished !== PRE_CUTOVER_PUBLISHED_COUNT) {
    console.error('WARNING: published count changed — investigate immediately.');
    process.exitCode = 1;
    return;
  }
  console.log('Execute complete: draft-only import. Learners still on published v1 bank.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
