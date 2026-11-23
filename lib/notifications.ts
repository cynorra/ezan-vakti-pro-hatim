import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDailyDua, localizeDua } from './data/duas';
import { getDailyHealingVerse, localizeVerse } from './data/quran-verses';
import { getCurrentStreak } from './streak';
import i18n from './i18n';
import type { PrayerTimes } from './prayer-times';
import { localDateKey, localWeekStartKey } from './date-keys';

// SettingsModal, her namaz için ayrı aç/kapa tercihini bu anahtar altında saklıyor
// (fajr/sunrise/dhuhr/asr/maghrib/isha). Türkçe vakit adları burada dahili anahtar
// olarak kullanılıyor (kimlik/identifier üretimi ve ayar eşlemesi için) — bunlar
// görüntülenen metin DEĞİL, sadece kod içi sabitler; kullanıcıya gösterilen isim
// PRAYER_NAME_TO_I18N_KEY üzerinden ayrıca çevriliyor.
const PRAYER_SETTINGS_KEY = 'prayer_notifications';
const PRAYER_NAME_TO_SETTINGS_KEY: Record<string, string> = {
  'İmsak': 'fajr',
  'Güneş': 'sunrise',
  'Öğle': 'dhuhr',
  'İkindi': 'asr',
  'Akşam': 'maghrib',
  'Yatsı': 'isha',
};
const PRAYER_NAME_TO_I18N_KEY: Record<string, string> = {
  'İmsak': 'imsak',
  'Güneş': 'gunes',
  'Öğle': 'ogle',
  'İkindi': 'ikindi',
  'Akşam': 'aksam',
  'Yatsı': 'yatsi',
};

