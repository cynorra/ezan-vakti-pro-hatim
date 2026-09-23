// Adds location-permission strings to every locale.
// Order: location.permissionTitle, location.permissionBody, location.openSettings, settings.locationPermission, settings.permissionOn, settings.permissionOff
import fs from 'node:fs';
import path from 'node:path';

const T = {
  tr: ['Konum izni kapalı', 'Bulunduğun yere göre doğru vakitleri gösterebilmek için telefon ayarlarından konum iznini açman gerekiyor.', 'Ayarları aç', 'Konum izni', 'Açık', 'Kapalı'],
  en: ['Location access is off', 'To show accurate times for where you are, turn on location access in your phone settings.', 'Open settings', 'Location access', 'On', 'Off'],
  ar: ['إذن الموقع متوقف', 'لعرض أوقات دقيقة حسب مكانك، فعّل إذن الموقع من إعدادات الهاتف.', 'فتح الإعدادات', 'إذن الموقع', 'مفعّل', 'متوقف'],
  fa: ['دسترسی به موقعیت خاموش است', 'برای نمایش اوقات دقیق بر اساس محل شما، دسترسی به موقعیت را در تنظیمات گوشی روشن کنید.', 'باز کردن تنظیمات', 'دسترسی به موقعیت', 'روشن', 'خاموش'],
  ur: ['مقام کی اجازت بند ہے', 'آپ کے مقام کے مطابق درست اوقات دکھانے کے لیے فون کی ترتیبات میں مقام کی اجازت آن کریں۔', 'ترتیبات کھولیں', 'مقام کی اجازت', 'آن', 'بند'],
  de: ['Standortzugriff ist aus', 'Um genaue Zeiten für deinen Standort anzuzeigen, aktiviere den Standortzugriff in den Telefoneinstellungen.', 'Einstellungen öffnen', 'Standortzugriff', 'An', 'Aus'],
  fr: ['Accès à la position désactivé', "Pour afficher des horaires précis selon votre position, activez l'accès à la position dans les réglages du téléphone.", 'Ouvrir les réglages', 'Accès à la position', 'Activé', 'Désactivé'],
  es: ['Acceso a la ubicación desactivado', 'Para mostrar horarios precisos según tu ubicación, activa el acceso a la ubicación en los ajustes del teléfono.', 'Abrir ajustes', 'Acceso a la ubicación', 'Activado', 'Desactivado'],
  it: ['Accesso alla posizione disattivato', "Per mostrare orari precisi in base alla tua posizione, attiva l'accesso alla posizione nelle impostazioni del telefono.", 'Apri impostazioni', 'Accesso alla posizione', 'Attivo', 'Disattivo'],
  ru: ['Доступ к местоположению выключен', 'Чтобы показывать точное время для вашего места, включите доступ к местоположению в настройках телефона.', 'Открыть настройки', 'Доступ к местоположению', 'Вкл.', 'Выкл.'],
  uk: ['Доступ до місцезнаходження вимкнено', 'Щоб показувати точний час для вашого місця, увімкніть доступ до місцезнаходження в налаштуваннях телефону.', 'Відкрити налаштування', 'Доступ до місцезнаходження', 'Увімк.', 'Вимк.'],
  pl: ['Dostęp do lokalizacji wyłączony', 'Aby pokazywać dokładne godziny dla Twojego miejsca, włącz dostęp do lokalizacji w ustawieniach telefonu.', 'Otwórz ustawienia', 'Dostęp do lokalizacji', 'Wł.', 'Wył.'],
  nl: ['Locatietoegang staat uit', 'Zet locatietoegang aan in de telefooninstellingen om nauwkeurige tijden voor jouw plek te tonen.', 'Instellingen openen', 'Locatietoegang', 'Aan', 'Uit'],
  pt: ['Acesso à localização desativado', 'Para mostrar horários precisos para onde você está, ative o acesso à localização nas configurações do telefone.', 'Abrir configurações', 'Acesso à localização', 'Ativado', 'Desativado'],
  sv: ['Platsåtkomst är av', 'Aktivera platsåtkomst i telefonens inställningar för att visa exakta tider där du är.', 'Öppna inställningar', 'Platsåtkomst', 'På', 'Av'],
  el: ['Η πρόσβαση στην τοποθεσία είναι απενεργοποιημένη', 'Για να εμφανίζονται ακριβείς ώρες για την τοποθεσία σας, ενεργοποιήστε την πρόσβαση στην τοποθεσία από τις ρυθμίσεις του τηλεφώνου.', 'Άνοιγμα ρυθμίσεων', 'Πρόσβαση στην τοποθεσία', 'Ενεργή', 'Ανενεργή'],
  hu: ['A helymeghatározás ki van kapcsolva', 'A tartózkodási helyednek megfelelő pontos időkhöz kapcsold be a helyhozzáférést a telefon beállításaiban.', 'Beállítások megnyitása', 'Helyhozzáférés', 'Be', 'Ki'],
  bg: ['Достъпът до местоположението е изключен', 'За да показваме точни времена за мястото ви, включете достъпа до местоположението в настройките на телефона.', 'Отвори настройките', 'Достъп до местоположението', 'Вкл.', 'Изкл.'],
  ro: ['Accesul la locație este dezactivat', 'Pentru a afișa ore exacte pentru locul în care te afli, activează accesul la locație din setările telefonului.', 'Deschide setările', 'Acces la locație', 'Activat', 'Dezactivat'],
  bs: ['Pristup lokaciji je isključen', 'Da bi se prikazala tačna vremena za vaše mjesto, uključite pristup lokaciji u postavkama telefona.', 'Otvori postavke', 'Pristup lokaciji', 'Uključeno', 'Isključeno'],
  az: ['Məkan icazəsi bağlıdır', 'Olduğun yerə görə dəqiq vaxtları göstərmək üçün telefon ayarlarında məkan icazəsini aç.', 'Ayarları aç', 'Məkan icazəsi', 'Açıq', 'Bağlı'],
  uz: ["Joylashuvga ruxsat o'chirilgan", "Joylashuvingiz bo'yicha aniq vaqtlarni ko'rsatish uchun telefon sozlamalarida joylashuvga ruxsatni yoqing.", 'Sozlamalarni ochish', 'Joylashuvga ruxsat', 'Yoqilgan', "O'chirilgan"],
  kk: ['Орналасқан жерге рұқсат өшірулі', 'Тұрған жеріңізге сай дәл уақытты көрсету үшін телефон баптауларында орналасқан жерге рұқсатты қосыңыз.', 'Баптауларды ашу', 'Орналасқан жерге рұқсат', 'Қосулы', 'Өшірулі'],
  id: ['Akses lokasi nonaktif', 'Untuk menampilkan waktu salat yang akurat sesuai lokasi Anda, aktifkan akses lokasi di pengaturan ponsel.', 'Buka pengaturan', 'Akses lokasi', 'Aktif', 'Nonaktif'],
  ms: ['Akses lokasi dimatikan', 'Untuk memaparkan waktu solat yang tepat mengikut lokasi anda, hidupkan akses lokasi dalam tetapan telefon.', 'Buka tetapan', 'Akses lokasi', 'Hidup', 'Mati'],
  bn: ['অবস্থানের অনুমতি বন্ধ', 'আপনার অবস্থান অনুযায়ী সঠিক সময় দেখাতে ফোনের সেটিংসে অবস্থানের অনুমতি চালু করুন।', 'সেটিংস খুলুন', 'অবস্থানের অনুমতি', 'চালু', 'বন্ধ'],
  hi: ['स्थान अनुमति बंद है', 'आपके स्थान के अनुसार सटीक समय दिखाने के लिए फ़ोन की सेटिंग में स्थान अनुमति चालू करें।', 'सेटिंग खोलें', 'स्थान अनुमति', 'चालू', 'बंद'],
  zh: ['位置权限已关闭', '要根据您所在的位置显示准确时间，请在手机设置中开启位置权限。', '打开设置', '位置权限', '已开启', '已关闭'],
  ja: ['位置情報へのアクセスがオフです', '現在地に合わせた正確な時刻を表示するには、端末の設定で位置情報へのアクセスをオンにしてください。', '設定を開く', '位置情報へのアクセス', 'オン', 'オフ'],
  ko: ['위치 권한이 꺼져 있습니다', '현재 위치에 맞는 정확한 시간을 표시하려면 휴대폰 설정에서 위치 권한을 켜 주세요.', '설정 열기', '위치 권한', '켜짐', '꺼짐'],
};

const dir = path.resolve('lib/i18n/locales');
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const lang = file.replace('.json', '');
  const v = T[lang];
  if (!v) throw new Error(`No translation for ${lang}`);
  const full = path.join(dir, file);
  const json = JSON.parse(fs.readFileSync(full, 'utf8'));
  json.location = { ...(json.location ?? {}), permissionTitle: v[0], permissionBody: v[1], openSettings: v[2] };
  json.settings = { ...(json.settings ?? {}), locationPermission: v[3], permissionOn: v[4], permissionOff: v[5] };
  fs.writeFileSync(full, JSON.stringify(json, null, 2) + '\n');
}
console.log('updated', Object.keys(T).length, 'locales');
