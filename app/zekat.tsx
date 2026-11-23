import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Platform,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, Gradients } from '@/constants/theme';
import { SEOHead } from '@/components/SEOHead';
import { InlineBanner } from '@/components/InlineBanner';

const ZEKAT_RATE = 0.025;

interface FieldConfig {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
}

const FIELDS: FieldConfig[] = [
  { key: 'cash', icon: 'cash-outline', labelKey: 'zekat.cash' },
  { key: 'gold', icon: 'diamond-outline', labelKey: 'zekat.gold' },
  { key: 'silver', icon: 'ellipse-outline', labelKey: 'zekat.silver' },
  { key: 'trade', icon: 'briefcase-outline', labelKey: 'zekat.trade' },
  { key: 'debt', icon: 'remove-circle-outline', labelKey: 'zekat.debt' },
];

export default function ZekatScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [values, setValues] = useState<Record<string, string>>({});

  const totals = useMemo(() => {
    const num = (k: string) => parseFloat(values[k]?.replace(',', '.') || '0') || 0;
    const wealth = num('cash') + num('gold') + num('silver') + num('trade') - num('debt');
    const zekat = wealth > 0 ? wealth * ZEKAT_RATE : 0;
    return { wealth: Math.max(wealth, 0), zekat };
  }, [values]);

  // Amounts are entered in the user's own currency, so only Turkish shows a symbol.
  const formatCurrency = (n: number) => {
    let formatted: string;
    try {
      formatted = n.toLocaleString(i18n.language, { maximumFractionDigits: 2 });
    } catch {
      formatted = n.toFixed(2);
    }
    return i18n.language.startsWith('tr') ? `${formatted} ₺` : formatted;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SEOHead
        title="Zekat Hesaplama | Ezan Vakti ve Hatim"
        description="Nakit, altın, gümüş ve ticari mal varlığınıza göre zekat miktarınızı kolayca hesaplayın."
        keywords="zekat hesaplama, zekat nisap, zekat miktarı"
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('zekat.title'),
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

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <LinearGradient colors={Gradients.premium} style={[styles.resultCard, Shadows.premium]}>
            <Text style={styles.resultLabel}>{t('zekat.amountDue')}</Text>
            <Text style={styles.resultValue}>{formatCurrency(totals.zekat)}</Text>
            <Text style={styles.resultSub}>
              {t('zekat.wealthBase')}: {formatCurrency(totals.wealth)}
            </Text>
          </LinearGradient>

          <View style={[styles.infoBox, { backgroundColor: colors.primary + '10' }]}>
            <Ionicons name="information-circle" size={18} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>{t('zekat.nisabInfo')}</Text>
          </View>

          {FIELDS.map((field) => (
            <View key={field.key} style={[styles.fieldCard, { backgroundColor: colors.surface }, Shadows.light]}>
              <View style={[styles.fieldIconWrapper, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name={field.icon} size={20} color={colors.primary} />
              </View>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>{t(field.labelKey)}</Text>
              <TextInput
                style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                value={values[field.key] || ''}
                onChangeText={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
              />
              {i18n.language.startsWith('tr') ? (
                <Text style={[styles.fieldCurrency, { color: colors.textMuted }]}>₺</Text>
              ) : null}
            </View>
          ))}

          <View style={{ height: 60 }} />
          <InlineBanner />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.md },
  resultCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  resultValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    marginTop: 6,
  },
  resultSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 6,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 8,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  fieldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  fieldIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldLabel: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  fieldInput: {
    width: 100,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlign: 'right',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  fieldCurrency: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});
