// Translates scripts/content-source-en.json (duas, verse/hadith of the day, healing
// verses, Asma ul-Husna meanings) into lib/data/content-i18n/<lang>.json with Gemini.
// Idempotent: languages that already have a valid file are skipped.
//
//   node scripts/content-translate.mjs            # all missing languages
//   node scripts/content-translate.mjs de fr      # only these
//
// Every output is validated (same keys, 99 names, no empty values, expected script,
// not left in English) before it is written.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const env = fs.readFileSync(path.join(root, '.env'), 'utf8');
const KEY = (env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1] ?? '').replace(/["\r\s]/g, '');
if (!KEY) throw new Error('GEMINI_API_KEY missing in .env');

const source = JSON.parse(fs.readFileSync(path.join(root, 'scripts/content-source-en.json'), 'utf8'));
const outDir = path.join(root, 'lib/data/content-i18n');
fs.mkdirSync(outDir, { recursive: true });

const LANGS = {
  ar: { name: 'Arabic', quran: 'the original Arabic wording of the Quran for Quran quotes', script: /[؀-ۿ]/ },
  fa: { name: 'Persian (Farsi)', quran: 'Fooladvand', script: /[؀-ۿ]/ },
  ur: { name: 'Urdu', quran: 'Fateh Muhammad Jalandhry', script: /[؀-ۿ]/ },
  de: { name: 'German', quran: 'Bubenheim & Elyas', latin: true },
  fr: { name: 'French', quran: 'Muhammad Hamidullah', latin: true },
  es: { name: 'Spanish', quran: 'Julio Cortés', latin: true },
  it: { name: 'Italian', quran: 'Hamza Roberto Piccardo', latin: true },
  ru: { name: 'Russian', quran: 'Elmir Kuliev', script: /[Ѐ-ӿ]/ },
  uk: { name: 'Ukrainian', quran: 'Mykhailo Yakubovych', script: /[Ѐ-ӿ]/ },
  pl: { name: 'Polish', quran: 'Józef Bielawski', latin: true },
  nl: { name: 'Dutch', quran: 'Sofian Siregar', latin: true },
  pt: { name: 'Portuguese (Brazil)', quran: 'Samir El-Hayek', latin: true },
  sv: { name: 'Swedish', quran: 'Knut Bernström', latin: true },
  el: { name: 'Greek', quran: 'a respectful standard Greek rendering', script: /[Ͱ-Ͽ]/ },
  hu: { name: 'Hungarian', quran: 'a respectful standard Hungarian rendering', latin: true },
  bg: { name: 'Bulgarian', quran: 'Tsvetan Teofanov', script: /[Ѐ-ӿ]/ },
  ro: { name: 'Romanian', quran: 'George Grigore', latin: true },
  bs: { name: 'Bosnian (Latin script)', quran: 'Besim Korkut', latin: true },
  az: { name: 'Azerbaijani (Latin script)', quran: 'Vasim Mammadaliyev & Ziya Bunyadov', latin: true },
  uz: { name: 'Uzbek (Latin script)', quran: 'Muhammad Sodik Muhammad Yusuf', latin: true },
  kk: { name: 'Kazakh (Cyrillic script)', quran: 'Khalifa Altay', script: /[Ѐ-ӿ]/ },
  bn: { name: 'Bengali', quran: 'Muhiuddin Khan', script: /[ঀ-৿]/ },
  hi: { name: 'Hindi', quran: 'Suhel Farooq Khan & Saifur Rahman Nadwi', script: /[ऀ-ॿ]/ },
  zh: { name: 'Simplified Chinese', quran: 'Ma Jian', script: /[一-鿿]/ },
  ja: { name: 'Japanese', quran: 'the standard Japanese rendering (Nihon Muslim Kyokai)', script: /[぀-ヿ一-鿿]/ },
  ko: { name: 'Korean', quran: 'Choi Young-kil', script: /[가-힯]/ },
};

const MODELS = ['gemini-3.6-flash', 'gemini-flash-lite-latest'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function prompt(lang) {
  const { name, quran } = LANGS[lang];
  return `You are translating the religious content of a Muslim prayer app from English into ${name}.

Rules:
- Return ONLY a JSON object with exactly the same structure and keys as the input. Translate every string value; never add, remove, merge or reorder keys or array items. "esma" must stay an array of exactly 99 strings in the same order.
- Quran quotes (the "verses" section and verse items in "wisdom"): follow the wording of the well-known ${name} Quran translation by ${quran} as closely as you can. Translate only the part that is quoted; do not complete the verse.
- Hadith and supplications: faithful, reverent and natural ${name}; do not paraphrase loosely or add commentary.
- In "duas" titles, translate "Supplication"/dua with the ${name} word for personal supplication (dua), never with the word for the ritual prayer (salah/namaz).
- "source" values: keep the reference numbers exactly; write collection and surah names in the usual ${name} form (e.g. Bukhari, Muslim, Surah names as commonly written in ${name}).
- Keep "Allah" as the name of God in the form normally used by ${name}-speaking Muslims. Use established Islamic terminology in ${name}.
- Esma meanings are short descriptions of the 99 Names of Allah; keep them concise.
- No explanations, no markdown, no code fences.

Input JSON:
${JSON.stringify(source)}`;
}

function shape(obj) {
  return JSON.stringify({
    duas: Object.fromEntries(Object.entries(obj.duas ?? {}).map(([k, v]) => [k, Object.keys(v ?? {}).sort()])),
    wisdom: Object.fromEntries(Object.entries(obj.wisdom ?? {}).map(([k, v]) => [k, Object.keys(v ?? {}).sort()])),
    verses: Object.fromEntries(Object.entries(obj.verses ?? {}).map(([k, v]) => [k, Object.keys(v ?? {}).sort()])),
    esma: Array.isArray(obj.esma) ? obj.esma.length : -1,
  });
}

function strings(obj) {
  return [
    ...Object.values(obj.duas).flatMap((v) => Object.values(v)),
    ...Object.values(obj.wisdom).flatMap((v) => Object.values(v)),
    ...Object.values(obj.verses).flatMap((v) => Object.values(v)),
    ...obj.esma,
  ];
}

function validate(lang, out) {
  if (shape(out) !== shape(source)) return 'structure differs from source';
  const values = strings(out);
  if (values.some((v) => typeof v !== 'string' || !v.trim())) return 'empty or non-string value';
  // Citations ("Bukhari, 1", "Surah Taha, 20:114") legitimately stay the same in many
  // Latin-script languages, so only the translatable prose is compared with English.
  const prose = (obj) => [
    ...Object.values(obj.duas).flatMap((v) => [v.title, v.meaning]),
    ...Object.values(obj.wisdom).map((v) => v.content),
    ...Object.values(obj.verses).map((v) => v.content),
    ...obj.esma,
  ];
  const srcProse = prose(source);
  const sameAsEnglish = prose(out).filter((v, i) => v === srcProse[i] && v.length > 12).length;
  if (sameAsEnglish > 2) return `${sameAsEnglish} texts left in English`;
  const { script } = LANGS[lang];
  if (script) {
    // Sources such as "Bukhari, 1" may legitimately stay Latin in some languages; meanings may not.
    const meanings = [...Object.values(out.duas).map((d) => d.meaning), ...out.esma];
    const wrongScript = meanings.filter((v) => !script.test(v)).length;
    if (wrongScript > 0) return `${wrongScript} meanings not in the expected script`;
  }
  return null;
}

async function translate(lang) {
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt(lang) }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 65536, responseMimeType: 'application/json' },
          }),
        });
        if (res.status === 429) {
          console.warn(`  ${lang}: ${model} quota exhausted`);
          break; // next model
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 160)}`);
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
        const out = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
        const problem = validate(lang, out);
        if (problem) throw new Error(`validation: ${problem}`);
        return { out, model };
      } catch (e) {
        console.warn(`  ${lang}: ${model} attempt ${attempt} failed: ${e.message}`);
        await sleep(3000);
      }
    }
  }
  return null;
}

const requested = process.argv.slice(2);
const langs = requested.length ? requested : Object.keys(LANGS);
const failed = [];
for (const lang of langs) {
  if (!LANGS[lang]) throw new Error(`Unknown language ${lang}`);
  const file = path.join(outDir, `${lang}.json`);
  if (fs.existsSync(file) && !requested.length) {
    const existing = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!validate(lang, existing)) {
      console.log(`${lang}: already done`);
      continue;
    }
  }
  console.log(`${lang}: translating...`);
  const result = await translate(lang);
  if (!result) {
    failed.push(lang);
    continue;
  }
  fs.writeFileSync(file, JSON.stringify(result.out, null, 2) + '\n');
  console.log(`${lang}: ok (${result.model})`);
}
console.log(failed.length ? `FAILED: ${failed.join(' ')}` : 'All languages done.');
