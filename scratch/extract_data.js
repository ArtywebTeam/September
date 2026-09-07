const fs = require('fs');
const js = fs.readFileSync('scratch/original.js', 'utf8');

// Let's find the translations dictionary in the JS bundle
const transMatch = js.match(/const\s+([a-zA-Z0-9_]+)\s*=\s*\{it:\{[\s\S]*?\}\s*\}\s*;/);
if (transMatch) {
  fs.writeFileSync('scratch/extracted_translations.js', transMatch[0]);
  console.log('Found and wrote extracted_translations.js');
} else {
  // Let's search for "it:{"
  const itIdx = js.indexOf('it:{nav:{');
  if (itIdx !== -1) {
    console.log('Found it:{nav:{ at', itIdx);
    const slice = js.substring(itIdx - 20, itIdx + 8000);
    fs.writeFileSync('scratch/extracted_translations_slice.js', slice);
    console.log('Saved slice');
  }
}

// Let's find all data structures
// Look for cakes array
const cakeIdx = js.indexOf('Bk=');
if (cakeIdx !== -1) {
  console.log('Found Bk at', cakeIdx);
  fs.writeFileSync('scratch/extracted_cakes.js', js.substring(cakeIdx, cakeIdx + 4000));
}

// Look for menu price list ($k)
const priceListIdx = js.indexOf('$k=');
if (priceListIdx !== -1) {
  console.log('Found $k at', priceListIdx);
  fs.writeFileSync('scratch/extracted_pricelist.js', js.substring(priceListIdx, priceListIdx + 4000));
}

// Look for gallery images or media map (yr)
const yrIdx = js.indexOf('yr=');
if (yrIdx !== -1) {
  console.log('Found yr at', yrIdx);
  fs.writeFileSync('scratch/extracted_media.js', js.substring(yrIdx, yrIdx + 2000));
}
