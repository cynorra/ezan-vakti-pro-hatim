export interface QuranVerse {
  id: string;
  arabic: string;
  turkish: string;
  surah: string;
  verseNumber: number;
  theme: 'sifa' | 'huzur' | 'sabir' | 'rahmet' | 'dua' | 'tevekkul';
}

export const quranHealingVerses: QuranVerse[] = [
  {
    id: 'isra-82',
    arabic: 'وَنُنَزِّلُ مِنَ الْقُرْاٰنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِن۪ينَ',
    turkish: 'Biz Kur\'an\'dan, müminler için şifa ve rahmet olan şeyler indiriyoruz.',
    surah: 'İsrâ Suresi',
    verseNumber: 82,
    theme: 'sifa',
  },
  {
    id: 'rad-28',
    arabic: 'اَلَا بِذِكْرِ اللّٰهِ تَطْمَئِنُّ الْقُلُوبُ',
    turkish: 'Bilesiniz ki, kalpler ancak Allah\'ı anmakla huzur ve sükun bulur.',
    surah: 'Ra\'d Suresi',
    verseNumber: 28,
    theme: 'huzur',
  },
  {
    id: 'insirah-5-6',
    arabic: 'فَاِنَّ مَعَ الْعُسْرِ يُسْراًۜ اِنَّ مَعَ الْعُسْرِ يُسْراً',
    turkish: 'Şüphesiz her zorlukla beraber bir kolaylık vardır. Evet, her zorlukla beraber bir kolaylık vardır.',
    surah: 'İnşirâh Suresi',
    verseNumber: 5,
    theme: 'teselli' as any,
  },
  {
    id: 'mumin-60',
    arabic: 'وَقَالَ رَبُّكُمُ ادْعُون۪ٓي اَسْتَجِبْ لَكُمْ',
    turkish: 'Rabbiniz buyurdu ki: Bana dua edin, duanıza icabet edeyim.',
    surah: 'Mü\'min Suresi',
    verseNumber: 60,
    theme: 'dua',
  },
  {
    id: 'duha-3',
    arabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلٰى',
    turkish: 'Rabbin seni terk etmedi ve sana darılmadı.',
    surah: 'Duhâ Suresi',
    verseNumber: 3,
    theme: 'teselli' as any,
  },
  {
    id: 'bakara-286',
    arabic: 'لَا يُكَلِّفُ اللّٰهُ نَفْساً اِلَّا وُسْعَهَا',
    turkish: 'Allah hiçbir kimseye gücünün yettiğinden fazlasını yüklemez.',
    surah: 'Bakara Suresi',
    verseNumber: 286,
    theme: 'rahmet',
  },
  {
    id: 'taha-114',
    arabic: 'وَقُلْ رَبِّ زِدْن۪ي عِلْماً',
    turkish: 'Ve de ki: Rabbim, benim ilmimi ve anlayışımı artır!',
    surah: 'Tâhâ Suresi',
    verseNumber: 114,
    theme: 'dua',
  },
  {
    id: 'zumer-53',
    arabic: 'قُلْ يَا عِبَادِيَ الَّذ۪ينَ اَسْرَفُوا عَلٰٓى اَنْفُسِهِمْ لَا تَقْنَطُوا مِنْ رَحْمَةِ اللّٰهِ',
    turkish: 'De ki: Ey kendilerine kötülük edip haddi aşan kullarım! Allah\'ın rahmetinden ümidinizi kesmeyin.',
    surah: 'Zümer Suresi',
    verseNumber: 53,
    theme: 'rahmet',
  },
  {
    id: 'yunus-57',
    arabic: 'يَٓا اَيُّهَا النَّاسُ قَدْ جَٓاءَتْكُمْ مَوْعِظَةٌ مِنْ رَبِّكُمْ وَشِفَاءٌ لِمَا فِي الصُّدُورِ',
    turkish: 'Ey insanlar! Size Rabbinizden bir öğüt, gönüllerdeki dertlere bir şifa ve müminler için bir hidayet ve rahmet geldi.',
    surah: 'Yûnus Suresi',
    verseNumber: 57,
    theme: 'sifa',
  },
  {
    id: 'suara-80',
    arabic: 'وَاِذَا مَرِضْتُ فَهُوَ يَشْف۪ينِ',
    turkish: 'Hastalandığım zaman bana şifa veren O\'dur.',
    surah: 'Şu\'arâ Suresi',
    verseNumber: 80,
    theme: 'sifa',
  },
  {
    id: 'talak-3',
    arabic: 'وَمَنْ يَتَوَكَّلْ عَلَى اللّٰهِ فَهُوَ حَسْبُهُ',
    turkish: 'Kim Allah\'a tevekkül ederse, O kendisine yeter.',
    surah: 'Talâk Suresi',
    verseNumber: 3,
    theme: 'tevekkul',
  },
  {
    id: 'fussilet-44',
    arabic: 'قُلْ هُوَ لِلَّذ۪ينَ اٰمَنُوا هُدًى وَشِفَٓاءٌ',
    turkish: 'De ki: O (Kur\'an), inananlar için bir hidayet ve şifadır.',
    surah: 'Fussilet Suresi',
    verseNumber: 44,
    theme: 'sifa',
  },
  {
    id: 'bakara-186',
    arabic: 'وَاِذَا سَاَلَكَ عِبَاد۪ي عَنّ۪ي فَاِنّ۪ي قَر۪يبٌۜ اُج۪يبُ دَعْوَةَ الدَّاعِ اِذَا دَعَانِ',
    turkish: 'Kullarım sana Beni sorduklarında bilsinler ki Ben onlara çok yakınım. Bana dua edenin duasına icabet ederim.',
    surah: 'Bakara Suresi',
    verseNumber: 186,
    theme: 'dua',
  },
  {
    id: 'tebve-128',
    arabic: 'لَقَدْ جَٓاءَكُمْ رَسُولٌ مِنْ اَنْفُسِكُمْ عَز۪يزٌ عَلَيْهِ مَا عَنِتُّمْ حَر۪يصٌ عَلَيْكُمْ بِالْمُؤْمِن۪ينَ رَؤُ۫فٌ رَح۪يمٌ',
    turkish: 'Andolsun, size içinizden öyle bir peygamber gelmiştir ki, sizin sıkıntıya uğramanız ona pek ağır gelir; size çok düşkündür, müminlere karşı çok şefkatli ve merhametlidir.',
    surah: 'Tevbe Suresi',
    verseNumber: 128,
    theme: 'rahmet',
  },
  {
    id: 'furkan-74',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ اَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ اَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّق۪ينَ اِمَاماً',
    turkish: 'Rabbimiz! Bize göz aydınlığı olacak eşler ve zürriyetler bağışla ve bizi takva sahiplerine önder kıl.',
    surah: 'Furkân Suresi',
    verseNumber: 74,
    theme: 'dua',
  },
  {
    id: 'aliimran-173',
    arabic: 'حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَك۪يلُ',
    turkish: 'Allah bize yeter, O ne güzel vekildir!',
    surah: 'Âl-i İmrân Suresi',
    verseNumber: 173,
    theme: 'tevekkul',
  }
];

export function getDailyHealingVerse(date: Date = new Date()): QuranVerse {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % quranHealingVerses.length;
  return quranHealingVerses[index];
}
