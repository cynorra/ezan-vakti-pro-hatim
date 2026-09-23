import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'remote_content_feed';
const FEED_URL = 'https://raw.githubusercontent.com/cynorra/ezan-vakti-pro-hatim/main/public/content-feed.json';

export interface VerifiedVerse {
  surahNumber: number;
  verseNumber: number;
  /** English transliterated surah name from the API, e.g. "Al-Baqara". */
  surahName: string;
  arabic: string;
  translations: { tr: string; en: string; id: string; ms: string };
}

// Only `verifiedVerse` is displayed: its text comes from api.alquran.cloud, not from
// the model (see scripts/generate-daily-content.mjs). The AI-written dua/hadith
// fields in the feed are ignored on purpose because they cannot be verified.
export interface RemoteContentFeed {
  version: string;
  updatedAt: string;
  date?: string;
  verifiedVerse?: VerifiedVerse;
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

export async function getVerifiedDailyVerse(): Promise<VerifiedVerse | null> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const feed: RemoteContentFeed = JSON.parse(cached);
    const verse = feed.verifiedVerse;
    if (!verse?.arabic || !verse.translations?.tr) return null;
    if (Date.now() - new Date(feed.updatedAt).getTime() > MAX_FEED_AGE_MS) return null;
    return verse;
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
    default:
      return { text: verse.translations.en, source: `Quran ${ref} (${verse.surahName})` };
  }
}
