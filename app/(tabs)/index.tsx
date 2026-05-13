import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, Gradients } from '@/constants/theme';
import { turkishCities, City } from '@/lib/data/cities';
import { calculatePrayerTimes, PrayerTimes } from '@/lib/prayer-times';
import { getDailyWisdom } from '@/lib/data/daily-content';
import { requestNotificationPermissions, scheduleAllPrayers } from '@/lib/notifications';
import { getHijriDate } from '@/lib/hijri';
import { SettingsModal } from '@/components/SettingsModal';
import { DailyChecklist } from '@/components/DailyChecklist';
import { CitySelector } from '@/components/CitySelector';
import { NextPrayerCountdown } from '@/components/NextPrayerCountdown';
import { PrayerTimesCard } from '@/components/PrayerTimesCard';
import { ReligiousDaysCard } from '@/components/ReligiousDaysCard';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedCity, setSelectedCity] = useState<City>(turkishCities[33]); // Istanbul
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Merkez');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const loadPrayerTimes = useCallback(() => {
    const times = calculatePrayerTimes(
      selectedCity.latitude,
      selectedCity.longitude,
      currentDate
    );
    setPrayerTimes(times);
  }, [selectedCity, currentDate]);

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

  const handleLocationPress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      
      const location = await Location.getCurrentPositionAsync({});
      let nearestCity = turkishCities[0];
      let minDistance = Infinity;
      
      turkishCities.forEach((city) => {
        const distance = Math.sqrt(
          Math.pow(city.latitude - location.coords.latitude, 2) +
          Math.pow(city.longitude - location.coords.longitude, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestCity = city;
        }
      });
      
      setSelectedCity(nearestCity);
      setSelectedDistrict(nearestCity.districts[0] || 'Merkez');
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        setNotificationsEnabled(true);
        if (prayerTimes) {
          await scheduleAllPrayers(prayerTimes, `${selectedCity.name} / ${selectedDistrict}`);
        }
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const formatHijriDate = () => {
    const hDate = getHijriDate(currentDate);
    return `${hDate.day} ${hDate.monthName} ${hDate.year}`;
  };

  const formatGregorianDate = () => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const today = new Date();
    return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}, ${days[today.getDay()]}`;
  };

  return (
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
            <TouchableOpacity onPress={handleLocationPress} style={styles.actionIcon}>
              <Ionicons name="navigate-circle" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.actionIcon}>
              <Ionicons name="settings-sharp" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerDateInfo}>
          <Text style={styles.headerHijri}>{formatHijriDate()}</Text>
          <Text style={styles.headerGregorian}>{formatGregorianDate()}</Text>
        </View>
      </LinearGradient>

      <View style={styles.mainContent}>
        {/* Next Prayer Countdown */}
        {prayerTimes && <NextPrayerCountdown prayerTimes={prayerTimes} />}

        {/* Prayer Times Card */}
        {prayerTimes && <PrayerTimesCard prayerTimes={prayerTimes} />}

        {/* Religious Days Card */}
        <ReligiousDaysCard />

        {/* Daily Wisdom Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }, Shadows.medium]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconWrapper, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons 
                name={getDailyWisdom().type === 'verse' ? 'book' : 'chatbubble-ellipses'} 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <Text style={[styles.cardTitle, { color: colors.primary }]}>
              Günün {getDailyWisdom().type === 'verse' ? 'Ayeti' : 'Hadisi'}
            </Text>
          </View>
          
          <View style={styles.wisdomBody}>
            {getDailyWisdom().arabic && (
              <Text style={[styles.arabicText, { color: colors.primary }]}>
                {getDailyWisdom().arabic}
              </Text>
            )}
            <Text style={[styles.wisdomContent, { color: colors.text }]}>
              "{getDailyWisdom().content}"
            </Text>
            <Text style={[styles.wisdomSource, { color: colors.textSecondary }]}>
              — {getDailyWisdom().source}
            </Text>
          </View>
        </View>

        {/* Günün Esması Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, padding: 0 }, Shadows.premium]}>
          <LinearGradient
            colors={[colors.primary + '05', colors.secondary + '10']}
            style={styles.esmaContainer}
          >
            <View style={styles.esmaBadge}>
              <Text style={[styles.esmaBadgeText, { color: colors.accent }]}>GÜNÜN ESMASI</Text>
            </View>
            <Text style={[styles.esmaArabic, { color: colors.primary }]}>الرَّحْمَنُ</Text>
            <Text style={[styles.esmaTurkish, { color: colors.text }]}>Er-Rahmân</Text>
            <Text style={[styles.esmaMeaning, { color: colors.textSecondary }]}>
              Dünyada bütün mahlükata merhamet eden, şefkat gösteren, ihsan eden.
            </Text>
          </LinearGradient>
        </View>

        {/* Daily Checklist */}
        <DailyChecklist />
      </View>

      <View style={{ height: 100 }} />

      <CitySelector
        visible={showCitySelector}
        onClose={() => setShowCitySelector(false)}
        onSelect={(city, district) => {
          setSelectedCity(city);
          if (district) setSelectedDistrict(district);
          setShowCitySelector(false);
        }}
        selectedCity={selectedCity}
        selectedDistrict={selectedDistrict}
      />

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={handleNotificationToggle}
      />
    </ScrollView>
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
});
