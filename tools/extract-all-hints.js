const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');
const lines = content.split('\n');

// Read Urdu translations
const urduHints = {};
try {
  const urduContent = fs.readFileSync('lib/keyword-translations.ts', 'utf8');
  const hintPattern = /"hint[^"]+":\s*\{[^}]*ur:\s*"[^"]*",\s*explainUr:\s*"([^"]+)"/g;
  let match;
  while ((match = hintPattern.exec(urduContent)) !== null) {
    const beforeMatch = urduContent.substring(0, match.index);
    const termMatch = beforeMatch.match(/"hint[^"]+":\s*\{/);
    if (termMatch) {
      const termLine = beforeMatch.substring(termMatch.index);
      const term = termLine.match(/"hint[^"]+"/)[0].replace(/"/g, '');
      urduHints[term] = match[1];
    }
  }
} catch (e) {
  console.warn('Could not read Urdu translations:', e.message);
}

const allHints = [];
let currentQuestion = null;
let currentHint = null;
let inKeywords = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Find question ID
  const idMatch = line.match(/id:\s*"([^"]+)"/);
  if (idMatch) {
    currentQuestion = {
      id: idMatch[1],
      topic: null,
      promptEn: null,
      correctAnswer: null
    };
  }
  
  // Find topic
  if (currentQuestion && line.includes('topic:')) {
    const topicMatch = line.match(/topic:\s*"([^"]+)"/);
    if (topicMatch) {
      currentQuestion.topic = topicMatch[1];
    }
  }
  
  // Find promptEn
  if (currentQuestion && line.includes('promptEn:')) {
    const promptMatch = line.match(/promptEn:\s*"([^"]+)"/);
    if (promptMatch) {
      currentQuestion.promptEn = promptMatch[1];
    }
  }
  
  // Find correct answer
  if (currentQuestion && line.includes('correct: true')) {
    const optionMatch = line.match(/\{ en: "([^"]+)", ar: "[^"]+", correct: true \}/);
    if (optionMatch) {
      currentQuestion.correctAnswer = optionMatch[1];
    }
  }
  
  // Detect keywords array
  if (line.includes('keywords:') && line.includes('[')) {
    inKeywords = true;
    braceCount = 0;
  }
  
  if (inKeywords && currentQuestion) {
    // Count braces
    for (const char of line) {
      if (char === '[' || char === '{') braceCount++;
      if (char === ']' || char === '}') braceCount--;
    }
    
    // Look for hint terms
    const hintMatch = line.match(/term:\s*"hint[^"]*"/);
    if (hintMatch) {
      currentHint = {
        term: hintMatch[0].match(/"([^"]+)"/)[1],
        questionId: currentQuestion.id,
        topic: currentQuestion.topic,
        promptEn: currentQuestion.promptEn,
        correctAnswer: currentQuestion.correctAnswer,
        explainEn: null,
        explainAr: null,
        explainUr: null,
        hasEnglish: false,
        hasArabic: false,
        hasUrdu: false
      };
    }
    
    // Look for explainEn
    if (currentHint) {
      const explainEnMatch = line.match(/explainEn:\s*"([^"]+)"/);
      if (explainEnMatch) {
        currentHint.explainEn = explainEnMatch[1];
        currentHint.hasEnglish = true;
      }
    }
    
    // Look for explainAr
    if (currentHint) {
      const explainArMatch = line.match(/explainAr:\s*"([^"]+)"/);
      if (explainArMatch) {
        const explainText = explainArMatch[1];
        // Check if it's English or Arabic
        const isEnglish = /^[A-Z]/.test(explainText.trim()) && 
                         /[a-zA-Z]/.test(explainText) &&
                         !/[\u0600-\u06FF]/.test(explainText);
        
        if (isEnglish) {
          // English in explainAr - this is wrong, should be in explainEn
          if (!currentHint.explainEn) {
            currentHint.explainEn = explainText;
            currentHint.hasEnglish = true;
          }
          currentHint.explainAr = null; // Mark as needing Arabic translation
        } else {
          currentHint.explainAr = explainText;
          currentHint.hasArabic = true;
        }
      }
    }
    
    // Check for Urdu
    if (currentHint && urduHints[currentHint.term]) {
      currentHint.explainUr = urduHints[currentHint.term];
      currentHint.hasUrdu = true;
    }
    
    // End of hint object
    if (currentHint && line.includes('}') && braceCount === 1) {
      allHints.push(currentHint);
      currentHint = null;
    }
    
    // End of keywords array
    if (braceCount === 0 && line.includes(']')) {
      inKeywords = false;
    }
  }
}

