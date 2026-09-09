You are a professional mobile-app localization translator.

## Task

Translate the English UI strings in the JSON object below (a mobile Islamic prayer-times / Quran-khatm-tracking app called "Ezan Vakti + Hatim" — these are NEW strings for a Ramadan countdown, a zakat calculator, a wudu guide, and a nearby-mosques feature) into these 25 languages, identified by their ISO codes:

fr = French, es = Spanish, it = Italian, ko = Korean, ja = Japanese, zh = Simplified Chinese, hi = Hindi, nl = Dutch, pt = Portuguese, pl = Polish, sv = Swedish, uk = Ukrainian, bn = Bengali, ur = Urdu, id = Indonesian, el = Greek, fa = Persian (Farsi), hu = Hungarian, bg = Bulgarian, ro = Romanian, ms = Malay, uz = Uzbek, kk = Kazakh, az = Azerbaijani, bs = Bosnian

## Rules

- Preserve every `{{placeholder}}` token exactly as-is (none in this batch, but check anyway).
- Preserve every emoji exactly as-is.
- Preserve `\n` line breaks exactly as-is.
- Use standard Islamic terminology for each language where a convention exists (Ramadan/Iftar/Suhoor, Zakat, Wudu/ablution, mosque).
- Keep the tone friendly, concise, and natural for mobile app UI — not literal word-for-word.
- Keep the exact same JSON key names in your output — only the values change.
- **IMPORTANT — a previous batch had JSON corruption from quote characters inside translated text breaking the JSON string.** None of this batch's values contain nested quotes except `abdest.step1` which has `\"Bismillah\"` — when translating that value, keep it as a properly-escaped JSON string (use `\"` for the inner quotes, exactly like the source does), never a raw unescaped `"` in the middle of the string value.
- Do not add, remove, or reorder keys. Do not add commentary, markdown fences, or explanations — output must be raw, valid JSON only.

## Output format

Return a single JSON object where each top-level key is one of the 25 language codes above, and its value is a JSON object with the exact same keys as the input below, translated into that language:

```json
{
  "fr": { "ramadan.badge": "...", "zekat.title": "...", ... all keys ... },
  "es": { ... },
  "it": { ... },
  "ko": { ... },
  "ja": { ... },
  "zh": { ... },
  "hi": { ... },
  "nl": { ... },
  "pt": { ... },
  "pl": { ... },
  "sv": { ... },
  "uk": { ... },
  "bn": { ... },
  "ur": { ... },
  "id": { ... },
  "el": { ... },
  "fa": { ... },
  "hu": { ... },
  "bg": { ... },
  "ro": { ... },
  "ms": { ... },
  "uz": { ... },
  "kk": { ... },
  "az": { ... },
  "bs": { ... }
}
```

## Input JSON (English source, translate every key into all 25 languages above)

```json
{
  "ramadan.badge": "RAMADAN",
  "ramadan.untilIftar": "Time Until Iftar",
  "ramadan.untilSahur": "Time Until Suhoor",
  "ramadan.hours": "Hours",
  "ramadan.minutes": "Min",
  "ramadan.seconds": "Sec",
  "zekat.title": "ZAKAT CALCULATOR",
  "zekat.amountDue": "Zakat Due",
  "zekat.wealthBase": "Zakatable Wealth",
  "zekat.nisabInfo": "Zakat is due at 2.5% on wealth that reaches the nisab threshold (roughly the value of 85g of gold) and has been held for a full lunar year. Debts are subtracted from total wealth.",
  "zekat.cash": "Cash / Bank",
  "zekat.gold": "Gold",
  "zekat.silver": "Silver",
  "zekat.trade": "Trade Goods",
  "zekat.debt": "Debts",
  "abdest.title": "How to Perform Wudu",
  "abdest.subtitle": "A step-by-step guide with its obligatory and recommended acts",
  "abdest.step1": "Make the intention and begin by saying \"Bismillah\".",
  "abdest.step2": "Wash both hands up to the wrists three times, rubbing between the fingers.",
  "abdest.step3": "Rinse the mouth with water three times (madmada).",
  "abdest.step4": "Sniff water into the nose and clean it three times (istinshaq).",
  "abdest.step5": "Wash the face three times, from the hairline to the chin and ear to ear.",
  "abdest.step6": "Wash the right then the left arm, including the elbows, three times each.",
  "abdest.step7": "Wipe a quarter of the head, then wipe the ears and the back of the neck.",
  "abdest.step8": "Wash the right then the left foot, including the ankles, three times each.",
  "abdest.note": "Wudu is invalidated by things like using the toilet, sleeping, or bleeding, and must be renewed. This guide is for general information; minor differences may exist between schools of thought.",
  "mosques.title": "Nearby Mosques",
  "mosques.locationDenied": "Location permission is needed to show nearby mosques.",
  "mosques.loadError": "Something went wrong loading mosques. Please try again.",
  "mosques.loading": "Searching for nearby mosques...",
  "mosques.retry": "RETRY",
  "mosques.empty": "No registered mosques found nearby.",
  "quickAccess.mosques": "Nearby Mosques",
  "quickAccess.zekat": "Zakat Calculator",
  "quickAccess.abdest": "Wudu Guide"
}
```

Now translate the input JSON above into all 25 languages and return the combined JSON object described in "Output format". Output raw JSON only, nothing else.
