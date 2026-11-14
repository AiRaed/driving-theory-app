import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  canAdvanceCardStatus,
  isLearnerVisibleCardStatus,
  mockExamAllowsLearningAids,
  normalizeTermKey,
} from './types';

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

run('term_key is lowercased trimmed English', () => {
  assert.equal(normalizeTermKey('  Dual  Carriageway '), 'dual carriageway');
});

run('Only published cards are learner-visible', () => {
  assert.equal(isLearnerVisibleCardStatus('published'), true);
  assert.equal(isLearnerVisibleCardStatus('draft'), false);
  assert.equal(isLearnerVisibleCardStatus('submitted'), false);
  assert.equal(isLearnerVisibleCardStatus('approved'), false);
  assert.equal(isLearnerVisibleCardStatus('archived'), false);
});

run('Mock exam never allows learning aids', () => {
  assert.equal(mockExamAllowsLearningAids(), false);
});

run('Card workflow advances draft → submitted → approved → published', () => {
  assert.equal(canAdvanceCardStatus('draft', 'submitted'), true);
  assert.equal(canAdvanceCardStatus('submitted', 'approved'), true);
  assert.equal(canAdvanceCardStatus('approved', 'published'), true);
  assert.equal(canAdvanceCardStatus('draft', 'published'), false);
});

run('Migration 0009 is marked do-not-apply and does not touch payments', () => {
  const sql = readFileSync(
    path.join(root, 'supabase/migrations/0009_learning_cards.sql'),
    'utf8'
  );
  assert.ok(sql.includes('DO NOT APPLY'));
  assert.ok(sql.includes('keyword_cards'));
  assert.ok(sql.includes('explanation_cards'));
  assert.ok(sql.includes('explanation_card_recommendations'));
  assert.ok(sql.includes('saved_cards'));
  assert.ok(sql.includes("CHECK (format IN ('text', 'diagram', 'image', 'video'))"));
  assert.ok(sql.includes('dvsa_approved = false'));
  assert.ok(sql.includes("UNIQUE (term_key, language)"));
  assert.ok(sql.includes("UNIQUE (question_id, language)"));
  assert.ok(!sql.includes('DROP TABLE public.questions'));
  assert.ok(!sql.includes('UPDATE public.questions'));
  assert.ok(!sql.includes('profiles.access_level'));
  assert.ok(!sql.includes('ALTER TABLE public.payments'));
});

run('render.yaml keeps production maintenance off', () => {
  const yaml = readFileSync(path.join(root, 'render.yaml'), 'utf8');
  assert.match(
    yaml,
    /- key: CONTENT_MAINTENANCE_MODE\s+value: "false"/
  );
});

run('Mock Test does not mount VocabHintsControl or learning-card UI', () => {
  const mock = readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');
  assert.ok(!mock.includes('VocabHintsControl'));
  assert.ok(!mock.includes('KeywordInline'));
  assert.ok(!mock.includes('PracticeLearningAids'));
  assert.ok(!mock.includes('SaveCardButton'));
  assert.ok(!mock.includes('@/lib/learning-cards'));
  assert.ok(mock.includes('no hints, vocab cards, or tappable keywords'));
});

run('Practice hosts VocabHintsControl and Phase 5B learning aids', () => {
  const practice = readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
  assert.ok(practice.includes('VocabHintsControl'));
  assert.ok(practice.includes('PracticeLearningAids'));
  assert.ok(practice.includes('handleNext'));
  assert.ok(practice.includes('handleTopicSelect'));
});

run('Learner mapping omits official explanation_en (Practice must not leak DVSA expl as a hint)', () => {
  const types = readFileSync(path.join(root, 'lib/questions/types.ts'), 'utf8');
  const fn = types.slice(types.indexOf('export function rowToLearnerQuestion'));
  const body = fn.slice(0, fn.indexOf('export function rowToUrduBucket'));
  assert.ok(body.includes('promptEn: row.question_en'));
  assert.ok(!body.includes('explanation_en'));
});

run('Admin PATCH uses first-publish gate (already-published V2 remains editable)', () => {
  const patch = readFileSync(
    path.join(root, 'app/api/admin/questions/[id]/route.ts'),
    'utf8'
  );
  assert.ok(patch.includes('isV2FirstPublishBlocked'));
});
