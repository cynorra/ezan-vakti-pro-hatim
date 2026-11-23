import { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, useColorScheme, Platform, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
import { getQuran, getJuzStarts, getLastRead, getBookmarks, getSurah, Position } from '@/lib/quran';

type Tab = 'surah' | 'juz' | 'marks';

export default function QuranIndexScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const [tab, setTab] = useState<Tab>('surah');
  const [query, setQuery] = useState('');
  const [last, setLast] = useState<Position | null>(null);
  const [marks, setMarks] = useState<Position[]>([]);

  useFocusEffect(
    useCallback(() => {
      getLastRead().then(setLast);
      getBookmarks().then(setMarks);
    }, [])
  );

  const surahs = getQuran().surahs;
  const juzStarts = useMemo(() => getJuzStarts(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        String(s.n) === q ||
        s.tr.toLowerCase().includes(q) ||
        s.en.toLowerCase().includes(q) ||
        s.ar.includes(query.trim())
    );
  }, [query, surahs]);

  const open = (s: number, a = 1) => router.push({ pathname: '/quran/[id]', params: { id: String(s), ayah: String(a) } });

  const lastSurah = last ? getSurah(last.s) : undefined;

  const TabButton = ({ id, label }: { id: Tab; label: string }) => (
    <TouchableOpacity
      onPress={() => setTab(id)}
      style={[styles.tab, tab === id && { backgroundColor: colors.primary }]}
      accessibilityRole="tab"
      accessibilityState={{ selected: tab === id }}
    >
      <Text style={[styles.tabText, { color: tab === id ? '#fff' : colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('quran.title', { defaultValue: "Kur'an-ı Kerim" }),
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

      {lastSurah && last && (
        <TouchableOpacity
          onPress={() => open(last.s, last.a)}
          style={[styles.resume, { backgroundColor: colors.primary }, Shadows.light]}
          accessibilityRole="button"
        >
          <Ionicons name="book" size={22} color={colors.accent} />
          <View style={{ flex: 1, marginLeft: Spacing.sm }}>
            <Text style={styles.resumeLabel}>{t('quran.resume', { defaultValue: 'Kaldığın yerden devam et' })}</Text>
            <Text style={styles.resumeTitle}>
              {lastSurah.tr} · {t('quran.ayah', { defaultValue: 'Ayet' })} {last.a}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      <View style={[styles.tabs, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TabButton id="surah" label={t('quran.surahs', { defaultValue: 'Sureler' })} />
        <TabButton id="juz" label={t('quran.juz', { defaultValue: 'Cüzler' })} />
        <TabButton id="marks" label={t('quran.bookmarks', { defaultValue: 'Yer İmleri' })} />
      </View>

      {tab === 'surah' && (
        <>
          <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('quran.search', { defaultValue: 'Sure ara (isim veya numara)' })}
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(s) => String(s.n)}
            contentContainerStyle={styles.list}
            initialNumToRender={20}
            renderItem={({ item: s }) => (
              <TouchableOpacity
                onPress={() => open(s.n)}
                style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={[styles.badge, { borderColor: colors.accent }]}>
                  <Text style={[styles.badgeText, { color: colors.primary }]}>{s.n}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>{s.tr}</Text>
                  <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                    {s.en} · {s.t === 'M' ? t('quran.meccan', { defaultValue: 'Mekki' }) : t('quran.medinan', { defaultValue: 'Medeni' })} ·{' '}
                    {s.v.length} {t('quran.ayah', { defaultValue: 'Ayet' })}
                  </Text>
                </View>
                <Text style={[styles.arName, { color: colors.primary }]}>{s.ar}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {tab === 'juz' && (
        <FlatList
          data={juzStarts}
          keyExtractor={(j) => String(j.juz)}
          contentContainerStyle={styles.list}
          renderItem={({ item: j }) => (
            <TouchableOpacity
              onPress={() => open(j.surah, j.ayah)}
              style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={[styles.badge, { borderColor: colors.accent }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>{j.juz}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>
                  {t('quran.juzOne', { defaultValue: 'Cüz' })} {j.juz}
                </Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                  {getSurah(j.surah)?.tr} {j.ayah}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        />
      )}

      {tab === 'marks' && (
        <FlatList
          data={marks}
          keyExtractor={(m) => `${m.s}:${m.a}`}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.textSecondary }]}>
              {t('quran.noBookmarks', { defaultValue: 'Henüz yer imi yok. Okurken bir ayetin yer imi simgesine dokunun.' })}
            </Text>
          }
          renderItem={({ item: m }) => {
            const s = getSurah(m.s);
            return (
              <TouchableOpacity
                onPress={() => open(m.s, m.a)}
                style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Ionicons name="bookmark" size={22} color={colors.accent} style={{ marginRight: Spacing.sm }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, { color: colors.text }]}>
                    {s?.tr} · {m.a}
                  </Text>
                  <Text numberOfLines={1} style={[styles.rowSub, { color: colors.textSecondary }]}>
                    {s?.v[m.a - 1]?.[1]}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  resume: { flexDirection: 'row', alignItems: 'center', margin: Spacing.md, marginBottom: 0, padding: Spacing.md, borderRadius: BorderRadius.lg },
  resumeLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.xs },
  resumeTitle: { color: '#fff', fontSize: FontSize.md, fontWeight: '700', marginTop: 2 },
  tabs: { flexDirection: 'row', margin: Spacing.md, padding: 4, borderRadius: BorderRadius.lg, borderWidth: 1 },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.md },
  tabText: { fontSize: FontSize.sm, fontWeight: '600' },
  search: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.md, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1 },
  searchInput: { flex: 1, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm, fontSize: FontSize.md },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, marginBottom: Spacing.sm, borderRadius: BorderRadius.lg, borderWidth: 1 },
  badge: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  badgeText: { fontSize: FontSize.sm, fontWeight: '700' },
  rowTitle: { fontSize: FontSize.md, fontWeight: '700' },
  rowSub: { fontSize: FontSize.xs, marginTop: 2 },
  arName: { fontSize: FontSize.xl, marginLeft: Spacing.sm },
  empty: { textAlign: 'center', marginTop: Spacing.xl, fontSize: FontSize.md },
});
