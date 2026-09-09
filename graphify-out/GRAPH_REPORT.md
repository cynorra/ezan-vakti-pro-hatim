# Graph Report - .  (2026-09-09)

## Corpus Check
- 222 files · ~434,843 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 404 nodes · 545 edges · 41 communities (35 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Esma'ul Husna & Dualar Ekranlari|Esma'ul Husna & Dualar Ekranlari]]
- [[_COMMUNITY_Package Dependencies (ExpoRN)|Package Dependencies (Expo/RN)]]
- [[_COMMUNITY_Ana Ekran & Sehir Secici|Ana Ekran & Sehir Secici]]
- [[_COMMUNITY_app.json Yapilandirmasi & Ikonlar|app.json Yapilandirmasi & Ikonlar]]
- [[_COMMUNITY_CMake Build Artefaktlari (Debug)|CMake Build Artefaktlari (Debug)]]
- [[_COMMUNITY_CMake Build Artefaktlari (RelWithDebInfo)|CMake Build Artefaktlari (RelWithDebInfo)]]
- [[_COMMUNITY_UI Component Registry (components.json)|UI Component Registry (components.json)]]
- [[_COMMUNITY_Android Widget Modulu (Kotlin)|Android Widget Modulu (Kotlin)]]
- [[_COMMUNITY_Namaz Vakti Hesaplama Motoru|Namaz Vakti Hesaplama Motoru]]
- [[_COMMUNITY_PWA Manifest|PWA Manifest]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_MainActivity (RN Native Entry)|MainActivity (RN Native Entry)]]
- [[_COMMUNITY_Tab Layout & BannerAd Bileseni|Tab Layout & BannerAd Bileseni]]
- [[_COMMUNITY_UrunPazarlama Dokumanlari|Urun/Pazarlama Dokumanlari]]
- [[_COMMUNITY_MainApplication (RN Native Entry)|MainApplication (RN Native Entry)]]
- [[_COMMUNITY_Android Widget Provider (Java)|Android Widget Provider (Java)]]
- [[_COMMUNITY_Dua Verileri|Dua Verileri]]
- [[_COMMUNITY_HatimJuz Verileri|Hatim/Juz Verileri]]
- [[_COMMUNITY_Root Layout & i18n Init|Root Layout & i18n Init]]
- [[_COMMUNITY_Metro Config|Metro Config]]
- [[_COMMUNITY_Next.js Config (kullanilmiyor)|Next.js Config (kullanilmiyor)]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_README|README]]

