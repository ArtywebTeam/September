const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');

// 1. Check all required files exist
const requiredFiles = [
  'index.html',
  'css/style.css',
  'js/main.js',
  'js/translations.js',
  'assets/images/logo.png',
  'assets/images/hero.webp',
  'assets/images/counter.webp',
  'assets/images/bubbletea.webp',
  'assets/images/storefront.webp',
  'assets/images/cake-matcha.jpg',
  'assets/images/cake-love.jpg',
  'assets/images/cake-ribbon.jpg',
  'assets/images/cake-100days.jpg',
  'assets/images/menu-drinks.jpg',
  'assets/images/menu-snacks.jpg',
  'assets/images/menu-new-snacks.jpg'
];

let allOk = true;
requiredFiles.forEach(f => {
  const fullPath = path.join(baseDir, f);
  if (!fs.existsSync(fullPath)) {
    console.error(`MISSING FILE: ${f}`);
    allOk = false;
  } else {
    const size = fs.statSync(fullPath).size;
    console.log(`[OK] ${f} (${size} bytes)`);
  }
});

// 2. Validate translation keys referenced in index.html
const html = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');
const { TRANSLATIONS } = require(path.join(baseDir, 'js/translations.js'));

const dataI18nMatches = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]);
console.log(`\nFound ${dataI18nMatches.length} data-i18n tags in index.html:`);

['it', 'en', 'zh'].forEach(lang => {
  let missing = [];
  dataI18nMatches.forEach(key => {
    const parts = key.split('.');
    let cur = TRANSLATIONS[lang];
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) {
        cur = cur[p];
      } else {
        cur = undefined;
        break;
      }
    }
    if (cur === undefined) {
      missing.push(key);
    }
  });
  if (missing.length > 0) {
    console.error(`[ERROR] Missing keys in language '${lang}':`, missing);
    allOk = false;
  } else {
    console.log(`[OK] All ${dataI18nMatches.length} keys validated for language '${lang}'`);
  }
});

console.log('\nFinal validation status:', allOk ? 'PASS (100% compliant)' : 'FAIL');
