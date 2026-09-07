const fs = require('fs');
const js = fs.readFileSync('scratch/original.js', 'utf8');

// Find all image URLs with extension
const imgRegex = /https:\/\/media\.base44\.com\/images\/public\/[^\s"'\)]+/g;
const imgList = [...new Set(js.match(imgRegex) || [])];
console.log('=== BASE44 IMAGES ===');
imgList.forEach(i => console.log(i));

// Let's find Lucide icons used
const lucideIcons = js.match(/createLucideIcon\("([^"]+)"/g) || [];
console.log('=== LUCIDE ICONS ===');
console.log([...new Set(lucideIcons)]);

// Let's find strings longer than 20 chars in the bundle to see the texts/copy
const strings = js.match(/"([^"\\]|\\.)*"/g) || [];
const appStrings = strings
  .map(s => s.slice(1, -1))
  .filter(s => s.length > 25 && !s.includes('http') && !s.includes('Failed') && !s.includes('webpack') && !s.includes('Cannot'));

console.log('\n=== SAMPLE APP TEXTS ===');
console.log(appStrings.slice(0, 30));

// Let's find components or objects with title, description, price, category, etc.
