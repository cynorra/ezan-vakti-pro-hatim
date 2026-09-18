import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../public/content-feed.json');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Tarih ve özel gün kontrolü
const now = new Date();
const isFriday = now.getDay() === 5;
const month = now.getMonth() + 1; // 1-12
const day = now.getDate();

const promptText = `
Sen İslam ilimleri (Tefsir, Hadis, Fıkıh, Tasavvuf) alanında uzman, muteber ve sahih kaynaklara (Kütüb-i Sitte: Buhârî, Müslim, Tirmizî, Ebû Dâvûd, Nesâî, İbn Mâce; Diyanet İşleri Başkanlığı ve TDV İslam Ansiklopedisi mealleri) %100 sadık bir baş danışmansın.

⚠️ ÇOK KRİTİK KALİTE VE SAHİHLİK KURALLARI (SIFIR AI SLOP):
1. ASLA KENDİNDEN DUA VEYA HADİS UYDURMA: Seçilen tüm dualar ve hadisler Peygamber Efendimiz'in (s.a.v.) sahih sünnetinden veya Kur'an ayetlerinden birebir alınmalıdır.
2. KAYNAK ZORUNLULUĞU: Ayet için Sure Adı ve Ayet No (Örn: "İsrâ Suresi, 82. Ayet"), Hadis ve Dualar için net sahih kaynak (Örn: "Buhârî, Deavât, 14", "Müslim, Zikir, 48", "Ebû Dâvûd, Edeb, 101") kesinlikle belirtilmelidir.
3. KUSURSUZ HAREKELİ ARAPÇA: Arapça metinler tam harekeli (fetha, kesre, damme, sükûn, şedde), noksansız ve orijinal Mushaf/Hadis hattına %100 sadık olmalıdır.
4. EDEBİ VE VAKUR TÜRKÇE: Mealler ve çeviriler mekanik/robotik AI dili olmamalı; Diyanet meali standartlarında, akıcı, kalbe dokunan, vakar sahibi ve derin bir Türkçe ile yazılmalıdır.
5. GÜNÜN MANEVİ MESAJI: Klişe kişisel gelişim/motivasyon lafları (AI slop) YASAKTIR. İslam irfanından beslenen, samimi, insanı tefekküre, namaza, istiğfara, şükre ve gönül ferahlığına sevk eden 1-2 cümlelik hikmetli bir nasihat olmalıdır.
6. GÜN: ${now.toISOString().slice(0, 10)} | Cuma mı: ${isFriday ? 'EVET (Cuma namazı, salavat, Kehf suresi ve Cuma adabına özel sahih içerik seç)' : 'HAYIR'}

Lütfen SADECE geçerli bir JSON nesnesi döndür:
{
  "version": "1.0.0",
  "updatedAt": "${now.toISOString()}",
  "date": "${now.toISOString().slice(0, 10)}",
  "isFriday": ${isFriday},
  "featuredDua": {
    "title": "Duaya uygun derin ve anlamlı Türkçe başlık",
    "arabic": "Tam harekeli orijinal Arapça metin",
    "turkish": "Diyanet standardında akıcı Türkçe meali",
    "transliteration": "Doğru Türkçe okunuşu",
    "source": "Sahih kaynak (Buhari, Müslim, Tirmizi, Ebu Davud vb.)",
    "category": "daily"
  },
  "featuredVerse": {
    "arabic": "Tam harekeli Kur'an ayeti",
    "turkish": "Diyanet meali Türkçe anlamı",
    "surah": "Sure Adı",
    "verseNumber": 1,
    "theme": "sifa"
  },
  "featuredHadith": {
    "arabic": "Tam harekeli sahih hadis metni",
    "turkish": "Türkçe anlamı",
    "source": "Sahih kaynak"
  },
  "dailyWisdom": {
    "title": "Günün Manevi Mesajı",
    "message": "Kalbe şifa ve tefekkür veren hikmetli tavsiye"
  }
}
`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// İçerik Kalite & Doğrulama Kontrolü (Zero-AI-Slop Validator)
function validateContentQuality(data) {
  if (!data || typeof data !== 'object') return false;

  const { featuredDua, featuredVerse, featuredHadith, dailyWisdom } = data;
  if (!featuredDua || !featuredVerse || !featuredHadith || !dailyWisdom) return false;

  // Arapça karakter kontrolü (Arapça harfler ve hareke kontrolü)
  const arabicRegex = /[\u0600-\u06FF]/;
  if (!arabicRegex.test(featuredDua.arabic) || !arabicRegex.test(featuredVerse.arabic) || !arabicRegex.test(featuredHadith.arabic)) {
    console.warn('⚠️ Kalite Kontrolü: Arapça metinler geçerli veya harekeli değil.');
    return false;
  }

  // Kaynak kontrolü
  if (!featuredDua.source || featuredDua.source.length < 5 || !featuredVerse.surah || !featuredHadith.source) {
    console.warn('⚠️ Kalite Kontrolü: Muteber kaynak bilgileri eksik.');
    return false;
  }

  // Türkçe anlamların uzunluk ve akıcılık kontrolü
  if (featuredDua.turkish.length < 15 || featuredVerse.turkish.length < 15 || featuredHadith.turkish.length < 15) {
    console.warn('⚠️ Kalite Kontrolü: Türkçe mealler yetersiz.');
    return false;
  }

  return true;
}

