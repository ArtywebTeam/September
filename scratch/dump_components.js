const fs = require('fs');
const js = fs.readFileSync('scratch/full_app_clean.js', 'utf8');

function extractFunction(name) {
  const marker = `function ${name}(`;
  const idx = js.indexOf(marker);
  if (idx === -1) return null;
  // Let's find end of function or next function
  const nextFn = js.indexOf('function ', idx + marker.length);
  return nextFn !== -1 ? js.substring(idx, nextFn) : js.substring(idx);
}

const comps = ['aE', 'Ik', 'Mk', 'Fk', 'qk', 'Vk', 'Gk', 'vr', 'Jk', 'Zk', 'eE', 'tE', 'nE', 'rE', 'sE', 'iE', 'oE'];
comps.forEach(c => {
  const fn = extractFunction(c);
  if (fn) {
    console.log(`\n=================== COMPONENT ${c} ===================`);
    console.log(fn.substring(0, 1000));
  }
});
