import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.resolve(__dirname, '../lib/i18n/locales');

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.cynnora.ezanvakti';

const translations = {
  tr: {
    fridayGreeting: 'Cumanız Mübarek Olsun 🕌',
    eidGreeting: 'Bayramınız Mübarek Olsun 🌙',
    kandilGreeting: 'Kandiliniz Mübarek Olsun ✨',
    fridayCardTitle: 'Hayırlı Cumalar',
    fridayCardDesc: 'Cumanız mübarek olsun. Sevdiklerinizle Cuma tebriğini paylaşın.',
    fridayShareBtn: 'Cuma Mesajı Paylaş',
    fridayShareMessage: `🕌 Hayırlı Cumalar! Cumanız mübarek, dualarınız ve ibadetleriniz kabul olsun ✨\n\n📲 Ezan Vakti + Hatim uygulamasını ücretsiz indirin:\n${PLAY_STORE_URL}`,
    eidCardTitle: 'Mübarek Bayram Tebriği',
    eidCardDesc: 'Bayramınız mübarek olsun. Sevdiklerinizle bayram sevincini ve tebriğini paylaşın.',
    eidShareBtn: 'Bayram Mesajı Paylaş',
    kandilCardTitle: 'Mübarek Kandil Gecesi',
    kandilCardDesc: 'Bu kutlu gecede dualarınız kabul, kandiliniz mübarek olsun.',
    kandilShareBtn: 'Kandil Mesajı Paylaş',
  },
  en: {
    fridayGreeting: 'Blessed Friday 🕌',
    eidGreeting: 'Eid Mubarak 🌙',
    kandilGreeting: 'Blessed Holy Night ✨',
    fridayCardTitle: 'Blessed Friday',
    fridayCardDesc: 'Have a blessed Friday. Share blessings and warm greetings with your loved ones.',
    fridayShareBtn: 'Share Friday Greetings',
    fridayShareMessage: `🕌 Blessed Friday! May your day be peaceful and your prayers accepted ✨\n\n📲 Download Ezan Vakti + Hatim for free:\n${PLAY_STORE_URL}`,
    eidCardTitle: 'Eid Mubarak',
    eidCardDesc: 'May this blessed Eid bring joy, peace, and prosperity to you and your family.',
    eidShareBtn: 'Share Eid Greetings',
    kandilCardTitle: 'Blessed Holy Night',
    kandilCardDesc: 'May your prayers and worship be accepted on this sacred night.',
    kandilShareBtn: 'Share Blessings',
  },
  ar: {
    fridayGreeting: 'جمعة مباركة 🕌',
    eidGreeting: 'عيد مبارك 🌙',
    kandilGreeting: 'ليلة مباركة ✨',
    fridayCardTitle: 'جمعة مباركة',
    fridayCardDesc: 'جمعة مباركة عليكم. شاركوا تهنئة يوم الجمعة مع أحبابكم.',
    fridayShareBtn: 'مشاركة تهنئة الجمعة',
    fridayShareMessage: `🕌 جمعة مباركة! تقبل الله طاعاتكم وصالح أعمالكم ✨\n\n📲 حمل تطبيق مواقيت الصلاة والختمة مجاناً:\n${PLAY_STORE_URL}`,
    eidCardTitle: 'تهنئة العيد المبارك',
    eidCardDesc: 'تقبل الله منا ومنكم صالح الأعمال، وكل عام وأنتم بخير.',
    eidShareBtn: 'مشاركة تهنئة العيد',
    kandilCardTitle: 'ليلة مباركة',
    kandilCardDesc: 'نسأل الله في هذه الليلة المباركة أن يستجيب دعاءكم ويغفر ذنوبكم.',
    kandilShareBtn: 'مشاركة التهنئة',
  },
  de: {
    fridayGreeting: 'Gesegneter Freitag 🕌',
    eidGreeting: 'Eid Mubarak / Gesegnetes Fest 🌙',
    kandilGreeting: 'Gesegnete Nacht ✨',
    fridayCardTitle: 'Gesegneter Freitag',
    fridayCardDesc: 'Möge dein Freitag voller Segen sein. Teile Segenswünsche mit deinen Liebsten.',
    fridayShareBtn: 'Freitagsgrüße teilen',
    fridayShareMessage: `🕌 Gesegneten Freitag! Möge Allah deine Gebete und guten Taten annehmen ✨\n\n📲 Gebetszeiten & Hatim App kostenlos herunterladen:\n${PLAY_STORE_URL}`,
    eidCardTitle: 'Gesegnetes Fest',
    eidCardDesc: 'Wir wünschen Ihnen und Ihrer Familie ein frohes und gesegnetes Fest.',
    eidShareBtn: 'Festgrüße teilen',
    kandilCardTitle: 'Gesegnete Nacht',
    kandilCardDesc: 'Mögen deine Gebete in dieser gesegneten Nacht erhört werden.',
    kandilShareBtn: 'Segenswünsche teilen',
  },
  fr: {
    fridayGreeting: 'Vendredi Béni 🕌',
    eidGreeting: 'Aïd Moubarak 🌙',
    kandilGreeting: 'Nuit Bénie ✨',
    fridayCardTitle: 'Vendredi Béni',
    fridayCardDesc: 'Passez un vendredi béni. Partagez des vœux chaleureux avec vos proches.',
    fridayShareBtn: 'Partager les vœux du Vendredi',
    fridayShareMessage: `🕌 Vendredi béni ! Que la paix soit sur vous et que vos prières soient exaucées ✨\n\n📲 Téléchargez l'application Horaires de Prière & Hatim gratuitement :\n${PLAY_STORE_URL}`,
    eidCardTitle: 'Aïd Moubarak',
    eidCardDesc: 'Que cette fête bénie vous apporte joie, paix et santé à vous et à vos proches.',
    eidShareBtn: 'Partager les vœux de l\'Aïd',
    kandilCardTitle: 'Nuit Bénie',
    kandilCardDesc: 'Que vos prières et invocations soient acceptées en cette nuit sacrée.',
    kandilShareBtn: 'Partager les bénédictions',
  },
  ru: {
    fridayGreeting: 'Благословенная пятница 🕌',
    eidGreeting: 'Ид Мубарак / С праздником 🌙',
    kandilGreeting: 'Благословенная ночь ✨',
    fridayCardTitle: 'Благословенная пятница',
    fridayCardDesc: 'Желаем благословенной пятницы. Поделитесь теплыми пожеланиями с близкими.',
    fridayShareBtn: 'Поделиться поздравлением',
    fridayShareMessage: `🕌 Благословенной пятницы! Пусть ваши дуа и благие дела будут приняты ✨\n\n📲 Скачайте приложение Время Намаза & Хатим бесплатно:\n${PLAY_STORE_URL}`,
    eidCardTitle: 'Ид Мубарак',
    eidCardDesc: 'Поздравляем с праздником! Мира, добра и благословения вашему дому.',
    eidShareBtn: 'Поздравить с праздником',
    kandilCardTitle: 'Благословенная ночь',
    kandilCardDesc: 'Пусть Всевышний примет ваши молитвы в эту священную ночь.',
    kandilShareBtn: 'Поделиться пожеланием',
  },
  id: {
    fridayGreeting: 'Jumat Berkah 🕌',
    eidGreeting: 'Selamat Hari Raya Idul Fitri / Adha 🌙',
    kandilGreeting: 'Malam yang Diberkahi ✨',
    fridayCardTitle: 'Jumat Berkah',
    fridayCardDesc: 'Semoga Jumat Anda penuh berkah. Bagikan ucapan dan doa kepada orang tersayang.',
    fridayShareBtn: 'Bagikan Ucapan Jumat',
    fridayShareMessage: `🕌 Jumat Berkah! Semoga Allah menerima segala amal ibadah dan doa kita ✨\n\n📲 Unduh aplikasi Jadwal Sholat & Khatam Al-Quran gratis:\n${PLAY_STORE_URL}`,
    eidCardTitle: 'Selamat Hari Raya',
    eidCardDesc: 'Taqabbalallahu minna wa minkum. Selamat hari raya untuk Anda dan keluarga.',
    eidShareBtn: 'Bagikan Ucapan Hari Raya',
    kandilCardTitle: 'Malam Berkah',
    kandilCardDesc: 'Semoga doa dan ibadah kita diterima di malam yang mulia ini.',
    kandilShareBtn: 'Bagikan Berkah',
  },
  ms: {
    fridayGreeting: 'Salam Jumaat Barakah 🕌',
    eidGreeting: 'Selamat Hari Raya 🌙',
    kandilGreeting: 'Malam yang Diberkati ✨',
    fridayCardTitle: 'Salam Jumaat',
    fridayCardDesc: 'Semoga hari Jumaat ini dilimpahi rahmat dan barakah. Kongsikan ucapan bersama keluarga.',
    fridayShareBtn: 'Kongsi Ucapan Jumaat',
    fridayShareMessage: `🕌 Salam Jumaat! Semoga segala doa dan ibadah kita diterima Allah SWT ✨\n\n📲 Muat turun aplikasi Waktu Solat & Khatam Quran secara percuma:\n${PLAY_STORE_URL}`,
    eidCardTitle: 'Selamat Hari Raya',
    eidCardDesc: 'Semoga Aidilfitri/Aidiladha ini membawa kegembiraan dan kesejahteraan buat seisi keluarga.',
    eidShareBtn: 'Kongsi Ucapan Raya',
    kandilCardTitle: 'Malam yang Diberkati',
    kandilCardDesc: 'Semoga amalan dan doa kita diperkenankan pada malam yang mulia ini.',
    kandilShareBtn: 'Kongsi Kebaikan',
  },
  es: {
    fridayGreeting: 'Viernes Bendito 🕌',
    eidGreeting: 'Eid Mubarak 🌙',
    kandilGreeting: 'Noche Bendita ✨',
    fridayCardTitle: 'Viernes Bendito',
    fridayCardDesc: 'Que tengas un viernes lleno de bendiciones y paz. Comparte con tus seres queridos.',
    fridayShareBtn: 'Compartir saludo de Viernes',
    fridayShareMessage: `🕌 ¡Viernes Bendito! Que la paz y las bendiciones de Dios estén contigo ✨\n\n📲 Descarga gratis la app Horarios de Oración y Corán:\n${PLAY_STORE_URL}`,
    eidCardTitle: 'Eid Mubarak',
    eidCardDesc: 'Que este bendito Eid traiga paz, salud y alegría a ti y a tu familia.',
    eidShareBtn: 'Compartir saludo de Eid',
    kandilCardTitle: 'Noche Bendita',
    kandilCardDesc: 'Que tus súplicas sean escuchadas en esta noche sagrada.',
    kandilShareBtn: 'Compartir bendiciones',
  },
};

