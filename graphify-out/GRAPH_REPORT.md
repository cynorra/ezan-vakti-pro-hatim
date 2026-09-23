# Graph Report - .  (2026-09-23)

## Corpus Check
- 130 files · ~144,504 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 383 nodes · 729 edges · 25 communities (19 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Tab Screens & Theme|Tab Screens & Theme]]
- [[_COMMUNITY_Home, Location & Settings|Home, Location & Settings]]
- [[_COMMUNITY_Dua & Content Localization|Dua & Content Localization]]
- [[_COMMUNITY_Notifications & Streak|Notifications & Streak]]
- [[_COMMUNITY_Prayer Time Calculation|Prayer Time Calculation]]
- [[_COMMUNITY_Daily Feed Generator|Daily Feed Generator]]
- [[_COMMUNITY_Content Translation Script|Content Translation Script]]
- [[_COMMUNITY_Play Store Listing Script|Play Store Listing Script]]
- [[_COMMUNITY_Asma ul-Husna|Asma ul-Husna]]
- [[_COMMUNITY_App Shell & Splash|App Shell & Splash]]
- [[_COMMUNITY_Ads & Tab Layout|Ads & Tab Layout]]
- [[_COMMUNITY_i18n Key Script 1|i18n Key Script 1]]
- [[_COMMUNITY_i18n Key Script 2|i18n Key Script 2]]
- [[_COMMUNITY_Religious Days|Religious Days]]
- [[_COMMUNITY_Quran Juz Data|Quran Juz Data]]
- [[_COMMUNITY_i18n Apply Script|i18n Apply Script]]
- [[_COMMUNITY_i18n Gemini Fill Script|i18n Gemini Fill Script]]
- [[_COMMUNITY_Content Keys Script|Content Keys Script]]
- [[_COMMUNITY_Content Pack Index Script|Content Pack Index Script]]
- [[_COMMUNITY_Quote Fix Script|Quote Fix Script]]
- [[_COMMUNITY_Religious Days Keys Script|Religious Days Keys Script]]
- [[_COMMUNITY_Daily Message Key Script|Daily Message Key Script]]
- [[_COMMUNITY_Location Keys Script|Location Keys Script]]
- [[_COMMUNITY_Permission Keys Script|Permission Keys Script]]
- [[_COMMUNITY_Share App Keys Script|Share App Keys Script]]

## God Nodes (most connected - your core abstractions)
1. `Colors` - 19 edges
2. `BorderRadius` - 19 edges
3. `Spacing` - 18 edges
4. `FontSize` - 18 edges
5. `Shadows` - 17 edges
6. `HomeScreen()` - 11 edges
7. `SEOHead()` - 10 edges
8. `contentPack()` - 10 edges
9. `scheduleAllPrayers()` - 10 edges
10. `Gradients` - 10 edges

## Surprising Connections (you probably didn't know these)
- `HomeScreen()` --calls--> `localizeWisdom()`  [EXTRACTED]
  app/(tabs)/index.tsx → lib/data/daily-content.ts
- `HomeScreen()` --calls--> `getDailyDua()`  [EXTRACTED]
  app/(tabs)/index.tsx → lib/data/duas.ts
- `HomeScreen()` --calls--> `localizeDua()`  [EXTRACTED]
  app/(tabs)/index.tsx → lib/data/duas.ts
- `HomeScreen()` --calls--> `localizeEsma()`  [EXTRACTED]
  app/(tabs)/index.tsx → lib/data/esma.ts
- `CitySelectorProps` --references--> `City`  [EXTRACTED]
  components/CitySelector.tsx → lib/data/cities.ts

## Import Cycles
- 1-file cycle: `lib/analytics.ts -> lib/analytics.ts`

## Communities (25 total, 6 thin omitted)

### Community 0 - "Tab Screens & Theme"
Cohesion: 0.07
Nodes (47): STEP_KEYS, styles, styles, HatimHistoryItem, JuzProgress, styles, defaultKazaData, KazaData (+39 more)

### Community 1 - "Home, Location & Settings"
Cohesion: 0.07
Nodes (46): HomeScreen(), styles, CitySelector(), CitySelectorProps, styles, NextPrayerCountdown(), LANGUAGES, SettingsModal() (+38 more)

### Community 2 - "Dua & Content Localization"
Cohesion: 0.09
Nodes (32): CATEGORY_ICONS, DuaScreen(), styles, ShareableDuaCard, ShareableDuaCardProps, styles, ContentPack, contentPacks (+24 more)

