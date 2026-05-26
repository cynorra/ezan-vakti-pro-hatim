import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tr from './locales/tr.json';
import en from './locales/en.json';
import ar from './locales/ar.json';
import ru from './locales/ru.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import it from './locales/it.json';
import ko from './locales/ko.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';
import hi from './locales/hi.json';
import nl from './locales/nl.json';
import pt from './locales/pt.json';
import pl from './locales/pl.json';
import sv from './locales/sv.json';
import uk from './locales/uk.json';
import bn from './locales/bn.json';
import ur from './locales/ur.json';
import id from './locales/id.json';
import el from './locales/el.json';

const resources = {
  tr: { translation: tr },
  en: { translation: en },
  ar: { translation: ar },
  ru: { translation: ru },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
  it: { translation: it },
  ko: { translation: ko },
  ja: { translation: ja },
  zh: { translation: zh },
  hi: { translation: hi },
  nl: { translation: nl },
  pt: { translation: pt },
  pl: { translation: pl },
  sv: { translation: sv },
  uk: { translation: uk },
  bn: { translation: bn },
  ur: { translation: ur },
  id: { translation: id },
  el: { translation: el },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('appLanguage');

  if (!savedLanguage) {
    const deviceLanguage = getLocales()[0]?.languageCode;
    savedLanguage = Object.keys(resources).includes(deviceLanguage || '') ? deviceLanguage : 'en';
  }

  await i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
