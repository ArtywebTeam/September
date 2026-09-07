const fs = require('fs');
const js = fs.readFileSync('scratch/original.js', 'utf8');

// Find the start of the app code
// Let's find translations object or app component
const appStart = js.indexOf('const yr=') !== -1 ? js.indexOf('const yr=') : js.indexOf('{it:{');
console.log('App start candidate:', appStart);

// Let's grab from index 360000 to the end of js
const appSlice = js.substring(360000);
fs.writeFileSync('scratch/app_slice.js', appSlice);
console.log('Saved app_slice.js, size:', appSlice.length);
