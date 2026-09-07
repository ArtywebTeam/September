const fs = require('fs');
const js = fs.readFileSync('scratch/original.js', 'utf8');

// Find where the app code starts (search for strings specific to the sanctuary / pasticceria)
const keywords = ['Silk', 'Semolina', 'Sanctuary', 'pasticceria', 'Brescia', 'Porcellaga', 'September', 'Tea', 'menu', 'reservation'];
keywords.forEach(kw => {
  let idx = 0;
  console.log(`=== Matches for "${kw}" ===`);
  while ((idx = js.indexOf(kw, idx)) !== -1) {
    console.log(`Found at index ${idx}:`);
    console.log(js.substring(Math.max(0, idx - 100), Math.min(js.length, idx + 200)));
    console.log('-------------------------');
    idx += kw.length;
    if (idx > 500000) break;
  }
});
