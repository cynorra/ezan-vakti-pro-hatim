export interface DailyWisdom {
  id: string;
  type: 'verse' | 'hadith';
  content: string;
  source: string;
  arabic?: string;
}

export const dailyWisdomData: DailyWisdom[] = [
  {
    id: '1',
    type: 'verse',
    content: "Rabbiniz şöyle buyurdu: Bana dua edin, duanızı kabul edeyim.",
    source: "Mü'min Suresi, 60",
    arabic: "وَقَالَ رَبُّكُمُ ادْعُون۪ٓي اَسْتَجِبْ لَكُمْ"
  },
  {
    id: '2',
    type: 'hadith',
    content: "Ameller niyetlere göredir. Herkese niyet ettiği şey vardır.",
    source: "Buhari, Bed'ü'l-Vahy, 1",
    arabic: "إنَّمَا الأَعْمَالُ بِالنِّيَّاتِ"
  },
  {
    id: '3',
    type: 'verse',
    content: "Şüphesiz güçlükle beraber bir kolaylık vardır.",
    source: "İnşirah Suresi, 5",
    arabic: "فَاِنَّ مَعَ الْعُسْرِ يُسْراً"
  },
  {
    id: '4',
    type: 'hadith',
    content: "Sizin en hayırlınız, Kur'an'ı öğrenen ve öğretendir.",
    source: "Buhari, Fedâilü'l-Kur'ân, 21",
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
  },
  {
    id: '5',
    type: 'verse',
    content: "Allah, hiç kimseye gücünün üstünde bir şey yüklemez.",
    source: "Bakara Suresi, 286",
    arabic: "لَا يُكَلِّفُ اللّٰهُ نَفْساً اِلَّا وُسْعَهَا"
  },
  {
    id: '6',
    type: 'hadith',
    content: "Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.",
    source: "Buhari, İlim, 11",
    arabic: "يَسِّرُوا وَلاَ تُعَسِّرُوا وَبَشِّرُوا وَلاَ تُنَفِّرُوا"
  },
  {
    id: '7',
    type: 'verse',
    content: "Şüphesiz Allah sabredenlerle beraberdir.",
    source: "Bakara Suresi, 153",
    arabic: "اِنَّ اللّٰهَ مَعَ الصَّابِر۪ينَ"
  },
  {
    id: '8',
    type: 'hadith',
    content: "Dünya sevgisi her çeşit hatalı davranışın başıdır.",
    source: "Beyhaki, Şuabü'l-İman, 7",
    arabic: "حُبُّ الدُّنْيَا رَأْسُ كُلِّ خَطِيئَةٍ"
  },
  {
    id: '9',
    type: 'verse',
    content: "Bilesiniz ki, kalpler ancak Allah'ı anmakla huzur bulur.",
    source: "Ra'd Suresi, 28",
    arabic: "اَلَا بِذِكْرِ اللّٰهِ تَطْمَئِنُّ الْقُلُوبُ"
  },
  {
    id: '10',
    type: 'hadith',
    content: "Kim bir hayra vesile olursa, onu yapan gibi sevap alır.",
    source: "Müslim, İmâre, 133",
    arabic: "مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ"
  },
  {
    id: '11',
    type: 'verse',
    content: "İnsan için ancak çalıştığının karşılığı vardır.",
    source: "Necm Suresi, 39",
    arabic: "وَاَنْ لَيْسَ لِلْاِنْسَانِ اِلَّا مَا سَعٰى"
  },
  {
    id: '12',
    type: 'hadith',
    content: "İnsanların en hayırlısı, insanlara en faydalı olanıdır.",
    source: "Buhari, Mağazi, 35",
    arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ"
  },
  {
    id: '13',
    type: 'verse',
    content: "O, hanginizin daha güzel iş yapacağını denemek için ölümü ve hayatı yarattı.",
    source: "Mülk Suresi, 2",
    arabic: "اَلَّذ۪ي خَلَقَ الْمَوْتَ وَالْحَيٰوةَ لِيَبْلُوَكُمْ اَيُّكُمْ اَحْسَنُ عَمَلًا"
  },
  {
    id: '14',
    type: 'hadith',
    content: "Temizlik imanın yarısıdır.",
    source: "Müslim, Tahâret, 1",
    arabic: "الطَّهُورُ شَطْرُ الإِيمَانِ"
  },
  {
    id: '15',
    type: 'verse',
    content: "Sizin en değerliniz, Allah'a karşı gelmekten en çok sakınanınızdır.",
    source: "Hucurat Suresi, 13",
    arabic: "اِنَّ اَكْرَمَكُمْ عِنْدَ اللّٰهِ اَتْقٰيكُمْ"
  }
];

export function getDailyWisdom(): DailyWisdom {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return dailyWisdomData[dayOfYear % dailyWisdomData.length];
}