async function getEnabledPrayerNames(): Promise<Record<string, boolean> | null> {
  try {
    const raw = await AsyncStorage.getItem(PRAYER_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Ezan ses dosyaları assets/sounds/ ve android/app/src/main/res/raw/ içerisine eklenmiştir.
export const SOUND_FILES_READY = true;
export const EZAN_SOUND_KEY = 'ezan_sound';
export const DEFAULT_EZAN_SOUND = 'İstanbul Ezanı';

export interface EzanChannelConfig {
  id: string;
  name: string;
  sound: string;
}

export const EZAN_CHANNELS: Record<string, EzanChannelConfig> = {
  'İstanbul Ezanı': { id: 'ezan-istanbul', name: 'İstanbul Ezanı', sound: 'ezan_istanbul.mp3' },
  'Mekke Ezanı': { id: 'ezan-mekke', name: 'Mekke Ezanı', sound: 'ezan_mekke.mp3' },
  'Medine Ezanı': { id: 'ezan-medine', name: 'Medine Ezanı', sound: 'ezan_medine.mp3' },
  'Mısır Ezanı': { id: 'ezan-misir', name: 'Mısır Ezanı', sound: 'ezan_misir.mp3' },
};

export async function getSelectedEzanSound(): Promise<string> {
  try {
    const selected = await AsyncStorage.getItem(EZAN_SOUND_KEY);
    return (selected && EZAN_CHANNELS[selected]) ? selected : DEFAULT_EZAN_SOUND;
  } catch {
    return DEFAULT_EZAN_SOUND;
  }
}

export async function getPrayerNotificationSound(): Promise<string | true> {
  try {
    const selected = await getSelectedEzanSound();
    return EZAN_CHANNELS[selected]?.sound || true;
  } catch {
    return true;
  }
}

const PRAYER_PREFIX = 'prayer-';
const DAILY_DUA_PREFIX = 'daily-dua-';
const ENGAGEMENT_ID = 'engagement-evening';
const DAILY_DUA_WINDOW_DAYS = 7;
const DAILY_DUA_HOUR = 9;
const DAILY_DUA_MINUTE = 0;

const EVENING_MESSAGE_KEYS = [
  'notifications.eveningMsg1',
  'notifications.eveningMsg2',
  'notifications.eveningMsg3',
  'notifications.eveningMsg4',
];

// Uygulama önplandayken de bildirim banner'ı ve sesi gösterilsin (varsayılan davranış sessizdir)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configureNotificationChannel() {
  if (Platform.OS !== 'android') return;

  // Standart bildirim kanalı (hatırlatıcılar, dualar, ayetler için)
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Ezan Vakti + Hatim (Genel)',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 200, 100, 200],
    lightColor: '#D4AF37',
    sound: 'default',
  });

  // Ezan seslerine özel yüksek öncelikli bildirim kanalları
  for (const config of Object.values(EZAN_CHANNELS)) {
    try {
      await Notifications.setNotificationChannelAsync(config.id, {
        name: `Ezan Vakti (${config.name})`,
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#0d7a3e',
        sound: config.sound,
        bypassDnd: false,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    } catch (err) {
      console.warn(`[notifications] failed to create channel ${config.id}:`, err);
    }
  }
}

/** Kullanıcının Ayarlar modalından ezan sesini anında test etmesi için bildirim çalar */
export async function playTestEzanSound(soundName?: string) {
  if (Platform.OS === 'web') return;
  const soundKey = soundName || (await getSelectedEzanSound());
  const channelConfig = EZAN_CHANNELS[soundKey] || EZAN_CHANNELS[DEFAULT_EZAN_SOUND];

  await safeSchedule({
    identifier: `test-ezan-${Date.now()}`,
    content: {
      title: `🕌 ${channelConfig.name} Test Ediliyor`,
      body: 'Ezan vakti geldiğinde ezan bu sesle okunacaktır.',
      channelId: channelConfig.id,
      sound: channelConfig.sound,
      data: { screen: 'home' },
    } as any,
    trigger: null,
  });
}

export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

// İzin istemeden sadece mevcut durumu okur; uygulama açılışında anahtarın
// gerçek durumu yansıtması için kullanılır (daha önce reset oluyordu).
export async function hasNotificationPermission() {
  if (Platform.OS === 'web') return false;
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

// Settings stores labels like "Kapalı", "5 dk önce", "10 dk önce", "15 dk önce", "30 dk önce".
async function getReminderMinutes(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem('reminder_time');
    if (!raw) return 15;
    const minutes = parseInt(raw.match(/\d+/)?.[0] ?? '', 10);
    return Number.isFinite(minutes) ? minutes : 0; // "Kapalı" (off) has no number
  } catch {
    return 15;
  }
}

/** Sanitizes notification content so Android's native bundle serializer won't throw NotSerializableException */
function buildNotificationInput(request: Notifications.NotificationRequestInput): Notifications.NotificationRequestInput {
  const content = { ...request.content };

  if (Platform.OS === 'android') {
    // Android controls sound via Notification Channels; boolean `sound: true` or custom sounds inside content
    // crash with NotSerializableException: org.json.JSONObject on various Android versions.
    delete (content as any).sound;
    if (!(content as any).channelId) {
      (content as any).channelId = 'default';
    }
  }

  // Ensure data payload is purely flat string key-values to prevent JSON serialization crash
  if (content.data && typeof content.data === 'object') {
    const safeData: Record<string, string> = {};
    for (const [k, v] of Object.entries(content.data)) {
      if (v != null) {
        safeData[k] = typeof v === 'string' ? v : String(v);
      }
    }
    content.data = safeData;
  }

  return {
    ...request,
    content,
  };
}

/** Schedules one notification; a failure is logged instead of aborting the others. */
async function safeSchedule(request: Notifications.NotificationRequestInput) {
  try {
    await Notifications.scheduleNotificationAsync(buildNotificationInput(request));
  } catch (error) {
    console.warn(`[notifications] could not schedule ${request.identifier}:`, error);
  }
}

/**
 * "HH:MM" on `day` at the prayer location, as an absolute Date. `timezone` is the
 * location's UTC offset in hours (Turkish cities are fixed at +3); undefined means
 * the device timezone.
 */
function prayerDate(day: Date, time: string, timezone?: number): Date | null {
  if (!/^\d{2}:\d{2}$/.test(time)) return null; // "--:--" at extreme latitudes
  const [hours, minutes] = time.split(':').map(Number);
  if (timezone === undefined) {
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes, 0, 0);
  }
  return new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes) - timezone * 3600_000);
}

