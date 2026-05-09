import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
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
      
      // Eger vakit gectiyse yarin icin hesapla
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
      colors={
        colorScheme === 'dark'
          ? [colors.primaryDark, colors.primary]
          : [colors.primary, colors.primaryLight]
      }
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.label}>Sıradaki Namaz</Text>
      <Text style={styles.prayerName}>{nextPrayer.name}</Text>
      <Text style={styles.prayerTime}>{nextPrayer.time}</Text>
      
      <View style={styles.countdownContainer}>
        <View style={styles.countdownItem}>
          <Text style={styles.countdownNumber}>{formatNumber(countdown.hours)}</Text>
          <Text style={styles.countdownLabel}>Saat</Text>
        </View>
        <Text style={styles.countdownSeparator}>:</Text>
        <View style={styles.countdownItem}>
          <Text style={styles.countdownNumber}>{formatNumber(countdown.minutes)}</Text>
          <Text style={styles.countdownLabel}>Dakika</Text>
        </View>
        <Text style={styles.countdownSeparator}>:</Text>
        <View style={styles.countdownItem}>
          <Text style={styles.countdownNumber}>{formatNumber(countdown.seconds)}</Text>
          <Text style={styles.countdownLabel}>Saniye</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  prayerName: {
    color: '#fff',
    fontSize: FontSize.xxl,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  prayerTime: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FontSize.lg,
    marginTop: Spacing.xs,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  countdownItem: {
    alignItems: 'center',
    minWidth: 50,
  },
  countdownNumber: {
    color: '#fff',
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  countdownLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  countdownSeparator: {
    color: '#fff',
    fontSize: FontSize.xxl,
    fontWeight: '700',
    marginHorizontal: Spacing.sm,
  },
});
