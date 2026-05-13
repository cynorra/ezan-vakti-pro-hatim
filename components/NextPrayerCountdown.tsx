import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, useColorScheme, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, Gradients } from '@/constants/theme';
import { PrayerTimes, getNextPrayer } from '@/lib/prayer-times';

interface NextPrayerCountdownProps {
  prayerTimes: PrayerTimes;
}

export function NextPrayerCountdown({ prayerTimes }: NextPrayerCountdownProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const nextPrayer = useMemo(() => getNextPrayer(prayerTimes), [prayerTimes]);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const [hours, minutes] = nextPrayer.time.split(':').map(Number);
      
      let targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);
      
      if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      
      const diff = targetTime.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ hours: h, minutes: m, seconds: s });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <LinearGradient
      colors={Gradients.premium}
      style={[styles.container, Shadows.premium]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>SIRADAKİ VAKİT</Text>
      </View>
      
      <Text style={styles.prayerName}>{nextPrayer.name.toUpperCase()}</Text>
      <Text style={styles.prayerTime}>{nextPrayer.time}</Text>
      
      <View style={styles.countdownWrapper}>
        <View style={styles.countdownBox}>
          <Text style={styles.countdownNumber}>{formatNumber(countdown.hours)}</Text>
          <Text style={styles.countdownLabel}>Saat</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.countdownBox}>
          <Text style={styles.countdownNumber}>{formatNumber(countdown.minutes)}</Text>
          <Text style={styles.countdownLabel}>Dk.</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.countdownBox}>
          <Text style={styles.countdownNumber}>{formatNumber(countdown.seconds)}</Text>
          <Text style={styles.countdownLabel}>Sn.</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  prayerName: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 2,
  },
  prayerTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.lg,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.xl,
  },
  countdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countdownBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  countdownNumber: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  countdownLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  separator: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 24,
    fontWeight: '800',
  },
});