async function schedulePrayerNotification(
  prayerName: string,
  at: Date,
  city: string,
  reminderMins: number,
  sound: string | true,
  selectedEzanName?: string
) {
  const i18nKey = PRAYER_NAME_TO_I18N_KEY[prayerName];
  const displayName = i18nKey ? i18n.t(`prayerTimes.${i18nKey}`) : prayerName;
  const dayKey = `${at.getFullYear()}-${at.getMonth() + 1}-${at.getDate()}`;
  const now = Date.now();

  const isEzanPrayer = ['İmsak', 'Öğle', 'İkindi', 'Akşam', 'Yatsı'].includes(prayerName);
  const activeEzan = selectedEzanName || (await getSelectedEzanSound());
  const ezanConfig = isEzanPrayer ? EZAN_CHANNELS[activeEzan] : null;

  if (at.getTime() > now) {
    await safeSchedule({
      identifier: `${PRAYER_PREFIX}${dayKey}-${prayerName}`,
      content: {
        title: i18n.t('notifications.prayerTitle', { prayer: displayName }),
        body: i18n.t('notifications.prayerBody', { prayer: displayName, city }),
        sound: ezanConfig ? ezanConfig.sound : sound,
        channelId: ezanConfig ? ezanConfig.id : 'default',
        data: { screen: 'home', prayerName, city },
      } as any,
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at },
    });
  }

  const reminderAt = new Date(at.getTime() - reminderMins * 60_000);
  if (reminderMins > 0 && reminderAt.getTime() > now) {
    await safeSchedule({
      identifier: `${PRAYER_PREFIX}pre-${dayKey}-${prayerName}`,
      content: {
        title: i18n.t('notifications.prayerPreReminderTitle', { prayer: displayName, minutes: reminderMins }),
        body: i18n.t('notifications.prayerPreReminderBody', { prayer: displayName, city, minutes: reminderMins }),
        sound: 'default',
        channelId: 'default',
        data: { screen: 'home', prayerName, city },
      } as any,
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminderAt },
    });
  }
}

export async function cancelAllNotifications() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

async function cancelPrayerNotifications() {
  if (Platform.OS === 'web') return;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(PRAYER_PREFIX))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}

// Günün duasını her gün önceden hesaplanabildiğinden (getDailyDua tarihe göre
// deterministik döner), ileriye dönük N günü ayrı ayrı zamanlıyoruz; bu sayede
// bildirim içeriği "Namaz Vakti" gibi statik kalmayıp her gün gerçekten değişiyor.
export async function scheduleDailyDuaReminders() {
  if (Platform.OS === 'web') return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(DAILY_DUA_PREFIX))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );

  const now = new Date();
  for (let i = 0; i < DAILY_DUA_WINDOW_DAYS; i++) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + i);
    targetDate.setHours(DAILY_DUA_HOUR, DAILY_DUA_MINUTE, 0, 0);
    if (targetDate.getTime() <= now.getTime()) continue;

    const dua = localizeDua(getDailyDua(targetDate), i18n.language);
    await safeSchedule({
      identifier: `${DAILY_DUA_PREFIX}${localDateKey(targetDate)}`,
      content: {
        title: i18n.t('notifications.dailyDuaTitle'),
        body: i18n.t('notifications.dailyDuaBody', { title: dua.title }),
        sound: true,
        data: { screen: 'dua', duaId: dua.id },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: targetDate } as any,
    });
  }
}

const DAILY_VERSE_PREFIX = 'daily-verse-';
const DAILY_VERSE_HOUR = 16;
const DAILY_VERSE_MINUTE = 30;

export async function scheduleDailyVerseReminders() {
  if (Platform.OS === 'web') return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(DAILY_VERSE_PREFIX))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );

  const now = new Date();
  for (let i = 0; i < DAILY_DUA_WINDOW_DAYS; i++) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + i);
    targetDate.setHours(DAILY_VERSE_HOUR, DAILY_VERSE_MINUTE, 0, 0);
    if (targetDate.getTime() <= now.getTime()) continue;

    const verse = getDailyHealingVerse(targetDate);
    await safeSchedule({
      identifier: `${DAILY_VERSE_PREFIX}${localDateKey(targetDate)}`,
      content: {
        title: i18n.t('notifications.verseTitle') || '📖 Şifa & Huzur Ayeti',
        body: (({ text, surah }) => `"${text}" — ${surah}, ${verse.verseNumber} ✨`)(localizeVerse(verse, i18n.language)),
        sound: true,
        data: { screen: 'home', verseId: verse.id },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: targetDate } as any,
    });
  }
}

function getWeekStartISO(date = new Date()) {
  return localWeekStartKey(date);
}

// Sabit dönen mesajlar yerine gerçek ilerlemeye bakar: bu hafta hiç cüz işlenmemişse,
// kaza borç varsa ya da seri devam ediyorsa buna uygun, daha etkili bir metin üretir.
// Not: yerel bildirimler zamanlamada sabitlendiği için bu, uygulama her açıldığında
// (scheduleAllPrayers her prayerTimes değişiminde tekrar çağrılıyor) yeniden hesaplanır.
async function getPersonalizedEveningMessage(): Promise<string> {
  try {
    const weekStart = getWeekStartISO();
    const hatimRaw = await AsyncStorage.getItem(`hatim_progress_${weekStart}`);
    const hatimProgress = hatimRaw ? JSON.parse(hatimRaw) : {};
    const hatimCount = Object.values(hatimProgress).filter(Boolean).length;

    const kazaRaw = await AsyncStorage.getItem('kaza_data');
    const kazaData = kazaRaw ? JSON.parse(kazaRaw) : null;
    const kazaTotal: number = kazaData
      ? Object.values(kazaData).reduce((sum: number, v) => sum + (Number(v) || 0), 0)
      : 0;

    const streak = await getCurrentStreak();

    if (hatimCount === 0) {
      return i18n.t('notifications.noJuzThisWeek');
    }
    if (kazaTotal > 0) {
      return i18n.t('notifications.kazaDebtReminder', { count: kazaTotal });
    }
    if (streak >= 3) {
      return i18n.t('notifications.streakReminder', { streak });
    }
  } catch (error) {
    console.log('Personalized reminder error:', error);
  }

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return i18n.t(EVENING_MESSAGE_KEYS[dayOfYear % EVENING_MESSAGE_KEYS.length]);
}

