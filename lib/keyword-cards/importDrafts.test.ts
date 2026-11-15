/**
 * Draft import stays unpublished, idempotent, and admin-gated.
 * Uses a temporary local store. Does not apply migrations or write to Supabase.
 */

import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { KeywordCardsNotMigratedError } from './errors';
import type { KeywordDraft, KeywordDraftFile } from './draftTypes';
import {
  assertKeywordDraftImportConfirmation,
  executeKeywordDraftImport,
  KEYWORD_DRAFT_IMPORT_CONFIRM,
  KeywordDraftImportRejectedError,
  loadOfficialQuestionIds,
  loadReviewedKeywordDraft,
  previewKeywordDraftImport,
  type KeywordImportWriter,
} from './importDrafts';
import { createLocalKeywordCardsRepository } from './localRepository';
import { createSupabaseKeywordCardsRepository, type KeywordDb } from './supabaseStore';

const root = path.join(__dirname, '..', '..');
process.env.LOCAL_KEYWORD_CARDS_STORE = path.join(
  mkdtempSync(path.join(tmpdir(), 'keyword-import-')),
  'store.json'
);
process.env.LEARNING_CARDS_USE_SUPABASE = 'false';
process.env.NODE_ENV = 'test';

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

function draftFile(keywords: KeywordDraft[]): KeywordDraftFile {
  return {
    schema: 'lingotheory.keyword_card_drafts.v1',
    migration_reference: '0011_keyword_cards.sql',
    status: 'draft',
    published: false,
    review_required: true,
    arabic_pending: true,
    do_not_publish: true,
    do_not_write_database: true,
    source: 'test',
    question_count: 758,
    keyword_count: keywords.length,
    link_count: keywords.reduce((sum, keyword) => sum + keyword.links.length, 0),
    generated_by: 'tools/generate-keyword-card-drafts.ts',
    import_note: 'test',
    keywords,
  };
}

