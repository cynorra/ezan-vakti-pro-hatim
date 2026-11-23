import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme, Platform, TouchableOpacity, Share } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import {
  getQuran,
  getSurah,
  getBookmarks,
  toggleBookmark,
  saveLastRead,
  getPrefs,
  savePrefs,
  DEFAULT_PREFS,
  QuranPrefs,
  Position,
} from '@/lib/quran';

const MIN_FONT = 20;
const MAX_FONT = 44;

export default function QuranReaderScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const params = useLocalSearchParams<{ id: string; ayah?: string }>();

  const surahNo = Math.min(114, Math.max(1, parseInt(String(params.id), 10) || 1));
  const startAyah = Math.max(1, parseInt(String(params.ayah ?? '1'), 10) || 1);
  const surah = getSurah(surahNo)!;

  const [prefs, setPrefs] = useState<QuranPrefs>(DEFAULT_PREFS);
  const [marks, setMarks] = useState<Position[]>([]);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    getPrefs().then(setPrefs);
    getBookmarks().then(setMarks);
  }, []);

  const markSet = useMemo(() => new Set(marks.map((m) => `${m.s}:${m.a}`)), [marks]);

  const updatePrefs = (patch: Partial<QuranPrefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    savePrefs(next);
  };

  // The first ayah on screen becomes "last read" (written at most once per change).
  const lastSaved = useRef(0);
  const onViewable = useRef(({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
    const first = viewableItems.find((v) => v.index != null);
    if (first && first.index != null && first.index + 1 !== lastSaved.current) {
      lastSaved.current = first.index + 1;
      saveLastRead({ s: surahNo, a: first.index + 1 });
    }
  }).current;

  const goTo = useCallback(
    (n: number) => {
      if (n < 1 || n > 114) return;
      router.replace({ pathname: '/quran/[id]', params: { id: String(n), ayah: '1' } });
    },
    [router]
  );

  const shareAyah = async (index: number) => {
    const a = surah.v[index];
    try {
      await Share.share({ message: `${a[0]}\n\n${a[1]}\n\n— ${surah.tr} ${index + 1}` });
    } catch {
      /* user cancelled */
    }
  };

  const showBasmala = surahNo !== 1 && surahNo !== 9;
  const basmala = getQuran().basmala;

  const Header = (
    <View style={[styles.surahHeader, { backgroundColor: colors.primary }]}>
      <Text style={styles.surahAr}>{surah.ar}</Text>
      <Text style={styles.surahTr}>{surah.tr}</Text>
      <Text style={styles.surahMeta}>
        {surah.en} · {surah.t === 'M' ? t('quran.meccan', { defaultValue: 'Mekki' }) : t('quran.medinan', { defaultValue: 'Medeni' })} ·{' '}
        {surah.v.length} {t('quran.ayah', { defaultValue: 'Ayet' })}
      </Text>
      {showBasmala && <Text style={[styles.basmala, { fontSize: Math.max(22, prefs.fontSize) }]}>{basmala}</Text>}
    </View>
  );

  const Footer = (
    <View style={styles.footer}>
      <View style={styles.navRow}>
        <TouchableOpacity
          disabled={surahNo <= 1}
          onPress={() => goTo(surahNo - 1)}
          style={[styles.navBtn, { borderColor: colors.border, backgroundColor: colors.surface, opacity: surahNo <= 1 ? 0.4 : 1 }]}
        >
          <Ionicons name="chevron-back" size={18} color={colors.primary} />
          <Text style={[styles.navText, { color: colors.primary }]}>{t('quran.prev', { defaultValue: 'Önceki sure' })}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={surahNo >= 114}
          onPress={() => goTo(surahNo + 1)}
          style={[styles.navBtn, { borderColor: colors.border, backgroundColor: colors.surface, opacity: surahNo >= 114 ? 0.4 : 1 }]}
        >
          <Text style={[styles.navText, { color: colors.primary }]}>{t('quran.next', { defaultValue: 'Sonraki sure' })}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.credit, { color: colors.textMuted }]}>
        {t('quran.credit', {
          defaultValue: 'Arapça metin: Tanzil Projesi (tanzil.net), Osmani. Meal: Elmalılı Muhammed Hamdi Yazır.',
        })}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: surah.tr,
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#ffffff',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: Platform.OS === 'ios' ? 0 : 16 }}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => updatePrefs({ fontSize: Math.max(MIN_FONT, prefs.fontSize - 2) })}
                accessibilityLabel={t('quran.smaller', { defaultValue: 'Yazıyı küçült' })}
              >
                <Text style={styles.headerText}>A-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updatePrefs({ fontSize: Math.min(MAX_FONT, prefs.fontSize + 2) })}
                accessibilityLabel={t('quran.larger', { defaultValue: 'Yazıyı büyüt' })}
              >
                <Text style={[styles.headerText, { fontSize: 20 }]}>A+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updatePrefs({ showTranslation: !prefs.showTranslation })}
                accessibilityLabel={t('quran.translation', { defaultValue: 'Meal' })}
              >
                <Ionicons name={prefs.showTranslation ? 'language' : 'language-outline'} size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <FlatList
        ref={listRef}
        data={surah.v}
        keyExtractor={(_, i) => String(i)}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        contentContainerStyle={styles.list}
        initialNumToRender={Math.min(surah.v.length, startAyah + 8)}
        initialScrollIndex={startAyah > 1 ? Math.min(startAyah - 1, surah.v.length - 1) : undefined}
        onScrollToIndexFailed={({ index, averageItemLength }) => {
          listRef.current?.scrollToOffset({ offset: index * (averageItemLength || 160), animated: false });
        }}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        onViewableItemsChanged={onViewable}
        renderItem={({ item, index }) => {
          const n = index + 1;
          const marked = markSet.has(`${surahNo}:${n}`);
          return (
            <View style={[styles.ayah, { borderColor: colors.border, backgroundColor: n === startAyah && startAyah > 1 ? colors.surface : 'transparent' }]}>
              <View style={styles.ayahBar}>
                <View style={[styles.badge, { borderColor: colors.accent }]}>
                  <Text style={[styles.badgeText, { color: colors.primary }]}>{n}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => shareAyah(index)} hitSlop={10} accessibilityLabel={t('quran.share', { defaultValue: 'Paylaş' })}>
                  <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => setMarks(await toggleBookmark({ s: surahNo, a: n }))}
                  hitSlop={10}
                  style={{ marginLeft: Spacing.md }}
                  accessibilityLabel={t('quran.bookmark', { defaultValue: 'Yer imi' })}
                >
                  <Ionicons name={marked ? 'bookmark' : 'bookmark-outline'} size={21} color={marked ? colors.accent : colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text
                style={[styles.arabic, { color: colors.text, fontSize: prefs.fontSize, lineHeight: prefs.fontSize * 1.9 }]}
                selectable
              >
                {item[0]}
              </Text>
              {prefs.showTranslation && (
                <Text style={[styles.translation, { color: colors.textSecondary }]} selectable>
                  {item[1]}
                </Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingBottom: Spacing.xxl },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16, marginRight: 16 },
  headerText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  surahHeader: { alignItems: 'center', padding: Spacing.lg, marginBottom: Spacing.sm },
  surahAr: { color: '#F4D03F', fontSize: 34 },
  surahTr: { color: '#ffffff', fontSize: FontSize.xl, fontWeight: '700', marginTop: 4 },
  surahMeta: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.xs, marginTop: 4 },
  basmala: { color: '#ffffff', marginTop: Spacing.md, textAlign: 'center' },
  ayah: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: StyleSheet.hairlineWidth },
  ayahBar: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  badge: { minWidth: 32, height: 32, paddingHorizontal: 6, borderRadius: 16, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: FontSize.xs, fontWeight: '700' },
  arabic: { textAlign: 'right', writingDirection: 'rtl' },
  translation: { fontSize: FontSize.md, lineHeight: 24, marginTop: Spacing.sm },
  footer: { padding: Spacing.md },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  navBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, gap: 4 },
  navText: { fontSize: FontSize.sm, fontWeight: '700' },
  credit: { fontSize: FontSize.xs, textAlign: 'center', marginTop: Spacing.lg },
});
