const fs = require('fs');
const js = fs.readFileSync('scratch/original.js', 'utf8');
const css = fs.readFileSync('scratch/original.css', 'utf8');

// Let's inspect CSS root variables
const rootVars = css.match(/--[\w-]+:[^;}]+/g) || [];
console.log('=== CSS VARIABLES ===');
console.log([...new Set(rootVars)]);

// Let's inspect font-family declarations
const fonts = css.match(/font-family:[^;}]+/g) || [];
console.log('\n=== FONT FAMILIES ===');
console.log([...new Set(fonts)]);

// Let's inspect keyframes and special utilities
const keyframes = css.match(/@keyframes\s+([\w-]+)/g) || [];
console.log('\n=== KEYFRAMES ===');
console.log([...new Set(keyframes)]);

// Let's inspect images in CSS
const cssImages = css.match(/url\([^)]+\)/g) || [];
console.log('\n=== CSS BACKGROUND IMAGES ===');
console.log([...new Set(cssImages)]);
