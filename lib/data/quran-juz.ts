export interface Juz {
  number: number;
  name: string;
  startSurah: string;
  startVerse: number;
  pages: string;
  surahs: string;
}

export const quranJuzData: Juz[] = [
  { number: 1, name: "Elif Lam Mim", startSurah: "Fatiha", startVerse: 1, pages: "1-21", surahs: "Fatiha, Bakara (1-141)" },
  { number: 2, name: "Seyekulussufehau", startSurah: "Bakara", startVerse: 142, pages: "22-41", surahs: "Bakara (142-252)" },
  { number: 3, name: "Tilkerrusulu", startSurah: "Bakara", startVerse: 253, pages: "42-61", surahs: "Bakara (253-286), Al-i İmran (1-91)" },
  { number: 4, name: "Len Tenalu", startSurah: "Al-i Imran", startVerse: 92, pages: "62-81", surahs: "Al-i İmran (92-200), Nisa (1-23)" },
  { number: 5, name: "Vel Muhsanatu", startSurah: "Nisa", startVerse: 24, pages: "82-101", surahs: "Nisa (24-147)" },
  { number: 6, name: "La Yuhibbullah", startSurah: "Nisa", startVerse: 148, pages: "102-121", surahs: "Nisa (148-176), Maide (1-82)" },
  { number: 7, name: "Ve Iza Semiu", startSurah: "Maide", startVerse: 83, pages: "122-141", surahs: "Maide (83-120), En'am (1-110)" },
  { number: 8, name: "Ve Lev Ennena", startSurah: "En'am", startVerse: 111, pages: "142-161", surahs: "En'am (111-165), A'raf (1-87)" },
  { number: 9, name: "Kalel Meleu", startSurah: "A'raf", startVerse: 88, pages: "162-181", surahs: "A'raf (88-206), Enfal (1-40)" },
  { number: 10, name: "Ve'lemu", startSurah: "Enfal", startVerse: 41, pages: "182-201", surahs: "Enfal (41-75), Tevbe (1-92)" },
  { number: 11, name: "Ya'tezirune", startSurah: "Tevbe", startVerse: 93, pages: "202-221", surahs: "Tevbe (93-129), Yunus (1-109), Hud (1-5)" },
  { number: 12, name: "Ve Ma Min Dabbetin", startSurah: "Hud", startVerse: 6, pages: "222-241", surahs: "Hud (6-123), Yusuf (1-52)" },
  { number: 13, name: "Ve Ma Uberriu", startSurah: "Yusuf", startVerse: 53, pages: "242-261", surahs: "Yusuf (53-111), Rad (1-43), İbrahim (1-52)" },
  { number: 14, name: "Rubema", startSurah: "Hicr", startVerse: 1, pages: "262-281", surahs: "Hicr (1-99), Nahl (1-128)" },
  { number: 15, name: "Subhanellezi", startSurah: "Isra", startVerse: 1, pages: "282-301", surahs: "İsra (1-111), Kehf (1-74)" },
  { number: 16, name: "Kal Elem", startSurah: "Kehf", startVerse: 75, pages: "302-321", surahs: "Kehf (75-110), Meryem (1-98), Taha (1-135)" },
  { number: 17, name: "Ikterebe", startSurah: "Enbiya", startVerse: 1, pages: "322-341", surahs: "Enbiya (1-112), Hac (1-78)" },
  { number: 18, name: "Kad Efleha", startSurah: "Mu'minun", startVerse: 1, pages: "342-361", surahs: "Mü'minun (1-118), Nur (1-64), Furkan (1-20)" },
  { number: 19, name: "Ve Kalellezine", startSurah: "Furkan", startVerse: 21, pages: "362-381", surahs: "Furkan (21-77), Şuara (1-227), Neml (1-55)" },
  { number: 20, name: "Emmen Haleka", startSurah: "Neml", startVerse: 56, pages: "382-401", surahs: "Neml (56-93), Kasas (1-88), Ankebut (1-45)" },
  { number: 21, name: "Utlu Ma Uhiye", startSurah: "Ankebut", startVerse: 46, pages: "402-421", surahs: "Ankebut (46-69), Rum (1-60), Lokman (1-34), Secde (1-30), Ahzab (1-30)" },
  { number: 22, name: "Ve Men Yaknud", startSurah: "Ahzab", startVerse: 31, pages: "422-441", surahs: "Ahzab (31-73), Sebe (1-54), Fatır (1-45), Yasin (1-21)" },
  { number: 23, name: "Ve Ma Liye", startSurah: "Yasin", startVerse: 22, pages: "442-461", surahs: "Yasin (22-83), Saffat (1-182), Sad (1-88), Zümer (1-31)" },
  { number: 24, name: "Femen Azlem", startSurah: "Zumer", startVerse: 32, pages: "462-481", surahs: "Zümer (32-75), Mü'min (1-85), Fussilet (1-46)" },
  { number: 25, name: "Ileyhi Yureddu", startSurah: "Fussilet", startVerse: 47, pages: "482-501", surahs: "Fussilet (47-54), Şura (1-53), Zuhruf (1-89), Duhan (1-59), Casiye (1-37)" },
  { number: 26, name: "Ha Mim", startSurah: "Ahkaf", startVerse: 1, pages: "502-521", surahs: "Ahkaf (1-35), Muhammed (1-38), Fetih (1-29), Hucurat (1-18), Kaf (1-45), Zariyat (1-30)" },
  { number: 27, name: "Kale Fema Hatbukim", startSurah: "Zariyat", startVerse: 31, pages: "522-541", surahs: "Zariyat (31-60), Tur (1-49), Necm (1-62), Kamer (1-55), Rahman (1-78), Vakıa (1-96), Hadid (1-29)" },
  { number: 28, name: "Kad Semia", startSurah: "Mucadele", startVerse: 1, pages: "542-561", surahs: "Mücadele (1-22), Haşr (1-24), Mümtehine (1-13), Saf (1-14), Cuma (1-11), Münafikun (1-11), Tegabun (1-18), Talak (1-12), Tahrim (1-12)" },
  { number: 29, name: "Tebarekellezi", startSurah: "Mulk", startVerse: 1, pages: "562-581", surahs: "Mülk (1-30), Kalem (1-52), Hakka (1-52), Mearic (1-44), Nuh (1-28), Cin (1-28), Müzzemmil (1-20), Müddessir (1-56), Kıyamet (1-40), İnsan (1-31), Mürselat (1-50)" },
  { number: 30, name: "Amme", startSurah: "Nebe", startVerse: 1, pages: "582-604", surahs: "Nebe (1-40) - Nas (1-6)" },
];

export function getJuzByNumber(number: number): Juz | undefined {
  return quranJuzData.find(juz => juz.number === number);
}

export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return `${weekStart.toLocaleDateString('tr-TR', options)} - ${weekEnd.toLocaleDateString('tr-TR', options)}`;
}
