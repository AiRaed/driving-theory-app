import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { loadBundledRecommendations } from '../learning-cards/recommendations';
import { mockExamAllowsLearningAids } from '../learning-cards/types';
import { productionForbidsLocalJson } from '../learning-cards/backend';
import { contentProductionBackend, productionForbidsLocalContentJson } from './backend';
import { groupRecommendations, loadLocalQuestionHints } from './concepts';
import { familyFromText } from './conceptFamilies';
import type { ExplanationRecommendation } from '../learning-cards/types';
import {
  hintsFromOfficialRows,
  inspectOfficialQuestionRows,
  loadOfficialQuestionHints,
  officialRowToHint,
  type OfficialQuestionsClient,
} from './officialHints';
import {
  COARSE_GROUP_COUNT,
  EXPECTED_REFINED_GROUP_COUNT,
  buildSeedPlan,
  publicSeedPreview,
} from './seedPlan';
import { assertSingleDraftRequest, draftInventedRules, generateGroundedEnglishDraft } from './draft';
import { isMissingContentProductionTable } from './errors';
import { createMemoryProductionStore } from './memoryStore';
import { nextTask } from './queue';
import { assertNoOfficialMutation, LOCKED_OFFICIAL_FIELDS } from './questionContext';
import {
  canAdvanceProductionStatus,
  canUpgradeFormat,
} from './types';

function run(name: string, fn: () => void | Promise<void>) {
  const result = fn();
  if (result && typeof (result as Promise<void>).then === 'function') {
    return (result as Promise<void>).then(
      () => console.log(`PASS ${name}`),
      (error) => {
        console.error(`FAIL ${name}`);
        throw error;
      }
    );
  }
  console.log(`PASS ${name}`);
  return Promise.resolve();
}

const root = path.join(__dirname, '..', '..');

