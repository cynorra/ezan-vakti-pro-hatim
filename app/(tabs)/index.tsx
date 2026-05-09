import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
import { turkishCities, City } from '@/lib/data/cities';
import { calculatePrayerTimes, getNextPrayer, PrayerTimes } from '@/lib/prayer-times';
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
      if (status !== 'granted') {
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      // Find nearest city
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
      console.log('Konum alinamadi:', error);
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
    const days = ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi'];
    const months = [
      'Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran',
      'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik'
    ];
    const today = new Date();
    return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}, ${days[today.getDay()]}`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with City Selection */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          style={styles.cityButton}
          onPress={() => setShowCitySelector(true)}
        >
          <Ionicons name="location" size={20} color="#fff" />
          <View>
            <Text style={styles.cityName}>{selectedCity.name}</Text>
            <Text style={styles.districtName}>{selectedDistrict}</Text>
          </View>
          <Ionicons name="chevron-down" size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLocationPress} style={styles.locationButton}>
          <Ionicons name="navigate" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Date Display */}
      <View style={[styles.dateContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.hijriDate, { color: colors.primary }]}>
          {formatHijriDate()}
        </Text>
        <Text style={[styles.gregorianDate, { color: colors.textSecondary }]}>
          {formatGregorianDate()}
        </Text>
      </View>

      {/* Next Prayer Countdown */}
      {prayerTimes && (
        <NextPrayerCountdown prayerTimes={prayerTimes} />
      )}

      {/* Prayer Times Card */}
      {prayerTimes && (
        <PrayerTimesCard prayerTimes={prayerTimes} />
      )}

      {/* Religious Days Card */}
      <ReligiousDaysCard />

      {/* Notifications Button */}
      <TouchableOpacity
        style={[
          styles.notificationButton,
          { backgroundColor: notificationsEnabled ? colors.primary + '20' : colors.card }
        ]}
        onPress={handleNotificationToggle}
      >
        <Ionicons 
          name={notificationsEnabled ? "notifications" : "notifications-outline"} 
          size={20} 
          color={colors.primary} 
        />
        <Text style={[styles.notificationText, { color: colors.primary }]}>
          {notificationsEnabled ? "Vakit Bildirimleri Açık" : "Vakit Bildirimlerini Aç"}
        </Text>
      </TouchableOpacity>

      {/* Daily Wisdom Section */}
      <View style={[styles.wisdomCard, { backgroundColor: colors.card }]}>
        <View style={styles.wisdomHeader}>
          <Ionicons 
            name={getDailyWisdom().type === 'verse' ? 'book' : 'chatbubble-ellipses'} 
            size={20} 
            color={colors.primary} 
          />
          <Text style={[styles.wisdomTitle, { color: colors.primary }]}>
            Günün {getDailyWisdom().type === 'verse' ? 'Ayeti' : 'Hadisi'}
          </Text>
        </View>
        
        {getDailyWisdom().arabic && (
          <Text style={[styles.arabicWisdom, { color: colors.primary }]}>
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

      {/* Günün Esması Section */}
      <View style={[styles.esmaCard, { backgroundColor: colors.card }, Shadows.medium]}>
        <LinearGradient
          colors={[colors.primary + '10', colors.secondary + '10']}
          style={styles.esmaGradient}
        >
          <Text style={[styles.esmaHeader, { color: colors.primary }]}>GÜNÜN ESMASI</Text>
          <Text style={[styles.esmaArabic, { color: colors.primary }]}>الرَّحْمَنُ</Text>
          <Text style={[styles.esmaTurkish, { color: colors.text }]}>Er-Rahmân</Text>
          <Text style={[styles.esmaMeaning, { color: colors.textSecondary }]}>
            Dünyada bütün mahlükata merhamet eden, şefkat gösteren, ihsan eden.
          </Text>
        </LinearGradient>
      </View>

      {/* Daily Checklist Section */}
      <DailyChecklist />

      <View style={{ height: Spacing.xl }} />

      {/* City Selector Modal */}
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

      {/* Settings Modal */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cityName: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  districtName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.xs,
  },
  locationButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  settingsButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  dateContainer: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  hijriDate: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  gregorianDate: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  wisdomCard: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  wisdomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  wisdomTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  arabicWisdom: {
    fontSize: FontSize.xl,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 32,
  },
  wisdomContent: {
    fontSize: FontSize.md,
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  wisdomSource: {
    fontSize: FontSize.xs,
    marginTop: Spacing.md,
    textAlign: 'right',
    fontWeight: '600',
  },
  notificationButton: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  notificationText: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  esmaCard: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  esmaGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  esmaHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  esmaArabic: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  esmaTurkish: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  esmaMeaning: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
});
