/**
 * Keyword Cards: dedup, links, publication, saves, RLS text, and Practice dialog.
 * Does not apply migrations or write to Supabase.
 */

import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { loadBundledRecommendations } from '../learning-cards/recommendations';
import { DVSA_V2_EXPECTED_COUNT } from '../questions/dvsaV2';
import { keywordDialogCopy } from './dialog';
import { KeywordCardsNotMigratedError } from './errors';
import { isOfficialQuestionId } from './questionId';
import { createLocalKeywordCardsRepository } from './localRepository';
import type { KeywordCardsRepository } from './repository';
import { keywordImageBytesMatch, keywordImageUploadError } from './imageFile';
import { approvedAliasesForTerm } from './approvedAliases';
import { segmentKeywordText } from './highlightTerms';
import { readLocalKeywordImage, resolveLocalKeywordImage, saveLocalKeywordImage } from './localMedia';
import { KeywordCardsStoreCorruptError, readKeywordCards } from './localStore';
import type { KeywordDraft, KeywordDraftFile } from './draftTypes';
import { loadOfficialQuestionIds } from './importDrafts';
import { clampKeywordIndex, keywordImageIsReferencedByAnother, normalizeKeywordTerm, showsKeywordImage } from './rules';
import { createSupabaseKeywordCardsRepository, type KeywordDb } from './supabaseStore';

const root = path.join(__dirname, '..', '..');
const storeFile = path.join(mkdtempSync(path.join(tmpdir(), 'keyword-cards-')), 'store.json');
process.env.LOCAL_KEYWORD_CARDS_STORE = storeFile;

function resetLocal() {
  if (existsSync(storeFile)) unlinkSync(storeFile);
}

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

type Row = Record<string, unknown>;

function createMemoryDb(opts?: { missing?: boolean }): KeywordDb {
  const missing = opts?.missing === true;
  const tables: Record<string, Row[]> = {
    keywords: [],
    keyword_question_links: [],
    keyword_saves: [],
  };
  const missingErr = {
    code: 'PGRST205',
    message: 'Could not find the table public.keywords in the schema cache',
  };

  function execute(table: string, state: {
    op: string;
    filters: Array<{ col: string; val: unknown }>;
    inFilter: { col: string; vals: unknown[] } | null;
    row: Row | null;
    patch: Row | null;
    single: boolean;
    maybeSingle: boolean;
  }) {
    if (missing) return { data: null, error: missingErr };
    const list = tables[table] || (tables[table] = []);
    const match = (row: Row) => {
      if (state.inFilter && !state.inFilter.vals.includes(row[state.inFilter.col])) return false;
      return state.filters.every((filter) => row[filter.col] === filter.val);
    };
    if (state.op === 'insert') {
      const rec = { ...(state.row || {}) };
      if (!rec.id) rec.id = randomUUID();
      if (!rec.created_at) rec.created_at = new Date().toISOString();
      if (table === 'keywords' && list.some((row) => row.term_normalized === rec.term_normalized)) {
        return {
          data: null,
          error: {
            code: '23505',
            message: 'duplicate key value violates unique constraint "keywords_term_normalized_key"',
          },
        };
      }
      if (
        table === 'keyword_saves' &&
        list.some((row) => row.user_id === rec.user_id && row.keyword_id === rec.keyword_id)
      ) {
        return {
          data: null,
          error: {
            code: '23505',
            message: 'duplicate key value violates unique constraint "keyword_saves_user_keyword_uidx"',
          },
        };
      }
      list.push(rec);
      return { data: state.single ? rec : [rec], error: null };
    }
    if (state.op === 'update') {
      const updated: Row[] = [];
      for (const row of list) {
        if (!match(row)) continue;
        Object.assign(row, state.patch || {});
        updated.push(row);
      }
      if (state.single || state.maybeSingle) {
        return { data: updated[0] || null, error: updated.length === 1 ? null : { message: 'not found' } };
      }
      return { data: updated, error: null };
    }
    if (state.op === 'delete') {
      tables[table] = list.filter((row) => !match(row));
      return { data: null, error: null };
    }
    const rows = list.filter(match);
    if (state.single || state.maybeSingle) {
      return {
        data: rows[0] || null,
        error: state.single && rows.length !== 1 ? { code: 'PGRST116', message: 'not found' } : null,
      };
    }
    return { data: rows, error: null };
  }

  return {
    from(table: string) {
      const state = {
        op: 'select',
        filters: [] as Array<{ col: string; val: unknown }>,
        inFilter: null as { col: string; vals: unknown[] } | null,
        row: null as Row | null,
        patch: null as Row | null,
        single: false,
        maybeSingle: false,
      };
      const api = {
        select() {
          return api;
        },
        insert(row: unknown) {
          state.op = 'insert';
          state.row = { ...(row as Row) };
          return api;
        },
        update(patch: unknown) {
          state.op = 'update';
          state.patch = { ...(patch as Row) };
          return api;
        },
        delete() {
          state.op = 'delete';
          return api;
        },
        eq(col: string, val: unknown) {
          state.filters.push({ col, val });
          return api;
        },
        in(col: string, vals: unknown[]) {
          state.inFilter = { col, vals };
          return api;
        },
        order() {
          return api;
        },
        maybeSingle() {
          state.maybeSingle = true;
          return Promise.resolve(execute(table, state));
        },
        single() {
          state.single = true;
          return Promise.resolve(execute(table, state));
        },
        then(resolve: (value: { data: unknown; error: { message?: string; code?: string } | null }) => unknown, reject?: (reason: unknown) => unknown) {
          return Promise.resolve(execute(table, state)).then(resolve, reject);
        },
      };
      return api;
    },
  } as KeywordDb;
}

