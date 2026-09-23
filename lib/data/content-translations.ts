// Non-Turkish texts for the daily verse/hadith card (daily-content.ts) and the
// healing-verse notifications (quran-verses.ts). Other languages fall back to English.

export type ContentLanguage = 'en' | 'id' | 'ms';

export function contentLanguage(language: string): ContentLanguage | 'tr' {
  const lang = language.split('-')[0];
  if (lang === 'tr') return 'tr';
  return lang === 'id' || lang === 'ms' ? lang : 'en';
}

type Localized = Record<ContentLanguage, { content: string; source: string }>;

/** Keyed by DailyWisdom.id */
export const wisdomTranslations: Record<string, Localized> = {
  '1': {
    en: { content: 'Your Lord has said: Call upon Me; I will respond to you.', source: 'Surah Ghafir, 40:60' },
    id: { content: 'Tuhanmu berfirman: Berdoalah kepada-Ku, niscaya akan Aku perkenankan bagimu.', source: "QS. Ghafir: 60" },
    ms: { content: 'Tuhan kamu berfirman: Berdoalah kepada-Ku, nescaya Aku perkenankan doa kamu.', source: 'Surah Ghafir: 60' },
  },
  '2': {
    en: { content: 'Actions are judged by intentions, and everyone will have what they intended.', source: 'Bukhari, 1' },
    id: { content: 'Sesungguhnya setiap amal tergantung pada niatnya, dan setiap orang akan mendapatkan apa yang ia niatkan.', source: 'HR. Bukhari, no. 1' },
    ms: { content: 'Sesungguhnya setiap amalan bergantung kepada niat, dan setiap orang akan mendapat apa yang diniatkannya.', source: 'Riwayat Bukhari, no. 1' },
  },
  '3': {
    en: { content: 'Indeed, with hardship comes ease.', source: 'Surah Ash-Sharh, 94:5' },
    id: { content: 'Maka sesungguhnya bersama kesulitan ada kemudahan.', source: 'QS. Al-Insyirah: 5' },
    ms: { content: 'Maka sesungguhnya bersama kesukaran ada kemudahan.', source: 'Surah Al-Insyirah: 5' },
  },
  '4': {
    en: { content: 'The best of you are those who learn the Quran and teach it.', source: 'Bukhari, 5027' },
    id: { content: 'Sebaik-baik kalian adalah orang yang belajar Al-Qur\'an dan mengajarkannya.', source: 'HR. Bukhari, no. 5027' },
    ms: { content: 'Sebaik-baik kamu ialah orang yang mempelajari al-Quran dan mengajarkannya.', source: 'Riwayat Bukhari, no. 5027' },
  },
  '5': {
    en: { content: 'Allah does not burden a soul beyond what it can bear.', source: 'Surah Al-Baqarah, 2:286' },
    id: { content: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.', source: 'QS. Al-Baqarah: 286' },
    ms: { content: 'Allah tidak memberati seseorang melainkan apa yang terdaya olehnya.', source: 'Surah Al-Baqarah: 286' },
  },
  '6': {
    en: { content: 'Make things easy and do not make them difficult; give glad tidings and do not drive people away.', source: 'Bukhari, 69' },
    id: { content: 'Permudahlah dan jangan mempersulit, berilah kabar gembira dan jangan membuat orang lari.', source: 'HR. Bukhari, no. 69' },
    ms: { content: 'Permudahkanlah dan jangan menyusahkan, berilah khabar gembira dan jangan menyebabkan orang lari.', source: 'Riwayat Bukhari, no. 69' },
  },
  '7': {
    en: { content: 'Indeed, Allah is with those who are patient.', source: 'Surah Al-Baqarah, 2:153' },
    id: { content: 'Sesungguhnya Allah beserta orang-orang yang sabar.', source: 'QS. Al-Baqarah: 153' },
    ms: { content: 'Sesungguhnya Allah bersama orang-orang yang sabar.', source: 'Surah Al-Baqarah: 153' },
  },
  '8': {
    en: { content: 'Love of this world is the root of every wrongdoing.', source: "Bayhaqi, Shu'ab al-Iman" },
    id: { content: 'Cinta dunia adalah pangkal dari segala kesalahan.', source: "HR. Baihaqi, Syu'abul Iman" },
    ms: { content: 'Cinta dunia adalah punca segala kesalahan.', source: "Riwayat Baihaqi, Syu'abul Iman" },
  },
  '9': {
    en: { content: 'Verily, in the remembrance of Allah do hearts find rest.', source: "Surah Ar-Ra'd, 13:28" },
    id: { content: 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.', source: "QS. Ar-Ra'd: 28" },
    ms: { content: 'Ketahuilah, dengan mengingati Allah hati menjadi tenang.', source: "Surah Ar-Ra'd: 28" },
  },
  '10': {
    en: { content: 'Whoever guides someone to good will have a reward like the one who does it.', source: 'Muslim, 1893' },
    id: { content: 'Barang siapa menunjukkan kepada kebaikan, maka ia mendapat pahala seperti orang yang mengerjakannya.', source: 'HR. Muslim, no. 1893' },
    ms: { content: 'Sesiapa yang menunjukkan kepada kebaikan, maka baginya pahala seperti orang yang melakukannya.', source: 'Riwayat Muslim, no. 1893' },
  },
  '11': {
    en: { content: 'Man shall have nothing but what he strives for.', source: 'Surah An-Najm, 53:39' },
    id: { content: 'Dan bahwa manusia hanya memperoleh apa yang telah diusahakannya.', source: 'QS. An-Najm: 39' },
    ms: { content: 'Dan bahawa manusia tidak memperoleh melainkan apa yang diusahakannya.', source: 'Surah An-Najm: 39' },
  },
  '12': {
    en: { content: 'The best of people are those most beneficial to others.', source: "Tabarani, al-Mu'jam al-Awsat" },
    id: { content: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.', source: "HR. Thabrani, al-Mu'jam al-Ausath" },
    ms: { content: 'Sebaik-baik manusia ialah yang paling bermanfaat kepada manusia lain.', source: "Riwayat Thabrani, al-Mu'jam al-Ausath" },
  },
  '13': {
    en: { content: 'He who created death and life to test you as to which of you is best in deeds.', source: 'Surah Al-Mulk, 67:2' },
    id: { content: 'Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya.', source: 'QS. Al-Mulk: 2' },
    ms: { content: 'Dialah yang menciptakan mati dan hidup untuk menguji kamu, siapakah di antara kamu yang lebih baik amalannya.', source: 'Surah Al-Mulk: 2' },
  },
  '14': {
    en: { content: 'Purity is half of faith.', source: 'Muslim, 223' },
    id: { content: 'Kebersihan adalah sebagian dari iman.', source: 'HR. Muslim, no. 223' },
    ms: { content: 'Kebersihan itu sebahagian daripada iman.', source: 'Riwayat Muslim, no. 223' },
  },
  '15': {
    en: { content: 'Indeed, the most noble of you in the sight of Allah is the most righteous of you.', source: 'Surah Al-Hujurat, 49:13' },
    id: { content: 'Sesungguhnya yang paling mulia di antara kamu di sisi Allah ialah orang yang paling bertakwa.', source: 'QS. Al-Hujurat: 13' },
    ms: { content: 'Sesungguhnya orang yang paling mulia di sisi Allah ialah orang yang paling bertakwa.', source: 'Surah Al-Hujurat: 13' },
  },
};

/** Keyed by QuranVerse.id; `source` is the surah name (verse number is added by the caller). */
export const verseTranslations: Record<string, Localized> = {
  'isra-82': {
    en: { content: 'And We send down of the Quran that which is healing and mercy for the believers.', source: 'Surah Al-Isra' },
    id: { content: 'Dan Kami turunkan dari Al-Qur\'an sesuatu yang menjadi penawar dan rahmat bagi orang-orang yang beriman.', source: "QS. Al-Isra'" },
    ms: { content: 'Dan Kami turunkan daripada al-Quran sesuatu yang menjadi penawar dan rahmat bagi orang yang beriman.', source: "Surah Al-Isra'" },
  },
  'rad-28': {
    en: { content: 'Verily, in the remembrance of Allah do hearts find rest and tranquility.', source: "Surah Ar-Ra'd" },
    id: { content: 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.', source: "QS. Ar-Ra'd" },
    ms: { content: 'Ketahuilah, dengan mengingati Allah hati menjadi tenang dan tenteram.', source: "Surah Ar-Ra'd" },
  },
  'insirah-5-6': {
    en: { content: 'Indeed, with hardship comes ease. Indeed, with hardship comes ease.', source: 'Surah Ash-Sharh' },
    id: { content: 'Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan.', source: 'QS. Al-Insyirah' },
    ms: { content: 'Maka sesungguhnya bersama kesukaran ada kemudahan. Sesungguhnya bersama kesukaran ada kemudahan.', source: 'Surah Al-Insyirah' },
  },
  'mumin-60': {
    en: { content: 'Your Lord has said: Call upon Me; I will respond to you.', source: 'Surah Ghafir' },
    id: { content: 'Tuhanmu berfirman: Berdoalah kepada-Ku, niscaya akan Aku perkenankan bagimu.', source: 'QS. Ghafir' },
    ms: { content: 'Tuhan kamu berfirman: Berdoalah kepada-Ku, nescaya Aku perkenankan doa kamu.', source: 'Surah Ghafir' },
  },
  'duha-3': {
    en: { content: 'Your Lord has not forsaken you, nor is He displeased.', source: 'Surah Ad-Duha' },
    id: { content: 'Tuhanmu tidak meninggalkanmu dan tidak pula membencimu.', source: 'QS. Ad-Duha' },
    ms: { content: 'Tuhanmu tidak meninggalkanmu dan tidak pula membencimu.', source: 'Surah Ad-Dhuha' },
  },
  'bakara-286': {
    en: { content: 'Allah does not burden a soul beyond what it can bear.', source: 'Surah Al-Baqarah' },
    id: { content: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.', source: 'QS. Al-Baqarah' },
    ms: { content: 'Allah tidak memberati seseorang melainkan apa yang terdaya olehnya.', source: 'Surah Al-Baqarah' },
  },
  'taha-114': {
    en: { content: 'And say: My Lord, increase me in knowledge.', source: 'Surah Taha' },
    id: { content: 'Dan katakanlah: Ya Tuhanku, tambahkanlah kepadaku ilmu.', source: 'QS. Thaha' },
    ms: { content: 'Dan katakanlah: Wahai Tuhanku, tambahkanlah ilmu kepadaku.', source: 'Surah Taha' },
  },
  'zumer-53': {
    en: { content: 'Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah.', source: 'Surah Az-Zumar' },
    id: { content: 'Katakanlah: Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah.', source: 'QS. Az-Zumar' },
    ms: { content: 'Katakanlah: Wahai hamba-hamba-Ku yang telah melampaui batas terhadap diri sendiri, janganlah kamu berputus asa daripada rahmat Allah.', source: 'Surah Az-Zumar' },
  },
  'yunus-57': {
    en: { content: 'O mankind, there has come to you instruction from your Lord, healing for what is in the hearts, and guidance and mercy for the believers.', source: 'Surah Yunus' },
    id: { content: 'Wahai manusia, sungguh telah datang kepadamu pelajaran dari Tuhanmu, penyembuh bagi penyakit dalam dada, dan petunjuk serta rahmat bagi orang-orang yang beriman.', source: 'QS. Yunus' },
    ms: { content: 'Wahai manusia, sesungguhnya telah datang kepadamu pengajaran daripada Tuhanmu, penawar bagi penyakit dalam dada, serta petunjuk dan rahmat bagi orang yang beriman.', source: 'Surah Yunus' },
  },
  'suara-80': {
    en: { content: 'And when I am ill, it is He who cures me.', source: "Surah Ash-Shu'ara" },
    id: { content: 'Dan apabila aku sakit, Dialah yang menyembuhkanku.', source: "QS. Asy-Syu'ara'" },
    ms: { content: 'Dan apabila aku sakit, Dialah yang menyembuhkanku.', source: "Surah Asy-Syu'ara'" },
  },
  'talak-3': {
    en: { content: 'And whoever relies upon Allah, then He is sufficient for him.', source: 'Surah At-Talaq' },
    id: { content: 'Dan barang siapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.', source: 'QS. At-Talaq' },
    ms: { content: 'Dan sesiapa yang bertawakal kepada Allah, maka Allah akan mencukupkan keperluannya.', source: 'Surah At-Talaq' },
  },
  'fussilet-44': {
    en: { content: 'Say: It is, for those who believe, a guidance and a healing.', source: 'Surah Fussilat' },
    id: { content: 'Katakanlah: Al-Qur\'an adalah petunjuk dan penyembuh bagi orang-orang yang beriman.', source: 'QS. Fussilat' },
    ms: { content: 'Katakanlah: Al-Quran itu petunjuk dan penawar bagi orang yang beriman.', source: 'Surah Fussilat' },
  },
  'bakara-186': {
    en: { content: 'And when My servants ask you concerning Me, indeed I am near. I respond to the call of the caller when he calls upon Me.', source: 'Surah Al-Baqarah' },
    id: { content: 'Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku dekat. Aku mengabulkan permohonan orang yang berdoa apabila ia berdoa kepada-Ku.', source: 'QS. Al-Baqarah' },
    ms: { content: 'Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku dekat. Aku memperkenankan doa orang yang berdoa apabila ia berdoa kepada-Ku.', source: 'Surah Al-Baqarah' },
  },
  'tebve-128': {
    en: { content: 'There has certainly come to you a Messenger from among yourselves. Grievous to him is what you suffer; he is concerned over you and to the believers is kind and merciful.', source: 'Surah At-Tawbah' },
    id: { content: 'Sungguh telah datang kepadamu seorang rasul dari kaummu sendiri, berat terasa olehnya penderitaanmu, sangat menginginkan kebaikan bagimu, amat belas kasihan lagi penyayang terhadap orang-orang mukmin.', source: 'QS. At-Taubah' },
    ms: { content: 'Sesungguhnya telah datang kepadamu seorang rasul daripada golonganmu sendiri, berat baginya penderitaanmu, sangat mengambil berat tentangmu, amat belas kasihan lagi penyayang kepada orang yang beriman.', source: 'Surah At-Taubah' },
  },
  'furkan-74': {
    en: { content: 'Our Lord, grant us from among our spouses and offspring comfort to our eyes, and make us leaders for the righteous.', source: 'Surah Al-Furqan' },
    id: { content: 'Ya Tuhan kami, anugerahkanlah kepada kami pasangan dan keturunan sebagai penyenang hati kami, dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa.', source: 'QS. Al-Furqan' },
    ms: { content: 'Wahai Tuhan kami, kurniakanlah kepada kami pasangan dan zuriat yang menyejukkan mata, dan jadikanlah kami pemimpin bagi orang yang bertakwa.', source: 'Surah Al-Furqan' },
  },
  'aliimran-173': {
    en: { content: 'Sufficient for us is Allah, and He is the best Disposer of affairs.', source: 'Surah Ali Imran' },
    id: { content: 'Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.', source: 'QS. Ali Imran' },
    ms: { content: 'Cukuplah Allah bagi kami, dan Dialah sebaik-baik pelindung.', source: 'Surah Ali Imran' },
  },
};
