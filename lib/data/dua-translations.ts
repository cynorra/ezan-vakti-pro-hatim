// Non-Turkish texts for lib/data/duas.ts, keyed by dua id.
// `latin` is an international transliteration (the Turkish-orthography one in
// duas.ts reads oddly outside Turkey). Languages without an entry fall back to English.

export type DuaLanguage = 'en' | 'id' | 'ms';

export interface DuaText {
  title: string;
  meaning: string;
  source: string;
}

export interface DuaTranslation {
  latin: string;
  en: DuaText;
  id: DuaText;
  ms: DuaText;
}

export const duaTranslations: Record<string, DuaTranslation> = {
  'morning-1': {
    latin: 'Allahumma bika ashbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaikan nusyur',
    en: { title: 'Morning Supplication', meaning: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.', source: 'Tirmidhi' },
    id: { title: 'Doa Pagi Hari', meaning: 'Ya Allah, dengan-Mu kami memasuki waktu pagi dan dengan-Mu kami memasuki waktu petang, dengan-Mu kami hidup dan dengan-Mu kami mati, dan kepada-Mu tempat kembali.', source: 'HR. Tirmidzi' },
    ms: { title: 'Doa Pagi', meaning: 'Ya Allah, dengan-Mu kami berpagi dan dengan-Mu kami berpetang, dengan-Mu kami hidup dan dengan-Mu kami mati, dan kepada-Mu tempat kembali.', source: 'Riwayat Tirmizi' },
  },
  'protection-1': {
    latin: "Bismillahilladzi la yadhurru ma'asmihi syai'un fil ardhi wa la fis sama'i wa huwas sami'ul 'alim",
    en: { title: 'Supplication for Protection', meaning: 'In the name of Allah, with whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.', source: 'Abu Dawud' },
    id: { title: 'Doa Perlindungan', meaning: 'Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat membahayakan, dan Dia Maha Mendengar lagi Maha Mengetahui.', source: 'HR. Abu Dawud' },
    ms: { title: 'Doa Perlindungan', meaning: 'Dengan nama Allah yang bersama nama-Nya tiada sesuatu pun di bumi dan di langit dapat memberi mudarat, dan Dia Maha Mendengar lagi Maha Mengetahui.', source: 'Riwayat Abu Daud' },
  },
  'forgiveness-1': {
    latin: "Astaghfirullahal 'azhimalladzi la ilaha illa huwal hayyul qayyumu wa atubu ilaih",
    en: { title: 'Seeking Forgiveness', meaning: 'I seek forgiveness from Allah the Almighty, besides whom there is no god, the Ever-Living, the Sustainer of all, and I repent to Him.', source: 'Tirmidhi' },
    id: { title: 'Doa Istighfar', meaning: 'Aku memohon ampun kepada Allah Yang Maha Agung, yang tiada Tuhan selain Dia, Yang Maha Hidup lagi terus-menerus mengurus makhluk-Nya, dan aku bertaubat kepada-Nya.', source: 'HR. Tirmidzi' },
    ms: { title: 'Doa Istighfar', meaning: 'Aku memohon ampun kepada Allah Yang Maha Agung, yang tiada Tuhan melainkan Dia, Yang Maha Hidup lagi Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya.', source: 'Riwayat Tirmizi' },
  },
  'gratitude-1': {
    latin: "Alhamdulillahilladzi ath'amana wa saqana wa kafana wa awana",
    en: { title: 'Supplication of Gratitude', meaning: 'Praise be to Allah who has fed us, given us drink, sufficed us and given us shelter.', source: 'Muslim' },
    id: { title: 'Doa Syukur', meaning: 'Segala puji bagi Allah yang telah memberi kami makan, memberi kami minum, mencukupi kebutuhan kami, dan memberi kami tempat berlindung.', source: 'HR. Muslim' },
    ms: { title: 'Doa Kesyukuran', meaning: 'Segala puji bagi Allah yang telah memberi kami makan, memberi kami minum, mencukupkan keperluan kami dan memberi kami tempat berlindung.', source: 'Riwayat Muslim' },
  },
  'evening-1': {
    latin: "Allahumma inni as'aluka khaira hadzihil lailati wa khaira ma fiha wa a'udzu bika min syarriha wa syarri ma fiha",
    en: { title: 'Evening Supplication', meaning: 'O Allah, I ask You for the good of this night and the good of what it contains, and I seek refuge in You from its evil and the evil of what it contains.', source: 'Abu Dawud' },
    id: { title: 'Doa Petang Hari', meaning: 'Ya Allah, aku memohon kepada-Mu kebaikan malam ini dan kebaikan yang ada di dalamnya, dan aku berlindung kepada-Mu dari keburukannya dan keburukan yang ada di dalamnya.', source: 'HR. Abu Dawud' },
    ms: { title: 'Doa Petang', meaning: 'Ya Allah, aku memohon kepada-Mu kebaikan malam ini dan kebaikan yang ada padanya, dan aku berlindung kepada-Mu daripada keburukannya dan keburukan yang ada padanya.', source: 'Riwayat Abu Daud' },
  },
  'sleep-1': {
    latin: 'Bismika Allahumma amutu wa ahya',
    en: { title: 'Before Sleeping', meaning: 'In Your name, O Allah, I die and I live.', source: 'Bukhari' },
    id: { title: 'Doa Sebelum Tidur', meaning: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.', source: 'HR. Bukhari' },
    ms: { title: 'Doa Sebelum Tidur', meaning: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.', source: 'Riwayat Bukhari' },
  },
  'wakeup-1': {
    latin: "Alhamdulillahilladzi ahyana ba'da ma amatana wa ilaihin nusyur",
    en: { title: 'Upon Waking Up', meaning: 'Praise be to Allah who gave us life after He had caused us to die, and to Him is the resurrection.', source: 'Bukhari' },
    id: { title: 'Doa Bangun Tidur', meaning: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami kembali.', source: 'HR. Bukhari' },
    ms: { title: 'Doa Bangun Tidur', meaning: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dibangkitkan.', source: 'Riwayat Bukhari' },
  },
  'stress-1': {
    latin: 'La ilaha illa anta subhanaka inni kuntu minazh zhalimin',
    en: { title: 'Supplication in Distress', meaning: 'There is no god but You. Glory be to You. Indeed, I have been of the wrongdoers.', source: 'Tirmidhi' },
    id: { title: 'Doa Ketika Susah', meaning: 'Tidak ada Tuhan selain Engkau. Maha Suci Engkau, sesungguhnya aku termasuk orang-orang yang zalim.', source: 'HR. Tirmidzi' },
    ms: { title: 'Doa Ketika Kesusahan', meaning: 'Tiada Tuhan melainkan Engkau. Maha Suci Engkau, sesungguhnya aku termasuk dalam golongan orang yang zalim.', source: 'Riwayat Tirmizi' },
  },
  'travel-1': {
    latin: 'Subhanalladzi sakhkhara lana hadza wa ma kunna lahu muqrinin wa inna ila rabbina lamunqalibun',
    en: { title: 'Supplication for Travel', meaning: 'Glory be to Him who has subjected this to us, and we could never have done it ourselves. And indeed, to our Lord we will surely return.', source: 'Tirmidhi' },
    id: { title: 'Doa Bepergian', meaning: 'Maha Suci Allah yang telah menundukkan kendaraan ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya. Dan sesungguhnya kami akan kembali kepada Tuhan kami.', source: 'HR. Tirmidzi' },
    ms: { title: 'Doa Musafir', meaning: 'Maha Suci Allah yang telah menundukkan kenderaan ini untuk kami, sedangkan kami tidak mampu menguasainya. Dan sesungguhnya kepada Tuhan kamilah kami akan kembali.', source: 'Riwayat Tirmizi' },
  },
  'health-1': {
    latin: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi bashari",
    en: { title: 'Supplication for Health', meaning: 'O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight.', source: 'Abu Dawud' },
    id: { title: 'Doa Kesehatan', meaning: 'Ya Allah, sehatkanlah badanku. Ya Allah, sehatkanlah pendengaranku. Ya Allah, sehatkanlah penglihatanku.', source: 'HR. Abu Dawud' },
    ms: { title: 'Doa Kesihatan', meaning: 'Ya Allah, sihatkanlah tubuh badanku. Ya Allah, sihatkanlah pendengaranku. Ya Allah, sihatkanlah penglihatanku.', source: 'Riwayat Abu Daud' },
  },
  'knowledge-1': {
    latin: "Rabbi zidni 'ilma",
    en: { title: 'Supplication for Knowledge', meaning: 'My Lord, increase me in knowledge.', source: 'Surah Taha, 20:114' },
    id: { title: 'Doa Menuntut Ilmu', meaning: 'Ya Tuhanku, tambahkanlah kepadaku ilmu.', source: 'QS. Thaha: 114' },
    ms: { title: 'Doa Menuntut Ilmu', meaning: 'Wahai Tuhanku, tambahkanlah ilmu kepadaku.', source: 'Surah Taha: 114' },
  },
  'guidance-1': {
    latin: 'Allahummahdini wa saddidni',
    en: { title: 'Supplication for Guidance', meaning: 'O Allah, guide me and keep me on the right path.', source: 'Muslim' },
    id: { title: 'Doa Memohon Petunjuk', meaning: 'Ya Allah, berilah aku petunjuk dan luruskanlah aku.', source: 'HR. Muslim' },
    ms: { title: 'Doa Memohon Hidayah', meaning: 'Ya Allah, berilah aku petunjuk dan tetapkanlah aku di atas kebenaran.', source: 'Riwayat Muslim' },
  },
  'patience-1': {
    latin: "Rabbana afrigh 'alaina shabran wa tsabbit aqdamana",
    en: { title: 'Supplication for Patience', meaning: 'Our Lord, pour upon us patience and make our steps firm.', source: 'Surah Al-Baqarah, 2:250' },
    id: { title: 'Doa Memohon Kesabaran', meaning: 'Ya Tuhan kami, limpahkanlah kesabaran kepada kami dan kokohkanlah pendirian kami.', source: 'QS. Al-Baqarah: 250' },
    ms: { title: 'Doa Memohon Kesabaran', meaning: 'Wahai Tuhan kami, limpahkanlah kesabaran kepada kami dan teguhkanlah pendirian kami.', source: 'Surah Al-Baqarah: 250' },
  },
  'food-1': {
    latin: "Allahumma barik lana fima razaqtana wa qina 'adzaban nar, bismillah",
    en: { title: 'Before Eating', meaning: 'O Allah, bless what You have provided us and protect us from the punishment of the Fire. In the name of Allah.', source: 'Ibn Majah' },
    id: { title: 'Doa Sebelum Makan', meaning: 'Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka. Dengan nama Allah.', source: 'HR. Ibnu Majah' },
    ms: { title: 'Doa Sebelum Makan', meaning: 'Ya Allah, berkatilah rezeki yang Engkau kurniakan kepada kami dan peliharalah kami daripada azab neraka. Dengan nama Allah.', source: 'Riwayat Ibnu Majah' },
  },
  'parents-1': {
    latin: 'Rabbirhamhuma kama rabbayani shaghira',
    en: { title: 'Supplication for Parents', meaning: 'My Lord, have mercy upon them as they brought me up when I was small.', source: 'Surah Al-Isra, 17:24' },
    id: { title: 'Doa untuk Orang Tua', meaning: 'Ya Tuhanku, sayangilah keduanya sebagaimana mereka berdua telah mendidikku sewaktu kecil.', source: "QS. Al-Isra': 24" },
    ms: { title: 'Doa untuk Ibu Bapa', meaning: 'Wahai Tuhanku, kasihanilah mereka berdua sebagaimana mereka telah mendidikku semasa kecil.', source: "Surah Al-Isra': 24" },
  },
  'success-1': {
    latin: 'Rabbisyrah li shadri wa yassir li amri',
    en: { title: 'Supplication for Success', meaning: 'My Lord, expand for me my chest and ease for me my task.', source: 'Surah Taha, 20:25-26' },
    id: { title: 'Doa Kemudahan Urusan', meaning: 'Ya Tuhanku, lapangkanlah dadaku dan mudahkanlah urusanku.', source: 'QS. Thaha: 25-26' },
    ms: { title: 'Doa Dipermudahkan Urusan', meaning: 'Wahai Tuhanku, lapangkanlah dadaku dan permudahkanlah urusanku.', source: 'Surah Taha: 25-26' },
  },
  'anger-1': {
    latin: "A'udzu billahi minasy syaithanir rajim",
    en: { title: 'When Angry', meaning: 'I seek refuge in Allah from Satan, the accursed.', source: 'Bukhari' },
    id: { title: 'Doa Ketika Marah', meaning: 'Aku berlindung kepada Allah dari godaan setan yang terkutuk.', source: 'HR. Bukhari' },
    ms: { title: 'Doa Ketika Marah', meaning: 'Aku berlindung kepada Allah daripada syaitan yang direjam.', source: 'Riwayat Bukhari' },
  },
  'mosque-1': {
    latin: 'Allahummaftah li abwaba rahmatik',
    en: { title: 'Entering the Mosque', meaning: 'O Allah, open for me the doors of Your mercy.', source: 'Muslim' },
    id: { title: 'Doa Masuk Masjid', meaning: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.', source: 'HR. Muslim' },
    ms: { title: 'Doa Masuk Masjid', meaning: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.', source: 'Riwayat Muslim' },
  },
  'mosque-2': {
    latin: "Allahumma inni as'aluka min fadhlik",
    en: { title: 'Leaving the Mosque', meaning: 'O Allah, I ask You of Your bounty.', source: 'Muslim' },
    id: { title: 'Doa Keluar Masjid', meaning: 'Ya Allah, sesungguhnya aku memohon kepada-Mu dari karunia-Mu.', source: 'HR. Muslim' },
    ms: { title: 'Doa Keluar Masjid', meaning: 'Ya Allah, sesungguhnya aku memohon kepada-Mu daripada kurniaan-Mu.', source: 'Riwayat Muslim' },
  },
  'rain-1': {
    latin: "Allahumma shayyiban nafi'a",
    en: { title: 'When It Rains', meaning: 'O Allah, make it a beneficial rain.', source: 'Bukhari' },
    id: { title: 'Doa Ketika Hujan', meaning: 'Ya Allah, turunkanlah hujan yang bermanfaat.', source: 'HR. Bukhari' },
    ms: { title: 'Doa Ketika Hujan', meaning: 'Ya Allah, jadikanlah hujan ini hujan yang bermanfaat.', source: 'Riwayat Bukhari' },
  },
  'fear-1': {
    latin: "Hasbiyallahu la ilaha illa huwa 'alaihi tawakkaltu wa huwa rabbul 'arsyil 'azhim",
    en: { title: 'Supplication in Fear', meaning: 'Allah is sufficient for me. There is no god but Him. In Him I put my trust, and He is the Lord of the Mighty Throne.', source: 'Abu Dawud' },
    id: { title: 'Doa Ketika Takut', meaning: 'Cukuplah Allah bagiku, tidak ada Tuhan selain Dia. Hanya kepada-Nya aku bertawakal, dan Dia adalah Tuhan pemilik Arsy yang agung.', source: 'HR. Abu Dawud' },
    ms: { title: 'Doa Ketika Takut', meaning: 'Cukuplah Allah bagiku, tiada Tuhan melainkan Dia. Kepada-Nya aku bertawakal dan Dialah Tuhan yang memiliki Arasy yang agung.', source: 'Riwayat Abu Daud' },
  },
  'exam-1': {
    latin: "Rabbi zidni 'ilman wa fahman wa alhiqni bish shalihin",
    en: { title: 'Supplication Before an Exam', meaning: 'My Lord, increase me in knowledge and understanding, and join me with the righteous.', source: 'Based on Surah Taha, 20:114' },
    id: { title: 'Doa Sebelum Ujian', meaning: 'Ya Tuhanku, tambahkanlah kepadaku ilmu dan pemahaman, dan masukkanlah aku ke dalam golongan orang-orang saleh.', source: 'Berdasarkan QS. Thaha: 114' },
    ms: { title: 'Doa Sebelum Peperiksaan', meaning: 'Wahai Tuhanku, tambahkanlah kepadaku ilmu dan kefahaman, dan masukkanlah aku ke dalam golongan orang yang soleh.', source: 'Berdasarkan Surah Taha: 114' },
  },
  'illness-1': {
    latin: "Adzhibil ba'sa rabban nas, isyfi wa antasy syafi, la syifa'a illa syifa'uka, syifa'an la yughadiru saqama",
    en: { title: 'Supplication for Healing', meaning: 'Remove the harm, O Lord of mankind, and heal, for You are the Healer. There is no healing but Your healing, a healing that leaves no illness behind.', source: 'Bukhari' },
    id: { title: 'Doa Kesembuhan', meaning: 'Hilangkanlah penyakit ini wahai Tuhan manusia, sembuhkanlah, Engkaulah Yang Maha Menyembuhkan. Tidak ada kesembuhan kecuali kesembuhan dari-Mu, kesembuhan yang tidak meninggalkan penyakit.', source: 'HR. Bukhari' },
    ms: { title: 'Doa Penyembuhan', meaning: 'Hilangkanlah penyakit ini wahai Tuhan manusia, sembuhkanlah, Engkaulah Yang Maha Menyembuhkan. Tiada penyembuhan melainkan penyembuhan-Mu, penyembuhan yang tidak meninggalkan sebarang penyakit.', source: 'Riwayat Bukhari' },
  },
  'debt-1': {
    latin: "Allahumma inni a'udzu bika minal hammi wal hazani wal 'ajzi wal kasali wal bukhli wal jubni wa dhala'id daini wa ghalabatir rijal",
    en: { title: 'Relief from Debt', meaning: 'O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from miserliness and cowardice, from the burden of debt and from being overpowered by people.', source: 'Bukhari' },
    id: { title: 'Doa Terbebas dari Utang', meaning: 'Ya Allah, aku berlindung kepada-Mu dari rasa gelisah dan sedih, dari lemah dan malas, dari kikir dan pengecut, dari lilitan utang dan dari dikuasai orang lain.', source: 'HR. Bukhari' },
    ms: { title: 'Doa Dilepaskan daripada Hutang', meaning: 'Ya Allah, aku berlindung kepada-Mu daripada kegelisahan dan kesedihan, daripada lemah dan malas, daripada bakhil dan pengecut, daripada bebanan hutang dan daripada dikuasai orang lain.', source: 'Riwayat Bukhari' },
  },
  'repentance-1': {
    latin: "Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana 'abduka wa ana 'ala 'ahdika wa wa'dika mastatha'tu",
    en: { title: 'Master of Seeking Forgiveness', meaning: 'O Allah, You are my Lord. There is no god but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can.', source: 'Bukhari' },
    id: { title: 'Sayyidul Istighfar', meaning: 'Ya Allah, Engkau adalah Tuhanku, tidak ada Tuhan selain Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu, dan aku berada di atas perjanjian dan janji-Mu sesuai kemampuanku.', source: 'HR. Bukhari' },
    ms: { title: 'Penghulu Istighfar', meaning: 'Ya Allah, Engkaulah Tuhanku, tiada Tuhan melainkan Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu, dan aku berpegang pada perjanjian dan janji-Mu sedaya upayaku.', source: 'Riwayat Bukhari' },
  },
};
