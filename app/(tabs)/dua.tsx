import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';

interface Dua {
  id: string;
  title: string;
  arabic: string;
  turkish: string;
  meaning: string;
  category: string;
}

const dualar: Dua[] = [
  {
    id: '1',
    category: 'Günlük',
    title: 'Sabah Duası',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    turkish: 'Allahümme bike asbahna ve bike emseyna ve bike nahya ve bike nemut ve ileyken-nuşur.',
    meaning: 'Allah’ım! Senin yardımınla sabaha girdik, Senin yardımınla akşama kavuştuk, Senin yardımınla yaşıyoruz, Senin yardımınla ölürüz ve dönüş Sanadır.',
  },
  {
    id: '2',
    category: 'Günlük',
    title: 'Akşam Duası',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    turkish: 'Allahümme bike emseyna ve bike asbahna ve bike nahya ve bike nemut ve ileykel-masir.',
    meaning: 'Allah’ım! Senin yardımınla akşama girdik, Senin yardımınla sabaha kavuştuk, Senin yardımınla yaşıyoruz, Senin yardımınla ölürüz ve dönüş Sanadır.',
  },
  {
    id: '3',
    category: 'Namaz',
    title: 'Sübhaneke',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ',
    turkish: 'Sübhânekellâhümme ve bi hamdik ve tebârekesmük ve teâlâ ceddük ve lâ ilâhe ğayrük.',
    meaning: 'Allah’ım! Sen eksik sıfatlardan pak ve uzaksın. Seni daima böyle tenzih eder ve överim. Senin adın mübarektir. Varlığın her şeyden üstündür. Senden başka ilah yoktur.',
  },
  {
    id: '4',
    category: 'Sıkıntı',
    title: 'Sıkıntı Anında Dua',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    turkish: 'La ilahe illa ente subhaneke inni kuntu minez-zalimin.',
    meaning: 'Senden başka ilah yoktur. Sen her türlü noksanlıktan uzaksın. Şüphesiz ben kendine zulmedenlerden oldum.',
  }
];

const categories = ['Tümü', 'Günlük', 'Namaz', 'Sıkıntı', 'Yemek', 'Yolculuk'];

export default function DuaScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [activeCategory, setActiveCategory] = useState('Tümü');

  const filteredDualar = activeCategory === 'Tümü' 
    ? dualar 
    : dualar.filter(d => d.category === activeCategory);

  const onShare = async (dua: Dua) => {
    try {
      await Share.share({
        message: `${dua.title}\n\n${dua.arabic}\n\n${dua.meaning}\n\nEzan Vakti Pro+ tarafından paylaşıldı.`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>DUALAR VE ZİKİRLER</Text>
      </LinearGradient>

      <View style={styles.categoriesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                { backgroundColor: activeCategory === cat ? colors.primary : colors.card }
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                { color: activeCategory === cat ? '#fff' : colors.text }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {filteredDualar.map(dua => (
          <View key={dua.id} style={[styles.duaCard, { backgroundColor: colors.card }, Shadows.medium]}>
            <View style={styles.duaHeader}>
              <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>{dua.category}</Text>
              </View>
              <TouchableOpacity onPress={() => onShare(dua)}>
                <Ionicons name="share-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.duaTitle, { color: colors.text }]}>{dua.title}</Text>
            <Text style={[styles.arabicText, { color: colors.primary }]}>{dua.arabic}</Text>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <Text style={[styles.turkishText, { color: colors.textSecondary }]}>{dua.turkish}</Text>
            <Text style={[styles.meaningText, { color: colors.text }]}>{dua.meaning}</Text>
          </View>
        ))}
      </ScrollView>
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
    alignItems: 'center',
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  headerTitle: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontWeight: '800',
    letterSpacing: 2,
  },
  categoriesWrapper: {
    marginTop: Spacing.md,
    height: 50,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  duaCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
  duaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  duaTitle: {
    fontSize: FontSize.md,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  arabicText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 40,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  turkishText: {
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  meaningText: {
    fontSize: FontSize.sm,
    lineHeight: 22,
  },
});
