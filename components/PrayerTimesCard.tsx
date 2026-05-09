import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
import { PrayerTimes, getNextPrayer } from '@/lib/prayer-times';

interface PrayerTimesCardProps {
  prayerTimes: PrayerTimes;
}

const prayerNames: { [key: string]: { name: string; icon: string } } = {
  fajr: { name: 'İmsak', icon: 'moon-outline' },
  sunrise: { name: 'Güneş', icon: 'sunny-outline' },
  dhuhr: { name: 'Öğle', icon: 'sunny' },
  asr: { name: 'İkindi', icon: 'partly-sunny-outline' },
  maghrib: { name: 'Akşam', icon: 'cloudy-night-outline' },
  isha: { name: 'Yatsı', icon: 'moon' },
};

export function PrayerTimesCard({ prayerTimes }: PrayerTimesCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const nextPrayer = getNextPrayer(prayerTimes);

  const prayers = [
    { key: 'fajr', time: prayerTimes.fajr },
    { key: 'sunrise', time: prayerTimes.sunrise },
    { key: 'dhuhr', time: prayerTimes.dhuhr },
    { key: 'asr', time: prayerTimes.asr },
    { key: 'maghrib', time: prayerTimes.maghrib },
    { key: 'isha', time: prayerTimes.isha },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, Shadows.medium]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Namaz Vakitleri</Text>
        <Ionicons name="time-outline" size={20} color={colors.primary} />
      </View>
      
      {prayers.map((prayer, index) => {
        // Map Turkish names back to keys for comparison
        const turkishToKey: Record<string, string> = {
          'İmsak': 'fajr',
          'Güneş': 'sunrise',
          'Öğle': 'dhuhr',
          'İkindi': 'asr',
          'Akşam': 'maghrib',
          'Yatsı': 'isha'
        };
        const isNext = prayer.key === turkishToKey[nextPrayer.name];
        const prayerInfo = prayerNames[prayer.key];
        
        return (
          <View
            key={prayer.key}
            style={[
              styles.prayerRow,
              isNext && styles.nextPrayerRow,
              { borderBottomColor: colors.border },
              index === prayers.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            {isNext && (
              <LinearGradient
                colors={[colors.primary + '20', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            
            <View style={styles.prayerLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: isNext ? colors.primary : colors.background },
                ]}
              >
                <Ionicons
                  name={prayerInfo.icon as any}
                  size={18}
                  color={isNext ? '#fff' : colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.prayerName,
                  { color: isNext ? colors.primary : colors.text },
                  isNext && styles.prayerNameActive,
                ]}
              >
                {prayerInfo.name}
              </Text>
            </View>
            
            <View style={styles.prayerRight}>
              <Text
                style={[
                  styles.prayerTime,
                  { color: isNext ? colors.primary : colors.text },
                  isNext && styles.prayerTimeActive,
                ]}
              >
                {prayer.time}
              </Text>
              {isNext && (
                <View style={[styles.nextBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.nextBadgeText}>ŞİMDİ</Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    position: 'relative',
  },
  nextPrayerRow: {
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    zIndex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerName: {
    fontSize: FontSize.md,
  },
  prayerNameActive: {
    fontWeight: '700',
  },
  prayerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    zIndex: 1,
  },
  prayerTime: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  prayerTimeActive: {
    fontWeight: '800',
  },
  nextBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nextBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
});
