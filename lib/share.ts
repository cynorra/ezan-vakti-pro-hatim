export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.cynnora.ezanvakti';

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

