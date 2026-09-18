import AsyncStorage from '@react-native-async-storage/async-storage';

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.cynnora.ezanvakti';

const SHARE_COUNT_KEY = 'growth_share_count';
const AD_FREE_UNTIL_KEY = 'ad_free_until';
export const SHARES_PER_REWARD = 3;
export const REWARD_DAYS = 3;

// Not: RN'in Share.share() Android'de paylaşım sayfası açılınca hemen "tamamlandı"
// döner (kullanıcı gerçekten paylaşsa da vazgeçse de) — yani bu, doğrulanmış davet
// değil "paylaşım denemesi" sayar. Gerçek arkadaş-katılımı ölçmek için backend
// atıf sistemi (deep link'e referrer id gömüp sunucuda doğrulama) gerekir.
export async function recordGrowthShare(): Promise<{ count: number; justUnlocked: boolean }> {
  const raw = await AsyncStorage.getItem(SHARE_COUNT_KEY);
  const count = (raw ? parseInt(raw, 10) : 0) + 1;
  await AsyncStorage.setItem(SHARE_COUNT_KEY, String(count));

  let justUnlocked = false;
  if (count % SHARES_PER_REWARD === 0) {
    await grantAdFreeDays(REWARD_DAYS);
    justUnlocked = true;
  }
  return { count, justUnlocked };
}

async function grantAdFreeDays(days: number) {
  const currentUntilRaw = await AsyncStorage.getItem(AD_FREE_UNTIL_KEY);
  const now = Date.now();
  const base = currentUntilRaw && Number(currentUntilRaw) > now ? Number(currentUntilRaw) : now;
  const newUntil = base + days * 24 * 60 * 60 * 1000;
  await AsyncStorage.setItem(AD_FREE_UNTIL_KEY, String(newUntil));
}

export async function isAdFreeActive(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(AD_FREE_UNTIL_KEY);
  if (!raw) return false;
  return Number(raw) > Date.now();
}

export async function getShareCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(SHARE_COUNT_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

export async function getAdFreeRemainingDays(): Promise<number> {
  const currentUntilRaw = await AsyncStorage.getItem(AD_FREE_UNTIL_KEY);
  if (!currentUntilRaw) return 0;
  const remainingMs = Number(currentUntilRaw) - Date.now();
  if (remainingMs <= 0) return 0;
  return Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
}

export async function getSharesUntilNextReward(): Promise<number> {
  const count = await getShareCount();
  const remainder = count % SHARES_PER_REWARD;
  return remainder === 0 ? SHARES_PER_REWARD : SHARES_PER_REWARD - remainder;
}

export function formatDuaShareMessage(dua: {
  title: string;
  transliteration?: string;
  turkish?: string;
  source?: string;
}): string {
  const parts: string[] = [
    `🤲 *${dua.title}*`,
  ];
  if (dua.transliteration) {
    parts.push(`\n"${dua.transliteration}"`);
  }
  if (dua.turkish) {
    parts.push(`\n*Anlamı:* ${dua.turkish}`);
  }
  if (dua.source) {
    parts.push(`\n*Kaynak:* ${dua.source}`);
  }
  parts.push(`\n📲 *Ezan Vakti + Hatim* uygulamasını ücretsiz indirin:\n${PLAY_STORE_URL}`);
  return parts.join('\n');
}

