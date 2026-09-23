import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'remote_content_feed';
const FEED_URL = 'https://raw.githubusercontent.com/cynorra/ezan-vakti-pro-hatim/main/public/content-feed.json';

export interface VerifiedVerse {
  surahNumber: number;
  verseNumber: number;
  /** English transliterated surah name from the API, e.g. "Al-Baqara". */
  surahName: string;
  arabic: string;
  /** tr/en/id/ms always; other app languages when alquran.cloud has a translation. */
  translations: { tr: string; en: string; id: string; ms: string } & Record<string, string | undefined>;
}

export interface VerifiedDua extends VerifiedVerse {
  /** Short title per app language (machine-translated). */
  titles: Record<string, string | undefined>;
}

export interface VerifiedHadith {
  collection: 'bukhari' | 'muslim';
  number: number;
  /** Original Arabic including the chain of narration. */
  arabic: string;
  /** Published translations (tr/en/fr/ru/bn) plus machine translations for the rest. */
  translations: Record<string, string | undefined>;
}

// Everything religious in the feed is verified text (see scripts/generate-daily-content.mjs):
// the model only picks references, texts come from alquran.cloud / hadith-api.
export interface RemoteContentFeed {
  version: string;
  updatedAt: string;
  date?: string;
  verifiedVerse?: VerifiedVerse;
  verifiedDua?: VerifiedDua;
  verifiedHadith?: VerifiedHadith;
  /** Short reflection written by the model in Turkish, translated per language. */
  dailyMessage?: Record<string, string | undefined>;
}

export async function syncRemoteContent(): Promise<RemoteContentFeed | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(FEED_URL, {
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data: RemoteContentFeed = await res.json();
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    // Sessizce yerel önbelleğe düşer (offline-friendly)
  }

  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

// The feed is regenerated daily at 00:00 UTC; accept today's or yesterday's so time
// zones ahead of UTC still see it, but never show a stale verse for days.
const MAX_FEED_AGE_MS = 2 * 24 * 60 * 60 * 1000;

/** Today's feed, or null when missing or older than two days. */
export async function getDailyFeed(): Promise<RemoteContentFeed | null> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const feed: RemoteContentFeed = JSON.parse(cached);
    if (!feed?.updatedAt || Date.now() - new Date(feed.updatedAt).getTime() > MAX_FEED_AGE_MS) return null;
    return feed;
  } catch {
    return null;
  }
}

/** Text and a short citation for the verse in the UI language (falls back to English). */
export function localizeVerifiedVerse(verse: VerifiedVerse, language: string): { text: string; source: string } {
  const lang = language.split('-')[0];
  const ref = `${verse.surahNumber}:${verse.verseNumber}`;
  switch (lang) {
    case 'tr':
      return { text: verse.translations.tr, source: `Kur'an-ı Kerim, ${verse.surahName} ${ref}` };
    case 'id':
      return { text: verse.translations.id, source: `QS. ${verse.surahName}: ${verse.verseNumber}` };
    case 'ms':
      return { text: verse.translations.ms, source: `Surah ${verse.surahName}: ${verse.verseNumber}` };
    case 'ar':
      return { text: verse.arabic, source: `${verse.surahName} ${ref}` };
    default:
      return verse.translations[lang]
        ? { text: verse.translations[lang]!, source: `${verse.surahName} ${ref}` }
        : { text: verse.translations.en, source: `Quran ${ref} (${verse.surahName})` };
  }
}

const HADITH_COLLECTION_NAMES: Record<string, Record<VerifiedHadith['collection'], string>> = {
  tr: { bukhari: 'Buhârî', muslim: 'Müslim' },
  ar: { bukhari: 'صحيح البخاري', muslim: 'صحيح مسلم' },
  id: { bukhari: 'HR. Bukhari', muslim: 'HR. Muslim' },
  ms: { bukhari: 'Riwayat Bukhari', muslim: 'Riwayat Muslim' },
};

/** Hadith text in the UI language (Arabic original for Arabic, else English fallback). */
export function localizeVerifiedHadith(hadith: VerifiedHadith, language: string): { text: string; source: string } {
  const lang = language.split('-')[0];
  const names = HADITH_COLLECTION_NAMES[lang] ?? { bukhari: 'Sahih al-Bukhari', muslim: 'Sahih Muslim' };
  const text = lang === 'ar' ? hadith.arabic : hadith.translations[lang] ?? hadith.translations.en ?? '';
  return { text, source: `${names[hadith.collection]}, ${hadith.number}` };
}

export function localizeDailyMessage(message: RemoteContentFeed['dailyMessage'], language: string): string | null {
  if (!message) return null;
  const lang = language.split('-')[0];
  // The Turkish original is not shown to other languages: better no card than the wrong language.
  return message[lang] ?? message.en ?? (lang === 'tr' ? message.tr ?? null : null);
}
