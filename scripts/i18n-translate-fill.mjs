import fs from 'fs';
import path from 'path';

const DIR = 'lib/i18n/locales';
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY not set');
  process.exit(1);
}

const LANG_NAMES = {
  ar: 'Arabic', ru: 'Russian', de: 'German', fr: 'French', es: 'Spanish', it: 'Italian',
  ko: 'Korean', ja: 'Japanese', zh: 'Simplified Chinese', hi: 'Hindi',
  nl: 'Dutch', pt: 'Portuguese', pl: 'Polish', sv: 'Swedish', uk: 'Ukrainian',
  bn: 'Bengali', ur: 'Urdu', id: 'Indonesian', el: 'Greek', fa: 'Persian (Farsi)',
  hu: 'Hungarian', bg: 'Bulgarian', ro: 'Romanian', ms: 'Malay', uz: 'Uzbek',
  kk: 'Kazakh', az: 'Azerbaijani', bs: 'Bosnian',
};

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

async function translateBatch(langName, keysToTranslate, retries = 3) {
  const prompt = `Translate the following UI strings for a mobile Islamic prayer-times / Quran-khatm-tracking app from English to ${langName}.
Return ONLY a valid JSON object with the exact same keys, values replaced by natural, concise ${langName} translations suitable for mobile UI (buttons, labels, notifications, share messages).
Rules:
- Preserve every {{placeholder}} token exactly as-is (do not translate or rename them).
- Preserve emoji exactly as-is.
- Preserve \\n line breaks.
- Use standard Islamic terminology conventions for ${langName} if the language has them (e.g. for prayer names, Quran, dua).
- Keep the same tone (friendly, concise, mobile app UI).
- Do not add extra keys or commentary. Output raw JSON only, no markdown fences.

Input JSON:
${JSON.stringify(keysToTranslate, null, 2)}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
          }),
        }
      );
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response: ' + JSON.stringify(data).slice(0, 500));
      return JSON.parse(text);
    } catch (err) {
      console.log(`  attempt ${attempt} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

async function main() {
  const en = JSON.parse(fs.readFileSync(path.join(DIR, 'en.json'), 'utf8'));
  const tr = JSON.parse(fs.readFileSync(path.join(DIR, 'tr.json'), 'utf8'));
  const enFlat = flatten(en);
  const trFlatAll = flatten(tr);
  const allKeys = Object.keys(trFlatAll);

  const files = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.json') && f !== 'tr.json' && f !== 'en.json');

  for (const file of files) {
    const langCode = file.replace('.json', '');
    const langName = LANG_NAMES[langCode];
    if (!langName) {
      console.log(`skip unknown lang code: ${langCode}`);
      continue;
    }

    const localePath = path.join(DIR, file);
    const locale = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    const localeFlat = flatten(locale);

    const missingKeys = allKeys.filter((k) => !(k in localeFlat));
    if (missingKeys.length === 0) {
      console.log(`${file}: already complete`);
      continue;
    }

    const toTranslate = {};
    for (const k of missingKeys) toTranslate[k] = enFlat[k] ?? trFlatAll[k];

    console.log(`${file}: translating ${missingKeys.length} keys into ${langName}...`);
    const translated = await translateBatch(langName, toTranslate);
    await new Promise((r) => setTimeout(r, 4000)); // free-tier rate limit: ~20 req/min

    let applied = 0;
    for (const k of missingKeys) {
      const val = translated[k];
      if (typeof val === 'string' && val.length > 0) {
        setDeep(locale, k, val);
        applied++;
      } else {
        console.log(`  WARNING: missing translation for key "${k}" in ${file}, leaving unset`);
      }
    }
    fs.writeFileSync(localePath, JSON.stringify(locale, null, 2) + '\n');
    console.log(`  -> ${file} saved (${applied}/${missingKeys.length} applied)`);
  }

  console.log('ALL DONE');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
