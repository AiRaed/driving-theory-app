const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');

// Extract all SM questions
const smQuestions = [];

// Match question blocks for safety-margins
const questionBlockRegex = /{\s*id:\s*"(SM-[^"]+)",\s*topic:\s*"safety-margins",[\s\S]*?options:\s*\[([^\]]+)\],/g;

let match;
while ((match = questionBlockRegex.exec(content)) !== null) {
  const fullBlock = match[0];
  const id = match[1];
  const optionsText = match[2];
  
  // Extract promptEn
  const promptEnMatch = fullBlock.match(/promptEn:\s*"([^"]+)"/);
  let promptEn = '';
  
  if (promptEnMatch) {
    promptEn = promptEnMatch[1];
  } else {
    // Try multi-line prompt
    const multiLineMatch = fullBlock.match(/promptEn:\s*"([^"]*(?:\n[^"]*)*)"/);
    if (multiLineMatch) {
      promptEn = multiLineMatch[1].replace(/\s+/g, ' ').trim();
    }
  }
  
  if (!promptEn) continue;
  
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
  
  if (options.length > 0) {
    smQuestions.push({ id, promptEn, options });
  }
}

console.log(`Found ${smQuestions.length} safety-margins questions`);

if (smQuestions.length > 0) {
  console.log(`\nFirst 3 questions:`);
  smQuestions.slice(0, 3).forEach((q, idx) => {
    console.log(`\n${idx + 1}. ${q.id}: ${q.promptEn.substring(0, 80)}...`);
    q.options.forEach((opt, optIdx) => {
      console.log(`   ${optIdx + 1}. ${opt.en}`);
    });
  });
}

// Generate JSON structure
const urTranslations = {
  "safety-margins": {}
};

smQuestions.forEach(q => {
  urTranslations["safety-margins"][q.id] = {
    "promptUr": "", // TODO: Add Urdu translation
    "options": q.options.map(opt => ({
      "ur": "" // TODO: Add Urdu translation
    }))
  };
});

// Write to file
fs.writeFileSync('tools/sm-urdu-template.json', JSON.stringify(urTranslations, null, 2), 'utf8');
console.log(`\nTemplate saved to tools/sm-urdu-template.json`);
console.log(`Total questions: ${smQuestions.length}`);

