import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { safeHaptics } from '@/lib/haptics';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, Gradients } from '@/constants/theme';
import { calculatePrayerTimes, PrayerTimes } from '@/lib/prayer-times';
import { logEvent } from '@/lib/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  formatPrayerTimesShareMessage,
  formatWisdomShareMessage,
  formatEsmaShareMessage,
  formatAppInviteMessage,
  formatDailyDuaShareMessage,
  formatEidShareMessage,
  formatKandilShareMessage,
} from '@/lib/share';
import {
  DEFAULT_LOCATION,
  SavedLocation,
  MethodSetting,
  loadMethodSetting,
  loadSavedLocation,
  locateWithGps,
  getLocationPermissionState,
  openAppSettings,
  resolveMethod,
  saveLocation,
  saveMethodSetting,
  turkishCityLocation,
} from '@/lib/location-settings';
import { getDailyWisdom, localizeWisdom } from '@/lib/data/daily-content';
import { getDailyDua, localizeDua } from '@/lib/data/duas';
import { recordAppOpenAndGetStreak } from '@/lib/streak';
import {
  requestNotificationPermissions,
  scheduleAllPrayers,
  hasNotificationPermission,
  configureNotificationChannel,
  cancelAllNotifications,
} from '@/lib/notifications';
import { promptPrayerAlertReliability } from '@/lib/reliability';
import { getHijriDate } from '@/lib/hijri';
import { SettingsModal } from '@/components/SettingsModal';
import { DailyChecklist } from '@/components/DailyChecklist';
import { CitySelector } from '@/components/CitySelector';
import { NextPrayerCountdown } from '@/components/NextPrayerCountdown';
import { RamadanCountdown } from '@/components/RamadanCountdown';
import { PrayerTimesCard } from '@/components/PrayerTimesCard';
import { ReligiousDaysCard } from '@/components/ReligiousDaysCard';
import { getTodayReligiousDay } from '@/lib/data/religious-days';
import { SEOHead } from '@/components/SEOHead';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRandomEsma, localizeEsma, Esma } from '@/lib/data/esma';
import {
  syncRemoteContent,
  getDailyFeed,
  localizeVerifiedVerse,
  localizeVerifiedHadith,
  localizeDailyMessage,
  RemoteContentFeed,
} from '@/lib/services/content-sync';

