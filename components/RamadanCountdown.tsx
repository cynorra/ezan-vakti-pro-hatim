import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
import { PrayerTimes } from '@/lib/prayer-times';
import { useTranslation } from 'react-i18next';

interface RamadanCountdownProps {
  prayerTimes: PrayerTimes;
}

function targetFromTimeStr(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  return target;
}

export function RamadanCountdown({ prayerTimes }: RamadanCountdownProps) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [phase, setPhase] = useState<'toIftar' | 'toSahur'>('toIftar');

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const fajrTarget = targetFromTimeStr(prayerTimes.fajr);
      const maghribTarget = targetFromTimeStr(prayerTimes.maghrib);

      let target: Date;
      if (now < fajrTarget) {
        // Gece yarısı ile imsak arası: sahura kalan süre
        target = fajrTarget;
        setPhase('toSahur');
      } else if (now < maghribTarget) {
        // İmsaktan akşama kadar: iftara kalan süre
        target = maghribTarget;
        setPhase('toIftar');
      } else {
        // Akşamdan sonra: yarınki imsağa kalan süre (yaklaşık, saat kayması ihmal edilebilir)
        target = new Date(fajrTarget);
        target.setDate(target.getDate() + 1);
        setPhase('toSahur');
      }

      const diff = target.getTime() - now.getTime();
      setCountdown({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <LinearGradient
      colors={['#0d7a3e', '#052F1C']}
      style={[styles.container, Shadows.premium]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.badge}>
        <Ionicons name="moon" size={12} color="#052F1C" />
        <Text style={styles.badgeText}>{t('ramadan.badge')}</Text>
      </View>

      <View style={styles.phaseRow}>
        <Ionicons
          name={phase === 'toIftar' ? 'restaurant' : 'sunny'}
          size={20}
          color="#F4D03F"
        />
        <Text style={styles.phaseLabel}>
          {phase === 'toIftar' ? t('ramadan.untilIftar') : t('ramadan.untilSahur')}
        </Text>
      </View>

      <View style={styles.countdownWrapper}>
        <View style={styles.countdownBox}>
          <Text style={styles.countdownNumber}>{formatNumber(countdown.hours)}</Text>
          <Text style={styles.countdownLabel}>{t('ramadan.hours')}</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.countdownBox}>
          <Text style={styles.countdownNumber}>{formatNumber(countdown.minutes)}</Text>
          <Text style={styles.countdownLabel}>{t('ramadan.minutes')}</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.countdownBox}>
          <Text style={styles.countdownNumber}>{formatNumber(countdown.seconds)}</Text>
          <Text style={styles.countdownLabel}>{t('ramadan.seconds')}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    color: '#052F1C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  phaseLabel: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  countdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countdownBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 58,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  countdownNumber: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  countdownLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  separator: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 20,
    fontWeight: '800',
  },
});
