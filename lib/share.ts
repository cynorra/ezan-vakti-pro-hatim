import type { TFunction } from 'i18next';

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
  return cleaned.includes(PLAY_STORE_URL) ? cleaned : `${cleaned}\n${PLAY_STORE_URL}`;
}
