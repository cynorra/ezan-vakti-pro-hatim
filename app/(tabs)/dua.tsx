import { useRef, useState, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import { safeHaptics } from '@/lib/haptics';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, Gradients } from '@/constants/theme';
import { SEOHead } from '@/components/SEOHead';
import { ShareableDuaCard } from '@/components/ShareableDuaCard';
import { dailyDuas, duaCategories, getDailyDua, Dua } from '@/lib/data/duas';
import {
  recordGrowthShare,
  getShareCount,
  getAdFreeRemainingDays,
  formatDuaShareMessage,
  SHARES_PER_REWARD,
} from '@/lib/rewards';

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
  const [isSharingImage, setIsSharingImage] = useState(false);

  // Rewards tracking
  const [shareCount, setShareCount] = useState(0);
  const [adFreeDays, setAdFreeDays] = useState(0);

  const duaOfTheDay = getDailyDua();
  const [targetDuaForCard, setTargetDuaForCard] = useState<Dua>(duaOfTheDay);
  const shareCardRef = useRef<View>(null);

  const loadRewardStatus = useCallback(async () => {
    const count = await getShareCount();
    const remainingDays = await getAdFreeRemainingDays();
    setShareCount(count);
    setAdFreeDays(remainingDays);
  }, []);

  useEffect(() => {
    loadRewardStatus();
  }, [loadRewardStatus]);

  const filteredDualar = selectedCategory === 'all'
    ? dailyDuas
    : dailyDuas.filter((d) => d.category === selectedCategory);

  const handleShareText = async (dua: Dua) => {
    safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const message = formatDuaShareMessage(dua);
      await Share.share({
        message,
        title: dua.title,
      });
      const result = await recordGrowthShare();
      await loadRewardStatus();
      if (result.justUnlocked) {
        safeHaptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.log('Share text error:', error);
    }
  };

  const handleShareAsImage = async (dua: Dua) => {
    safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTargetDuaForCard(dua);
    setIsSharingImage(true);

    // Kısa bir gecikme verip React state'in render olmasını bekliyoruz
    setTimeout(async () => {
      try {
        if (!shareCardRef.current) {
          setIsSharingImage(false);
          return;
        }
        const uri = await captureRef(shareCardRef, { format: 'png', quality: 1 });
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: dua.title,
            UTI: 'public.png',
          });
          const result = await recordGrowthShare();
          await loadRewardStatus();
          if (result.justUnlocked) {
            safeHaptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        } else {
          await handleShareText(dua);
        }
      } catch (error) {
        console.log('Image share error:', error);
        await handleShareText(dua);
      } finally {
        setIsSharingImage(false);
      }
    }, 120);
  };

  const progressInCycle = shareCount % SHARES_PER_REWARD;

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
          {/* Growth & Reward Banner */}
          <View style={[styles.rewardBanner, { backgroundColor: colors.surface }, Shadows.light]}>
            <View style={styles.rewardIconBadge}>
              <Ionicons name="gift" size={20} color="#052F1C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rewardTitle, { color: colors.text }]}>
                {adFreeDays > 0
                  ? t('dua.adFreeActive', { days: adFreeDays })
                  : t('dua.rewardBannerTitle')}
              </Text>
              <Text style={[styles.rewardSub, { color: colors.textSecondary }]}>
                {t('dua.rewardBannerSub')}
              </Text>
              {/* Progress bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${(progressInCycle / SHARES_PER_REWARD) * 100}%`,
                      backgroundColor: '#D4AF37',
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.textMuted }]}>
                {t('dua.rewardProgress', { count: progressInCycle })}
              </Text>
            </View>
          </View>

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
                <TouchableOpacity
                  onPress={() => handleShareAsImage(duaOfTheDay)}
                  style={[styles.shareButtonAction, { backgroundColor: colors.accent + '20' }]}
                >
                  <Ionicons name="image" size={16} color={colors.accent} />
                  <Text style={[styles.shareBtnText, { color: colors.accent }]}>
                    {t('dua.shareImage')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleShareText(duaOfTheDay)}
                  style={[styles.shareButtonAction, { backgroundColor: colors.primary + '15' }]}
                >
                  <Ionicons name="share-social" size={16} color={colors.primary} />
                  <Text style={[styles.shareBtnText, { color: colors.primary }]}>
                    {t('dua.shareText')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Categories Horizontal Scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
            {duaCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCategory(cat.id);
                }}
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

          {/* Dua List */}
          {filteredDualar.map((dua) => (
            <View
              key={dua.id}
              style={[styles.duaCard, { backgroundColor: colors.surface }, Shadows.medium]}
            >
              <TouchableOpacity
                onPress={() => {
                  safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setExpandedId(expandedId === dua.id ? null : dua.id);
                }}
                style={styles.duaHeader}
              >
                <View style={styles.duaTitleRow}>
                  <View style={[styles.titleLine, { backgroundColor: colors.accent }]} />
                  <Text style={[styles.duaTitle, { color: colors.text }]}>{dua.title}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <TouchableOpacity
                    onPress={() => handleShareText(dua)}
                    style={styles.headerShareIcon}
                  >
                    <Ionicons name="share-social-outline" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <Ionicons
                    name={expandedId === dua.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.textMuted}
                  />
                </View>
              </TouchableOpacity>

              {expandedId === dua.id && (
                <View style={styles.duaBody}>
                  {dua.arabic ? (
                    <Text style={[styles.arabicText, { color: colors.primary }]}>{dua.arabic}</Text>
                  ) : null}
                  {dua.transliteration ? (
                    <Text style={[styles.contentText, { color: colors.text }]}>{dua.transliteration}</Text>
                  ) : null}

                  {dua.turkish ? (
                    <View style={[styles.translationBox, { backgroundColor: colors.background }]}>
                      <Text style={[styles.translationLabel, { color: colors.primary }]}>{t('dua.meaningLabel')}</Text>
                      <Text style={[styles.translationText, { color: colors.textSecondary }]}>{dua.turkish}</Text>
                    </View>
                  ) : null}

                  <View style={styles.duaFooter}>
                    <Text style={[styles.sourceText, { color: colors.textMuted }]}>{dua.source}</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => handleShareAsImage(dua)}
                        style={[styles.shareButtonAction, { backgroundColor: colors.accent + '20' }]}
                      >
                        <Ionicons name="image" size={16} color={colors.accent} />
                        <Text style={[styles.shareBtnText, { color: colors.accent }]}>
                          {t('dua.shareImage')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleShareText(dua)}
                        style={[styles.shareButtonAction, { backgroundColor: colors.primary + '15' }]}
                      >
                        <Ionicons name="share-social" size={16} color={colors.primary} />
                        <Text style={[styles.shareBtnText, { color: colors.primary }]}>
                          {t('dua.shareText')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Off-screen Image Card for Dynamic Capture */}
        <ShareableDuaCard ref={shareCardRef} dua={targetDuaForCard} />

        {/* Image generation loading indicator */}
        {isSharingImage && (
          <View style={styles.loadingOverlay}>
            <View style={[styles.loadingBox, { backgroundColor: colors.surface }]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.text }]}>
                Dua Kartı Hazırlanıyor...
              </Text>
            </View>
          </View>
        )}
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
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  rewardIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  rewardSub: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 6,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
    alignSelf: 'flex-end',
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
    flex: 1,
    paddingRight: 8,
  },
  titleLine: {
    width: 3,
    height: 18,
    borderRadius: 2,
  },
  duaTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerShareIcon: {
    padding: 6,
    marginRight: 4,
  },
  duaBody: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  arabicText: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: Spacing.md,
    fontFamily: Platform.OS === 'ios' ? 'Traditional Arabic' : 'serif',
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: Spacing.md,
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
    fontSize: 13.5,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  duaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    flexWrap: 'wrap',
    gap: 8,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  shareButtonAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
    gap: 5,
  },
  shareBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    ...Shadows.premium,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

