/**
 * Two-account Saved Cards isolation.
 * Uses temporary local stores. Does not connect to Supabase or change production data.
 */

import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createLocalKeywordCardsRepository } from '../keyword-cards/localRepository';
import { readKeywordCards } from '../keyword-cards/localStore';
import { createLocalLearningCardsRepository } from '../learning-cards/localRepository';
import { readLocalLearningCards } from '../learning-cards/localStore';
import { savedCardOwner, SavedCardOwnerError } from './ownership';

const root = path.join(__dirname, '../..');
const scratch = mkdtempSync(path.join(tmpdir(), 'saved-cards-'));
process.env.LOCAL_KEYWORD_CARDS_STORE = path.join(scratch, 'keywords.json');
process.env.LOCAL_LEARNING_CARDS_STORE = path.join(scratch, 'learning.json');

const USER_A = '11111111-1111-4111-8111-111111111111';
const USER_B = '22222222-2222-4222-8222-222222222222';

async function main() {
  const keywords = createLocalKeywordCardsRepository();
  const learning = createLocalLearningCardsRepository();

  const keyword = await keywords.create(
    {
      term_en: 'Isolation hard shoulder',
      explanation_en: 'The emergency strip at the edge of a motorway.',
    },
    'admin-1'
  );
  await keywords.setStatus(keyword.id, 'submitted', 'admin-1');
  await keywords.setStatus(keyword.id, 'approved', 'admin-1');
  await keywords.setStatus(keyword.id, 'published', 'admin-1');

  const explanation = await learning.upsertExplanationCard({
    question_id: 'SAVED-ISO-1',
    language: 'en',
    explanation: 'Stop and wait until the crossing is clear.',
    format: 'text',
  });
  await learning.setCardStatus('explanation', explanation.id, 'submitted');
  await learning.setCardStatus('explanation', explanation.id, 'approved');
  await learning.setCardStatus('explanation', explanation.id, 'published');

  await keywords.addSave(USER_A, keyword.id);
  await keywords.addSave(USER_A, keyword.id);
  await keywords.addSave(USER_B, keyword.id);
  const keywordRows = readKeywordCards().saves.filter((row) => row.keyword_id === keyword.id);
  assert.equal(keywordRows.length, 2);
  assert.deepEqual(
    (await keywords.listSaved(USER_A)).map((card) => card.id),
    [keyword.id]
  );
  assert.deepEqual(
    (await keywords.listSaved(USER_B)).map((card) => card.id),
    [keyword.id]
  );

  assert.equal((await keywords.toggleSave(USER_A, keyword.id)).saved, false);
  assert.equal((await keywords.listSaved(USER_A)).length, 0);
  assert.deepEqual(
    (await keywords.listSaved(USER_B)).map((card) => card.id),
    [keyword.id]
  );
  const keywordAfter = readKeywordCards().keywords.find((row) => row.id === keyword.id);
  assert.equal(keywordAfter?.status, 'published');
  assert.equal(
    readKeywordCards().saves.filter((row) => row.user_id === USER_B && row.keyword_id === keyword.id)
      .length,
    1
  );

  await learning.toggleSavedCard({
    user_id: USER_A,
    card_kind: 'explanation',
    explanation_card_id: explanation.id,
  });
  await learning.toggleSavedCard({
    user_id: USER_A,
    card_kind: 'explanation',
    explanation_card_id: explanation.id,
  });
  await learning.toggleSavedCard({
    user_id: USER_A,
    card_kind: 'explanation',
    explanation_card_id: explanation.id,
  });
  await learning.toggleSavedCard({
    user_id: USER_B,
    card_kind: 'explanation',
    explanation_card_id: explanation.id,
  });

  const explanationSaves = readLocalLearningCards().saved_cards.filter(
    (row) => row.explanation_card_id === explanation.id
  );
  assert.equal(explanationSaves.length, 2);
  assert.ok(explanationSaves.every((row) => row.card_kind === 'explanation'));
  assert.deepEqual(
    explanationSaves.map((row) => row.user_id).sort(),
    [USER_A, USER_B]
  );

  const libraryA = await learning.listSavedForUser(USER_A);
  const libraryB = await learning.listSavedForUser(USER_B);
  assert.deepEqual(
    libraryA.explanations.map((card) => card.id),
    [explanation.id]
  );
  assert.equal(libraryA.saved.every((row) => row.user_id === USER_A), true);
  assert.deepEqual(
    libraryB.explanations.map((card) => card.id),
    [explanation.id]
  );
  assert.equal(libraryB.saved.every((row) => row.user_id === USER_B), true);

  assert.equal(
    (
      await learning.toggleSavedCard({
        user_id: USER_A,
        card_kind: 'explanation',
        explanation_card_id: explanation.id,
      })
    ).saved,
    false
  );
  assert.equal((await learning.listSavedForUser(USER_A)).saved.length, 0);
  assert.equal((await learning.listSavedForUser(USER_B)).explanations.length, 1);
  const cardAfter = readLocalLearningCards().explanation_cards.find((row) => row.id === explanation.id);
  assert.equal(cardAfter?.status, 'published');
  assert.equal(cardAfter?.explanation, 'Stop and wait until the crossing is clear.');

  assert.equal(savedCardOwner(USER_A, { keyword_id: keyword.id }), USER_A);
  assert.equal(savedCardOwner(USER_A, { user_id: USER_A }), USER_A);
  assert.throws(() => savedCardOwner(USER_A, { user_id: USER_B }), SavedCardOwnerError);
  assert.throws(() => savedCardOwner('', { user_id: USER_A }), SavedCardOwnerError);

  const learningSql = readFileSync(
    path.join(root, 'supabase/migrations/0009_learning_cards.sql'),
    'utf8'
  );
  const keywordSql = readFileSync(
    path.join(root, 'supabase/migrations/0011_keyword_cards.sql'),
    'utf8'
  );
  assert.ok(learningSql.includes('saved_cards_user_keyword_uidx'));
  assert.ok(learningSql.includes('saved_cards_user_explanation_uidx'));
  assert.ok(learningSql.includes('ALTER TABLE public.saved_cards ENABLE ROW LEVEL SECURITY'));
  assert.ok(learningSql.includes('user_id = auth.uid()'));
  assert.ok(keywordSql.includes('keyword_saves_user_keyword_uidx'));
  assert.ok(keywordSql.includes('ON public.keyword_saves (user_id, keyword_id)'));
  assert.ok(keywordSql.includes('ALTER TABLE public.keyword_saves ENABLE ROW LEVEL SECURITY'));
  assert.ok(keywordSql.includes('user_id = auth.uid()'));

  const learningRoute = readFileSync(
    path.join(root, 'app/api/learning-cards/saved/route.ts'),
    'utf8'
  );
  const keywordRoute = readFileSync(
    path.join(root, 'app/api/keyword-cards/saved/route.ts'),
    'utf8'
  );
  for (const source of [learningRoute, keywordRoute]) {
    assert.ok(source.includes("mode: 'learner'"));
    assert.ok(source.includes('savedCardOwner'));
    assert.ok(source.includes('getCurrentUser'));
    assert.ok(!source.includes('body.user_id'));
    assert.ok(!source.includes('createServiceClient'));
  }
  assert.ok(learningRoute.includes('user_id: user.id'));

  const page = readFileSync(path.join(root, 'app/saved-cards/page.tsx'), 'utf8');
  const session = readFileSync(path.join(root, 'lib/saved-cards/useSessionUserId.ts'), 'utf8');
  assert.ok(page.includes('useSessionUserId'));
  assert.ok(page.includes("cache: 'no-store'"));
  assert.ok(session.includes('onAuthStateChange'));
  assert.ok(!session.includes('auth.getUser'));

  const learningStore = readFileSync(
    path.join(root, 'lib/learning-cards/supabaseStore.ts'),
    'utf8'
  );
  const toggle = learningStore.slice(
    learningStore.indexOf('async toggleSavedCard'),
    learningStore.indexOf('async seedDrafts')
  );
  assert.ok(toggle.includes(".eq('user_id', input.user_id)"));
  assert.ok(!toggle.includes(".from('explanation_cards').delete"));
  assert.ok(!toggle.includes(".from('keyword_cards').delete"));

  console.log('saved-cards ownership: two accounts stay isolated');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
