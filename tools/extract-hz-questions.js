const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');

// Extract all hazard-awareness questions
const hzQuestions = [];
const lines = content.split('\n');
let currentQuestion = null;
let inQuestion = false;
let braceCount = 0;
let questionStart = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if this is a hazard-awareness question
  if (line.includes('topic: "hazard-awareness"')) {
    // Find the ID on previous lines
    for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
      const idMatch = lines[j].match(/id: "([^"]+)"/);
      if (idMatch) {
        currentQuestion = {
          id: idMatch[1],
          promptEn: '',
          options: []
        };
        questionStart = j;
        inQuestion = true;
        braceCount = 0;
        break;
      }
    }
  }
  
  if (inQuestion && currentQuestion) {
    // Extract promptEn
    const promptMatch = line.match(/promptEn: "([^"]+)"/);
    if (promptMatch) {
      currentQuestion.promptEn = promptMatch[1];
    }
    
    // Extract options
    const optionMatch = line.match(/\{ en: "([^"]+)", ar: "[^"]+", correct: (true|false) \}/);
    if (optionMatch) {
      currentQuestion.options.push({
        en: optionMatch[1],
        correct: optionMatch[2] === 'true'
      });
    }
    
    // Count braces to find end of question
    for (const char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
    
    // End of question object
    if (braceCount === 0 && line.trim() === '},') {
      hzQuestions.push(currentQuestion);
      currentQuestion = null;
      inQuestion = false;
      braceCount = 0;
    }
  }
}

console.log(`Found ${hzQuestions.length} hazard-awareness questions`);

// Generate JSON structure for ur.json
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

// Write to a new file
fs.writeFileSync('tools/hz-urdu-template.json', JSON.stringify(urTranslations, null, 2));
console.log('Template written to tools/hz-urdu-template.json');
console.log(`\nFirst 5 questions:`);
hzQuestions.slice(0, 5).forEach((q, idx) => {
  console.log(`\n${idx + 1}. ${q.id}: ${q.promptEn}`);
  q.options.forEach((opt, optIdx) => {
    console.log(`   ${optIdx + 1}. ${opt.en} (correct: ${opt.correct})`);
  });
});

