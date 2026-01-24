const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');

// Regex to extract all questions for the 'attitude' topic
const questionRegex = /{\s*id:\s*"(AT-[^"]+)",\s*topic:\s*"attitude",\s*promptEn:\s*"([^"]+)",\s*promptAr:\s*"[^"]+",\s*options:\s*\[([\s\S]*?)\],/gs;

const matches = [...content.matchAll(questionRegex)];
console.log(`Found ${matches.length} attitude questions`);

const attitudeQuestions = [];

matches.forEach(match => {
  const id = match[1];
  const promptEn = match[2];
  const optionsText = match[3];

  // Extract options
  const optionRegex = /\{\s*en:\s*"([^"]+)",\s*ar:\s*"[^"]+",\s*correct:\s*(true|false)\s*\}/g;
  const options = [];
  let optionMatch;
  while ((optionMatch = optionRegex.exec(optionsText)) !== null) {
    options.push({
      en: optionMatch[1],
      correct: optionMatch[2] === 'true'
    });
  }

  attitudeQuestions.push({ id, promptEn, options });
});

console.log(`\nFirst 3 questions:`);
attitudeQuestions.slice(0, 3).forEach((q, idx) => {
  console.log(`\n${idx + 1}. ${q.id}: ${q.promptEn.substring(0, 50)}...`);
  q.options.forEach((opt, optIdx) => {
    console.log(`   ${optIdx + 1}. ${opt.en}`);
  });
});

// Generate JSON structure
const urTranslations = {
  "attitude": {}
};

attitudeQuestions.forEach(q => {
  urTranslations["attitude"][q.id] = {
    "promptUr": "", // TODO: Add Urdu translation
    "options": q.options.map(opt => ({
      "ur": "" // TODO: Add Urdu translation
    }))
  };
});

fs.writeFileSync('tools/attitude-urdu-template.json', JSON.stringify(urTranslations, null, 2), 'utf8');
console.log(`\nTemplate saved to tools/attitude-urdu-template.json`);
console.log(`Total questions: ${attitudeQuestions.length}`);

