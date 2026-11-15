import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { learningCardsBackend, productionForbidsLocalJson } from './backend';
import { isLearningCardsNotMigratedError, isMissingLearningCardsTable } from './errors';
import { assertImportConfirm } from './guard';
import { planLearningCardsImport } from './importPlan';
import { createLocalLearningCardsRepository } from './localRepository';
import { loadBundledRecommendations } from './recommendations';
import {
  createSupabaseLearningCardsRepository,
  type LearningCardsSupabaseClient,
} from './supabaseStore';
import { canAdvanceCardStatus, mockExamAllowsLearningAids } from './types';
import { isLearnerVisibleExplanationHint } from './hints';
import { DVSA_V2_EXPECTED_COUNT } from '../questions/dvsaV2';
import type { LearningCardsLocalState } from './localStore';

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

type Row = Record<string, unknown>;
type Filter = { type: 'eq' | 'in'; col: string; val: unknown };

function createMemoryClient(opts?: { missingTables?: boolean }): LearningCardsSupabaseClient {
  const missing = opts?.missingTables === true;
  const missingErr = {
    code: 'PGRST205',
    message: 'Could not find the table in the schema cache',
  };
  const tables: Record<string, Row[]> = {
    keyword_terms: [],
    keyword_cards: [],
    keyword_card_questions: [],
    explanation_cards: [],
    explanation_card_recommendations: [],
    saved_cards: [],
  };

  function apply(rows: Row[], filters: Filter[]) {
    return rows.filter((row) =>
      filters.every((f) => {
        if (f.type === 'in') return (f.val as unknown[]).includes(row[f.col]);
        return row[f.col] === f.val;
      })
    );
  }

  function query(table: string, filters: Filter[] = []) {
    const execute = () => {
      if (missing) return { data: null as Row[] | null, error: missingErr };
      return { data: apply(tables[table] || [], filters), error: null };
    };
    const promise = Promise.resolve().then(() => execute());
    return Object.assign(promise, {
      eq(col: string, val: unknown) {
        return query(table, [...filters, { type: 'eq', col, val }]);
      },
      in(col: string, val: string[]) {
        return query(table, [...filters, { type: 'in', col, val }]);
      },
      maybeSingle() {
        return promise.then((res) => {
          if (res.error) return { data: null, error: res.error };
          return { data: (res.data || [])[0] || null, error: null };
        });
      },
    });
  }

  function upsertRows(table: string, incoming: Row, onConflict?: string) {
    if (missing) return { data: null, error: missingErr };
    const keys = (onConflict || 'id').split(',').map((s) => s.trim());
    const list = tables[table] || (tables[table] = []);
    const idx = list.findIndex((row) => keys.every((k) => String(row[k]) === String(incoming[k])));
    if (idx >= 0) {
      const merged = { ...list[idx], ...incoming };
      if (incoming.id == null && list[idx].id != null) merged.id = list[idx].id;
      list[idx] = merged;
      return { data: [merged], error: null };
    }
    const rec = { ...incoming };
    if (
      rec.id == null &&
      (table === 'keyword_cards' || table === 'explanation_cards' || table === 'saved_cards')
    ) {
      rec.id = randomUUID();
    }
    if (!rec.created_at) rec.created_at = new Date().toISOString();
    list.push(rec);
    return { data: [rec], error: null };
  }

  return {
    from(table: string) {
      return {
        select() {
          return query(table);
        },
        insert(row: unknown) {
          const rec = { ...(row as Row) };
          return Promise.resolve(upsertRows(table, rec, 'id'));
        },
        update(patch: unknown) {
          return {
            eq(col: string, val: unknown) {
              if (missing) return Promise.resolve({ data: null, error: missingErr });
              const list = tables[table] || [];
              const updated = [];
              for (const row of list) {
                if (row[col] === val) {
                  Object.assign(row, patch as Row);
                  updated.push(row);
                }
              }
              return Promise.resolve({ data: updated, error: null });
            },
          };
        },
        upsert(row: unknown, opts?: { onConflict?: string }) {
          const done = Promise.resolve(upsertRows(table, { ...(row as Row) }, opts?.onConflict));
          return Object.assign(done, {
            select() {
              return {
                eq: query(table).eq,
                in: query(table).in,
                maybeSingle: () =>
                  done.then((r) => ({
                    data: Array.isArray(r.data) ? r.data[0] : r.data,
                    error: r.error,
                  })),
                then: done.then.bind(done),
              };
            },
          });
        },
        delete() {
          return {
            eq(col: string, val: unknown) {
              const done = (async () => {
                if (missing) return { error: missingErr };
                tables[table] = (tables[table] || []).filter((row) => row[col] !== val);
                return { error: null };
              })();
              return Object.assign(done, {
                eq() {
                  return done;
                },
              });
            },
          };
        },
      };
    },
  } as LearningCardsSupabaseClient;
}

