import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  ActivityIndicator,
  Platform,
  Dimensions,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { safeHaptics } from '@/lib/haptics';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, Gradients } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEOHead } from '@/components/SEOHead';
import { logTesbihStarted, logEvent } from '@/lib/analytics';
import { useTranslation } from 'react-i18next';
import { showInterstitialIfDue } from '@/lib/ads';

interface Dhikr {
  id: string;
  name: string;
  target: number;
  count: number;
}

// Display names for the built-in dhikrs (saved names stay in Turkish for existing users).
const DEFAULT_DHIKR_LATIN: Record<string, string> = {
  '1': 'Subhanallah',
  '2': 'Alhamdulillah',
  '3': 'Allahu Akbar',
  '4': 'La ilaha illallah',
  '5': 'Astaghfirullah',
};

const DEFAULT_DHIKRS: Dhikr[] = [
  { id: '1', name: 'Sübhânallâh', target: 33, count: 0 },
  { id: '2', name: 'Elhamdülillâh', target: 33, count: 0 },
  { id: '3', name: 'Allâhuekber', target: 33, count: 0 },
  { id: '4', name: 'Lâ ilâhe illallâh', target: 100, count: 0 },
  { id: '5', name: 'Estağfirullâh', target: 100, count: 0 },
];

export default function TesbihScreen() {
  const { t, i18n } = useTranslation();
  const dhikrName = (dhikr: Pick<Dhikr, 'id' | 'name'>) =>
    !i18n.language.startsWith('tr') && DEFAULT_DHIKR_LATIN[dhikr.id] ? DEFAULT_DHIKR_LATIN[dhikr.id] : dhikr.name;
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [dhikrs, setDhikrs] = useState<Dhikr[]>(DEFAULT_DHIKRS);
  const [activeDhikrIndex, setActiveDhikrIndex] = useState(0);
  const [editTargetModalVisible, setEditTargetModalVisible] = useState(false);
  const [tempTarget, setTempTarget] = useState('');

  // Micro-interaction Animated Values
  const buttonScale = useRef(new Animated.Value(1)).current;
  const numberScale = useRef(new Animated.Value(1)).current;
  const ringScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const saved = await AsyncStorage.getItem('dhikrs_data');
      if (saved) {
        setDhikrs(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading dhikrs:', error);
    }
  };

  const saveData = async (newData: Dhikr[]) => {
    try {
      await AsyncStorage.setItem('dhikrs_data', JSON.stringify(newData));
    } catch (error) {
      console.log('Error saving dhikrs:', error);
    }
  };

  const triggerPressAnimation = () => {
    // Button spring press effect
    buttonScale.setValue(0.90);
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      tension: 140,
      useNativeDriver: true,
    }).start();

    // Number pop effect
    numberScale.setValue(1.18);
    Animated.spring(numberScale, {
      toValue: 1,
      friction: 5,
      tension: 160,
      useNativeDriver: true,
    }).start();
  };

  const triggerMilestoneAnimation = () => {
    ringScale.setValue(1.08);
    Animated.spring(ringScale, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    const newDhikrs = [...dhikrs];
    const dhikr = newDhikrs[activeDhikrIndex];
    if (!dhikr) return;
    
    dhikr.count += 1;
    logEvent('tesbih_incremented', { dhikr_name: dhikr.name, current_count: dhikr.count });
    triggerPressAnimation();

    if (dhikr.count === dhikr.target) {
      safeHaptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      logEvent('tesbih_target_reached', { dhikr_name: dhikr.name, target: dhikr.target });
      triggerMilestoneAnimation();
      showInterstitialIfDue('tesbih_target');

      // Otomatik bir sonraki zikre gecis
      setTimeout(() => {
        if (activeDhikrIndex < dhikrs.length - 1) {
          setActiveDhikrIndex(prev => prev + 1);
        } else {
          setActiveDhikrIndex(0);
        }
      }, 500);
    } else if (dhikr.count === 33 || dhikr.count === 66 || dhikr.count === 99) {
      safeHaptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      triggerMilestoneAnimation();
    } else {
      safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setDhikrs(newDhikrs);
    saveData(newDhikrs);
  };

  const resetCount = () => {
    const newDhikrs = [...dhikrs];
    if (newDhikrs[activeDhikrIndex]) {
      newDhikrs[activeDhikrIndex].count = 0;
      setDhikrs(newDhikrs);
      saveData(newDhikrs);
      safeHaptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const saveTarget = () => {
    const targetValue = parseInt(tempTarget, 10);
    if (!isNaN(targetValue) && targetValue > 0) {
      const newDhikrs = [...dhikrs];
      if (newDhikrs[activeDhikrIndex]) {
        newDhikrs[activeDhikrIndex].target = targetValue;
        setDhikrs(newDhikrs);
        saveData(newDhikrs);
      }
    }
    setEditTargetModalVisible(false);
  };

  const currentDhikr = dhikrs[activeDhikrIndex] || DEFAULT_DHIKRS[0] || { id: '0', name: t('tesbih.defaultName'), target: 33, count: 0 };
  const progress = currentDhikr.target > 0 ? Math.min(currentDhikr.count / currentDhikr.target, 1) : 0;

  return (
    <>
      <SEOHead 
        title="Dijital Tesbih ve Zikirmatik | Ezan Vakti ve Hatim"
        description="Gelişmiş dijital zikirmatik ve tesbihmatik uygulaması. Günlük zikirlerinizi takip edin, kaydedin ve hedeflerinize ulaşın."
        keywords="zikirmatik, tesbihmatik, dijital tesbih, zikir çek, günlük zikirler, sübhanallah"
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={Gradients.premium} style={styles.header}>
        <Text style={styles.headerTitle}>{t('tesbih.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('tesbih.subtitle')}</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.mainContent} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Counter Display */}
        <View style={styles.counterSection}>
          <Animated.View style={[styles.ringWrapper, { transform: [{ scale: ringScale }] }]}>
            {/* SVG Circular Progress */}
            <Svg width={240} height={240} style={styles.progressSvg}>
              {/* Background Circle */}
              <Circle
                cx="120"
                cy="120"
                r="105"
                stroke={colors.primary + '10'}
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress Circle */}
              <Circle
                cx="120"
                cy="120"
                r="105"
                stroke={colors.primary}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 105}`}
                strokeDashoffset={`${2 * Math.PI * 105 * (1 - progress)}`}
                strokeLinecap="round"
                transform="rotate(-90 120 120)"
              />
            </Svg>

            <LinearGradient
              colors={[colors.surface, colors.background]}
              style={[styles.innerCircle, Shadows.premium]}
            >
              <Text style={[styles.currentDhikrName, { color: colors.primary }]}>
                {dhikrName(currentDhikr)}
              </Text>
              <Animated.Text
                style={[
                  styles.counterText,
                  { color: colors.text, transform: [{ scale: numberScale }] },
                ]}
              >
                {currentDhikr.count}
              </Animated.Text>
              <TouchableOpacity 
                style={[styles.targetBadge, { backgroundColor: colors.primary + '10' }]}
                onPress={() => {
                  setTempTarget(currentDhikr.target.toString());
                  setEditTargetModalVisible(true);
                }}
              >
                <Text style={[styles.targetText, { color: colors.primary }]}>
                  HEDEF: {currentDhikr.target} ✎
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          {/* Large Tactile Button with Spring Bounce */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePress}
            style={styles.mainButtonWrapper}
          >
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <LinearGradient
                colors={Gradients.primary}
                style={[styles.mainButton, Shadows.premium]}
              >
                <Ionicons name="finger-print" size={42} color="#fff" />
                <Text style={styles.buttonText}>{t('tesbih.tap')}</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetCount} style={styles.resetBtn}>
            <Ionicons name="refresh" size={24} color={colors.textMuted} />
            <Text style={[styles.resetText, { color: colors.textMuted }]}>{t('tesbih.reset')}</Text>
          </TouchableOpacity>
        </View>

        {/* Dhikr List */}
        <View style={styles.listSection}>
          <Text style={[styles.listTitle, { color: colors.textSecondary }]}>{t('tesbih.choose')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
            {dhikrs.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setActiveDhikrIndex(index);
                  safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  logTesbihStarted(item.name, item.count);
                }}
                style={[
                  styles.dhikrCard,
                  { backgroundColor: activeDhikrIndex === index ? colors.primary : colors.surface },
                  activeDhikrIndex === index ? Shadows.medium : Shadows.light
                ]}
              >
                <Text style={[styles.dhikrCardName, { color: activeDhikrIndex === index ? '#fff' : colors.text }]}>
                  {dhikrName(item)}
                </Text>
                <View style={[styles.dhikrCardInfo, { borderTopColor: activeDhikrIndex === index ? 'rgba(255,255,255,0.2)' : colors.border }]}>
                  <Text style={[styles.dhikrCardCount, { color: activeDhikrIndex === index ? '#fff' : colors.primary }]}>
                    {item.count}
                  </Text>
                  <Text style={[styles.dhikrCardTarget, { color: activeDhikrIndex === index ? 'rgba(255,255,255,0.6)' : colors.textMuted }]}>
                    / {item.target}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Hedef Düzenleme Modalı */}
      <Modal
        visible={editTargetModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('tesbih.setTarget')}</Text>
            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              keyboardType="number-pad"
              value={tempTarget}
              onChangeText={setTempTarget}
              maxLength={5}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalBtnCancel} 
                onPress={() => setEditTargetModalVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtnSave, { backgroundColor: colors.primary }]} 
                onPress={saveTarget}
              >
                <Text style={styles.modalBtnSaveText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  },
  scrollContent: {
    paddingBottom: 40,
  },
  counterSection: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  ringWrapper: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: Spacing.xl,
  },
  progressSvg: {
    position: 'absolute',
  },
  innerCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  currentDhikrName: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  counterText: {
    fontSize: 64,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  targetBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  targetText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  mainButtonWrapper: {
    marginBottom: Spacing.xl,
  },
  mainButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: 1,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.6,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '700',
  },
  listSection: {
    marginTop: Spacing.lg,
    paddingLeft: Spacing.md,
  },
  listTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  scrollList: {
    paddingRight: Spacing.md,
    gap: Spacing.md,
  },
  dhikrCard: {
    width: 140,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    justifyContent: 'space-between',
    minHeight: 100,
  },
  dhikrCardName: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  dhikrCardInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  dhikrCardCount: {
    fontSize: 18,
    fontWeight: '800',
  },
  dhikrCardTarget: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    marginBottom: Spacing.lg,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.xl,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalBtnCancel: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  modalBtnCancelText: {
    fontWeight: '700',
    color: '#666',
  },
  modalBtnSave: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalBtnSaveText: {
    color: '#fff',
    fontWeight: '700',
  },
});