### Community 3 - "Notifications & Streak"
Cohesion: 0.11
Nodes (28): getDailyHealingVerse(), cancelAllNotifications(), cancelPrayerNotifications(), configureNotificationChannel(), EVENING_MESSAGE_KEYS, EZAN_SOUND_TO_FILE, getEnabledPrayerNames(), getPersonalizedEveningMessage() (+20 more)

### Community 4 - "Prayer Time Calculation"
Cohesion: 0.10
Nodes (21): NextPrayerCountdownProps, PrayerTimesCardProps, RamadanCountdown(), RamadanCountdownProps, styles, calculatePrayerTimes(), CalculationMethod, COUNTRY_METHODS (+13 more)

### Community 5 - "Daily Feed Generator"
Cohesion: 0.11
Nodes (23): APP_LANGUAGES, askGemini(), dayOfYear, __dirname, FALLBACK_DUA_REFS, FALLBACK_HADITH_REFS, FALLBACK_MESSAGES, FALLBACK_VERSE_REFS (+15 more)

### Community 6 - "Content Translation Script"
Cohesion: 0.17
Nodes (15): env, failed, KEY, LANGS, MODELS, outDir, prompt(), requested (+7 more)

### Community 7 - "Play Store Listing Script"
Cohesion: 0.15
Nodes (12): csvContent, csvPath, csvRows, __dirname, enData, esData, exactMatchTranslations, __filename (+4 more)

### Community 8 - "Asma ul-Husna"
Cohesion: 0.27
Nodes (6): styles, Esma, esmaulHusna, getRandomEsma(), localizeEsma(), esmaTranslations

### Community 9 - "App Shell & Splash"
Cohesion: 0.22
Nodes (5): AnimatedSplash(), AnimatedSplashProps, styles, { width, height }, resources

### Community 10 - "Ads & Tab Layout"
Cohesion: 0.27
Nodes (5): BannerAd(), BannerAdProps, styles, initializeAds(), withTimeout()

### Community 11 - "i18n Key Script 1"
Cohesion: 0.25
Nodes (6): en, enNew, enPath, tr, trNew, trPath

### Community 12 - "i18n Key Script 2"
Cohesion: 0.25
Nodes (6): en, enNew, enPath, tr, trNew, trPath

### Community 13 - "Religious Days"
Cohesion: 0.29
Nodes (6): ReligiousDaysCard(), getUpcomingReligiousDays(), ReligiousDay, ReligiousDayKey, religiousDays, TURKEY_ONLY_DAYS

### Community 15 - "i18n Apply Script"
Cohesion: 0.33
Nodes (3): allKeys, input, tr

### Community 16 - "i18n Gemini Fill Script"
Cohesion: 0.53
Nodes (5): flatten(), LANG_NAMES, main(), setDeep(), translateBatch()

### Community 17 - "Content Keys Script"
Cohesion: 0.40
Nodes (4): CATEGORY_IDS, dir, LATIN_MONTHS, T

### Community 19 - "Quote Fix Script"
Cohesion: 0.50
Nodes (3): fixedLines, lines, text

### Community 20 - "Religious Days Keys Script"
Cohesion: 0.50
Nodes (3): dir, NAME_KEYS, T

## Knowledge Gaps
- **138 isolated node(s):** `CATEGORY_ICONS`, `styles`, `JuzProgress`, `HatimHistoryItem`, `styles` (+133 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Colors` connect `Tab Screens & Theme` to `Home, Location & Settings`, `Dua & Content Localization`, `Asma ul-Husna`, `App Shell & Splash`, `Ads & Tab Layout`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `BorderRadius` connect `Tab Screens & Theme` to `Home, Location & Settings`, `Dua & Content Localization`, `Prayer Time Calculation`, `Asma ul-Husna`, `Ads & Tab Layout`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `Shadows` connect `Tab Screens & Theme` to `Home, Location & Settings`, `Dua & Content Localization`, `Prayer Time Calculation`, `Asma ul-Husna`, `Ads & Tab Layout`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `CATEGORY_ICONS`, `styles`, `JuzProgress` to the rest of the system?**
  _138 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Tab Screens & Theme` be split into smaller, more focused modules?**
  _Cohesion score 0.06664198445020363 - nodes in this community are weakly interconnected._
- **Should `Home, Location & Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.07127882599580712 - nodes in this community are weakly interconnected._
- **Should `Dua & Content Localization` be split into smaller, more focused modules?**
  _Cohesion score 0.08826945412311266 - nodes in this community are weakly interconnected._