async function main() {
  await run('Default backend is local in non-production', () => {
    assert.equal(process.env.NODE_ENV === 'production', false);
    assert.notEqual(process.env.LEARNING_CARDS_USE_SUPABASE, 'true');
    assert.equal(learningCardsBackend(), 'local');
    assert.equal(productionForbidsLocalJson(), false);
  });

  await run('Production forbids local JSON unless ALLOW_LOCAL', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    delete process.env.LEARNING_CARDS_ALLOW_LOCAL;
    delete process.env.LEARNING_CARDS_USE_SUPABASE;
    try {
      assert.equal(learningCardsBackend(), 'supabase');
      assert.equal(productionForbidsLocalJson(), true);
    } finally {
      process.env.NODE_ENV = prev;
    }
  });

  await run('Migration 0009 is additive-only and RLS-safe', () => {
    const sql = readFileSync(path.join(root, 'supabase/migrations/0009_learning_cards.sql'), 'utf8');
    assert.ok(sql.includes('DO NOT APPLY'));
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.keyword_cards'));
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.explanation_cards'));
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.explanation_card_recommendations'));
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.saved_cards'));
    assert.ok(sql.includes('ENABLE ROW LEVEL SECURITY'));
    assert.ok(sql.includes("USING (status = 'published')"));
    assert.ok(sql.includes('user_id = auth.uid()'));
    assert.ok(sql.includes('saved_cards_insert_own_published'));
    assert.ok(sql.includes('saved_cards_no_client_update'));
    assert.ok(sql.includes('topic text NOT NULL DEFAULT'));
    assert.ok(!sql.includes('DROP TABLE public.questions'));
    assert.ok(!sql.includes('DELETE FROM public.questions'));
    assert.ok(!sql.includes('UPDATE public.questions'));
    assert.ok(!sql.includes('ALTER TABLE public.questions'));
    assert.ok(!sql.includes('ALTER TABLE public.profiles'));
    assert.ok(!sql.includes('ALTER TABLE public.payments'));
    assert.ok(!sql.includes('DROP TABLE public.profiles'));
  });

  await run('Import plan is idempotent, 758 recs, never publishes', () => {
    const recs = loadBundledRecommendations();
    assert.equal(recs.length, DVSA_V2_EXPECTED_COUNT);
    const localState: LearningCardsLocalState = {
      keyword_terms: [{ term_key: 'dual carriageway', term_en: 'dual carriageway' }],
      keyword_cards: [
        {
          id: 'k1',
          term_key: 'dual carriageway',
          language: 'en',
          definition: 'A divided road.',
          translation: 'dual carriageway',
          image_url: null,
          image_alt: null,
          video_url: null,
          status: 'draft',
        },
        {
          id: 'k2',
          term_key: 'dual carriageway',
          language: 'ar',
          definition: 'arabic',
          translation: 'طريق مزدوج',
          image_url: null,
          image_alt: null,
          video_url: null,
          status: 'published',
        },
      ],
      keyword_card_questions: [
        { term_key: 'dual carriageway', question_id: 'AB2950', source_field: 'stem' },
      ],
      explanation_cards: [
        {
          id: 'e1',
          question_id: recs[0].question_id,
          language: 'en',
          explanation: 'draft',
          format: 'text',
          image_url: null,
          image_alt: null,
          video_url: null,
          status: 'draft',
        },
      ],
      saved_cards: [
        {
          id: 's1',
          user_id: 'user-1',
          card_kind: 'keyword',
          keyword_card_id: 'k1',
          explanation_card_id: null,
        },
      ],
      overrides: {
        [recs[0].question_id]: {
          admin_override: 'unnecessary',
          override_note: 'admin mark',
          card_unnecessary: true,
          updated_at: new Date().toISOString(),
        },
      },
    };
    const plan = planLearningCardsImport({ recommendations: recs, localState });
    assert.equal(plan.unique_recommendation_ids, DVSA_V2_EXPECTED_COUNT);
    assert.equal(plan.recommendations.length, DVSA_V2_EXPECTED_COUNT);
    assert.equal(plan.published, false);
    assert.equal(plan.dvsa_approved, false);
    assert.ok(plan.coerced_from_published.includes('keyword:k2'));
    assert.equal(
      plan.keyword_cards.every((c) => c.status !== 'published' && c.published_at === null),
      true
    );
    assert.equal(
      plan.explanation_cards.every((c) => c.status !== 'published'),
      true
    );
    const ov = plan.recommendations.find((r) => r.question_id === recs[0].question_id);
    assert.equal(ov?.admin_override, 'unnecessary');
    assert.equal(ov?.card_unnecessary, true);
    assert.equal(plan.skipped_saved_cards, 1);
    const again = planLearningCardsImport({ recommendations: recs, localState });
    assert.equal(again.recommendations.length, plan.recommendations.length);
    assert.equal(again.keyword_cards[0].id, plan.keyword_cards[0].id);
  });

  await run('Import confirm guard blocks apply without confirm and blocks publish flags', () => {
    assert.doesNotThrow(() => assertImportConfirm(['--dry-run']));
    assert.throws(() => assertImportConfirm(['--apply']), /confirm-shared-supabase/);
    assert.throws(() => assertImportConfirm(['--publish']), /never publish/);
  });

  await run('Workflow still cannot skip to published', () => {
    assert.equal(canAdvanceCardStatus('draft', 'submitted'), true);
    assert.equal(canAdvanceCardStatus('draft', 'published'), false);
    assert.equal(canAdvanceCardStatus('approved', 'published'), true);
  });

  await run('Local repository published-only learner payload', async () => {
    const repo = createLocalLearningCardsRepository();
    const payload = await repo.getPublishedForQuestion('AB2950', 'en');
    assert.equal(payload.dvsa_approved, false);
    assert.equal(
      payload.keywords.every((k) => k.status === 'published'),
      true
    );
    assert.ok(!payload.explanation || payload.explanation.status === 'published');
  });

  await run('Saved cards require a user id (API stamps session user)', () => {
    const saved = readFileSync(
      path.join(root, 'app/api/learning-cards/saved/route.ts'),
      'utf8'
    );
    assert.ok(saved.includes('getCurrentUser'));
    assert.ok(saved.includes('user_id: user.id'));
    assert.ok(!saved.includes('body.user_id'));
  });

  await run('Practice uses published-cards API; Mock still forbids aids', () => {
    const practice = readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
    const mock = readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');
    assert.ok(practice.includes('PracticeLearningAids'));
    assert.ok(!mock.includes('PracticeLearningAids'));
    assert.ok(!mock.includes('SaveCardButton'));
    assert.ok(mock.includes('no hints, vocab cards, or tappable keywords'));
    assert.equal(mockExamAllowsLearningAids(), false);
  });

  await run('Missing-table errors are detected without crashing learners', () => {
    assert.equal(isMissingLearningCardsTable({ code: 'PGRST205', message: 'x' }), true);
    assert.equal(isMissingLearningCardsTable({ code: '42P01', message: 'relation does not exist' }), true);
    assert.equal(isMissingLearningCardsTable({ message: 'ok' }), false);
  });

  await run('Admin APIs no longer hard-block LEARNING_CARDS_USE_SUPABASE', () => {
    const keywords = readFileSync(
      path.join(root, 'app/api/admin/learning-cards/keywords/route.ts'),
      'utf8'
    );
    assert.ok(keywords.includes('getLearningCardsRepository'));
    assert.ok(!keywords.includes('assertLocalLearningCardsOnly'));
    const forQuestion = readFileSync(
      path.join(root, 'app/api/learning-cards/for-question/route.ts'),
      'utf8'
    );
    assert.ok(forQuestion.includes("mode: 'learner'"));
  });

  await run('Production build config does not enable live card writes yet', () => {
    const yaml = readFileSync(path.join(root, 'render.yaml'), 'utf8');
    assert.match(yaml, /CONTENT_MAINTENANCE_MODE\s+value: "false"/);
    assert.match(yaml, /LEARNING_CARDS_USE_SUPABASE\s*\n\s*value: "false"/);
  });

  await run('Learner APIs fail closed when 0009 tables are missing', async () => {
    const repo = createSupabaseLearningCardsRepository(createMemoryClient({ missingTables: true }), {
      learnerEmptyOnMissing: true,
    });
    const payload = await repo.getPublishedForQuestion('AB2950', 'en');
    assert.equal(payload.keywords.length, 0);
    assert.equal(payload.explanation, null);
    assert.equal(payload.dvsa_approved, false);
    const library = await repo.listSavedForUser('user-a');
    assert.equal(library.saved.length, 0);
    const admin = createSupabaseLearningCardsRepository(createMemoryClient({ missingTables: true }));
    await assert.rejects(
      () => admin.listKeywordCatalog(),
      (err: unknown) => isLearningCardsNotMigratedError(err)
    );
  });

  await run('Supabase repo: workflow, EN/AR, published-only Practice, user-scoped saves', async () => {
    const repo = createSupabaseLearningCardsRepository(createMemoryClient());
    await assert.rejects(
      () =>
        repo.upsertKeywordCard({
          term_en: 'give way',
          language: 'en',
          definition: 'Let other traffic go first.',
          translation: 'give way',
          status: 'published',
        }),
      /Cannot create a published card/
    );
    const en = await repo.upsertKeywordCard({
      term_en: 'give way',
      language: 'en',
      definition: 'Let other traffic go first.',
      translation: 'give way',
    });
    assert.equal(en.status, 'draft');
    const ar = await repo.upsertKeywordCard({
      term_en: 'give way',
      language: 'ar',
      definition: 'افسح المجال',
      translation: 'افسح المجال',
    });
    assert.equal(ar.language, 'ar');
    await repo.linkKeywordToQuestion(en.term_key, 'AB1111', 'stem');
    const hidden = await repo.getPublishedForQuestion('AB1111', 'en');
    assert.equal(hidden.keywords.length, 0);

    await assert.rejects(() => repo.setCardStatus('keyword', en.id, 'published'), /Cannot move/);
    await repo.setCardStatus('keyword', en.id, 'submitted');
    await repo.setCardStatus('keyword', en.id, 'approved');
    await repo.setCardStatus('keyword', en.id, 'published');
    const visible = await repo.getPublishedForQuestion('AB1111', 'en');
    assert.equal(visible.keywords.length, 1);
    assert.equal(visible.keywords[0].status, 'published');
    assert.equal(visible.dvsa_approved, false);

    const stillDraftAr = await repo.getPublishedForQuestion('AB1111', 'ar');
    assert.equal(stillDraftAr.keywords.some((k) => k.language === 'ar'), false);
    assert.equal(stillDraftAr.keywords[0].language, 'en');

    const expl = await repo.upsertExplanationCard({
      question_id: 'AB1111',
      language: 'en',
      explanation: 'Give way means other traffic goes first.',
      format: 'text',
    });
    assert.equal(expl.status, 'draft');
    assert.equal((await repo.getPublishedForQuestion('AB1111', 'en')).explanation, null);
    await repo.setCardStatus('explanation', expl.id, 'submitted');
    await repo.setCardStatus('explanation', expl.id, 'approved');
    await repo.setCardStatus('explanation', expl.id, 'published');
    assert.equal(
      (await repo.getPublishedForQuestion('AB1111', 'en')).explanation?.status,
      'published'
    );

    const savedA = await repo.toggleSavedCard({
      user_id: 'user-a',
      card_kind: 'keyword',
      keyword_card_id: en.id,
    });
    assert.equal(savedA.saved, true);
    assert.equal(savedA.row?.user_id, 'user-a');
    const libA = await repo.listSavedForUser('user-a');
    const libB = await repo.listSavedForUser('user-b');
    assert.equal(libA.saved.length, 1);
    assert.equal(libB.saved.length, 0);

    const recId = loadBundledRecommendations()[0].question_id;
    const ov = await repo.saveOverride(recId, {
      admin_override: 'unnecessary',
      card_unnecessary: true,
      override_note: 'admin mark',
    });
    assert.equal(ov?.admin_override, 'unnecessary');
    assert.equal(ov?.card_unnecessary, true);
    assert.equal(ov?.dvsa_approved, false);
    const listed = await repo.listRecommendations();
    assert.equal(listed.totals.unique_ids, DVSA_V2_EXPECTED_COUNT);
  });

  await run('Admin activate publishes a complete hint; empty and removed stay hidden', async () => {
    const repo = createSupabaseLearningCardsRepository(createMemoryClient());
    const empty = await repo.upsertExplanationCard({
      question_id: 'HINT-EMPTY',
      language: 'en',
      explanation: '   ',
      format: 'text',
      activate: true,
    });
    assert.equal(empty.status, 'draft');
    assert.equal(isLearnerVisibleExplanationHint(empty), false);
    assert.equal((await repo.getPublishedForQuestion('HINT-EMPTY', 'en')).explanation, null);

    const active = await repo.upsertExplanationCard({
      question_id: 'HINT-EMPTY',
      language: 'en',
      explanation: 'Leave a two-second gap in the dry.',
      format: 'text',
      activate: true,
    });
    assert.equal(active.status, 'published');
    assert.equal(isLearnerVisibleExplanationHint(active), true);
    assert.equal(
      (await repo.getPublishedForQuestion('HINT-EMPTY', 'en')).explanation?.explanation,
      'Leave a two-second gap in the dry.'
    );

    const copied = await repo.upsertExplanationCard({
      question_id: 'HINT-REUSE',
      language: 'en',
      explanation: active.explanation,
      format: active.format,
      image_url: active.image_url,
      video_url: active.video_url,
      activate: true,
    });
    assert.equal(copied.status, 'published');
    const reusable = await repo.listReusableExplanationHints();
    assert.equal(reusable.some((c) => c.question_id === 'HINT-EMPTY'), true);
    assert.equal(reusable.some((c) => c.question_id === 'HINT-REUSE'), true);

    const removed = await repo.removeExplanationCard('HINT-EMPTY', 'en');
    assert.equal(removed?.status, 'archived');
    assert.equal((await repo.getPublishedForQuestion('HINT-EMPTY', 'en')).explanation, null);
    assert.equal(
      (await repo.getPublishedForQuestion('HINT-REUSE', 'en')).explanation?.status,
      'published'
    );
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