const NOTIFICATION_PROMPTED_KEY = 'notification_permission_prompted';
// '0' when the user switched prayer notifications off in Settings.
const NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const staticWisdom = localizeWisdom(getDailyWisdom(), i18n.language);
  const staticDua = localizeDua(getDailyDua(), i18n.language);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [location, setLocation] = useState<SavedLocation>(DEFAULT_LOCATION);
  const [methodSetting, setMethodSetting] = useState<MethodSetting>('auto');
  const selectedCity = location.city;
  const selectedDistrict = location.district;
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [dailyEsma, setDailyEsma] = useState<Esma | null>(null);
  const [feed, setFeed] = useState<RemoteContentFeed | null>(null);
  // Prefer today's verified content from the daily feed; otherwise the bundled rotation.
  const feedVerse = feed?.verifiedVerse ? localizeVerifiedVerse(feed.verifiedVerse, i18n.language) : null;
  const dailyWisdom = feed?.verifiedVerse && feedVerse
    ? { id: 'feed', type: 'verse' as const, arabic: feed.verifiedVerse.arabic, content: feedVerse.text, source: feedVerse.source }
    : staticWisdom;
  const feedDua = feed?.verifiedDua ? localizeVerifiedVerse(feed.verifiedDua, i18n.language) : null;
  const lang = i18n.language.split('-')[0];
  const dailyDua = feed?.verifiedDua && feedDua
    ? {
        ...staticDua,
        arabic: feed.verifiedDua.arabic,
        // For Arabic the verse itself is the text; don't repeat it.
        turkish: lang === 'ar' ? '' : feedDua.text,
        source: feedDua.source,
      }
    : staticDua;
  const dailyHadith = feed?.verifiedHadith ? localizeVerifiedHadith(feed.verifiedHadith, i18n.language) : null;
  const dailyMessage = localizeDailyMessage(feed?.dailyMessage, i18n.language);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    syncRemoteContent()
      .catch(() => null)
      .then(() => getDailyFeed())
      .then(setFeed);
    setDailyEsma(getRandomEsma());
    recordAppOpenAndGetStreak().then(setStreak);
  }, []);

  useEffect(() => {
    configureNotificationChannel();
    Promise.all([hasNotificationPermission(), AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY)])
      .then(([granted, stored]) => setNotificationsEnabled(granted && stored !== '0'))
      .catch(() => {});
  }, []);

  const applyLocation = useCallback((next: SavedLocation) => {
    setLocation(next);
    saveLocation(next);
  }, []);

  const handleLocationPress = useCallback(
    async (prompt = true, userInitiated = true) => {
      try {
        const located = await locateWithGps({ prompt });
        if (located) {
          applyLocation(located);
          // Silent launch refreshes are not a user action; don't count them.
          if (prompt) logEvent('location_set', { source: 'gps', country: located.countryCode });
          return;
        }
        // "Don't ask again" makes the system dialog silent; send the user to
        // the app's system settings instead of doing nothing.
        if (userInitiated && (await getLocationPermissionState()) === 'blocked') {
          Alert.alert(t('location.permissionTitle'), t('location.permissionBody'), [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('location.openSettings'), onPress: openAppSettings },
          ]);
        }
      } catch (error) {
        console.log('Location error:', error);
      }
    },
    [applyLocation, t]
  );

  // Start from the user's real position: first launch asks for permission,
  // later launches silently refresh GPS-based locations (travel). A city the
  // user picked by hand is kept as-is.
  useEffect(() => {
    (async () => {
      setMethodSetting(await loadMethodSetting());
      const saved = await loadSavedLocation();
      if (saved) setLocation(saved);
      if (Platform.OS === 'web') return;
      if (!saved) {
        await handleLocationPress(true, false);
      } else if (saved.source !== 'manual') {
        handleLocationPress(false, false);
      }
      await askNotificationsOnce();
    })();
  }, [handleLocationPress]);

  // Prayer alerts are the core feature, but Android 13+ keeps them off until the
  // user grants permission. Ask once, right after location, instead of relying on
  // the user finding the toggle in Settings.
  const askNotificationsOnce = async () => {
    try {
      if (await AsyncStorage.getItem(NOTIFICATION_PROMPTED_KEY)) {
        if (await hasNotificationPermission()) promptPrayerAlertReliability();
        return;
      }
      await AsyncStorage.setItem(NOTIFICATION_PROMPTED_KEY, '1');
      if (await hasNotificationPermission()) {
        promptPrayerAlertReliability();
        return;
      }
      if (await requestNotificationPermissions()) {
        setNotificationsEnabled(true);
        logEvent('prayer_notifications_enabled', { source: 'first_launch' });
        promptPrayerAlertReliability();
      }
    } catch (error) {
      console.log('Notification prompt error:', error);
    }
  };

  const handleMethodChange = useCallback((setting: MethodSetting) => {
    setMethodSetting(setting);
    saveMethodSetting(setting);
  }, []);

  const resolvedMethod = resolveMethod(methodSetting, location.countryCode);

  const getTimesForDate = useCallback(
    (date: Date) => {
      const { method, asrFactor } = resolveMethod(methodSetting, location.countryCode);
      return calculatePrayerTimes(location.city.latitude, location.city.longitude, date, {
        method,
        asrFactor,
        timezone: location.timezone,
        ramadan: getHijriDate(date).month === 9,
      });
    },
    [location, methodSetting]
  );

  const loadPrayerTimes = useCallback(() => {
    setPrayerTimes(getTimesForDate(currentDate));
  }, [getTimesForDate, currentDate]);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  // Bumped when Settings closes, since per-prayer toggles / reminder time may have changed.
  const [notificationSettingsVersion, setNotificationSettingsVersion] = useState(0);
  const cityLabel = `${selectedCity.name} / ${selectedDistrict}`;

  useEffect(() => {
    if (!notificationsEnabled) return;
    scheduleAllPrayers(getTimesForDate, cityLabel, location.timezone).catch((error) =>
      console.log('Notification scheduling error:', error)
    );
  }, [notificationsEnabled, getTimesForDate, cityLabel, location.timezone, notificationSettingsVersion]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentDate(new Date());
    loadPrayerTimes();
    setRefreshing(false);
  }, [loadPrayerTimes]);

  const isFriday = currentDate.getDay() === 5;
  const todayReligiousDay = getTodayReligiousDay(i18n.language, currentDate);

  const handleShareFridayGreeting = async () => {
    safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logEvent('friday_greeting_shared');
    try {
      await Share.share({
        message: t('hatim.fridayShareMessage'),
      });
    } catch (error) {
      console.log('Friday share error:', error);
    }
  };

  const handleShareReligiousDayGreeting = async () => {
    if (!todayReligiousDay) return;
    safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logEvent('religious_day_shared', { key: todayReligiousDay.key, type: todayReligiousDay.type });
    const dayName = t(`religiousDays.names.${todayReligiousDay.key}`, { day: todayReligiousDay.day });
    try {
      await Share.share({
        message: todayReligiousDay.type === 'eid'
          ? formatEidShareMessage(dayName, t)
          : formatKandilShareMessage(dayName, t),
      });
    } catch (error) {
      console.log('Religious day share error:', error);
    }
  };

  const handleShareDailyDua = async () => {
    safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logEvent('daily_dua_shared');
    try {
      await Share.share({
        message: formatDailyDuaShareMessage(
          dailyDua,
          formatGregorianDate(),
          formatHijriDate(),
          t
        ),
      });
    } catch (error) {
      console.log('Daily dua share error:', error);
    }
  };

  const handleSharePrayerTimes = async () => {
    if (!prayerTimes) return;
    safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logEvent('prayer_times_shared', { city: selectedCity.name });
    try {
      await Share.share({
        message: formatPrayerTimesShareMessage(selectedCity.name, selectedDistrict, prayerTimes, formatGregorianDate(), t),
      });
    } catch (error) {
      console.log('Prayer times share error:', error);
    }
  };

  const handleShareWisdom = async () => {
    safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logEvent('wisdom_shared', { type: dailyWisdom.type });
    try {
      await Share.share({
        message: formatWisdomShareMessage({
          type: dailyWisdom.type,
          content: dailyWisdom.content,
          source: dailyWisdom.source,
          arabic: dailyWisdom.arabic,
        }, t),
      });
    } catch (error) {
      console.log('Wisdom share error:', error);
    }
  };

  const handleShareHadith = async () => {
    if (!dailyHadith) return;
    safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logEvent('hadith_shared');
    try {
      await Share.share({
        message: formatWisdomShareMessage({
          type: 'hadith',
          content: dailyHadith.text,
          source: dailyHadith.source,
        }, t),
      });
    } catch (error) {
      console.log('Hadith share error:', error);
    }
  };

  const handleShareEsma = async () => {
    if (!dailyEsma) return;
    safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logEvent('esma_shared');
    const localized = localizeEsma(dailyEsma, i18n.language);
    try {
      await Share.share({
        message: formatEsmaShareMessage({
          arabic: dailyEsma.arabic,
          turkish: localized.turkish,
          meaning: localized.meaning,
        }, t),
      });
    } catch (error) {
      console.log('Esma share error:', error);
    }
  };

  const handleInviteApp = async () => {
    safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logEvent('app_invite_shared');
    try {
      await Share.share({
        message: formatAppInviteMessage(t),
      });
    } catch (error) {
      console.log('Invite share error:', error);
    }
  };

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, '1');
        // Scheduling happens in the effect above once the state flips.
        setNotificationsEnabled(true);
        // Strong engagement signal; used as the Google Ads in-app conversion.
        logEvent('prayer_notifications_enabled', { source: 'settings', country: location.countryCode });
      }
    } else {
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, '0');
      setNotificationsEnabled(false);
      await cancelAllNotifications();
    }
  };

  const formatHijriDate = () => {
    const hDate = getHijriDate(currentDate);
    return `${hDate.day} ${t(`hijriMonths.${hDate.month}`, { defaultValue: hDate.monthName })} ${hDate.year}`;
  };

  const formatGregorianDate = () => {
    const today = new Date();
    if (!i18n.language.startsWith('tr')) {
      try {
        return today.toLocaleDateString(i18n.language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      } catch {
        // Fall through to the Turkish format if the runtime lacks Intl data.
      }
    }
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}, ${days[today.getDay()]}`;
  };

  return (
    <>
      <SEOHead 
        cityName={selectedCity.name}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Ezan Vakti ve Hatim",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web, iOS, Android",
            "description": "Diyanet uyumlu namaz vakitleri, kıble bulucu, tesbih, dua ve Türkiye'nin en gelişmiş ortak hatim platformu."
          },
          {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": `${selectedCity.name} Günlük Namaz Vakitleri`,
            "startDate": new Date().toISOString().split('T')[0],
            "location": {
              "@type": "Place",
              "name": selectedCity.name,
              "address": {
                "@type": "PostalAddress",
                "addressCountry": location.countryCode || "TR"
              }
            }
          }
        ]}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
      {/* Premium Header */}
      <LinearGradient colors={Gradients.premium} style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 24) + Spacing.md }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.citySelectorTrigger}
            onPress={() => setShowCitySelector(true)}
          >
            <View style={styles.locationIconWrapper}>
              <Ionicons name="location" size={18} color={colors.accent} />
            </View>
            <View>
              <Text style={styles.cityName}>{selectedCity.name}</Text>
              <Text style={styles.districtName}>{selectedDistrict}</Text>
            </View>
            <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.5)" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => handleLocationPress()} style={styles.actionIcon}>
              <Ionicons name="navigate-circle" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.actionIcon}>
              <Ionicons name="settings-sharp" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.headerDateInfo, styles.headerDateRow]}>
          <View>
            <Text style={styles.headerHijri}>{formatHijriDate()}</Text>
            <Text style={styles.headerGregorian}>{formatGregorianDate()}</Text>
          </View>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={16} color="#F4D03F" />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <View style={styles.mainContent}>
        {/* Ramazan Modu: sadece Hicri Ramazan ayında (9. ay) görünür */}
        {prayerTimes && getHijriDate().month === 9 && (
          <RamadanCountdown prayerTimes={prayerTimes} />
        )}

        {/* Next Prayer Countdown */}
        {prayerTimes && <NextPrayerCountdown prayerTimes={prayerTimes} />}

        {/* Prayer Times Card */}
        {prayerTimes && <PrayerTimesCard prayerTimes={prayerTimes} onShare={handleSharePrayerTimes} />}

        {/* Hızlı Erişim */}
        <View style={styles.quickAccessRow}>
          <TouchableOpacity
            style={[styles.quickAccessItem, { backgroundColor: colors.surface }, Shadows.light]}
            onPress={() => router.push('/quran')}
            accessibilityRole="button"
          >
            <Ionicons name="book" size={22} color={colors.primary} />
            <Text style={[styles.quickAccessLabel, { color: colors.text }]}>{t('quickAccess.quran', { defaultValue: "Kur'an" })}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAccessItem, { backgroundColor: colors.surface }, Shadows.light]}
            onPress={() => router.push('/mosques')}
          >
            <Ionicons name="business" size={22} color={colors.primary} />
            <Text style={[styles.quickAccessLabel, { color: colors.text }]}>{t('quickAccess.mosques')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAccessItem, { backgroundColor: colors.surface }, Shadows.light]}
            onPress={() => router.push('/zekat')}
          >
            <Ionicons name="calculator" size={22} color={colors.primary} />
            <Text style={[styles.quickAccessLabel, { color: colors.text }]}>{t('quickAccess.zekat')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAccessItem, { backgroundColor: colors.surface }, Shadows.light]}
            onPress={() => router.push('/abdest')}
          >
            <Ionicons name="water" size={22} color={colors.primary} />
            <Text style={[styles.quickAccessLabel, { color: colors.text }]}>{t('quickAccess.abdest')}</Text>
          </TouchableOpacity>
        </View>

        {/* Religious Days Card */}
        <ReligiousDaysCard />

        {/* Eid / Kandil Special Festive Banner */}
        {todayReligiousDay && (todayReligiousDay.type === 'eid' || todayReligiousDay.type === 'kandil') && (
          <LinearGradient
            colors={todayReligiousDay.type === 'eid' ? ['#855A00', '#B8860B', '#3E2A00'] : ['#064e2b', '#0A5C36', '#032516']}
            style={[styles.fridayCard, Shadows.premium]}
          >
            <View style={styles.fridayHeaderRow}>
              <View style={[styles.fridayBadge, todayReligiousDay.type === 'eid' && { backgroundColor: '#FFF3CD' }]}>
                <Ionicons name="sparkles" size={12} color={todayReligiousDay.type === 'eid' ? '#855A00' : '#052F1C'} />
                <Text style={[styles.fridayBadgeText, todayReligiousDay.type === 'eid' && { color: '#855A00' }]}>
                  {t(todayReligiousDay.type === 'eid' ? 'hatim.eidCardTitle' : 'hatim.kandilCardTitle').toUpperCase()}
                </Text>
              </View>
              <Ionicons name={todayReligiousDay.type === 'eid' ? 'moon' : 'star'} size={18} color="#FFD700" />
            </View>
            <Text style={styles.fridayTitle}>
              {t(`religiousDays.names.${todayReligiousDay.key}`, { day: todayReligiousDay.day })}
            </Text>
            <Text style={styles.fridayDesc}>
              {t(todayReligiousDay.type === 'eid' ? 'hatim.eidCardDesc' : 'hatim.kandilCardDesc')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleShareReligiousDayGreeting}
              style={[styles.fridayShareBtn, todayReligiousDay.type === 'eid' && { backgroundColor: '#FFF3CD' }]}
            >
              <Ionicons name="logo-whatsapp" size={18} color={todayReligiousDay.type === 'eid' ? '#855A00' : '#052F1C'} />
              <Text style={[styles.fridayShareBtnText, todayReligiousDay.type === 'eid' && { color: '#855A00' }]}>
                {t(todayReligiousDay.type === 'eid' ? 'hatim.eidShareBtn' : 'hatim.kandilShareBtn')}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        )}

        {/* Friday Special Card */}
        {isFriday && (
          <LinearGradient
            colors={['#064e2b', '#0A5C36', '#032516']}
            style={[styles.fridayCard, Shadows.premium]}
          >
            <View style={styles.fridayHeaderRow}>
              <View style={styles.fridayBadge}>
                <Ionicons name="sparkles" size={12} color="#052F1C" />
                <Text style={styles.fridayBadgeText}>{t('hatim.fridayCardTitle').toUpperCase()}</Text>
              </View>
              <Ionicons name="moon" size={18} color="#D4AF37" />
            </View>
            <Text style={styles.fridayTitle}>{t('home.fridayGreeting')}</Text>
            <Text style={styles.fridayDesc}>{t('hatim.fridayCardDesc')}</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleShareFridayGreeting}
              style={styles.fridayShareBtn}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#052F1C" />
              <Text style={styles.fridayShareBtnText}>{t('hatim.fridayShareBtn')}</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}

        {/* Daily Wisdom Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }, Shadows.medium]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconWrapper, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons 
                name={dailyWisdom.type === 'verse' ? 'book' : 'chatbubble-ellipses'} 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <Text style={[styles.cardTitle, { color: colors.primary }]}>
              {dailyWisdom.type === 'verse' ? t('home.verseOfTheDay') : t('home.hadithOfTheDay')}
            </Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={handleShareWisdom} style={styles.cardShareBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="share-social-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.wisdomBody}>
            {dailyWisdom.arabic && dailyWisdom.arabic !== dailyWisdom.content && (
              <Text style={[styles.arabicText, { color: colors.primary }]}>
                {dailyWisdom.arabic}
              </Text>
            )}
            <Text style={[styles.wisdomContent, { color: colors.text }]}>
              "{dailyWisdom.content}"
            </Text>
            <Text style={[styles.wisdomSource, { color: colors.textSecondary }]}>
              — {dailyWisdom.source}
            </Text>
          </View>
        </View>

        {/* Günün Hadisi + Mesajı (daily feed) */}
        {dailyHadith?.text ? (
          <View style={[styles.card, { backgroundColor: colors.surface }, Shadows.medium]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrapper, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.primary }]}>{t('home.hadithOfTheDay')}</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={handleShareHadith} style={styles.cardShareBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="share-social-outline" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.wisdomBody}>
              <Text style={[styles.wisdomContent, { color: colors.text }]}>{dailyHadith.text}</Text>
              <Text style={[styles.wisdomSource, { color: colors.textSecondary }]}>— {dailyHadith.source}</Text>
              {dailyMessage ? (
                <Text style={[styles.wisdomSource, { color: colors.textSecondary, fontStyle: 'italic', marginTop: Spacing.md }]}>
                  {t('home.dailyMessage')}: {dailyMessage}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Günün Duası Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/dua')}
          style={[styles.card, { backgroundColor: colors.surface }, Shadows.medium]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconWrapper, { backgroundColor: colors.accent + '20' }]}>
              <Ionicons name="hand-left" size={20} color={colors.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.cardTitle, { color: colors.primary }]}>{t('home.duaOfTheDay')}</Text>
              <Text style={{ fontSize: FontSize.xs, color: colors.textMuted, marginTop: 2, fontWeight: '500' }}>
                📅 {formatGregorianDate()} · {formatHijriDate()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleShareDailyDua}
              style={styles.cardShareBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="share-social-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.wisdomBody}>
            {dailyDua.title ? (
              <Text style={{ fontSize: FontSize.md, fontWeight: '700', color: colors.text, marginBottom: 6 }}>
                {dailyDua.title}
              </Text>
            ) : null}
            <Text style={[styles.arabicText, { color: colors.primary }]}>
              {dailyDua.arabic}
            </Text>
            {dailyDua.turkish ? (
              <Text style={[styles.wisdomContent, { color: colors.text }]}>
                "{dailyDua.turkish}"
              </Text>
            ) : null}
            <Text style={[styles.wisdomSource, { color: colors.textSecondary }]}>
              — {dailyDua.source}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Günün Esması Card */}
        {dailyEsma && (
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push('/esmaul-husna')}
            style={[styles.card, { backgroundColor: colors.surface, padding: 0 }, Shadows.premium]}
          >
            <LinearGradient
              colors={[colors.primary + '05', colors.secondary + '10']}
              style={styles.esmaContainer}
            >
              <View style={styles.esmaTopRow}>
                <View style={styles.esmaBadge}>
                  <Text style={[styles.esmaBadgeText, { color: colors.accent }]}>{t('home.esmaOfTheDay') ? t('home.esmaOfTheDay').toUpperCase() : 'GÜNÜN ESMASI'}</Text>
                </View>
                <TouchableOpacity onPress={handleShareEsma} style={styles.cardShareBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="share-social-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.esmaArabic, { color: colors.primary }]}>{dailyEsma.arabic}</Text>
              <Text style={[styles.esmaTurkish, { color: colors.text }]}>{localizeEsma(dailyEsma, i18n.language).turkish}</Text>
              <Text style={[styles.esmaMeaning, { color: colors.textSecondary }]}>
                {localizeEsma(dailyEsma, i18n.language).meaning}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Daily Checklist */}
        <DailyChecklist />

        {/* Hayra Vesile Ol / Uygulamayı Paylaş Kartı */}
        <LinearGradient
          colors={['#064e2b', '#0A5C36', '#032516']}
          style={[styles.inviteCard, Shadows.premium]}
        >
          <View style={styles.inviteHeaderRow}>
            <View style={styles.inviteBadge}>
              <Ionicons name="sparkles" size={12} color="#052F1C" />
              <Text style={styles.inviteBadgeText}>HAYRA VESİLE OL</Text>
            </View>
            <Ionicons name="heart" size={20} color="#D4AF37" />
          </View>
          <Text style={styles.inviteTitle}>Ezan Vakti'ni Sevdiklerinizle Paylaşın</Text>
          <Text style={styles.inviteDesc}>
            "Kim hayırlı bir işe vesile olursa, ona o hayrı yapan kadar ecir verilir." Sevdiklerinizin namazlarını ve hatimlerini takip etmelerine vesile olun.
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleInviteApp}
            style={styles.inviteShareBtn}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#052F1C" />
            <Text style={styles.inviteShareBtnText}>WhatsApp & Gruplarda Tavsiye Et</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={{ height: 100 }} />

      <CitySelector
        visible={showCitySelector}
        onClose={() => setShowCitySelector(false)}
        onSelect={(city, district) => {
          applyLocation(turkishCityLocation(city, district));
          logEvent('location_set', { source: 'manual', country: 'TR' });
          setShowCitySelector(false);
        }}
        onUseGps={() => {
          setShowCitySelector(false);
          handleLocationPress();
        }}
        selectedCity={selectedCity}
        selectedDistrict={selectedDistrict}
      />

      <SettingsModal
        visible={showSettings}
        onClose={() => {
          setShowSettings(false);
          setNotificationSettingsVersion((v) => v + 1);
        }}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={handleNotificationToggle}
        methodSetting={methodSetting}
        resolvedMethod={resolvedMethod.method}
        onChangeMethod={handleMethodChange}
      />
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    paddingBottom: 40,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  citySelectorTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  locationIconWrapper: {
    marginRight: Spacing.sm,
  },
  cityName: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  districtName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDateInfo: {
    marginTop: Spacing.xl,
  },
  headerDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  streakText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  headerHijri: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerGregorian: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.sm,
    marginTop: 2,
    fontWeight: '600',
  },
  mainContent: {
    paddingHorizontal: Spacing.md,
    marginTop: -20,
    gap: Spacing.md,
  },
  quickAccessRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickAccessItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 6,
  },
  quickAccessLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  cardIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  wisdomBody: {
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 45,
    fontFamily: Platform.OS === 'ios' ? 'Traditional Arabic' : 'serif',
  },
  wisdomContent: {
    fontSize: FontSize.md,
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '500',
    color: '#2C3E50',
  },
  wisdomSource: {
    fontSize: 12,
    marginTop: Spacing.lg,
    alignSelf: 'flex-end',
    fontWeight: '700',
    fontStyle: 'italic',
  },
  esmaContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  esmaBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  esmaBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  esmaArabic: {
    fontSize: 42,
    marginBottom: Spacing.sm,
    fontWeight: 'bold',
  },
  esmaTurkish: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  esmaMeaning: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
    paddingHorizontal: Spacing.md,
  },
  fridayCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
  },
  fridayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  fridayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  fridayBadgeText: {
    color: '#052F1C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  fridayTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  fridayDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  fridayShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4AF37',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  fridayShareBtnText: {
    color: '#052F1C',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardShareBtn: {
    padding: 6,
    borderRadius: BorderRadius.full,
  },
  esmaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.md,
  },
  inviteCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    marginTop: Spacing.md,
  },
  inviteHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  inviteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  inviteBadgeText: {
    color: '#052F1C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  inviteTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  inviteDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  inviteShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4AF37',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  inviteShareBtnText: {
    color: '#052F1C',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
