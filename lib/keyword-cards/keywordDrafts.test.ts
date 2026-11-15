/**
 * Keyword Card drafts stay local, unpublished, and tied to real question ids.
 * Does not apply migrations or write to Supabase.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { EDITORIAL_PATTERNS, KEYWORD_LEXICON, assertLexicon } from './draftLexicon';
import { buildKeywordDrafts, matchQuestionKeywords, prepareAliases } from './matchKeywordDrafts';
import { validateKeywordDrafts } from './draftValidation';
import type { KeywordDraftFile, OfficialQuestionText } from './draftTypes';

const root = path.join(__dirname, '..', '..');

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

function question(partial: Partial<OfficialQuestionText> & Pick<OfficialQuestionText, 'id'>): OfficialQuestionText {
  return {
    topic: 'test',
    prompt: '',
    correctAnswer: '',
    explanation: '',
    ...partial,
  };
}

function termsFor(text: string): string[] {
  const sample = question({ id: 'AB2001', prompt: text, explanation: text });
  const matches = matchQuestionKeywords(sample, KEYWORD_LEXICON, prepareAliases(KEYWORD_LEXICON), EDITORIAL_PATTERNS);
  return matches.map((match) => KEYWORD_LEXICON[match.termIndex].term_en).sort();
}

run('Lexicon has one canonical term per concept', () => {
  assertLexicon();
  assert.ok(KEYWORD_LEXICON.length >= 120);
  assert.ok(KEYWORD_LEXICON.length <= 300);
  const blind = KEYWORD_LEXICON.find((entry) => entry.term_en === 'Blind spot');
  assert.ok(blind?.aliases.includes('blind spots'));
  assert.equal(
    KEYWORD_LEXICON.filter((entry) => /blind[- ]spot/i.test(entry.term_en)).length,
    2
  );
});

run('Nested phrases do not double-link, but overlapping concepts can', () => {
  assert.deepEqual(termsFor('What is the national speed limit?'), ['National speed limit']);
  assert.deepEqual(termsFor('Switch on your rear fog lights.'), ['Rear fog lights']);
  assert.deepEqual(termsFor('The right-hand lane closed ahead.'), ['Lane closed', 'Right-hand lane']);
  assert.deepEqual(termsFor('Check the blind spots before you move.'), ['Blind spot']);
  assert.deepEqual(termsFor('Check the blind spot before you move.'), ['Blind spot']);
});

run('A shoulder check without the words blind spot is editorial', () => {
  const onlyShoulder = question({
    id: 'AB2001',
    prompt: 'Look over your shoulder for a final check.',
  });
  const withName = question({
    id: 'AB2003',
    prompt: 'Look over your shoulder and check the blind spot.',
  });
  const aliases = prepareAliases(KEYWORD_LEXICON);
  const editorial = matchQuestionKeywords(onlyShoulder, KEYWORD_LEXICON, aliases, EDITORIAL_PATTERNS).find(
    (match) => KEYWORD_LEXICON[match.termIndex].term_en === 'Blind spot'
  );
  const named = matchQuestionKeywords(withName, KEYWORD_LEXICON, aliases, EDITORIAL_PATTERNS).find(
    (match) => KEYWORD_LEXICON[match.termIndex].term_en === 'Blind spot'
  );
  assert.equal(editorial?.link.grounding, 'editorial');
  assert.equal(named?.link.grounding, 'source');
});

run('Ordinary lookalikes are not treated as driving terms', () => {
  assert.deepEqual(termsFor('Take your mobile device to the service.'), []);
  assert.deepEqual(termsFor('This is an opportunity to practise.'), []);
});

run('Short aliases do not attach a keyword to a different concept', () => {
  assert.equal(termsFor('broken down on an automatic railway level crossing').includes('Automatic transmission'), false);
  assert.equal(termsFor('Engines that burn fossil fuels').includes('Burns'), false);
  assert.equal(termsFor('To avoid being unbalanced, a motorcyclist might swerve').includes('Unbalanced wheels'), false);
  assert.equal(termsFor('They give mandatory instructions').includes('Mandatory speed limit'), false);
  assert.equal(termsFor('turn around and rejoin your route').includes('Rejoin'), false);
  assert.ok(termsFor('a car fitted with automatic transmission').includes('Automatic transmission'));
  assert.ok(termsFor('Douse the burns with clean cool water').includes('Burns'));
  assert.ok(termsFor('The wheels are unbalanced').includes('Unbalanced wheels'));
});

run('Generated drafts pass the publication and question-id checks', () => {
  const draft = JSON.parse(
    readFileSync(path.join(root, 'data/keyword-card-drafts.json'), 'utf8')
  ) as KeywordDraftFile;
  const bank = JSON.parse(readFileSync(path.join(root, 'local-data/dvsa/staging/questions.v2.json'), 'utf8'));
  const recommendations = JSON.parse(
    readFileSync(path.join(root, 'data/explanation-recommendations.json'), 'utf8')
  );
  const hints = JSON.parse(readFileSync(path.join(root, 'data/explanation-hint-drafts.json'), 'utf8'));
  const ids = new Set<string>((bank.questions || []).map((question: { id: string }) => question.id));
  const errors = validateKeywordDrafts({
    draft,
    officialQuestionIds: ids,
    classification: recommendations.totals.classification,
    hintDraftCount: hints.drafts.length,
  });
  assert.deepEqual(errors, []);
  assert.equal(draft.published, false);
  assert.equal(draft.keywords.every((keyword) => keyword.status === 'draft' && keyword.published === false), true);
  assert.equal(draft.keywords.filter((keyword) => keyword.review_flag).length, 10);
  assert.deepEqual(
    draft.keywords.filter((keyword) => keyword.review_flag).map((keyword) => keyword.term_en),
    [
      'Blind spot',
      'Double white lines',
      'National speed limit',
      'Overtake on the left',
      'Police stop signal',
      'Roadworks studs',
      'School zigzag lines',
      'Shock',
      'Stop at the scene of the incident',
      'Yellow bar markings',
    ]
  );
  assert.equal(
    draft.keywords.every((keyword) => !keyword.review_flag || keyword.review_concern),
    true
  );
  const byTerm = new Map(draft.keywords.map((keyword) => [keyword.term_en, keyword]));
  assert.deepEqual(byTerm.get('Warning triangle')?.question_ids, ['AB2945', 'BB1252']);
  assert.equal(byTerm.get('Zigzag lines')?.question_ids.includes('AB2596'), false);
  assert.deepEqual(byTerm.get('Double white lines')?.question_ids, ['AB2528']);
  assert.equal(byTerm.get('Hand-held mobile phone')?.question_ids.includes('AB2232'), false);
  assert.equal(byTerm.get('Ice and snow on the vehicle')?.question_ids.includes('BB1435'), false);
  assert.equal(byTerm.get('Queuing traffic')?.question_ids.includes('AB2222'), false);
  assert.equal(byTerm.get('National speed limit')?.explanation_en.includes('50 mph'), false);
  assert.ok(byTerm.get('Overtake on the left')?.explanation_en.includes('queue'));
  assert.ok(byTerm.get('Hard shoulder')?.explanation_en.includes('running lane'));
  assert.ok(byTerm.get('Box junction')?.explanation_en.includes('other vehicles waiting to turn right'));
  assert.deepEqual(byTerm.get('Street lights')?.question_ids, ['AB2249', 'AB2250']);
  assert.equal(byTerm.get('Street lights')?.question_ids.includes('BB1007'), false);
  assert.ok(draft.keywords.length >= 120);
  const audit = JSON.parse(readFileSync(path.join(root, 'data/keyword-card-drafts-audit.json'), 'utf8'));
  assert.ok(audit.sample.length >= 20);
  assert.equal(audit.summary.unique_keywords, draft.keyword_count);
  assert.equal(audit.untouched.needs_explanation, 490);
  assert.equal(audit.untouched.review_later, 57);
  assert.equal(audit.untouched.image_is_enough, 211);
  assert.equal(audit.untouched.hint_drafts, 547);
  const rebuilt = buildKeywordDrafts(
    [
      question({
        id: 'AB2001',
        prompt: 'Give way at the box junction.',
        correctAnswer: 'Wait until the exit is clear',
        explanation: 'A yellow box keeps the junction clear.',
      }),
    ],
    KEYWORD_LEXICON,
    EDITORIAL_PATTERNS
  );
  const names = rebuilt.map((keyword) => keyword.term_en).sort();
  assert.ok(names.includes('Give way'));
  assert.ok(names.includes('Box junction'));
});

run('The generator does not mention a database write', () => {
  const source = readFileSync(path.join(root, 'tools/generate-keyword-card-drafts.ts'), 'utf8');
  assert.equal(source.includes('supabase'), false);
  assert.equal(source.includes('writeFileSync(sourcePath'), false);
  assert.equal(source.includes('explanation-recommendations.json'), true);
});
