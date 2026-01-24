const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');

// Use regex to extract all HZ questions
const questionRegex = /{\s*id:\s*"(HZ-[^"]+)",\s*topic:\s*"hazard-awareness",\s*promptEn:\s*"([^"]+)",\s*promptAr:\s*"[^"]+",\s*options:\s*\[([^\]]+)\],/gs;

const matches = [...content.matchAll(questionRegex)];
console.log(`Found ${matches.length} hazard-awareness questions`);

const hzQuestions = [];

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
  
  hzQuestions.push({ id, promptEn, options });
});

console.log(`\nFirst 3 questions:`);
hzQuestions.slice(0, 3).forEach((q, idx) => {
  console.log(`\n${idx + 1}. ${q.id}: ${q.promptEn}`);
  q.options.forEach((opt, optIdx) => {
    console.log(`   ${optIdx + 1}. ${opt.en}`);
  });
});

// Generate JSON structure
const urTranslations = {
  "hazard-awareness": {}
};

hzQuestions.forEach(q => {
  urTranslations["hazard-awareness"][q.id] = {
    "promptUr": "", // TODO: Add Urdu translation
    "options": q.options.map(opt => ({
      "ur": "" // TODO: Add Urdu translation
    }))
  };
});

// Write template
fs.writeFileSync('tools/hz-urdu-template.json', JSON.stringify(urTranslations, null, 2));
console.log(`\nTemplate written to tools/hz-urdu-template.json with ${hzQuestions.length} questions`);