async function getAvailableGeminiModels() {
  try {
    const listEndpoint = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    const res = await fetch(listEndpoint);
    if (!res.ok) {
      console.warn(`⚠️ ListModels başarısız oldu (${res.status}): ${await res.text()}`);
      return [];
    }
    const data = await res.json();
    if (!data.models || !Array.isArray(data.models)) return [];

    // İstenmeyen özel amaçlı modelleri filtrele
    const excludedPatterns = /image|tts|transcribe|clip|audio|robotics|computer-use|deep-research/i;

    const usableModels = data.models
      .filter(m => 
        Array.isArray(m.supportedGenerationMethods) && 
        m.supportedGenerationMethods.includes('generateContent') &&
        !excludedPatterns.test(m.name)
      )
      .map(m => m.name.replace(/^models\//, ''));

    // Free planda en kararlı ve yüksek kotalı 'flash' modellerini en başa al
    usableModels.sort((a, b) => {
      const aScore = a.includes('flash-lite') ? 3 : a.includes('flash-latest') ? 2 : a.includes('flash') ? 1 : 0;
      const bScore = b.includes('flash-lite') ? 3 : b.includes('flash-latest') ? 2 : b.includes('flash') ? 1 : 0;
      return bScore - aScore;
    });

    console.log(`📋 Hesabınızda metin üretimi için kullanılabilir modeller: ${usableModels.slice(0, 6).join(', ')}`);
    return usableModels;
  } catch (e) {
    console.warn('⚠️ ListModels çağrılırken hata:', e.message);
    return [];
  }
}

async function fetchFromGemini() {
  if (!GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY bulunamadı, yedek içerik üreticisine geçiliyor...');
    return null;
  }

  const discoveredModels = await getAvailableGeminiModels();

  const preferredModels = [
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-pro-latest'
  ];

  const modelCandidates = Array.from(new Set([
    ...preferredModels,
    ...discoveredModels
  ]));

  let lastError = null;

  for (const model of modelCandidates) {
    try {
      console.log(`🤖 Model deneniyor: ${model}...`);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const requestBody = {
        contents: [
          {
            parts: [{ text: promptText }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1200
        }
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`⚠️ ${model} yanıt vermedi (${response.status}): ${errText.slice(0, 150)}`);
        lastError = new Error(`HTTP ${response.status}: ${errText}`);
        
        if (response.status === 429) {
          console.log('⏳ Free tier kota limiti (429) nedeniyle 3 saniye bekleniyor...');
          await sleep(3000);
        }
        continue;
      }

      const json = await response.json();
      const textContent = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textContent) {
        console.warn(`⚠️ ${model} boş yanıt döndü.`);
        continue;
      }

      // Güvenli JSON ayıklama
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error(`Model çıktısında geçerli JSON nesnesi bulunamadı: ${textContent.slice(0, 100)}`);
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Kalite ve Sahihlik Denetimi (Zero-AI-Slop Validator)
      if (!validateContentQuality(parsed)) {
        throw new Error('Üretilen içerik kalite ve sahihlik testinden geçemedi.');
      }

      console.log(`✨ ${model} ile sahih ve yüksek kaliteli içerik başarıyla üretildi.`);
      return parsed;
    } catch (err) {
      console.warn(`⚠️ ${model} hatası:`, err.message);
      lastError = err;
      await sleep(1500);
    }
  }

  throw lastError || new Error('Tüm Gemini modelleri denendi ancak geçerli içerik alınamadı.');
}

const fallbackPool = [
  {
    featuredDua: {
      title: isFriday ? "Cuma Günü Seyyidü'l İstiğfar Duası" : "Seyyidü'l İstiğfar (Tevbelerin Efendisi)",
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      turkish: "Allah'ım! Sen benim Rabbimsin. Senden başka hiçbir ilah yoktur. Beni sen yarattın, ben senin kulunum. Gücüm yettiğince sana verdiğim ahde ve vaade sadığım. Yaptıklarımın şerrinden sana sığınırım. Bana lütfettiğin nimetleri itiraf eder, günahlarımı da ikrar ederim. Beni bağışla; zira günahları ancak sen bağışlarsın.",
      transliteration: "Allahümme ente Rabbî lâ ilâhe illâ ente halaktenî ve ene 'abdüke ve ene 'alâ 'ahdike ve va'dike mesteta'tü, e'ûzü bike min şerri mâ sana'tü, ebû'u leke bi-ni'metike 'aleyye ve ebû'u bi-zenbî fağfirlî fe-innehû lâ yağfiru'z-zünûbe illâ ente.",
      source: "Buhârî, Deavât, 2; Tirmizî, Deavât, 15",
      category: "daily"
    },
    featuredVerse: {
      arabic: "وَنُنَزِّلُ مِنَ الْقُرْاٰنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِن۪ينَۙ وَلَا يَزِيدُ الظَّالِمِينَ إِلَّا خَسَاراً",
      turkish: "Biz Kur'an'dan müminler için şifa ve rahmet olan şeyler indiriyoruz; zalimlerin ise sadece ziyanını artırır.",
      surah: "İsrâ Suresi",
      verseNumber: 82,
      theme: "sifa"
    },
    featuredHadith: {
      arabic: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
      turkish: "Allah katında amellerin en sevimlisi, az da olsa devamlı olanıdır.",
      source: "Buhârî, Rikâk, 18; Müslim, Müsâfirîn, 218"
    },
    dailyWisdom: {
      title: isFriday ? "Cuma Günü Nur ve Arınma" : "İbadette Devamlılık",
      message: isFriday
        ? "Cuma gününün bereketini bol salavat, Kehf suresi tilaveti ve samimi dualarla taçlandırın. Bugün duaların geri çevrilmediği bir icabet saati gizlidir."
        : "Büyük işleri beklerken küçük hayırları ihmal etme. Rabbinin rızası, her gün kılınan vakit namazındaki ve çekilen samimi bir tesbihteki sebatta saklıdır."
    }
  },
  {
    featuredDua: {
      title: "Hz. Yûnus'un (a.s.) Sıkıntı ve Ferahlık Duası",
      arabic: "لَّا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
      turkish: "Senden başka hiçbir ilah yoktur. Seni tenzih ve tesbih ederim. Şüphesiz ben kendi nefsine zulmedenlerden oldum.",
      transliteration: "Lâ ilâhe illâ ente sübhâneke innî küntü mine'z-zâlimîn.",
      source: "Enbiyâ Suresi, 87; Tirmizî, Deavât, 81",
      category: "protection"
    },
    featuredVerse: {
      arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      turkish: "Onlar iman etmiş ve kalpleri Allah'ın zikriyle huzura kavuşmuş kimselerdir. Bilesiniz ki, kalpler ancak Allah'ı anmakla huzur ve sükûn bulur.",
      surah: "Ra'd Suresi",
      verseNumber: 28,
      theme: "huzur"
    },
    featuredHadith: {
      arabic: "مَنْ لَزِمَ الاِسْتِغْفَارَ جَعَلَ اللَّهُ لَهُ مِنْ كُلِّ ضِيقٍ مَخْرَجًا وَمِنْ كُلِّ هَمٍّ فَرَجًا وَرَزَقَهُ مِنْ حَيْثُ لاَ يَحْتَسِبُ",
      turkish: "Kim istiğfara (bağışlanma dilemeye) devam ederse, Allah ona her darlıktan bir çıkış, her kederden bir kurtuluş yolu nasip eder ve onu ummadığı yerden rızıklandırır.",
      source: "Ebû Dâvûd, Vitr, 26; İbn Mâce, Edeb, 57"
    },
    dailyWisdom: {
      title: "Gönül Huzuru",
      message: "Dünya telaşı ruhunu daralttığında dilini zikirle, alnını secdeyle buluştur. Allah'ı anan kalp hiçbir zaman sahipsiz ve çaresiz kalmaz."
    }
  },
  {
    featuredDua: {
      title: "Hz. İbrâhim'in (a.s.) Namazda Sebat Duası",
      arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ ۝ رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
      turkish: "Rabbim! Beni ve soyumdan gelecekleri namazı dosdoğru kılanlardan eyle. Rabbimiz! Duamı kabul buyur. Rabbimiz! Hesabın görüleceği gün beni, anne-babamı ve bütün müminleri bağışla.",
      transliteration: "Rabbi'c'alnî mukîme's-salâti ve min zürriyyetî, Rabbenâ ve tekabbel du'â'. Rabbenâ'ğfir lî ve li-vâlideyye ve li'l-mü'minîne yevme yekûmü'l-hisâb.",
      source: "İbrâhim Suresi, 40-41 (Namaz Ka'desi)",
      category: "worship"
    },
    featuredVerse: {
      arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      turkish: "Elbette her zorlukla beraber bir kolaylık vardır. Gerçekten, her güçlüğün yanında bir ferahlık mutlaka vardır.",
      surah: "İnşirâh Suresi",
      verseNumber: 5,
      theme: "sabir"
    },
    featuredHadith: {
      arabic: "الصَّلَاةُ نُورٌ، وَالصَّدَقَةُ بُرْهَانٌ، وَالصَّبْرُ ضِيَاءٌ، وَالْقُرْآنُ حُجَّةٌ لَكَ أَوْ عَلَيْكَ",
      turkish: "Namaz bir nurdur; sadaka kesin bir delildir; sabır bir aydınlıktır; Kur'an ise lehine veya aleyhine bir şahittir.",
      source: "Müslim, Tahâret, 1; Tirmizî, Deavât, 86"
    },
    dailyWisdom: {
      title: "Namazın Bereketi",
      message: "Namaz, kul ile Rabbi arasındaki en mukaddes buluşmadır. Vaktini namaza göre ayarlayanın vakti de, ömrü de, hanesi de bereketlenir."
    }
  },
  {
    featuredDua: {
      title: "Şifa ve Afiyet Duası (Peygamberimizin Sabah-Akşam Duası)",
      arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ",
      turkish: "Allah'ım! Bedenime afiyet ver. Allah'ım! Kulağıma afiyet ver. Allah'ım! Gözüme afiyet ver. Senden başka hiçbir ilah yoktur.",
      transliteration: "Allahümme 'âfinî fî bedenî, Allahümme 'âfinî fî sem'î, Allahümme 'âfinî fî basarî, lâ ilâhe illâ ente.",
      source: "Ebû Dâvûd, Edeb, 101; Ahmed b. Hanbel, Müsned, V, 42",
      category: "daily"
    },
    featuredVerse: {
      arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
      turkish: "Kullarım sana beni sorduklarında bilsinler ki ben onlara çok yakınım. Bana dua edenin duasına icabet ederim.",
      surah: "Bakara Suresi",
      verseNumber: 186,
      theme: "rahmet"
    },
    featuredHadith: {
      arabic: "الدُّعَاءُ مُخُّ الْعِبَادَةِ",
      turkish: "Dua, ibadetin özü ve iliğidir.",
      source: "Tirmizî, Deavât, 1"
    },
    dailyWisdom: {
      title: "Duanın Gücü",
      message: "İstediğin şey ne kadar büyük olursa olsun, Rabbinin kudretinden ve merhametinden daha büyük değildir. Samimiyetle iste, O icabet eder."
    }
  }
];

async function main() {
  console.log(`[${new Date().toISOString()}] Günlük AI Dua & Ayet Üretimi Başlatılıyor...`);

  let contentData = null;

  try {
    contentData = await fetchFromGemini();
    console.log('✅ Google Gemini AI ile taze ve güncel içerik başarıyla üretildi.');
  } catch (error) {
    console.log('⚠️ Gemini API çağrısı sırasında hata oluştu, zengin yedek havuzdan seçiliyor:', error.message);
    const dayIndex = (now.getDate() + now.getMonth()) % fallbackPool.length;
    const selected = fallbackPool[dayIndex];
    contentData = {
      version: "1.0.0",
      updatedAt: now.toISOString(),
      date: now.toISOString().slice(0, 10),
      isFriday: isFriday,
      ...selected
    };
  }

  // public dizini kontrol et
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(contentData, null, 2), 'utf-8');
  console.log(`✅ İçerik başarıyla yazıldı: ${outputPath}`);
}

main().catch(err => {
  console.error('Kritik Hata:', err);
  process.exit(1);
});
