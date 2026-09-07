const fs = require('fs');

const js = fs.readFileSync('scratch/original.js', 'utf8');
const css = fs.readFileSync('scratch/original.css', 'utf8');

console.log('=== JS & CSS SIZES ===');
console.log('JS size:', js.length, 'CSS size:', css.length);

// Extract all URLs
const urlRegex = /https:\/\/[^"'\s\)\\]+/g;
const allUrls = [...new Set(js.match(urlRegex) || [])];
console.log('\n=== ALL DETECTED MEDIA / EXTERNAL URLS ===');
allUrls.forEach(u => console.log('-', u));

// Look for pages / navigation / structure
console.log('\n=== COMPONENT & SECTION DETECTION ===');
// Let's find sections or texts
const titleMatches = js.match(/["']([A-Z][A-Za-z0-9\s&·—,\.]{3,60})["']/g) || [];
console.log('Sample text titles:', [...new Set(titleMatches)].slice(0, 40));

// Find React router routes or page routes
const routes = js.match(/(?:path|page|route|url):["'][^"']+["']/gi) || [];
console.log('\n=== DETECTED ROUTES / PATHS ===');
console.log([...new Set(routes)]);
