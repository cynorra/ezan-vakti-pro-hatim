import AsyncStorage from '@react-native-async-storage/async-storage';
import { localDateKey } from './date-keys';

const STREAK_KEY = 'daily_streak';

interface StreakData {
  count: number;
  lastOpenDate: string; // YYYY-MM-DD
}

function toDateStr(d: Date) {
  return localDateKey(d);
}

function daysBetween(fromStr: string, toStr: string) {
  return Math.round((new Date(toStr).getTime() - new Date(fromStr).getTime()) / 86400000);
}

async function readStreak(): Promise<StreakData> {
  const raw = await AsyncStorage.getItem(STREAK_KEY);
  return raw ? JSON.parse(raw) : { count: 0, lastOpenDate: '' };
}

// Uygulama her açıldığında çağrılır: gün değiştiyse seriyi günceller
// (ardışık gün: +1, gün atlandı: sıfırlanır, aynı gün: değişmez).
export async function recordAppOpenAndGetStreak(): Promise<number> {
  const today = toDateStr(new Date());
  const data = await readStreak();

  if (data.lastOpenDate === today) {
    return data.count || 1;
  }

  if (!data.lastOpenDate) {
    data.count = 1;
  } else {
    const diff = daysBetween(data.lastOpenDate, today);
    data.count = diff === 1 ? data.count + 1 : 1;
  }

  data.lastOpenDate = today;
  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(data));
  return data.count;
}

// Bildirim planlarken kullanılır: bugün henüz açılmamışsa bile mevcut seriyi okur
// (dünkü seri kırılmışsa 0 döner ki bildirim metni buna göre yazılsın).
export async function getCurrentStreak(): Promise<number> {
  const data = await readStreak();
  if (!data.lastOpenDate) return 0;
  const today = toDateStr(new Date());
  const diff = daysBetween(data.lastOpenDate, today);
  if (diff > 1) return 0;
  return data.count;
}
