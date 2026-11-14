/**
 * Controlled V2 cutover (service role):
 * 1) Attach public media URLs to draft v2 rows from upload result
 * 2) Archive published v1 (status=archived) — no delete
 * 3) Publish all draft v2 rows
 * 4) Update content_bank_meta to v2 / 758 (source_verification stays NOT_VERIFIED)
 *
 * Requires migration 0008 + draft import + media upload first.
 * Run only while CONTENT_MAINTENANCE_MODE=true on production.
 *
 * Usage:
 *   DVSA_V2_CUTOVER=true npx ts-node --compiler-options '{"module":"commonjs"}' \
 *     tools/cutover-dvsa-v2.ts --confirm-shared-supabase --i-understand-archive-v1
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import {
  EXPECTED_PUBLISHED_COUNT_V2,
  type QuestionRow,
} from '../lib/questions/types';
import {
  defaultStagingPaths,
  loadConversionManifest,
  loadStagingBundle,
  stagingQuestionToDraftRow,
} from '../lib/questions/dvsaV2Import';

function loadEnvLocal(cwd: string) {
  const envPath = path.join(cwd, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i <= 0) continue;
    let k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

type UploadResult = {
  results: Array<{
    original_ref: string;
    storage_path: string;
    public_url: string | null;
    ok: boolean;
  }>;
};

async function main() {
  const cwd = process.cwd();
  const args = new Set(process.argv.slice(2));
  const enabled = process.env.DVSA_V2_CUTOVER === 'true';
  const confirm = args.has('--confirm-shared-supabase');
  const archiveAck = args.has('--i-understand-archive-v1');

  if (!enabled || !confirm || !archiveAck) {
    console.error('BLOCKED. Required:');
    console.error('  DVSA_V2_CUTOVER=true');
    console.error('  --confirm-shared-supabase --i-understand-archive-v1');
    process.exitCode = 2;
    return;
  }

  loadEnvLocal(cwd);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('Missing Supabase credentials');
    process.exitCode = 2;
    return;
  }
  const host = new URL(url).host;
  if (!host.includes('anrtgdfbxjuhyglzyhih')) {
    console.error('Unexpected host', host);
    process.exitCode = 2;
    return;
  }

  const uploadPath = path.join(
    cwd,
    'local-data/dvsa/staging/media-upload-result.phase-4b.json'
  );
  if (!fs.existsSync(uploadPath)) {
    console.error('Missing media upload result. Run upload-dvsa-v2-media.ts first.');
    process.exitCode = 2;
    return;
  }
  const upload = JSON.parse(fs.readFileSync(uploadPath, 'utf8')) as UploadResult;
  const urlByRef = new Map<string, string>();
  for (const r of upload.results || []) {
    if (r.ok && r.public_url) urlByRef.set(r.original_ref, r.public_url);
  }

  const paths = defaultStagingPaths(cwd);
  const bundle = loadStagingBundle(paths.stagingQuestions);
  // Ensure conversion manifest is present (gates incomplete staging).
  loadConversionManifest(paths.conversionManifest);
  const resolve = (ref: string | null | undefined) => {
    if (!ref?.trim()) return null;
    return urlByRef.get(ref.trim()) || null;
  };

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Schema gate
  const { error: schemaErr } = await admin
    .from('questions')
    .select('id,content_version,status')
    .limit(1);
  if (schemaErr) {
    console.error('Schema gate failed (apply migration 0008 first):', schemaErr.message);
    process.exitCode = 2;
    return;
  }

  const { count: draftV2, error: dErr } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'draft')
    .eq('content_version', 'v2');
  if (dErr) {
    console.error(dErr.message);
    process.exitCode = 1;
    return;
  }
  if (draftV2 !== EXPECTED_PUBLISHED_COUNT_V2) {
    console.error(
      `Expected ${EXPECTED_PUBLISHED_COUNT_V2} draft v2 rows, found ${draftV2}`
    );
    process.exitCode = 2;
    return;
  }

  const { count: publishedBefore } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');
  console.log(`Pre-cutover: published=${publishedBefore} draft_v2=${draftV2}`);

  // Attach media URLs from staging mapping + upload map
  console.log('Attaching public media URLs to draft v2 rows...');
  let mediaUpdated = 0;
  for (let i = 0; i < bundle.questions.length; i++) {
    const q = bundle.questions[i];
    const { row } = stagingQuestionToDraftRow(q, resolve, i + 1);
    const patch: Partial<QuestionRow> = {
      image_url: row.image_url,
      image_alt: row.image_alt,
      answer_1_image_url: row.answer_1_image_url,
      answer_2_image_url: row.answer_2_image_url,
      answer_3_image_url: row.answer_3_image_url,
      answer_4_image_url: row.answer_4_image_url,
      media_original_refs: row.media_original_refs,
      media_review_status: row.media_review_status,
    };
    const { error } = await admin.from('questions').update(patch).eq('id', row.id);
    if (error) {
      console.error(`Media attach failed for ${row.id}:`, error.message);
      process.exitCode = 1;
      return;
    }
    mediaUpdated++;
    if (mediaUpdated % 100 === 0) console.log(`  media attached ${mediaUpdated}`);
  }
  console.log(`Media attached on ${mediaUpdated} draft rows.`);

  // Archive v1 published (and any non-v2 published), then publish v2.
  // Not a single Postgres transaction via REST — on any publish/verify failure,
  // immediately republish the archived ids so we never leave a partial bank.
  console.log('Archiving published non-v2 rows...');
  const { data: archivedRows, error: archErr } = await admin
    .from('questions')
    .update({ status: 'archived' })
    .eq('status', 'published')
    .neq('content_version', 'v2')
    .select('id');
  if (archErr) {
    console.error('Archive failed:', archErr.message);
    process.exitCode = 1;
    return;
  }
  const archivedIds = (archivedRows || []).map((r) => r.id as string);
  const archivedCount = archivedIds.length;
  console.log(`Archived ${archivedCount} rows.`);

  async function rollbackArchive(reason: string) {
    console.error(`CUTOVER FAILED (${reason}). Rolling back archive → republish v1...`);
    if (archivedIds.length === 0) return;
    // Batch in chunks to avoid URL/body limits
    const chunkSize = 200;
    for (let i = 0; i < archivedIds.length; i += chunkSize) {
      const chunk = archivedIds.slice(i, i + chunkSize);
      const { error: rbErr } = await admin
        .from('questions')
        .update({ status: 'published' })
        .in('id', chunk)
        .eq('status', 'archived');
      if (rbErr) {
        console.error('CRITICAL: rollback republish failed:', rbErr.message);
        console.error('Keep CONTENT_MAINTENANCE_MODE=true and restore from backup.');
        return;
      }
    }
    // Ensure any partially published v2 drafts are not left published
    await admin
      .from('questions')
      .update({ status: 'draft' })
      .eq('content_version', 'v2')
      .eq('status', 'published');
    const { count: restored } = await admin
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published');
    console.error(`Rollback complete. published=${restored} (expect prior v1 count). Maintenance must stay ON.`);
  }

  // Publish all draft v2
  console.log('Publishing draft v2...');
  const { data: publishedRows, error: pubErr } = await admin
    .from('questions')
    .update({ status: 'published' })
    .eq('status', 'draft')
    .eq('content_version', 'v2')
    .select('id');
  if (pubErr) {
    console.error('Publish failed:', pubErr.message);
    await rollbackArchive('publish_error');
    process.exitCode = 1;
    return;
  }
  const publishedCount = publishedRows?.length || 0;
  console.log(`Published ${publishedCount} v2 rows.`);

  const { count: livePublished } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');
  const { count: liveV2 } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')
    .eq('content_version', 'v2');

  if (livePublished !== EXPECTED_PUBLISHED_COUNT_V2 || liveV2 !== EXPECTED_PUBLISHED_COUNT_V2) {
    console.error(
      `CUTOVER INCOMPLETE: published=${livePublished} v2_published=${liveV2} expected=${EXPECTED_PUBLISHED_COUNT_V2}`
    );
    await rollbackArchive('post_publish_count_mismatch');
    process.exitCode = 1;
    return;
  }

  // Meta — do NOT flip source_verification to VERIFIED
  const { error: metaErr } = await admin.from('content_bank_meta').upsert({
    id: 'default',
    active_content_version: 'v2',
    expected_published_count: EXPECTED_PUBLISHED_COUNT_V2,
    source_verification_status: 'NOT_VERIFIED',
    cutover_notes: `Phase 4B cutover ${new Date().toISOString()}; archived_v1=${archivedCount}; published_v2=${publishedCount}`,
    updated_at: new Date().toISOString(),
  });
  if (metaErr) {
    console.error('content_bank_meta update failed:', metaErr.message);
    process.exitCode = 1;
    return;
  }

  // Anon isolation check
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (anonKey) {
    const anon = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { count: anonCount } = await anon
      .from('questions')
      .select('id', { count: 'exact', head: true });
    const { count: anonDraft } = await anon
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'draft');
    console.log(`Anon visible=${anonCount} (expect ${EXPECTED_PUBLISHED_COUNT_V2}), anon draft=${anonDraft} (expect 0)`);
  }

  const report = {
    generated_at: new Date().toISOString(),
    archived_v1: archivedCount,
    published_v2: publishedCount,
    live_published: livePublished,
    source_verification_status: 'NOT_VERIFIED',
    ok: true,
  };
  fs.writeFileSync(
    path.join(cwd, 'local-data/dvsa/staging/cutover-result.phase-4b.json'),
    JSON.stringify(report, null, 2)
  );
  console.log('\nCUTOVER OK', report);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
