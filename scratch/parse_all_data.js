
const fs = require('fs');
const js = fs.readFileSync('scratch/original.js', 'utf8');

// Extract the translation object
const itStart = js.indexOf('it:{nav:{');
// Let's extract from itStart to the closing brace
let transStr = js.substring(itStart - 1, js.indexOf(';const Ue=', itStart));
fs.writeFileSync('scratch/all_translations.json', JSON.stringify(eval('({' + transStr + '})'), null, 2));

// Extract Ue (Store info / address)
const ueStart = js.indexOf('Ue={');
const ueEnd = js.indexOf(';', ueStart);
let ueStr = js.substring(ueStart + 3, ueEnd);
fs.writeFileSync('scratch/store_info.json', JSON.stringify(eval('(' + ueStr + ')'), null, 2));

// Extract yr (Media mapping)
const yrStart = js.indexOf('yr={');
const yrEnd = js.indexOf('},Bk=', yrStart) + 1;
const qtVal = "https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/";
let yrCode = js.substring(yrStart, yrEnd).replace(/\$\{Qt\}/g, qtVal).replace(/yr=/, '');
fs.writeFileSync('scratch/media_map.json', JSON.stringify(eval('(' + yrCode + ')'), null, 2));

// Extract Bk (Cakes array)
const bkStart = js.indexOf('Bk=[');
const bkEnd = js.indexOf('],\$k=', bkStart) + 1;
let bkCode = js.substring(bkStart, bkEnd).replace(/\$\{Qt\}/g, qtVal).replace(/Bk=/, '');
fs.writeFileSync('scratch/cakes.json', JSON.stringify(eval('(' + bkCode + ')'), null, 2));

// Extract $k (Price list array)
const pkStart = js.indexOf('\$k=[');
const pkEnd = js.indexOf('];function', pkStart) + 1;
let pkCode = js.substring(pkStart, pkEnd).replace(/\$k=/, '');
fs.writeFileSync('scratch/pricelist.json', JSON.stringify(eval('(' + pkCode + ')'), null, 2));

console.log('All data extracted successfully to JSON files!');
