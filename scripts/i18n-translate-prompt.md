You are a professional mobile-app localization translator.

## Task

Translate the English UI strings in the JSON object below (a mobile Islamic prayer-times / Quran-khatm-tracking app called "Ezan Vakti + Hatim") into these 14 languages, identified by their ISO codes:

- uk = Ukrainian
- bn = Bengali
- ur = Urdu
- id = Indonesian
- el = Greek
- fa = Persian (Farsi)
- hu = Hungarian
- bg = Bulgarian
- ro = Romanian
- ms = Malay
- uz = Uzbek
- kk = Kazakh
- az = Azerbaijani
- bs = Bosnian

## Rules

- Preserve every `{{placeholder}}` token exactly as-is — do not translate, rename, or remove them (e.g. `{{title}}`, `{{count}}`, `{{playStore}}`).
- Preserve every emoji exactly as-is, in the same position.
- Preserve `\n` line breaks exactly as-is.
- Use standard Islamic terminology for each language where a convention exists (e.g. for "khatm"/hatim, "juz", "dua", prayer names like Fajr/Dhuhr/Asr/Maghrib/Isha).
- Keep the tone friendly, concise, and natural for mobile app UI (buttons, labels, notifications, share messages) — not a literal word-for-word translation.
- Keep the exact same JSON key names in your output — only the values change.
- Do not add, remove, or reorder keys. Do not add commentary, markdown fences, or explanations — output must be raw, valid JSON only.

## Output format

Return a single JSON object where each top-level key is one of the 14 language codes above, and its value is a JSON object with the exact same keys as the input below, translated into that language:

```json
{
  "uk": { "tabs.kaza": "...", "esma.title": "...", ... all keys ... },
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

## Input JSON (English source, translate every key into all 14 languages above)

```json
{
  "tabs.kaza": "Qada",
  "esma.title": "Names of Allah",
  "esma.search": "Search name or meaning...",
  "kaza.title": "MISSED PRAYERS",
  "kaza.subtitle": "Track your missed prayers",
  "kaza.sabah": "Fajr",
  "kaza.ogle": "Dhuhr",
  "kaza.ikindi": "Asr",
  "kaza.aksam": "Maghrib",
  "kaza.yatsi": "Isha",
  "kaza.vitir": "Witr",
  "kaza.completionShareMessage": "🎉 I completed all my missed prayers, Alhamdulillah! 🕌\n\nTrack your missed prayers with Ezan Vakti + Hatim: {{playStore}}",
  "home.duaOfTheDay": "Dua of the Day",
  "hatim.enterNameAlert": "Please enter your name.",
  "hatim.enterTitleAlert": "Please enter a title.",
  "hatim.topHatimBadge": "MOST ACTIVE KHATM",
  "hatim.leaderboardTitle": "TOP CONTRIBUTORS",
  "hatim.unnamedParticipant": "Anonymous",
  "hatim.inviteShareMessage": "Join the \"{{title}}\" collaborative khatm, take a juz, let's read the Quran together 🕌📖\n\nIf you already have the app: {{deepLink}}\n\nIf not: {{playStore}}",
  "hatim.completionShareMessage": "🎉 I completed all 30 juz, finished my khatm! Alhamdulillah 📖🕌\n\nThis is my khatm #{{count}}. Start tracking yours too: {{playStore}}",
  "hatim.progressShareMessage": "📖 I completed {{completed}}/30 juz this week ({{percentage}}%).\n\nTrack yours with Ezan Vakti + Hatim: {{playStore}}",
  "hatim.rewardUnlocked": "🎁 Awesome! Thanks to your shares, you unlocked {{days}} ad-free days.",
  "hatim.rewardBannerText": "Share {{count}} more time(s) to unlock {{days}} ad-free days 🎁",
  "hatim.juzCountShort": "juz",
  "settings.sound": "Adhan Sound",
  "settings.reminder": "Pre-Prayer Reminder",
  "settings.theme": "Theme",
  "settings.themeLight": "Light",
  "settings.themeDark": "Dark",
  "settings.support": "Support & Info",
  "settings.rateApp": "Rate App",
  "settings.feedback": "Send Feedback",
  "settings.about": "About",
  "settings.widgetPreview": "WIDGET PREVIEW",
  "settings.widgetNext": "Next",
  "settings.widgetHint": "Press and hold on your home screen to add the widget.",
  "qibla.title": "QIBLA COMPASS",
  "qibla.subtitle": "Qibla Direction Finder",
  "qibla.yourDirection": "YOUR DIRECTION",
  "qibla.qiblaAngle": "QIBLA ANGLE",
  "qibla.aligned": "ALIGNED TO QIBLA",
  "qibla.hint": "Keep your device flat and follow the needle.",
  "common.errorGeneric": "Something went wrong.",
  "dua.headerTitle": "DUA LIBRARY",
  "dua.headerSubtitle": "Prayer Is the Weapon of the Believer",
  "dua.featuredBadge": "DUA OF THE DAY",
  "dua.meaningLabel": "MEANING",
  "dua.shareMessage": "{{title}}\n\n{{transliteration}}\n\nMeaning: {{meaning}}\n\nSource: {{source}}\n\nShared from Ezan Vakti + Hatim.",
  "splash.subtitle": "Prayer times, khatm and dua together",
  "notifications.dailyDuaTitle": "🤲 Dua of the Day",
  "notifications.dailyDuaBody": "{{title}} — tap to read",
  "notifications.eveningTitle": "Ezan Vakti + Hatim",
  "notifications.eveningMsg1": "Don't forget to add a verse to your khatm today 📖",
  "notifications.eveningMsg2": "As evening approaches, ease your heart with a dua 🤲",
  "notifications.eveningMsg3": "Got a few minutes for your missed prayers? 🕌",
  "notifications.eveningMsg4": "Did you do your dhikr today? Remembrance brings peace to the heart ✨",
  "notifications.noJuzThisWeek": "You haven't marked a juz this week yet, why not start with one? 📖",
  "notifications.kazaDebtReminder": "You have {{count}} missed prayers waiting, you could catch up on a few tonight 🕌",
  "notifications.streakReminder": "Your {{streak}}-day streak is going, keep it up today too 🔥",
  "notifications.prayerTitle": "{{prayer}} Time",
  "notifications.prayerBody": "It's {{prayer}} time for {{city}}."
}
```

Now translate the input JSON above into all 14 languages and return the combined JSON object described in "Output format". Output raw JSON only, nothing else.
