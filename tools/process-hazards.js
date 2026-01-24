const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');
const lines = content.split('\n');

// Extract all hazard-awareness questions with their positions
const hazardQuestions = [];
let currentQuestion = null;
let braceCount = 0;
let inQuestion = false;
let questionStart = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('topic: "hazard-awareness"')) {
    // Find the ID on the previous line
    for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
      const idMatch = lines[j].match(/id: "([^"]+)"/);
      if (idMatch) {
        currentQuestion = {
          id: idMatch[1],
          startLine: j,
          endLine: -1,
          lines: []
        };
        questionStart = j;
        inQuestion = true;
        break;
      }
    }
  }
  
  if (inQuestion && currentQuestion) {
    currentQuestion.lines.push(line);
    
    // Count braces to find end of question
    for (const char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
    
    // End of question object
    if (braceCount === 0 && line.trim() === '},') {
      currentQuestion.endLine = i;
      hazardQuestions.push(currentQuestion);
      currentQuestion = null;
      inQuestion = false;
      braceCount = 0;
    }
  }
}

console.log(`Found ${hazardQuestions.length} hazard-awareness questions`);
console.log('First 30:');
hazardQuestions.slice(0, 30).forEach((q, idx) => {
  console.log(`${idx + 1}. ${q.id} (lines ${q.startLine + 1}-${q.endLine + 1})`);
});

