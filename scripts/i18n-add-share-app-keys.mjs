// Adds the "share the app" settings row strings to every locale.
// Order: settings.shareApp, settings.shareAppMessage ({{playStore}} placeholder required)
import fs from 'node:fs';
import path from 'node:path';

const T = {
  tr: ['Uygulamayı Paylaş', '🕌 Namaz vakitleri, kıble, ortak hatim ve günlük dualar tek uygulamada. Ücretsiz indir:\n{{playStore}}'],
  en: ['Share the App', '🕌 Prayer times, qibla, group Quran completion and daily duas in one app. Download free:\n{{playStore}}'],
  ar: ['شارك التطبيق', '🕌 مواقيت الصلاة والقبلة والختمة الجماعية والأدعية اليومية في تطبيق واحد. حمّله مجاناً:\n{{playStore}}'],
  fa: ['اشتراک‌گذاری برنامه', '🕌 اوقات نماز، قبله، ختم گروهی قرآن و دعاهای روزانه در یک برنامه. رایگان دانلود کنید:\n{{playStore}}'],
  ur: ['ایپ شیئر کریں', '🕌 نماز کے اوقات، قبلہ، اجتماعی ختمِ قرآن اور روزانہ دعائیں ایک ہی ایپ میں۔ مفت ڈاؤن لوڈ کریں:\n{{playStore}}'],
  de: ['App teilen', '🕌 Gebetszeiten, Qibla, gemeinsame Koran-Lesung und tägliche Bittgebete in einer App. Kostenlos herunterladen:\n{{playStore}}'],
  fr: ["Partager l'application", '🕌 Horaires de prière, qibla, khatm collectif du Coran et invocations quotidiennes dans une seule app. Téléchargement gratuit :\n{{playStore}}'],
  es: ['Compartir la app', '🕌 Horarios de oración, qibla, lectura colectiva del Corán y duas diarias en una sola app. Descárgala gratis:\n{{playStore}}'],
  it: ["Condividi l'app", '🕌 Orari di preghiera, qibla, lettura collettiva del Corano e dua quotidiane in unica app. Scaricala gratis:\n{{playStore}}'],
  ru: ['Поделиться приложением', '🕌 Время намаза, кибла, совместный хатм Корана и ежедневные дуа в одном приложении. Скачайте бесплатно:\n{{playStore}}'],
  uk: ['Поділитися застосунком', '🕌 Час намазу, кібла, спільний хатм Корану та щоденні дуа в одному застосунку. Завантажте безкоштовно:\n{{playStore}}'],
  pl: ['Udostępnij aplikację', '🕌 Godziny modlitw, kibla, wspólne czytanie Koranu i codzienne dua w jednej aplikacji. Pobierz za darmo:\n{{playStore}}'],
  nl: ['App delen', '🕌 Gebedstijden, qibla, gezamenlijke Koranlezing en dagelijkse smeekbeden in één app. Gratis downloaden:\n{{playStore}}'],
  pt: ['Compartilhar o app', '🕌 Horários de oração, qibla, leitura coletiva do Alcorão e duas diárias em um só app. Baixe grátis:\n{{playStore}}'],
  sv: ['Dela appen', '🕌 Bönetider, qibla, gemensam koranläsning och dagliga duas i en app. Ladda ner gratis:\n{{playStore}}'],
  el: ['Κοινοποίηση εφαρμογής', '🕌 Ώρες προσευχής, κίμπλα, ομαδική ανάγνωση Κορανίου και καθημερινές ντουά σε μία εφαρμογή. Κατεβάστε δωρεάν:\n{{playStore}}'],
  hu: ['Alkalmazás megosztása', '🕌 Imaidők, kibla, közös Korán-olvasás és napi duák egy alkalmazásban. Töltsd le ingyen:\n{{playStore}}'],
  bg: ['Сподели приложението', '🕌 Времена за молитва, кибла, съвместно четене на Корана и ежедневни дуи в едно приложение. Изтеглете безплатно:\n{{playStore}}'],
  ro: ['Distribuie aplicația', '🕌 Orele de rugăciune, qibla, citirea colectivă a Coranului și dua zilnice într-o singură aplicație. Descarcă gratuit:\n{{playStore}}'],
  bs: ['Podijeli aplikaciju', '🕌 Vaktija, kibla, zajednička hatma i dnevne dove u jednoj aplikaciji. Preuzmi besplatno:\n{{playStore}}'],
  az: ['Tətbiqi paylaş', '🕌 Namaz vaxtları, qiblə, birgə xətm və gündəlik dualar bir tətbiqdə. Pulsuz yüklə:\n{{playStore}}'],
  uz: ['Ilovani ulashish', "🕌 Namoz vaqtlari, qibla, birgalikda xatm va kundalik duolar bitta ilovada. Bepul yuklab oling:\n{{playStore}}"],
  kk: ['Қолданбаны бөлісу', '🕌 Намаз уақыттары, құбыла, бірлескен хатым және күнделікті дұғалар бір қолданбада. Тегін жүктеп алыңыз:\n{{playStore}}'],
  id: ['Bagikan Aplikasi', '🕌 Jadwal salat, kiblat, khataman Al-Qur\'an bersama, dan doa harian dalam satu aplikasi. Unduh gratis:\n{{playStore}}'],
  ms: ['Kongsi Aplikasi', '🕌 Waktu solat, kiblat, khatam al-Quran bersama dan doa harian dalam satu aplikasi. Muat turun percuma:\n{{playStore}}'],
  bn: ['অ্যাপ শেয়ার করুন', '🕌 নামাজের সময়, কিবলা, সম্মিলিত খতম ও দৈনিক দোয়া এক অ্যাপে। বিনামূল্যে ডাউনলোড করুন:\n{{playStore}}'],
  hi: ['ऐप शेयर करें', '🕌 नमाज़ का समय, क़िबला, सामूहिक ख़त्म-ए-क़ुरआन और रोज़ की दुआएँ एक ही ऐप में। मुफ़्त डाउनलोड करें:\n{{playStore}}'],
  zh: ['分享应用', '🕌 礼拜时间、朝向、集体诵读古兰经和每日祈祷，尽在一个应用。免费下载：\n{{playStore}}'],
  ja: ['アプリを共有', '🕌 礼拝時刻、キブラ、みんなでのクルアーン読誦、毎日のドゥアをひとつのアプリで。無料ダウンロード：\n{{playStore}}'],
  ko: ['앱 공유하기', '🕌 기도 시간, 키블라, 함께하는 꾸란 완독, 매일의 두아를 하나의 앱에서. 무료 다운로드:\n{{playStore}}'],
};

const dir = path.resolve('lib/i18n/locales');
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const lang = file.replace('.json', '');
  const v = T[lang];
  if (!v) throw new Error(`No translation for ${lang}`);
  if (!v[1].includes('{{playStore}}')) throw new Error(`Missing placeholder in ${lang}`);
  const full = path.join(dir, file);
  const json = JSON.parse(fs.readFileSync(full, 'utf8'));
  json.settings = { ...(json.settings ?? {}), shareApp: v[0], shareAppMessage: v[1] };
  fs.writeFileSync(full, JSON.stringify(json, null, 2) + '\n');
}
console.log('updated', Object.keys(T).length, 'locales');