const defaultFallback = translations.en;

const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const lang = path.basename(file, '.json');
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const t = translations[lang] || defaultFallback;

  data.home = data.home || {};
  data.hatim = data.hatim || {};

  data.home.fridayGreeting = data.home.fridayGreeting || t.fridayGreeting;
  data.home.eidGreeting = data.home.eidGreeting || t.eidGreeting;
  data.home.kandilGreeting = data.home.kandilGreeting || t.kandilGreeting;

  data.hatim.fridayCardTitle = data.hatim.fridayCardTitle || t.fridayCardTitle;
  data.hatim.fridayCardDesc = data.hatim.fridayCardDesc || t.fridayCardDesc;
  data.hatim.fridayShareBtn = data.hatim.fridayShareBtn || t.fridayShareBtn;
  data.hatim.fridayShareMessage = data.hatim.fridayShareMessage || t.fridayShareMessage;

  data.hatim.eidCardTitle = data.hatim.eidCardTitle || t.eidCardTitle;
  data.hatim.eidCardDesc = data.hatim.eidCardDesc || t.eidCardDesc;
  data.hatim.eidShareBtn = data.hatim.eidShareBtn || t.eidShareBtn;

  data.hatim.kandilCardTitle = data.hatim.kandilCardTitle || t.kandilCardTitle;
  data.hatim.kandilCardDesc = data.hatim.kandilCardDesc || t.kandilCardDesc;
  data.hatim.kandilShareBtn = data.hatim.kandilShareBtn || t.kandilShareBtn;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Synced: ${file}`);
}

console.log('All locale files successfully updated.');
