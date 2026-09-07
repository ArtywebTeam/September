const fs = require('fs');
const js = fs.readFileSync('scratch/original.js', 'utf8');

const enIdx = js.indexOf('{en:{nav:{');
console.log('enIdx:', enIdx);

let depth = 1;
let pos = enIdx;
let endPos = pos + 1;
while (depth > 0 && endPos < js.length) {
  if (js[endPos] === '{') depth++;
  else if (js[endPos] === '}') depth--;
  endPos++;
}

const transCode = js.substring(pos, endPos);
const transObj = eval('(' + transCode + ')');
fs.writeFileSync('scratch/translations.json', JSON.stringify(transObj, null, 2));
console.log('Saved translations.json! Languages available:', Object.keys(transObj));
