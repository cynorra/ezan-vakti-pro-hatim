import fs from 'fs';
import path from 'path';

const DIR = 'lib/i18n/locales';

function deepMerge(target, source) {
  for (const k in source) {
    if (typeof source[k] === 'object' && source[k] !== null && !Array.isArray(source[k])) {
      if (typeof target[k] !== 'object' || target[k] === null) target[k] = {};
      deepMerge(target[k], source[k]);
    } else if (!(k in target)) {
      target[k] = source[k];
    }
  }
  return target;
}

const trNew = {
  common: {
    errorGeneric: 'Bir hata oluştu.',
  },
  hatim: {
    enterNameAlert: 'Lütfen adınızı giriniz.',
    enterTitleAlert: 'Lütfen bir başlık giriniz.',
    topHatimBadge: 'EN AKTİF HATİM',
    leaderboardTitle: 'EN ÇOK CÜZ ALANLAR',
    unnamedParticipant: 'İsimsiz',
    inviteShareMessage: '"{{title}}" ortak hatmine katıl, bir cüz al, birlikte Kur\'an okuyalım 🕌📖\n\nUygulama zaten yüklüyse: {{deepLink}}\n\nYüklü değilse: {{playStore}}',
    completionShareMessage: '🎉 30 cüzü tamamladım, hatmimi bitirdim! Elhamdülillah 📖🕌\n\nBu benim {{count}}. hatmim. Sen de takip etmeye başla: {{playStore}}',
    progressShareMessage: '📖 Bu hafta {{completed}}/30 cüz tamamladım (%{{percentage}}).\n\nSen de Ezan Vakti + Hatim ile takip et: {{playStore}}',
    rewardUnlocked: '🎁 Harika! Paylaşımların sayesinde {{days}} gün reklamsız kullanım kazandın.',
    rewardBannerText: '{{count}} paylaşım daha yap, {{days}} gün reklamsız kazan 🎁',
    juzCountShort: 'cüz',
  },
  kaza: {
    completionShareMessage: '🎉 Tüm kaza namazlarımı tamamladım, Elhamdülillah! 🕌\n\nSen de kaza namazlarını Ezan Vakti + Hatim ile takip et: {{playStore}}',
  },
  dua: {
    headerTitle: 'DUA KİTAPLIĞI',
    headerSubtitle: 'Müminin Silahı Duadır',
    featuredBadge: 'GÜNÜN DUASI',
    meaningLabel: 'ANLAMI',
    shareMessage: '{{title}}\n\n{{transliteration}}\n\nAnlamı: {{meaning}}\n\nKaynak: {{source}}\n\nEzan Vakti + Hatim uygulamasından paylaşıldı.',
  },
  home: {
    duaOfTheDay: 'Günün Duası',
  },
  splash: {
    subtitle: 'Namaz vakti, hatim ve dua bir arada',
  },
  notifications: {
    dailyDuaTitle: '🤲 Günün Duası',
    dailyDuaBody: '{{title}} — okumak için dokun',
    eveningTitle: 'Ezan Vakti + Hatim',
    eveningMsg1: 'Bugün hatimine ayet eklemeyi unutma 📖',
    eveningMsg2: 'Akşam vaktine yaklaşırken bir dua ile içini rahatlat 🤲',
    eveningMsg3: 'Kaza namazların için birkaç dakikan var mı? 🕌',
    eveningMsg4: 'Tesbihatını bugün yaptın mı? Zikir kalbe huzur verir ✨',
    noJuzThisWeek: 'Bu hafta henüz hiç cüz işaretlemedin, bir cüz ile başlasan nasıl olur? 📖',
    kazaDebtReminder: '{{count}} kaza namazın seni bekliyor, bu akşam birkaçını tamamlayabilirsin 🕌',
    streakReminder: '{{streak}} günlük serin devam ediyor, bugünü de kaçırma 🔥',
    prayerTitle: '{{prayer}} Vakti',
    prayerBody: '{{city}} için {{prayer}} vakti geldi.',
  },
};

const enNew = {
  common: {
    errorGeneric: 'Something went wrong.',
  },
  hatim: {
    enterNameAlert: 'Please enter your name.',
    enterTitleAlert: 'Please enter a title.',
    topHatimBadge: 'MOST ACTIVE KHATM',
    leaderboardTitle: 'TOP CONTRIBUTORS',
    unnamedParticipant: 'Anonymous',
    inviteShareMessage: 'Join the "{{title}}" collaborative khatm, take a juz, let\'s read the Quran together 🕌📖\n\nIf you already have the app: {{deepLink}}\n\nIf not: {{playStore}}',
    completionShareMessage: '🎉 I completed all 30 juz, finished my khatm! Alhamdulillah 📖🕌\n\nThis is my khatm #{{count}}. Start tracking yours too: {{playStore}}',
    progressShareMessage: '📖 I completed {{completed}}/30 juz this week ({{percentage}}%).\n\nTrack yours with Ezan Vakti + Hatim: {{playStore}}',
    rewardUnlocked: '🎁 Awesome! Thanks to your shares, you unlocked {{days}} ad-free days.',
    rewardBannerText: 'Share {{count}} more time(s) to unlock {{days}} ad-free days 🎁',
    juzCountShort: 'juz',
  },
  kaza: {
    completionShareMessage: '🎉 I completed all my missed prayers, Alhamdulillah! 🕌\n\nTrack your missed prayers with Ezan Vakti + Hatim: {{playStore}}',
  },
  dua: {
    headerTitle: 'DUA LIBRARY',
    headerSubtitle: 'Prayer Is the Weapon of the Believer',
    featuredBadge: 'DUA OF THE DAY',
    meaningLabel: 'MEANING',
    shareMessage: '{{title}}\n\n{{transliteration}}\n\nMeaning: {{meaning}}\n\nSource: {{source}}\n\nShared from Ezan Vakti + Hatim.',
  },
  home: {
    duaOfTheDay: 'Dua of the Day',
  },
  splash: {
    subtitle: 'Prayer times, khatm and dua together',
  },
  notifications: {
    dailyDuaTitle: '🤲 Dua of the Day',
    dailyDuaBody: '{{title}} — tap to read',
    eveningTitle: 'Ezan Vakti + Hatim',
    eveningMsg1: "Don't forget to add a verse to your khatm today 📖",
    eveningMsg2: 'As evening approaches, ease your heart with a dua 🤲',
    eveningMsg3: 'Got a few minutes for your missed prayers? 🕌',
    eveningMsg4: 'Did you do your dhikr today? Remembrance brings peace to the heart ✨',
    noJuzThisWeek: "You haven't marked a juz this week yet, why not start with one? 📖",
    kazaDebtReminder: 'You have {{count}} missed prayers waiting, you could catch up on a few tonight 🕌',
    streakReminder: 'Your {{streak}}-day streak is going, keep it up today too 🔥',
    prayerTitle: '{{prayer}} Time',
    prayerBody: "It's {{prayer}} time for {{city}}.",
  },
};

const dir = DIR;
const trPath = path.join(dir, 'tr.json');
const enPath = path.join(dir, 'en.json');
const tr = JSON.parse(fs.readFileSync(trPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

deepMerge(tr, trNew);
deepMerge(en, enNew);

fs.writeFileSync(trPath, JSON.stringify(tr, null, 2) + '\n');
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');

console.log('tr.json and en.json updated with new keys.');
