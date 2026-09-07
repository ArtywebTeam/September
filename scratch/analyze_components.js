const fs = require('fs');
const js = fs.readFileSync('scratch/original.js', 'utf8');

// Find all React component definitions in the app slice
// Let's inspect everything from index 373000 to the end
const endCode = js.substring(373000);

fs.writeFileSync('scratch/full_app_clean.js', endCode);

// Let's analyze component functions
const compMatches = endCode.match(/function\s+([A-Za-z0-9_$]+)\s*\([^)]*\)\s*\{/g) || [];
console.log('Component functions found:', compMatches);
