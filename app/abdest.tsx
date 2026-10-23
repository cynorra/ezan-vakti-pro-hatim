import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Platform,
  ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, Gradients } from '@/constants/theme';
import { SEOHead } from '@/components/SEOHead';

const STEP_KEYS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function AbdestScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SEOHead
        title="Abdest Nasıl Alınır | Ezan Vakti ve Hatim"
        description="Adım adım abdest alma rehberi. Sünnet ve farzlarıyla doğru abdest nasıl alınır."
        keywords="abdest nasıl alınır, abdestin farzları, abdestin sünnetleri"
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('abdest.title'),
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#ffffff',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: Platform.OS === 'ios' ? 0 : 16 }}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={Gradients.premium} style={styles.header}>
          <Ionicons name="water" size={28} color="#F4D03F" />
          <Text style={styles.headerTitle}>{t('abdest.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('abdest.subtitle')}</Text>
        </LinearGradient>

        {STEP_KEYS.map((num) => (
          <View key={num} style={[styles.stepCard, { backgroundColor: colors.surface }, Shadows.light]}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumberText}>{num}</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.text }]}>{t(`abdest.step${num}`)}</Text>
          </View>
        ))}

        <View style={[styles.noteBox, { backgroundColor: colors.accent + '15' }]}>
          <Ionicons name="information-circle" size={18} color={colors.accent} />
          <Text style={[styles.noteText, { color: colors.textSecondary }]}>{t('abdest.note')}</Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.md },
  header: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: 6,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: FontSize.sm,
    lineHeight: 20,
    fontWeight: '600',
  },
  noteBox: {
    flexDirection: 'row',
    gap: 8,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
