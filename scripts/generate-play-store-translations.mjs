import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../assets/translations');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// İngilizce temel şablon (İngilizce varyantlar için)
const enData = {
  title: 'Prayer Times: Athan & Qibla',
  shortDescription: 'Accurate Muslim prayer times, Athan alarm, Quran Khatam, Qibla compass & Tasbih.',
  fullDescription: `🕌 Muslim: Accurate Prayer Times, Athan Alarm, Group Quran Khatam, Qibla & Tasbih

Muslim: Prayer Times & Quran is the all-in-one Islamic app trusted by Muslims worldwide for accurate daily prayer schedules, Azan alarms, and shared Quran Khatam circles.

📖 GROUP QURAN KHATAM & JUZ SHARING (Worldwide First)
• Form a Khatam group and share 30 Juz with friends and family via WhatsApp in 1-click.
• Real-time progress tracking of every Juz until the Khatam is completed together.

⏰ 100% ACCURATE PRAYER TIMES & ATHAN ALARM
• Exact Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha prayer times calculated by GPS.
• Customizable Athan (Azan) voice notifications & pre-prayer reminders (15/30/45 min).
• 100% Offline mode: access monthly prayer times without WiFi or cellular data.

🧭 SENSOR-DAMPED PRECISE QIBLA COMPASS
• Ultra-precise Qibla direction finder pointing to Kaaba (Mecca).
• Golden alignment pulse and vibration when facing the exact Qibla direction.

📿 SMART DIGITAL TASBIH & DHIKR COUNTER
• Real tactile vibration feeling like a physical tasbeeh.
• Morning & evening Adhkar, Asmaul Husna, and daily Dhikr goal targets.

🤲 DAILY HEALING DUAS & QURAN VERSES
• Curated authentic Duas from Sahih Bukhari, Muslim, and the Holy Quran.
• Full Arabic text with vowel signs (Tashkeel), English translation, and transliteration.
• Viral shareable high-res story cards for WhatsApp Status & Instagram Stories.

📊 QAZA (MISSED PRAYER & FASTING) TRACKER
• Easily log and manage missed prayers and Ramadan fasts with a single tap.

Download now for free and join millions of Muslims keeping their prayers on time!`
};

// İspanyolca temel şablon
const esData = {
  title: 'Horas de Oración: Azán & Corán',
  shortDescription: 'Horarios de oración precisos, alarma azán, khatam del Corán, brújula al-quibla.',
  fullDescription: `🕌 Horas de Oración Pro: Horarios Precisos, Azán, Khatam del Corán en Grupo y Al-Quibla

📖 KHATAM DEL CORÁN EN GRUPO (30 JUZ VÍA WHATSAPP)
⏰ HORAS DE ORACIÓN PRECISAS Y ALARMA AZÁN (100% Offline)
🧭 BRÚJULA DE LA QUIBLA EXACTA
📿 TASBIH DIGITAL INTELIGENTE
🤲 DUAS DIARIAS Y VERSÍCULOS SAGRADOS

¡Descárgalo gratis ahora!`
};

// Portekizce temel şablon
const ptData = {
  title: 'Oração & Azan: Alcorão, Qibla',
  shortDescription: 'Horários de oração muçulmana precisos, alarme azan, khatam do Alcorão e qibla.',
  fullDescription: `🕌 Horários de Oração Pro: Horários Precisos, Azan, Khatam do Alcorão e Qibla

📖 KHATAM DO ALCORÃO EM GRUPO (COMPARTILHE 30 JUZ VIA WHATSAPP)
⏰ HORÁRIOS DE ORAÇÃO PRECISOS E ALARME AZAN (100% Offline)
🧭 BÚSSOLA PRECISA DA QIBLA
📿 CONTADOR DIGITAL DE TASBIH

Baixe agora gratuitamente!`
  };

// Çince temel şablon
const zhData = {
  title: '礼拜时间: 唤礼 & 古兰经朗诵',
  shortDescription: '准确的穆斯林礼拜时间，宣礼提醒，古兰经集体诵读，朝向指南针与电子泰斯比赫。',
  fullDescription: `🕌 穆斯林礼拜时间专业版: 准确唤礼时间、集体古兰经诵读、克尔白朝向与数显赞念珠

📖 集体古兰经朗诵（通过WhatsApp分享30卷）
⏰ 精确的唤礼时间与阿赞提醒（100%离线可用）
🧭 高精度克尔白朝向指南针
📿 智能电子赞念珠（振动反馈）
🤲 每日圣训杜阿与祈祷词

立即免费下载！`
};

