const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');
const lines = content.split('\n');

// Read Urdu translations
const urduHints = {};
try {
  const urduContent = fs.readFileSync('lib/keyword-translations.ts', 'utf8');
  // Extract hint entries using a more robust regex
  const hintPattern = /"hint[^"]+":\s*\{[^}]*ur:\s*"[^"]*",\s*explainUr:\s*"([^"]+)"/g;
  let match;
  while ((match = hintPattern.exec(urduContent)) !== null) {
    // Find the term before this match
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

console.log(`Found ${Object.keys(urduHints).length} Urdu hint translations`);

// Process the file line by line
let output = [];
let i = 0;
let currentQuestionId = null;
let inHint = false;
let currentHintTerm = null;
let hintLineIndex = -1;

while (i < lines.length) {
  const line = lines[i];
  
  // Track question ID
  const idMatch = line.match(/id:\s*"([^"]+)"/);
  if (idMatch) {
    currentQuestionId = idMatch[1];
  }
  
  // Look for hint term
  const hintTermMatch = line.match(/term:\s*"(hint[^"]*)"/);
  if (hintTermMatch) {
    currentHintTerm = hintTermMatch[1];
    hintLineIndex = i;
    inHint = true;
    output.push(line);
    i++;
    continue;
  }
  
  // Look for explainAr in hint context
  if (inHint && currentHintTerm) {
    const explainArMatch = line.match(/explainAr:\s*"([^"]+)"/);
    if (explainArMatch) {
      const explainText = explainArMatch[1];
      // Check if it's English
      const isEnglish = /^[A-Z]/.test(explainText.trim()) && 
                       /[a-zA-Z]/.test(explainText) &&
                       !/[\u0600-\u06FF]/.test(explainText);
      
      if (isEnglish) {
        // This is English in explainAr - we need to:
        // 1. Add explainEn field with this text
        // 2. Keep explainAr but we'll need to translate it (for now, mark it)
        output.push(`      explainEn: "${explainText}",`);
        output.push(`      explainAr: "[NEEDS_ARABIC_TRANSLATION]", // Original was English: ${explainText.substring(0, 50)}...`);
      } else {
        // This is Arabic - keep it, but check if we need to add explainEn
        const hasUrdu = !!urduHints[currentHintTerm];
        if (hasUrdu) {
          // We have AR and UR, but might be missing EN
          // For now, keep as is - we'll add EN later if needed
          output.push(line);
        } else {
          output.push(line);
        }
      }
      inHint = false;
      currentHintTerm = null;
      i++;
      continue;
    }
  }
  
  output.push(line);
  i++;
}

// Write the updated file
fs.writeFileSync('data/questions-migrated.ts', output.join('\n'));
console.log('Migration complete. Output written to data/questions-migrated.ts');
console.log('Review the file and then replace data/questions.ts with it.');

