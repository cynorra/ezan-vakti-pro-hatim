# Google Play Store Çok Dilli ASO & Çeviri Sistemi Rehberi (Proje Hafızası)

Bu doküman, **Ezan Vakti Pro + Hatim** (`com.cynnora.ezanvakti`) uygulamasının Google Play Console üzerindeki **87 dildeki** mağaza listelemesi (Title, Short Description, Full Description) yönetimini, teknik kurallarını ve otomatik üretim mimarisini kayıt altında tutan **proje hafızasıdır**.

---

## 🎯 1. Temel Kurallar ve Kesin Karakter Sınırları

Google Play Console mağaza girişinde uygulanan katı karakter sınırları:
- **Başlık (Title):** En fazla **30 karakter**
- **Kısa Açıklama (Short Description):** En fazla **80 karakter**
- **Tam Açıklama (Full Description):** En fazla **4000 karakter**

> [!IMPORTANT]
> Karakter sınırları hesaplanırken Unicode emojiler ve özel karakterler tam uzunluk olarak sayılır. `scripts/generate-play-store-translations.mjs` scripti her metin için otomatik güvenlik kırpması yaparak bu sınırların asla aşılmamasını garanti eder.

---

## 🚨 2. Google Play Console İçe Aktarma (Import) Kritik Bilgileri

Google Play Console'un "Çevirileri İçe Aktar" özelliği aşağıdaki teknik kurallara kesin olarak bağımlıdır:

1. **UTF-8 Encoding (BOM OLMADAN):**
   - CSV dosyası kesinlikle **UTF-8 (No BOM)** olarak kaydedilmelidir.
   - Eğer dosyaya `\ufeff` (BOM) eklenirse, Google Play ilk sütun olan `Language` başlığını tanıyamaz ve *"Yüklenemedi. Tekrar deneyin."* hatası verir.
2. **Varsayılan Dil Zorunluluğu (`en-US`):**
   - Mağaza girişinin varsayılan dili olan `en-US` (İngilizce - ABD) mutlaka CSV satırları arasında yer almalıdır.
3. **Google Play'e Özel Dil Kodları (Legacy & Regional Tags):**
   - **İbranice:** `iw-IL` (Google Play eski Java ISO kodunu kullanır, `he` çalışmaz).
   - **Kırgızca:** `ky-KG`
   - **Marathi (Hindistan):** `mr-IN`
   - **Telugu (Hindistan):** `te-IN`
   - **Malayca (Malezya):** `ms-MY` ve Genel `ms`
   - **Farsça:** `fa` (Genel), `fa-IR` (İran), `fa-AF` (Afganistan), `fa-AE` (BAE)
   - **İspanyolca:** `es-ES` (İspanya), `es-419` (Latin Amerika), `es-US` (ABD)
   - **Portekizce:** `pt-BR` (Brezilya), `pt-PT` (Portekiz)
   - **Çince:** `zh-CN` (Basitleştirilmiş), `zh-TW` (Geleneksel), `zh-HK` (Hong Kong)
   - **İngilizce Varyantlar:** `en-US`, `en-GB`, `en-CA`, `en-AU`, `en-IN`, `en-SG`, `en-ZA`
   - **Zuluca:** `zu`
   - **İzlandaca:** `is-IS`

---

## 🌍 3. Bölgesel & Kültürel Yerelleştirme (ASO Terminolojisi)

Düz yapay zeka çevirisi yerine ülkelerin yerel arama hacmi en yüksek İslami terimleri kullanılmıştır:

| Dil / Bölge | Kullanılan Doğal ASO Terimleri |
|---|---|
| **Endonezya (`id`)** | `Jadwal Sholat`, `Khataman Quran Bersama`, `Kiblat`, `Tasbih Digital` |
| **Malezya (`ms`, `ms-MY`)** | `Waktu Solat`, `Khatam Al-Quran Bersama`, `Arah Kiblat`, `Tasbih` |
| **Farsça (`fa`, `fa-IR`, `fa-AF`, `fa-AE`)** | `اوقات شرعی` (Owqat-e Shar'i), `ختم قرآن گروهی`, `قبله نما`, `صلوات شمار` |
| **Urduca / Hintçe (`ur`, `hi-IN`, `mr-IN`, `te-IN`)** | `نماز کے اوقات` (Namaz ke Auqat), `اذان کا وقت`, `30 سپارے` (30 Sipara), `قبلہ نما` |
| **Arapça (`ar`)** | `مواقيت الصلاة`, `أذان دقيق`, `ختمة القرآن الجماعية`, `اتجاه القبلة`, `مسبحة إلكترونية` |
| **Rusça / Orta Asya (`ru-RU`, `kk`, `ky-KG`, `uz`)** | `Время намаза`, `Азан`, `Коран Хатым`, `Кибла компас`, `Тасбих` |
| **Türkçe (`tr-TR`)** | `Ezan Vakti Pro: Hatim & Kıble`, `Namaz vakitleri, ezan alarmı, hatim cüz paylaşımı, kıble pusulası ve zikirmatik.` |

---

## 📁 4. Desteklenen 87 Dil Listesi

Aşağıdaki 87 dil ve bölgesel varyant Google Play Console ekranında eksiksiz olarak desteklenmektedir:

```
en-US, af, de-DE, am, ar, sq, az-AZ, eu-ES, be, bn-BD,
my-MM, bg, da-DK, id, hy-AM, et, fa, fa-AE, fa-AF, fa-IR,
nl-NL, fil, fi-FI, fr-FR, fr-CA, gl-ES, gu, ka-GE, hi-IN, hr,
ja-JP, kn-IN, ca, kk, km-KH, ko-KR, ky-KG, lo-LA, pl-PL, lv,
lt, hu-HU, mk-MK, ml-IN, ms-MY, ms, mr-IN, mn-MN, ne-NP, no-NO,
pa, pt-BR, pt-PT, rm, ro, ru-RU, si-LK, sk, sl, sw,
sr, ta-IN, th, te-IN, tr-TR, uk, ur, vi, el-GR, zu,
cs-CZ, zh-CN, zh-TW, zh-HK, iw-IL, en-AU, en-GB, en-CA, en-IN, en-SG,
en-ZA, es-US, es-419, es-ES, sv-SE, it-IT, is-IS
```

---

## ⚙️ 5. Çevirileri Yeniden Derleme (Tek Komut)

Herhangi bir metin değişikliği yapıldığında veya yeni bir dil eklendiğinde:

```bash
# Proje kök dizininde çalıştırın:
node scripts/generate-play-store-translations.mjs
```

Bu komut:
1. `assets/translations/google_play_exact_match_all.csv` dosyasını saf UTF-8 (No BOM) olarak üretir.
2. `assets/translations/google_play_exact_match_all.zip` dosyasını klasörlü yapıda (her dil için `title.txt`, `short-description.txt`, `full-description.txt`) oluşturur.
3. Otomatik olarak 30 / 80 / 4000 karakter sınırlarını denetler ve uygular.

---

## 🚀 6. Google Play Console'a Yükleme Rehberi

1. **Google Play Console**'a giriş yapın.
2. **Büyüme (Grow) > Mağaza varlığı (Store presence) > Ana mağaza girişi (Main store listing)** sayfasına gidin.
3. Sağ üstteki **Çevirileri Yönet (Manage translations) > Çevirileri İçe Aktar (Import translations)** butonuna tıklayın.
4. `assets/translations/google_play_exact_match_all.csv` dosyasını seçip yükleyin.
5. 87 dilin tamamının yeşil onay aldığını kontrol edin.
6. **Değişiklikleri Kaydet** butonuna tıklayın.
