// Adds religiousDays.* strings (card title, type labels, day names) to every locale.
// Row: [title, kandil, eid, other, estimated, regaib, threeMonths, mirac, berat, ramadanStart, kadir, arafah, ramadanEid, kurbanEid, hijriNewYear, ashura, mevlid]
import fs from 'node:fs';
import path from 'node:path';

const T = {
  tr: ['ÖNEMLİ GÜNLER', 'Kandil Gecesi', 'Dini Bayram', 'Mübarek Gün', 'tahmini', 'Regaib Kandili', 'Üç Ayların Başlangıcı', 'Miraç Kandili', 'Berat Kandili', 'Ramazan Başlangıcı', 'Kadir Gecesi', 'Arefe', 'Ramazan Bayramı ({{day}}. Gün)', 'Kurban Bayramı ({{day}}. Gün)', 'Hicri Yılbaşı', 'Aşure Günü', 'Mevlid Kandili'],
  en: ['IMPORTANT DAYS', 'Blessed Night', 'Eid', 'Blessed Day', 'estimated', 'Laylat al-Raghaib', 'Start of the Three Holy Months', "Laylat al-Mi'raj", "Laylat al-Bara'ah", 'Start of Ramadan', 'Laylat al-Qadr', 'Day of Arafah', 'Eid al-Fitr (Day {{day}})', 'Eid al-Adha (Day {{day}})', 'Islamic New Year', 'Day of Ashura', 'Mawlid an-Nabi'],
  ar: ['أيام مهمة', 'ليلة مباركة', 'عيد', 'يوم مبارك', 'تقريبي', 'ليلة الرغائب', 'بداية الأشهر الثلاثة', 'ليلة الإسراء والمعراج', 'ليلة النصف من شعبان', 'بداية رمضان', 'ليلة القدر', 'يوم عرفة', 'عيد الفطر (اليوم {{day}})', 'عيد الأضحى (اليوم {{day}})', 'رأس السنة الهجرية', 'يوم عاشوراء', 'المولد النبوي'],
  fa: ['روزهای مهم', 'شب مبارک', 'عید', 'روز مبارک', 'تقریبی', 'لیلة الرغائب', 'آغاز ماه‌های سه‌گانه', 'شب معراج', 'شب نیمه شعبان', 'آغاز رمضان', 'شب قدر', 'روز عرفه', 'عید فطر (روز {{day}})', 'عید قربان (روز {{day}})', 'آغاز سال هجری قمری', 'روز عاشورا', 'میلاد پیامبر'],
  ur: ['اہم دن', 'مبارک رات', 'عید', 'مبارک دن', 'تخمینی', 'لیلۃ الرغائب', 'تین مقدس مہینوں کا آغاز', 'شبِ معراج', 'شبِ برات', 'رمضان کا آغاز', 'شبِ قدر', 'یومِ عرفہ', 'عید الفطر (دن {{day}})', 'عید الاضحیٰ (دن {{day}})', 'اسلامی نیا سال', 'یومِ عاشور', 'عید میلاد النبی'],
  de: ['WICHTIGE TAGE', 'Gesegnete Nacht', 'Fest', 'Gesegneter Tag', 'geschätzt', 'Regaib-Nacht', 'Beginn der drei heiligen Monate', "Nacht der Himmelfahrt (Mi'radsch)", 'Berat-Nacht', 'Beginn des Ramadan', 'Nacht der Bestimmung (Qadr)', 'Tag von Arafat', 'Ramadanfest (Tag {{day}})', 'Opferfest (Tag {{day}})', 'Islamisches Neujahr', 'Aschura-Tag', 'Geburt des Propheten (Mawlid)'],
  fr: ['JOURS IMPORTANTS', 'Nuit bénie', 'Aïd', 'Jour béni', 'estimé', 'Nuit de Raghaib', 'Début des trois mois sacrés', "Nuit du Mi'raj", "Nuit de la Bara'a", 'Début du Ramadan', 'Nuit du Destin', "Jour d'Arafat", 'Aïd al-Fitr (jour {{day}})', 'Aïd al-Adha (jour {{day}})', "Nouvel an de l'Hégire", 'Achoura', 'Mawlid'],
  es: ['DÍAS IMPORTANTES', 'Noche bendita', 'Eid', 'Día bendito', 'estimado', 'Noche de Raghaib', 'Inicio de los tres meses sagrados', "Noche del Mi'raj", "Noche de Bara'a", 'Inicio del Ramadán', 'Noche del Destino', 'Día de Arafat', 'Eid al-Fitr (día {{day}})', 'Eid al-Adha (día {{day}})', 'Año Nuevo islámico', 'Día de Ashura', 'Mawlid'],
  it: ['GIORNI IMPORTANTI', 'Notte benedetta', 'Eid', 'Giorno benedetto', 'stimato', 'Notte di Raghaib', 'Inizio dei tre mesi sacri', "Notte del Mi'raj", "Notte di Bara'a", 'Inizio del Ramadan', 'Notte del Destino', 'Giorno di Arafat', 'Eid al-Fitr (giorno {{day}})', 'Eid al-Adha (giorno {{day}})', 'Capodanno islamico', 'Giorno di Ashura', 'Mawlid'],
  ru: ['ВАЖНЫЕ ДНИ', 'Благословенная ночь', 'Праздник', 'Благословенный день', 'примерно', 'Ночь Рагаиб', 'Начало трёх священных месяцев', 'Ночь Мирадж', "Ночь Бараат", 'Начало Рамадана', 'Ночь Предопределения', 'День Арафа', 'Ураза-байрам (день {{day}})', 'Курбан-байрам (день {{day}})', 'Исламский Новый год', 'День Ашура', 'Мавлид'],
  uk: ['ВАЖЛИВІ ДНІ', 'Благословенна ніч', 'Свято', 'Благословенний день', 'приблизно', 'Ніч Рагаїб', 'Початок трьох священних місяців', 'Ніч Мірадж', 'Ніч Бараат', 'Початок Рамадану', 'Ніч Предопределення', 'День Арафа', 'Ураза-байрам (день {{day}})', 'Курбан-байрам (день {{day}})', 'Ісламський Новий рік', 'День Ашура', 'Мавлід'],
  pl: ['WAŻNE DNI', 'Błogosławiona noc', 'Święto', 'Błogosławiony dzień', 'szacunkowo', 'Noc Raghaib', 'Początek trzech świętych miesięcy', "Noc Mi'radż", "Noc Bara'a", 'Początek Ramadanu', 'Noc Przeznaczenia', 'Dzień Arafat', 'Id al-Fitr (dzień {{day}})', 'Id al-Adha (dzień {{day}})', 'Nowy Rok islamski', 'Dzień Aszury', 'Maulid'],
  nl: ['BELANGRIJKE DAGEN', 'Gezegende nacht', 'Feest', 'Gezegende dag', 'geschat', 'Nacht van Raghaib', 'Begin van de drie heilige maanden', "Nacht van de Mi'raj", "Nacht van Bara'a", 'Begin van de ramadan', 'Nacht van de Beschikking', 'Dag van Arafat', 'Suikerfeest (dag {{day}})', 'Offerfeest (dag {{day}})', 'Islamitisch nieuwjaar', 'Asjoera', 'Mawlid'],
  pt: ['DIAS IMPORTANTES', 'Noite abençoada', 'Eid', 'Dia abençoado', 'estimado', 'Noite de Raghaib', 'Início dos três meses sagrados', "Noite do Mi'raj", "Noite de Bara'a", 'Início do Ramadã', 'Noite do Decreto', 'Dia de Arafat', 'Eid al-Fitr (dia {{day}})', 'Eid al-Adha (dia {{day}})', 'Ano Novo islâmico', 'Dia de Ashura', 'Mawlid'],
  sv: ['VIKTIGA DAGAR', 'Välsignad natt', 'Högtid', 'Välsignad dag', 'uppskattat', 'Raghaib-natten', 'De tre heliga månadernas början', "Mi'raj-natten", "Bara'a-natten", 'Ramadan börjar', 'Laylat al-Qadr', 'Arafadagen', 'Eid al-Fitr (dag {{day}})', 'Eid al-Adha (dag {{day}})', 'Islamiskt nyår', 'Ashura', 'Mawlid'],
  el: ['ΣΗΜΑΝΤΙΚΕΣ ΗΜΕΡΕΣ', 'Ευλογημένη νύχτα', 'Γιορτή', 'Ευλογημένη ημέρα', 'εκτίμηση', 'Νύχτα Ραγκαΐμπ', 'Αρχή των τριών ιερών μηνών', 'Νύχτα Μιράτζ', 'Νύχτα Μπαράα', 'Αρχή του Ραμαζανιού', 'Νύχτα της Δύναμης', 'Ημέρα Αραφάτ', 'Ιντ αλ-Φιτρ (ημέρα {{day}})', 'Ιντ αλ-Άντχα (ημέρα {{day}})', 'Ισλαμικό νέο έτος', 'Ημέρα Ασούρα', 'Μαουλίντ'],
  hu: ['FONTOS NAPOK', 'Áldott éjszaka', 'Ünnep', 'Áldott nap', 'becsült', 'Raghaib éjszakája', 'A három szent hónap kezdete', "Mi'rádzs éjszakája", "Bará'a éjszakája", 'A ramadán kezdete', 'A Hatalom éjszakája', 'Arafát napja', 'Íd al-Fitr ({{day}}. nap)', 'Íd al-Adha ({{day}}. nap)', 'Iszlám újév', 'Asúra napja', 'Mavlid'],
  bg: ['ВАЖНИ ДНИ', 'Благословена нощ', 'Празник', 'Благословен ден', 'приблизително', 'Нощта Регаиб', 'Начало на трите свещени месеца', 'Нощта Мирадж', 'Нощта Берат', 'Начало на Рамадан', 'Нощта на предопределението', 'Ден на Арафат', 'Рамазан байрам (ден {{day}})', 'Курбан байрам (ден {{day}})', 'Ислямска Нова година', 'Ден Ашура', 'Мевлид'],
  ro: ['ZILE IMPORTANTE', 'Noapte binecuvântată', 'Sărbătoare', 'Zi binecuvântată', 'estimat', 'Noaptea Raghaib', 'Începutul celor trei luni sfinte', "Noaptea Mi'raj", "Noaptea Bara'a", 'Începutul Ramadanului', 'Noaptea Destinului', 'Ziua Arafat', 'Eid al-Fitr (ziua {{day}})', 'Eid al-Adha (ziua {{day}})', 'Anul Nou islamic', 'Ziua Așura', 'Mawlid'],
  bs: ['VAŽNI DANI', 'Mubarek noć', 'Bajram', 'Mubarek dan', 'procjena', 'Lejletu-r-regaib', 'Početak tri sveta mjeseca', "Lejletu-l-mi'radž", 'Lejletu-l-berat', 'Početak ramazana', 'Lejletu-l-kadr', 'Dan Arefata', 'Ramazanski bajram ({{day}}. dan)', 'Kurban-bajram ({{day}}. dan)', 'Hidžretska Nova godina', 'Dan Ašure', 'Mevlud'],
  az: ['MÜHÜM GÜNLƏR', 'Mübarək gecə', 'Bayram', 'Mübarək gün', 'təxmini', 'Rəğaib gecəsi', 'Üç ayların başlanğıcı', 'Merac gecəsi', 'Bərat gecəsi', 'Ramazanın başlanğıcı', 'Qədr gecəsi', 'Ərəfə', 'Ramazan bayramı ({{day}}. gün)', 'Qurban bayramı ({{day}}. gün)', 'Hicri yeni il', 'Aşura günü', 'Mövlud'],
  uz: ['MUHIM KUNLAR', 'Muborak kecha', 'Hayit', 'Muborak kun', 'taxminiy', 'Rag‘oib kechasi', 'Uch muborak oy boshlanishi', "Me'roj kechasi", 'Barot kechasi', 'Ramazon boshlanishi', 'Qadr kechasi', 'Arafa kuni', 'Ramazon hayiti ({{day}}-kun)', 'Qurbon hayiti ({{day}}-kun)', 'Hijriy yangi yil', 'Ashuro kuni', 'Mavlud'],
  kk: ['МАҢЫЗДЫ КҮНДЕР', 'Қасиетті түн', 'Айт', 'Қасиетті күн', 'шамамен', 'Рағайып түні', 'Үш айдың басталуы', 'Миғраж түні', 'Бараат түні', 'Рамазанның басталуы', 'Қадір түні', 'Арафа күні', 'Ораза айт ({{day}}-күн)', 'Құрбан айт ({{day}}-күн)', 'Хижри жаңа жыл', 'Ашура күні', 'Мәуліт'],
  id: ['HARI PENTING', 'Malam Mulia', 'Hari Raya', 'Hari Mulia', 'perkiraan', 'Malam Raghaib', 'Awal Tiga Bulan Suci', "Isra Mi'raj", "Malam Nisfu Sya'ban", 'Awal Ramadhan', 'Lailatul Qadar', 'Hari Arafah', 'Idul Fitri (hari ke-{{day}})', 'Idul Adha (hari ke-{{day}})', 'Tahun Baru Islam', 'Hari Asyura', 'Maulid Nabi'],
  ms: ['HARI PENTING', 'Malam Mulia', 'Hari Raya', 'Hari Mulia', 'anggaran', 'Malam Raghaib', 'Permulaan Tiga Bulan Suci', "Israk Mikraj", "Malam Nisfu Syaaban", 'Awal Ramadan', 'Lailatulqadar', 'Hari Arafah', 'Aidilfitri (hari ke-{{day}})', 'Aidiladha (hari ke-{{day}})', 'Maal Hijrah', 'Hari Asyura', 'Maulidur Rasul'],
  bn: ['গুরুত্বপূর্ণ দিন', 'বরকতময় রাত', 'ঈদ', 'বরকতময় দিন', 'আনুমানিক', 'লাইলাতুর রাগাইব', 'তিন পবিত্র মাসের শুরু', 'শবে মেরাজ', 'শবে বরাত', 'রমজানের শুরু', 'শবে কদর', 'আরাফাহ দিবস', 'ঈদুল ফিতর ({{day}} দিন)', 'ঈদুল আজহা ({{day}} দিন)', 'হিজরি নববর্ষ', 'আশুরা', 'ঈদে মিলাদুন্নবী'],
  hi: ['महत्वपूर्ण दिन', 'मुबारक रात', 'ईद', 'मुबारक दिन', 'अनुमानित', 'लैलतुल रग़ाइब', 'तीन पवित्र महीनों की शुरुआत', 'शब-ए-मेराज', 'शब-ए-बरात', 'रमज़ान की शुरुआत', 'शब-ए-क़द्र', 'अरफ़ा का दिन', 'ईद-उल-फ़ित्र (दिन {{day}})', 'ईद-उल-अज़हा (दिन {{day}})', 'इस्लामी नया साल', 'आशूरा', 'मीलाद-उन-नबी'],
  zh: ['重要日子', '吉庆之夜', '会礼节日', '吉庆之日', '预估', '赖加伊布之夜', '三个圣月开始', '登霄夜', '白拉特夜', '斋月开始', '盖德尔夜', '阿拉法特日', '开斋节（第{{day}}天）', '古尔邦节（第{{day}}天）', '伊斯兰新年', '阿舒拉日', '圣纪节'],
  ja: ['大切な日', '祝福の夜', 'イード', '祝福の日', '推定', 'ラガーイブの夜', '三聖月の始まり', 'ミウラージュの夜', 'バラーアの夜', 'ラマダーン開始', 'ライラトゥル・カドル', 'アラファの日', 'イード・アル＝フィトル（{{day}}日目）', 'イード・アル＝アドハー（{{day}}日目）', 'イスラーム暦新年', 'アーシューラー', 'マウリド'],
  ko: ['중요한 날', '축복의 밤', '이드', '축복의 날', '예상', '라가이브의 밤', '세 성월의 시작', '미으라즈의 밤', '바라아의 밤', '라마단 시작', '권능의 밤', '아라파의 날', '이드 알피트르 ({{day}}일째)', '이드 알아드하 ({{day}}일째)', '이슬람 새해', '아슈라', '마울리드'],
};

const NAME_KEYS = ['regaib', 'threeMonths', 'mirac', 'berat', 'ramadanStart', 'kadir', 'arafah', 'ramadanEid', 'kurbanEid', 'hijriNewYear', 'ashura', 'mevlid'];
const dir = path.resolve('lib/i18n/locales');
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const lang = file.replace('.json', '');
  const row = T[lang];
  if (!row || row.length !== 17) throw new Error(`Bad row for ${lang}`);
  const [title, kandil, eid, other, estimated, ...names] = row;
  for (const n of [names[7], names[8]]) if (!n.includes('{{day}}')) throw new Error(`Missing {{day}} in ${lang}`);
  const full = path.join(dir, file);
  const json = JSON.parse(fs.readFileSync(full, 'utf8'));
  json.religiousDays = {
    title,
    estimated,
    types: { kandil, eid, other },
    names: Object.fromEntries(NAME_KEYS.map((k, i) => [k, names[i]])),
  };
  fs.writeFileSync(full, JSON.stringify(json, null, 2) + '\n');
}
console.log('updated', Object.keys(T).length, 'locales');
