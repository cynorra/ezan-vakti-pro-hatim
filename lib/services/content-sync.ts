import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDailyDua, Dua } from '@/lib/data/duas';
import { getDailyHealingVerse, QuranVerse } from '@/lib/data/quran-verses';

const CACHE_KEY = 'remote_content_feed';
const FEED_URL = 'https://raw.githubusercontent.com/cynorra/ezan-vakti-pro-hatim/main/public/content-feed.json';

export interface RemoteContentFeed {
  version: string;
  updatedAt: string;
  featuredDua?: {
    title: string;
    arabic: string;
    turkish: string;
    transliteration?: string;
    source?: string;
  };
  featuredVerse?: {
    arabic: string;
    turkish: string;
    source: string;
  };
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

export async function getDynamicDailyDua(date = new Date()): Promise<Dua> {
  const localDua = getDailyDua(date);
  return localDua;
}

export async function getDynamicDailyVerse(date = new Date()): Promise<QuranVerse> {
  const localVerse = getDailyHealingVerse(date);
  return localVerse;
}
