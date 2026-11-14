import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import {
  DVSA_V2_EXPECTED_COUNT,
  countImageOptionQuestions,
  isSelectedOptionCorrect,
  normalizeAnswerMarker,
  optionHasContent,
  resolveMediaPresence,
  scoreAnswers,
  stagingToLearnerQuestion,
  transformDvsaRow,
  validateTransformedBank,
  type DvsaRawRow,
  type DvsaStagingQuestion,
} from './dvsaV2';

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

function baseRow(overrides: Partial<DvsaRawRow> = {}): DvsaRawRow {
  return {
    Item: 'AB0001',
    Topic: 'Alertness',
    'Current Answer': 'C',
    Stem: 'Why should you check mirrors?',
    OptionA: 'For fun',
    OptionB: 'To confuse others',
    OptionC: 'To know what is behind you',
    OptionD: 'Never check',
    'Expl text': 'Mirrors help awareness.',
    'Stem.gif': '',
    'A.gif': '',
    'B.gif': '',
    'C.gif': '',
    'D.gif': '',
    'Stem HiRes': '',
    'A HiRes': '',
    'B HiRes': '',
    'C HiRes': '',
    'D HiRes': '',
    ...overrides,
  };
}

run('normalizeAnswerMarker uppercases lowercase b (AB2846)', () => {
  assert.equal(normalizeAnswerMarker('b'), 'B');
  assert.equal(normalizeAnswerMarker('B'), 'B');
  assert.equal(normalizeAnswerMarker('x'), null);
});

run('transform text-option question retains id/topic/text/explanation', () => {
  const result = transformDvsaRow(baseRow());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.question.id, 'AB0001');
  assert.equal(result.question.topic, 'alertness');
  assert.equal(result.question.promptEn, 'Why should you check mirrors?');
  assert.equal(result.question.explanationEn, 'Mirrors help awareness.');
  assert.equal(result.question.options.length, 4);
  assert.equal(result.question.options[2].correct, true);
  assert.equal(result.question.correctAnswer, 3);
  assert.equal(result.question.options[0].en, 'For fun');
});

run('transform image-option question keeps empty text + image refs', () => {
  const result = transformDvsaRow(
    baseRow({
      Item: 'BB1591',
      Topic: 'Road and traffic signs',
      'Current Answer': 'A',
      Stem: 'What does this sign mean?',
      OptionA: '',
      OptionB: '',
      OptionC: '',
      OptionD: '',
      'A.gif': 'BB1591a.gif',
      'B.gif': 'BB1591b.gif',
      'C.gif': 'BB1591c.gif',
      'D.gif': 'BB1591d.gif',
      'A HiRes': 'BB1591a.jpg',
      'B HiRes': 'BB1591b.jpg',
      'C HiRes': 'BB1591c.jpg',
      'D HiRes': 'BB1591d.jpg',
      'Expl text': 'Sign meaning explanation.',
    })
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.question.topic, 'road-signs');
  assert.ok(result.question.options.every((o) => o.en === '' && !!o.image));
  assert.equal(result.question.options[0].image, 'BB1591a.gif');
  assert.equal(result.question.options[0].correct, true);
  assert.ok(optionHasContent(result.question.options[0]));
});

run('AB2846-style lowercase answer normalized in transform only', () => {
  const result = transformDvsaRow(
    baseRow({
      Item: 'AB2846',
      'Current Answer': 'b',
      OptionB: 'Correct choice',
    })
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.question.source.answerMarkerRaw, 'b');
  assert.equal(result.question.source.answerMarkerNormalized, 'B');
  assert.equal(result.question.options[1].correct, true);
  assert.equal(result.question.correctAnswer, 2);
});

run('scoring uses option.correct for text and image options equally', () => {
  const textQ = {
    options: [
      { correct: false },
      { correct: true },
      { correct: false },
      { correct: false },
    ],
  };
  const imageQ = {
    options: [
      { correct: true },
      { correct: false },
      { correct: false },
      { correct: false },
    ],
  };
  assert.equal(isSelectedOptionCorrect(textQ.options, 1), true);
  assert.equal(isSelectedOptionCorrect(textQ.options, 0), false);
  assert.equal(isSelectedOptionCorrect(imageQ.options, 0), true);
  const scored = scoreAnswers([textQ, imageQ], [1, 2]);
  assert.equal(scored.correct, 1);
  assert.equal(scored.total, 2);
  assert.equal(scored.percent, 50);
});

run('missing images reported unresolved; no guessing', () => {
  const filenames = ['stem.gif', 'A.gif', 'present.gif'];
  const { resolved, unresolved } = resolveMediaPresence(filenames, (f) => f === 'present.gif');
  assert.deepEqual(resolved, ['present.gif']);
  assert.deepEqual(unresolved, ['stem.gif', 'A.gif']);
});

