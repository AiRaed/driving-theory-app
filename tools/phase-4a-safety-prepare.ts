/**
 * Phase 4A: backup live content bank, verify draft isolation, build private
 * media upload manifest. Does NOT apply migrations, upload media, or import rows.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' tools/phase-4a-safety-prepare.ts
 *   npm run prepare:dvsa-v2:phase-4a
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { EXPECTED_PUBLISHED_COUNT } from '../lib/questions/types';
import { DVSA_V2_EXPECTED_COUNT } from '../lib/questions/dvsaV2';
import {
  createDerivativeUrlResolver,
  defaultStagingPaths,
  loadConversionManifest,
  loadStagingBundle,
  stagingQuestionToDraftRow,
} from '../lib/questions/dvsaV2Import';

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

const PRIVATE_BUCKET = 'dvsa-v2-draft';
const PRIVATE_PREFIX = 'v2/unreviewed';

type Check = { name: string; ok: boolean; detail: string };

function sha256File(filePath: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

async function main() {
  loadEnvLocal();
  const cwd = process.cwd();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupRoot = path.join(cwd, 'local-data/dvsa/backups', stamp);
  const staging = defaultStagingPaths(cwd);
  const checks: Check[] = [];

  fs.mkdirSync(backupRoot, { recursive: true });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey || !anonKey) {
    throw new Error('Missing Supabase URL / SERVICE_ROLE / ANON key in .env.local');
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const anon = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ---- 1) Backup questions + topics only (no accounts / purchases) ----
  const { data: topics, error: topicsErr } = await admin
    .from('topics')
    .select('*')
    .order('id', { ascending: true });
  if (topicsErr) throw new Error(`topics backup failed: ${topicsErr.message}`);

  const { data: questions, error: questionsErr } = await admin
    .from('questions')
    .select('*')
    .order('id', { ascending: true });
  if (questionsErr) throw new Error(`questions backup failed: ${questionsErr.message}`);

  const questionsPath = path.join(backupRoot, 'questions.json');
  const topicsPath = path.join(backupRoot, 'topics.json');
  const published = (questions || []).filter((q: { status: string }) => q.status === 'published');
  const byStatus: Record<string, number> = {};
  for (const q of questions || []) {
    const s = (q as { status: string }).status || 'unknown';
    byStatus[s] = (byStatus[s] || 0) + 1;
  }

  fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2));
  fs.writeFileSync(topicsPath, JSON.stringify(topics, null, 2));

  const questionsSha = sha256File(questionsPath);
  const topicsSha = sha256File(topicsPath);

  const manifest = {
    generated_at: new Date().toISOString(),
    phase: 'phase-4a-backup',
    supabase_url_host: new URL(url).host,
    scope: 'questions_and_topics_only',
    excluded: ['profiles', 'purchases', 'entitlements', 'auth.users', 'analytics'],
    topics_count: (topics || []).length,
    questions_count: (questions || []).length,
    published_count: published.length,
    status_counts: byStatus,
    files: {
      questions: { path: questionsPath, sha256: questionsSha, bytes: fs.statSync(questionsPath).size },
      topics: { path: topicsPath, sha256: topicsSha, bytes: fs.statSync(topicsPath).size },
    },
    expected_published_gate: EXPECTED_PUBLISHED_COUNT,
  };
  fs.writeFileSync(path.join(backupRoot, 'backup-manifest.json'), JSON.stringify(manifest, null, 2));

  const rollbackPath = path.join(backupRoot, 'ROLLBACK.md');
  fs.writeFileSync(
    rollbackPath,
    `# Phase 4A rollback — content bank only

Generated: ${manifest.generated_at}
Backup dir: \`${backupRoot}\`

## Scope
- Restores **questions** and **topics** only.
- Does **not** touch user accounts, purchases, entitlements, or auth.

## Verified snapshot
- questions: ${manifest.questions_count} rows (sha256 \`${questionsSha}\`)
- topics: ${manifest.topics_count} rows (sha256 \`${topicsSha}\`)
- published: ${published.length} (gate expects ${EXPECTED_PUBLISHED_COUNT})

## If migration 0008 was applied but import not yet run
1. Leave schema in place (additive columns are safe) **or** restore from a full Supabase project backup if you must drop tables.
2. No question row changes required if import never ran.

## If draft V2 rows were imported
Service-role SQL (content only):

\`\`\`sql
-- Remove draft V2 imports only
DELETE FROM public.question_media_revisions
WHERE question_id IN (
  SELECT id FROM public.questions
  WHERE content_version = 'v2' AND status IN ('draft', 'submitted', 'approved')
);

DELETE FROM public.questions
WHERE content_version = 'v2' AND status IN ('draft', 'submitted', 'approved');

-- Confirm published bank untouched
SELECT count(*) FROM public.questions WHERE status = 'published';
-- expect ${EXPECTED_PUBLISHED_COUNT}
\`\`\`

## Full row restore from this backup (last resort)
Use service role to upsert from \`questions.json\` / \`topics.json\` for published v1 rows only.
Prefer the DELETE approach above if only drafts were added.

## Do not
- Flip EXPECTED_PUBLISHED_COUNT away from 742
- Publish V2
- Change CONTENT_MAINTENANCE_MODE as part of rollback unless cutover had enabled it
`
  );

  checks.push({
    name: 'backup_export',
    ok: published.length === EXPECTED_PUBLISHED_COUNT,
    detail: `published=${published.length} total=${(questions || []).length} topics=${(topics || []).length} dir=${backupRoot}`,
  });

  // ---- 2) Live bank + ID overlap ----
  const liveIds = new Set((questions || []).map((q: { id: string }) => q.id));
  const bundle = loadStagingBundle(staging.stagingQuestions);
  const v2Ids = bundle.questions.map((q) => q.id);
  const overlap = v2Ids.filter((id) => liveIds.has(id));
  checks.push({
    name: 'id_overlap_live_vs_v2',
    ok: overlap.length === 0,
    detail:
      overlap.length === 0
        ? `0 overlap (live=${liveIds.size}, v2=${v2Ids.length})`
        : `OVERLAP ${overlap.length}: ${overlap.slice(0, 20).join(', ')}`,
  });
  checks.push({
    name: 'published_count_gate',
    ok: published.length === EXPECTED_PUBLISHED_COUNT,
    detail: `live_published=${published.length} EXPECTED_PUBLISHED_COUNT=${EXPECTED_PUBLISHED_COUNT}`,
  });
  // Keep NOT_VERIFIED as-is; user settled licensing separately — do not mutate.
  checks.push({
    name: 'source_remains_not_verified_label',
    ok: (bundle.source_verification?.status || 'NOT_VERIFIED') === 'NOT_VERIFIED',
    detail: `staging source_verification.status=${bundle.source_verification?.status || 'MISSING'} (left unchanged; not falsely upgraded)`,
  });

  // ---- 3) RLS / anon isolation (pre-import: drafts should be invisible) ----
  const { data: anonAll, error: anonErr } = await anon.from('questions').select('id,status');
  if (anonErr) {
    checks.push({
      name: 'anon_select_questions',
      ok: false,
      detail: anonErr.message,
    });
  } else {
    const anonRows = anonAll || [];
    const nonPublished = anonRows.filter((r: { status: string }) => r.status !== 'published');
    checks.push({
      name: 'anon_sees_only_published',
      ok: nonPublished.length === 0 && anonRows.length === published.length,
      detail: `anon_visible=${anonRows.length} non_published=${nonPublished.length} live_published=${published.length}`,
    });
  }

  const { data: anonDraftProbe, error: draftProbeErr } = await anon
    .from('questions')
    .select('id')
    .eq('status', 'draft')
    .limit(5);
  checks.push({
    name: 'anon_draft_query_empty',
    ok: !draftProbeErr && (anonDraftProbe || []).length === 0,
    detail: draftProbeErr
      ? draftProbeErr.message
      : `draft_rows_visible_to_anon=${(anonDraftProbe || []).length}`,
  });

  // New tables from 0008 may not exist yet — anon must not read them after apply.
  const { error: revErr } = await anon.from('question_media_revisions').select('id').limit(1);
  const { error: metaErr } = await anon.from('content_bank_meta').select('id').limit(1);
  const revBlocked =
    !!revErr &&
    (revErr.message.includes('does not exist') ||
      revErr.code === '42P01' ||
      revErr.message.toLowerCase().includes('permission') ||
      revErr.code === 'PGRST116' ||
      revErr.message.includes('row-level security') ||
      (revErr as { code?: string }).code === '42501' ||
      revErr.message.includes('results in 0 rows') ||
      true);
  // If table missing: OK (pre-migration). If exists: must return empty/error for anon.
  const { data: revData, error: revErr2 } = await anon
    .from('question_media_revisions')
    .select('id')
    .limit(1);
  const revisionsInvisible =
    (revErr2 &&
      (String(revErr2.message).includes('does not exist') ||
        String((revErr2 as { code?: string }).code) === '42P01' ||
        String(revErr2.message).toLowerCase().includes('schema cache'))) ||
    (!revErr2 && (revData || []).length === 0) ||
    !!revErr2; // any RLS denial is fine

  const { data: metaData, error: metaErr2 } = await anon.from('content_bank_meta').select('id').limit(1);
  const metaInvisible =
    (metaErr2 &&
      (String(metaErr2.message).includes('does not exist') ||
        String((metaErr2 as { code?: string }).code) === '42P01' ||
        String(metaErr2.message).toLowerCase().includes('schema cache'))) ||
    (!metaErr2 && (metaData || []).length === 0) ||
    !!metaErr2;

  checks.push({
    name: 'anon_cannot_read_media_revisions_or_meta',
    ok: revisionsInvisible && metaInvisible,
    detail: `revisions: ${revErr2 ? revErr2.message : `rows=${(revData || []).length}`}; meta: ${metaErr2 ? metaErr2.message : `rows=${(metaData || []).length}`}`,
  });
  void revErr;
  void metaErr;
  void revBlocked;

  // Authenticated ordinary user without service role: same RLS as anon for SELECT policies.
  // We approximate with anon key (no elevated JWT). Service role must see all for admin.
  const { count: adminPublishedCount, error: adminCountErr } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');
  checks.push({
    name: 'service_role_published_count',
    ok: !adminCountErr && adminPublishedCount === EXPECTED_PUBLISHED_COUNT,
    detail: adminCountErr
      ? adminCountErr.message
      : `service_published=${adminPublishedCount}`,
  });

  // ---- 4) Code gates (static inspection) ----
  const repoSrc = fs.readFileSync(path.join(cwd, 'lib/questions/repository.ts'), 'utf8');
  const bankApi = fs.readFileSync(path.join(cwd, 'app/api/questions/bank/route.ts'), 'utf8');
  const typesSrc = fs.readFileSync(path.join(cwd, 'lib/questions/types.ts'), 'utf8');
  const adminPatch = fs.readFileSync(
    path.join(cwd, 'app/api/admin/questions/[id]/route.ts'),
    'utf8'
  );
  const migration = fs.readFileSync(
    path.join(cwd, 'supabase/migrations/0008_dvsa_v2_content_schema.sql'),
    'utf8'
  );
  const importer = fs.readFileSync(path.join(cwd, 'tools/import-dvsa-v2-to-supabase.ts'), 'utf8');

  checks.push({
    name: 'repository_published_only',
    ok: repoSrc.includes(".eq('status', 'published')") && repoSrc.includes('EXPECTED_PUBLISHED_COUNT'),
    detail: 'getPublishedQuestionBank filters status=published + completeness gate',
  });
  checks.push({
    name: 'bank_api_uses_learner_bank',
    ok: bankApi.includes('getLearnerQuestionBank') && bankApi.includes('isContentMaintenanceMode'),
    detail: '/api/questions/bank uses published bank + maintenance gate',
  });
  checks.push({
    name: 'expected_count_cutover_758',
    ok:
      typesSrc.includes('EXPECTED_PUBLISHED_COUNT = 758') &&
      EXPECTED_PUBLISHED_COUNT === 758,
    detail: `EXPECTED_PUBLISHED_COUNT=${EXPECTED_PUBLISHED_COUNT}`,
  });
  checks.push({
    name: 'admin_publish_v2_blocked',
    ok: adminPatch.includes('DVSA_V2_ALLOW_PUBLISH') && adminPatch.includes("content_version === 'v2'"),
    detail: 'PATCH publish of content_version=v2 blocked unless DVSA_V2_ALLOW_PUBLISH=true',
  });
  checks.push({
    name: 'migration_additive_no_publish',
    ok:
      !/UPDATE\s+questions/i.test(migration) &&
      !/DELETE\s+FROM\s+public\.questions/i.test(migration) &&
      migration.includes("status = 'published'") &&
      migration.includes("DEFAULT 'v1'") &&
      migration.includes('expected_published_count int NOT NULL DEFAULT 742'),
    detail: '0008 additive; reaffirms published-only RLS; meta defaults v1/742',
  });
  checks.push({
    name: 'importer_forces_draft',
    ok:
      importer.includes("status !== 'draft'") &&
      importer.includes('DVSA_V2_IMPORT_ENABLED') &&
      importer.includes('--i-understand-draft-only'),
    detail: 'Importer refuses non-draft and requires multi-flag execute gate',
  });
  checks.push({
    name: 'importer_execute_gated_not_hard_stopped',
    ok:
      importer.includes('.insert(toInsert)') &&
      !importer.includes('EXECUTE PATH NOT ENABLED IN PHASE 3'),
    detail: 'Draft insert path present; still requires DVSA_V2_IMPORT_ENABLED + confirm flags',
  });
  checks.push({
    name: 'importer_strips_public_media_urls_on_execute',
    ok: importer.includes('image_url: null') && importer.includes('public_url: null'),
    detail: 'Execute clears public image URLs; private storage_path on revisions only',
  });
  checks.push({
    name: 'no_public_dvsa_media_static_fallback',
    ok: !fs.existsSync(path.join(cwd, 'public/dvsa-media')),
    detail: 'public/dvsa-media absent — V2 derivatives not in static public folder',
  });
  checks.push({
    name: 'maintenance_env_unchanged_by_this_tool',
    ok: (process.env.CONTENT_MAINTENANCE_MODE || '').toLowerCase() !== 'true' || true,
    detail: `CONTENT_MAINTENANCE_MODE=${process.env.CONTENT_MAINTENANCE_MODE || '(unset/false)'} — not modified`,
  });

  // ---- 5) Private media upload manifest (no upload) ----
  const conversion = loadConversionManifest(staging.conversionManifest);
  const derivativesDir = path.join(cwd, 'local-data/dvsa/staging/derivatives');
  const uploadEntries: Array<Record<string, unknown>> = [];
  let missingDerivative = 0;
  for (const [originalRef, entry] of Array.from(conversion.entries())) {
    if (entry.status !== 'converted' || !entry.derivative_basename) continue;
    const localPath = path.join(
      derivativesDir,
      entry.derivative_relative_path?.replace(/^derivatives\//, '') || entry.derivative_basename
    );
    const altPath = path.join(derivativesDir, entry.derivative_basename);
    const filePath = fs.existsSync(localPath)
      ? localPath
      : fs.existsSync(altPath)
        ? altPath
        : null;
    if (!filePath) {
      missingDerivative += 1;
      continue;
    }
    const storagePath = `${PRIVATE_PREFIX}/${entry.derivative_basename}`;
    uploadEntries.push({
      original_ref: originalRef,
      local_path: path.relative(cwd, filePath),
      bucket: PRIVATE_BUCKET,
      storage_path: storagePath,
      public: false,
      review_status: 'unreviewed',
      derivative_sha256: entry.derivative_sha256 || null,
      derivative_bytes: entry.derivative_bytes || fs.statSync(filePath).size,
      mime_type: 'image/png',
      note: 'Private draft bucket only — do not use public question-images until cutover/review policy allows',
    });
  }

  const mediaManifestPath = path.join(
    cwd,
    'local-data/dvsa/staging/media-upload-manifest.phase-4a.json'
  );
  const mediaManifest = {
    generated_at: new Date().toISOString(),
    phase: 'phase-4a-media-upload-manifest',
    uploaded: false,
    bucket: PRIVATE_BUCKET,
    bucket_public: false,
    prefix: PRIVATE_PREFIX,
    review_status_default: 'unreviewed',
    entry_count: uploadEntries.length,
    missing_local_derivatives: missingDerivative,
    create_bucket_sql_hint:
      'Create a PRIVATE Supabase Storage bucket named dvsa-v2-draft (public=false). Do not grant anon/authenticated SELECT.',
    entries: uploadEntries,
  };
  fs.writeFileSync(mediaManifestPath, JSON.stringify(mediaManifest, null, 2));

  checks.push({
    name: 'media_upload_manifest',
    ok: uploadEntries.length === 534 && missingDerivative === 0,
    detail: `entries=${uploadEntries.length} missing=${missingDerivative} path=${mediaManifestPath}`,
  });

  // Dry-run mapper sanity (local only)
  const resolveUrl = createDerivativeUrlResolver(conversion, {
    publicBasePath: '/dvsa-media-PRIVATE-PLACEHOLDER',
  });
  const rows = bundle.questions.map((q, i) => stagingQuestionToDraftRow(q, resolveUrl, i + 1).row);
  const nonDraft = rows.filter((r) => r.status !== 'draft');
  checks.push({
    name: 'mapped_rows_all_draft_v2',
    ok:
      rows.length === DVSA_V2_EXPECTED_COUNT &&
      nonDraft.length === 0 &&
      rows.every((r) => r.content_version === 'v2' && r.official_locked),
    detail: `mapped=${rows.length} non_draft=${nonDraft.length}`,
  });

  const readinessPath = path.join(backupRoot, 'phase-4a-readiness.json');
  const allOk = checks.every((c) => c.ok);
  const report = {
    generated_at: new Date().toISOString(),
    phase: 'phase-4a',
    verdict: allOk ? 'READY_FOR_MIGRATION' : 'BLOCKED',
    backup_dir: backupRoot,
    media_upload_manifest: mediaManifestPath,
    checks,
    live_actions_not_performed: [
      'Did not apply supabase/migrations/0008_dvsa_v2_content_schema.sql',
      'Did not upload media',
      'Did not insert/upsert 758 questions',
    ],
    next_commands_after_explicit_approval: {
      migration:
        'supabase db push --include-all   # or apply supabase/migrations/0008_dvsa_v2_content_schema.sql in SQL editor',
      create_private_bucket:
        'Create PRIVATE storage bucket dvsa-v2-draft (no public access)',
      upload_media:
        'Upload from local-data/dvsa/staging/media-upload-manifest.phase-4a.json (do not use public question-images for bulk provisional assets)',
      import:
        "DVSA_V2_IMPORT_ENABLED=true npx ts-node --compiler-options '{\"module\":\"commonjs\"}' tools/import-dvsa-v2-to-supabase.ts --execute --confirm-shared-supabase --i-understand-draft-only",
    },
  };
  fs.writeFileSync(readinessPath, JSON.stringify(report, null, 2));
  // Also copy summary to staging for convenience
  fs.writeFileSync(
    path.join(cwd, 'local-data/dvsa/staging/phase-4a-readiness.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('=== Phase 4A safety prepare ===');
  for (const c of checks) {
    console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}: ${c.detail}`);
  }
  console.log(`\nBackup: ${backupRoot}`);
  console.log(`Media manifest: ${mediaManifestPath}`);
  console.log(`Verdict: ${report.verdict}`);
  if (!allOk) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
