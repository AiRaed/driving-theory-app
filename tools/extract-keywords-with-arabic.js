const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');

// Extract all keywords with their Arabic translations
const keywordsMap = new Map();
const keywordRegex = /\{\s*term:\s*"([^"]+)",\s*ar:\s*"([^"]+)",\s*explainAr:\s*"([^"]+)"\s*\}/g;
let match;

while ((match = keywordRegex.exec(content)) !== null) {
  const term = match[1];
  const ar = match[2];
  const explainAr = match[3];
  
  // Only add if not already in map (to avoid duplicates)
  if (!keywordsMap.has(term)) {
    keywordsMap.set(term, { ar, explainAr });
  }
}

// Convert to array and sort
const keywords = Array.from(keywordsMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

console.log(`Found ${keywords.length} unique keywords:\n`);
keywords.forEach(([term, { ar, explainAr }]) => {
  console.log(`"${term}": { ar: "${ar}", explainAr: "${explainAr}" }`);
});

// Write to JSON file for reference
const keywordsObj = {};
keywords.forEach(([term, { ar, explainAr }]) => {
  keywordsObj[term] = { ar, explainAr };
});

fs.writeFileSync('tools/keywords-reference.json', JSON.stringify(keywordsObj, null, 2), 'utf8');
console.log(`\nReference file saved to tools/keywords-reference.json`);

