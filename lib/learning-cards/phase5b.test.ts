import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'path';
import { classifyExplanationNeed } from './classify';
import {
  CLASSIFIER_VERSION,
  LEARNING_CARD_INITIAL_LANGUAGES,
  canAdvanceCardStatus,
  effectiveClassification,
  mockExamAllowsLearningAids,
} from './types';
import { DVSA_V2_EXPECTED_COUNT } from '../questions/dvsaV2';

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const root = path.join(__dirname, '..', '..');
const bundledPath = path.join(root, 'data', 'explanation-recommendations.json');

run('Bundled recommendations cover exactly 758 unique V2 IDs', () => {
  assert.equal(existsSync(bundledPath), true);
  const bundled = JSON.parse(readFileSync(bundledPath, 'utf8'));
  const rows = bundled.recommendations as Array<{
    question_id: string;
    recommended_classification: string;
    priority: string;
    suggested_format: string;
    rationale: string;
    dvsa_approved: boolean;
    promptEn?: string;
    explanation_en?: string;
  }>;
  assert.equal(bundled.unique_ids, DVSA_V2_EXPECTED_COUNT);
  assert.equal(bundled.expected_count, DVSA_V2_EXPECTED_COUNT);
  assert.equal(rows.length, DVSA_V2_EXPECTED_COUNT);
  const ids = new Set(rows.map((r) => r.question_id));
  assert.equal(ids.size, DVSA_V2_EXPECTED_COUNT);
  for (const id of Array.from(ids)) {
    assert.match(id, /^(AB|BB)\d{4}$/);
  }
  assert.equal(bundled.dvsa_approved, false);
  assert.equal(bundled.classifier_version, CLASSIFIER_VERSION);
  assert.equal(
    rows.filter((r) => r.recommended_classification === 'needs_explanation').length,
    bundled.totals.classification.needs_explanation
  );
  assert.equal(
    rows.filter((r) => r.recommended_classification === 'image_is_enough').length,
    bundled.totals.classification.image_is_enough
  );
  assert.equal(
    rows.filter((r) => r.recommended_classification === 'review_later').length,
    bundled.totals.classification.review_later
  );
  const sumClass =
    bundled.totals.classification.needs_explanation +
    bundled.totals.classification.image_is_enough +
    bundled.totals.classification.review_later;
  assert.equal(sumClass, DVSA_V2_EXPECTED_COUNT);
  const sumPri =
    bundled.totals.priority.high + bundled.totals.priority.medium + bundled.totals.priority.low;
  assert.equal(sumPri, DVSA_V2_EXPECTED_COUNT);
  for (const row of rows) {
    assert.equal(row.dvsa_approved, false);
    assert.ok(row.rationale && row.rationale.length > 20);
    assert.equal(row.promptEn, undefined);
    assert.equal(row.explanation_en, undefined);
  }
});

run('Classifier marks sign identification as image_is_enough', () => {
  const rec = classifyExplanationNeed({
    id: 'AB9991',
    topic: 'road-signs',
    promptEn: 'What does this sign mean?',
    options: [{ en: 'Stop', image: '/signs/stop.png' }],
    explanationEn: 'This sign means you must stop.',
    image: '/signs/stop.webp',
  });
  assert.equal(rec.recommended_classification, 'image_is_enough');
  assert.equal(rec.priority, 'low');
  assert.equal(rec.suggested_format, 'image');
  assert.equal(rec.dvsa_approved, false);
});

run('Classifier marks stopping distances as needs_explanation / high / diagram', () => {
  const rec = classifyExplanationNeed({
    id: 'AB9992',
    topic: 'safety-margins',
    promptEn: 'What is the overall stopping distance at 70 mph?',
    options: [{ en: '96 metres' }, { en: '53 metres' }, { en: '73 metres' }, { en: '36 metres' }],
    explanationEn: 'Thinking distance plus braking distance is the overall stopping distance.',
  });
  assert.equal(rec.recommended_classification, 'needs_explanation');
  assert.equal(rec.priority, 'high');
  assert.equal(rec.suggested_format, 'diagram');
});

run('Classifier marks right of way as needs_explanation', () => {
  const rec = classifyExplanationNeed({
    id: 'AB9993',
    topic: 'rules-of-the-road',
    promptEn: 'Who has priority at this unmarked crossroads?',
    options: [{ en: 'The vehicle from the right' }],
    explanationEn: 'Give way to traffic from the right.',
  });
  assert.equal(rec.recommended_classification, 'needs_explanation');
  assert.equal(rec.priority, 'high');
});

run('Classifier marks factual documents as image_is_enough', () => {
  const rec = classifyExplanationNeed({
    id: 'AB9994',
    topic: 'documents',
    promptEn: 'What is a photocard driving licence?',
    options: [{ en: 'A licence with your photo' }],
    explanationEn: 'The photocard is the photocard part of your driving licence.',
  });
  assert.equal(rec.recommended_classification, 'image_is_enough');
  assert.equal(rec.priority, 'low');
});