## God Nodes (most connected - your core abstractions)
1. `Colors` - 16 edges
2. `expo` - 15 edges
3. `BorderRadius` - 15 edges
4. `Spacing` - 14 edges
5. `FontSize` - 14 edges
6. `Shadows` - 13 edges
7. `Gradients` - 8 edges
8. `calculatePrayerTimes()` - 8 edges
9. `SEOHead()` - 7 edges
10. `logEvent()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `NextPrayerCountdownProps` --references--> `PrayerTimes`  [EXTRACTED]
  components/NextPrayerCountdown.tsx → lib/prayer-times.ts
- `PrayerTimesCardProps` --references--> `PrayerTimes`  [EXTRACTED]
  components/PrayerTimesCard.tsx → lib/prayer-times.ts
- `HomeScreen()` --calls--> `getDailyWisdom()`  [EXTRACTED]
  app/(tabs)/index.tsx → lib/data/daily-content.ts
- `CitySelectorProps` --references--> `City`  [EXTRACTED]
  components/CitySelector.tsx → lib/data/cities.ts
- `PrayerTimesCard()` --calls--> `getNextPrayer()`  [EXTRACTED]
  components/PrayerTimesCard.tsx → lib/prayer-times.ts

## Import Cycles
- 1-file cycle: `lib/analytics.ts -> lib/analytics.ts`
- 1-file cycle: `metro.config.js -> metro.config.js`

## Communities (41 total, 6 thin omitted)

### Community 0 - "Esma'ul Husna & Dualar Ekranlari"
Cohesion: 0.07
Nodes (47): styles, CATEGORIES, Dua, DUALAR, styles, HatimHistoryItem, JuzProgress, styles (+39 more)

### Community 1 - "Package Dependencies (Expo/RN)"
Cohesion: 0.04
Nodes (48): dependencies, babel-preset-expo, date-fns, expo, expo-constants, expo-font, expo-haptics, expo-linear-gradient (+40 more)

### Community 2 - "Ana Ekran & Sehir Secici"
Cohesion: 0.09
Nodes (26): HomeScreen(), styles, CitySelector(), CitySelectorProps, styles, CHECKLIST_ITEMS, ChecklistItem, DailyChecklist() (+18 more)

### Community 3 - "app.json Yapilandirmasi & Ikonlar"
Cohesion: 0.06
Nodes (32): backgroundColor, foregroundImage, adaptiveIcon, googleServicesFile, package, permissions, versionCode, expo (+24 more)

### Community 4 - "CMake Build Artefaktlari (Debug)"
Cohesion: 0.09
Nodes (22): artifacts, backtrace, backtraceGraph, commands, files, nodes, compileGroups, dependencies (+14 more)

### Community 5 - "CMake Build Artefaktlari (RelWithDebInfo)"
Cohesion: 0.09
Nodes (22): artifacts, backtrace, backtraceGraph, commands, files, nodes, compileGroups, dependencies (+14 more)

### Community 6 - "UI Component Registry (components.json)"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 7 - "Android Widget Modulu (Kotlin)"
Cohesion: 0.16
Nodes (9): String, WidgetModule, WidgetPackage, List, NativeModule, ReactApplicationContext, ReactContextBaseJavaModule, ReactPackage (+1 more)

### Community 8 - "Namaz Vakti Hesaplama Motoru"
Cohesion: 0.27
Nodes (11): PrayerTimesCard(), calculateHourAngle(), calculatePrayerTimes(), calculateSunPosition(), formatTime(), getDayOfYear(), getNextPrayer(), prayerNames (+3 more)

### Community 9 - "PWA Manifest"
Cohesion: 0.17
Nodes (11): background_color, categories, description, display, icons, lang, name, orientation (+3 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.18
Nodes (10): compilerOptions, jsx, module, moduleResolution, paths, strict, target, extends (+2 more)

### Community 11 - "MainActivity (RN Native Entry)"
Cohesion: 0.20
Nodes (5): String, MainActivity, Bundle, ReactActivity, ReactActivityDelegate

### Community 12 - "Tab Layout & BannerAd Bileseni"
Cohesion: 0.27
Nodes (5): BannerAd(), BannerAdProps, styles, initializeAds(), withTimeout()

### Community 13 - "Urun/Pazarlama Dokumanlari"
Cohesion: 0.22
Nodes (9): ASO/SEO Guide, Gizlilik Politikası, Dualar, Ezan Vakti / Namaz Vakitleri, Kıble Pusulası, Ortak Hatim Platformu, Zikirmatik / Tesbihmatik, Expo Push Notifications (+1 more)

### Community 14 - "MainApplication (RN Native Entry)"
Cohesion: 0.25
Nodes (5): MainApplication, Application, Configuration, ReactApplication, ReactHost

### Community 15 - "Android Widget Provider (Java)"
Cohesion: 0.46
Nodes (5): PrayerWidgetProvider, AppWidgetManager, AppWidgetProvider, Context, Override

### Community 16 - "Dua Verileri"
Cohesion: 0.33
Nodes (3): dailyDuas, Dua, duaCategories

## Knowledge Gaps
- **185 isolated node(s):** `artifacts`, `backtrace`, `commands`, `files`, `nodes` (+180 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Colors` connect `Esma'ul Husna & Dualar Ekranlari` to `Root Layout & i18n Init`, `Ana Ekran & Sehir Secici`, `Tab Layout & BannerAd Bileseni`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `BorderRadius` connect `Esma'ul Husna & Dualar Ekranlari` to `Ana Ekran & Sehir Secici`, `Tab Layout & BannerAd Bileseni`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `artifacts`, `backtrace`, `commands` to the rest of the system?**
  _185 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Esma'ul Husna & Dualar Ekranlari` be split into smaller, more focused modules?**
  _Cohesion score 0.06680080482897384 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies (Expo/RN)` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `Ana Ekran & Sehir Secici` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._
- **Should `app.json Yapilandirmasi & Ikonlar` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._