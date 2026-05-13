import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
import { PrayerTimes, getNextPrayer } from '@/lib/prayer-times';

interface PrayerTimesCardProps {
  prayerTimes: PrayerTimes;
}

const prayerNames: { [key: string]: { name: string; icon: string; iconFocused: string } } = {
  fajr: { name: 'İmsak', icon: 'moon-outline', iconFocused: 'moon' },
  sunrise: { name: 'Güneş', icon: 'sunny-outline', iconFocused: 'sunny' },
  dhuhr: { name: 'Öğle', icon: 'sunny-outline', iconFocused: 'sunny' },
  asr: { name: 'İkindi', icon: 'partly-sunny-outline', iconFocused: 'partly-sunny' },
  maghrib: { name: 'Akşam', icon: 'cloudy-night-outline', iconFocused: 'cloudy-night' },
  isha: { name: 'Yatsı', icon: 'moon-outline', iconFocused: 'moon' },
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

  const turkishToKey: Record<string, string> = {
    'İmsak': 'fajr',
    'Güneş': 'sunrise',
    'Öğle': 'dhuhr',
    'İkindi': 'asr',
    'Akşam': 'maghrib',
    'Yatsı': 'isha'
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }, Shadows.medium]}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={[styles.titleDot, { backgroundColor: colors.accent }]} />
          <Text style={[styles.title, { color: colors.text }]}>GÜNLÜK VAKİTLER</Text>
        </View>
        <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
      </View>
      
      <View style={styles.rowsContainer}>
        {prayers.map((prayer, index) => {
          const isNext = prayer.key === turkishToKey[nextPrayer.name];
          const prayerInfo = prayerNames[prayer.key];
          
          return (
            <View
              key={prayer.key}
              style={[
                styles.prayerRow,
                { borderBottomColor: colors.border },
                index === prayers.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              {isNext && (
                <LinearGradient
                  colors={[colors.primary + '10', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              )}

              {isNext && <View style={[styles.activeIndicator, { backgroundColor: colors.accent }]} />}
              
              <View style={styles.prayerLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: isNext ? colors.primary + '15' : colors.background },
                  ]}
                >
                  <Ionicons
                    name={(isNext ? prayerInfo.iconFocused : prayerInfo.icon) as any}
                    size={20}
                    color={isNext ? colors.primary : colors.textMuted}
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
                    { color: isNext ? colors.primary : colors.textSecondary },
                    isNext && styles.prayerTimeActive,
                  ]}
                >
                  {prayer.time}
                </Text>
                {isNext && (
                  <View style={[styles.nextBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.nextBadgeText}>SIRADAKİ</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  rowsContainer: {
    paddingVertical: Spacing.sm,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '20%',
    bottom: '20%',
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    zIndex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerName: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  prayerNameActive: {
    fontWeight: '800',
  },
  prayerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    zIndex: 1,
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  prayerTimeActive: {
    fontWeight: '900',
  },
  nextBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  nextBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