function keyword(term: string, questionIds: string[], explanation = `${term} is a reviewed draft explanation.`): KeywordDraft {
  return {
    draft_id: `kw_${term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    term_en: term,
    term_normalized: term.toLowerCase(),
    explanation_en: explanation,
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
    aliases: [term.toLowerCase()],
    matched_forms: [term.toLowerCase()],
    question_ids: questionIds,
    links: questionIds.map((question_id) => ({
      question_id,
      grounding: 'source' as const,
      evidence: [],
    })),
  };
}

const officialIds = new Set(['AB2001', 'AB2243', 'BB1252']);

function recordingWriter(failOnLink?: number): { writer: KeywordImportWriter; created: string[]; removed: string[] } {
  const created: string[] = [];
  const removed: string[] = [];
  let links = 0;
  const writer: KeywordImportWriter = {
    async createDraft() {
      const id = `new-${created.length + 1}`;
      created.push(id);
      return { id, status: 'draft' };
    },
    async updateDraftContent(id) {
      return { id, status: 'draft' };
    },
    async link() {
      links += 1;
      if (failOnLink && links === failOnLink) throw new Error('question missing');
    },
    async removeCreated(id) {
      removed.push(id);
    },
  };
  return { writer, created, removed };
}

async function main() {
  await run('Reviewed draft file previews every card and every review flag', () => {
    const draft = loadReviewedKeywordDraft(root);
    const ids = loadOfficialQuestionIds(root);
    const preview = previewKeywordDraftImport(draft, ids);
    assert.equal(preview.ok, true);
    assert.equal(preview.errors.length, 0);
    assert.equal(preview.keyword_count, draft.keywords.length);
    assert.equal(preview.link_count, draft.link_count);
    assert.equal(preview.keyword_count, 290);
    assert.equal(preview.link_count, 1729);
    assert.equal(preview.would_create, 290);
    assert.equal(preview.would_link, 1729);
    assert.equal(preview.published, false);
    assert.equal(preview.writes, false);
    assert.deepEqual(
      preview.review_flags.map((flag) => `${flag.term_en}:${flag.review_concern}`),
      [
        'Blind spot:mapping',
        'Double white lines:mapping',
        'National speed limit:explanation',
        'Overtake on the left:explanation',
        'Police stop signal:terminology',
        'Roadworks studs:terminology',
        'School zigzag lines:mapping',
        'Shock:terminology',
        'Stop at the scene of the incident:explanation',
        'Yellow bar markings:terminology',
      ]
    );
    assert.equal(
      preview.review_flags.every((flag) => flag.question_ids.length > 0 && flag.review_note),
      true
    );
  });

  await run('Malformed files, unknown ids, duplicates and published rows are rejected before any write', async () => {
    const malformed = previewKeywordDraftImport({ keywords: 'no' }, officialIds);
    assert.equal(malformed.ok, false);
    assert.ok(malformed.errors.some((error) => /malformed/i.test(error)));

    const unknown = draftFile([keyword('Box junction', ['ZZ9999'])]);
    const unknownPreview = previewKeywordDraftImport(unknown, officialIds);
    assert.equal(unknownPreview.ok, false);
    assert.ok(unknownPreview.errors.some((error) => error.includes('ZZ9999')));

    const duplicated = draftFile([
      keyword('Box junction', ['AB2001']),
      keyword('Box junction', ['AB2243']),
    ]);
    assert.ok(previewKeywordDraftImport(duplicated, officialIds).errors.some((error) => /duplicate canonical/i.test(error)));

    const duplicateLink = keyword('Give way', ['AB2001', 'AB2001']);
    assert.ok(
      previewKeywordDraftImport(draftFile([duplicateLink]), officialIds).errors.some((error) =>
        /duplicate link/i.test(error)
      )
    );

    const published = draftFile([keyword('SORN', ['AB2001'])]);
    (published.keywords[0] as { status: string; published: boolean }).status = 'published';
    (published.keywords[0] as { published: boolean }).published = true;
    const publishedPreview = previewKeywordDraftImport(published, officialIds);
    assert.equal(publishedPreview.ok, false);
    const { writer, created } = recordingWriter();
    await assert.rejects(
      () =>
        executeKeywordDraftImport({
          draft: published,
          officialQuestionIds: officialIds,
          existing: { keywords: [], links: [] },
          writer,
        }),
      KeywordDraftImportRejectedError
    );
    assert.equal(created.length, 0);
  });

  await run('Import confirmation is explicit and the admin route does not publish', () => {
    assert.throws(() => assertKeywordDraftImportConfirmation('yes'), KeywordDraftImportRejectedError);
    assert.doesNotThrow(() => assertKeywordDraftImportConfirmation(KEYWORD_DRAFT_IMPORT_CONFIRM));
    const route = readFileSync(path.join(root, 'app/api/admin/keyword-cards/import/route.ts'), 'utf8');
    const ui = readFileSync(path.join(root, 'components/admin/KeywordCardsManager.tsx'), 'utf8');
    assert.ok(route.includes('requireAdminApi'));
    assert.ok(route.includes('assertKeywordDraftImportConfirmation'));
    assert.equal(route.includes('body.keywords'), false);
    assert.equal(route.includes("status: 'published'"), false);
    assert.equal(route.includes('setStatus'), false);
    assert.ok(ui.includes('Preview draft import'));
    assert.equal(/useEffect\(\(\) => \{\s*void previewImport/.test(ui), false);
    assert.equal(route.includes('explanation-hint-drafts'), false);
    const hints = JSON.parse(readFileSync(path.join(root, 'data/explanation-hint-drafts.json'), 'utf8'));
    assert.equal(hints.drafts.length, 547);
    const mock = readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');
    assert.ok(mock.includes('no hints, vocab cards, or tappable keywords'));
    assert.equal(mock.includes('PracticeKeyword'), false);
  });

  await run('A failed new card is removed and earlier cards in the batch remain drafts', async () => {
    const { writer, removed } = recordingWriter(3);
    const result = await executeKeywordDraftImport({
      draft: draftFile([
        keyword('Box junction', ['AB2001']),
        keyword('Give way', ['AB2243', 'BB1252']),
      ]),
      officialQuestionIds: officialIds,
      existing: { keywords: [], links: [] },
      writer,
      batchSize: 20,
    });
    assert.equal(result.created, 1);
    assert.equal(result.failed, 1);
    assert.equal(result.linked, 1);
    assert.deepEqual(removed, ['new-2']);
    assert.equal(result.published, false);
    assert.equal(result.failures[0].term_en, 'Give way');
  });

  await run('Local import is draft-only, idempotent, and protects manual and published cards', async () => {
    const repo = createLocalKeywordCardsRepository();
    const file = draftFile([
      keyword('Box junction', ['AB2001', 'AB2243']),
      keyword('Give way', ['BB1252']),
    ]);
    const first = await repo.importDrafts(file, officialIds, 'admin-1');
    assert.equal(first.created, 2);
    assert.equal(first.linked, 3);
    assert.equal(first.published, false);
    const stored = await repo.list();
    assert.equal(stored.keywords.every((row) => row.status === 'draft' && !row.published_at), true);

    const second = await repo.importDrafts(file, officialIds, 'admin-1');
    assert.equal(second.created, 0);
    assert.equal(second.duplicate, 2);
    assert.equal(second.linked, 0);
    assert.equal(second.failed, 0);
    assert.equal((await repo.list()).keywords.length, 2);

    const revised = draftFile([
      keyword('Box junction', ['AB2001', 'AB2243'], 'A yellow box that you enter only when the exit is clear.'),
      keyword('Give way', ['BB1252']),
    ]);
    const updated = await repo.importDrafts(revised, officialIds, 'admin-1');
    assert.equal(updated.updated, 1);
    assert.equal(updated.duplicate, 1);
    const box = (await repo.list()).keywords.find((row) => row.term_en === 'Box junction');
    assert.equal(box?.status, 'draft');
    assert.ok(box?.explanation_en.includes('yellow box'));

    await repo.update(
      box!.id,
      {
        term_en: box!.term_en,
        explanation_en: 'Manually edited box junction explanation.',
        notes: 'edited by hand',
      },
      'admin-1'
    );
    const afterManual = await repo.importDrafts(file, officialIds, 'admin-1');
    assert.equal(afterManual.skipped_manual >= 1, true);
    const manual = (await repo.list()).keywords.find((row) => row.term_en === 'Box junction');
    assert.equal(manual?.explanation_en, 'Manually edited box junction explanation.');
    assert.equal(manual?.status, 'draft');

    const published = await repo.create(
      { term_en: 'SORN', explanation_en: 'Manual published explanation.' },
      'admin-1'
    );
    await repo.setStatus(published.id, 'submitted', 'admin-1');
    await repo.setStatus(published.id, 'approved', 'admin-1');
    await repo.setStatus(published.id, 'published', 'admin-1');
    await repo.addSave('learner-1', published.id);
    const savedBefore = await repo.listSaved('learner-1');
    assert.equal(savedBefore.length, 1);

    const contraflow = await repo.create(
      {
        term_en: 'Contraflow',
        explanation_en: 'Traffic moving against the usual direction on a temporary lane.',
      },
      'admin-1'
    );
    await repo.link(contraflow.id, 'AB2243', 'admin-1');
    const withPublished = draftFile([
      keyword('SORN', ['AB2001'], 'This replacement must not be written.'),
      keyword('Hard shoulder', ['AB2243']),
    ]);
    const protectedImport = await repo.importDrafts(withPublished, officialIds, 'admin-1');
    assert.equal(protectedImport.skipped_protected, 1);
    assert.equal(protectedImport.created, 1);
    assert.equal(protectedImport.published, false);
    const sorn = (await repo.list()).keywords.find((row) => row.term_en === 'SORN');
    assert.equal(sorn?.status, 'published');
    assert.equal(sorn?.explanation_en, 'Manual published explanation.');
    assert.equal((await repo.listSaved('learner-1')).length, 1);
    assert.equal((await repo.list()).keywords.some((row) => row.status === 'published' && row.term_en !== 'SORN'), false);
    const kept = (await repo.list()).keywords.find((row) => row.id === contraflow.id);
    assert.equal(kept?.term_en, 'Contraflow');
    assert.equal(kept?.explanation_en, 'Traffic moving against the usual direction on a temporary lane.');
    assert.equal(kept?.status, 'draft');
    assert.equal(kept?.translation_ar, '');
    assert.equal(kept?.explanation_ar, '');
    assert.equal(
      (await repo.list()).links.some(
        (link) => link.keyword_id === contraflow.id && link.question_id === 'AB2243'
      ),
      true
    );
  });

  await run('A missing keyword table fails before any insert', async () => {
    let inserts = 0;
    const missing = {
      code: 'PGRST205',
      message: 'Could not find the table public.keywords in the schema cache',
    };
    const query = {
      select() {
        return query;
      },
      insert() {
        inserts += 1;
        return query;
      },
      update() {
        return query;
      },
      delete() {
        return query;
      },
      eq() {
        return query;
      },
      in() {
        return query;
      },
      order() {
        return query;
      },
      maybeSingle: async () => ({ data: null, error: missing }),
      single: async () => ({ data: null, error: missing }),
      then(resolve: (value: { data: null; error: typeof missing }) => void, reject?: (reason: unknown) => void) {
        void reject;
        return Promise.resolve(resolve({ data: null, error: missing }));
      },
    };
    const client = { from: () => query } as unknown as KeywordDb;
    const repo = createSupabaseKeywordCardsRepository(client);
    await assert.rejects(
      () => repo.importDrafts(draftFile([keyword('Box junction', ['AB2001'])]), officialIds, 'admin-1'),
      KeywordCardsNotMigratedError
    );
    assert.equal(inserts, 0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
