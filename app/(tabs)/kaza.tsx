import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Platform,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { safeHaptics } from '@/lib/haptics';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, Gradients } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEOHead } from '@/components/SEOHead';
import { useTranslation } from 'react-i18next';
import { logEvent } from '@/lib/analytics';
import { PLAY_STORE_URL } from '@/lib/share';
import { InlineBanner } from '@/components/InlineBanner';

interface KazaData {
  sabah: number;
  ogle: number;
  ikindi: number;
  aksam: number;
  yatsi: number;
  vitir: number;
}

const defaultKazaData: KazaData = {
  sabah: 0,
  ogle: 0,
  ikindi: 0,
  aksam: 0,
  yatsi: 0,
  vitir: 0,
};

export default function KazaScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [kazaData, setKazaData] = useState<KazaData>(defaultKazaData);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const saved = await AsyncStorage.getItem('kaza_data');
      if (saved) {
        setKazaData(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading kaza data:', error);
    }
  };

  const saveData = async (newData: KazaData) => {
    try {
      await AsyncStorage.setItem('kaza_data', JSON.stringify(newData));
    } catch (error) {
      console.log('Error saving kaza data:', error);
    }
  };

  const totalKaza = (data: KazaData) =>
    Object.values(data).reduce((sum, v) => sum + v, 0);

  const celebrateKazaCompleted = async () => {
    safeHaptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    logEvent('kaza_debt_cleared');
    try {
      await Share.share({
        message: t('kaza.completionShareMessage', { playStore: PLAY_STORE_URL }),
      });
    } catch (error) {
      console.log('Kaza completion share error:', error);
    }
  };

  const handleShareKaza = async () => {
    safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logEvent('kaza_shared', { totalDebt: total });
    try {
      const message = total === 0
        ? t('kaza.completionShareMessage', { playStore: PLAY_STORE_URL })
        : `🕌 Kaza namazlarımı Ezan Vakti + Hatim ile takip ediyorum (${total} vakit kaza borcum kaldı).\n\nSen de kaza namazlarını kolayca takip etmek için hemen indir:\n${PLAY_STORE_URL}`;
      await Share.share({ message });
    } catch (error) {
      console.log('Kaza share error:', error);
    }
  };

  const updateAllPrayers = (delta: number) => {
    setKazaData((prev) => {
      const keys: (keyof KazaData)[] = ['sabah', 'ogle', 'ikindi', 'aksam', 'yatsi', 'vitir'];
      const newData = { ...prev };
      for (const k of keys) {
        newData[k] = Math.max(0, prev[k] + delta);
      }
      saveData(newData);
      if (delta > 0) {
        safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        safeHaptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      if (totalKaza(prev) > 0 && totalKaza(newData) === 0) {
        celebrateKazaCompleted();
      }
      return newData;
    });
  };
  const updateCount = (key: keyof KazaData, delta: number) => {
    setKazaData((prev) => {
      const newCount = prev[key] + delta;
      if (newCount < 0) return prev; // Negatif olmasın

      const newData = { ...prev, [key]: newCount };
      saveData(newData);

      if (delta > 0) {
        safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        safeHaptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      if (totalKaza(prev) > 0 && totalKaza(newData) === 0) {
        celebrateKazaCompleted();
      }

      return newData;
    });
  };

  const renderPrayerCard = (key: keyof KazaData, title: string, icon: keyof typeof Ionicons.glyphMap) => {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface }, Shadows.medium]}>
        <View style={styles.cardInfo}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name={icon} size={24} color={colors.primary} />
          </View>
          <Text style={[styles.prayerName, { color: colors.text }]}>{title}</Text>
        </View>

        <View style={styles.counterSection}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.btn, { backgroundColor: colors.background }]}
            onPress={() => updateCount(key, -1)}
          >
            <Ionicons name="remove" size={24} color={colors.error || '#e74c3c'} />
          </TouchableOpacity>

          <Text style={[styles.countText, { color: colors.primary }]}>{kazaData[key]}</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.btn, { backgroundColor: colors.background }]}
            onPress={() => updateCount(key, 1)}
          >
            <Ionicons name="add" size={24} color={colors.success || '#2ecc71'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const total = totalKaza(kazaData);

  return (
    <>
      <SEOHead
        title="Kaza Namazı Takipçisi | Ezan Vakti ve Hatim"
        description="Kılınmamış kaza namazlarınızı kaydedin ve takip edin. Sabah, öğle, ikindi, akşam, yatsı ve vitir kaza hesaplama."
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={Gradients.premium} style={styles.header}>
          <Text style={styles.headerTitle}>{t('kaza.title') || 'KAZA NAMAZI'}</Text>
          <Text style={styles.headerSubtitle}>{t('kaza.subtitle') || 'Kılınmamış Namazların Takibi'}</Text>
        </LinearGradient>

        <ScrollView
          style={styles.mainContent}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Total Summary Card */}
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }, Shadows.medium]}>
            <View style={styles.summaryLeft}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('kaza.totalDebt')}</Text>
              <Text style={[styles.summaryCount, { color: total === 0 ? colors.success : colors.primary }]}>
                {t('kaza.prayersCount', { count: total })}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleShareKaza}
              style={[styles.shareKazaBtn, { backgroundColor: colors.accent + '20' }]}
            >
              <Ionicons name="share-social" size={18} color={colors.accent} />
            </TouchableOpacity>
          </View>

          {/* Quick 1 Day +/- Actions */}
          <View style={styles.quickDayRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => updateAllPrayers(-1)}
              style={[styles.quickDayBtn, { backgroundColor: colors.surface }, Shadows.light]}
            >
              <Ionicons name="checkmark-done" size={16} color={colors.primary} />
              <Text style={[styles.quickDayBtnText, { color: colors.primary }]}>-1 Gün (Tümü)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => updateAllPrayers(1)}
              style={[styles.quickDayBtn, { backgroundColor: colors.surface }, Shadows.light]}
            >
              <Ionicons name="add-circle-outline" size={16} color={colors.accent} />
              <Text style={[styles.quickDayBtnText, { color: colors.accent }]}>+1 Gün (Tümü)</Text>
            </TouchableOpacity>
          </View>

          {renderPrayerCard('sabah', t('kaza.sabah') || 'Sabah', 'partly-sunny-outline')}
          {renderPrayerCard('ogle', t('kaza.ogle') || 'Öğle', 'sunny-outline')}
          {renderPrayerCard('ikindi', t('kaza.ikindi') || 'İkindi', 'cloud-outline')}
          {renderPrayerCard('aksam', t('kaza.aksam') || 'Akşam', 'moon-outline')}
          {renderPrayerCard('yatsi', t('kaza.yatsi') || 'Yatsı', 'star-outline')}
          {renderPrayerCard('vitir', t('kaza.vitir') || 'Vitir', 'heart-outline')}

          <InlineBanner />
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mainContent: {
    flex: 1,
    marginTop: -20,
    paddingHorizontal: Spacing.md,
  },
  scrollContent: {
    paddingBottom: 40,
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayerName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  counterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  countText: {
    fontSize: FontSize.lg,
    fontWeight: '900',
    minWidth: 36,
    textAlign: 'center',
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  summaryLeft: {
    gap: 2,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  summaryCount: {
    fontSize: 22,
    fontWeight: '900',
  },
  shareKazaBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickDayRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: 4,
  },
  quickDayBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
  },
  quickDayBtnText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
});
