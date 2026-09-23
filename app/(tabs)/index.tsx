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
import { getHijriDate } from '@/lib/hijri';
import { SettingsModal } from '@/components/SettingsModal';
import { DailyChecklist } from '@/components/DailyChecklist';
import { CitySelector } from '@/components/CitySelector';
import { NextPrayerCountdown } from '@/components/NextPrayerCountdown';
import { RamadanCountdown } from '@/components/RamadanCountdown';
import { PrayerTimesCard } from '@/components/PrayerTimesCard';
import { ReligiousDaysCard } from '@/components/ReligiousDaysCard';
import { SEOHead } from '@/components/SEOHead';
import { getRandomEsma, localizeEsma, Esma } from '@/lib/data/esma';
import { syncRemoteContent, getVerifiedDailyVerse, localizeVerifiedVerse, VerifiedVerse } from '@/lib/services/content-sync';

const NOTIFICATION_PROMPTED_KEY = 'notification_permission_prompted';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const staticWisdom = localizeWisdom(getDailyWisdom(), i18n.language);
  const dailyDua = localizeDua(getDailyDua(), i18n.language);
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
  const [feedVerse, setFeedVerse] = useState<VerifiedVerse | null>(null);
  // Prefer today's verified verse from the daily feed; otherwise the bundled rotation.
  const dailyWisdom = feedVerse
    ? { id: 'feed', type: 'verse' as const, arabic: feedVerse.arabic, ...(({ text, source }) => ({ content: text, source }))(localizeVerifiedVerse(feedVerse, i18n.language)) }
    : staticWisdom;
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    syncRemoteContent()
      .catch(() => null)
      .then(() => getVerifiedDailyVerse())
      .then(setFeedVerse);
    setDailyEsma(getRandomEsma());
    recordAppOpenAndGetStreak().then(setStreak);
  }, []);

  useEffect(() => {
    configureNotificationChannel();
    hasNotificationPermission().then(setNotificationsEnabled);
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
      if (await AsyncStorage.getItem(NOTIFICATION_PROMPTED_KEY)) return;
      await AsyncStorage.setItem(NOTIFICATION_PROMPTED_KEY, '1');
      if (await hasNotificationPermission()) return;
      if (await requestNotificationPermissions()) {
        setNotificationsEnabled(true);
        logEvent('prayer_notifications_enabled', { source: 'first_launch' });
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

  const loadPrayerTimes = useCallback(() => {
    const { method, asrFactor } = resolveMethod(methodSetting, location.countryCode);
    const times = calculatePrayerTimes(location.city.latitude, location.city.longitude, currentDate, {
      method,
      asrFactor,
      timezone: location.timezone,
      ramadan: getHijriDate(currentDate).month === 9,
    });
    setPrayerTimes(times);
  }, [location, methodSetting, currentDate]);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  useEffect(() => {
    if (notificationsEnabled && prayerTimes) {
      scheduleAllPrayers(prayerTimes, `${selectedCity.name} / ${selectedDistrict}`);
    }
  }, [notificationsEnabled, prayerTimes, selectedCity.name, selectedDistrict]);

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

  const handleShareFridayGreeting = async () => {
    safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: t('hatim.fridayShareMessage'),
      });
    } catch (error) {
      console.log('Friday share error:', error);
    }
  };

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        setNotificationsEnabled(true);
        // Strong engagement signal; used as the Google Ads in-app conversion.
        logEvent('prayer_notifications_enabled', { source: 'settings', country: location.countryCode });
        if (prayerTimes) {
          await scheduleAllPrayers(prayerTimes, `${selectedCity.name} / ${selectedDistrict}`);
        }
      }
    } else {
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
      <LinearGradient colors={Gradients.premium} style={styles.header}>
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
        {prayerTimes && <PrayerTimesCard prayerTimes={prayerTimes} />}

        {/* Hızlı Erişim */}
        <View style={styles.quickAccessRow}>
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
          </View>
          
          <View style={styles.wisdomBody}>
            {dailyWisdom.arabic && (
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
            <Text style={[styles.cardTitle, { color: colors.primary }]}>{t('home.duaOfTheDay')}</Text>
            <View style={{ flex: 1 }} />
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>

          <View style={styles.wisdomBody}>
            <Text style={[styles.arabicText, { color: colors.primary }]}>
              {dailyDua.arabic}
            </Text>
            <Text style={[styles.wisdomContent, { color: colors.text }]}>
              "{dailyDua.turkish}"
            </Text>
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
              <View style={styles.esmaBadge}>
                <Text style={[styles.esmaBadgeText, { color: colors.accent }]}>{t('home.esmaOfTheDay') ? t('home.esmaOfTheDay').toUpperCase() : 'GÜNÜN ESMASI'}</Text>
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
        onClose={() => setShowSettings(false)}
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
});
