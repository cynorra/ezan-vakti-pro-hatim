# Google Play Store Çok Dilli ASO & Çeviri Sistemi Rehberi

Bu doküman, **Ezan Vakti Pro + Hatim** (`com.cynnora.ezanvakti`) uygulamasının Google Play Console üzerindeki 86+ dildeki mağaza listelemesi (Title, Short Description, Full Description) yönetimini ve otomatik üretimini kayıt altında tutan proje hafızasıdır.

---

## 🎯 Temel Kurallar ve Sınırlar

Google Play Console mağaza girişinde uygulanan kesin karakter sınırları:
- **Başlık (Title):** En fazla **30 karakter**
- **Kısa Açıklama (Short Description):** En fazla **80 karakter**
- **Tam Açıklama (Full Description):** En fazla **4000 karakter**

---

## 🌍 Bölgesel & Kültürel Yerelleştirme (ASO Terminolojisi)

Düz çeviri yerine ülkelerin yerel arama hacmi en yüksek İslami terimleri kullanılmıştır:
- **Endonezya / Malay (`id`, `ms`, `ms-MY`):** `Jadwal Sholat`, `Waktu Solat`, `Khatam Quran Bersama`, `Kiblat`
- **Farsça / Afganistan / BAE (`fa`, `fa-IR`, `fa-AF`, `fa-AE`):** `اوقات شرعی` (Owqat-e Shar'i), `ختم قرآن گروهی`, `قبله نما`, `صلوات شمار`
- **Urduca / Hintçe (`ur`, `hi`, `mr-IN`, `te-IN`):** `نماز کے اوقات` (Namaz ke Auqat), `اذان کا وقت`, `30 سپارے` (30 Sipara), `قبلہ نما`
- **Arapça (`ar`):** `مواقيت الصلاة`, `أذان دقيق`, `ختمة القرآن الجماعية`, `اتجاه القبلة`, `مسبحة إلكترونية`
- **Rusça / Orta Asya (`ru`, `kk`, `ky-KG`, `uz`):** `Время намаза`, `Азан`, `Коран Хатым`, `Кибла компас`, `Тасбих`
- **Türkçe (`tr-TR`):** `Ezan Vakti Pro: Hatim & Kıble`, `Namaz vakitleri, ezan alarmı, hatim cüz paylaşımı, kıble pusulası ve zikirmatik.`

---

## 📁 Google Play Dil Kodları & Eşleşmeler

Google Play Console'un CSV içe aktarımında kabul ettiği özel bileşik dil etiketleri:

| Dil / Bölge | Google Play Dil Kodu |
|---|---|
| Kırgızca (Kırgızistan) | `ky-KG` |
| Marathi (Hindistan) | `mr-IN` |
| Telugu (Hindistan) | `te-IN` |
| Farsça (İran / Afganistan / BAE) | `fa-IR`, `fa-AF`, `fa-AE` |
| İngilizce Bölgesel Varyantlar | `en-AU`, `en-CA`, `en-GB`, `en-IN`, `en-SG`, `en-ZA` |
| Fransızca (Kanada / Fransa) | `fr-CA`, `fr-FR` |
| İspanyolca (Latin Amerika / ABD / İspanya) | `es-419`, `es-US`, `es-ES` |
| Portekizce (Brezilya / Portekiz) | `pt-BR`, `pt-PT` |
| Çince (Basitleştirilmiş / Geleneksel Tayvan / HK) | `zh-CN`, `zh-TW`, `zh-HK` |
| Zuluca (Güney Afrika) | `zu` |
| vb. (Toplam 86 Dil) | |

---

## ⚙️ Çevirileri Yeniden Üretme (Tek Komut)

Tüm CSV ve ZIP paketlerini yeniden derlemek veya yeni diller eklemek için:

```bash
# Proje kök dizininde çalıştırın:
node scripts/generate-play-store-translations.mjs
```

Bu komut:
1. `assets/translations/google_play_exact_match_all.csv` dosyasını üretir.
2. `assets/translations/google_play_exact_match_all.zip` arşivini oluşturur (her dil için `title.txt`, `short-description.txt`, `full-description.txt` klasörlü yapıda).

---

## 🚀 Google Play Console'a Yükleme Adımları

1. **Google Play Console** paneline giriş yapın.
2. Sol menüden **Büyüme > Mağaza varlığı > Ana mağaza girişi** sayfasına gidin.
3. Sağ üstteki **Çevirileri Yönet (Manage translations) > Çevirileri İçe Aktar (Import translations)** butonuna tıklayın.
4. `assets/translations/google_play_exact_match_all.csv` dosyasını seçip yükleyin.
5. Değişiklikleri kaydedin ve incelemeye gönderin.
