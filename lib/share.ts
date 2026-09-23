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
  return message.includes(PLAY_STORE_URL) ? message : `${message}\n${PLAY_STORE_URL}`;
}
