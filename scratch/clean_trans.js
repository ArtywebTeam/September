const fs = require('fs');
const js = fs.readFileSync('scratch/original.js', 'utf8');

const target = 'it:{nav:{';
const idx = js.indexOf(target);
console.log('Index of it:{nav:{:', idx);

// Let's find the declaration
const before = js.substring(idx - 100, idx);
console.log('Before:', before);

// Let's find the end of this object (it has it, en, zh)
// Let's find where the object ends by bracket counting
let depth = 1;
let pos = idx - 1; // pointing to '{'
let endPos = pos + 1;
while (depth > 0 && endPos < js.length) {
  if (js[endPos] === '{') depth++;
  else if (js[endPos] === '}') depth--;
  endPos++;
}

const transCode = js.substring(pos, endPos);
fs.writeFileSync('scratch/all_translations.json', JSON.stringify(eval('(' + transCode + ')'), null, 2));
console.log('Successfully saved all_translations.json!');
