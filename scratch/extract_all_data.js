const fs = require('fs');
const js = fs.readFileSync('scratch/original.js', 'utf8');

// 1. Store info (Ue)
const ueIdx = js.indexOf('Ue={');
if (ueIdx !== -1) {
  let depth = 1;
  let pos = ueIdx + 3;
  let endPos = pos + 1;
  while (depth > 0 && endPos < js.length) {
    if (js[endPos] === '{') depth++;
    else if (js[endPos] === '}') depth--;
    endPos++;
  }
  const ueObj = eval('(' + js.substring(pos, endPos) + ')');
  fs.writeFileSync('scratch/store_info.json', JSON.stringify(ueObj, null, 2));
  console.log('Saved store_info.json:', ueObj);
}

// 2. Media map (yr)
const yrIdx = js.indexOf('yr={');
if (yrIdx !== -1) {
  let depth = 1;
  let pos = yrIdx + 3;
  let endPos = pos + 1;
  while (depth > 0 && endPos < js.length) {
    if (js[endPos] === '{') depth++;
    else if (js[endPos] === '}') depth--;
    endPos++;
  }
  const qtVal = "https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/";
  const yrCode = js.substring(pos, endPos).replace(/\$\{Qt\}/g, qtVal).replace(/Qt\+/g, '"' + qtVal + '"+');
  const yrObj = eval('(' + yrCode + ')');
  fs.writeFileSync('scratch/media_map.json', JSON.stringify(yrObj, null, 2));
  console.log('Saved media_map.json:', yrObj);
}

// 3. Signature cakes (Bk)
const bkIdx = js.indexOf('Bk=[');
if (bkIdx !== -1) {
  let depth = 1;
  let pos = bkIdx + 3;
  let endPos = pos + 1;
  while (depth > 0 && endPos < js.length) {
    if (js[endPos] === '[') depth++;
    else if (js[endPos] === ']') depth--;
    endPos++;
  }
  const qtVal = "https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/";
  const bkCode = js.substring(pos, endPos).replace(/\$\{Qt\}/g, qtVal).replace(/Qt\+/g, '"' + qtVal + '"+');
  const bkObj = eval('(' + bkCode + ')');
  fs.writeFileSync('scratch/cakes.json', JSON.stringify(bkObj, null, 2));
  console.log('Saved cakes.json, items count:', bkObj.length);
}

// 4. Price list ($k)
const pkIdx = js.indexOf('$k=[');
if (pkIdx !== -1) {
  let depth = 1;
  let pos = pkIdx + 3;
  let endPos = pos + 1;
  while (depth > 0 && endPos < js.length) {
    if (js[endPos] === '[') depth++;
    else if (js[endPos] === ']') depth--;
    endPos++;
  }
  const pkObj = eval('(' + js.substring(pos, endPos) + ')');
  fs.writeFileSync('scratch/pricelist.json', JSON.stringify(pkObj, null, 2));
  console.log('Saved pricelist.json, categories count:', pkObj.length);
}

// 5. Check for audio files
const audioRegex = /https:\/\/[^"'\s]+\.(?:mp3|wav|ogg|m4a)/g;
const audioMatches = js.match(audioRegex) || [];
console.log('Audio files found:', audioMatches);