async function main() {
  const recs = loadBundledRecommendations();
  const hints = loadLocalQuestionHints();
  const groups = groupRecommendations(recs, hints);
  const covered = new Set(groups.flatMap((g) => g.question_ids));
  const originalCoarse = groupRecommendations(recs);

  await run('Bundled recommendations remain 758 unique IDs', () => {
    assert.equal(recs.length, 758);
    assert.equal(new Set(recs.map((r) => r.question_id)).size, 758);
  });

  await run('Concept grouping covers every recommendation without dropping IDs', () => {
    assert.equal(covered.size, 758);
    assert.ok(groups.length > 1);
    assert.ok(groups.length < 758, 'reusable concepts should collapse related questions');
    if (Object.keys(hints).length === 758) {
      assert.equal(groups.length, EXPECTED_REFINED_GROUP_COUNT);
    }
    const multi = groups.filter((g) => g.question_ids.length >= 2);
    assert.ok(multi.length > 0);
    assert.equal(originalCoarse.length, 71);
  });

  await run('Synthetic stems split broad topics into reusable concepts', () => {
    function rec(id: string, topic: string, rationale: string): ExplanationRecommendation {
      return {
        question_id: id,
        topic,
        has_image: false,
        has_option_images: false,
        recommended_classification: 'needs_explanation',
        rationale,
        priority: 'high',
        suggested_format: 'text',
        classifier_version: '5b.1',
        dvsa_approved: false,
      };
    }
    const sample = [
      rec('S1', 'safety-margins', 'Stopping distances, gaps, or safety margins benefit from an extra educational diagram beyond the official explanation.'),
      rec('S2', 'safety-margins', 'Stopping distances, gaps, or safety margins benefit from an extra educational diagram beyond the official explanation.'),
      rec('S3', 'safety-margins', 'Stopping distances, gaps, or safety margins benefit from an extra educational diagram beyond the official explanation.'),
      rec('C1', 'vulnerable-road-users', 'Hazard perception or sharing the road with vulnerable users usually needs extra reasoning, not only the official answer.'),
      rec('C2', 'vulnerable-road-users', 'Hazard perception or sharing the road with vulnerable users usually needs extra reasoning, not only the official answer.'),
      rec('H1', 'vulnerable-road-users', 'Hazard perception or sharing the road with vulnerable users usually needs extra reasoning, not only the official answer.'),
      rec('M1', 'motorway-driving', 'Situational driving judgement in this topic is likely to benefit from an extra explanation.'),
      rec('M2', 'motorway-driving', 'Situational driving judgement in this topic is likely to benefit from an extra explanation.'),
      rec('D1', 'documents', 'Mostly factual documents/legal recall. Official question, answer, and explanation are usually sufficient.'),
      rec('D2', 'documents', 'Mostly factual documents/legal recall. Official question, answer, and explanation are usually sufficient.'),
    ];
    const split = groupRecommendations(sample, {
      S1: { promptEn: 'What is the typical overall stopping distance at 30 mph?' },
      S2: { promptEn: 'How can you use the two-second rule?' },
      S3: { promptEn: 'What should you do when driving on an icy road?' },
      C1: { promptEn: 'How much room should you give a cyclist when overtaking?' },
      C2: { promptEn: 'Why should you look for cyclists at junctions?' },
      H1: { promptEn: 'What should you do if you see a horse rider signalling right?' },
      M1: { promptEn: 'When should you use the hard shoulder of a motorway?' },
      M2: { promptEn: 'What colour are the reflective studs between the lanes on a motorway?' },
      D1: { promptEn: 'What does third-party insurance cover?' },
      D2: { promptEn: 'For how long is an MOT certificate normally valid?' },
    });
    const bySlug = Object.fromEntries(split.map((g) => [g.slug, g.question_ids]));
    assert.deepEqual(bySlug['stopping-distances']?.sort(), ['S1', 'S2']);
    assert.deepEqual(bySlug['ice-snow-skid'], ['S3']);
    assert.deepEqual(bySlug['cyclists-space']?.sort(), ['C1', 'C2']);
    assert.deepEqual(bySlug['horses-animals'], ['H1']);
    assert.deepEqual(bySlug['motorway-breakdown'], ['M1']);
    assert.deepEqual(bySlug['motorway-reflective-studs'], ['M2']);
    assert.deepEqual(bySlug['insurance-cover'], ['D1']);
    assert.deepEqual(bySlug['mot-certificate'], ['D2']);
    assert.equal(familyFromText(sample[0], { promptEn: 'stopping distance' }).slug, 'stopping-distances');
    const signs = groupRecommendations(
      [rec('Z1', 'road-signs', 'The official stem plus sign/marking image is usually enough.'), rec('Z2', 'road-signs', 'The official stem plus sign/marking image is usually enough.')],
      {
        Z1: { promptEn: 'What does this sign mean?', correctOptionEn: 'No motor vehicles' },
        Z2: { promptEn: 'What does this sign mean?', correctOptionEn: 'End of 20 mph zone' },
      }
    );
    assert.equal(signs.length, 2);
    assert.notEqual(signs[0].slug, signs[1].slug);
    const stolen = familyFromText(rec('X1', 'incidents', 'leave for human review'), {
      promptEn: 'What could you do to help injured people at an incident?',
      explanationEn: 'Do not give them anything to drink.',
    });
    assert.notEqual(stolen.slug, 'drink-drugs-medicine');
  });

  await run('Full-bank grouping splits the 86-sign blob when official stems are available', () => {
    if (Object.keys(hints).length !== 758) return;
    assert.equal(groups.length, EXPECTED_REFINED_GROUP_COUNT);
    assert.equal(covered.size, 758);
    const max = Math.max(...groups.map((g) => g.question_ids.length));
    const signBlob = groups.find(
      (g) =>
        g.slug === 'sign-identification' ||
        g.slug === 'other-traffic-sign-meaning' ||
        g.concept_key.startsWith('road-signs::sign-identification')
    );
    assert.equal(signBlob, undefined, 'generic sign-identification blob must be split');
    assert.ok(groups.length > 71, `expected finer groups than 71, got ${groups.length}`);
    assert.ok(max <= 16, `largest group is ${max}, still too coarse for one visual`);
    const byId = new Map<string, string>();
    for (const g of groups) {
      for (const id of g.question_ids) byId.set(id, g.slug);
    }
    assert.equal(byId.get('AB2243'), 'motorway-reflective-studs');
    assert.equal(byId.get('AB2747'), 'motorway-breakdown');
    assert.equal(byId.get('AB2576'), 'motorway-reflective-studs');
    assert.equal(byId.get('AB2789'), 'motorway-signals-red-cross');
    assert.equal(byId.get('BB1714'), 'insurance-cover');
    assert.equal(byId.get('AB2436'), 'mot-certificate');
    assert.equal(byId.get('AB2954'), 'cyclists-space');
    assert.equal(byId.get('AB2168'), 'horses-animals');
    assert.equal(byId.get('AB2508'), 'catalytic-converter');
    assert.equal(byId.get('BB1623'), 'vehicle-fire-risk');
    assert.equal(byId.get('BB1048'), 'suspension-shock-absorbers');
    assert.equal(byId.get('AB2503'), 'pelican-puffin-toucan');
    assert.equal(byId.get('AB2393'), 'level-crossing');
    assert.equal(byId.get('AB2940'), 'brake-fluid-level');
    assert.equal(byId.get('BB1347'), 'seat-belts-child-restraints');
    assert.notEqual(byId.get('AB2921'), 'drink-drugs-medicine');
    assert.notEqual(byId.get('AB2299'), byId.get('AB2301'));
    assert.notEqual(byId.get('AB2296'), byId.get('AB2394'));
    const fuelTechnique = groups.find((g) => g.slug === 'fuel-efficient-driving' && g.suggested_format === 'text');
    assert.ok(fuelTechnique, 'fuel-efficient driving should be its own concept');
    assert.ok(!fuelTechnique!.question_ids.includes('AB2508'));
    assert.ok(!fuelTechnique!.question_ids.includes('BB1623'));
  });

  await run('Queue is prioritized by classification, priority, then coverage', () => {
    const store = createMemoryProductionStore();
    store.seedFromRecommendations(recs);
    const tasks = store.listTasks();
    const first = tasks[0];
    assert.equal(first.classification, 'needs_explanation');
    assert.equal(first.priority, 'high');
    assert.ok(first.coverage >= 1);
    const nxt = nextTask(tasks);
    assert.equal(nxt?.id, first.id);
  });

  await run('Filters by topic, format, priority, status, and coverage', () => {
    const store = createMemoryProductionStore();
    store.seedFromRecommendations(recs);
    const safety = store.listTasks({ topic: 'safety-margins' });
    assert.ok(safety.length >= 1);
    assert.ok(safety.every((t) => t.topic === 'safety-margins'));
    const diagrams = store.listTasks({ format: 'diagram' });
    assert.ok(diagrams.every((t) => t.format === 'diagram'));
    const high = store.listTasks({ priority: 'high' });
    assert.ok(high.every((t) => t.priority === 'high'));
    const multi = store.listTasks({ coverage: 'multi' });
    assert.ok(multi.every((t) => t.coverage >= 2));
    store.patchTask(safety[0].id, { status: 'in_progress' });
    const inProgress = store.listTasks({ status: 'in_progress' });
    assert.equal(inProgress.length, 1);
  });

  await run('Manual create, format override, link and unlink questions', () => {
    const store = createMemoryProductionStore();
    const task = store.createManualTask({
      title: 'Manual stopping-distance diagram',
      topic: 'safety-margins',
      format: 'diagram',
      question_ids: ['AB1111'],
    });
    assert.equal(task.source, 'manual');
    assert.equal(task.coverage, 1);
    store.linkQuestions(task.id, ['AB2222', 'AB1111']);
    assert.equal(store.getTask(task.id)?.coverage, 2);
    store.unlinkQuestions(task.id, ['AB1111']);
    const after = store.getTask(task.id)!;
    assert.deepEqual(after.question_ids, ['AB2222']);
    store.patchTask(task.id, { format: 'video' });
    assert.equal(store.getTask(task.id)?.format, 'video');
    store.patchTask(task.id, { explanation_en_draft: 'teaching note' });
    assert.equal(store.getTask(task.id)?.status, 'not_started');
    assert.equal(store.getTask(task.id)?.media_status, 'not_started');
    assert.equal(store.getTask(task.id)?.format, 'video');
  });

  await run('Status workflow and skip; Next Task ignores finished items', () => {
    const store = createMemoryProductionStore();
    const first = store.createManualTask({
      title: 'A',
      topic: 'safety-margins',
      format: 'diagram',
      priority: 'high',
      question_ids: ['AB1'],
    });
    const other = store.createManualTask({
      title: 'B',
      topic: 'alertness',
      format: 'text',
      priority: 'low',
      question_ids: ['AB2'],
    });
    assert.equal(store.next()?.id, first.id);
    store.patchTask(first.id, { status: 'in_progress' });
    store.patchTask(first.id, { status: 'ready_for_review' });
    store.patchTask(first.id, { status: 'approved' });
    store.patchTask(first.id, { status: 'published' });
    assert.equal(store.next()?.id, other.id);
    assert.throws(() => store.patchTask(first.id, { status: 'not_started' }));
    store.patchTask(other.id, { status: 'skipped' });
    assert.equal(store.getTask(other.id)?.status, 'skipped');
    assert.equal(store.next(), null);
  });

  await run('English draft + stale translation detection', () => {
    const store = createMemoryProductionStore();
    const task = store.createManualTask({
      title: 'T',
      topic: 'alertness',
      format: 'text',
      question_ids: ['AB2001'],
    });
    store.patchTask(task.id, { explanation_en_draft: 'First English' });
    store.upsertTranslation({ task_id: task.id, language: 'ar', body: 'arabic' });
    assert.equal(store.listTranslations(task.id)[0].stale, false);
    store.patchTask(task.id, { explanation_en_draft: 'Updated English' });
    const ar = store.listTranslations(task.id)[0];
    assert.equal(ar.stale, true);
    store.upsertTranslation({ task_id: task.id, language: 'ar', body: 'updated arabic' });
    assert.equal(store.listTranslations(task.id)[0].stale, false);
    store.patchTask(task.id, { explanation_en_draft: 'English again' });
    store.upsertTranslation({ task_id: task.id, language: 'ar', review_status: 'approved' });
    const reviewed = store.listTranslations(task.id)[0];
    assert.equal(reviewed.review_status, 'approved');
    assert.equal(reviewed.stale, true);
    assert.equal(store.getTask(task.id)?.status, 'not_started');
  });

  await run('Shared visual plus language-specific voiceover', () => {
    const store = createMemoryProductionStore();
    const task = store.createManualTask({
      title: 'Visual',
      topic: 'road-signs',
      format: 'image',
      question_ids: ['AB3001'],
    });
    const image = store.createAsset({ kind: 'image', title: 'Give way diagram' });
    const voice = store.createAsset({ kind: 'voiceover', title: 'AR VO', language: 'ar' });
    assert.equal(image.shared_visual, true);
    assert.equal(image.language, null);
    assert.equal(voice.shared_visual, false);
    assert.equal(voice.language, 'ar');
    store.attachAsset(task.id, image.id, 'visual');
    store.attachAsset(task.id, voice.id, 'voiceover');
    const attached = store.assetsForTask(task.id);
    assert.equal(attached.length, 2);
    store.patchAsset(image.id, { status: 'in_progress' });
    assert.equal(store.getTask(task.id)?.status, 'not_started');
    assert.equal(store.listAssets().find((a) => a.id === image.id)?.status, 'in_progress');
  });

  await run('Upgrade image task to video without losing text, translations, or links', () => {
    const store = createMemoryProductionStore();
    const task = store.createManualTask({
      title: 'Upgrade me',
      topic: 'hazard-awareness',
      format: 'image',
      question_ids: ['AB4001', 'AB4002'],
    });
    store.patchTask(task.id, { explanation_en_draft: 'Keep this teaching text' });
    store.upsertTranslation({ task_id: task.id, language: 'ur', body: 'اردو' });
    const image = store.createAsset({ kind: 'image', title: 'still' });
    store.attachAsset(task.id, image.id);
    store.patchTask(task.id, { format: 'video' });
    const after = store.getTask(task.id)!;
    assert.equal(after.format, 'video');
    assert.equal(after.explanation_en_draft, 'Keep this teaching text');
    assert.deepEqual(after.question_ids, ['AB4001', 'AB4002']);
    assert.equal(store.listTranslations(task.id)[0].body, 'اردو');
    assert.equal(store.assetsForTask(task.id)[0].id, image.id);
    assert.equal(canUpgradeFormat('image', 'video'), true);
    assert.equal(canUpgradeFormat('video', 'text'), false);
  });

  await run('Grounded draft uses official explanation and refuses invented rules / batches', () => {
    const grounded = generateGroundedEnglishDraft({
      question_id: 'AB1',
      topic: 'safety-margins',
      question_en: 'What is the typical stopping distance at 30 mph?',
      explanation_en: 'Leave enough space to stop. Typical overall stopping distance is 23 metres.',
      correct_answer: 2,
      answers_en: ['6 metres', '23 metres', '53 metres', '73 metres'],
      official_locked: true,
    });
    assert.equal(grounded.ok, true);
    assert.equal(grounded.invented, false);
    assert.match(grounded.draft, /23 metres/);
    assert.match(grounded.draft, /official DVSA explanation/);
    assert.equal(draftInventedRules(grounded.draft), false);
    const empty = generateGroundedEnglishDraft({
      question_id: 'AB2',
      topic: 'x',
      question_en: 'Q',
      explanation_en: '',
      correct_answer: 1,
      answers_en: ['a', 'b', 'c', 'd'],
      official_locked: true,
    });
    assert.equal(empty.ok, false);
    assert.throws(() => assertSingleDraftRequest({ batch: true }));
    assert.throws(() => assertSingleDraftRequest({ question_ids: ['a', 'b'] }));
  });

  await run('Official DVSA fields cannot be mutated from production payloads', () => {
    for (const field of LOCKED_OFFICIAL_FIELDS) {
      assert.throws(() => assertNoOfficialMutation({ [field]: 'nope' }));
    }
    assert.doesNotThrow(() => assertNoOfficialMutation({ explanation_en_draft: 'ok' }));
  });

  await run('Production JSON is forbidden in production; 0010 is additive; 0009 unchanged', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    delete process.env.CONTENT_PRODUCTION_ALLOW_LOCAL;
    assert.equal(contentProductionBackend(), 'supabase');
    assert.equal(productionForbidsLocalContentJson(), true);
    process.env.NODE_ENV = prev || 'test';
    const sql0010 = readFileSync(path.join(root, 'supabase/migrations/0010_content_production.sql'), 'utf8');
    const sql0009 = readFileSync(path.join(root, 'supabase/migrations/0009_learning_cards.sql'), 'utf8');
    assert.match(sql0010, /content_production_tasks/);
    assert.match(sql0010, /DO NOT APPLY/);
    assert.doesNotMatch(sql0010, /ALTER TABLE public\.questions/);
    assert.doesNotMatch(sql0010, /UPDATE public\.questions/);
    assert.doesNotMatch(sql0010, /DROP TABLE/);
    assert.match(sql0009, /explanation_card_recommendations/);
    assert.match(sql0009, /keyword_cards/);
  });

  await run('Practice published-only; Mock Test remains exam-clean', () => {
    const practice = readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
    const mock = readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');
    assert.ok(practice.includes('PracticeLearningAids'));
    assert.ok(!mock.includes('PracticeLearningAids'));
    assert.ok(!mock.includes('content-production'));
    assert.equal(mockExamAllowsLearningAids(), false);
    void productionForbidsLocalJson;
  });

  await run('Admin dashboard route exists and does not auto-publish cards', () => {
    const page = readFileSync(path.join(root, 'app/admin/content-production/page.tsx'), 'utf8');
    const seedApi = readFileSync(
      path.join(root, 'app/api/admin/content-production/tasks/route.ts'),
      'utf8'
    );
    assert.match(page, /Next task/);
    assert.match(page, /Build queue from recommendations/);
    assert.match(page, /Preview queue \(dry-run\)/);
    assert.match(page, /window\.confirm/);
    assert.match(seedApi, /generated_explanations: false/);
    assert.match(seedApi, /published: false/);
    assert.match(seedApi, /action === 'preview'/);
    assert.match(seedApi, /wrote: false/);
    assert.match(seedApi, /mismatched_versions/);
    assert.doesNotMatch(seedApi, /questions\.v2\.json/);
    assert.equal(canAdvanceProductionStatus('not_started', 'in_progress'), true);
    assert.equal(canAdvanceProductionStatus('not_started', 'published'), false);
    assert.equal(isMissingContentProductionTable({ code: 'PGRST205' }), true);
  });

  function rec(id: string, topic = 'safety-margins'): ExplanationRecommendation {
    return {
      question_id: id,
      topic,
      has_image: false,
      has_option_images: false,
      recommended_classification: 'needs_explanation',
      rationale: 'Stopping distances, gaps, or safety margins benefit from an extra educational diagram beyond the official explanation.',
      priority: 'high',
      suggested_format: 'diagram',
      classifier_version: '5b.1',
      dvsa_approved: false,
    };
  }

  function officialRow(id: string, stem: string, meaning = '23 metres', correct = 2): Record<string, unknown> {
    return {
      id,
      question_en: stem,
      explanation_en: `Official: ${meaning}`,
      correct_answer: correct,
      answer_1_en: '6 metres',
      answer_2_en: meaning,
      answer_3_en: '53 metres',
      answer_4_en: '73 metres',
      content_version: 'v2',
    };
  }

  function mockOfficialClient(rows: Array<Record<string, unknown>>): OfficialQuestionsClient {
    return {
      from: (table: string) => {
        assert.equal(table, 'questions');
        return {
          select: (cols: string) => {
            assert.match(cols, /question_en/);
            assert.match(cols, /answer_1_en/);
            assert.match(cols, /correct_answer/);
            const query = {
              eq: () => query,
              in: () => query,
              order: () => query,
              range: async (from: number, to: number) => ({
                data: rows.slice(from, to + 1),
                error: null,
              }),
            };
            return query;
          },
        };
      },
    };
  }

  await run('Production data loading maps official Supabase fields into grouping hints', async () => {
    const rows = [
      officialRow('AB1111', 'What is the typical overall stopping distance at 30 mph?'),
      officialRow('AB2222', 'How can you use the two-second rule?'),
    ];
    const hints = await loadOfficialQuestionHints(mockOfficialClient(rows));
    assert.equal(hints.AB1111.promptEn, 'What is the typical overall stopping distance at 30 mph?');
    assert.equal(hints.AB1111.correctOptionEn, '23 metres');
    assert.equal(hints.AB1111.explanationEn, 'Official: 23 metres');
    const mapped = officialRowToHint(rows[0]);
    assert.equal(mapped.promptEn, rows[0].question_en);
    assert.deepEqual(Object.keys(hintsFromOfficialRows(rows)).sort(), ['AB1111', 'AB2222']);
  });

  await run('Production seed rejects missing or mismatched content_version and never uses V1 rows', () => {
    const v2 = officialRow('AB1111', 'What is the typical overall stopping distance at 30 mph?');
    const v1 = { ...officialRow('AB2222', 'How can you use the two-second rule?'), content_version: 'v1' };
    const missingVersion = { ...officialRow('AB3333', 'When should you use dipped headlights?'), content_version: '' };
    const mapped = hintsFromOfficialRows([v2, v1, missingVersion]);
    assert.deepEqual(Object.keys(mapped), ['AB1111']);
    const recs = [rec('AB1111'), rec('AB2222'), rec('AB3333'), rec('AB4444')];
    const plan = buildSeedPlan({
      recs,
      hints: {},
      officialRows: [v2, v1, missingVersion],
      requireOfficialStems: true,
    });
    assert.equal(plan.ok, false);
    assert.equal(plan.wrote, false);
    assert.equal(plan.would_create, 0);
    assert.deepEqual(plan.mismatched_versions, ['AB2222', 'AB3333']);
    assert.deepEqual(plan.missing_ids, ['AB4444']);
    assert.match(String(plan.error), /content_version=v2/);
    const audit = inspectOfficialQuestionRows(
      ['AB1111', 'AB2222', 'AB4444'],
      [v2, v1]
    );
    assert.deepEqual(Object.keys(audit.hints), ['AB1111']);
    assert.deepEqual(audit.mismatched_versions, ['AB2222']);
    assert.deepEqual(audit.missing_ids, ['AB4444']);
  });

  await run('Incomplete official data fails closed and does not fall back to coarse grouping', () => {
    const recs = [rec('AB1111'), rec('AB2222')];
    const plan = buildSeedPlan({
      recs,
      hints: { AB1111: { promptEn: 'What is the typical overall stopping distance at 30 mph?' } },
      requireOfficialStems: true,
    });
    assert.equal(plan.ok, false);
    assert.equal(plan.wrote, false);
    assert.equal(plan.would_create, 0);
    assert.equal(plan.group_count, 0);
    assert.equal(plan.coarse_grouping, true);
    assert.deepEqual(plan.missing_ids, ['AB2222']);
    assert.equal(plan.create_groups.length, 0);
    const empty = buildSeedPlan({ recs, hints: {}, requireOfficialStems: true });
    assert.equal(empty.ok, false);
    assert.equal(empty.would_create, 0);
    assert.notEqual(empty.group_count, COARSE_GROUP_COUNT);
  });

  await run('Duplicate coverage is skipped when an existing queue used different grouping keys', () => {
    const recs = [
      rec('S1'),
      rec('S2'),
      rec('S3'),
    ];
    const coarse = buildSeedPlan({ recs, hints: {}, requireOfficialStems: false });
    assert.equal(coarse.ok, true);
    const store = createMemoryProductionStore();
    store.seedFromRecommendations(recs, { requireOfficialStems: false });
    assert.equal(store.listTasks().length, coarse.would_create);
    const refinedHints = {
      S1: { promptEn: 'What is the typical overall stopping distance at 30 mph?' },
      S2: { promptEn: 'How can you use the two-second rule?' },
      S3: { promptEn: 'What should you do when driving on an icy road?' },
    };
    const refined = store.previewSeed(recs, { hints: refinedHints, requireOfficialStems: true });
    assert.equal(refined.ok, true);
    assert.ok(refined.group_count > coarse.group_count);
    assert.ok(refined.would_skip_duplicate_coverage >= 1);
    assert.equal(refined.would_create, 0);
    assert.ok(refined.duplicate_coverage.length >= 1);
    const second = store.seedFromRecommendations(recs, {
      hints: refinedHints,
      requireOfficialStems: true,
    });
    assert.equal(second.created, 0);
    assert.equal(store.listTasks().length, coarse.would_create);
  });

  await run('Idempotent seeding skips existing concept_key and writes nothing extra', () => {
    const recs = [rec('S1'), rec('S2')];
    const hints = {
      S1: { promptEn: 'What is the typical overall stopping distance at 30 mph?' },
      S2: { promptEn: 'How can you use the two-second rule?' },
    };
    const store = createMemoryProductionStore();
    const first = store.seedFromRecommendations(recs, { hints, requireOfficialStems: true });
    assert.ok(first.created >= 1);
    const ids = store.listTasks().map((t) => t.id).sort();
    const second = store.seedFromRecommendations(recs, { hints, requireOfficialStems: true });
    assert.equal(second.created, 0);
    assert.ok(second.skipped >= 1);
    assert.deepEqual(store.listTasks().map((t) => t.id).sort(), ids);
    const preview = publicSeedPreview(second.plan);
    assert.equal(preview.wrote, false);
    assert.equal(preview.dry_run, true);
  });

  await run('Full 758-recommendation seed without stems is refused as coarse grouping', () => {
    const refused = buildSeedPlan({ recs, hints: {}, requireOfficialStems: true });
    assert.equal(refused.ok, false);
    assert.equal(refused.wrote, false);
    assert.equal(refused.would_create, 0);
    assert.equal(refused.recommendation_count, 758);
    assert.ok(refused.missing_ids.length > 0);
  });

  await run('Production seed modules do not depend on gitignored staging JSON', () => {
    const storeSrc = readFileSync(path.join(root, 'lib/content-production/store.ts'), 'utf8');
    const supabaseSrc = readFileSync(path.join(root, 'lib/content-production/supabaseStore.ts'), 'utf8');
    const seedPlanSrc = readFileSync(path.join(root, 'lib/content-production/seedPlan.ts'), 'utf8');
    const officialSrc = readFileSync(path.join(root, 'lib/content-production/officialHints.ts'), 'utf8');
    const memorySrc = readFileSync(path.join(root, 'lib/content-production/memoryStore.ts'), 'utf8');
    for (const src of [storeSrc, supabaseSrc, seedPlanSrc, officialSrc, memorySrc]) {
      assert.doesNotMatch(src, /local-data\/dvsa\/staging/);
      assert.doesNotMatch(src, /loadLocalQuestionHints/);
    }
    assert.match(officialSrc, /question_en/);
    assert.match(officialSrc, /answer_1_en/);
    assert.match(officialSrc, /content_version/);
    assert.match(officialSrc, /REQUIRED_CONTENT_VERSION/);
    assert.match(storeSrc, /loadOfficialQuestionRows/);
    assert.match(supabaseSrc, /loadOfficialQuestionRows/);
    assert.equal(EXPECTED_REFINED_GROUP_COUNT, 307);
    assert.equal(COARSE_GROUP_COUNT, 71);
  });

  await run('Dry-run reports group count, coverage, missing IDs and duplicate coverage without writing', () => {
    const recs = [rec('S1'), rec('MISSING')];
    const plan = buildSeedPlan({
      recs,
      hints: { S1: { promptEn: 'What is the typical overall stopping distance at 30 mph?' } },
      existingTasks: [
        {
          id: 't1',
          concept_key: 'old-coarse-key',
          title: 'old',
          topic: 'safety-margins',
          suggested_format: 'diagram',
          format: 'diagram',
          priority: 'high',
          classification: 'needs_explanation',
          rationale: '',
          status: 'not_started',
          explanation_en_draft: '',
          english_revision: 1,
          notes: '',
          source: 'recommendation_group',
          question_ids: ['S1'],
          coverage: 1,
          created_at: '',
          updated_at: '',
          created_by: null,
          media_status: 'not_started',
        },
      ],
      requireOfficialStems: true,
    });
    const preview = publicSeedPreview(plan);
    assert.equal(preview.wrote, false);
    assert.equal(preview.dry_run, true);
    assert.equal(preview.ok, false);
    assert.deepEqual(preview.missing_ids, ['MISSING']);
    assert.equal(preview.would_create, 0);
  });

  const byFormat: Record<string, number> = {};
  const byClass: Record<string, number> = {};
  groups.forEach((g) => {
    byFormat[g.suggested_format] = (byFormat[g.suggested_format] || 0) + 1;
    byClass[g.classification] = (byClass[g.classification] || 0) + 1;
  });
  console.log(
    JSON.stringify(
      {
        recommendation_ids: recs.length,
        original_concept_groups: originalCoarse.length,
        concept_groups: groups.length,
        reusable_groups: groups.filter((g) => g.question_ids.length >= 2).length,
        single_question_groups: groups.filter((g) => g.question_ids.length === 1).length,
        max_coverage: Math.max(...groups.map((g) => g.question_ids.length)),
        largest: groups
          .slice()
          .sort((a, b) => b.question_ids.length - a.question_ids.length)
          .slice(0, 8)
          .map((g) => ({ n: g.question_ids.length, slug: g.slug, title: g.title })),
        by_format: byFormat,
        by_classification: byClass,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
