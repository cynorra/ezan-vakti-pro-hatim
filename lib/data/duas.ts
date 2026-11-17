import { duaTranslations } from './dua-translations';
import { ARABIC_SCRIPT_LANGUAGES, baseLanguage, contentLanguage, contentPack } from './content-translations';

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  turkish: string;
  transliteration: string;
  source: string;
  category: 'daily' | 'worship' | 'protection' | 'family' | 'other';
}

export const dailyDuas: Dua[] = [
  {
    id: "morning-1",
    title: "Sabah Duasi",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    turkish: "Allah'im! Senin sayende sabaha ulastik, senin sayende aksama ulastik. Senin sayende yasiyoruz, senin sayende oluyoruz. Donus ancak sanadir.",
    transliteration: "Allahumme bike asbahna ve bike emseyna ve bike nahya ve bike nemutu ve ileyken nusur",
    source: "Tirmizi",
    category: 'daily'
  },
  {
    id: "protection-1",
    title: "Korunma Duasi",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    turkish: "Allah'in adiyla ki O'nun adiyla birlikte ne yerde ne de gökte hiçbir şey zarar veremez. O her şeyi işiten ve bilendir.",
    transliteration: "Bismillahillezi la yedurru me'asmihi sey'un fil ardi vela fis-semai ve huves-semi'ul alim",
    source: "Ebu Davud",
    category: 'protection'
  },
  {
    id: "forgiveness-1",
    title: "Istigfar Duasi",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    turkish: "Kendisinden baska ilah olmayan, diri ve her seyi ayakta tutan Yuce Allah'tan bagislanmami diler ve O'na tovbe ederim.",
    transliteration: "Estagfirullahel azimellezi la ilahe illa huvel hayyul kayyume ve etubu ileyh",
    source: "Tirmizi",
    category: 'worship'
  },
  {
    id: "gratitude-1",
    title: "Sukur Duasi",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَكَفَانَا وَآوَانَا",
    turkish: "Bizi yediren, iciren, ihtiyaclarimizi gideren ve bize barinma yeri veren Allah'a hamd olsun.",
    transliteration: "Elhamdulillahillezi at'amena ve sekana ve kefana ve avana",
    source: "Muslim",
    category: 'daily'
  },
  {
    id: "evening-1",
    title: "Aksam Duasi",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا فِيهَا وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا فِيهَا",
    turkish: "Allah'im! Senden bu gecenin ve icindeki seylerin hayrini isterim. Bu gecenin ve icindeki seylerin serrindan sana siginirim.",
    transliteration: "Allahumme inni es'eluke hayra hazihil leyleti ve hayra ma fiha ve euzu bike min serriha ve serri ma fiha",
    source: "Ebu Davud",
    category: 'daily'
  },
  {
    id: "sleep-1",
    title: "Uyku Oncesi Duasi",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    turkish: "Allah'im! Senin adinla olur, senin adinla dirilirim.",
    transliteration: "Bismikallahume emutu ve ahya",
    source: "Buhari",
    category: 'daily'
  },
  {
    id: "wakeup-1",
    title: "Uyaninca Okunacak Dua",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    turkish: "Bizi oldurdukten sonra dirilten Allah'a hamd olsun. Donus O'nadir.",
    transliteration: "Elhamdulillahillezi ahyana ba'de ma ematena ve ileyhinnusur",
    source: "Buhari",
    category: 'daily'
  },
  {
    id: "stress-1",
    title: "Sikinti Duasi",
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    turkish: "Senden baska ilah yoktur. Seni tenzih ederim. Suphe yok ki ben zalimlerden oldum.",
    transliteration: "La ilahe illa ente subhaneke inni kuntu minezzalimin",
    source: "Tirmizi",
    category: 'protection'
  },
  {
    id: "travel-1",
    title: "Yolculuk Duasi",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    turkish: "Bunu bizim hizmetimize veren Allah'i tenzih ederiz. Yoksa biz buna guc yetiremezdik. Suphe yok ki biz Rabbimize donecegiz.",
    transliteration: "Subhanellezi sehhara lena haza ve ma kunna lehu mukrinin ve inna ila rabbina lemunkalibun",
    source: "Tirmizi",
    category: 'family'
  },
  {
    id: "health-1",
    title: "Saglik Duasi",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي",
    turkish: "Allah'im! Bedenime afiyet ver. Allah'im! Kulagima afiyet ver. Allah'im! Gozume afiyet ver.",
    transliteration: "Allahumme afini fi bedeni, Allahumme afini fi sem'i, Allahumme afini fi basari",
    source: "Ebu Davud",
    category: 'protection'
  },
  {
    id: "knowledge-1",
    title: "Ilim Duasi",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    turkish: "Rabbim! Ilmimi artir.",
    transliteration: "Rabbi zidni ilma",
    source: "Taha Suresi, 114",
    category: 'worship'
  },
  {
    id: "guidance-1",
    title: "Hidayet Duasi",
    arabic: "اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي",
    turkish: "Allah'im! Beni dogru yola ilet ve dogru yolda sabit kil.",
    transliteration: "Allahummehdini ve seddidni",
    source: "Muslim",
    category: 'worship'
  },
  {
    id: "patience-1",
    title: "Sabir Duasi",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا",
    turkish: "Rabbimiz! Uzerimize sabir yagdir ve ayaklarimizi sabit kil.",
    transliteration: "Rabbena efrigh aleyna sabran ve sebbit akdamena",
    source: "Bakara Suresi, 250",
    category: 'worship'
  },
  {
    id: "food-1",
    title: "Yemek Duasi",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ بِسْمِ اللَّهِ",
    turkish: "Allah'im! Bize verdiklerini bereketli kil ve bizi cehennem azabindan koru. Bismillah.",
    transliteration: "Allahumme barik lena fima razaktena ve kina azabennar, bismillah",
    source: "Ibn Mace",
    category: 'family'
  },
  {
    id: "parents-1",
    title: "Anne Baba Duasi",
    arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    turkish: "Rabbim! Beni kucukken terbiye ettikleri gibi onlara merhamet et.",
    transliteration: "Rabbirhamhuma kema rabbeyani sagira",
    source: "Isra Suresi, 24",
    category: 'family'
  },
  {
    id: "success-1",
    title: "Basari Duasi",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    turkish: "Rabbim! Gogsumu ac ve isimi kolaylastir.",
    transliteration: "Rabbisrahli sadri ve yessirli emri",
    source: "Taha Suresi, 25-26",
    category: 'worship'
  },
  {
    id: "anger-1",
    title: "Ofke Duasi",
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    turkish: "Kovulmus seytandan Allah'a siginirim.",
    transliteration: "Euzubillahi minesseytanirracim",
    source: "Buhari",
    category: 'protection'
  },
  {
    id: "mosque-1",
    title: "Camiye Giris Duasi",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    turkish: "Allah'im! Bana rahmet kapilarini ac.",
    transliteration: "Allahummeftah li ebvabe rahmetik",
    source: "Muslim",
    category: 'worship'
  },
  {
    id: "mosque-2",
    title: "Camiden Cikis Duasi",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    turkish: "Allah'im! Senden fazlindan isterim.",
    transliteration: "Allahumme inni es'eluke min fadlik",
    source: "Muslim",
    category: 'worship'
  },
  {
    id: "rain-1",
    title: "Yagmur Duasi",
    arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
    turkish: "Allah'im! Faydali yagmur ver.",
    transliteration: "Allahumme sayyiben nafia",
    source: "Buhari",
    category: 'other'
  },
  {
    id: "fear-1",
    title: "Korku Duasi",
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    turkish: "Allah bana yeter. O'ndan baska ilah yoktur. O'na tevekkul ettim. O, buyuk arsin Rabbidir.",
    transliteration: "Hasbiyallahu la ilahe illa hu aleyhi tevekeltu ve huve rabbul arsil azim",
    source: "Ebu Davud",
    category: 'protection'
  },
  {
    id: "exam-1",
    title: "Sinav Duasi",
    arabic: "رَبِّ زِدْنِي عِلْمًا وَفَهْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ",
    turkish: "Rabbim! Zihnimi ac, ilmimi ve fehmimi artir ve beni salih kullarin arasina kat.",
    transliteration: "Rabbi zidni ilmen ve fehmen ve elhikni bissalihin",
    source: "Taha Suresi, 114 (Gelistirilmis)",
    category: 'worship'
  },
  {
    id: "illness-1",
    title: "Sifa Duasi",
    arabic: "أَذْهِبِ الْبَاسَ رَبَّ النَّاسِ اشْفِ وَأَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا",
    turkish: "Ey insanlarin Rabbi! Acıyı gider, sifa ver, sifa veren Sensin. Senin sifandan baska sifa yoktur. Oyle bir sifa ver ki hicbir hastalik birakmasin.",
    transliteration: "Ezhibil-be'se rabben-nasi isfi ve entes-safi la sifae illa sifauke sifaen la yugadiru sekama",
    source: "Buhari",
    category: 'protection'
  },
  {
    id: "debt-1",
    title: "Borctan Kurtulma Duasi",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    turkish: "Allah'im! Gam ve kederden, acizlikten, tembellikten, korkakliktan, cimrilikten, borc yukunden ve insanlarin kahrindan sana siginirim.",
    transliteration: "Allahumme inni euzu bike minel-hemmi vel-hazen vel-aczi vel-kesel vel-buhli vel-cubni ve daleid-deyni ve galebetir-rical",
    source: "Buhari",
    category: 'other'
  },
  {
    id: "repentance-1",
    title: "Seyyidul Istigfar",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    turkish: "Allah'im! Sen benim Rabbimsin. Senden baska ilah yoktur. Beni Sen yarattin ve ben Senin kulunum. Gucum yettigince Sana verdigim soz ve vaad uzereyim.",
    transliteration: "Allahumme ente rabbi la ilahe illa ente halakteni ve ene abduke ve ene ala ahdike ve va'dike mesteta'tu",
    source: "Buhari",
    category: 'worship'
  }
];

