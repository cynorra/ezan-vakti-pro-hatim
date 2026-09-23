// Adds UI strings from a source file ({ "a.b.c": { "tr": "...", "en": "..." } }) to all
// locales: tr/en are written as given, the rest are translated with Gemini in one call
// and validated (every key present, same {{placeholders}}, non-empty).
//
//   node scripts/i18n-translate-ui-keys.mjs scripts/i18n-ui-keys-source.json
import fs from 'node:fs';
import path from 'node:path';

const sourceFile = process.argv[2];
if (!sourceFile) throw new Error('usage: node scripts/i18n-translate-ui-keys.mjs <source.json>');
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
const env = fs.readFileSync('.env', 'utf8');
const KEY = (env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1] ?? '').replace(/["\r\s]/g, '');

const dir = path.resolve('lib/i18n/locales');
const langs = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));
const targets = langs.filter((l) => l !== 'tr' && l !== 'en');
const placeholders = (s) => (s.match(/\{\{\w+\}\}/g) ?? []).sort().join(',');

function setDeep(obj, dotted, value) {
  const parts = dotted.split('.');
  let node = obj;
  for (const p of parts.slice(0, -1)) node = node[p] = typeof node[p] === 'object' && node[p] ? node[p] : {};
  node[parts.at(-1)] = value;
}

function valid(out) {
  return targets.every((l) =>
    Object.entries(source).every(([k, v]) => typeof out?.[l]?.[k] === 'string' && out[l][k].trim() && placeholders(out[l][k]) === placeholders(v.en))
  );
}

async function translate() {
  const english = Object.fromEntries(Object.entries(source).map(([k, v]) => [k, v.en]));
  const prompt = `Translate the UI strings of a Muslim prayer app from English into these languages: ${targets.join(', ')} (ISO 639-1 codes).
Return ONLY JSON: {"<lang>": {"<key>": "<translation>", ...}, ...} with every key for every language.
Keep {{placeholders}}, emoji and ALL-CAPS style exactly. Use established Islamic terminology (e.g. Fajr/Dhuhr/Asr/Maghrib/Isha, dhikr, tasbih, adhan) as Muslims in each language normally say it. Keep strings short like UI labels.
${JSON.stringify(english)}`;
  for (const model of ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest']) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 65536, responseMimeType: 'application/json' },
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
        const out = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
        if (!valid(out)) throw new Error('validation failed');
        console.log(`translated with ${model}`);
        return out;
      } catch (e) {
        console.warn(`${model} attempt ${attempt}: ${e.message}`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }
  throw new Error('translation failed');
}

const translated = await translate();
for (const lang of langs) {
  const file = path.join(dir, `${lang}.json`);
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const [key, value] of Object.entries(source)) {
    setDeep(json, key, lang === 'tr' || lang === 'en' ? value[lang] : translated[lang][key]);
  }
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
}
console.log(`updated ${langs.length} locales with ${Object.keys(source).length} keys`);
