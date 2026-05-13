import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, Gradients } from '@/constants/theme';

interface Dua {
  id: string;
  title: string;
  content: string;
  arabic?: string;
  translation: string;
  source?: string;
  category: 'daily' | 'prophetic' | 'quranic' | 'protection';
}

const DUALAR: Dua[] = [
  {
    id: '1',
    title: 'Yemek Duası',
    category: 'daily',
    content: 'Elhamdülillâhillezî et\'amenâ ve sekânâ ve cealenâ müslimîn.',
    translation: 'Bizi yediren, içiren ve bizi Müslümanlardan kılan Allah\'a hamdolsun.',
    source: 'Ebu Davud, Et\'ime, 52',
  },
  {
    id: '2',
    title: 'Ayetel Kürsi',
    category: 'quranic',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...',
    content: 'Allâhü lâ ilâhe illâ hüvel hayyül kayyûm, lâ te\'huzühû sinetün velâ nevm...',
    translation: 'Allah o Allah\'tır ki, kendisinden başka hiçbir ilah yoktur. Diridir, her şeyi yönetendir...',
    source: 'Bakara Suresi, 255',
  },
  {
    id: '3',
    title: 'Şifa Duası',
    category: 'protection',
    content: 'Ezhibi\'l-be\'se rabbe\'n-nâsi ve\'şfi ente\'ş-şâfî lâ şifâe illâ şifâüke şifâen lâ yüğâdiru sekamâ.',
    translation: 'Bu hastalığı gider ey insanların Rabbi! Şifa ver, çünkü şifa verici sensin...',
    source: 'Buhari, Merda, 20',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'Tümü', icon: 'apps-outline' },
  { id: 'daily', name: 'Günlük', icon: 'sunny-outline' },
  { id: 'quranic', name: 'Kur\'an-ı Kerim', icon: 'book-outline' },
  { id: 'prophetic', name: 'Peygamberimizden', icon: 'heart-outline' },
  { id: 'protection', name: 'Korunma', icon: 'shield-checkmark-outline' },
];

export default function DuaScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredDualar = selectedCategory === 'all' 
    ? DUALAR 
    : DUALAR.filter(d => d.category === selectedCategory);

  const handleShare = async (dua: Dua) => {
    try {
      await Share.share({
        message: `${dua.title}\n\n${dua.content}\n\nAnlamı: ${dua.translation}\n\nKaynak: ${dua.source}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={Gradients.premium} style={styles.header}>
        <Text style={styles.headerTitle}>DUA KİTAPLIĞI</Text>
        <Text style={styles.headerSubtitle}>Müminin Silahı Duadır</Text>
      </LinearGradient>

      {/* Categories Horizontal Scroll */}
      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.categoryItem,
                selectedCategory === cat.id && { backgroundColor: colors.primary }
              ]}
            >
              <Ionicons 
                name={cat.icon as any} 
                size={18} 
                color={selectedCategory === cat.id ? '#fff' : colors.textSecondary} 
              />
              <Text style={[
                styles.categoryText, 
                { color: selectedCategory === cat.id ? '#fff' : colors.textSecondary }
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredDualar.map((dua) => (
          <View 
            key={dua.id} 
            style={[styles.duaCard, { backgroundColor: colors.surface }, Shadows.medium]}
          >
            <TouchableOpacity 
              onPress={() => setExpandedId(expandedId === dua.id ? null : dua.id)}
              style={styles.duaHeader}
            >
              <View style={styles.duaTitleRow}>
                <View style={[styles.titleLine, { backgroundColor: colors.accent }]} />
                <Text style={[styles.duaTitle, { color: colors.text }]}>{dua.title}</Text>
              </View>
              <Ionicons 
                name={expandedId === dua.id ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={colors.textMuted} 
              />
            </TouchableOpacity>

            {(expandedId === dua.id || filteredDualar.length < 3) && (
              <View style={styles.duaBody}>
                {dua.arabic && (
                  <Text style={[styles.arabicText, { color: colors.primary }]}>{dua.arabic}</Text>
                )}
                <Text style={[styles.contentText, { color: colors.text }]}>{dua.content}</Text>
                
                <View style={[styles.translationBox, { backgroundColor: colors.background }]}>
                  <Text style={[styles.translationLabel, { color: colors.primary }]}>ANLAMI</Text>
                  <Text style={[styles.translationText, { color: colors.textSecondary }]}>{dua.translation}</Text>
                </View>

                <View style={styles.duaFooter}>
                  <Text style={[styles.sourceText, { color: colors.textMuted }]}>{dua.source}</Text>
                  <TouchableOpacity onPress={() => handleShare(dua)} style={styles.shareButton}>
                    <Ionicons name="share-social-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
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
  categoryWrapper: {
    marginTop: -25,
    marginBottom: Spacing.md,
  },
  categoryList: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    gap: 8,
    ...Shadows.light,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: Spacing.md,
  },
  duaCard: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  duaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  duaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleLine: {
    width: 3,
    height: 18,
    borderRadius: 2,
  },
  duaTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  duaBody: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  arabicText: {
    fontSize: 26,
    textAlign: 'center',
    lineHeight: 45,
    marginBottom: Spacing.lg,
    fontFamily: Platform.OS === 'ios' ? 'Traditional Arabic' : 'serif',
  },
  contentText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  translationBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  translationLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  translationText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  duaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