// Categorize hints
const categorized = {
  complete: allHints.filter(h => h.hasEnglish && h.hasArabic && h.hasUrdu),
  needsArabic: allHints.filter(h => h.hasEnglish && !h.hasArabic && h.hasUrdu),
  needsUrdu: allHints.filter(h => h.hasEnglish && h.hasArabic && !h.hasUrdu),
  needsBoth: allHints.filter(h => h.hasEnglish && !h.hasArabic && !h.hasUrdu),
  englishInWrongPlace: allHints.filter(h => h.explainEn && !h.explainAr && h.hasEnglish),
  missingEnglish: allHints.filter(h => !h.hasEnglish && h.hasArabic)
};

console.log('=== ALL HINTS EXTRACTION ===\n');
console.log(`Total hints found: ${allHints.length}`);
console.log(`Complete (EN/AR/UR): ${categorized.complete.length}`);
console.log(`Needs Arabic: ${categorized.needsArabic.length}`);
console.log(`Needs Urdu: ${categorized.needsUrdu.length}`);
console.log(`Needs Both: ${categorized.needsBoth.length}`);
console.log(`English in wrong place: ${categorized.englishInWrongPlace.length}`);
console.log(`Missing English: ${categorized.missingEnglish.length}\n`);

// Write structured output
const output = {
  summary: {
    total: allHints.length,
    complete: categorized.complete.length,
    needsArabic: categorized.needsArabic.length,
    needsUrdu: categorized.needsUrdu.length,
    needsBoth: categorized.needsBoth.length,
    englishInWrongPlace: categorized.englishInWrongPlace.length,
    missingEnglish: categorized.missingEnglish.length
  },
  hints: allHints.map(h => ({
    questionId: h.questionId,
    term: h.term,
    topic: h.topic,
    promptEn: h.promptEn,
    correctAnswer: h.correctAnswer,
    explainEn: h.explainEn,
    explainAr: h.explainAr,
    explainUr: h.explainUr,
    status: h.hasEnglish && h.hasArabic && h.hasUrdu ? 'complete' :
            h.hasEnglish && h.hasArabic && !h.hasUrdu ? 'needsUrdu' :
            h.hasEnglish && !h.hasArabic && h.hasUrdu ? 'needsArabic' :
            h.hasEnglish && !h.hasArabic && !h.hasUrdu ? 'needsBoth' :
            !h.hasEnglish && h.hasArabic ? 'missingEnglish' : 'unknown'
  }))
};

fs.writeFileSync('tools/all-hints-extracted.json', JSON.stringify(output, null, 2));
console.log('All hints extracted to tools/all-hints-extracted.json');

// Also create a CSV-friendly format for easier review
const csvLines = ['Question ID,Topic,Term,Has EN,Has AR,Has UR,Status,English Text (first 100 chars)'];
allHints.forEach(h => {
  const status = h.hasEnglish && h.hasArabic && h.hasUrdu ? 'complete' :
                 h.hasEnglish && h.hasArabic && !h.hasUrdu ? 'needsUrdu' :
                 h.hasEnglish && !h.hasArabic && h.hasUrdu ? 'needsArabic' :
                 h.hasEnglish && !h.hasArabic && !h.hasUrdu ? 'needsBoth' :
                 !h.hasEnglish && h.hasArabic ? 'missingEnglish' : 'unknown';
  const enText = (h.explainEn || '').substring(0, 100).replace(/"/g, '""');
  csvLines.push(`"${h.questionId}","${h.topic}","${h.term}","${h.hasEnglish}","${h.hasArabic}","${h.hasUrdu}","${status}","${enText}"`);
});

fs.writeFileSync('tools/all-hints-extracted.csv', csvLines.join('\n'));
console.log('CSV format saved to tools/all-hints-extracted.csv');

