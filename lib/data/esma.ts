import { esmaTranslations } from './esma-translations';
import { contentLanguage, contentPack } from './content-translations';

export interface Esma {
  id: number;
  arabic: string;
  turkish: string;
  meaning: string;
}

export const esmaulHusna: Esma[] = [
  { id: 1, arabic: 'اللّٰهُ', turkish: 'Allah', meaning: 'Kendinden başka ilah bulunmayan, bütün isim ve sıfatları kendinde toplayan.' },
  { id: 2, arabic: 'الرَّحْمَنُ', turkish: 'Er-Rahmân', meaning: 'Dünyada bütün mahlükata merhamet eden, şefkat gösteren, ihsan eden.' },
  { id: 3, arabic: 'الرَّحِيمُ', turkish: 'Er-Rahîm', meaning: 'Ahirette, müminlere sonsuz ikram, lütuf ve merhamette bulunan.' },
  { id: 4, arabic: 'الْمَلِكُ', turkish: 'El-Melik', meaning: 'Mülkün, kâinatın sahibi, mülk ve saltanatı devamlı olan.' },
  { id: 5, arabic: 'الْقُدُّوسُ', turkish: 'El-Kuddûs', meaning: 'Her türlü noksanlıktan uzak ve her türlü kusurdan tertemiz olan.' },
  { id: 6, arabic: 'السَّلَامُ', turkish: 'Es-Selâm', meaning: 'Her türlü tehlike ve selamet veren, kullarını selamete çıkaran.' },
  { id: 7, arabic: 'الْمُؤْمِنُ', turkish: 'El-Mü\'min', meaning: 'Güven veren, emin kılan, inananları koruyan.' },
  { id: 8, arabic: 'الْمُهَيْمِنُ', turkish: 'El-Müheymin', meaning: 'Her şeyi görüp gözeten, koruyan, her şeyin mutlak hakimi olan.' },
  { id: 9, arabic: 'الْعَزِيزُ', turkish: 'El-Azîz', meaning: 'İzzet sahibi, her şeye galip olan, karşı gelinemeyen.' },
  { id: 10, arabic: 'الْجَبَّارُ', turkish: 'El-Cebbâr', meaning: 'Azamet ve kudret sahibi, dilediğini mutlak yapan, dilediğine muktedir olan.' },
  { id: 11, arabic: 'الْمُتَكَبِّرُ', turkish: 'El-Mütekebbir', meaning: 'Büyüklükte eşi benzeri olmayan, büyüklüğü kendi zatına ait olan.' },
  { id: 12, arabic: 'الْخَالِقُ', turkish: 'El-Hâlık', meaning: 'Yaratan, yoktan var eden.' },
  { id: 13, arabic: 'الْبَارِئُ', turkish: 'El-Bâri\'', meaning: 'Her şeyi kusursuz ve uyumlu olarak yaratan.' },
  { id: 14, arabic: 'الْمُصَوِّرُ', turkish: 'El-Musavvir', meaning: 'Her şeye bir şekil, hususiyet ve suret veren.' },
  { id: 15, arabic: 'الْغَفَّارُ', turkish: 'El-Gaffâr', meaning: 'Günahları örten ve çok mağfiret eden.' },
  { id: 16, arabic: 'الْقَهَّارُ', turkish: 'El-Kahhâr', meaning: 'Her şeye, her an galip gelen, mutlak üstünlük sahibi.' },
  { id: 17, arabic: 'الْوَهَّابُ', turkish: 'El-Vehhâb', meaning: 'Karşılıksız veren, bol bol hediye eden.' },
  { id: 18, arabic: 'الرَّزَّاقُ', turkish: 'Er-Rezzâk', meaning: 'Bütün rızka muhtaç olanların rızkını veren.' },
  { id: 19, arabic: 'الْفَتَّاحُ', turkish: 'El-Fettâh', meaning: 'Her türlü sıkıntıları çözen ve hayır kapılarını açan.' },
  { id: 20, arabic: 'الْعَلِيمُ', turkish: 'El-Alîm', meaning: 'Her şeyi çok iyi, hakkıyla bilen.' },
  { id: 21, arabic: 'الْقَابِضُ', turkish: 'El-Kâbıd', meaning: 'Dilediğine rızkı daraltan, sıkan.' },
  { id: 22, arabic: 'الْبَاسِطُ', turkish: 'El-Bâsıt', meaning: 'Dilediğine rızkı genişleten, açan.' },
  { id: 23, arabic: 'الْخَافِضُ', turkish: 'El-Hâfıd', meaning: 'Yukarıdan aşağıya indiren, alçaltan.' },
  { id: 24, arabic: 'الرَّافِعُ', turkish: 'Er-Râfi', meaning: 'Yukarı kaldıran, yükselten.' },
  { id: 25, arabic: 'الْمُعِزُّ', turkish: 'El-Muizz', meaning: 'İzzet veren, yücelten.' },
  { id: 26, arabic: 'الْمُذِلُّ', turkish: 'El-Müzill', meaning: 'Zillete düşüren, değersiz kılan.' },
  { id: 27, arabic: 'السَّمِيعُ', turkish: 'Es-Semî\'', meaning: 'Her şeyi en iyi işiten.' },
  { id: 28, arabic: 'الْبَصِيرُ', turkish: 'El-Basîr', meaning: 'Her şeyi en iyi gören.' },
  { id: 29, arabic: 'الْحَكَمُ', turkish: 'El-Hakem', meaning: 'Mutlak hakim olan, hüküm veren.' },
  { id: 30, arabic: 'الْعَدْلُ', turkish: 'El-Adl', meaning: 'Mutlak adil olan.' },
  { id: 31, arabic: 'اللَّطِيفُ', turkish: 'El-Latîf', meaning: 'Lütuf ve kerem sahibi olan, her şeyin inceliklerini bilen.' },
  { id: 32, arabic: 'الْخَبِيرُ', turkish: 'El-Habîr', meaning: 'Her şeyden haberdar olan.' },
  { id: 33, arabic: 'الْحَلِيمُ', turkish: 'El-Halîm', meaning: 'Yarattıklarına merhamet ve yumuşaklıkla muamele eden.' },
  { id: 34, arabic: 'الْعَظِيمُ', turkish: 'El-Azîm', meaning: 'Büyüklüğü anlaşılamayacak kadar yüce olan.' },
  { id: 35, arabic: 'الْغَفُورُ', turkish: 'El-Gafûr', meaning: 'Bağışlaması bol olan.' },
  { id: 36, arabic: 'الشَّكُورُ', turkish: 'Eş-Şekûr', meaning: 'Az amele, çok sevap veren.' },
  { id: 37, arabic: 'الْعَلِيُّ', turkish: 'El-Aliyy', meaning: 'Yüceler yücesi, makamı çok yüksek olan.' },
  { id: 38, arabic: 'الْكَبِيرُ', turkish: 'El-Kebîr', meaning: 'Çok büyük olan, zatının yüceliği idrak edilemeyen.' },
  { id: 39, arabic: 'الْحَفِيظُ', turkish: 'El-Hafîz', meaning: 'Her şeyi eksiksiz koruyan ve kollayan.' },
  { id: 40, arabic: 'الْمُقِيتُ', turkish: 'El-Mukît', meaning: 'Her yaratılmışın rızkını, gıdasını veren.' },
  { id: 41, arabic: 'الْحَسِيبُ', turkish: 'El-Hasîb', meaning: 'Kullarının hesabını en iyi gören.' },
  { id: 42, arabic: 'الْجَلِيلُ', turkish: 'El-Celîl', meaning: 'Celal ve azamet sahibi olan.' },
  { id: 43, arabic: 'الْكَرِيمُ', turkish: 'El-Kerîm', meaning: 'Çok ikram eden, çok cömert olan.' },
  { id: 44, arabic: 'الرَّقِيبُ', turkish: 'Er-Rakîb', meaning: 'Bütün varlıkları her an gözeten.' },
  { id: 45, arabic: 'الْمُجِيبُ', turkish: 'El-Mucîb', meaning: 'Duaları kabul eden.' },
  { id: 46, arabic: 'الْوَاسِعُ', turkish: 'El-Vâsi\'', meaning: 'İlmi, merhameti ve kudreti her şeyi kuşatan.' },
  { id: 47, arabic: 'الْحَكِيمُ', turkish: 'El-Hakîm', meaning: 'Bütün işleri hikmetli olan.' },
  { id: 48, arabic: 'الْوَدُودُ', turkish: 'El-Vedûd', meaning: 'Kullarını en fazla seven, sevilmeye en layık olan.' },
  { id: 49, arabic: 'الْمَجِيدُ', turkish: 'El-Mecîd', meaning: 'Şanı büyük ve yüce olan.' },
  { id: 50, arabic: 'الْبَاعِثُ', turkish: 'El-Bâis', meaning: 'Ölüleri dirilten.' },
  { id: 51, arabic: 'الشَّهِيدُ', turkish: 'Eş-Şehîd', meaning: 'Her yerde hazır ve nazır olan.' },
  { id: 52, arabic: 'الْحَقُّ', turkish: 'El-Hakk', meaning: 'Varlığı hiç değişmeden duran, gerçek olan.' },
  { id: 53, arabic: 'الْوَكِيلُ', turkish: 'El-Vekîl', meaning: 'Kullarının işlerini en iyi şekilde yoluna koyan.' },
  { id: 54, arabic: 'الْقَوِيُّ', turkish: 'El-Kaviyy', meaning: 'Kudreti sonsuz ve en güçlü olan.' },
  { id: 55, arabic: 'الْمَتِينُ', turkish: 'El-Metîn', meaning: 'Kuvvet ve kudreti çok sağlam olan.' },
  { id: 56, arabic: 'الْوَلِيُّ', turkish: 'El-Veliyy', meaning: 'Müminlerin dostu ve yardımcısı olan.' },
  { id: 57, arabic: 'الْحَمِيدُ', turkish: 'El-Hamîd', meaning: 'Her türlü övgüye layık olan.' },
  { id: 58, arabic: 'الْمُحْصِي', turkish: 'El-Muhsî', meaning: 'Yarattığı her şeyin sayısını bilen.' },
  { id: 59, arabic: 'الْمُبْدِئُ', turkish: 'El-Mübdi\'', meaning: 'Her şeyi yoktan, maddesiz var eden.' },
  { id: 60, arabic: 'الْمُعِيدُ', turkish: 'El-Muîd', meaning: 'Ölümden sonra tekrar dirilten.' },
  { id: 61, arabic: 'الْمُحْيِي', turkish: 'El-Muhyî', meaning: 'Canlandıran, dirilten, hayat veren.' },
  { id: 62, arabic: 'الْمُمِيتُ', turkish: 'El-Mümît', meaning: 'Öldüren, ölümü yaratan.' },
  { id: 63, arabic: 'الْحَيُّ', turkish: 'El-Hayy', meaning: 'Daima diri, hayatta olan.' },
  { id: 64, arabic: 'الْقَيُّومُ', turkish: 'El-Kayyûm', meaning: 'Varlıkları diri tutan, kâinatı yöneten.' },
  { id: 65, arabic: 'الْوَاجِدُ', turkish: 'El-Vâcid', meaning: 'Dilediğini, dilediği an bulan.' },
  { id: 66, arabic: 'الْمَاجِدُ', turkish: 'El-Mâcid', meaning: 'Kadri ve şanı büyük, ihsanı bol olan.' },
  { id: 67, arabic: 'الْوَاحِدُ', turkish: 'El-Vâhid', meaning: 'Tek olan, zatında ve sıfatlarında benzeri olmayan.' },
  { id: 68, arabic: 'الصَّمَدُ', turkish: 'Es-Samed', meaning: 'Hiçbir şeye muhtaç olmayan, her şeyin kendisine muhtaç olduğu.' },
  { id: 69, arabic: 'الْقَادِرُ', turkish: 'El-Kâdir', meaning: 'Her şeye gücü yeten, kudretli.' },
  { id: 70, arabic: 'الْمُقْتَدِرُ', turkish: 'El-Muktedir', meaning: 'Kuvvet ve kudret sahipleri üzerinde dilediği gibi tasarruf eden.' },
  { id: 71, arabic: 'الْمُقَدِّمُ', turkish: 'El-Mukaddim', meaning: 'Dilediğini öne alan, ileri geçiren.' },
  { id: 72, arabic: 'الْمُؤَخِّرُ', turkish: 'El-Muahhir', meaning: 'Dilediğini erteleyen, sona bırakan.' },
  { id: 73, arabic: 'الْأَوَّلُ', turkish: 'El-Evvel', meaning: 'Her şeyden önce olan, başlangıcı olmayan.' },
  { id: 74, arabic: 'الْآخِرُ', turkish: 'El-Âhir', meaning: 'Her şey helak olduktan sonra da varlığı devam eden.' },
  { id: 75, arabic: 'الظَّاهِرُ', turkish: 'Ez-Zâhir', meaning: 'Varlığı, eserleriyle apaçık olan.' },
  { id: 76, arabic: 'الْبَاطِنُ', turkish: 'El-Bâtın', meaning: 'Zatı görünmeyen, mahiyeti gizli olan.' },
  { id: 77, arabic: 'الْوَالِي', turkish: 'El-Vâlî', meaning: 'Kâinatı tek başına idare eden.' },
  { id: 78, arabic: 'الْمُتَعَالِي', turkish: 'El-Müteâlî', meaning: 'Son derece yüce ve büyük olan.' },
  { id: 79, arabic: 'الْبَرُّ', turkish: 'El-Berr', meaning: 'Kullarına iyilik ve ihsanı bol olan.' },
  { id: 80, arabic: 'التَّوَّابُ', turkish: 'Et-Tevvâb', meaning: 'Tövbeleri kabul edip bağışlayan.' },
  { id: 81, arabic: 'الْمُنْتَقِمُ', turkish: 'El-Müntakim', meaning: 'Suçluları adaletiyle cezalandıran.' },
  { id: 82, arabic: 'الْعَفُوُّ', turkish: 'El-Afüvv', meaning: 'Affı çok olan, günahları bağışlayan.' },
  { id: 83, arabic: 'الرَّءُوفُ', turkish: 'Er-Raûf', meaning: 'Çok merhametli, çok şefkatli olan.' },
  { id: 84, arabic: 'مَالِكُ الْمُلْكِ', turkish: 'Mâlikü\'l-Mülk', meaning: 'Mülkün tek ve ebedi sahibi.' },
  { id: 85, arabic: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', turkish: 'Zü\'l-Celâli ve\'l-İkrâm', meaning: 'Büyüklük, azamet ve sonsuz ikram sahibi.' },
  { id: 86, arabic: 'الْمُقْسِطُ', turkish: 'El-Muksit', meaning: 'Bütün işlerini denk, adaletli ve yerli yerinde yapan.' },
  { id: 87, arabic: 'الْجَامِعُ', turkish: 'El-Câmi\'', meaning: 'İstediğini, istediği zaman, istediği yerde toplayan.' },
  { id: 88, arabic: 'الْغَنِيُّ', turkish: 'El-Ganiyy', meaning: 'Hiçbir şeye muhtaç olmayan, zenginliği sonsuz olan.' },
  { id: 89, arabic: 'الْمُغْنِي', turkish: 'El-Muğnî', meaning: 'Dilediğine zenginlik veren.' },
  { id: 90, arabic: 'الْمَانِعُ', turkish: 'El-Mâni\'', meaning: 'Bir şeyin olmasını istemediğinde ona engel olan.' },
  { id: 91, arabic: 'الضَّارُّ', turkish: 'Ed-Dârr', meaning: 'Elem, zarar verecek şeyleri yaratan.' },
  { id: 92, arabic: 'النَّافِعُ', turkish: 'En-Nâfi\'', meaning: 'Fayda veren şeyleri yaratan.' },
  { id: 93, arabic: 'النُّورُ', turkish: 'En-Nûr', meaning: 'Alemleri nurlandıran, aydınlatan.' },
  { id: 94, arabic: 'الْهَادِي', turkish: 'El-Hâdî', meaning: 'Hidayet veren, doğru yola ileten.' },
  { id: 95, arabic: 'الْبَدِيعُ', turkish: 'El-Bedî\'', meaning: 'Eşi ve benzeri olmayan güzellikler yaratan.' },
  { id: 96, arabic: 'الْبَاقِي', turkish: 'El-Bâkî', meaning: 'Varlığının sonu olmayan, ebedi olan.' },
  { id: 97, arabic: 'الْوَارِثُ', turkish: 'El-Vâris', meaning: 'Her şeyin asıl ve ebedi sahibi.' },
  { id: 98, arabic: 'الرَّشِيدُ', turkish: 'Er-Reşîd', meaning: 'Bütün işleri isabetli ve hedefine ulaşan, irşad eden.' },
  { id: 99, arabic: 'الصَّبُورُ', turkish: 'Es-Sabûr', meaning: 'Çok sabırlı olan, cezalandırmada acele etmeyen.' }
];

/** Name transliteration (`turkish` field) and meaning in the UI language; Turkish is unchanged. */
export function localizeEsma(esma: Esma, language: string): Esma {
  const lang = contentLanguage(language);
  const row = esmaTranslations[esma.id - 1];
  if (lang === 'tr' || !row) return esma;
  const [latin, en, id, ms] = row;
  const packed = contentPack(language)?.esma[esma.id - 1];
  return { ...esma, turkish: latin, meaning: packed ?? (lang === 'id' ? id : lang === 'ms' ? ms : en) };
}

export const getRandomEsma = (): Esma => {
  const randomIndex = Math.floor(Math.random() * esmaulHusna.length);
  return esmaulHusna[randomIndex];
};