export const duaCategories = [
  { id: 'all', name: 'Tümü' },
  { id: 'daily', name: 'Günlük' },
  { id: 'worship', name: 'İbadet' },
  { id: 'protection', name: 'Korunma' },
  { id: 'family', name: 'Aile' },
  { id: 'other', name: 'Diğer' },
];

export function getDailyDua(date: Date = new Date()): Dua {
  const utcNow = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const utcStartOfYear = Date.UTC(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((utcNow - utcStartOfYear) / 86400000);
  const index = Math.abs(dayOfYear) % dailyDuas.length;
  return dailyDuas[index];
}

/**
 * Returns the dua with title, meaning (kept in the `turkish` field for
 * compatibility), source and transliteration in the given UI language.
 * Turkish returns the original; languages without a translation get English.
 */
export function localizeDua(dua: Dua, language: string): Dua {
  const lang = contentLanguage(language);
  const translation = duaTranslations[dua.id];
  if (lang === 'tr' || !translation) return dua;
  const base = baseLanguage(language);
  const packed = contentPack(language)?.duas?.[dua.id];
  const text = packed ?? translation[lang] ?? translation['en'];
  return {
    ...dua,
    title: text?.title || dua.title,
    // Arabic readers already see the dua itself; a restatement would only repeat it.
    turkish: base === 'ar' ? '' : (text?.meaning || dua.turkish),
    source: text?.source || dua.source,
    transliteration: ARABIC_SCRIPT_LANGUAGES.has(base) ? '' : (translation.latin || dua.transliteration),
  };
}

export function getDuaById(id: string): Dua | undefined {
  return dailyDuas.find(dua => dua.id === id);
}
