# Ezan Sesi Dosyaları — Kurulum Gerekiyor

Ayarlar ekranında zaten bir "Ezan Sesi" seçici var (`İstanbul Ezanı`, `Mekke Ezanı`,
`Medine Ezanı`, `Mısır Ezanı`), ve `lib/notifications.ts` artık seçilen sese göre doğru
dosya adını bildirime veriyor — **ama gerçek ses dosyaları eksik**. Telif/lisans
belirsizliği nedeniyle bunları ben eklemedim; senin (lisanslı/izinli bir kaynaktan)
temin edip buraya koyman gerekiyor.

## Yapman gerekenler

1. Aşağıdaki 4 dosyayı bu klasöre (`assets/sounds/`) koy, isimler tam olarak şöyle olmalı:
   - `ezan_istanbul.mp3`
   - `ezan_mekke.mp3`
   - `ezan_medine.mp3`
   - `ezan_misir.mp3`
   (Android bildirim sesleri için ideal format: mp3 veya ogg, birkaç MB'ı geçmeyen, ~3-4 dakikalık tam ezan yerine kısa bir "bildirim sesi" versiyonu tercih edilebilir — bazı uygulamalar sadece ilk birkaç saniyeyi kullanır.)

2. `app.json` içindeki `expo-notifications` plugin ayarına `sounds` dizisini ekle:

```json
[
  "expo-notifications",
  {
    "icon": "./assets/notification-icon.png",
    "color": "#0d7a3e",
    "sounds": [
      "./assets/sounds/ezan_istanbul.mp3",
      "./assets/sounds/ezan_mekke.mp3",
      "./assets/sounds/ezan_medine.mp3",
      "./assets/sounds/ezan_misir.mp3"
    ]
  }
]
```

3. `npx expo prebuild --clean` çalıştır (native `android/` klasörünü bu yeni sesleri
   içerecek şekilde yeniden üretir), sonra normal build.

Bu adımlar tamamlanmadan önce uygulama sessizce varsayılan bildirim sesine düşer
(hata vermez, çökmez) — `lib/notifications.ts` bunu zaten güvenli şekilde ele alıyor.
