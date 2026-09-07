const fs = require('fs');
const code = fs.readFileSync('scratch/app_slice.js', 'utf8');

// Let's find all images, objects, translations
fs.writeFileSync('scratch/app_slice_formatted.js', code.replace(/;/g, ';\n').replace(/\{/g, '{\n').replace(/\}/g, '\n}'));

console.log('Formatted code saved to scratch/app_slice_formatted.js');
