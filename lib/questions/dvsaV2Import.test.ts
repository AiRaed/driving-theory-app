import assert from 'node:assert/strict';
import {
  buildDryRunReport,
  createDerivativeUrlResolver,
  stagingQuestionToDraftRow,
  type ConversionManifestEntry,
} from './dvsaV2Import';
import type { DvsaStagingQuestion } from './dvsaV2';

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const sample: DvsaStagingQuestion = {
  id: 'AB2001',
  topic: 'alertness',
  promptEn: 'Why check mirrors?',
  promptAr: '',
  options: [
    { en: 'A', ar: '', correct: false },
    { en: 'B', ar: '', correct: true },
    { en: 'C', ar: '', correct: false },
    { en: '', ar: '', correct: false, image: 'AB2117a.gif' },
  ],
  keywords: [],
  image: 'AB2001.gif',
  explanationEn: 'Because awareness.',
  correctAnswer: 2,
  source: {
    dvsaTopic: 'Alertness',
    answerMarkerRaw: 'B',
    answerMarkerNormalized: 'B',
  },
};

run('draft row is isolated from live publish', () => {
  const manifest = new Map<string, ConversionManifestEntry>([
    [
      'AB2001.gif',
      {
        original_ref: 'AB2001.gif',
        status: 'converted',
        derivative_basename: 'AB2001.gif.png',
      },
    ],
    [
      'AB2117a.gif',
      {
        original_ref: 'AB2117a.gif',
        status: 'converted',
        derivative_basename: 'AB2117a.gif.png',
      },
    ],
  ]);
  const resolve = createDerivativeUrlResolver(manifest);
  const { row, revisions, warnings } = stagingQuestionToDraftRow(sample, resolve, 1);
  assert.equal(row.status, 'draft');
  assert.equal(row.content_version, 'v2');
  assert.equal(row.official_locked, true);
  assert.equal(row.media_review_status, 'unreviewed');
  assert.equal(row.official_source_id, 'AB2001');
  assert.equal(row.image_url, '/dvsa-media/AB2001.gif.png');
  assert.equal(row.answer_4_image_url, '/dvsa-media/AB2117a.gif.png');
  assert.equal(row.correct_answer, 2);
  assert.ok(revisions.every((r) => r.review_status === 'unreviewed'));
  assert.equal(warnings.length, 0);
});

run('dry-run report keeps source NOT_VERIFIED stance', () => {
  const resolve = () => null;
  const { row, revisions, warnings } = stagingQuestionToDraftRow(sample, resolve);
  const report = buildDryRunReport(
    {
      questions: [sample],
      source_verification: {
        status: 'NOT_VERIFIED',
        reason: 'reconstructed',
      },
    },
    [row],
    warnings,
    revisions.length
  );
  assert.equal(report.mode, 'dry-run');
  assert.equal(report.would_write_status, 'draft');
  assert.equal(
    (report.source_verification as { status: string }).status,
    'NOT_VERIFIED'
  );
  assert.ok(report.execute_blocked_until.length > 3);
  // Count mismatch vs 758 expected → not ok (single sample)
  assert.equal(report.ok, false);
});

console.log('dvsaV2Import tests passed');
