const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');
const lines = content.split('\n');

// Read Urdu translations
const keywordTranslations = require('../lib/keyword-translations.ts');
const urduHints = {};
try {
  const urduContent = fs.readFileSync('lib/keyword-translations.ts', 'utf8');
  // Extract hint entries
  const hintMatches = urduContent.matchAll(/"hint[^"]+":\s*\{[^}]+explainUr:\s*"([^"]+)"/g);
  for (const match of hintMatches) {
    const termMatch = urduContent.substring(0, match.index).match(/"hint[^"]+":/);
    if (termMatch) {
      const term = termMatch[0].match(/"([^"]+)"/)[1];
      urduHints[term] = match[1];
    }
  }
} catch (e) {
  console.warn('Could not read Urdu translations:', e.message);
}

const audit = {
  totalQuestions: 0,
  questionsWithHints: 0,
  questionsWithoutHints: 0,
  hintsByLanguage: {
    englishOnly: [],
    arabicOnly: [],
    urduOnly: [],
    allThree: [],
    missing: []
  },
  issues: []
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
    if (currentQuestion && currentQuestion.hints.length === 0) {
      audit.questionsWithoutHints++;
    }
    currentQuestion = {
      id: idMatch[1],
      topic: null,
      hints: []
    };
    audit.totalQuestions++;
  }
  
  // Find topic
  if (currentQuestion && line.includes('topic:')) {
    const topicMatch = line.match(/topic:\s*"([^"]+)"/);
    if (topicMatch) {
      currentQuestion.topic = topicMatch[1];
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
        urduText: null
      };
    }
    
    // Look for explainAr
    if (currentHint) {
      const explainMatch = line.match(/explainAr:\s*"([^"]+)"/);
      if (explainMatch) {
        const explainText = explainMatch[1];
        // Check if it's English or Arabic
        const isEnglish = /^[A-Z]/.test(explainText.trim()) && 
                         /[a-zA-Z]/.test(explainText) &&
                         !/[\u0600-\u06FF]/.test(explainText);
        
        if (isEnglish) {
          currentHint.hasEnglish = true;
          currentHint.englishText = explainText;
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
      if (currentQuestion.hints.length > 0) {
        audit.questionsWithHints++;
      }
    }
  }
}

// Final check
if (currentQuestion && currentQuestion.hints.length === 0) {
  audit.questionsWithoutHints++;
}

// Categorize hints
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const hintMatch = line.match(/term:\s*"hint[^"]*"/);
  if (hintMatch) {
    const term = hintMatch[0].match(/"([^"]+)"/)[1];
    // Find the question this hint belongs to
    let questionId = null;
    for (let j = i; j >= Math.max(0, i - 20); j--) {
      const idMatch = lines[j].match(/id:\s*"([^"]+)"/);
      if (idMatch) {
        questionId = idMatch[1];
        break;
      }
    }
    
    // Find explainAr
    let explainText = null;
    let isEnglish = false;
    for (let j = i; j < Math.min(lines.length, i + 5); j++) {
      const explainMatch = lines[j].match(/explainAr:\s*"([^"]+)"/);
      if (explainMatch) {
        explainText = explainMatch[1];
        isEnglish = /^[A-Z]/.test(explainText.trim()) && 
                   /[a-zA-Z]/.test(explainText) &&
                   !/[\u0600-\u06FF]/.test(explainText);
        break;
      }
    }
    
    const hasUrdu = !!urduHints[term];
    
    if (isEnglish && !hasUrdu) {
      audit.hintsByLanguage.englishOnly.push({ questionId, term, text: explainText });
    } else if (!isEnglish && !hasUrdu) {
      audit.hintsByLanguage.arabicOnly.push({ questionId, term });
    } else if (!isEnglish && hasUrdu) {
      audit.hintsByLanguage.allThree.push({ questionId, term });
    } else if (isEnglish && hasUrdu) {
      audit.hintsByLanguage.allThree.push({ questionId, term, note: 'English in explainAr, needs Arabic' });
    }
  }
}

// Summary
console.log('=== HINT AUDIT SUMMARY ===\n');
console.log(`Total questions: ${audit.totalQuestions}`);
console.log(`Questions with hints: ${audit.questionsWithHints}`);
console.log(`Questions without hints: ${audit.questionsWithoutHints}\n`);

console.log('Hints by language coverage:');
console.log(`  All three languages (EN/AR/UR): ${audit.hintsByLanguage.allThree.length}`);
console.log(`  English only: ${audit.hintsByLanguage.englishOnly.length}`);
console.log(`  Arabic only: ${audit.hintsByLanguage.arabicOnly.length}`);
console.log(`  Missing languages: ${audit.hintsByLanguage.missing.length}\n`);

// Write detailed report
const report = {
  summary: {
    totalQuestions: audit.totalQuestions,
    questionsWithHints: audit.questionsWithHints,
    questionsWithoutHints: audit.questionsWithoutHints,
    hintsByLanguage: {
      allThree: audit.hintsByLanguage.allThree.length,
      englishOnly: audit.hintsByLanguage.englishOnly.length,
      arabicOnly: audit.hintsByLanguage.arabicOnly.length,
      missing: audit.hintsByLanguage.missing.length
    }
  },
  details: audit.hintsByLanguage
};

fs.writeFileSync('tools/hint-audit-report.json', JSON.stringify(report, null, 2));
console.log('Detailed report written to tools/hint-audit-report.json');

