const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');

// Extract all RS questions using a more flexible regex
const rsQuestions = [];

// Match question blocks - handle both orders (promptEn before/after image)
const questionBlockRegex = /{\s*id:\s*"(RS-[^"]+)",\s*topic:\s*"road-signs",[\s\S]*?options:\s*\[([^\]]+)\],/g;

let match;
while ((match = questionBlockRegex.exec(content)) !== null) {
  const fullBlock = match[0];
  const id = match[1];
  const optionsText = match[2];
  
  // Extract promptEn (may be on same line or different line)
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
    rsQuestions.push({ id, promptEn, options });
  }
}

console.log(`Found ${rsQuestions.length} road-signs questions`);

if (rsQuestions.length > 0) {
  console.log(`\nFirst 3 questions:`);
  rsQuestions.slice(0, 3).forEach((q, idx) => {
    console.log(`\n${idx + 1}. ${q.id}: ${q.promptEn.substring(0, 80)}...`);
    q.options.forEach((opt, optIdx) => {
      console.log(`   ${optIdx + 1}. ${opt.en}`);
    });
  });
}

// Generate JSON structure
const urTranslations = {
  "road-signs": {}
};

rsQuestions.forEach(q => {
  urTranslations["road-signs"][q.id] = {
    "promptUr": "", // TODO: Add Urdu translation
    "options": q.options.map(opt => ({
      "ur": "" // TODO: Add Urdu translation
    }))
  };
});

// Write to file
fs.writeFileSync('tools/rs-urdu-template.json', JSON.stringify(urTranslations, null, 2), 'utf8');
console.log(`\nTemplate saved to tools/rs-urdu-template.json`);
console.log(`Total questions: ${rsQuestions.length}`);