async function exercise(repo: KeywordCardsRepository) {
  await assert.rejects(
    () =>
      repo.create(
        {
          term_en: 'Clip',
          explanation_en: 'Moving pictures are not part of a keyword card.',
          image_url: 'https://cdn.example/clip.mp4',
        },
        'admin-1'
      ),
    /do not support video/
  );

  const carriageway = await repo.create(
    {
      term_en: '  Dual   Carriageway ',
      explanation_en: 'A road with a central barrier between the two directions.',
    },
    'admin-1'
  );
  assert.equal(carriageway.status, 'draft');
  assert.equal(carriageway.term_normalized, 'dual carriageway');
  assert.equal(carriageway.image_url, null);
  assert.equal(showsKeywordImage(carriageway), false);
  await assert.rejects(
    () => repo.create({ term_en: 'dual carriageway', explanation_en: 'Same term again.' }, 'admin-1'),
    /already exists/
  );
  await assert.rejects(() => repo.setStatus(carriageway.id, 'published', 'admin-1'), /Cannot move/);

  await repo.setStatus(carriageway.id, 'submitted', 'admin-1');
  const approved = await repo.setStatus(carriageway.id, 'approved', 'admin-1');
  assert.equal(approved.status, 'approved');
  const published = await repo.setStatus(approved.id, 'published', 'admin-1');
  assert.equal(published.status, 'published');
  assert.equal(published.published_at == null, false);

  const shoulder = await repo.create(
    {
      term_en: 'Hard shoulder',
      explanation_en: 'The strip at the edge of a motorway for emergencies.',
      image_url: 'https://cdn.example/shoulder.png',
      image_alt: 'Hard shoulder',
    },
    'admin-1'
  );
  await repo.setStatus(shoulder.id, 'submitted', 'admin-1');
  await repo.setStatus(shoulder.id, 'approved', 'admin-1');
  const shoulderLive = await repo.setStatus(shoulder.id, 'published', 'admin-1');
  assert.equal(showsKeywordImage(shoulderLive), true);

  const found = await repo.list({ q: 'shoulder' });
  assert.equal(found.keywords.length, 1);
  assert.equal(found.keywords[0].id, shoulder.id);

  const first = await repo.link(carriageway.id, 'AB2001', 'admin-1');
  const again = await repo.link(carriageway.id, 'AB2001', 'admin-1');
  assert.equal(first.question_id, again.question_id);
  await repo.link(carriageway.id, 'AB2002', 'admin-1');
  await repo.link(shoulder.id, 'AB2001', 'admin-1');
  const carriageLinks = (await repo.list()).links.filter((link) => link.keyword_id === carriageway.id);
  assert.equal(carriageLinks.length, 2);

  const onFirst = await repo.listPublishedForQuestion('AB2001');
  assert.equal(onFirst.length, 2);
  assert.ok(onFirst.every((card) => !('video_url' in card)));
  const onSecond = await repo.listPublishedForQuestion('AB2002');
  assert.equal(onSecond.length, 1);
  assert.equal(onSecond[0].term_en, 'Dual Carriageway');
  assert.equal(onSecond[0].image_url, null);

  const draft = await repo.create(
    { term_en: 'Box junction', explanation_en: 'Yellow criss-cross markings.' },
    'admin-1'
  );
  await repo.link(draft.id, 'AB2002', 'admin-1');
  const drafts = await repo.list({ status: 'draft' });
  assert.ok(drafts.keywords.every((row) => row.status === 'draft'));
  assert.equal((await repo.listPublishedForQuestion('AB2002')).length, 1);

  const savedOnce = await repo.addSave('user-a', carriageway.id);
  const savedTwice = await repo.addSave('user-a', carriageway.id);
  assert.equal(savedOnce.id, savedTwice.id);
  await repo.addSave('user-b', shoulder.id);
  assert.deepEqual(
    (await repo.listSaved('user-a')).map((card) => card.id),
    [carriageway.id]
  );
  assert.deepEqual(
    (await repo.listSaved('user-b')).map((card) => card.id),
    [shoulder.id]
  );
  await assert.rejects(() => repo.addSave('user-a', draft.id), /Only published/);

  assert.equal((await repo.toggleSave('user-a', carriageway.id)).saved, false);
  assert.equal((await repo.listSaved('user-a')).length, 0);
  assert.equal((await repo.toggleSave('user-a', carriageway.id)).saved, true);

  await repo.setStatus(carriageway.id, 'approved', 'admin-1');
  assert.equal(
    (await repo.listPublishedForQuestion('AB2001')).some((card) => card.id === carriageway.id),
    false
  );
  assert.equal((await repo.listSaved('user-a')).some((card) => card.id === carriageway.id), false);

  const countBeforeDelete = (await repo.list()).keywords.length;
  await assert.rejects(() => repo.remove(shoulder.id), /Unpublish/);
  assert.equal((await repo.list()).keywords.length, countBeforeDelete);
  assert.equal((await repo.listPublishedForQuestion('AB2001')).some((card) => card.id === shoulder.id), true);
  await repo.setStatus(shoulder.id, 'approved', 'admin-1');
  await repo.remove(shoulder.id);
  assert.equal((await repo.listPublishedForQuestion('AB2001')).some((card) => card.id === shoulder.id), false);
  assert.equal((await repo.listSaved('user-b')).length, 0);
  assert.equal((await repo.list()).links.some((link) => link.keyword_id === shoulder.id), false);
}

