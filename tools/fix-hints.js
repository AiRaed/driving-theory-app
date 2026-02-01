const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');
const lines = content.split('\n');

// Find all hints that need fixing
const hintsToFix = [];
let currentQuestion = null;
let currentHint = null;
let inKeywords = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Find question ID
  const idMatch = line.match(/id:\s*"([^"]+)"/);
  if (idMatch) {
    currentQuestion = { id: idMatch[1], line: i };
  }
  
  // Detect keywords array
  if (line.includes('keywords:') && line.includes('[')) {
    inKeywords = true;
    braceCount = 0;
  }
  
  if (inKeywords) {
    // Count braces to track array/object nesting
    for (const char of line) {
      if (char === '[' || char === '{') braceCount++;
      if (char === ']' || char === '}') braceCount--;
    }
    
    // Look for hint terms
    const hintMatch = line.match(/term:\s*"hint[^"]*"/);
    if (hintMatch) {
      currentHint = { 
        term: hintMatch[0].match(/"([^"]+)"/)[1],
        questionId: currentQuestion?.id,
        line: i
      };
    }
    
    // Look for explainAr
    if (currentHint) {
      const explainMatch = line.match(/explainAr:\s*"([^"]+)"/);
      if (explainMatch) {
        const explainText = explainMatch[1];
        // Check if it's in English
        const isEnglish = /^[A-Z]/.test(explainText.trim()) && 
                         /[a-zA-Z]/.test(explainText) &&
                         !/[\u0600-\u06FF]/.test(explainText);
        
        if (isEnglish) {
          hintsToFix.push({
            ...currentHint,
            englishHint: explainText,
            line: i,
            fullLine: line
          });
        }
        currentHint = null;
      }
    }
    
    // End of keywords array
    if (braceCount === 0 && line.includes(']')) {
      inKeywords = false;
    }
  }
}

console.log(`Found ${hintsToFix.length} hints that need Arabic translation`);
console.log(`\nSample hints to fix:`);
hintsToFix.slice(0, 10).forEach(h => {
  console.log(`\n${h.questionId} (${h.term}):`);
  console.log(`  English: ${h.englishHint}`);
});

// Write to file for review
fs.writeFileSync('tools/hints-to-fix.json', JSON.stringify(hintsToFix, null, 2));
console.log(`\nAll hints written to tools/hints-to-fix.json`);

