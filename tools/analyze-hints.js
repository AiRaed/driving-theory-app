const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');

// Extract all hints
const hints = [];
const lines = content.split('\n');

let currentQuestion = null;
let currentHint = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Look for hint terms
  const hintMatch = line.match(/term:\s*"hint[^"]*"/);
  if (hintMatch) {
    currentHint = { term: hintMatch[0].match(/"([^"]+)"/)[1] };
  }
  
  // Look for explainAr
  if (currentHint) {
    const explainMatch = line.match(/explainAr:\s*"([^"]+)"/);
    if (explainMatch) {
      currentHint.explainAr = explainMatch[1];
      // Check if it's in English (starts with capital letter and contains English words)
      const isEnglish = /^[A-Z]/.test(currentHint.explainAr.trim()) && 
                       /[a-zA-Z]/.test(currentHint.explainAr) &&
                       !/[\u0600-\u06FF]/.test(currentHint.explainAr); // No Arabic characters
      currentHint.isEnglish = isEnglish;
      
      // Try to find question ID
      for (let j = i; j >= Math.max(0, i - 20); j--) {
        const idMatch = lines[j].match(/id:\s*"([^"]+)"/);
        if (idMatch) {
          currentHint.questionId = idMatch[1];
          break;
        }
      }
      
      hints.push(currentHint);
      currentHint = null;
    }
  }
}

console.log(`Total hints found: ${hints.length}`);
const englishHints = hints.filter(h => h.isEnglish);
console.log(`Hints in English: ${englishHints.length}`);
console.log(`Hints in Arabic: ${hints.length - englishHints.length}`);

console.log('\nSample English hints:');
englishHints.slice(0, 10).forEach(h => {
  console.log(`\n${h.questionId || 'Unknown'} (${h.term}):`);
  console.log(`  ${h.explainAr}`);
});

// Write all English hints to a file for review
const output = englishHints.map(h => ({
  questionId: h.questionId,
  term: h.term,
  englishHint: h.explainAr
}));

fs.writeFileSync('tools/english-hints.json', JSON.stringify(output, null, 2));
console.log('\nAll English hints written to tools/english-hints.json');

