import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Pressable,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { SEOHead } from '@/components/SEOHead';
import { safeHaptics } from '@/lib/haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, Gradients } from '@/constants/theme';
import { quranJuzData, Juz } from '@/lib/data/quran-juz';
import { hatimService, SharedHatim, SharedHatimJuz } from '@/lib/services/hatim-service';

interface JuzProgress {
  [key: number]: boolean;
}

interface HatimHistoryItem {
  id: string;
  date: string;
  weekRange: string;
}

export default function HatimScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [progress, setProgress] = useState<JuzProgress>({});
  const [weekStart, setWeekStart] = useState<string>('');
  const [selectedJuz, setSelectedJuz] = useState<Juz | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [history, setHistory] = useState<HatimHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'individual' | 'collaborative'>('individual');

  // Shared Hatim State
  const [sharedHatims, setSharedHatims] = useState<SharedHatim[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSharedHatim, setSelectedSharedHatim] = useState<SharedHatim | null>(null);
  const [sharedHatimDetails, setSharedHatimDetails] = useState<SharedHatimJuz[]>([]);
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    initializeWeek();
    loadHistory();
    loadSharedHatims();
  }, []);

  useEffect(() => {
    if (weekStart) {
      loadProgress();
    }
  }, [weekStart]);

  const loadSharedHatims = async () => {
    setLoading(true);
    try {
      const data = await hatimService.getSharedHatims();
      setSharedHatims(data);
    } catch (error) {
      console.log('Shared hatims failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSharedHatim = async (hatim: SharedHatim) => {
    setSelectedSharedHatim(hatim);
    setLoading(true);
    try {
      const details = await hatimService.getHatimDetails(hatim.id);
      setSharedHatimDetails(details);
      setIsJoinModalVisible(true);
    } catch (error) {
      console.log('Hatim details failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinJuz = async (juzNumber: number) => {
    if (!selectedSharedHatim || !userName.trim()) {
      alert('Lütfen adınızı giriniz.');
      return;
    }

    try {
      await hatimService.joinHatim(selectedSharedHatim.id, juzNumber, userName);
      safeHaptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const details = await hatimService.getHatimDetails(selectedSharedHatim.id);
      setSharedHatimDetails(details);
    } catch (error) {
      alert('Bir hata oluştu.');
    }
  };

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newHatimTitle, setNewHatimTitle] = useState('');

  const handleCreateHatim = async () => {
    if (!newHatimTitle.trim()) {
      alert('Lütfen bir başlık giriniz.');
      return;
    }

    try {
      const endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await hatimService.createSharedHatim(newHatimTitle, '', endsAt);
      alert('Yeni hatim başarıyla oluşturuldu!');
      setIsCreateModalVisible(false);
      setNewHatimTitle('');
      loadSharedHatims();
    } catch (error) {
      alert('Bir hata oluştu.');
    }
  };

  const initializeWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    const weekStartStr = monday.toISOString().split('T')[0];
    setWeekStart(weekStartStr);
  };

  const loadProgress = async () => {
    if (!weekStart) return;
    try {
      const savedProgress = await AsyncStorage.getItem(`hatim_progress_${weekStart}`);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        setProgress({});
      }
    } catch (error) {
      console.log('Progress load error:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('hatim_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.log('History load error:', error);
    }
  };

  const saveProgress = async (newProgress: JuzProgress) => {
    try {
      await AsyncStorage.setItem(
        `hatim_progress_${weekStart}`,
        JSON.stringify(newProgress)
      );
    } catch (error) {
      console.log('Progress save error:', error);
    }
  };

  const saveHistory = async (newHistory: any[]) => {
    try {
      await AsyncStorage.setItem('hatim_history', JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.log('History save error:', error);
    }
  };

  const toggleJuz = (juzNumber: number) => {
    const newProgress = {
      ...progress,
      [juzNumber]: !progress[juzNumber],
    };
    setProgress(newProgress);
    saveProgress(newProgress);
    safeHaptics.impactAsync(
      newProgress[juzNumber]
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light
    );
  };

  const showJuzDetails = (juz: Juz) => {
    setSelectedJuz(juz);
    setIsModalVisible(true);
  };

  const resetProgress = () => {
    setProgress({});
    saveProgress({});
    safeHaptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const completeHatim = () => {
    const newHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weekRange: getWeekDateRange(),
    };
    const newHistory = [newHistoryItem, ...history];
    saveHistory(newHistory);
    setProgress({});
    saveProgress({});
    safeHaptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Tebrikler! Hatminiz kaydedildi.');
  };

  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / 30) * 100);

  const getWeekDateRange = () => {
    if (!weekStart) return '';
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const formatDate = (date: Date) =>
      `${date.getDate()}/${date.getMonth() + 1}`;
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <>
      <SEOHead 
        title="Ortak Hatim | Ezan Vakti ve Hatim"
        description="Türkiye'nin en gelişmiş dijital ortak hatim platformu. Cüzünüzü alın, binlerce kişiyle aynı anda hatim indirin."
        keywords="ortak hatim, hatim cüz, online hatim, kuran hatmi, ramazan hatmi"
        schema={{
          "@context": "https://schema.org",
          "@type": "CommunityHealth",
          "name": "Ortak Hatim Platformu",
          "description": "Kullanıcıların cüz alarak birlikte Kuran hatmi yapabildiği topluluk etkinliği."
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Tab Bar */}
      <View style={[styles.tabWrapper, { backgroundColor: colors.surface }, Shadows.glass]}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'individual' && styles.tabItemActive]} 
          onPress={() => setActiveTab('individual')}
        >
          <Ionicons 
            name="person" 
            size={18} 
            color={activeTab === 'individual' ? colors.primary : colors.textMuted} 
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'individual' ? colors.primary : colors.textMuted }]}>
            {t('hatim.individual')}
          </Text>
          {activeTab === 'individual' && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'collaborative' && styles.tabItemActive]} 
          onPress={() => setActiveTab('collaborative')}
        >
          <View style={styles.tabIconGroup}>
            <Ionicons 
              name="people" 
              size={18} 
              color={activeTab === 'collaborative' ? colors.primary : colors.textMuted} 
            />
            <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
          </View>
          <Text style={[styles.tabLabel, { color: activeTab === 'collaborative' ? colors.primary : colors.textMuted }]}>
            {t('hatim.collaborative')}
          </Text>
          {activeTab === 'collaborative' && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'individual' ? (
          <>
            {/* Progress HypeFrame */}
            <LinearGradient colors={Gradients.premium} style={[styles.progressCard, Shadows.premium]}>
              <View style={styles.progressHeader}>
                <View>
                  <Text style={styles.progressTitle}>{t('hatim.weeklyHatim')}</Text>
                  <Text style={styles.progressDates}>{getWeekDateRange()}</Text>
                </View>
                <View style={styles.headerActionGroup}>
                  <TouchableOpacity onPress={() => setIsHistoryVisible(true)} style={styles.circleAction}>
                    <Ionicons name="calendar-sharp" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={resetProgress} style={styles.circleAction}>
                    <Ionicons name="refresh-sharp" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.progressStats}>
                <View style={styles.progressRingWrapper}>
                  <Text style={styles.ringValue}>{completedCount}</Text>
                  <Text style={styles.ringTotal}>/30</Text>
                </View>
                <View style={styles.statsRight}>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarBg, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                      <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                    </View>
                    <Text style={styles.percentText}>%{progressPercentage} {t('hatim.completed')}</Text>
                  </View>
                  {completedCount === 30 && (
                    <TouchableOpacity style={styles.completeBtn} onPress={completeHatim}>
                      <Text style={styles.completeBtnText}>{t('hatim.completeHatimBtn')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </LinearGradient>

            {/* Juz Grid */}
            <View style={styles.gridContainer}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('hatim.juzSelection')}</Text>
              <View style={styles.juzGrid}>
                {quranJuzData.map((juz) => (
                  <TouchableOpacity
                    key={juz.number}
                    onPress={() => toggleJuz(juz.number)}
                    onLongPress={() => showJuzDetails(juz)}
                    style={[
                      styles.juzBox,
                      { backgroundColor: progress[juz.number] ? colors.primary : colors.surface },
                      progress[juz.number] ? Shadows.medium : Shadows.light
                    ]}
                  >
                    <Text style={[styles.juzNum, { color: progress[juz.number] ? '#fff' : colors.primary }]}>
                      {juz.number}
                    </Text>
                    <Text style={[styles.juzName, { color: progress[juz.number] ? 'rgba(255,255,255,0.7)' : colors.textMuted }]}>
                      {juz.name.split(' ')[0]}
                    </Text>
                    {progress[juz.number] && (
                      <Ionicons name="checkmark-circle" size={14} color={colors.accent} style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.collaborativeSection}>
            <View style={styles.collabHeader}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('hatim.activeHatims')}</Text>
              <TouchableOpacity 
                style={[styles.createBtn, { backgroundColor: colors.primary }]}
                onPress={() => setIsCreateModalVisible(true)}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.createBtnText}>{t('hatim.startNew')}</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
            ) : sharedHatims.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={64} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('hatim.noActiveHatim')}</Text>
              </View>
            ) : (
              sharedHatims.map((hatim) => (
                <TouchableOpacity
                  key={hatim.id}
                  style={[styles.collabCard, { backgroundColor: colors.surface }, Shadows.medium]}
                  onPress={() => handleOpenSharedHatim(hatim)}
                >
                  <View style={styles.collabCardTop}>
                    <Text style={[styles.collabTitle, { color: colors.text }]}>{hatim.title}</Text>
                    <View style={[styles.participantBadge, { backgroundColor: colors.primary + '10' }]}>
                      <Ionicons name="people" size={12} color={colors.primary} />
                      <Text style={[styles.participantText, { color: colors.primary }]}>{hatim.participants_count}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.collabProgress}>
                    <View style={[styles.progressBarBg, { backgroundColor: colors.border, height: 6 }]}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { 
                            backgroundColor: colors.primary, 
                            width: `${(hatim.completed_count / hatim.total_juz) * 100}%` 
                          }
                        ]} 
                      />
                    </View>
                    <View style={styles.collabStats}>
                      <Text style={[styles.collabStatText, { color: colors.textSecondary }]}>
                        {hatim.completed_count} / {hatim.total_juz} Cüz
                      </Text>
                      <Text style={[styles.collabStatText, { color: colors.primary, fontWeight: '700' }]}>
                        %{Math.round((hatim.completed_count / hatim.total_juz) * 100)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Jüz Detay Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }, Shadows.premium]}>
            <View style={[styles.modalHeader, { backgroundColor: colors.primary }]}>
              <Text style={styles.modalTitle}>{selectedJuz?.number}. Cüz Detayları</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Başlangıç Suresi:</Text>
                <Text style={[styles.detailValue, { color: colors.primary }]}>{selectedJuz?.startSurah}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Sayfalar:</Text>
                <Text style={styles.detailValue}>{selectedJuz?.pages}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>İçerdiği Sureler:</Text>
                <Text style={[styles.detailValue, { fontSize: 10, flex: 1, textAlign: 'right' }]}>{selectedJuz?.surahs}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ortak Hatim Jüz Seçim Modal */}
      <Modal visible={isJoinModalVisible} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalFullHeader}>
            <TouchableOpacity onPress={() => setIsJoinModalVisible(false)} style={styles.closeBtn}>
              <Ionicons name="chevron-back" size={28} color={colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.modalFullTitle, { color: colors.text }]}>{selectedSharedHatim?.title}</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.userNameSection}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Katılımcı Adı</Text>
            <TextInput
              style={[styles.nameInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Adınızı yazınız..."
              placeholderTextColor={colors.textMuted}
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          <ScrollView contentContainerStyle={styles.juzListContent}>
            <View style={styles.juzGrid}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => {
                const juzDetail = sharedHatimDetails.find(d => d.juz_number === num);
                const isTaken = !!juzDetail;
                return (
                  <TouchableOpacity
                    key={num}
                    onPress={() => !isTaken && handleJoinJuz(num)}
                    disabled={isTaken}
                    style={[
                      styles.juzBox,
                      { 
                        backgroundColor: isTaken ? colors.border : colors.surface,
                        opacity: isTaken ? 0.6 : 1
                      }
                    ]}
                  >
                    <Text style={[styles.juzNum, { color: isTaken ? colors.textMuted : colors.primary }]}>{num}</Text>
                    {isTaken ? (
                      <Text style={styles.takenText} numberOfLines={1}>{juzDetail.user_name}</Text>
                    ) : (
                      <Text style={[styles.juzAction, { color: colors.success }]}>AL</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Yeni Hatim Başlat Modal */}
      <Modal visible={isCreateModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, padding: 0 }, Shadows.premium]}>
            <View style={[styles.modalHeader, { backgroundColor: colors.primary }]}>
              <Text style={styles.modalTitle}>Yeni Ortak Hatim</Text>
              <TouchableOpacity onPress={() => setIsCreateModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{ padding: Spacing.lg }}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Hatim Başlığı</Text>
              <TextInput
                style={[styles.nameInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Örn: Ramazan Hatmi"
                value={newHatimTitle}
                onChangeText={setNewHatimTitle}
                autoFocus
              />
              <TouchableOpacity 
                style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                onPress={handleCreateHatim}
              >
                <Text style={styles.submitBtnText}>BAŞLAT</Text>
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
  tabWrapper: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: 8,
  },
  tabItemActive: {
    // Optional active state style
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '60%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabIconGroup: {
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
  },
  progressCard: {
    margin: Spacing.md,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  progressTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  progressDates: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  headerActionGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  circleAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  progressRingWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  ringValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  ringTotal: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: -4,
  },
  statsRight: {
    flex: 1,
  },
  progressBarContainer: {
    marginBottom: Spacing.md,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  percentText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.8,
  },
  completeBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  completeBtnText: {
    color: Colors.light.primary,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  gridContainer: {
    padding: Spacing.md,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
    marginLeft: 4,
  },
  juzGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  juzBox: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  juzNum: {
    fontSize: 18,
    fontWeight: '800',
  },
  juzName: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  collaborativeSection: {
    padding: Spacing.md,
  },
  collabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  collabCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
  collabCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  collabTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    marginRight: Spacing.md,
  },
  participantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  participantText: {
    fontSize: 12,
    fontWeight: '700',
  },
  collabProgress: {
    marginTop: Spacing.sm,
  },
  collabStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  collabStatText: {
    fontSize: 11,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    opacity: 0.5,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  modalBody: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontWeight: '600',
    opacity: 0.6,
  },
  detailValue: {
    fontWeight: '800',
  },
  modalContainer: {
    flex: 1,
  },
  modalFullHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    height: 60,
  },
  modalFullTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  userNameSection: {
    padding: Spacing.lg,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nameInput: {
    height: 50,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    fontSize: 16,
  },
  juzListContent: {
    padding: Spacing.md,
  },
  takenText: {
    fontSize: 8,
    fontWeight: '600',
    width: '100%',
    textAlign: 'center',
    marginTop: 4,
  },
  juzAction: {
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  },
  submitBtn: {
    height: 54,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
  },
  closeBtn: {
    padding: 8,
  },
});
