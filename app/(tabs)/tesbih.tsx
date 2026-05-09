import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.65;

interface DhikrType {
  id: string;
  arabic: string;
  turkish: string;
  meaning: string;
  defaultTarget: number;
}

const dhikrTypes: DhikrType[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللّهِ',
    turkish: 'Subhanallah',
    meaning: "Allah'ı tüm eksikliklerden tenzih ederim",
    defaultTarget: 33,
  },
  {
    id: 'elhamdulillah',
    arabic: 'الْحَمْدُ لِلّهِ',
    turkish: 'Elhamdulillah',
    meaning: "Hamd Allah'a mahsustur",
    defaultTarget: 33,
  },
  {
    id: 'allahuekber',
    arabic: 'اللّهُ أَكْبَرُ',
    turkish: 'Allahu Ekber',
    meaning: 'Allah en büyüktür',
    defaultTarget: 33,
  },
  {
    id: 'lailaheillallah',
    arabic: 'لَا إِلَهَ إِلَّا اللّهُ',
    turkish: 'La İlahe İllallah',
    meaning: "Allah'tan başka ilah yoktur",
    defaultTarget: 100,
  },
  {
    id: 'estagfirullah',
    arabic: 'أَسْتَغْفِرُ اللّهَ',
    turkish: 'Estağfirullah',
    meaning: "Allah'tan bağışlanma dilerim",
    defaultTarget: 100,
  },
  {
    id: 'salavat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    turkish: 'Salavat',
    meaning: "Allah'ım Muhammed'e salat eyle",
    defaultTarget: 100,
  },
];

export default function TesbihScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrType>(dhikrTypes[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [totalCount, setTotalCount] = useState(0);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [totalCount]);

  const loadData = async () => {
    try {
      const savedTotal = await AsyncStorage.getItem('tesbih_total');
      if (savedTotal) {
        setTotalCount(parseInt(savedTotal, 10));
      }
    } catch (error) {
      console.log('Veri yüklenemedi:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('tesbih_total', totalCount.toString());
    } catch (error) {
      console.log('Veri kaydedilemedi:', error);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    const newCount = count + 1;
    setCount(newCount);
    setTotalCount((prev) => prev + 1);
    animateButton();

    if (vibrationEnabled) {
      if (newCount >= target) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (newCount % 33 === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    if (vibrationEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const selectDhikr = (dhikr: DhikrType) => {
    setSelectedDhikr(dhikr);
    setTarget(dhikr.defaultTarget);
    setCount(0);
  };

  const progress = Math.min((count / target) * 100, 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <View style={styles.totalBadge}>
          <Text style={styles.totalLabel}>Toplam Zikir</Text>
          <Text style={styles.totalValue}>{totalCount.toLocaleString()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.vibrationToggle}
          onPress={() => setVibrationEnabled(!vibrationEnabled)}
        >
          <Ionicons 
            name={vibrationEnabled ? "notifications" : "notifications-off"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dhikrSelector}
        contentContainerStyle={styles.dhikrSelectorContent}
      >
        {dhikrTypes.map((dhikr) => (
          <TouchableOpacity
            key={dhikr.id}
            style={[
              styles.dhikrChip,
              {
                backgroundColor: selectedDhikr.id === dhikr.id ? colors.primary : colors.card,
                borderColor: selectedDhikr.id === dhikr.id ? colors.primary : colors.border,
              },
              Shadows.light,
            ]}
            onPress={() => selectDhikr(dhikr)}
          >
            <Text
              style={[
                styles.dhikrChipText,
                { color: selectedDhikr.id === dhikr.id ? '#fff' : colors.text },
              ]}
            >
              {dhikr.turkish}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>
        <View style={styles.textSection}>
          <Text style={[styles.arabicText, { color: colors.primary }]}>
            {selectedDhikr.arabic}
          </Text>
          <Text style={[styles.meaningText, { color: colors.textSecondary }]}>
            {selectedDhikr.meaning}
          </Text>
        </View>

        <View style={styles.counterContainer}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={handlePress}
              activeOpacity={1}
              style={[styles.mainButton, Shadows.premium]}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.buttonGradient}
              >
                <View style={styles.counterDisplay}>
                  <Text style={styles.countText}>{count}</Text>
                  <View style={styles.targetIndicator}>
                    <Text style={styles.targetText}>HEDEF: {target}</Text>
                  </View>
                </View>
                
                {/* Simulated Progress Ring */}
                <View style={[styles.progressRing, { borderColor: 'rgba(255,255,255,0.2)' }]} />
                <View 
                  style={[
                    styles.progressRingFill, 
                    { 
                      borderColor: colors.accent,
                      borderRightColor: progress > 25 ? colors.accent : 'transparent',
                      borderBottomColor: progress > 50 ? colors.accent : 'transparent',
                      borderLeftColor: progress > 75 ? colors.accent : 'transparent',
                    }
                  ]} 
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: colors.card }, Shadows.medium]}
            onPress={handleReset}
          >
            <Ionicons name="refresh" size={28} color={colors.primary} />
            <Text style={[styles.resetText, { color: colors.primary }]}>SIFIRLA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  totalBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  totalValue: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  vibrationToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dhikrSelector: {
    maxHeight: 60,
    marginTop: Spacing.md,
  },
  dhikrSelectorContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    height: 50,
  },
  dhikrChip: {
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    height: 40,
  },
  dhikrChipText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  arabicText: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  meaningText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  counterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterDisplay: {
    alignItems: 'center',
  },
  countText: {
    fontSize: 84,
    fontWeight: '800',
    color: '#fff',
  },
  targetIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: -10,
  },
  targetText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  progressRing: {
    position: 'absolute',
    width: BUTTON_SIZE - 20,
    height: BUTTON_SIZE - 20,
    borderRadius: (BUTTON_SIZE - 20) / 2,
    borderWidth: 2,
  },
  progressRingFill: {
    position: 'absolute',
    width: BUTTON_SIZE - 20,
    height: BUTTON_SIZE - 20,
    borderRadius: (BUTTON_SIZE - 20) / 2,
    borderWidth: 6,
    transform: [{ rotate: '-45deg' }],
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  resetText: {
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: FontSize.sm,
  },
});
