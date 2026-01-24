const fs = require('fs');

// Read the questions file
const content = fs.readFileSync('data/questions.ts', 'utf8');

// Extract all keyword terms
const terms = new Set();
const regex = /term: "([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  terms.add(match[1]);
}

// Sort and output
const sortedTerms = Array.from(terms).sort();
console.log(`Found ${sortedTerms.length} unique keyword terms:\n`);
sortedTerms.forEach(term => console.log(term));