run('stagingToLearnerQuestion maps image paths for learner UI', () => {
  const staging: DvsaStagingQuestion = {
    id: 'BB1591',
    topic: 'road-signs',
    promptEn: 'What does this sign mean?',
    promptAr: '',
    options: [
      { en: '', ar: '', correct: true, image: 'BB1591a.gif' },
      { en: '', ar: '', correct: false, image: 'BB1591b.gif' },
      { en: '', ar: '', correct: false, image: 'BB1591c.gif' },
      { en: '', ar: '', correct: false, image: 'BB1591d.gif' },
    ],
    keywords: [],
    explanationEn: 'Explanation',
    correctAnswer: 1,
    source: {
      dvsaTopic: 'Road and traffic signs',
      answerMarkerRaw: 'A',
      answerMarkerNormalized: 'A',
    },
  };
  const learner = stagingToLearnerQuestion(staging);
  assert.equal(learner.options[0].image, '/dvsa-media/BB1591a.gif');
  assert.equal(learner.options[0].correct, true);
  assert.equal(learner.options[0].en, '');
});

run('validateTransformedBank completeness for synthetic 758 bank', () => {
  const questions: DvsaStagingQuestion[] = [];
  const topics = [
    'alertness',
    'attitude',
    'documents',
    'hazard-awareness',
    'incidents',
    'motorway-driving',
    'other-vehicles',
    'road-signs',
    'rules-of-the-road',
    'safety-margins',
    'safety-vehicle',
    'vehicle-handling',
    'vehicle-loading',
    'vulnerable-road-users',
  ];

  for (let i = 0; i < DVSA_V2_EXPECTED_COUNT; i++) {
    const topic = topics[i % topics.length];
    const isImage = i < 27;
    const correctAnswer = (i % 4) + 1;
    questions.push({
      id: `T${String(i + 1).padStart(4, '0')}`,
      topic,
      promptEn: `Prompt ${i + 1}`,
      promptAr: '',
      options: [0, 1, 2, 3].map((j) => ({
        en: isImage ? '' : `Option ${j + 1}`,
        ar: '',
        correct: j + 1 === correctAnswer,
        ...(isImage ? { image: `T${i + 1}${['a', 'b', 'c', 'd'][j]}.gif` } : {}),
      })),
      keywords: [],
      explanationEn: `Expl ${i + 1}`,
      correctAnswer,
      source: {
        dvsaTopic: 'Alertness',
        answerMarkerRaw: 'A',
        answerMarkerNormalized: 'A',
      },
    });
  }

  // Fix answer markers to match correctAnswer for first image Q with lowercase normalize case
  questions[0].source = {
    dvsaTopic: 'Alertness',
    answerMarkerRaw: 'b',
    answerMarkerNormalized: 'B',
  };
  questions[0].options.forEach((o, idx) => {
    o.correct = idx === 1;
  });
  questions[0].correctAnswer = 2;

  const report = validateTransformedBank(questions);
  assert.equal(report.ok, true, report.errors.join('; '));
  assert.equal(report.count, 758);
  assert.equal(report.uniqueIds, 758);
  assert.equal(report.topicIdsUsed.length, 14);
  assert.equal(countImageOptionQuestions(questions), 27);
  assert.equal(report.normalizedAnswerMarkers.length, 1);
  assert.equal(report.normalizedAnswerMarkers[0].id, 'T0001');
});

run('transform rejects option with neither text nor image', () => {
  const result = transformDvsaRow(
    baseRow({
      OptionA: '',
      'A.gif': '',
    })
  );
  assert.equal(result.ok, false);
});

// Optional: if local staging exists (gitignored), assert real bank completeness.
run('optional local staging bank completeness (skipped if missing)', () => {
  const stagingPath = path.join(
    process.cwd(),
    'local-data',
    'dvsa',
    'staging',
    'questions.v2.json'
  );
  if (!fs.existsSync(stagingPath)) {
    console.log('  (skip — no local-data/dvsa/staging/questions.v2.json)');
    return;
  }
  const payload = JSON.parse(fs.readFileSync(stagingPath, 'utf8')) as {
    questions: DvsaStagingQuestion[];
  };
  const report = validateTransformedBank(payload.questions);
  assert.equal(report.ok, true, report.errors.join('; '));
  assert.equal(report.count, DVSA_V2_EXPECTED_COUNT);
  assert.equal(countImageOptionQuestions(payload.questions), 27);
});

console.log('All dvsaV2 tests passed.');
