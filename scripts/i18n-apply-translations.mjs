// Kullanım: kullanıcının geri verdiği çeviri JSON'unu i18n-translations-input.json olarak
// scripts/ klasörüne kaydet, sonra: node scripts/i18n-apply-translations.mjs
// Beklenen format: { "uk": { "tabs.kaza": "...", ... }, "bn": { ... }, ... }
import fs from 'fs';
import path from 'path';

const DIR = 'lib/i18n/locales';
const INPUT = 'scripts/i18n-translations-input.json';

function flatten(obj, prefix = '') {
  let out = {};
  for (const k in obj) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(out, flatten(obj[k], key));
    } else {
      out[key] = obj[k];
    }
  }
  return out;
}

function setDeep(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

if (!fs.existsSync(INPUT)) {
  console.error(`Input file not found: ${INPUT}`);
  process.exit(1);
}

const input = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const tr = JSON.parse(fs.readFileSync(path.join(DIR, 'tr.json'), 'utf8'));
const allKeys = Object.keys(flatten(tr));

for (const langCode of Object.keys(input)) {
  const localePath = path.join(DIR, `${langCode}.json`);
  if (!fs.existsSync(localePath)) {
    console.log(`skip unknown locale: ${langCode}`);
    continue;
  }
  const locale = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  const localeFlat = flatten(locale);
  const missingKeys = allKeys.filter((k) => !(k in localeFlat));
  const translations = input[langCode];

  let applied = 0;
  for (const k of missingKeys) {
    if (typeof translations[k] === 'string' && translations[k].length > 0) {
      setDeep(locale, k, translations[k]);
      applied++;
    }
  }
  fs.writeFileSync(localePath, JSON.stringify(locale, null, 2) + '\n');
  console.log(`${langCode}.json: applied ${applied}/${missingKeys.length} missing keys`);
}

console.log('DONE');