run('Classifier leaves a mirror-check rule as a hint, and plain colour recall as enough', () => {
  const mirrors = classifyExplanationNeed({
    id: 'AB9995',
    topic: 'alertness',
    promptEn: 'How often should you check your mirrors?',
    options: [{ en: 'Frequently' }],
    explanationEn: 'Check mirrors often so you know what is behind you before you manoeuvre.',
  });
  assert.equal(mirrors.recommended_classification, 'needs_explanation');
  const colour = classifyExplanationNeed({
    id: 'AB9996',
    topic: 'attitude',
    promptEn: 'Which colour follows the green signal at a puffin crossing?',
    options: [{ en: 'Amber' }],
    explanationEn: 'Amber follows green.',
  });
  assert.equal(colour.recommended_classification, 'image_is_enough');
});

run('Admin override can force a card on image_is_enough or mark unnecessary', () => {
  assert.equal(
    effectiveClassification('image_is_enough', 'needs_explanation'),
    'needs_explanation'
  );
  assert.equal(effectiveClassification('needs_explanation', 'unnecessary'), 'unnecessary');
  assert.equal(effectiveClassification('review_later', null, true), 'unnecessary');
  assert.equal(effectiveClassification('needs_explanation', null, false), 'needs_explanation');
});

run('Card workflow cannot skip straight to published', () => {
  assert.equal(canAdvanceCardStatus('draft', 'submitted'), true);
  assert.equal(canAdvanceCardStatus('submitted', 'approved'), true);
  assert.equal(canAdvanceCardStatus('approved', 'published'), true);
  assert.equal(canAdvanceCardStatus('draft', 'published'), false);
  assert.equal(canAdvanceCardStatus('draft', 'approved'), false);
});

run('English and Arabic are the initial card languages', () => {
  assert.deepEqual([...LEARNING_CARD_INITIAL_LANGUAGES], ['en', 'ar']);
});

run('Mock exam still forbids learning aids', () => {
  assert.equal(mockExamAllowsLearningAids(), false);
});

run('Question editor hosts recommendation + keyword panels; official lock remains', () => {
  const editor = readFileSync(
    path.join(root, 'components/admin/QuestionEditor.tsx'),
    'utf8'
  );
  assert.ok(editor.includes('ExplanationRecommendationPanel'));
  assert.ok(editor.includes('KeywordCardEditor'));
  assert.ok(editor.includes('officialLocked'));
  const types = readFileSync(path.join(root, 'lib/questions/types.ts'), 'utf8');
  assert.ok(types.includes('applyOfficialLockToUpdatePayload'));
});

run('Admin learning-cards page filters classification, topic, priority, card status', () => {
  const page = readFileSync(path.join(root, 'app/admin/learning-cards/page.tsx'), 'utf8');
  assert.ok(page.includes('needs_explanation'));
  assert.ok(page.includes('image_is_enough'));
  assert.ok(page.includes('review_later'));
  assert.ok(page.includes('All priorities'));
  assert.ok(page.includes('Any card status'));
  assert.ok(page.includes('Explanation hints'));
  assert.ok(page.includes('Add hint'));
});

run('Seed drafts never auto-publish', () => {
  const seed = readFileSync(path.join(root, 'lib/learning-cards/seedDrafts.ts'), 'utf8');
  assert.ok(seed.includes("status: 'draft'"));
  assert.ok(!seed.includes("status: 'published'"));
  assert.ok(seed.includes('Seed must never publish cards'));
});

run('Import guard still refuses publish and unconfirmed live apply', () => {
  const guard = readFileSync(path.join(root, 'lib/learning-cards/guard.ts'), 'utf8');
  assert.ok(guard.includes('confirm-shared-supabase'));
  assert.ok(guard.includes('never publish'));
});

run('Practice mounts learning aids; Mock Test does not', () => {
  const practice = readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
  const mock = readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');
  assert.ok(practice.includes('PracticeLearningAids'));
  assert.ok(practice.includes('PracticeExplanationHint'));
  assert.ok(!mock.includes('PracticeLearningAids'));
  assert.ok(!mock.includes('KeywordInlineText'));
  assert.ok(!mock.includes('SaveCardButton'));
});

run('Unapplied 0009 adds recommendation table without mutating questions bank', () => {
  const sql = readFileSync(
    path.join(root, 'supabase/migrations/0009_learning_cards.sql'),
    'utf8'
  );
  assert.ok(sql.includes('DO NOT APPLY'));
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.explanation_card_recommendations'));
  assert.ok(sql.includes('admin_override'));
  assert.ok(sql.includes('card_unnecessary'));
  assert.ok(!sql.includes('ALTER TABLE public.questions'));
  assert.ok(!sql.includes('UPDATE public.questions'));
  assert.ok(!sql.includes('ALTER TABLE public.payments'));
});
