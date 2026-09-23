// Builds Play Console release notes for every store language from an English and a
// Turkish source (translated with Gemini, checked against Play's 500-character limit).
//
//   node scripts/release-notes-translate.mjs docs/release-notes/1.0.9.txt docs/release-notes/1.0.9-play-console.txt
import fs from 'node:fs';

const [sourceFile, outFile] = process.argv.slice(2);
if (!sourceFile || !outFile) throw new Error('usage: node scripts/release-notes-translate.mjs <source> <out>');
const source = fs.readFileSync(sourceFile, 'utf8').replace(/\r\n/g, '\n');
const block = (tag) => source.match(new RegExp(`<${tag}>\\n([\\s\\S]*?)\\n</${tag}>`))?.[1]?.trim();
const english = block('en-US');
const turkish = block('tr-TR');
if (!english || !turkish) throw new Error('source needs <en-US> and <tr-TR> blocks');

const env = fs.readFileSync('.env', 'utf8');
const KEY = (env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1] ?? '').replace(/["\r\s]/g, '');

// Play Console language tags, in the order the console lists them.
const TAGS = ['en-US', 'af', 'am', 'ar', 'az-AZ', 'be', 'bg', 'bn-BD', 'ca', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR',
  'en-AU', 'en-CA', 'en-GB', 'en-IN', 'en-SG', 'en-ZA', 'es-419', 'es-ES', 'es-US', 'et', 'eu-ES', 'fa', 'fa-AE',
  'fa-AF', 'fa-IR', 'fi-FI', 'fil', 'fr-CA', 'fr-FR', 'gl-ES', 'gu', 'hi-IN', 'hr', 'hu-HU', 'hy-AM', 'id', 'is-IS',
  'it-IT', 'iw-IL', 'ja-JP', 'ka-GE', 'kk', 'km-KH', 'kn-IN', 'ko-KR', 'ky-KG', 'lo-LA', 'lt', 'lv', 'mk-MK', 'ml-IN',
  'mn-MN', 'mr-IN', 'ms', 'ms-MY', 'my-MM', 'ne-NP', 'nl-NL', 'no-NO', 'pa', 'pl-PL', 'pt-BR', 'pt-PT', 'rm', 'ro',
  'ru-RU', 'si-LK', 'sk', 'sl', 'sq', 'sr', 'sv-SE', 'sw', 'ta-IN', 'te-IN', 'th', 'tr-TR', 'uk', 'ur', 'vi', 'zh-CN',
  'zh-HK', 'zh-TW', 'zu'];

// Tag -> translation key. Variants of one language share a translation.
const LANGUAGE_OF = (tag) => {
  if (tag.startsWith('en-')) return 'en';
  if (tag.startsWith('es-')) return 'es';
  if (tag.startsWith('fa')) return 'fa';
  if (tag.startsWith('ms')) return 'ms';
  if (tag === 'zh-HK' || tag === 'zh-TW') return 'zh-Hant';
  if (tag === 'zh-CN') return 'zh-Hans';
  if (tag === 'pt-BR') return 'pt-BR';
  if (tag === 'pt-PT') return 'pt-PT';
  if (tag === 'fr-CA' || tag === 'fr-FR') return 'fr';
  if (tag === 'iw-IL') return 'he';
  if (tag === 'sr') return 'sr-Cyrl';
  return tag.split('-')[0];
};

// Any other block in the source (e.g. <id>, <ms>, <fr>) is a hand-written override
// keyed by translation key and is used as-is instead of a machine translation.
const overrides = Object.fromEntries(
  [...source.matchAll(/<([A-Za-z-]+)>\n([\s\S]*?)\n<\/\1>/g)]
    .filter(([, tag]) => tag !== 'en-US' && tag !== 'tr-TR')
    .map(([, tag, text]) => [LANGUAGE_OF(tag), text.trim()])
);
const needed = [...new Set(TAGS.map(LANGUAGE_OF))].filter((l) => l !== 'en' && l !== 'tr' && !overrides[l]);
const LIMIT = 500;

const BULLETS = english.split('\n').length;
const isValid = (text) =>
  typeof text === 'string' && text.trim() && [...text.trim()].length <= LIMIT && text.trim().split('\n').length === BULLETS;

// Keeps every valid translation and retries only the failing languages, asking for
// shorter text since verbose languages tend to exceed Play's limit.
async function translate(languages) {
  const done = {};
  let pending = [...languages];
  let round = 0;
  for (const model of ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest']) {
    for (let attempt = 1; attempt <= 3 && pending.length; attempt++, round++) {
      const target = round === 0 ? LIMIT : 420;
      const prompt = `Translate these Google Play release notes of a Muslim prayer-times app from English into each language below (BCP-47 codes; "zh-Hant" = Traditional Chinese, "zh-Hans" = Simplified Chinese, "sr-Cyrl" = Serbian Cyrillic, "he" = Hebrew).
Return ONLY JSON: {"<code>": "<translated notes>", ...} for exactly these codes: ${pending.join(', ')}.
Exactly ${BULLETS} lines, each starting with "• ", one per English line, no blank lines. Keep proper names as they are (Diyanet, Kemenag, JAKIM, Umm al-Qura, ISNA, Hatim). Use established Islamic terms in each language. Each translation MUST be at most ${target} characters in total; shorten wording if needed.

${english}`;
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
        for (const l of pending) if (isValid(out[l])) done[l] = out[l].trim();
        pending = pending.filter((l) => !done[l]);
        console.log(`${model}: ${languages.length - pending.length}/${languages.length} ok${pending.length ? `, retrying ${pending.join(' ')}` : ''}`);
      } catch (e) {
        console.warn(`${model} attempt ${attempt}: ${e.message}`);
        await new Promise((r) => setTimeout(r, 3000));
        if (/HTTP (429|503)/.test(e.message)) break; // model unavailable: next model
      }
    }
  }
  if (pending.length) console.warn(`not translated this run: ${pending.join(' ')}`);
  return done;
}

// Successful translations are cached next to the output so a rerun (Gemini is often
// busy) only asks for the languages that are still missing.
const cacheFile = `${outFile}.cache.json`;
const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {};
const saveCache = () => fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));

// Two halves keep each response well inside the output limit.
const missing = needed.filter((l) => !cache[l]);
const half = Math.ceil(missing.length / 2);
for (const part of [missing.slice(0, half), missing.slice(half)]) {
  if (!part.length) continue;
  try {
    Object.assign(cache, await translate(part));
  } finally {
    saveCache();
  }
}
const translations = {
  ...cache,
  ...overrides,
  en: english,
  tr: turkish,
};

const stillMissing = needed.filter((l) => !cache[l]);
if (stillMissing.length) throw new Error(`missing translations (rerun to retry): ${stillMissing.join(" ")}`);

const output = TAGS.map((tag) => {
  const text = (translations[LANGUAGE_OF(tag)] ?? english).trim();
  if ([...text].length > LIMIT) throw new Error(`${tag} over ${LIMIT} characters`);
  return `<${tag}>\n${text}\n</${tag}>`;
}).join('\n');
fs.writeFileSync(outFile, output + '\n');
console.log(`wrote ${TAGS.length} languages to ${outFile}`);
