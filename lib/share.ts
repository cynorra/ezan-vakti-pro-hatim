import type { TFunction } from 'i18next';
import type { PrayerTimes } from './prayer-times';

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.cynnora.ezanvakti';

/** Localized dua share text; always ends with the Play Store link so shares can bring installs. */
export function formatDuaShareMessage(
  dua: { title: string; transliteration?: string; turkish?: string; source?: string },
  t: TFunction
): string {
  const message = t('dua.shareMessage', {
    title: dua.title,
    transliteration: dua.transliteration ?? '',
    meaning: dua.turkish ?? '',
    source: dua.source ?? '',
  });
  // Drop sections left empty (e.g. no transliteration/meaning for Arabic readers).
  const cleaned = message
    .split('\n\n')
    .filter((part) => part.trim() && !/[:：]\s*$/.test(part.trim()))
    .join('\n\n');
  return cleaned.includes(PLAY_STORE_URL) ? cleaned : `${cleaned}\n\n📲 Ezan Vakti + Hatim uygulamasını ücretsiz indirin:\n${PLAY_STORE_URL}`;
}

/** Namaz vakitlerini WhatsApp / Telegram / SMS gruplarında paylaşmak için şık ve davetkar format */
export function formatPrayerTimesShareMessage(
  cityName: string,
  districtName: string,
  times: PrayerTimes,
  dateStr: string,
  _t?: TFunction
): string {
  const city = districtName && districtName !== cityName ? `${cityName} / ${districtName}` : cityName;
  return `🕌 ${city} Namaz Vakitleri (${dateStr})
━━━━━━━━━━━━━━━━━━━━
• İmsak: ${times.fajr}
• Güneş: ${times.sunrise}
• Öğle: ${times.dhuhr}
• İkindi: ${times.asr}
• Akşam: ${times.maghrib}
• Yatsı: ${times.isha}
━━━━━━━━━━━━━━━━━━━━
📖 Doğru namaz vakitleri, kıble yönü, zikirmatik ve ortak hatim platformu için Ezan Vakti Pro+ uygulamasını ücretsiz indirin:
${PLAY_STORE_URL}`;
}

/** Günün ayetini veya hadisini paylaşma mesajı */
export function formatWisdomShareMessage(
  wisdom: { type: 'verse' | 'hadith'; content: string; source: string; arabic?: string },
  _t?: TFunction
): string {
  const header = wisdom.type === 'verse' ? '📖 Günün Ayeti' : '✨ Günün Hadis-i Şerifi';
  const arabicPart = wisdom.arabic && wisdom.arabic !== wisdom.content ? `${wisdom.arabic}\n\n` : '';
  return `${header}
━━━━━━━━━━━━━━━━━━━━
${arabicPart}"${wisdom.content}"

— ${wisdom.source}
━━━━━━━━━━━━━━━━━━━━
📲 Her gün yeni ayet, hadis ve dualar için Ezan Vakti Pro+ indirin:
${PLAY_STORE_URL}`;
}

/** Günün esmasını paylaşma mesajı */
export function formatEsmaShareMessage(
  esma: { arabic: string; turkish: string; meaning: string },
  _t?: TFunction
): string {
  return `🕋 Esmaü'l-Hüsna — Günün Esması
━━━━━━━━━━━━━━━━━━━━
✨ ${esma.turkish} (${esma.arabic})

Anlamı:
${esma.meaning}
━━━━━━━━━━━━━━━━━━━━
📲 Allah'ın 99 ismini öğrenmek ve namaz vakitlerini takip etmek için Ezan Vakti Pro+:
${PLAY_STORE_URL}`;
}

/** Günün duasını takvim tarihiyle birlikte paylaşma mesajı */
export function formatDailyDuaShareMessage(
  dua: { title: string; transliteration?: string; turkish?: string; source?: string; arabic?: string },
  dateStr: string,
  hijriStr: string,
  _t?: TFunction
): string {
  const arabicPart = dua.arabic ? `${dua.arabic}\n\n` : '';
  const translitPart = dua.transliteration ? `(${dua.transliteration})\n\n` : '';
  const meaningPart = dua.turkish ? `"${dua.turkish}"\n\n` : '';
  const sourcePart = dua.source ? `— ${dua.source}\n` : '';
  return `🤲 Günün Duası (${dateStr} · ${hijriStr})
━━━━━━━━━━━━━━━━━━━━
✨ ${dua.title}

${arabicPart}${translitPart}${meaningPart}${sourcePart}━━━━━━━━━━━━━━━━━━━━
📲 Her gün yeni dua, ezan vakitleri ve ortak hatim için Ezan Vakti Pro+:
${PLAY_STORE_URL}`;
}

/** Bayram tebrik mesajı */
export function formatEidShareMessage(dayName: string, _t?: TFunction): string {
  return `🌙 Mübarek ${dayName} Tebriği
━━━━━━━━━━━━━━━━━━━━
Bayramınız mübarek olsun! Rabbim sevdiklerinizle birlikte sağlık, huzur, afiyet ve bereket dolu nice bayramlara ulaştırsın. Dualarınız ve ibadetleriniz kabul olsun. 🤲✨
━━━━━━━━━━━━━━━━━━━━
📲 Ezan Vakti + Hatim uygulamasını ücretsiz indirin:
${PLAY_STORE_URL}`;
}

/** Kandil tebrik mesajı */
export function formatKandilShareMessage(kandilName: string, _t?: TFunction): string {
  return `✨ Mübarek ${kandilName} Tebriği
━━━━━━━━━━━━━━━━━━━━
${kandilName} mübarek olsun! Bu kutlu gecenin feyzi ve bereketi hanenize dolsun, dualarınız ve tevbeleriniz dergâh-ı izzette kabul olsun. 🕌🤲
━━━━━━━━━━━━━━━━━━━━
📲 Ezan Vakti + Hatim uygulamasını ücretsiz indirin:
${PLAY_STORE_URL}`;
}

/** Kullanıcının sevdiklerine doğrudan uygulamayı tavsiye etmesi için hazırlanan davet mesajı */
export function formatAppInviteMessage(_t?: TFunction): string {
  return `🌟 "Kim hayırlı bir işe vesile olursa, ona o hayrı yapan kadar ecir verilir." (Müslim, İmare, 133)

Hayırlı günler! Ezan vakitleri, sesli ezan bildirimleri, pusulalı kıble bulucu, zikirmatik ve Türkiye'nin en aktif Ortak Hatim platformunu içeren Ezan Vakti Pro+ uygulamasını sana da tavsiye ederim:

📲 Ücretsiz İndir:
${PLAY_STORE_URL}`;
}
