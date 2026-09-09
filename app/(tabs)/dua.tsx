import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, Gradients } from '@/constants/theme';
import { SEOHead } from '@/components/SEOHead';
import { ShareableDuaCard } from '@/components/ShareableDuaCard';
import { dailyDuas, duaCategories, getDailyDua, Dua } from '@/lib/data/duas';
import { recordGrowthShare } from '@/lib/rewards';

const CATEGORY_ICONS: Record<string, string> = {
  all: 'apps-outline',
  daily: 'sunny-outline',
  worship: 'heart-outline',
  protection: 'shield-checkmark-outline',
  family: 'people-outline',
  other: 'ellipsis-horizontal-outline',
};

export default function DuaScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const duaOfTheDay = getDailyDua();
  const shareCardRef = useRef<View>(null);

  const filteredDualar = selectedCategory === 'all'
    ? dailyDuas
    : dailyDuas.filter((d) => d.category === selectedCategory);

  const handleShare = async (dua: Dua) => {
    try {
      await Share.share({
        message: t('dua.shareMessage', {
          title: dua.title,
          transliteration: dua.transliteration,
          meaning: dua.turkish,
          source: dua.source,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Günün duasını marka kartlı görsel olarak yakalayıp paylaşır (WhatsApp durumu,
  // Instagram/TikTok hikayesi gibi sadece görsel kabul eden hedefler için).
  const handleShareAsImage = async () => {
    try {
      const uri = await captureRef(shareCardRef, { format: 'png', quality: 1 });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: duaOfTheDay.title });
        await recordGrowthShare();
      } else {
        await handleShare(duaOfTheDay);
      }
    } catch (error) {
      console.log('Image share error:', error);
      await handleShare(duaOfTheDay);
    }
  };

  return (
    <>
      <SEOHead
        title="Dua Kitaplığı | Ezan Vakti ve Hatim"
        description="Kur'an-ı Kerim'den ve Peygamber Efendimizden günlük dualar. Şifa, korunma, rızık ve yemek duaları Türkçe anlamlarıyla."
        keywords="dualar, günlük dualar, şifa duası, peygamber duaları, kuran duaları, ayetel kürsi"
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={Gradients.premium} style={styles.header}>
          <Text style={styles.headerTitle}>{t('dua.headerTitle')}</Text>
          <Text style={styles.headerSubtitle}>{t('dua.headerSubtitle')}</Text>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Günün Duası */}
          <View style={[styles.featuredCard, { backgroundColor: colors.surface }, Shadows.medium]}>
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color="#052F1C" />
              <Text style={styles.featuredBadgeText}>{t('dua.featuredBadge')}</Text>
            </View>
            <Text style={[styles.duaTitle, { color: colors.text, marginTop: Spacing.sm }]}>
              {duaOfTheDay.title}
            </Text>
            <Text style={[styles.arabicText, { color: colors.primary }]}>{duaOfTheDay.arabic}</Text>
            <Text style={[styles.contentText, { color: colors.text }]}>{duaOfTheDay.transliteration}</Text>
            <View style={[styles.translationBox, { backgroundColor: colors.background }]}>
              <Text style={[styles.translationLabel, { color: colors.primary }]}>{t('dua.meaningLabel')}</Text>
              <Text style={[styles.translationText, { color: colors.textSecondary }]}>{duaOfTheDay.turkish}</Text>
            </View>
            <View style={styles.duaFooter}>
              <Text style={[styles.sourceText, { color: colors.textMuted }]}>{duaOfTheDay.source}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity onPress={handleShareAsImage} style={[styles.shareButton, { backgroundColor: colors.accent + '20' }]}>
                  <Ionicons name="image-outline" size={20} color={colors.accent} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleShare(duaOfTheDay)} style={styles.shareButton}>
                  <Ionicons name="share-social-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <ShareableDuaCard ref={shareCardRef} dua={duaOfTheDay} />

          {/* Categories Horizontal Scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
            {duaCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryItem,
                  { backgroundColor: colors.surface },
                  selectedCategory === cat.id && { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons
                  name={CATEGORY_ICONS[cat.id] as any}
                  size={18}
                  color={selectedCategory === cat.id ? '#fff' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.categoryText,
                    { color: selectedCategory === cat.id ? '#fff' : colors.textSecondary },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

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
                  name={expandedId === dua.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>

              {expandedId === dua.id && (
                <View style={styles.duaBody}>
                  <Text style={[styles.arabicText, { color: colors.primary }]}>{dua.arabic}</Text>
                  <Text style={[styles.contentText, { color: colors.text }]}>{dua.transliteration}</Text>

                  <View style={[styles.translationBox, { backgroundColor: colors.background }]}>
                    <Text style={[styles.translationLabel, { color: colors.primary }]}>{t('dua.meaningLabel')}</Text>
                    <Text style={[styles.translationText, { color: colors.textSecondary }]}>{dua.turkish}</Text>
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
  content: {
    paddingHorizontal: Spacing.md,
    marginTop: -25,
  },
  featuredCard: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#D4AF37',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  featuredBadgeText: {
    color: '#052F1C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  categoryList: {
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