const exactMatchTranslations = {
  'en-US': enData,
  'af': {
    title: 'Gebedstye: Athan & Koran Pro',
    shortDescription: 'Akkurate Moslem-gebedstye, athan-alarm, Koran-khatam, qibla en tasbih.',
    fullDescription: `🕌 Gebedstye Pro: Akkurate Gebedstye, Athan, Groep Koran Khatam en Qibla\n\n📖 GROEP KORAN KHATAM (30 JUZ VIA WHATSAPP)\n⏰ AKKURATE GEBEDSTYE EN ATHAN (100% Vanlyn)\n🧭 AKKURATE QIBLA-KOMPAS\n📿 DIGITALE TASBIH\n\nLaai nou gratis af!`
  },
  'am': {
    title: 'የሶላት ሰዓት: አዛን እና ቁርአን ፕሮ',
    shortDescription: 'ትክክለኛ የሙስሊም ሶላት ሰዓታት፣ የአዛን ማንቂያ፣ የቁርአን ኻትም፣ ቂብላ እና ተስቢህ።',
    fullDescription: `🕌 የሶላት ሰዓት Pro: ትክክለኛ የሶላት ሰዓታት፣ አዛን፣ የቁርአን ኻትም እና ቂብላ\n\n📖 የቁርአን ኻትም በቡድን (30 ጁዝ በዋትስአፕ)\n⏰ ትክክለኛ የሶላት ሰዓታት እና አዛን (100% ከመስመር ውጭ)\n🧭 ትክክለኛ የቂብላ ኮምፓስ\n📿 ዲጂታል ተስቢህ\n\nአሁኑኑ በነፃ ያውርዱ!`
  },
  'ar': {
    title: 'أوقات الصلاة: الأذان والختمة',
    shortDescription: 'مواقيت صلاة دقيقة، تنبيه الأذان، ختمة القرآن الجماعية، قبلة وتسبيح.',
    fullDescription: `🕌 أوقات الصلاة برو: مواقيت الصلاة الدقيقة، الأذان، ختمة القرآن الكريم الجماعية، القبلة والتسبيح\n\n📖 ختمة القرآن الكريم الجماعية ومشاركة الأجزاء عبر واتساب\n⏰ مواقيت صلاة دقيقة وتنبيهات الأذان (يعمل 100% دون إنترنت)\n🧭 بوصلة القبلة الدقيقة نحو الكعبة المشرفة\n📿 المسبحة الإلكترونية الذكية وأذكار المسلم\n🤲 أدعية يومية وآيات قرآنية مباركة مع بطاقات للمشاركة\n📊 سجل قضاء الصلوات والصيام\n\nحمل التطبيق مجاناً الآن!`
  },
  'az-AZ': {
    title: 'Namaz Vaxtı: Azan & Xətm Pro',
    shortDescription: 'Dəqiq namaz vaxtları, azan səsi, onlayn xətm qrupu, qiblə və zikrmatik.',
    fullDescription: `🕌 Namaz Vaxtı Pro: Dəqiq Namaz Vaxtları, Azan Xatırlatması, Quran Xətmi və Qiblə Kompası\n\n📖 ONLAYN BİRGƏ QURAN XƏTMİ (WHATSAPP İLƏ 30 CÜZ BÖLÜŞÜMÜ)\n⏰ DƏQİQ NAMAZ VAXTLARI VƏ AZAN (100% Oflayn)\n🧭 DƏQİQ QİBLƏ KOMPASI\n📿 TİTRƏYİŞLİ AĞILLI ZİKİRMATİK\n🤲 GÜNDƏLİK ŞƏFA DUALARI VƏ AYƏLƏR\n\nİndi pulsuz yükləyin!`
  },
  'be': {
    title: 'Час Намазу: Азан & Каран Про',
    shortDescription: 'Дакладны расклад намазу, азан апавяшчэнні, хатм Карана, кібла і тасбіх.',
    fullDescription: `🕌 Час Намазу Про: Дакладны Расклад, Азан, Хатм Карана і Кібла\n\n📖 СУМЕСНЫ ХАТМ КАРАНА (30 ДЖУЗАЎ ПРАЗ WHATSAPP)\n⏰ ДАКЛАДНЫ ЧАС НАМАЗУ І АЗАН (100% Афлайн)\n🧭 ДАКЛАДНЫ КОМПАС КІБЛЫ\n📿 ЭЛЕКТРОННЫ ТАСБІХ\n\nСпампуйце бясплатна зараз!`
  },
  'bg': {
    title: 'Време за Намаз: Азан & Коран',
    shortDescription: 'Точно време за намаз, азан аларма, групов хатъм на Корана, къбла и броеница.',
    fullDescription: `🕌 Време за Намаз Про: Точно време, Азан, Хатъм на Корана и Къбла\n\n📖 ГРУПОВ ХАТЪМ НА КОРАНА (30 ДЖУЗА ЧРЕЗ WHATSAPP)\n⏰ ТОЧНО ВРЕМЕ ЗА НАМАЗ И АЗАН (100% Офлайн)\n🧭 ТОЧЕН КОМПАС ЗА КЪБЛА\n📿 ДИГИТАЛНА БРОЕНИЦА (ТАСБИХ)\n\nИзтеглете безплатно сега!`
  },
  'bn-BD': {
    title: 'নামাজের সময়সূচি: আজান ও খতম',
    shortDescription: 'সঠিক নামাজের সময়সূচি, আজান এলার্ম, গ্রুপ কোরআন খতম, কিবলা কম্পাস ও তাসবিহ।',
    fullDescription: `🕌 নামাজের সময়সূচি প্রো: নির্ভুল নামাজের সময়, আজান এলার্ম, গ্রুপ কোরআন খতম ও কিবলা\n\n📖 গ্রুপ কোরআন খতম ও ৩০ পারা বণ্টন (হোয়াটসঅ্যাপে)\n⏰ সঠিক নামাজের সময়সূচি ও আজান এলার্ম (১০০% অফলাইন)\n🧭 সঠিক কিবলা কম্পাস (কাবার দিক)\n📿 ডিজিটাল স্মার্ট তাসবিহ কাউন্টার\n🤲 দৈনন্দিন দোয়া ও সহিহ হাদিস\n\nএখনই বিনামূল্যে ডাউনলোড করুন!`
  },
  'ca': {
    title: 'Hores de Pregària: Athan',
    shortDescription: 'Horaris de pregària musulmana precisos, alarma athan, khatam de l\'Alcorà i alquibla.',
    fullDescription: `🕌 Hores de Pregària Pro: Horaris Precisos, Athan, Khatam de l\'Alcorà i Alquibla\n\n📖 KHATAM DE L\'ALCORÀ EN GRUP (30 JUZ PER WHATSAPP)\n⏰ HORARIS DE PREGÀRIA PRECISOS I ALARMA ATHAN (100% Offline)\n🧭 BRÚIXOLA DE L\'ALQUIBLA PRECISA\n📿 TASBIH DIGITAL\n\nDescarregueu-vos-el gratis ara!`
  },
  'cs-CZ': {
    title: 'Čas Modlitby: Azán & Korán Pro',
    shortDescription: 'Přesný čas modlitby, azán alarm, skupinový khatam Koránu, qibla a tasbíh.',
    fullDescription: `🕌 Čas Modlitby Pro: Přesné Časy Modliteb, Azán, Khatam Koránu a Qibla\n\n📖 SKUPINOVÝ KHATAM KORÁNU (30 DŽUZ PŘES WHATSAPP)\n⏰ PŘESNÉ ČASY MODLITEB A AZÁN (100% Offline)\n🧭 PŘESNÝ KOMPAS QIBLA\n📿 DIGITÁLNÍ TASBÍH\n\nStáhněte si zdarma nyní!`
  },
  'da-DK': {
    title: 'Bønnetider: Azan & Koranen Pro',
    shortDescription: 'Præcise muslimske bønnetider, azan alarm, gruppe Koran khatam, qibla og tasbih.',
    fullDescription: `🕌 Bønnetider Pro: Præcise Bønnetider, Azan, Gruppe Koran Khatam og Qibla\n\n📖 GRUPPE KORAN KHATAM (DEL 30 JUZ VIA WHATSAPP)\n⏰ PRÆCISE BØNNETIDER & AZAN (100% Offline)\n🧭 PRÆCIST QIBLA KOMPAS\n📿 DIGITAL TASBIH\n\nDownload gratis nu!`
  },
  'de-DE': {
    title: 'Gebetszeiten: Azan & Koran Pro',
    shortDescription: 'Genaue Gebetszeiten, Gebetsruf Azan, gemeinsames Koran Khatam, Qibla & Tasbih.',
    fullDescription: `🕌 Gebetszeiten Pro: Genaue Gebetszeiten, Azan-Alarm, Gruppen-Khatam, Qibla & Tasbih\n\n📖 GEMEINSAMES KORAN KHATAM (30 JUZ TEILEN VIA WHATSAPP)\n⏰ PRÄZISE GEBETSZEITEN & AZAN-ALARM (100% Offline)\n🧭 PRÄZISER QIBLA-KOMPASS\n📿 DIGITALER TASBIH-ZÄHLER MIT VIBRATION\n🤲 TÄGLICHE BITTGEBETE & KORANVERSE\n\nJetzt kostenlos herunterladen!`
  },
  'el-GR': {
    title: 'Ώρες Προσευχής: Αζάν & Κοράνι',
    shortDescription: 'Ακριβείς ώρες προσευχής, αζάν, ανάγνωση Κορανίου, κίμπλα και τασμπίχ.',
    fullDescription: `🕌 Ώρες Προσευχής Pro: Ακριβείς Ώρες Προσευχής, Αζάν, Χατάμ Κορανίου και Κίμπλα\n\n📖 ΟΜΑΔΙΚΟ ΧΑΤΑΜ ΚΟΡΑΝΙΟΥ (30 ΤΖΟΥΖ ΜΕΣΩ WHATSAPP)\n⏰ ΑΚΡΙΒΕΙΣ ΩΡΕΣ ΠΡΟΣΕΥΧΗΣ & ΑΖΑΝ (100% Εκτός σύνδεσης)\n🧭 ΑΚΡΙΒΗΣ ΠΥΞΙΔΑ ΚΙΜΠΛΑ\n📿 ΨΗΦΙΑΚΟ ΤΑΣΜΠΙΧ\n\nΚατεβάστε δωρεάν τώρα!`
  },
  'en-AU': enData,
  'en-CA': enData,
  'en-GB': enData,
  'en-IN': enData,
  'en-SG': enData,
  'en-ZA': enData,
  'es-419': esData,
  'es-ES': esData,
  'es-US': esData,
  'et': {
    title: 'Palveajad: Asaan & Koraan Pro',
    shortDescription: 'Täpsed moslemite palveajad, asaani alarm, Koraani lugemine, qibla ja tasbih.',
    fullDescription: `🕌 Palveajad Pro: Täpsed Palveajad, Asaan, Koraani Khatam ja Qibla\n\n📖 KORAANI KHATAM GRUPIS (30 DŽUZI WHATSAPIS)\n⏰ TÄPSED PALVEAJAD JA ASAAN (100% Võrguühenduseta)\n🧭 TÄPNE QIBLA KOMPASS\n📿 DIGITAALNE TASBIH\n\nLaadige tasuta alla nüüd!`
  },
  'eu-ES': {
    title: 'Otoitz Orduak: Azan & Korana',
    shortDescription: 'Musulmanen otoitz ordu zehatzak, azan alarma, Koranaren khatam eta qibla.',
    fullDescription: `🕌 Otoitz Orduak Pro: Otoitz Ordu Zehatzak, Azan, Koranaren Khatam eta Qibla\n\n📖 KORANAREN KHATAM TALDEAN (30 JUZ WHATSAPP BIDEZ)\n⏰ OTOITZ ORDU ZEHATZAK ETA AZAN (100% Lineaz kanpo)\n🧭 QIBLA IPARRORRATZA\n📿 TASBIH DIGITALA\n\nDeskargatu doan orain!`
  },
  'fa': {
    title: 'اوقات شرعی: اذان و ختم قرآن',
    shortDescription: 'اوقات شرعی دقیق، پخش اذان، ختم گروهی قرآن، قبله نما و ذکرشمار دیجیتال.',
    fullDescription: `🕌 اوقات شرعی پرو: اوقات نماز، اذان، ختم جمعی قرآن، قبله‌نما و صلوات‌شمار\n\n📖 ختم دسته جمعی قرآن و تقسیم ۳۰ جزء از طریق واتساپ\n⏰ اوقات شرعی دقیق و اعلان اذان (کاملاً آفلاین)\n🧭 قبله نمای دقیق به سمت مکه مکرمة\n📿 تسبیح و صلوات شمار هوشمند\n🤲 ادعیه روزانه و آیات شفابخش\n\nهم‌اکنون رایگان دانلود کنید!`
  },
  'fa-AE': {
    title: 'اوقات شرعی: اذان و ختم قرآن',
    shortDescription: 'اوقات شرعی دقیق، پخش اذان، ختم گروهی قرآن، قبله نما و ذکرشمار دیجیتال.',
    fullDescription: `🕌 اوقات شرعی پرو: اوقات نماز، اذان، ختم جمعی قرآن، قبله‌نما و صلوات‌شمار (امارات و خلیج فارس)\n\n📖 ختم دسته جمعی قرآن و تقسیم ۳۰ جزء از طریق واتساپ\n⏰ اوقات شرعی دقیق و اعلان اذان (کاملاً آفلاین)\n🧭 قبله نمای دقیق به سمت مکه مکرمة\n📿 تسبیح و صلوات شمار هوشمند\n\nهم‌اکنون رایگان دانلود کنید!`
  },
  'fa-AF': {
    title: 'اوقات شرعی: اذان و ختم قرآن',
    shortDescription: 'اوقات شرعی دقیق، پخش اذان، ختم گروهی قرآن، قبله نما و ذکرشمار دیجیتال.',
    fullDescription: `🕌 اوقات شرعی پرو: اوقات نماز، اذان، ختم جمعی قرآن، قبله‌نما و تسبیح (افغانستان)\n\n📖 ختم دسته جمعی قرآن و تقسیم ۳۰ جزء از طریق واتساپ\n⏰ اوقات شرعی دقیق و اعلان اذان (کاملاً آفلاین)\n🧭 قبله نمای دقیق به سمت مکه مکرمة\n📿 تسبیح و صلوات شمار هوشمند\n\nهم‌اکنون رایگان دانلود کنید!`
  },
  'fa-IR': {
    title: 'اوقات شرعی: اذان و ختم قرآن',
    shortDescription: 'اوقات شرعی دقیق، پخش اذان، ختم گروهی قرآن، قبله نما و ذکرشمار دیجیتال.',
    fullDescription: `🕌 اوقات شرعی پرو: اوقات نماز، اذان، ختم جمعی قرآن، قبله‌نما و صلوات‌شمار\n\n📖 ختم دسته جمعی قرآن و تقسیم ۳۰ جزء از طریق واتساپ\n⏰ اوقات شرعی دقیق و اعلان اذان (کاملاً آفلاین)\n🧭 قبله نمای دقیق به سمت مکه مکرمة\n📿 تسبیح و صلوات شمار هوشمند\n\nهم‌اکنون رایگان دانلود کنید!`
  },
  'fi-FI': {
    title: 'Rukousajat: Azan & Koraani Pro',
    shortDescription: 'Tarkat rukousajat, azan-hälytys, Koraanin yhteisluenta, qibla ja tasbih.',
    fullDescription: `🕌 Rukousajat Pro: Tarkat Rukousajat, Azan, Koraanin Khatam ja Qibla\n\n📖 KORAANIN KHATAM RYHMÄSSÄ (30 JUZ WHATSAPISSA)\n⏰ TARKAT RUKOUSAJAT JA AZAN (100% Offline)\n🧭 TARKKA QIBLA-KOMPASSI\n📿 DIGITAALINEN TASBIH\n\nLataa ilmaiseksi nyt!`
  },
  'fil': {
    title: 'Oras ng Dasal: Athan & Quran',
    shortDescription: 'Tumpak na oras ng dasal, alarma ng athan, khatam ng Quran, qibla at tasbih.',
    fullDescription: `🕌 Oras ng Pagdarasal Pro: Tumpak na Oras ng Dasal, Athan, Khatam ng Quran at Qibla\n\n📖 PANGKATANG KHATAM NG QURAN (IBAHAGI ANG 30 JUZ SA WHATSAPP)\n⏰ TUMPAK NA ORAS NG PAGDARASAL AT ALARMA NG ATHAN (100% Offline)\n🧭 TUMPAK NA KUMPAS NG QIBLA PATUNGO SA MECCA\n📿 SMART DIGITAL TASBIH NA MAY VIBRATION\n🤲 PANG-ARAW-ARAW NA DUA AT MGA TALATA NG QURAN\n\nI-download nang libre ngayon!`
  },
  'fr-CA': {
    title: 'Heures Prière: Athan & Coran',
    shortDescription: 'Heures de prière précises, alarme athan, khatam du Coran, qibla et tasbih.',
    fullDescription: `🕌 Heures de Prière Pro: Horaires Précis, Alarme Athan, Khatam du Coran en Groupe, Qibla & Tasbih\n\n📖 KHATAM DU CORAN EN GROUPE VIA WHATSAPP (30 JUZ)\n⏰ HORAIRES DE PRIÈRE PRÉCIS & ALARME ATHAN (100% Hors-ligne)\n🧭 BOUSSOLE DE LA QIBLA PRÉCISE\n📿 TASBIH NUMÉRIQUE INTELLIGENT\n\nTéléchargez gratuitement maintenant !`
  },
  'fr-FR': {
    title: 'Heures de Prière: Athan & Coran',
    shortDescription: 'Heures de prière précises, alarme athan, khatam du Coran en groupe, qibla & tasbih.',
    fullDescription: `🕌 Heures de Prière Pro: Horaires Précis, Alarme Athan, Khatam du Coran en Groupe, Qibla & Tasbih\n\n📖 KHATAM DU CORAN EN GROUPE VIA WHATSAPP (30 JUZ)\n⏰ HORAIRES DE PRIÈRE PRÉCIS & ALARME ATHAN (100% Hors-ligne)\n🧭 BOUSSOLE DE LA QIBLA PRÉCISE\n📿 TASBIH NUMÉRIQUE INTELLIGENT\n🤲 INVOCATIONS AUTHENTIQUES & CARTES DE DOUA\n\nTéléchargez gratuitement maintenant !`
  },
  'gl-ES': {
    title: 'Horas de Oración: Azán & Corán',
    shortDescription: 'Horarios de oración musulmá precisos, alarma azán, khatam do Corán e qibla.',
    fullDescription: `🕌 Horas de Oración Pro: Horarios Precisos, Azán, Khatam do Corán e Qibla\n\n📖 KHATAM DO CORÁN EN GRUPO (30 JUZ POR WHATSAPP)\n⏰ HORARIOS DE ORACIÓN PRECISOS E ALARMA AZÁN (100% Fóra de liña)\n🧭 BRÚXULA DA QUIBLA PRECISA\n📿 TASBIH DIXITAL\n\nDescarga gratis agora!`
  },
  'gu': {
    title: 'નમાઝનો સમય: અઝાન અને કુરાન',
    shortDescription: 'સચોટ નમાઝનો સમય, અઝાન એલાર્મ, ગ્રુપ કુરાન ખતમ, કિબલા અને ડિજિટલ તસ્બીહ.',
    fullDescription: `🕌 નમાઝ પ્રો: સચોટ નમાઝ સમય, અઝાન, કુરાન ખતમ અને કિબલા\n\n📖 ગ્રુપ કુરાન ખતમ (WhatsApp દ્વારા 30 જુઝ શેર કરો)\n⏰ સચોટ નમાઝ સમય અને અઝાન (100% ઑફલાઇન)\n🧭 કિબલા હોકાયંત્ર\n📿 ડિજિટલ તસ્બીહ\n\nહમણાં જ મફત ડાઉનલોડ કરો!`
  },
  'hi-IN': {
    title: 'नमाज़ का समय: अज़ान और क़ुरआन',
    shortDescription: 'सटीक नमाज़ का समय, अज़ान अलार्म, ग्रुप क़ुरआन ख़त्म, क़िबला और डिजिटल तस्बीह।',
    fullDescription: `🕌 नमाज़ प्रो: सटीक नमाज़ के औक़ात, अज़ान अलार्म, ग्रुप क़ुरआन ख़त्म और क़िबला\n\n📖 ग्रुप क़ुरआन ख़त्म और 30 पारों का बँटवारा (व्हाट्सएप द्वारा)\n⏰ सटीक नमाज़ का समय और अज़ान (100% ऑफ़लाइन)\n🧭 सटीक क़िबला कंपास (काबा की दिशा)\n📿 डिजिटल तस्बीह और मसनून दुआएं\n\nअभी मुफ़्त डाउनलोड करें!`
  },
  'hr': {
    title: 'Vaktija: Ezan & Kuran Pro',
    shortDescription: 'Točno vrijeme namaza, ezan alarm, zajednička hatma Kurana, kibla i tespih.',
    fullDescription: `🕌 Vaktija Pro: Točno Vrijeme Namaza, Ezan, Hatma Kurana i Kibla Kompas\n\n📖 ZAJEDNIČKA HATMA KURANA (PODJELA 30 DŽUZOVA PREKO WHATSAPP-A)\n⏰ TOČNO VRIJEME NAMAZA & EZAN (100% Offline)\n🧭 KOMPAS ZA KIBLU\n📿 DIGITALNI TESPIH\n\nPreuzmite besplatno sada!`
  },
  'hu-HU': {
    title: 'Ima Idők: Azan & Korán Pro',
    shortDescription: 'Pontos iszlám ima idők, azan riasztás, csoportos Korán khatam, kibla és tasbih.',
    fullDescription: `🕌 Ima Idők Pro: Pontos Ima Idők, Azan, Csoportos Korán Khatam és Kibla\n\n📖 CSOPORTOS KORÁN KHATAM (30 JUZ MEGOSZTÁSA WHATSAPPON)\n⏰ PONTOS IMA IDŐK ÉS AZAN (100% Offline)\n🧭 PONTOS KIBLA IRÁNYTŰ\n📿 DIGITÁLIS TASBIH\n\nTöltse le ingyen most!`
  },
  'hy-AM': {
    title: 'Աղոթքի Ժամեր: Ազան & Ղուրան',
    shortDescription: 'Աղոթքի ճշգրիտ ժամեր, ազանի ահազանգ, Ղուրանի ընթերցում, քիբլա և թասբիհ:',
    fullDescription: `🕌 Աղոթքի Ժամեր Pro: Ճշգրիտ Աղոթքի Ժամեր, Ազան, Ղուրան և Քիբլա\n\n📖 ՂՈՒՐԱՆԻ ԽԱԹՄ ԽՄԲՈՎ (30 ՋՈՒԶ WHATSAPP-ՈՎ)\n⏰ ՃՇԳՐԻՏ ԱՂՈԹՔԻ ԺԱՄԵՐ ԵՎ ԱԶԱՆ (100% Օֆլայն)\n🧭 ՔԻԲԼԱՅԻ ԿՈՂՄՆԱՑՈՒՅՑ\n📿 ԹՎԱՅԻՆ ԹԱՍԲԻՀ\n\nՆերբեռնեք անվճար հիմա!`
  },
  'id': {
    title: 'Jadwal Sholat: Adzan & Khatam',
    shortDescription: 'Jadwal sholat akurat, alarm adzan, khatam Quran bersama, kiblat & tasbih.',
    fullDescription: `🕌 Jadwal Sholat Pro: Waktu Sholat Akurat, Alarm Adzan, Khatam Quran Bersama, Arah Kiblat & Tasbih Digital\n\n📖 KHATAMAN QURAN BERSAMA & BAGI JUZ LEWAT WHATSAPP\n⏰ WAKTU SHOLAT AKURAT & ALARM ADZAN (100% Offline)\n🧭 KOMPAS KIBLAT AKURAT KE ARAH KA'BAH\n📿 TASBIH DIGITAL PINTAR DENGAN GETARAN TAKTIL\n🤲 DOA HARIAN & AYAT SHAHIH BERGAMBAR\n📊 PENCATAT SHOLAT & PUASA QADHA\n\nUnduh sekarang gratis!`
  },
  'is-IS': {
    title: 'Bænastundir: Athan & Kóraninn',
    shortDescription: 'Nákvæmar bænastundir múslima, athan viðvörun, Kóraninn khatam, qibla og tasbih.',
    fullDescription: `🕌 Bænastundir Pro: Nákvæmar Bænastundir, Athan, Kóraninn Khatam og Qibla\n\n📖 KÓRANINN KHATAM Í HÓPI (30 JUZ Í GEGNUM WHATSAPP)\n⏰ NÁKVÆMAR BÆNASTUNDIR OG ATHAN (100% Ótengt)\n🧭 NÁKVÆR QIBLA ÁTTAVITI\n📿 STAFRÆNT TASBIH\n\nSæktu ókeypis núna!`
  },
  'it-IT': {
    title: 'Orari Preghiera: Adhan, Corano',
    shortDescription: 'Orari di preghiera islamica precisi, allarme adhan, khatam del Corano e qibla.',
    fullDescription: `🕌 Orari di Preghiera Pro: Orari Precisi, Adhan, Khatam del Corano in Gruppo e Qibla\n\n📖 KHATAM DEL CORANO IN GRUPPO (30 JUZ SU WHATSAPP)\n⏰ ORARI DI PREGHIERA PRECISI E ALLARME ADHAN (100% Offline)\n🧭 BUSSOLA DELLA QIBLA ACCURATA\n📿 TASBIH DIGITALE CON VIBRAZIONE\n\nScarica ora gratuitamente!`
  },
  'iw-IL': {
    title: 'זמני תפילה: אד\'אן וקוראן פרו',
    shortDescription: 'זמני תפילה מוסלמיים מדויקים, התראת אד\'אן, קריאת קוראן קבוצתית, קיבלה ותסביח.',
    fullDescription: `🕌 זמני תפילה Pro: זמני תפילה מדויקים, אד'אן, חאתם קוראן וקיבלה\n\n📖 חאתם קוראן קבוצתי (שיתוף 30 ג'וז בוואטסאפ)\n⏰ זמני תפילה מדויקים ואד'אן (100% אופליין)\n🧭 מצפן קיבלה מדויק\n📿 תסביח דיגיטלי\n\nהורד בחינם עכשיו!`
  },
  'ja-JP': {
    title: '礼拝時間: アザーン & クルアーン',
    shortDescription: '正確なイスラム礼拝時間、アザーン通知、クルアーン読誦、キブラコンパスとタスビフ。',
    fullDescription: `🕌 礼拝時間 Pro: 正確な礼拝時間、アザーン、グループ・クルアーン読誦、キブラとタスビフ\n\n📖 グループ・クルアーン読誦（WhatsAppで30巻を共有）\n⏰ 正確な礼拝時間とアザーン音声通知（100%オフライン対応）\n🧭 メッカの方向を示す高精度キブラコンパス\n📿 触覚バイブレーション付きデジタル・タスビフ\n🤲 毎日のドゥアーと聖典クルアーンの章句\n\n今すぐ無料でダウンロード！`
  },
  'ka-GE': {
    title: 'ლოცვის დრო: აზანი & ყურანი',
    shortDescription: 'ზუსტი მუსლიმური ლოცვის დრო, აზანი, ყურანის ხათმი, ქიბლა და თასბიჰი.',
    fullDescription: `🕌 ლოცვის დრო Pro: ზუსტი ლოცვის დრო, აზანი, ყურანის ხათმი და ქიბლა\n\n📖 ყურანის ხათმი ჯგუფში (30 ჯუზი WHATSAPP-ით)\n⏰ ზუსტი ლოცვის დრო და აზანი (100% ოფლაინ)\n🧭 ქიბლას კომპასი\n📿 ციფრული თასბიჰი\n\nჩამოტვირთეთ უფასოდ ახლავე!`
  },
  'kk': {
    title: 'Намаз Уақыты: Азан & Құран',
    shortDescription: 'Дәл намаз уақыттары, азан дабылы, топтық Құран хатым, құбыла және тәспі.',
    fullDescription: `🕌 Намаз Уақыты Про: Дәл намаз кестесі, Азан, Құран хатым тобы, Құбыла және Тәспі\n\n📖 ТОПТЫҚ ҚҰРАН ХАТЫМ ЖӘНЕ 30 ПАРА БӨЛУ (WHATSAPP)\n⏰ ДӘЛ НАМАЗ УАҚЫТТАРЫ ЖӘНЕ АЗАН ДАБЫЛЫ (Офлайн)\n🧭 ҚҰБЫЛА КОМПАСЫ\n📿 ЫҢҒАЙЛЫ ЦИФРЛЫҚ ТӘСПІ\n🤲 КҮНДЕЛІКТІ ДҰҒАЛАР МЕН АЯТТАР\n\nҚазір тегін жүктеп алыңыз!`
  },
  'km-KH': {
    title: 'ម៉ោងសឡាត: អាហ្សាន & គួរអាន',
    shortDescription: 'ម៉ោងសឡាតត្រឹមត្រូវ សំឡេងអាហ្សាន ខាត់តាំគួរអានរួមគ្នា ត្រីវិស័យគីបឡា និងតាសប៊ី។',
    fullDescription: `🕌 ម៉ោងសឡាត Pro: ម៉ោងសឡាតត្រឹមត្រូវ សំឡេងអាហ្សាន ខាត់តាំគួរអាន និងគីបឡា\n\n📖 ខាត់តាំគួរអានជាក្រុម (ចែករំលែក 30 ជុសតាម WhatsApp)\n⏰ ម៉ោងសឡាតច្បាស់លាស់ (100% Offline)\n🧭 ត្រីវិស័យគីបឡា\n📿 តាសប៊ីឌីជីថល\n\nទាញយកដោយឥតគិតថ្លៃឥឡូវនេះ!`
  },
  'kn-IN': {
    title: 'ನಮಾಜ್ ಸಮಯ: ಅಜಾನ್ & ಕುರಾನ್',
    shortDescription: 'ನಿಖರವಾದ ನಮಾಜ್ ಸಮಯಗಳು, ಅಜಾನ್ ಅಲಾರಾಂ, ಗ್ರೂಪ್ ಕುರಾನ್ ಖತಮ್, ಕಿಬ್ಲಾ ಮತ್ತು ತಸ್ಬೀಹ್.',
    fullDescription: `🕌 ನಮಾಜ್ ಸಮಯ ಪ್ರೊ: ನಿಖರವಾದ ನಮಾಜ್ ಸಮಯಗಳು, ಅಜಾನ್, ಕುರಾನ್ ಖತಮ್ ಮತ್ತು ಕಿಬ್ಲಾ\n\n📖 ಗ್ರೂಪ್ ಕುರಾನ್ ಖತಮ್ (WhatsApp ಮೂಲಕ 30 ಜುಜ್ ಹಂಚಿಕೆ)\n⏰ ನಿಖರವಾದ ನಮಾಜ್ ಸಮಯಗಳು (100% ಆಫ್‌ಲೈನ್)\n🧭 ಕಿಬ್ಲಾ ದಿಕ್ಸೂಚಿ\n📿 ಡಿಜಿಟಲ್ ತಸ್ಬೀಹ್\n\nಈಗಲೇ ಉಚಿತವಾಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ!`
  },
  'ko-KR': {
    title: '예배 시간: 아잔 & 꾸란 프로',
    shortDescription: '정확한 이슬람 기도 시간, 아잔 알람, 그룹 꾸란 완독, 키블라 나침반 및 타스비.',
    fullDescription: `🕌 이슬람 기도 시간 Pro: 정확한 예배 시간, 아잔 알림, 그룹 꾸란 하탐, 키블라 나침반\n\n📖 그룹 꾸란 완독 및 30주즈 공유 (WhatsApp)\n⏰ GPS 기반 정확한 기도 시간 및 아잔 알람 (100% 오프라인)\n🧭 정확한 메카 키블라 나침반\n📿 스마트 디지털 타스비 (진동 카운터)\n🤲 매일의 두아 및 꾸란 구절\n\n지금 무료로 다운로드하세요!`
  },
  'ky-KG': {
    title: 'Намаз Убактысы: Азан & Куран',
    shortDescription: 'Так намаз убактылары, азан үнү, Куран хатм тобу, кыбыла жана санарип тасбих.',
    fullDescription: `🕌 Намаз Убактысы Про: Так Намаз Убактылары, Азан, Куран Хатм жана Кыбыла\n\n📖 ТОП МЕНЕН КУРАН ХАТМ КЫЛУУ (WHATSAPP АРКЫЛУУ 30 ПАРА)\n⏰ ТАК НАМАЗ УБАКТЫЛАРЫ ЖАНА АЗАН (100% Офлайн)\n🧭 КЫБЫЛА КОМПАСЫ\n📿 САНАРИП ТАСБИХ\n\nАзыр бекер жүктөп алыңыз!`
  },
  'lo-LA': {
    title: 'ເວລາລະຫມາດ: ອາຊານ & ກຸຣອານ',
    shortDescription: 'ເວລາລະຫມາດທີ່ຖືກຕ້ອງ, ສຽງເຕືອນອາຊານ, ອ່ານກຸຣອານເປັນກຸ່ມ, ທິດກິບລາ.',
    fullDescription: `🕌 ເວລາລະຫມາດ Pro: ເວລາລະຫມາດທີ່ຖືກຕ້ອງ, ອາຊານ, ຄາທໍາກຸຣອານ ແລະ ກິບລາ\n\n📖 ອ່ານກຸຣອານເປັນກຸ່ມ (ແບ່ງ 30 ຢຸສຜ່ານ WhatsApp)\n⏰ ເວລາລະຫມາດທີ່ຖືກຕ້ອງ (100% Offline)\n🧭 ເຂັມທິດກິບລາ\n📿 ທັສບີດິຈິຕອນ\n\nດາວໂຫລດຟຣີດຽວນີ້!`
  },
  'lt': {
    title: 'Maldos Laikas: Azanas, Koranas',
    shortDescription: 'Tikslus maldos laikas, azano signalas, Korano skaitymas, qibla ir tasbih.',
    fullDescription: `🕌 Maldos Laikas Pro: Tikslus Maldos Laikas, Azanas, Korano Khatamas ir Qibla\n\n📖 KORANO KHATAMAS GRUPĖJE (30 DŽUZ PER WHATSAPP)\n⏰ TIKSLUS MALDOS LAIKAS IR AZANAS (100% Neprisijungus)\n🧭 TIKSLUS QIBLA KOMPASAS\n📿 SKAITMENINIS TASBIH\n\nAtsisiųskite nemokamai dabar!`
  },
  'lv': {
    title: 'Lūgšanu Laiki: Azans & Korāns',
    shortDescription: 'Precīzi lūgšanu laiki, azana modinātājs, Korāna lasīšana, qibla un tasbih.',
    fullDescription: `🕌 Lūgšanu Laiki Pro: Precīzi Lūgšanu Laiki, Azans, Korāna Khatam un Qibla\n\n📖 KORĀNA KHATAM GRUPĀ (30 DŽUZ CAUR WHATSAPP)\n⏰ PRECĪZI LŪGŠANU LAIKI UN AZANS (100% Bezsaistē)\n🧭 PRECĪZS QIBLA KOMPASS\n📿 DIGITĀLAIS TASBIH\n\nLejupielādējiet bez maksas tūlīt!`
  },
  'mk-MK': {
    title: 'Време за Намаз: Езан & Куран',
    shortDescription: 'Точно време за намаз, езан аларм, групна хатма на Куранот, кибла и теспих.',
    fullDescription: `🕌 Време за Намаз Про: Точно Време, Езан, Хатма на Куранот и Кибла\n\n📖 ГРУПНА ХАТМА НА КУРАНОТ (30 ЏУЗОВИ ПРЕКУ WHATSAPP)\n⏰ ТОЧНО ВРЕМЕ ЗА НАМАЗ И ЕЗАН (100% Офлајн)\n🧭 ТОЧЕН КОМПАС ЗА КИБЛА\n📿 ДИГИТАЛЕН ТЕСПИХ\n\nПреземете бесплатно сега!`
  },
  'ml-IN': {
    title: 'നമസ്കാര സമയം: ബാങ്ക് & ഖുർആൻ',
    shortDescription: 'കൃത്യമായ നമസ്കാര സമയം, ബാങ്ക് അലാറം, ഖുർആൻ ഖതം, ഖിബ്ല കോമ്പസ് & തസ്ബീഹ്.',
    fullDescription: `🕌 നമസ്കാര സമയം പ്രോ: കൃത്യമായ നമസ്കാര സമയം, ബാങ്ക്, ഖുർആൻ ഖതം, ഖിബ്ല\n\n📖 ഗ്രൂപ്പ് ഖുർആൻ ഖതം (വാട്ട്‌സ്ആപ്പിൽ 30 ജുസ് പങ്കിടുക)\n⏰ കൃത്യമായ നമസ്കാര സമയങ്ങൾ (100% ഓഫ്‌ലൈൻ)\n🧭 കൃത്യമായ ഖിബ്ല കോമ്പസ്\n📿 ഡിജിറ്റൽ തസ്ബീഹ്\n\nഇപ്പോൾ സൗജന്യമായി ഡൗൺലോഡ് ചെയ്യുക!`
  },
  'mn-MN': {
    title: 'Залбирлын Цаг: Азан & Коран',
    shortDescription: 'Залбирлын цаг, азан дохиолол, Коран судар унших, кибла болон тасбих.',
    fullDescription: `🕌 Залбирлын Цаг Pro: Залбирлын Нарийн Цаг, Азан, Коран Хатм ба Кибла\n\n📖 БҮЛГИЙН КОРАН ХАТМ (WHATSAPP-ААР 30 ЖУЗ ХУВААЛЦАХ)\n⏰ ЗАЛБИРЛЫН ЦАГ БА АЗАН (100% Офлайн)\n🧭 КИБЛА ЛУУЖИН\n📿 ДИЖИТАЛ ТАСБИХ\n\nОдоо үнэгүй татаж аваарай!`
  },
  'mr-IN': {
    title: 'नमाजची वेळ: अझान आणि कुराण',
    shortDescription: 'अचूक नमाजच्या वेळा, अझान अलार्म, ग्रुप कुराण खतम, किबला आणि डिजिटल तस्बीह.',
    fullDescription: `🕌 नमाज प्रो: अचूक नमाजच्या वेळा, अझान, कुराण खतम आणि किबला\n\n📖 ग्रुप कुराण खतम (WhatsApp द्वारे ३० सिपारह शेअर करा)\n⏰ अचूक नमाजच्या वेळा (१००% ऑफलाइन)\n🧭 किबला होकायंत्र\n📿 डिजिटल तस्बीह\n\nआत्ताच मोफत डाउनलोड करा!`
  },
  'ms': {
    title: 'Waktu Solat: Azan & Khatam',
    shortDescription: 'Waktu solat tepat, azan, kumpulan khatam Quran, kiblat & tasbih digital.',
    fullDescription: `🕌 Waktu Solat Pro: Waktu Solat Tepat, Panggilan Azan, Khatam Quran Berkumpulan & Kiblat\n\n📖 KHATAM QURAN BERKUMPULAN & AGIHAN 30 JUZUK\n⏰ WAKTU SOLAT TEPAT & LAUNGAN AZAN (100% Luar Talian)\n🧭 KOMPAS KIBLAT TEPAT KE ARAH KAABAH\n📿 TASBIH DIGITAL DENGAN GETARAN TAKTIL\n🤲 DOA HARIAN & AYAT PILIHAN\n\nMuat turun secara percuma sekarang!`
  },
  'ms-MY': {
    title: 'Waktu Solat: Azan & Khatam',
    shortDescription: 'Waktu solat tepat, azan, kumpulan khatam Quran, kiblat & tasbih digital.',
    fullDescription: `🕌 Waktu Solat Pro: Waktu Solat Tepat, Panggilan Azan, Khatam Quran Berkumpulan & Kiblat\n\n📖 KHATAM QURAN BERKUMPULAN & AGIHAN 30 JUZUK\n⏰ WAKTU SOLAT TEPAT & LAUNGAN AZAN (100% Luar Talian)\n🧭 KOMPAS KIBLAT TEPAT KE ARAH KAABAH\n📿 TASBIH DIGITAL DENGAN GETARAN TAKTIL\n\nMuat turun percuma sekarang!`
  },
  'my-MM': {
    title: 'နမားဇ်အချိန်: အဇာန် & ကုရ်အာန်',
    shortDescription: 'တိကျသော မွတ်စလင်နမားဇ်အချိန်၊ အဇာန်သံ၊ ကုရ်အာန်ခသမ်၊ ကိဗ်လာနှင့် တာစ်ဗီ။',
    fullDescription: `🕌 နမားဇ်အချိန် Pro: တိကျသော နမားဇ်အချိန်များ၊ အဇာန်၊ ကုရ်အာန်ခသမ်နှင့် ကိဗ်လာ\n\n📖 အုပ်စုလိုက် ကုရ်အာန်ခသမ် ပြုလုပ်ခြင်း (WhatsApp မှ ၃၀ ဂျုဇ် မျှဝေခြင်း)\n⏰ တိကျသော နမားဇ်အချိန်များနှင့် အဇာန် (၁၀၀% အော့ဖ်လိုင်း)\n🧭 ကိဗ်လာ သံလိုက်အိမ်မြှောင်\n📿 ဒစ်ဂျစ်တယ် တာစ်ဗီ\n\nယခု အခမဲ့ ဒေါင်းလုဒ်ရယူပါ!`
  },
  'ne-NP': {
    title: 'नमाज समय: अजान र कुरान प्रो',
    shortDescription: 'सटीक नमाज समय, अजान अलार्म, समूह कुरान खतम, किबला र डिजिटल तस्बीह।',
    fullDescription: `🕌 नमाज समय Pro: सटीक नमाज समय, अजान, कुरान खतम र किबला\n\n📖 समूह कुरान खतम (WhatsApp मार्फत ३० पारा बाँड्नुहोस्)\n⏰ सटीक नमाज समय र अजान (१००% अफलाइन)\n🧭 किबला कम्पास\n📿 डिजिटल तस्बीह\n\nअहिले निःशुल्क डाउनलोड गर्नुहोस्!`
  },
  'nl-NL': {
    title: 'Gebedstijden: Azan & Koran Pro',
    shortDescription: 'Nauwkeurige gebedstijden, azan alarm, groep Koran khatam, qibla & tasbih.',
    fullDescription: `🕌 Gebedstijden Pro: Nauwkeurige Gebedstijden, Azan, Groep Koran Khatam, Qibla & Tasbih\n\n📖 GROEP KORAN KHATAM & 30 JUZ DELEN VIA WHATSAPP\n⏰ NAUWKEURIGE GEBEDSTIJDEN & AZAN ALARM (100% Offline)\n🧭 NAUWKEURIG QIBLA KOMPAS\n📿 DIGITALE TASBIH TELLER\n\nDownload nu gratis!`
  },
  'no-NO': {
    title: 'Bønnetider: Azan & Koranen Pro',
    shortDescription: 'Nøyaktige bønnetider, azan-alarm, felles Koran-khatam, qibla og tasbih.',
    fullDescription: `🕌 Bønnetider Pro: Nøyaktige Bønnetider, Azan, Gruppe Koran Khatam og Qibla\n\n📖 GRUPPE KORAN KHATAM (DEL 30 JUZ VIA WHATSAPP)\n⏰ NØYAKTIGE BØNNETIDER & AZAN (100% Frakoblet)\n🧭 NØYAKTIG QIBLA-KOMPASS\n📿 DIGITAL TASBIH MED VIBRASJON\n\nLast ned gratis nå!`
  },
  'pa': {
    title: 'ਨਮਾਜ਼ ਦਾ ਸਮਾਂ: ਅਜ਼ਾਨ & ਕੁਰਾਨ',
    shortDescription: 'ਸਹੀ ਨਮਾਜ਼ ਦੇ ਸਮੇਂ, ਅਜ਼ਾਨ ਅਲਾਰਮ, ਗਰੁੱਪ ਕੁਰਾਨ ਖਤਮ, ਕਿਬਲਾ ਅਤੇ ਡਿਜੀਟਲ ਤਸਬੀਹ।',
    fullDescription: `🕌 ਨਮਾਜ਼ ਪ੍ਰੋ: ਸਹੀ ਨਮਾਜ਼ ਦੇ ਸਮੇਂ, ਅਜ਼ਾਨ, ਕੁਰਾਨ ਖਤਮ ਅਤੇ ਕਿਬਲਾ\n\n📖 ਗਰੁੱਪ ਕੁਰਾਨ ਖਤਮ (WhatsApp ਰਾਹੀਂ 30 ਸਿਪਾਰੇ ਵੰਡੋ)\n⏰ ਸਹੀ ਨਮਾਜ਼ ਦੇ ਸਮੇਂ ਅਤੇ ਅਜ਼ਾਨ (100% ਆਫ਼ਲਾਈਨ)\n🧭 ਕਿਬਲਾ ਕੰਪਾਸ\n📿 ਡਿਜੀਟਲ ਤਸਬੀਹ\n\nਹੁਣੇ ਮੁਫ਼ਤ ਡਾਊਨਲੋਡ ਕਰੋ!`
  },
  'pl-PL': {
    title: 'Czas Modlitwy: Azan & Koran',
    shortDescription: 'Dokładny czas modlitwy muzułmańskiej, alarm azan, khatam Koranu, qibla i tasbih.',
    fullDescription: `🕌 Czas Modlitwy Pro: Dokładne Godziny Modlitw, Azan, Khatam Koranu i Qibla\n\n📖 GRUPOWY KHATAM KORANU (30 DŻUZ PRZEZ WHATSAPP)\n⏰ DOKŁADNE CZASY MODLITW I AZAN (100% Offline)\n🧭 PRECYZYJNY KOMPAS QIBLA\n📿 CYFROWY TASBIH\n\nPobierz teraz za darmo!`
  },
  'pt-BR': ptData,
  'pt-PT': ptData,
  'rm': {
    title: 'Uras da Preghiera: Azan',
    shortDescription: 'Uras da preghiera precisas, alarm d\'azan, khatam dal Coran, qibla e tasbih.',
    fullDescription: `🕌 Uras da Preghiera Pro: Uras Precisas, Azan, Khatam dal Coran e Qibla\n\n📖 KHATAM DAL CORAN EN GRUP (30 JUZ VIA WHATSAPP)\n⏰ URAS PRECISAS & AZAN (100% Offline)\n🧭 CUMPAS DA LA QIBLA\n📿 TASBIH DIGITAL\n\nTelechargiai gratuitamain ussa!`
  },
  'ro': {
    title: 'Ore de Rugăciune: Azan & Coran',
    shortDescription: 'Ore exacte de rugăciune islamică, alarmă azan, khatamul Coranului și qibla.',
    fullDescription: `🕌 Ore de Rugăciune Pro: Ore Exacte, Azan, Khatamul Coranului și Qibla\n\n📖 KHATAMUL CORANULUI ÎN GRUP (30 JUZ PRIN WHATSAPP)\n⏰ ORE DE RUGĂCIUNE EXACTE ȘI AZAN (100% Offline)\n🧭 BUSOLĂ PENTRU QIBLA\n📿 TASBIH DIGITAL\n\nDescărcați gratuit acum!`
  },
  'ru-RU': {
    title: 'Время Намаза: Азан & Коран',
    shortDescription: 'Точное расписание намаза, азан, совместный хатм Корана, кибла и тасбих.',
    fullDescription: `🕌 Время Намаза Про: Точное расписание, Азан, Совместный Хатм Корана, Кибла и Тасбих\n\n📖 СОВМЕСТНЫЙ ХАТМ КОРАНА И РАСПРЕДЕЛЕНИЕ 30 ДЖУЗОВ ЧЕРЕЗ WHATSAPP\n⏰ ТОЧНОЕ ВРЕМЯ НАМАЗА И АЗАН (100% Работает без интернета)\n🧭 ТОЧНЫЙ КОМПАС КИБЛЫ\n📿 ЭЛЕКТРОННЫЙ ТАСБИХ\n🤲 ЕЖЕДНЕВНЫЕ ДУА И АЯТЫ ИЗ КОРАНА\n\nСкачайте бесплатно прямо сейчас!`
  },
  'si-LK': {
    title: 'සලාත් වේලාවන්: අසාන් & කුරානය',
    shortDescription: 'නිවැරදි මුස්ලිම් සලාත් වේලාවන්, අසාන් අනතුරු ඇඟවීම, කුරාන් ඛතම් සහ කිබ්ලා.',
    fullDescription: `🕌 සලාත් වේලාවන් Pro: නිවැරදි සලාත් වේලාවන්, අසාන්, කුරාන් ඛතම් සහ කිබ්ලා\n\n📖 සමූහ කුරාන් ඛතම් (WhatsApp හරහා 30 ජුස් බෙදාගන්න)\n⏰ නිවැරදි සලාත් වේලාවන් (100% නොබැඳි)\n🧭 කිබ්ලා මාලිමාව\n📿 ඩිජිටල් තස්බීහ්\n\nදැන් නොමිලේ බාගන්න!`
  },
  'sk': {
    title: 'Čas Modlitby: Azan & Korán Pro',
    shortDescription: 'Presný čas modlitby, azan alarm, skupinový khatam Koránu, qibla a tasbih.',
    fullDescription: `🕌 Čas Modlitby Pro: Presné Časy Modlitieb, Azan, Khatam Koránu a Qibla\n\n📖 SKUPINOVÝ KHATAM KORÁNU (30 DŽUZ CEZ WHATSAPP)\n⏰ PRESNÉ ČASY MODLITIEB A AZAN (100% Offline)\n🧭 PRESNÝ KOMPAS QIBLA\n📿 DIGITÁLNY TASBIH\n\nStiahnite si zadarmo teraz!`
  },
  'sl': {
    title: 'Čas Molitve: Azan & Koran Pro',
    shortDescription: 'Natančen čas molitve, azan alarm, skupinski khatam Korana, kibla in tasbih.',
    fullDescription: `🕌 Čas Molitve Pro: Natančni Časi Molitve, Azan, Khatam Korana in Kibla\n\n📖 SKUPINSKI KHATAM KORANA (30 DŽUZ PREKO WHATSAPP-A)\n⏰ NATANČEN ČAS MOLITVE IN AZAN (100% Brez povezave)\n🧭 NATANČEN KOMPAS KIBLE\n📿 DIGITALNI TASBIH\n\nPrenesite brezplačno zdaj!`
  },
  'sq': {
    title: 'Vaktet e Namazit: Ezan & Kuran',
    shortDescription: 'Vaktet e sakta të namazit, alarmi i ezanit, hatme e Kuranit, kibla dhe tesbih.',
    fullDescription: `🕌 Vaktet e Namazit Pro: Vaktet e Sakta, Ezani, Hatme e Përbashkët e Kuranit dhe Kibla\n\n📖 HATME E PËRBASHKËT E KURANIT (30 XHUZ ME WHATSAPP)\n⏰ VAKTET E SAKTA TË NAMAZIT DHE EZANI (100% Offline)\n🧭 BUSULLA E KIBLES DREJT QABES\n📿 TESBIH DIXHITAL SMART\n\nShkarkoni falas tani!`
  },
  'sr': {
    title: 'Vaktija: Ezan & Kuran Pro',
    shortDescription: 'Tačna vaktija za namaz, ezan alarm, zajednička hatma Kurana, kibla i tespih.',
    fullDescription: `🕌 Vaktija Pro: Tačna Vaktija, Ezan Alarm, Zajednička Hatma Kurana i Kibla\n\n📖 ZAJEDNIČKA HATMA KURANA (PODJELA 30 DŽUZOVA PREKO WHATSAPPA)\n⏰ TAČNO VRIJEME NAMAZA I EZAN (100% Offline)\n🧭 PRECIZAN KOMPAS ZA KIBLU\n📿 DIGITALNI TESPIH\n\nPreuzmite besplatno sada!`
  },
  'sv-SE': {
    title: 'Bönetider: Azan & Koranen Pro',
    shortDescription: 'Exakta bönetider, azan alarm, grupp Koranen khatam, qibla kompass & tasbih.',
    fullDescription: `🕌 Bönetider Pro: Exakta Bönetider, Azan, Gemensam Koranen Khatam och Qibla\n\n📖 GEMENSAM KORANEN KHATAM (30 JUZ VIA WHATSAPP)\n⏰ EXAKTA BÖNETIDER & AZAN ALARM (100% Offline)\n🧭 EXAKT QIBLA-KOMPASS\n📿 DIGITAL TASBIH MED VIBRATION\n\nLadda ner gratis nu!`
  },
  'sw': {
    title: 'Nyakati za Sala: Azan & Quran',
    shortDescription: 'Nyakati sahihi za sala, kengele ya azan, khatam ya Quran, kibla na tasbihi.',
    fullDescription: `🕌 Nyakati za Sala Pro: Nyakati Sahihi za Sala, Azan, Khatam ya Quran na Kibla\n\n📖 KHATAM YA QURAN KWA KIKUNDI (GAWA JUZUU 30 KUPITIA WHATSAPP)\n⏰ NYAKATI SAHIHI ZA SALA NA AZAN (100% Bila Mtandao)\n🧭 DIRA SAHIHI YA KIBLA KUELEKEA MAKKAH\n📿 TASBIHI YA KIDIJITALI\n\nPakua bure sasa!`
  },
  'ta-IN': {
    title: 'தொழுகை நேரம்: பாங்கு & குரான்',
    shortDescription: 'துல்லியமான தொழுகை நேரங்கள், பாங்கு அலாரம், குழு குரான் கத்ம், கிப்லா & தஸ்பீஹ்.',
    fullDescription: `🕌 தொழுகை நேரம் ப்ரோ: துல்லியமான தொழுகை நேரங்கள், பாங்கு, குர்ஆன் கத்ம் மற்றும் கிப்லா\n\n📖 குழு குர்ஆன் கத்ம் மற்றும் 30 ஜூஸ் பகிர்வு (WhatsApp)\n⏰ துல்லியமான தொழுகை நேரங்கள் & பாங்கு (100% ஆஃப்லைன்)\n🧭 கிப்லா திசைகாட்டி\n📿 டிஜிட்டல் தஸ்பீஹ்\n\nஇலவசமாக பதிவிறக்கவும்!`
  },
  'te-IN': {
    title: 'నమాజ్ సమయం: అజాన్ & ఖురాన్',
    shortDescription: 'ఖచ్చితమైన నమాజ్ సమయాలు, అజాన్ అలారం, గ్రూప్ ఖురాన్ ఖతం, కిబ్లా & తస్బీహ్.',
    fullDescription: `🕌 నమాజ్ సమయం ప్రో: ఖచ్చితమైన నమాజ్ సమయాలు, అజాన్, ఖురాన్ ఖతం & కిబ్లా\n\n📖 గ్రూప్ ఖురాన్ ఖతం (WhatsApp ద్వారా 30 జుజ్ పంపిణీ)\n⏰ ఖచ్చితమైన నమాజ్ సమయాలు (100% ఆఫ్‌లైన్)\n🧭 కిబ్లా దిక్సూచి\n📿 డిజిటల్ తస్బీహ్\n\nఇప్పుడే ఉచితంగా డౌన్‌లోడ్ చేసుకోండి!`
  },
  'th': {
    title: 'เวลาละหมาด: อาซาน & อัลกุรอาน',
    shortDescription: 'เวลาละหมาดที่แม่นยำ, เสียงแจ้งเตือนอาซาน, คอตัมกุรอานเป็นกลุ่ม, กิบลัตและตัสบีฮ์',
    fullDescription: `🕌 เวลาละหมาด Pro: เวลาละหมาดที่แม่นยำ, อาซาน, คอตัมกุรอาน และทิศกิบลัต\n\n📖 คอตัมกุรอานเป็นกลุ่ม (แบ่ง 30 ยุซผ่าน WhatsApp)\n⏰ เวลาละหมาดที่แม่นยำและเสียงอาซาน (ออฟไลน์ 100%)\n🧭 เข็มทิศกิบลัตชี้ไปยังมักกะฮ์\n📿 ตัสบีฮ์ดิจิทัล\n\nดาวน์โหลดฟรีตอนนี้!`
  },
  'tr-TR': {
    title: 'Ezan Vakti: Namaz & Hatim Pro',
    shortDescription: 'Diyanet ezan vakti, namaz saatleri, online hatim, kıble pusulası ve zikirmatik.',
    fullDescription: `🕌 Ezan Vakti Pro: Diyanet Namaz Vakitleri, Birlikte Online Hatim, Zikirmatik ve Şifa Duaları\n\nEzan Vakti Pro, Türkiye ve dünyadaki tüm şehirler için Diyanet İşleri Başkanlığı ile %100 uyumlu ezan vakitlerini sunan, aileniz ve sevdiklerinizle birlikte hatim indirmenizi sağlayan en gelişmiş İslami ibadet uygulamasıdır.\n\n📖 BİRLİKTE ONLİNE HATİM & CÜZ PAYLAŞIMI\n• WhatsApp ile tek tıkla 30 cüzü paylaştırın, canlı takip edin.\n⏰ DİYANET UYUMLU KESİN NAMAZ VAKİTLERİ & EZAN ALARMI (100% Offline)\n🧭 HASSAS KIBLE PUSULASI & KIBLE BULUCU\n📿 DOKUNSAL AKILLI ZİKİRMATİK & TESBİHAT\n🤲 GÜNLÜK ŞİFA DUALARI & KUR'AN AYETLERİ\n📊 KAZA TAKİBİ & CUMA KARTLARI\n\nHemen ücretsiz indirin!`
  },
  'uk': {
    title: 'Час Намазу: Азан & Коран Про',
    shortDescription: 'Точний розклад намазу, сповіщення азану, спільний хатм Корану, кібла і тасбіх.',
    fullDescription: `🕌 Час Намазу Про: Точний розклад, Азан, Спільний Хатм Корану та Кібла\n\n📖 СПІЛЬНИЙ ХАТМ КОРАНУ (30 ДЖУЗІВ ЧЕРЕЗ WHATSAPP)\n⏰ ТОЧНИЙ ЧАС НАМАЗУ ТА АЗАН (100% Офлайн)\n🧭 ТОЧНИЙ КОМПАС КІБЛИ\n📿 ЕЛЕКТРОННИЙ ТАСБІХ\n\nЗавантажте безкоштовно зараз!`
  },
  'ur': {
    title: 'نماز کے اوقات: اذان اور ختم',
    shortDescription: 'درست نماز کے اوقات، اذان کے الارم، گروپ قرآن ختم، قبلہ نما اور ڈیجیٹل تسبیح۔',
    fullDescription: `🕌 نماز پرو: درست اوقات نماز، اذان الارم، گروپ قرآن ختم، قبلہ نما اور تسبیح\n\n📖 گروپ قرآن ختم اور 30 پارے کی تقسیم بذریعہ واٹس ایپ\n⏰ درست اوقات نماز اور اذان الرٹ (مکمل آف لائن)\n🧭 انتہائی درست قبلہ نما (رخ کعبہ)\n📿 سمارٹ ڈیجیٹل تسبیح اور مسنون دعائیں\n📊 قضا نمازوں اور روزوں کا ریکارڈ\n\nابھی مفت ڈاؤن لوڈ کریں!`
  },
  'vi': {
    title: 'Giờ Cầu Nguyện: Athan & Quran',
    shortDescription: 'Giờ cầu nguyện Hồi giáo chính xác, báo thức Athan, đọc kinh Quran, la bàn Qibla.',
    fullDescription: `🕌 Giờ Cầu Nguyện Pro: Thời Gian Cầu Nguyện Chính Xác, Athan, Khatam Quran và Qibla\n\n📖 ĐỌC KHATAM KINH QURAN THEO NHÓM (CHIA SẺ 30 JUZ QUA WHATSAPP)\n⏰ GIỜ CẦU NGUYỆN CHÍNH XÁC & BÁO THỨC ATHAN (100% Ngoại tuyến)\n🧭 LA BÀN QIBLA CHÍNH XÁC\n📿 CHUỖI HẠT TASBIH KỸ THUẬT SỐ\n\nTải xuống miễn phí ngay bây giờ!`
  },
  'zh-CN': zhData,
  'zh-HK': zhData,
  'zh-TW': zhData,
  'zu': {
    title: 'Izikhathi Zomkhuleko: Athan',
    shortDescription: 'Izikhathi zomkhuleko wamaSulumane, i-alamu ye-athan, i-qibla ne-tasbih.',
    fullDescription: `🕌 Izikhathi Zomkhuleko Pro: Izikhathi Eziqondile, Athan, Khatam ye-Quran ne-Qibla\n\n📖 KHATAM YE-QURAN NGEQEMBU (YABELA AMA-JUZ ANGU-30 KU-WHATSAPP)\n⏰ IZIKHATHI EZIQONDILE NE-ATHAN (100% Offline)\n🧭 IKHOMPASI YE-QIBLA EQONDILE\n📿 I-TASBIH YEDIDJITHALI\n\nLanda mahhala manje!`
  }
};

