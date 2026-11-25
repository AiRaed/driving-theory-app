import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  practiceCategoryIds,
  practiceCategoryName,
  practiceCategoryPlacements,
} from './practiceCategory';

const root = process.cwd();

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

run('Practice category names are the title-case labels Practice shows', () => {
  assert.equal(practiceCategoryName('rules-of-the-road'), 'Rules of the Road');
  assert.equal(practiceCategoryName('hazard-awareness'), 'Hazard Awareness');
  assert.equal(practiceCategoryName('vulnerable-road-users'), 'Vulnerable Road Users');
});

run('Category order matches the Practice topic grid', () => {
  const ids = practiceCategoryIds([
    'road-signs',
    'alertness',
    'documents',
    'hazard-awareness',
    'custom-topic',
  ]);
  assert.deepEqual(ids, [
    'alertness',
    'hazard-awareness',
    'documents',
    'road-signs',
    'custom-topic',
  ]);
});

run('Position follows sort_order then question id inside one category', () => {
  const placements = practiceCategoryPlacements([
    { id: 'AB3', topic: 'alertness', sort_order: 2 },
    { id: 'AB1', topic: 'alertness', sort_order: 1 },
    { id: 'AB2', topic: 'alertness', sort_order: 1 },
    { id: 'BB1', topic: 'road-signs', sort_order: 5 },
  ]);
  assert.equal(placements.get('AB1')?.position, 1);
  assert.equal(placements.get('AB2')?.position, 2);
  assert.equal(placements.get('AB3')?.position, 3);
  assert.equal(placements.get('AB1')?.total, 3);
  assert.equal(placements.get('AB1')?.categoryName, 'Alertness');
  assert.equal(placements.get('BB1')?.position, 1);
  assert.equal(placements.get('BB1')?.categoryName, 'Road Signs');
});

run('Position stays empty when a category has no fixed sort order', () => {
  const placements = practiceCategoryPlacements([
    { id: 'AB1', topic: 'alertness', sort_order: 1 },
    { id: 'AB2', topic: 'alertness', sort_order: null },
  ]);
  assert.equal(placements.get('AB1')?.position, null);
  assert.equal(placements.get('AB2')?.position, null);
  assert.equal(placements.get('AB1')?.categoryName, 'Alertness');
});

run('Published staging questions keep their real topics and fixed positions', () => {
  const file = path.join(root, 'local-data/dvsa/staging/questions.v2.json');
  if (!existsSync(file)) return;
  const bundle = JSON.parse(readFileSync(file, 'utf8')) as {
    questions: Array<{ id: string; topic: string }>;
  };
  const questions = bundle.questions.map((question, index) => ({
    id: question.id,
    topic: question.topic,
    sort_order: index + 1,
  }));
  const placements = practiceCategoryPlacements(questions);
  assert.equal(placements.size, questions.length);
  const seen = new Map<string, number[]>();
  for (const question of questions) {
    const place = placements.get(question.id);
    assert.ok(place);
    assert.equal(place.categoryId, question.topic);
    assert.equal(place.categoryName, practiceCategoryName(question.topic));
    assert.equal(typeof place.position, 'number');
    const positions = seen.get(question.topic) || [];
    positions.push(place.position as number);
    seen.set(question.topic, positions);
  }
  for (const positions of Array.from(seen.values())) {
    const sorted = [...positions].sort((a, b) => a - b);
    assert.deepEqual(
      sorted,
      sorted.map((_, index) => index + 1)
    );
  }
  assert.ok(seen.has('alertness'));
  assert.ok(seen.has('rules-of-the-road'));
});

run('Practice and the hint admin page share this category mapping', () => {
  const practice = readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
  const hints = readFileSync(path.join(root, 'app/admin/learning-cards/page.tsx'), 'utf8');
  const editor = readFileSync(
    path.join(root, 'components/admin/ExplanationHintEditor.tsx'),
    'utf8'
  );
  assert.ok(practice.includes('practiceCategoryIds'));
  assert.ok(!practice.includes('const PRACTICE_TOPIC_ORDER'));
  assert.ok(hints.includes('All categories'));
  assert.ok(hints.includes('aria-label="Practice category"'));
  assert.ok(hints.includes('category_name'));
  assert.ok(editor.includes('Practice category'));
  assert.ok(editor.includes('practice_category'));
  const category = editor.indexOf('Practice category');
  const official = editor.lastIndexOf('Official question');
  assert.ok(category > 0 && official > category);
});
