// Adds dua categories, share-card labels, the Friday greeting and Hijri month names.
// Row order: [all, daily, worship, protection, family, other], sourceLabel, cardSlogan, cardFooter, fridayGreeting, months(12)
import fs from 'node:fs';
import path from 'node:path';

const LATIN_MONTHS = ['Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani", 'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah'];

const T = {
  tr: [['Tümü', 'Günlük', 'İbadet', 'Korunma', 'Aile', 'Diğer'], 'Kaynak', 'Namaz Vakitleri & Hatim Takibi', "Google Play'den Ücretsiz İndir", 'Cumanız Mübarek Olsun 🕌',
    ['Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce']],
  en: [['All', 'Daily', 'Worship', 'Protection', 'Family', 'Other'], 'Source', 'Prayer Times & Quran Tracker', 'Free on Google Play', 'Blessed Friday 🕌', LATIN_MONTHS],
  ar: [['الكل', 'يومية', 'عبادة', 'حماية', 'الأسرة', 'أخرى'], 'المصدر', 'مواقيت الصلاة ومتابعة الختمة', 'حمّله مجاناً من Google Play', 'جمعة مباركة 🕌',
    ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة']],
  fa: [['همه', 'روزانه', 'عبادت', 'محافظت', 'خانواده', 'سایر'], 'منبع', 'اوقات نماز و پیگیری ختم قرآن', 'دانلود رایگان از Google Play', 'جمعه مبارک 🕌',
    ['محرم', 'صفر', 'ربیع‌الاول', 'ربیع‌الثانی', 'جمادی‌الاول', 'جمادی‌الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی‌القعده', 'ذی‌الحجه']],
  ur: [['تمام', 'روزانہ', 'عبادت', 'حفاظت', 'خاندان', 'دیگر'], 'ماخذ', 'نماز کے اوقات اور ختمِ قرآن', 'Google Play سے مفت ڈاؤن لوڈ کریں', 'جمعہ مبارک 🕌',
    ['محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذوالقعدہ', 'ذوالحجہ']],
  de: [['Alle', 'Täglich', 'Gottesdienst', 'Schutz', 'Familie', 'Sonstiges'], 'Quelle', 'Gebetszeiten & Koran-Tracker', 'Kostenlos bei Google Play', 'Gesegneten Freitag 🕌', LATIN_MONTHS],
  fr: [['Tout', 'Quotidien', 'Adoration', 'Protection', 'Famille', 'Autre'], 'Source', 'Horaires de prière & suivi du Coran', 'Gratuit sur Google Play', 'Joumou‘a moubarak 🕌', LATIN_MONTHS],
  es: [['Todo', 'Diario', 'Adoración', 'Protección', 'Familia', 'Otros'], 'Fuente', 'Horarios de oración y Corán', 'Gratis en Google Play', 'Bendito viernes 🕌', LATIN_MONTHS],
  it: [['Tutto', 'Quotidiano', 'Adorazione', 'Protezione', 'Famiglia', 'Altro'], 'Fonte', 'Orari di preghiera e Corano', 'Gratis su Google Play', 'Venerdì benedetto 🕌', LATIN_MONTHS],
  ru: [['Все', 'Ежедневные', 'Поклонение', 'Защита', 'Семья', 'Другое'], 'Источник', 'Время намаза и хатм Корана', 'Бесплатно в Google Play', 'Благословенной пятницы 🕌',
    ['Мухаррам', 'Сафар', 'Раби аль-авваль', 'Раби ас-сани', 'Джумада аль-уля', 'Джумада ас-сани', 'Раджаб', 'Шаабан', 'Рамадан', 'Шавваль', 'Зуль-када', 'Зуль-хиджа']],
  uk: [['Усі', 'Щоденні', 'Поклоніння', 'Захист', 'Сімʼя', 'Інше'], 'Джерело', 'Час намазу та хатм Корану', 'Безкоштовно в Google Play', 'Благословенної пʼятниці 🕌',
    ['Мухаррам', 'Сафар', 'Рабі аль-авваль', 'Рабі ас-сані', 'Джумада аль-уля', 'Джумада ас-сані', 'Раджаб', 'Шаабан', 'Рамадан', 'Шавваль', 'Зуль-када', 'Зуль-хіджа']],
  pl: [['Wszystkie', 'Codzienne', 'Ibadat', 'Ochrona', 'Rodzina', 'Inne'], 'Źródło', 'Godziny modlitw i Koran', 'Za darmo w Google Play', 'Błogosławionego piątku 🕌', LATIN_MONTHS],
  nl: [['Alles', 'Dagelijks', 'Aanbidding', 'Bescherming', 'Familie', 'Overig'], 'Bron', 'Gebedstijden & Koranlezing', 'Gratis op Google Play', 'Gezegende vrijdag 🕌', LATIN_MONTHS],
  pt: [['Todos', 'Diário', 'Adoração', 'Proteção', 'Família', 'Outros'], 'Fonte', 'Horários de oração e Alcorão', 'Grátis no Google Play', 'Sexta-feira abençoada 🕌', LATIN_MONTHS],
  sv: [['Alla', 'Dagliga', 'Tillbedjan', 'Skydd', 'Familj', 'Övrigt'], 'Källa', 'Bönetider & koranläsning', 'Gratis på Google Play', 'Välsignad fredag 🕌', LATIN_MONTHS],
  el: [['Όλα', 'Καθημερινά', 'Λατρεία', 'Προστασία', 'Οικογένεια', 'Άλλα'], 'Πηγή', 'Ώρες προσευχής & Κοράνι', 'Δωρεάν στο Google Play', 'Ευλογημένη Παρασκευή 🕌',
    ['Μουχαρράμ', 'Σαφάρ', 'Ραμπί αλ-Αουάλ', 'Ραμπί αθ-Θανί', 'Τζουμάντα αλ-Ούλα', 'Τζουμάντα αθ-Θανί', 'Ρατζάμπ', 'Σααμπάν', 'Ραμαζάνι', 'Σαουάλ', 'Ντουλ Κάαντα', 'Ντουλ Χίτζα']],
  hu: [['Összes', 'Napi', 'Istentisztelet', 'Védelem', 'Család', 'Egyéb'], 'Forrás', 'Imaidők és Korán-olvasás', 'Ingyenes a Google Playen', 'Áldott pénteket 🕌', LATIN_MONTHS],
  bg: [['Всички', 'Ежедневни', 'Поклонение', 'Защита', 'Семейство', 'Други'], 'Източник', 'Времена за молитва и Коран', 'Безплатно в Google Play', 'Благословен петък 🕌',
    ['Мухаррам', 'Сафар', 'Раби ал-аввал', 'Раби ас-сани', 'Джумада ал-ула', 'Джумада ас-сани', 'Раджаб', 'Шабан', 'Рамадан', 'Шаввал', 'Зу л-када', 'Зу л-хиджа']],
  ro: [['Toate', 'Zilnice', 'Adorare', 'Protecție', 'Familie', 'Altele'], 'Sursa', 'Orele de rugăciune și Coranul', 'Gratuit pe Google Play', 'Vineri binecuvântată 🕌', LATIN_MONTHS],
  bs: [['Sve', 'Dnevne', 'Ibadet', 'Zaštita', 'Porodica', 'Ostalo'], 'Izvor', 'Vaktija i praćenje hatme', 'Besplatno na Google Playu', 'Hajirli džuma 🕌',
    ['Muharrem', 'Safer', 'Rebiu-l-evvel', 'Rebiu-l-ahir', 'Džumade-l-ula', 'Džumade-l-uhra', 'Redžeb', "Ša'ban", 'Ramazan', 'Ševval', "Zu-l-ka'de", 'Zu-l-hidždže']],
  az: [['Hamısı', 'Gündəlik', 'İbadət', 'Qorunma', 'Ailə', 'Digər'], 'Mənbə', 'Namaz vaxtları və xətm izləmə', "Google Play-də pulsuz", 'Cüməniz mübarək 🕌',
    ['Məhərrəm', 'Səfər', 'Rəbiüləvvəl', 'Rəbiülaxır', 'Cəmadiyələvvəl', 'Cəmadiyəlaxır', 'Rəcəb', 'Şaban', 'Ramazan', 'Şəvval', 'Zilqədə', 'Zilhiccə']],
  uz: [['Hammasi', 'Kundalik', 'Ibodat', 'Himoya', 'Oila', 'Boshqa'], 'Manba', 'Namoz vaqtlari va xatm kuzatuvi', "Google Play'da bepul", 'Juma muborak 🕌',
    ['Muharram', 'Safar', 'Rabiul-avval', 'Rabiul-oxir', 'Jumodul-avval', 'Jumodul-oxir', 'Rajab', "Sha'bon", 'Ramazon', 'Shavvol', "Zulqa'da", 'Zulhijja']],
  kk: [['Барлығы', 'Күнделікті', 'Ғибадат', 'Қорғаныс', 'Отбасы', 'Басқа'], 'Дереккөз', 'Намаз уақыттары және хатым', 'Google Play-де тегін', 'Жұмаңыз мүбәрак болсын 🕌',
    ['Мұхаррам', 'Сафар', 'Рабиғул-әууәл', 'Рабиғул-ахир', 'Жұмәдәл-әууәл', 'Жұмәдәл-ахир', 'Ражап', 'Шағбан', 'Рамазан', 'Шәууәл', 'Зұлқағда', 'Зұлхиджа']],
  id: [['Semua', 'Harian', 'Ibadah', 'Perlindungan', 'Keluarga', 'Lainnya'], 'Sumber', 'Jadwal Sholat & Khatam Quran', 'Gratis di Google Play', "Jum'at Berkah 🕌",
    ['Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah']],
  ms: [['Semua', 'Harian', 'Ibadah', 'Perlindungan', 'Keluarga', 'Lain-lain'], 'Sumber', 'Waktu Solat & Khatam Quran', 'Percuma di Google Play', 'Jumaat Mubarak 🕌',
    ['Muharam', 'Safar', 'Rabiulawal', 'Rabiulakhir', 'Jamadilawal', 'Jamadilakhir', 'Rejab', 'Syaaban', 'Ramadan', 'Syawal', 'Zulkaedah', 'Zulhijah']],
  bn: [['সব', 'দৈনিক', 'ইবাদত', 'সুরক্ষা', 'পরিবার', 'অন্যান্য'], 'সূত্র', 'নামাজের সময় ও খতম ট্র্যাকার', 'Google Play-তে বিনামূল্যে', 'জুমা মোবারক 🕌',
    ['মহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জমাদিউল আউয়াল', 'জমাদিউস সানি', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ']],
  hi: [['सभी', 'दैनिक', 'इबादत', 'सुरक्षा', 'परिवार', 'अन्य'], 'स्रोत', 'नमाज़ का समय और ख़त्म ट्रैकर', 'Google Play पर मुफ़्त', 'जुमा मुबारक 🕌',
    ['मुहर्रम', 'सफ़र', 'रबी-उल-अव्वल', 'रबी-उल-आख़िर', 'जमादी-उल-अव्वल', 'जमादी-उल-आख़िर', 'रजब', 'शाबान', 'रमज़ान', 'शव्वाल', 'ज़िलक़ादा', 'ज़िलहिज्जा']],
  zh: [['全部', '日常', '功修', '护佑', '家庭', '其他'], '出处', '礼拜时间与古兰经诵读', 'Google Play 免费下载', '主麻吉庆 🕌',
    ['穆哈兰姆月', '色法尔月', '赖比尔·敖外鲁月', '赖比尔·阿赫尔月', '主马达·敖外鲁月', '主马达·阿赫尔月', '赖哲卜月', '舍尔邦月', '莱麦丹月', '闪瓦鲁月', '都尔喀尔德月', '都尔黑哲月']],
  ja: [['すべて', '日常', '礼拝', '守護', '家族', 'その他'], '出典', '礼拝時刻とクルアーン読誦', 'Google Playで無料', '祝福された金曜日 🕌',
    ['ムハッラム', 'サファル', 'ラビー・アル＝アウワル', 'ラビー・アッ＝サーニー', 'ジュマーダー・アル＝ウーラー', 'ジュマーダー・アッ＝サーニー', 'ラジャブ', 'シャアバーン', 'ラマダーン', 'シャウワール', 'ズー・アル＝カアダ', 'ズー・アル＝ヒッジャ']],
  ko: [['전체', '일상', '예배', '보호', '가족', '기타'], '출처', '기도 시간 및 꾸란 완독', 'Google Play에서 무료', '축복받은 금요일 🕌',
    ['무하람', '사파르', '라비 알아왈', '라비 알사니', '주마다 알울라', '주마다 알사니', '라잡', '샤반', '라마단', '샤왈', '둘카다', '둘히자']],
};

const CATEGORY_IDS = ['all', 'daily', 'worship', 'protection', 'family', 'other'];
const dir = path.resolve('lib/i18n/locales');
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const lang = file.replace('.json', '');
  const row = T[lang];
  if (!row) throw new Error(`No translation for ${lang}`);
  const [cats, sourceLabel, cardSlogan, cardFooter, fridayGreeting, months] = row;
  if (cats.length !== 6 || months.length !== 12) throw new Error(`Bad row for ${lang}`);
  const full = path.join(dir, file);
  const json = JSON.parse(fs.readFileSync(full, 'utf8'));
  json.dua = {
    ...(json.dua ?? {}),
    categories: Object.fromEntries(CATEGORY_IDS.map((id, i) => [id, cats[i]])),
    sourceLabel, cardSlogan, cardFooter,
  };
  json.home = { ...(json.home ?? {}), fridayGreeting };
  json.hijriMonths = Object.fromEntries(months.map((m, i) => [String(i + 1), m]));
  fs.writeFileSync(full, JSON.stringify(json, null, 2) + '\n');
}
console.log('updated', Object.keys(T).length, 'locales');