export async function scheduleEveningEngagementReminder() {
  if (Platform.OS === 'web') return;

  await Notifications.cancelScheduledNotificationAsync(ENGAGEMENT_ID).catch(() => {});

  const message = await getPersonalizedEveningMessage();

  await safeSchedule({
    identifier: ENGAGEMENT_ID,
    content: {
      title: i18n.t('notifications.eveningTitle'),
      body: message,
      sound: true,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 20, minute: 30 },
  });
}

const FRIDAY_REMINDER_ID = 'friday-morning-reminder';

export async function scheduleFridayReminder() {
  if (Platform.OS === 'web') return;

  await Notifications.cancelScheduledNotificationAsync(FRIDAY_REMINDER_ID).catch(() => {});

  await safeSchedule({
    identifier: FRIDAY_REMINDER_ID,
    content: {
      title: i18n.t('notifications.fridayTitle'),
      body: i18n.t('notifications.fridayBody'),
      sound: true,
      data: { screen: 'dua' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 6, // Cuma (1 = Pazar, 6 = Cuma)
      hour: 10,
      minute: 0,
    },
  });
}

const MIDDAY_REMINDER_ID = 'midday-inspiration-reminder';

export async function scheduleMiddayInspirationReminder() {
  if (Platform.OS === 'web') return;

  await Notifications.cancelScheduledNotificationAsync(MIDDAY_REMINDER_ID).catch(() => {});

  await safeSchedule({
    identifier: MIDDAY_REMINDER_ID,
    content: {
      title: i18n.t('notifications.middayTitle'),
      body: i18n.t('notifications.middayBody'),
      sound: true,
      data: { screen: 'tesbih' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 14,
      minute: 15,
    },
  });
}

// Prayer times shift every day, so one repeating "daily at HH:MM" notification drifts
// (by ~30 min over a month). Each of the next days gets its own dated notification;
// opening the app reschedules the window. iOS allows only 64 pending notifications.
// Android keeps up to ~500 alarms per app: 21 days x 6 prayers x (alert + pre-reminder) = 252.
const PRAYER_DAYS_AHEAD = Platform.OS === 'ios' ? 3 : 21;

export async function scheduleAllPrayers(
  getTimes: (date: Date) => PrayerTimes,
  city: string,
  timezone?: number
) {
  if (Platform.OS === 'web') return;

  await cancelPrayerNotifications();

  const enabledPrayers = await getEnabledPrayerNames();
  const reminderMins = await getReminderMinutes();
  const selectedEzan = await getSelectedEzanSound();
  const sound = await getPrayerNotificationSound();
  const today = new Date();

  for (let offset = 0; offset < PRAYER_DAYS_AHEAD; offset++) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    const times = getTimes(day);
    const prayers = [
      { name: 'İmsak', time: times.fajr },
      { name: 'Güneş', time: times.sunrise },
      { name: 'Öğle', time: times.dhuhr },
      { name: 'İkindi', time: times.asr },
      { name: 'Akşam', time: times.maghrib },
      { name: 'Yatsı', time: times.isha },
    ];
    for (const prayer of prayers) {
      const settingsKey = PRAYER_NAME_TO_SETTINGS_KEY[prayer.name];
      const isEnabled = !enabledPrayers || enabledPrayers[settingsKey] !== false;
      const at = prayerDate(day, prayer.time, timezone);
      if (isEnabled && at) await schedulePrayerNotification(prayer.name, at, city, reminderMins, sound, selectedEzan);
    }
  }

  for (const schedule of [
    scheduleDailyDuaReminders,
    scheduleDailyVerseReminders,
    scheduleMiddayInspirationReminder,
    scheduleEveningEngagementReminder,
    scheduleFridayReminder,
  ]) {
    try {
      await schedule();
    } catch (error) {
      console.warn('[notifications] reminder scheduling failed:', error);
    }
  }
}

