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
Sen İslam alimi düzeyinde güvenilir, muteber ve sahih kaynaklara (Kütüb-i Sitte, Diyanet Meali, Buhari, Müslim, Tirmizi, Ebu Davud vb.) hakim bir yapay zeka asistanısın.

Bugünün Tarihi: ${now.toISOString().slice(0, 10)}
Bugün Cuma mı: ${isFriday ? 'EVET (Hayırlı Cumalar)' : 'HAYIR'}

Lütfen mobil "Ezan Vakti + Hatim" uygulaması için bugüne özel, gönüllere şifa, ferahlık ve huzur veren şu 3 içeriği oluştur ve SADECE geçerli bir JSON formatında döndür (markdown backtick olmadan):

{
  "version": "1.0.0",
  "updatedAt": "${now.toISOString()}",
  "date": "${now.toISOString().slice(0, 10)}",
  "isFriday": ${isFriday},
  "featuredDua": {
    "title": "Duaya uygun etkileyici Türkçe başlık (Örn: Rızık ve Bereket Duası, Şifa Duası)",
    "arabic": "Tam harekeli ve hatasız Arapça dua metni",
    "turkish": "Tam ve akıcı Türkçe anlamı",
    "transliteration": "Latin harfleriyle Türkçe okunuşu",
    "source": "Muteber kaynak (Örn: Buhari, Deavat, 14 / Tirmizi)",
    "category": "daily | worship | protection | family | other"
  },
  "featuredVerse": {
    "arabic": "Tam harekeli Arapça ayet metni",
    "turkish": "Diyanet meali standartlarında Türkçe anlamı",
    "surah": "Sure Adı (Örn: İnşirâh Suresi)",
    "verseNumber": 5,
    "theme": "sifa | huzur | sabir | rahmet | tevekkul"
  },
  "featuredHadith": {
    "arabic": "Arapça hadis metni",
    "turkish": "Türkçe anlamı",
    "source": "Sahih kaynak (Örn: Riyazü's-Salihin, 123 / Buhari)"
  },
  "dailyWisdom": {
    "title": "Günün Manevi Mesajı",
    "message": "Kullanıcıyı namaza, zikre ve tefekküre davet eden 1-2 cümlelik samimi ve huzur verici tavsiye."
  }
}
`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

    // İstenmeyen özel amaçlı (TTS, Image, Audio, Clip, Robotik vs.) modelleri filtrele
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

    console.log(`📋 Hesabınızda metin üretimi için kullanılabilir modeller: ${usableModels.slice(0, 8).join(', ')}`);
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

  // Önce API'den hesabın aktif modellerini çekelim
  const discoveredModels = await getAvailableGeminiModels();

  // Öncelikli Free tier modelleri
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
        
        // Free tier kota aşımı (429) durumunda bir sonraki model için 3 saniye bekle
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

      // Güvenli JSON ayıklama (Model başında veya sonunda metin/markdown olsa bile { ... } arasını alır)
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error(`Model çıktısında geçerli JSON nesnesi bulunamadı: ${textContent.slice(0, 100)}`);
      }

      const parsed = JSON.parse(jsonMatch[0]);
      console.log(`✨ ${model} ile başarıyla içerik üretildi.`);
      return parsed;
    } catch (err) {
      console.warn(`⚠️ ${model} hatası:`, err.message);
      lastError = err;
      // Hata durumunda kısa bir nefes payı
      await sleep(1500);
    }
  }

  throw lastError || new Error('Tüm Gemini modelleri denendi ancak yanıt alınamadı.');
}

const fallbackPool = [
  {
    featuredDua: {
      title: isFriday ? "Cuma Günü İstiğfar ve Mağfiret Duası" : "Günün Şifa ve Afiyet Duası",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
      turkish: "Allah'ım! Senden dünyada ve ahirette af ve afiyet (sağlık, esenlik ve huzur) dilerim.",
      transliteration: "Allahumme inni es'elukel afve vel afiyete fiddunya vel ahirah",
      source: "Ebu Davud, Edeb, 101",
      category: "daily"
    },
    featuredVerse: {
      arabic: "وَنُنَزِّلُ مِنَ الْقُرْاٰنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِن۪ينَ",
      turkish: "Biz Kur'an'dan, müminler için şifa ve rahmet olan şeyler indiriyoruz.",
      surah: "İsrâ Suresi",
      verseNumber: 82,
      theme: "sifa"
    },
    featuredHadith: {
      arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
      turkish: "Sizin en hayırlınız, Kur'an'ı öğrenen ve öğretendir.",
      source: "Buhari, Fedâilü'l-Kur'ân, 21"
    },
    dailyWisdom: {
      title: isFriday ? "Hayırlı Cumalar" : "Günün Manevi Molası",
      message: isFriday 
        ? "Cumanız mübarek olsun. Bugün Kehf Suresi okumayı, sevdiklerinizle helalleşmeyi ve dua etmeyi unutmayın."
        : "Günün koşuşturmasında kalbine bir ayet ve tesbihat ile ferahlık ver. Zikir kalpleri diriltir."
    }
  },
  {
    featuredDua: {
      title: "Kalp Ferahlığı ve Hüzünden Kurtulma Duası",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ",
      turkish: "Allah'ım! Kederden, hüzünden, acizlikten ve tembellikten sana sığınırım.",
      transliteration: "Allahumme inni euzu bike minel hemmi vel hazen vel aczi vel kesel",
      source: "Buhari, Cihad, 74",
      category: "protection"
    },
    featuredVerse: {
      arabic: "اَلَا بِذِكْرِ اللّٰهِ تَطْمَئِنُّ الْقُلُوبُ",
      turkish: "Bilesiniz ki, kalpler ancak Allah'ı anmakla huzur bulur.",
      surah: "Ra'd Suresi",
      verseNumber: 28,
      theme: "huzur"
    },
    featuredHadith: {
      arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
      turkish: "Dua, ibadetin ta kendisidir.",
      source: "Tirmizi, Deavat, 1"
    },
    dailyWisdom: {
      title: "Huzur ve Tevekkül",
      message: "Dertlerin seni yorduğunda ellerini semaya aç. Rabbin sana şah damarından daha yakındır."
    }
  },
  {
    featuredDua: {
      title: "Zihin Açıklığı ve İlim Duası",
      arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
      turkish: "Rabbim! Gönlüme ferahlık ver, işimi bana kolaylaştır.",
      transliteration: "Rabbisrah li sadri ve yessir li emri",
      source: "Tâhâ Suresi, 25-26",
      category: "worship"
    },
    featuredVerse: {
      arabic: "فَاِنَّ مَعَ الْعُسْرِ يُسْراًۜ اِنَّ مَعَ الْعُسْرِ يُسْراً",
      turkish: "Şüphesiz her güçlükle beraber bir kolaylık vardır.",
      surah: "İnşirâh Suresi",
      verseNumber: 5,
      theme: "sabir"
    },
    featuredHadith: {
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
      turkish: "Ameller niyetlere göredir. Herkese niyet ettiği şeyin karşılığı vardır.",
      source: "Buhari, Bed'ü'l-Vahy, 1"
    },
    dailyWisdom: {
      title: "Kolaylık Müjdesi",
      message: "Karşılaştığın her zorluğun arkasında gizlenmiş bir kolaylık vardır. Sabret ve namazla yardım dile."
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
