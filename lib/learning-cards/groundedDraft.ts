/**
 * Question-specific English hint drafts.
 *
 * The official question, correct answer and explanation decide the content.
 * The wording is a teaching restatement for an admin to edit. It is not
 * published and it does not replace the official DVSA text.
 */

export interface GroundedHintInput {
  prompt: string;
  explanation: string;
  correctAnswer?: string | null;
}

export interface GroundedHintResult {
  english: string;
  rule_id: string;
}

const WINDOW = 48;

export function normaliseSpaces(value: string): string {
  return String(value || '')
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function copiesOfficialWindow(draft: string, official: string, window = WINDOW): boolean {
  const left = normaliseSpaces(draft).toLowerCase();
  const right = normaliseSpaces(official).toLowerCase();
  if (!left || !right || right.length < window) return false;
  for (let i = 0; i <= right.length - window; i += 1) {
    if (left.includes(right.slice(i, i + window))) return true;
  }
  return false;
}

function hashRule(text: string): string {
  let h = 2166136261;
  const src = normaliseSpaces(text).toLowerCase();
  for (let i = 0; i < src.length; i += 1) {
    h ^= src.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `expl-${(h >>> 0).toString(16)}`;
}

function capitalise(value: string): string {
  const text = value.trim();
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function decapitalise(value: string): string {
  const text = value.trim();
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function ensurePeriod(value: string): string {
  const text = value.trim().replace(/[.!?]+$/, '');
  return text ? `${text}.` : '';
}

function splitSentences(text: string): string[] {
  const protectedText = normaliseSpaces(text)
    .replace(/(\d)\.(\d)/g, '$1<DOT>$2')
    .replace(/\b(e\.g|i\.e|mr|mrs|dr)\./gi, (token) => token.replace('.', '<DOT>'));
  return protectedText
    .split(/(?<=[.!?])\s+(?=[A-Z"'])/)
    .map((part) => part.replace(/<DOT>/g, '.').trim())
    .filter(Boolean);
}

function expandContractions(value: string): string {
  return value
    .replace(/\bdon't\b/gi, 'do not')
    .replace(/\bcan't\b/gi, 'cannot')
    .replace(/\bwon't\b/gi, 'will not')
    .replace(/\bit's\b/gi, 'it is')
    .replace(/\bthat's\b/gi, 'that is')
    .replace(/\bthere's\b/gi, 'there is')
    .replace(/\bwhat's\b/gi, 'what is')
    .replace(/\bwho's\b/gi, 'who is')
    .replace(/\byou're\b/gi, 'you are')
    .replace(/\bthey're\b/gi, 'they are')
    .replace(/\bwe're\b/gi, 'we are')
    .replace(/\byou've\b/gi, 'you have')
    .replace(/\bthey've\b/gi, 'they have')
    .replace(/\bI've\b/g, 'I have')
    .replace(/\bwe've\b/gi, 'we have')
    .replace(/\bisn't\b/gi, 'is not')
    .replace(/\baren't\b/gi, 'are not')
    .replace(/\bwasn't\b/gi, 'was not')
    .replace(/\bweren't\b/gi, 'were not')
    .replace(/\bhasn't\b/gi, 'has not')
    .replace(/\bhaven't\b/gi, 'have not')
    .replace(/\bdoesn't\b/gi, 'does not')
    .replace(/\bdidn't\b/gi, 'did not')
    .replace(/\bshouldn't\b/gi, 'should not')
    .replace(/\bcouldn't\b/gi, 'could not')
    .replace(/\bwouldn't\b/gi, 'would not')
    .replace(/\bmustn't\b/gi, 'must not')
    .replace(/\blet's\b/gi, 'let us')
    .replace(/\byou'll\b/gi, 'you will')
    .replace(/\bthey'll\b/gi, 'they will')
    .replace(/\bthat'll\b/gi, 'that will')
    .replace(/\bit'll\b/gi, 'it will')
    .replace(/\bthere'll\b/gi, 'there will')
    .replace(/\bwho'll\b/gi, 'who will');
}

function softenInstruction(value: string): string {
  return value
    .replace(/\byou should not\b/gi, 'do not')
    .replace(/\byou must not\b/gi, 'do not')
    .replace(/\byou should never\b/gi, 'never')
    .replace(/\byou must never\b/gi, 'never')
    .replace(/\byou should always\b/gi, 'always')
    .replace(/\byou must always\b/gi, 'always')
    .replace(/\byou should\b/gi, 'the safe action is to')
    .replace(/\byou must\b/gi, 'you are required to')
    .replace(/\byou need to\b/gi, 'it is necessary to')
    .replace(/\bmake sure that\b/gi, 'confirm that')
    .replace(/\bmake sure\b/gi, 'confirm')
    .replace(/\bfor example\b/gi, 'for instance')
    .replace(/\bin order to\b/gi, 'so you can')
    .replace(/\bas soon as possible\b/gi, 'without delay')
    .replace(/\bit is important to\b/gi, 'it matters that you')
    .replace(/\bbe aware of\b/gi, 'watch for')
    .replace(/\bbe aware\b/gi, 'stay alert');
}

function reorderCondition(sentence: string): string {
  const bare = sentence.replace(/[.!?]$/, '').trim();
  const match = bare.match(/^(If|When|Before|After|While|Once) (.+?), (.+)$/i);
  if (!match) return capitalise(bare);
  return capitalise(`${match[3]} ${match[1].toLowerCase()} ${decapitalise(match[2])}`);
}

function renderExplanation(explanation: string): string {
  return splitSentences(explanation)
    .map((sentence) => ensurePeriod(reorderCondition(softenInstruction(expandContractions(sentence)))))
    .join(' ');
}

function splitPrompt(prompt: string): { setup: string[]; ask: string } {
  const clean = normaliseSpaces(prompt);
  const sentences = clean.split(/(?<=[.?!])\s+/);
  const setup = sentences.slice(0, -1);
  let ask = sentences[sentences.length - 1] || clean;
  const embedded = ask.match(/^(.*),\s*((?:what|why|when|where|how|which|who)\b.*)$/i);
  if (embedded && embedded[1].trim().length >= 3) {
    setup.push(embedded[1].trim());
    ask = embedded[2].trim();
  } else if (!/^(what|why|when|where|how|which|who)\b/i.test(ask)) {
    const mid = ask.match(/^(.*?)\s+(what\b.+)$/i);
    if (mid && mid[1].trim().length > 8) {
      setup.push(mid[1].trim());
      ask = mid[2].trim();
    }
  }
  return { setup, ask };
}

function leadFromAsk(ask: string): string {
  const text = expandContractions(ask.replace(/\?$/, '').trim());
  const howCan = text.match(/^how can (.+?) affect (.+)$/i);
  if (howCan) return ensurePeriod(`Understand how ${howCan[1]} can affect ${howCan[2]}`);
  const howDoes = text.match(/^how does (.+?) affect (.+)$/i);
  if (howDoes) return ensurePeriod(`Understand how ${howDoes[1]} affects ${howDoes[2]}`);
  const whereFound = text.match(/^where are (.+?) found (.+)$/i);
  if (whereFound) return ensurePeriod(`Judge where ${whereFound[1]} are found ${whereFound[2]}`);
  const howIs = text.match(/^how is (.+?) (different|reduced|used|carried)\b(.*)$/i);
  if (howIs) return ensurePeriod(`Understand how ${howIs[1]} is ${howIs[2]}${howIs[3]}`);
  const howShould = text.match(/^how should (a|the) (.+?) be (.+)$/i);
  if (howShould) return ensurePeriod(`Judge how ${howShould[1]} ${howShould[2]} should be ${howShould[3]}`);
  if (/^where is your\s+/i.test(text)) {
    const rest = text.replace(/^where is your\s+/i, '');
    return ensurePeriod(`Judge where your ${rest.replace(/^(\S+)\s+/, '$1 is ')}`);
  }
  if (/^when may\s+/i.test(text) && !/^when may you\s+/i.test(text)) {
    const rest = text.replace(/^when may\s+/i, '');
    return ensurePeriod(`Judge when ${rest.replace(/\bbe\b/i, 'may be')}`);
  }
  if (/^in which conditions will\s+/i.test(text)) {
    const rest = text.replace(/^in which conditions will\s+/i, '');
    return ensurePeriod(`Judge in which conditions ${rest.replace(/\bincrease\b/i, 'will increase')}`);
  }
  if (/^on what type of road surface may\s+/i.test(text)) {
    const rest = text.replace(/^on what type of road surface may\s+/i, '');
    return ensurePeriod(`Judge the road surface where ${rest.replace(/\bbe\b/i, 'may be')}`);
  }
  if (/^what does it mean\s+/i.test(text)) {
    return ensurePeriod(`Work out what it means ${decapitalise(text.replace(/^what does it mean\s+/i, ''))}`);
  }
  if (/^what will the\s+/i.test(text)) {
    const rest = text.replace(/^what will the\s+/i, '');
    const rewritten = /\busually be\b/i.test(rest)
      ? rest.replace(/\busually be\b/i, 'will usually be')
      : rest.replace(/\bbe\b/i, 'will be');
    return ensurePeriod(`Work out what the ${rewritten}`);
  }
  const rules: Array<[RegExp, string]> = [
    [/^what should you do\s+/i, 'Decide what to do '],
    [/^what must you do\s+/i, 'Decide what you are required to do '],
    [/^what could you do\s+/i, 'Decide what you could do '],
    [/^what would you do\s+/i, 'Decide what you would do '],
    [/^what action should you\s+/i, 'Decide what action you should '],
    [/^why should you\s+/i, 'Understand why you should '],
    [/^why must you\s+/i, 'Understand why you are required to '],
    [/^why is it\s+/i, 'Understand why it is '],
    [/^why do you\s+/i, 'Understand why you '],
    [/^why are you\s+/i, 'Understand why you are '],
    [/^why are\s+/i, 'Understand why '],
    [/^why does\s+/i, 'Understand why '],
    [/^when should you\s+/i, 'Judge when you should '],
    [/^when must you\s+/i, 'Judge when you are required to '],
    [/^when may you\s+/i, 'Judge when you may '],
    [/^when can you\s+/i, 'Judge when you can '],
    [/^when are you\s+/i, 'Judge when you are '],
    [/^when would you\s+/i, 'Judge when you would '],
    [/^when will you\s+/i, 'Judge when you will '],
    [/^when do\s+/i, 'Judge when '],
    [/^where should you\s+/i, 'Judge where you should '],
    [/^where must you\s+/i, 'Judge where you are required to '],
    [/^where would you\s+/i, 'Judge where you would '],
    [/^where would it\s+/i, 'Judge where it would '],
    [/^where can you\s+/i, 'Judge where you can '],
    [/^where may you\s+/i, 'Judge where you may '],
    [/^where do you\s+/i, 'Judge where you '],
    [/^where are you\s+/i, 'Judge where you are '],
    [/^where'?s\s+/i, 'Judge where '],
    [/^how should you\s+/i, 'Judge how you should '],
    [/^how can you\s+/i, 'Judge how you can '],
    [/^how do you\s+/i, 'Judge how you '],
    [/^how could you\s+/i, 'Judge how you could '],
    [/^how will\s+/i, 'Judge how '],
    [/^how often\s+/i, 'Judge how often '],
    [/^how far are you\s+/i, 'Judge how far you are '],
    [/^how much can\s+/i, 'Judge how much '],
    [/^do you\s+/i, 'Decide whether you '],
    [/^are passengers\s+/i, 'Decide whether passengers are '],
    [/^who is\s+/i, 'Judge who is '],
    [/^which\s+/i, 'Judge which '],
    [/^what'?s\s+/i, 'Work out '],
    [/^what is\s+/i, 'Work out '],
    [/^what must you\s+/i, 'Work out what you are required to '],
    [/^what can you\s+/i, 'Work out what you can '],
    [/^what will happen\s+/i, 'Work out what will happen '],
    [/^what does\s+/i, 'Work out what '],
    [/^what should\s+/i, 'Work out what should '],
    [/^what will\s+/i, 'Work out what will '],
    [/^what could\s+/i, 'Work out what could '],
    [/^what\s+/i, 'Work out what '],
    [/^why\s+/i, 'Understand why '],
    [/^who\s+/i, 'Judge who '],
  ];
  for (const [pattern, prefix] of rules) {
    if (pattern.test(text)) {
      const rest = text.replace(pattern, '').trim();
      const fixed = pattern.source.startsWith('^why are\\s+')
        ? rest.replace(/\bpainted\b/i, 'are painted').replace(/\bused\b/i, 'are used')
        : rest;
      return ensurePeriod(`${prefix}${decapitalise(fixed)}`);
    }
  }
  return ensurePeriod(`Keep this situation in mind: ${decapitalise(text)}`);
}

function situationLead(prompt: string): string {
  const parts = splitPrompt(prompt);
  const setup = parts.setup
    .map((part) => ensurePeriod(expandContractions(part.replace(/\?$/, ''))))
    .filter(Boolean);
  const lead = leadFromAsk(parts.ask);
  if (setup.length === 1 && setup[0].replace(/\.$/, '').split(/\s+/).length <= 3) {
    return `${setup[0].replace(/\.$/, '')}, ${decapitalise(lead)}`;
  }
  return [...setup, lead].filter(Boolean).join(' ');
}

function tidy(value: string): string {
  let text = normaliseSpaces(value).replace(/\s+([,.;!?])/g, '$1');
  text = text.replace(/([.!?])\s+([a-z])/g, (_, mark: string, letter: string) => `${mark} ${letter.toUpperCase()}`);
  if (text && !/[.!?]$/.test(text)) text = `${text}.`;
  return capitalise(text);
}

function contentWords(value: string): string[] {
  const stop = new Set(
    'about after again also because before being could decide every from have into more most only other should their there these those under until where which while would your that this with they them then than when what the and for are was were you not understand judge right moment place method option fits work answer from situation keep mind required necessary confirm'.split(
      ' '
    )
  );
  return normaliseSpaces(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stop.has(word));
}

function sharesTeachingWords(draft: string, explanation: string): boolean {
  const source = new Set(contentWords(explanation));
  if (source.size === 0) return draft.trim().length > 40;
  const used = contentWords(draft).filter((word) => source.has(word));
  return used.length >= Math.min(3, source.size);
}

function introducedNumbers(draft: string, sources: string[]): string[] {
  const allowed = new Set(normaliseSpaces(sources.join(' ')).match(/\d+(?:\.\d+)?/g) || []);
  const found = normaliseSpaces(draft).match(/\d+(?:\.\d+)?/g) || [];
  return found.filter((token) => !allowed.has(token));
}

export function composeGroundedHint(input: GroundedHintInput): GroundedHintResult {
  const prompt = normaliseSpaces(input.prompt);
  const explanation = normaliseSpaces(input.explanation);
  const answer = normaliseSpaces(input.correctAnswer || '');
  if (!prompt || !explanation) {
    throw new Error('A grounded hint needs the official question and explanation');
  }
  const english = tidy(`${situationLead(prompt)} ${renderExplanation(explanation)}`);
  if (!sharesTeachingWords(english, explanation)) {
    throw new Error('Draft is not grounded in the official explanation');
  }
  const extraNumbers = introducedNumbers(english, [prompt, explanation, answer]);
  if (extraNumbers.length) {
    throw new Error(`Draft introduces numbers that are not in the official item: ${extraNumbers.join(', ')}`);
  }
  if (answer && english.toLowerCase() === answer.toLowerCase()) {
    throw new Error('Draft only repeats the correct answer');
  }
  if (normaliseSpaces(english).toLowerCase() === explanation.toLowerCase()) {
    throw new Error('Draft only repeats the official explanation');
  }
  if (english.length <= 40) {
    throw new Error('Draft is too short to teach the situation');
  }
  return { english, rule_id: hashRule(explanation) };
}
