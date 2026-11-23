import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Full Quran (114 surahs, 6236 ayahs), bundled offline.
 * Arabic: Uthmani text from the Tanzil Project (tanzil.net), text unmodified apart from
 *         moving the basmala out of each surah's first ayah.
 * Turkish: Elmalılı Muhammed Hamdi Yazır meal (public domain).
 */
export type Ayah = [arabic: string, turkish: string, juz: number, page: number];

export interface Surah {
  n: number;
  ar: string;
  en: string;
  tr: string;
  /** 'M' = Meccan, 'D' = Medinan */
  t: 'M' | 'D';
  v: Ayah[];
}

interface QuranFile {
  basmala: string;
  surahs: Surah[];
}

let cache: QuranFile | null = null;

/** Parsed lazily so the 2 MB JSON is only loaded when the reader is opened. */
export function getQuran(): QuranFile {
  if (!cache) cache = require('@/lib/data/quran/quran.json') as QuranFile;
  return cache;
}

export function getSurah(n: number): Surah | undefined {
  return getQuran().surahs[n - 1];
}

/** First surah/ayah of each of the 30 juz, derived from the data itself. */
export function getJuzStarts(): { juz: number; surah: number; ayah: number }[] {
  const starts: { juz: number; surah: number; ayah: number }[] = [];
  const seen = new Set<number>();
  for (const s of getQuran().surahs) {
    s.v.forEach((a, i) => {
      if (!seen.has(a[2])) {
        seen.add(a[2]);
        starts.push({ juz: a[2], surah: s.n, ayah: i + 1 });
      }
    });
  }
  return starts.sort((x, y) => x.juz - y.juz);
}

// ---- persisted reader state -------------------------------------------------

export interface Position {
  s: number;
  a: number;
}

export interface QuranPrefs {
  fontSize: number;
  showTranslation: boolean;
}

const LAST_READ_KEY = 'quran_last_read_v1';
const BOOKMARKS_KEY = 'quran_bookmarks_v1';
const PREFS_KEY = 'quran_prefs_v1';

export const DEFAULT_PREFS: QuranPrefs = { fontSize: 28, showTranslation: true };

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const getLastRead = () => readJson<Position | null>(LAST_READ_KEY, null);
export const saveLastRead = (p: Position) => AsyncStorage.setItem(LAST_READ_KEY, JSON.stringify(p)).catch(() => {});

export const getBookmarks = () => readJson<Position[]>(BOOKMARKS_KEY, []);

export async function toggleBookmark(p: Position): Promise<Position[]> {
  const list = await getBookmarks();
  const idx = list.findIndex((b) => b.s === p.s && b.a === p.a);
  if (idx >= 0) list.splice(idx, 1);
  else list.unshift(p);
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list)).catch(() => {});
  return list;
}

export async function getPrefs(): Promise<QuranPrefs> {
  return { ...DEFAULT_PREFS, ...(await readJson<Partial<QuranPrefs>>(PREFS_KEY, {})) };
}
export const savePrefs = (p: QuranPrefs) => AsyncStorage.setItem(PREFS_KEY, JSON.stringify(p)).catch(() => {});