async function main() {
  await run('Normalized terms collapse case and whitespace', () => {
    assert.equal(normalizeKeywordTerm('  Dual   Carriageway '), 'dual carriageway');
    assert.equal(isOfficialQuestionId('ab2243'), true);
    assert.equal(isOfficialQuestionId('not-an-id'), false);
    assert.equal(clampKeywordIndex(3, 9), 2);
    assert.equal(clampKeywordIndex(0, 1), 0);
  });

  await run('Official ids must exist, and a shared image file is not deleted', () => {
    const known = loadOfficialQuestionIds();
    assert.equal(known.has('AB2243'), true);
    assert.equal(known.has('ZZ99999'), false);
    assert.equal(isOfficialQuestionId('ZZ99999'), true);
    const keywords = [
      { id: 'a', image_url: 'https://cdn.example/shared.png', image_storage_path: 'keyword-cards/a/1.png' },
      { id: 'b', image_url: 'https://cdn.example/shared.png', image_storage_path: null },
    ];
    assert.equal(
      keywordImageIsReferencedByAnother(keywords, 'a', {
        image_url: 'https://cdn.example/shared.png',
        image_storage_path: 'keyword-cards/a/1.png',
      }),
      true
    );
    assert.equal(
      keywordImageIsReferencedByAnother(
        [{ id: 'a', image_url: 'https://cdn.example/only.png', image_storage_path: 'keyword-cards/a/1.png' }],
        'a',
        { image_url: 'https://cdn.example/only.png', image_storage_path: 'keyword-cards/a/1.png' }
      ),
      false
    );
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0x00]);
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    assert.equal(keywordImageBytesMatch('image/jpeg', jpeg), true);
    assert.equal(keywordImageBytesMatch('image/png', jpeg), false);
    assert.equal(
      keywordImageUploadError({ type: 'image/jpg', name: 'sign.jpg', size: jpeg.length, bytes: jpeg }).kind,
      'image/jpeg'
    );
    assert.equal(
      keywordImageUploadError({ type: 'image/png', name: 'clip.png', size: jpeg.length, bytes: jpeg }).error,
      'File content is not a JPG, PNG, or WebP image'
    );
    assert.equal(
      keywordImageUploadError({ type: 'video/mp4', name: 'clip.mp4', size: png.length, bytes: png }).error,
      'Keyword cards do not support video'
    );
    assert.equal(
      keywordImageUploadError({ type: 'image/gif', name: 'sign.gif', size: png.length, bytes: png }).error,
      'Only JPG, PNG, or WebP allowed'
    );
  });

  await run('Local store dedups terms, gates publication, and keeps one save per user', async () => {
    resetLocal();
    await exercise(createLocalKeywordCardsRepository());
  });

  await run('Supabase repository applies the same publication and ownership rules', async () => {
    await exercise(createSupabaseKeywordCardsRepository(createMemoryDb()));
  });

  await run('Missing Keyword Cards tables stay admin-only errors and empty for learners', async () => {
    const admin = createSupabaseKeywordCardsRepository(createMemoryDb({ missing: true }));
    const learner = createSupabaseKeywordCardsRepository(createMemoryDb({ missing: true }), {
      learnerEmptyOnMissing: true,
    });
    await assert.rejects(() => admin.list(), (error: unknown) => error instanceof KeywordCardsNotMigratedError);
    assert.deepEqual(await learner.listPublishedForQuestion('AB2001'), []);
    assert.deepEqual(await learner.listSaved('user-a'), []);
  });

  await run('Migration 0011 is additive, unpublished by default, and does not touch saved_cards', () => {
    const sql = readFileSync(path.join(root, 'supabase/migrations/0011_keyword_cards.sql'), 'utf8');
    const previous = readFileSync(path.join(root, 'supabase/migrations/0009_learning_cards.sql'), 'utf8');
    assert.ok(sql.includes('DO NOT APPLY'));
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.keywords'));
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.keyword_question_links'));
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.keyword_saves'));
    assert.ok(sql.includes('keywords_term_normalized_key'));
    assert.ok(sql.includes('PRIMARY KEY (keyword_id, question_id)'));
    assert.ok(sql.includes('REFERENCES public.questions(id)'));
    assert.ok(sql.includes('REFERENCES public.profiles(id)'));
    assert.ok(sql.includes("DEFAULT 'draft'"));
    assert.ok(sql.includes('keywords_select_published'));
    assert.ok(sql.includes("USING (status = 'published')"));
    assert.ok(sql.includes('keywords_no_client_insert'));
    assert.ok(sql.includes('keywords_no_client_update'));
    assert.ok(sql.includes('keywords_no_client_delete'));
    assert.ok(sql.includes('keyword_question_links_select_if_published'));
    assert.ok(sql.includes('keyword_question_links_no_client_write'));
    assert.ok(sql.includes('keyword_saves_select_own'));
    assert.ok(sql.includes('keyword_saves_insert_own_published'));
    assert.ok(sql.includes('keyword_saves_delete_own'));
    assert.ok(sql.includes('keyword_saves_no_client_update'));
    assert.ok(sql.includes('user_id = auth.uid()'));
    assert.ok(!sql.includes('video_url'));
    assert.ok(!sql.toLowerCase().includes('video'));
    assert.ok(!sql.includes('ALTER TABLE public.saved_cards'));
    assert.ok(!sql.includes('DROP CONSTRAINT saved_cards_one_target'));
    assert.ok(!sql.includes('UPDATE public.questions'));
    assert.ok(!sql.includes('DROP TABLE'));
    assert.ok(previous.includes('saved_cards_one_target'));
    assert.ok(previous.includes('saved_cards_user_explanation_uidx'));
    assert.ok(previous.includes('keyword_card_id'));
  });

  await run('Admin routes require an admin and learner saves use the session user', () => {
    const files = [
      'app/api/admin/keyword-cards/route.ts',
      'app/api/admin/keyword-cards/[id]/route.ts',
      'app/api/admin/keyword-cards/[id]/status/route.ts',
      'app/api/admin/keyword-cards/[id]/links/route.ts',
      'app/api/admin/keyword-cards/[id]/media/route.ts',
      'app/api/admin/keyword-cards/media-library/route.ts',
    ];
    for (const file of files) {
      const source = readFileSync(path.join(root, file), 'utf8');
      assert.ok(source.includes('requireAdminApi'), file);
      assert.ok(source.includes('{ status: 401 }'), file);
    }
    const createRoute = readFileSync(path.join(root, 'app/api/admin/keyword-cards/route.ts'), 'utf8');
    assert.ok(createRoute.includes('published: false'));
    const saved = readFileSync(path.join(root, 'app/api/keyword-cards/saved/route.ts'), 'utf8');
    assert.ok(saved.includes('getCurrentUser'));
    assert.ok(saved.includes('user.id'));
    assert.ok(!saved.includes('body.user_id'));
    const forQuestion = readFileSync(path.join(root, 'app/api/keyword-cards/for-question/route.ts'), 'utf8');
    assert.ok(!forQuestion.includes('correct_answer'));
    assert.ok(!forQuestion.includes("from('questions')"));
    const links = readFileSync(path.join(root, 'app/api/admin/keyword-cards/[id]/links/route.ts'), 'utf8');
    assert.ok(links.includes('isOfficialQuestionId'));
    assert.ok(!links.includes('question_en'));
    assert.ok(!links.includes('correct_answer'));
    const questionLookup = readFileSync(path.join(root, 'lib/keyword-cards/officialQuestion.ts'), 'utf8');
    assert.ok(questionLookup.includes(".select('id')"));
    assert.ok(!questionLookup.includes('question_en'));
    const media = readFileSync(path.join(root, 'app/api/admin/keyword-cards/[id]/media/route.ts'), 'utf8');
    assert.ok(media.includes('Keyword cards do not support video'));
    assert.ok(!media.includes('video/mp4'));
    assert.ok(!media.includes("from('questions')"));
    assert.ok(media.includes("startsWith('keyword-cards/')"));
    const library = readFileSync(path.join(root, 'app/api/admin/keyword-cards/media-library/route.ts'), 'utf8');
    assert.ok(library.includes('answer_1_image_url'));
    assert.ok(!library.includes('question_en'));
    assert.ok(!library.includes('correct_answer'));
    assert.ok(!library.includes('.update('));
  });

  await run('Practice popup is accessible, bilingual, and image-optional', () => {
    const dialog = readFileSync(path.join(root, 'components/PracticeKeywordDialog.tsx'), 'utf8');
    const control = readFileSync(path.join(root, 'components/PracticeKeywordControl.tsx'), 'utf8');
    const css = readFileSync(path.join(root, 'app/globals.css'), 'utf8');
    const en = keywordDialogCopy('en');
    const ar = keywordDialogCopy('ar');
    assert.equal(en.dir, 'ltr');
    assert.equal(en.lang, 'en');
    assert.equal(en.triggerLabel, 'Keywords');
    assert.equal(en.gotItLabel, 'Got it');
    assert.equal(ar.dir, 'rtl');
    assert.equal(ar.lang, 'ar');
    assert.equal(ar.gotItLabel, 'فهمت');
    assert.equal(ar.closeLabel, 'إغلاق');
    assert.ok(dialog.includes('role="dialog"'));
    assert.ok(dialog.includes('aria-modal="true"'));
    assert.ok(dialog.includes('aria-labelledby={titleId}'));
    assert.ok(dialog.includes('aria-describedby={descriptionId}'));
    assert.ok(dialog.includes('tabIndex={-1}'));
    assert.ok(dialog.includes('dir={copy.dir}'));
    assert.ok(dialog.includes('lang={copy.lang}'));
    assert.ok(dialog.includes('dir="ltr"'));
    assert.ok(dialog.includes('lang="en"'));
    assert.ok(dialog.includes('dir="rtl"'));
    assert.ok(dialog.includes('lang="ar"'));
    assert.ok(dialog.includes('copy.closeLabel'));
    assert.ok(dialog.includes('copy.gotItLabel'));
    assert.ok(dialog.includes('lt-hint-dialog-overlay'));
    assert.ok(dialog.includes('lt-hint-dialog-panel'));
    assert.ok(dialog.includes('lt-hint-dialog-scroll'));
    assert.ok(dialog.includes('lt-hint-dialog-footer'));
    assert.ok(dialog.includes("event.key === 'Escape'"));
    assert.ok(dialog.includes('nextDialogFocusIndex'));
    assert.ok(dialog.includes('lockPageScroll'));
    assert.ok(dialog.includes('previouslyFocused'));
    assert.ok(dialog.includes("setAttribute('aria-hidden', 'true')"));
    assert.ok(dialog.includes('node.inert = true'));
    assert.ok(dialog.includes('restore?.focus({ preventScroll: true })'));
    assert.ok(dialog.includes('object-contain'));
    assert.ok(dialog.includes('showsKeywordImage'));
    assert.ok(!dialog.includes('<video'));
    assert.ok(!dialog.includes('correct_answer'));
    assert.ok(!dialog.includes('useState(true)'));
    const backdropStart = dialog.indexOf('data-keyword-backdrop');
    const dialogRole = dialog.indexOf('role="dialog"');
    assert.ok(backdropStart > 0 && dialogRole > backdropStart);
    const backdrop = dialog.slice(backdropStart, dialogRole);
    assert.ok(!backdrop.includes('onClick'));
    assert.ok(control.includes('useState(false)'));
    assert.equal((control.match(/setOpen\(true\)/g) || []).length, 1);
    assert.ok(control.slice(control.indexOf('setOpen(true)') - 40, control.indexOf('setOpen(true)')).includes('onClick'));
    assert.ok(control.includes('if (!keywords.length) return null'));
    assert.ok(css.includes('--font-arabic'));
    assert.ok(css.includes('align-items: flex-end'));
    assert.ok(css.includes('align-items: center'));
    assert.ok(css.includes('@media (min-width: 640px)'));
  });

  await run('Mock Test stays free of keyword cards and explanation counts are unchanged', () => {
    const mock = readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');
    const practice = readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
    const saved = readFileSync(path.join(root, 'app/saved-cards/page.tsx'), 'utf8');
    const hintMedia = readFileSync(
      path.join(root, 'app/api/admin/learning-cards/explanations/media/route.ts'),
      'utf8'
    );
    const hintsPage = readFileSync(path.join(root, 'app/admin/learning-cards/page.tsx'), 'utf8');
    assert.ok(!mock.includes('PracticeKeywordControl'));
    assert.ok(!mock.includes('PracticeKeywordDialog'));
    assert.ok(!mock.includes('practice-keyword-dialog'));
    assert.ok(!mock.includes('/api/keyword-cards'));
    assert.ok(mock.includes('no hints, vocab cards, or tappable keywords'));
    assert.ok(practice.includes('<PracticeKeywordControl'));
    assert.ok(practice.includes('<PracticeExplanationHint'));
    assert.ok(!practice.includes('PracticeKeywordDialog'));
    assert.ok(saved.includes('Keyword Card'));
    assert.ok(saved.includes('Explanation Card'));
    assert.ok(saved.includes("'All'"));
    assert.ok(saved.includes("'Keywords'"));
    assert.ok(saved.includes("'Explanations'"));
    assert.ok(saved.includes('explanation_card_id'));
    assert.ok(saved.includes('keyword_id'));
    assert.ok(saved.includes('href="/practice"'));
    assert.ok(saved.includes('object-contain'));
    assert.ok(hintMedia.includes('video/mp4'));
    assert.ok(hintsPage.includes('Explanation hints'));
    assert.ok(!hintsPage.includes('keyword extraction'));
    const recs = loadBundledRecommendations();
    const needs = recs.filter((row) => row.recommended_classification === 'needs_explanation');
    const review = recs.filter((row) => row.recommended_classification === 'review_later');
    const imageEnough = recs.filter((row) => row.recommended_classification === 'image_is_enough');
    assert.equal(recs.length, DVSA_V2_EXPECTED_COUNT);
    assert.equal(needs.length, 490);
    assert.equal(review.length, 57);
    assert.equal(imageEnough.length, 211);
  });

  await run('Published keyword survives reload, keeps its links, and import cannot replace it', async () => {
    resetLocal();
    const repo = createLocalKeywordCardsRepository();
    const created = await repo.create(
      {
        term_en: 'Hard shoulder',
        explanation_en: 'The strip at the edge of a motorway for emergencies.',
        translation_ar: 'الكتف',
        explanation_ar: 'مكان للتوقف الاضطراري.',
        image_url: 'https://cdn.example/shoulder.png',
        image_alt: 'Hard shoulder',
      },
      'admin-1'
    );
    const companion = await repo.create(
      { term_en: 'Give way', explanation_en: 'Let other road users go first.' },
      'admin-1'
    );
    await repo.link(created.id, 'AB2232', 'admin-1');
    await repo.link(created.id, 'AB2236', 'admin-1');
    await repo.link(companion.id, 'AB2243', 'admin-1');
    const before = (await repo.list()).keywords.length;
    await repo.setStatus(created.id, 'submitted', 'admin-1');
    await repo.setStatus(created.id, 'approved', 'admin-1');
    const published = await repo.setStatus(created.id, 'published', 'admin-1');
    assert.equal(published.status, 'published');
    assert.equal((await repo.list()).keywords.length, before);
    assert.equal((await repo.list({ status: '' })).keywords.length, before);
    assert.equal((await repo.list()).keywords.some((row) => row.id === companion.id), true);

    const reloaded = createLocalKeywordCardsRepository();
    const again = (await reloaded.list()).keywords.find((row) => row.id === created.id);
    assert.equal(again?.status, 'published');
    assert.equal(again?.explanation_en, 'The strip at the edge of a motorway for emergencies.');
    assert.equal(again?.image_url, 'https://cdn.example/shoulder.png');
    assert.deepEqual(
      (await reloaded.list()).links
        .filter((link) => link.keyword_id === created.id)
        .map((link) => link.question_id)
        .sort(),
      ['AB2232', 'AB2236']
    );

    await reloaded.update(
      created.id,
      {
        term_en: 'Hard shoulder',
        explanation_en: 'Edited definition that must survive refresh.',
        translation_ar: 'كتف الطريق',
        explanation_ar: 'شرح معدّل.',
        image_url: 'https://cdn.example/shoulder-2.png',
        image_alt: 'Shoulder diagram',
        notes: again?.notes,
      },
      'admin-1'
    );
    const edited = (await createLocalKeywordCardsRepository().list()).keywords.find((row) => row.id === created.id);
    assert.equal(edited?.status, 'published');
    assert.equal(edited?.explanation_en, 'Edited definition that must survive refresh.');
    assert.equal(edited?.translation_ar, 'كتف الطريق');
    assert.equal(edited?.explanation_ar, 'شرح معدّل.');
    assert.equal(edited?.image_url, 'https://cdn.example/shoulder-2.png');
    assert.equal(edited?.image_alt, 'Shoulder diagram');

    const visible = await createLocalKeywordCardsRepository().listPublishedForQuestion('AB2232');
    assert.equal(visible.length, 1);
    assert.equal(visible[0].id, created.id);
    const highlight = {
      id: visible[0].id,
      term_en: visible[0].term_en,
      aliases: approvedAliasesForTerm(visible[0].term_en),
      status: 'published' as const,
      explanation_en: visible[0].explanation_en,
    };
    const stem = segmentKeywordText('You may use the hard shoulder.', [highlight]);
    assert.deepEqual(
      stem.filter((part) => part.keywordId).map((part) => part.text),
      ['hard shoulder']
    );
    assert.equal(stem.map((part) => part.text).join(''), 'You may use the hard shoulder.');
    const practice = readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
    const options = readFileSync(path.join(root, 'components/AnswerOptionContent.tsx'), 'utf8');
    assert.equal((practice.match(/prompt=\{currentQuestion\.promptEn\}/g) || []).length, 1);
    assert.equal(options.includes('segmentKeywordText'), false);
    assert.ok(options.includes('PracticeKeywordText'));
    assert.ok(options.includes('keywordQuestionId'));

    assert.equal((await reloaded.addSave('learner-1', created.id)).keyword_id, created.id);
    assert.equal((await reloaded.toggleSave('learner-1', created.id)).saved, false);
    assert.equal((await reloaded.listSaved('learner-1')).length, 0);
    assert.equal((await reloaded.toggleSave('learner-1', created.id)).saved, true);
    assert.equal((await createLocalKeywordCardsRepository().listSaved('learner-1'))[0].explanation_en, edited?.explanation_en);

    const official = loadOfficialQuestionIds();
    assert.equal(official.has('AB2232') && official.has('AB2236') && official.has('AB2243'), true);
    const draftKeyword: KeywordDraft = {
      draft_id: 'kw_hard-shoulder',
      term_en: 'Hard shoulder',
      term_normalized: 'hard shoulder',
      explanation_en: 'Replacement text that must not overwrite the published card.',
      example_en: '',
      translation_ar: '',
      explanation_ar: '',
      image_url: null,
      image_alt: null,
      image_storage_path: null,
      image_recommended: false,
      image_concept: null,
      priority: 'high',
      status: 'draft',
      published: false,
      label_origin: 'source_term',
      grounding: 'source',
      review_flag: false,
      review_note: null,
      review_concern: null,
      previous_explanation_en: null,
      watch_coverage: false,
      notes: null,
      aliases: ['hard shoulder'],
      matched_forms: ['hard shoulder'],
      question_ids: ['AB2232', 'AB2243'],
      links: ['AB2232', 'AB2243'].map((question_id) => ({
        question_id,
        grounding: 'source' as const,
        evidence: [],
      })),
    };
    const draftFile: KeywordDraftFile = {
      schema: 'lingotheory.keyword_card_drafts.v1',
      migration_reference: '0011_keyword_cards.sql',
      status: 'draft',
      published: false,
      review_required: true,
      arabic_pending: true,
      do_not_publish: true,
      do_not_write_database: true,
      source: 'test',
      question_count: official.size,
      keyword_count: 1,
      link_count: 2,
      generated_by: 'tools/generate-keyword-card-drafts.ts',
      import_note: 'test',
      keywords: [draftKeyword],
    };
    const imported = await reloaded.importDrafts(draftFile, official, 'admin-1');
    assert.equal(imported.published, false);
    assert.equal(imported.skipped_protected, 1);
    assert.equal(imported.updated, 0);
    const protectedCard = (await createLocalKeywordCardsRepository().list()).keywords.find(
      (row) => row.id === created.id
    );
    assert.equal(protectedCard?.status, 'published');
    assert.equal(protectedCard?.explanation_en, 'Edited definition that must survive refresh.');
    assert.equal(protectedCard?.image_url, 'https://cdn.example/shoulder-2.png');
    assert.equal((await reloaded.list()).keywords.length, before);
    assert.equal(
      (await reloaded.list()).links.some(
        (link) => link.keyword_id === created.id && link.question_id === 'AB2243'
      ),
      false
    );
    assert.equal(
      (await reloaded.list()).links.filter((link) => link.keyword_id === created.id).length,
      2
    );

    await assert.rejects(() => reloaded.remove(created.id), /Unpublish/);
    assert.equal((await readKeywordCards()).keywords.length, before);
    const manager = readFileSync(path.join(root, 'components/admin/KeywordCardsManager.tsx'), 'utf8');
    assert.ok(manager.includes('Unpublish it before deleting.'));
    assert.ok(manager.includes('<option value="">All statuses</option>'));
    assert.ok(manager.includes('data.backend'));
  });

  await run('A damaged store is not replaced by an empty catalog', async () => {
    writeFileSync(storeFile, '{', 'utf8');
    const repo = createLocalKeywordCardsRepository();
    await assert.rejects(() => repo.list(), KeywordCardsStoreCorruptError);
    await assert.rejects(
      () => repo.create({ term_en: 'Box junction', explanation_en: 'Must not replace the file.' }, 'admin-1'),
      KeywordCardsStoreCorruptError
    );
    assert.equal(readFileSync(storeFile, 'utf8'), '{');
    resetLocal();
  });

  await run('A local image file survives a new repository read', async () => {
    resetLocal();
    const repo = createLocalKeywordCardsRepository();
    const card = await repo.create(
      { term_en: 'Box junction', explanation_en: 'Yellow criss-cross markings.' },
      'admin-1'
    );
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const saved = saveLocalKeywordImage(card.id, png, 'png');
    await repo.setImage(
      card.id,
      { image_url: saved.image_url, image_alt: 'Box junction', image_storage_path: saved.image_storage_path },
      'admin-1'
    );
    const fresh = (await createLocalKeywordCardsRepository().list()).keywords.find((row) => row.id === card.id);
    assert.equal(fresh?.image_url, saved.image_url);
    assert.equal(fresh?.image_storage_path, saved.image_storage_path);
    const bytes = readLocalKeywordImage(card.id, saved.fileName);
    assert.equal(bytes?.contentType, 'image/png');
    assert.equal(bytes?.bytes[0], 0x89);
    assert.equal(resolveLocalKeywordImage(card.id, '../store.json'), null);
    assert.equal(resolveLocalKeywordImage('not-an-id', saved.fileName), null);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
