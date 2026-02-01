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

const issues = {
  englishInExplainAr: [],
  missingArabic: [],
  missingUrdu: [],
  missingEnglish: [],
  allThreePresent: [],
  noHint: []
};

let currentQuestion = null;
let currentHint = null;
let inKeywords = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Find question ID
  const idMatch = line.match(/id:\s*"([^"]+)"/);
  if (idMatch) {
    if (currentQuestion) {
      // Check if question has any hints
      if (currentQuestion.hints.length === 0) {
        issues.noHint.push({
          questionId: currentQuestion.id,
          topic: currentQuestion.topic,
          promptEn: currentQuestion.promptEn?.substring(0, 80) + '...'
        });
      }
    }
    currentQuestion = {
      id: idMatch[1],
      topic: null,
      promptEn: null,
      hints: []
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
        hasEnglish: false,
        hasArabic: false,
        hasUrdu: false,
        englishText: null,
        arabicText: null,
        urduText: null,
        explainEn: null
      };
    }
    
    // Look for explainEn
    if (currentHint) {
      const explainEnMatch = line.match(/explainEn:\s*"([^"]+)"/);
      if (explainEnMatch) {
        currentHint.explainEn = explainEnMatch[1];
        currentHint.hasEnglish = true;
        currentHint.englishText = explainEnMatch[1];
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
          currentHint.hasEnglish = true;
          currentHint.englishText = explainText;
          issues.englishInExplainAr.push({
            questionId: currentHint.questionId,
            term: currentHint.term,
            englishText: explainText
          });
        } else {
          currentHint.hasArabic = true;
          currentHint.arabicText = explainText;
        }
        
        // Check for Urdu
        if (urduHints[currentHint.term]) {
          currentHint.hasUrdu = true;
          currentHint.urduText = urduHints[currentHint.term];
        }
        
        currentQuestion.hints.push(currentHint);
        currentHint = null;
      }
    }
    
    // End of keywords array
    if (braceCount === 0 && line.includes(']')) {
      inKeywords = false;
    }
  }
}

// Final check
if (currentQuestion && currentQuestion.hints.length === 0) {
  issues.noHint.push({
    questionId: currentQuestion.id,
    topic: currentQuestion.topic,
    promptEn: currentQuestion.promptEn?.substring(0, 80) + '...'
  });
}

// Categorize all hints
for (const question of Object.values(issues).flat()) {
  if (question && question.questionId) {
    // Already categorized
  }
}

// Analyze collected hints
const allHints = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const hintMatch = line.match(/term:\s*"hint[^"]*"/);
  if (hintMatch) {
    const term = hintMatch[0].match(/"([^"]+)"/)[1];
    let questionId = null;
    for (let j = i; j >= Math.max(0, i - 20); j--) {
      const idMatch = lines[j].match(/id:\s*"([^"]+)"/);
      if (idMatch) {
        questionId = idMatch[1];
        break;
      }
    }
    
    let explainEn = null;
    let explainAr = null;
    let explainArIsEnglish = false;
    
    for (let j = i; j < Math.min(lines.length, i + 5); j++) {
      const explainEnMatch = lines[j].match(/explainEn:\s*"([^"]+)"/);
      if (explainEnMatch) {
        explainEn = explainEnMatch[1];
      }
      const explainArMatch = lines[j].match(/explainAr:\s*"([^"]+)"/);
      if (explainArMatch) {
        explainAr = explainArMatch[1];
        explainArIsEnglish = /^[A-Z]/.test(explainAr.trim()) && 
                             /[a-zA-Z]/.test(explainAr) &&
                             !/[\u0600-\u06FF]/.test(explainAr);
        break;
      }
    }
    
    const hasUrdu = !!urduHints[term];
    const hasEnglish = !!explainEn || explainArIsEnglish;
    const hasArabic = !!explainAr && !explainArIsEnglish;
    
    if (hasEnglish && hasArabic && hasUrdu) {
      issues.allThreePresent.push({ questionId, term });
    } else {
      if (!hasEnglish) issues.missingEnglish.push({ questionId, term });
      if (!hasArabic) issues.missingArabic.push({ questionId, term });
      if (!hasUrdu) issues.missingUrdu.push({ questionId, term });
    }
  }
}

// Summary
console.log('=== HINT ISSUES ANALYSIS ===\n');
console.log(`Questions without hints: ${issues.noHint.length}`);
console.log(`Hints with English in explainAr (needs fixing): ${issues.englishInExplainAr.length}`);
console.log(`Hints missing English: ${issues.missingEnglish.length}`);
console.log(`Hints missing Arabic: ${issues.missingArabic.length}`);
console.log(`Hints missing Urdu: ${issues.missingUrdu.length}`);
console.log(`Hints with all three languages: ${issues.allThreePresent.length}\n`);

// Write detailed report
const report = {
  summary: {
    totalQuestions: issues.noHint.length + issues.allThreePresent.length + 
                    Math.max(issues.missingEnglish.length, issues.missingArabic.length, issues.missingUrdu.length),
    questionsWithoutHints: issues.noHint.length,
    hintsWithAllThree: issues.allThreePresent.length,
    englishInExplainAr: issues.englishInExplainAr.length,
    missingEnglish: issues.missingEnglish.length,
    missingArabic: issues.missingArabic.length,
    missingUrdu: issues.missingUrdu.length
  },
  details: {
    noHint: issues.noHint.slice(0, 20), // Sample
    englishInExplainAr: issues.englishInExplainAr.slice(0, 20), // Sample
    missingEnglish: issues.missingEnglish.slice(0, 20), // Sample
    missingArabic: issues.missingArabic.slice(0, 20), // Sample
    missingUrdu: issues.missingUrdu.slice(0, 20), // Sample
    allThreePresent: issues.allThreePresent.slice(0, 10) // Sample
  }
};

fs.writeFileSync('tools/hint-issues-report.json', JSON.stringify(report, null, 2));
console.log('Detailed report written to tools/hint-issues-report.json');