// 1. EXACT MATCH CSV

// Otomatik Sınır Denetimi ve Güvenlik Kırpma (Google Play Console 30 / 80 / 4000)
for (const [langKey, langObj] of Object.entries(exactMatchTranslations)) {
  if (langObj.title && [...langObj.title].length > 30) {
    langObj.title = [...langObj.title].slice(0, 30).join('');
  }
  if (langObj.shortDescription && [...langObj.shortDescription].length > 80) {
    langObj.shortDescription = [...langObj.shortDescription].slice(0, 80).join('');
  }
  if (langObj.fullDescription && [...langObj.fullDescription].length > 4000) {
    langObj.fullDescription = [...langObj.fullDescription].slice(0, 4000).join('');
  }
}

const csvRows = [
  ['Language', 'Title', 'Short description', 'Full description']
];

for (const [lang, data] of Object.entries(exactMatchTranslations)) {
  const escapeCsv = (str) => `"${str.replace(/"/g, '""')}"`;
  csvRows.push([
    lang,
    escapeCsv(data.title),
    escapeCsv(data.shortDescription),
    escapeCsv(data.fullDescription)
  ]);
}

const csvContent = csvRows.map(row => row.join(',')).join('\n');
const csvPath = path.join(outputDir, 'google_play_exact_match_all.csv');
fs.writeFileSync(csvPath, csvContent, 'utf-8');
console.log(`✅ GOOGLE PLAY KONSOLU İLE %100 BİREBİR EŞLEŞEN CSV OLUŞTURULDU: ${csvPath} (${Object.keys(exactMatchTranslations).length} Dil)`);

// 2. EXACT MATCH ZIP
const zipDir = path.join(outputDir, 'zip_exact_match');
if (!fs.existsSync(zipDir)) fs.mkdirSync(zipDir, { recursive: true });

for (const [lang, data] of Object.entries(exactMatchTranslations)) {
  const langDir = path.join(zipDir, lang);
  if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });

  fs.writeFileSync(path.join(langDir, 'title.txt'), data.title, 'utf-8');
  fs.writeFileSync(path.join(langDir, 'short-description.txt'), data.shortDescription, 'utf-8');
  fs.writeFileSync(path.join(langDir, 'full-description.txt'), data.fullDescription, 'utf-8');
}

try {
  const zipPath = path.join(outputDir, 'google_play_exact_match_all.zip');
  execSync(`powershell -Command "Compress-Archive -Path '${zipDir}\\*' -DestinationPath '${zipPath}' -Force"`);
  console.log(`✅ EXACT MATCH ZIP OLUŞTURULDU: ${zipPath}`);
} catch (e) {
  console.warn('ZIP hatası:', e.message);
}
