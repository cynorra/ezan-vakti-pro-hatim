// Adds the worldwide-location and calculation-method strings to every locale.
// Order per row: selectCity, selectDistrict, searchCity, searchDistrict, useGps, useGpsHint, turkeyCities, calcMethod, calcMethodAuto
import fs from 'node:fs';
import path from 'node:path';

const T = {
  tr: ['Şehir Seç', '{{city}} - İlçe Seç', 'Şehir ara...', 'İlçe ara...', 'Konumumu kullan', 'Dünyanın her yerinde GPS ile doğru vakitler', 'Türkiye şehirleri', 'Hesaplama yöntemi', 'Otomatik'],
  en: ['Select City', '{{city}} - Select District', 'Search city...', 'Search district...', 'Use my location', 'Accurate times anywhere in the world via GPS', 'Cities in Turkey', 'Calculation method', 'Automatic'],
  ar: ['اختر المدينة', '{{city}} - اختر المنطقة', 'ابحث عن مدينة...', 'ابحث عن منطقة...', 'استخدم موقعي', 'أوقات دقيقة في أي مكان في العالم عبر GPS', 'مدن تركيا', 'طريقة الحساب', 'تلقائي'],
  fa: ['انتخاب شهر', '{{city}} - انتخاب منطقه', 'جستجوی شهر...', 'جستجوی منطقه...', 'استفاده از موقعیت من', 'اوقات دقیق در هر نقطه از جهان با GPS', 'شهرهای ترکیه', 'روش محاسبه', 'خودکار'],
  ur: ['شہر منتخب کریں', '{{city}} - ضلع منتخب کریں', 'شہر تلاش کریں...', 'ضلع تلاش کریں...', 'میرا مقام استعمال کریں', 'GPS کے ذریعے دنیا بھر میں درست اوقات', 'ترکی کے شہر', 'حساب کا طریقہ', 'خودکار'],
  de: ['Stadt wählen', '{{city}} - Bezirk wählen', 'Stadt suchen...', 'Bezirk suchen...', 'Meinen Standort verwenden', 'Genaue Zeiten weltweit per GPS', 'Städte in der Türkei', 'Berechnungsmethode', 'Automatisch'],
  fr: ['Choisir une ville', '{{city}} - Choisir un district', 'Rechercher une ville...', 'Rechercher un district...', 'Utiliser ma position', 'Horaires précis partout dans le monde grâce au GPS', 'Villes de Turquie', 'Méthode de calcul', 'Automatique'],
  es: ['Elegir ciudad', '{{city}} - Elegir distrito', 'Buscar ciudad...', 'Buscar distrito...', 'Usar mi ubicación', 'Horarios precisos en todo el mundo con GPS', 'Ciudades de Turquía', 'Método de cálculo', 'Automático'],
  it: ['Scegli città', '{{city}} - Scegli distretto', 'Cerca città...', 'Cerca distretto...', 'Usa la mia posizione', 'Orari precisi in tutto il mondo tramite GPS', 'Città della Turchia', 'Metodo di calcolo', 'Automatico'],
  ru: ['Выберите город', '{{city}} - Выберите район', 'Поиск города...', 'Поиск района...', 'Использовать моё местоположение', 'Точное время в любой точке мира по GPS', 'Города Турции', 'Метод расчёта', 'Автоматически'],
  uk: ['Оберіть місто', '{{city}} - Оберіть район', 'Пошук міста...', 'Пошук району...', 'Використати моє місцезнаходження', 'Точний час у будь-якій точці світу через GPS', 'Міста Туреччини', 'Метод розрахунку', 'Автоматично'],
  pl: ['Wybierz miasto', '{{city}} - Wybierz dzielnicę', 'Szukaj miasta...', 'Szukaj dzielnicy...', 'Użyj mojej lokalizacji', 'Dokładne godziny na całym świecie dzięki GPS', 'Miasta w Turcji', 'Metoda obliczeń', 'Automatycznie'],
  nl: ['Kies stad', '{{city}} - Kies district', 'Zoek stad...', 'Zoek district...', 'Mijn locatie gebruiken', 'Nauwkeurige tijden wereldwijd via gps', 'Steden in Turkije', 'Berekeningsmethode', 'Automatisch'],
  pt: ['Escolher cidade', '{{city}} - Escolher distrito', 'Buscar cidade...', 'Buscar distrito...', 'Usar minha localização', 'Horários precisos em qualquer lugar do mundo via GPS', 'Cidades da Turquia', 'Método de cálculo', 'Automático'],
  sv: ['Välj stad', '{{city}} - Välj distrikt', 'Sök stad...', 'Sök distrikt...', 'Använd min plats', 'Exakta tider var som helst i världen via GPS', 'Städer i Turkiet', 'Beräkningsmetod', 'Automatisk'],
  el: ['Επιλογή πόλης', '{{city}} - Επιλογή περιοχής', 'Αναζήτηση πόλης...', 'Αναζήτηση περιοχής...', 'Χρήση της τοποθεσίας μου', 'Ακριβείς ώρες σε όλο τον κόσμο μέσω GPS', 'Πόλεις της Τουρκίας', 'Μέθοδος υπολογισμού', 'Αυτόματα'],
  hu: ['Város kiválasztása', '{{city}} - Kerület kiválasztása', 'Város keresése...', 'Kerület keresése...', 'Saját helyzetem használata', 'Pontos idők a világ bármely pontján GPS-szel', 'Törökországi városok', 'Számítási módszer', 'Automatikus'],
  bg: ['Изберете град', '{{city}} - Изберете район', 'Търсене на град...', 'Търсене на район...', 'Използвай местоположението ми', 'Точни времена навсякъде по света чрез GPS', 'Градове в Турция', 'Метод на изчисление', 'Автоматично'],
  ro: ['Alege orașul', '{{city}} - Alege districtul', 'Caută oraș...', 'Caută district...', 'Folosește locația mea', 'Ore exacte oriunde în lume prin GPS', 'Orașe din Turcia', 'Metodă de calcul', 'Automat'],
  bs: ['Odaberi grad', '{{city}} - Odaberi općinu', 'Traži grad...', 'Traži općinu...', 'Koristi moju lokaciju', 'Tačna vremena bilo gdje u svijetu putem GPS-a', 'Gradovi u Turskoj', 'Metoda izračuna', 'Automatski'],
  az: ['Şəhər seçin', '{{city}} - Rayon seçin', 'Şəhər axtar...', 'Rayon axtar...', 'Məkanımı istifadə et', 'GPS ilə dünyanın hər yerində dəqiq vaxtlar', 'Türkiyə şəhərləri', 'Hesablama üsulu', 'Avtomatik'],
  uz: ['Shaharni tanlang', '{{city}} - Tumanni tanlang', 'Shahar qidirish...', 'Tuman qidirish...', 'Joylashuvimdan foydalanish', 'GPS orqali dunyoning istalgan joyida aniq vaqtlar', 'Turkiya shaharlari', 'Hisoblash usuli', 'Avtomatik'],
  kk: ['Қаланы таңдаңыз', '{{city}} - Ауданды таңдаңыз', 'Қала іздеу...', 'Аудан іздеу...', 'Орналасқан жерімді пайдалану', 'GPS арқылы әлемнің кез келген жерінде дәл уақыт', 'Түркия қалалары', 'Есептеу әдісі', 'Автоматты'],
  id: ['Pilih Kota', '{{city}} - Pilih Kecamatan', 'Cari kota...', 'Cari kecamatan...', 'Gunakan lokasi saya', 'Waktu salat akurat di mana pun lewat GPS', 'Kota di Turki', 'Metode perhitungan', 'Otomatis'],
  ms: ['Pilih Bandar', '{{city}} - Pilih Daerah', 'Cari bandar...', 'Cari daerah...', 'Guna lokasi saya', 'Waktu solat tepat di mana-mana melalui GPS', 'Bandar di Turki', 'Kaedah pengiraan', 'Automatik'],
  bn: ['শহর নির্বাচন করুন', '{{city}} - এলাকা নির্বাচন করুন', 'শহর খুঁজুন...', 'এলাকা খুঁজুন...', 'আমার অবস্থান ব্যবহার করুন', 'GPS-এর মাধ্যমে বিশ্বের যেকোনো স্থানে সঠিক সময়', 'তুরস্কের শহর', 'গণনা পদ্ধতি', 'স্বয়ংক্রিয়'],
  hi: ['शहर चुनें', '{{city}} - ज़िला चुनें', 'शहर खोजें...', 'ज़िला खोजें...', 'मेरा स्थान उपयोग करें', 'GPS से दुनिया में कहीं भी सटीक समय', 'तुर्की के शहर', 'गणना विधि', 'स्वचालित'],
  zh: ['选择城市', '{{city}} - 选择区县', '搜索城市...', '搜索区县...', '使用我的位置', '通过 GPS 在全球任何地方获取准确时间', '土耳其城市', '计算方法', '自动'],
  ja: ['都市を選択', '{{city}} - 地区を選択', '都市を検索...', '地区を検索...', '現在地を使用', 'GPSで世界中どこでも正確な時刻', 'トルコの都市', '計算方法', '自動'],
  ko: ['도시 선택', '{{city}} - 지역 선택', '도시 검색...', '지역 검색...', '내 위치 사용', 'GPS로 전 세계 어디서나 정확한 시간', '터키 도시', '계산 방법', '자동'],
};

const dir = path.resolve('lib/i18n/locales');
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const lang = file.replace('.json', '');
  const v = T[lang];
  if (!v) throw new Error(`No translation for ${lang}`);
  const full = path.join(dir, file);
  const json = JSON.parse(fs.readFileSync(full, 'utf8'));
  json.location = {
    ...(json.location ?? {}),
    selectCity: v[0], selectDistrict: v[1], searchCity: v[2], searchDistrict: v[3],
    useGps: v[4], useGpsHint: v[5], turkeyCities: v[6],
  };
  json.settings = { ...(json.settings ?? {}), calcMethod: v[7], calcMethodAuto: v[8] };
  fs.writeFileSync(full, JSON.stringify(json, null, 2) + '\n');
  console.log('updated', lang);
}
