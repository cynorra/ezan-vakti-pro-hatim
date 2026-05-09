import { useState, useEffect } from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
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
      console.log('Ortak hatimler yüklenemedi:', error);
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
      console.log('Hatim detayları yüklenemedi:', error);
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Refresh details
      const details = await hatimService.getHatimDetails(selectedSharedHatim.id);
      setSharedHatimDetails(details);
      alert('Cüz başarıyla alındı!');
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
      // In a real app, this would call hatimService.createHatim
      alert('Yeni hatim başarıyla oluşturuldu! (Simüle edildi)');
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
      console.log('Hatim verisi yüklenemedi:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('hatim_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.log('Hatim geçmişi yüklenemedi:', error);
    }
  };

  const saveProgress = async (newProgress: JuzProgress) => {
    try {
      await AsyncStorage.setItem(
        `hatim_progress_${weekStart}`,
        JSON.stringify(newProgress)
      );
    } catch (error) {
      console.log('Hatim verisi kaydedilemedi:', error);
    }
  };

  const saveHistory = async (newHistory: any[]) => {
    try {
      await AsyncStorage.setItem('hatim_history', JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.log('Hatim geçmişi kaydedilemedi:', error);
    }
  };

  const toggleJuz = (juzNumber: number) => {
    const newProgress = {
      ...progress,
      [juzNumber]: !progress[juzNumber],
    };
    setProgress(newProgress);
    saveProgress(newProgress);
    Haptics.impactAsync(
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'individual' && { borderBottomColor: colors.primary }]} 
          onPress={() => setActiveTab('individual')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'individual' ? colors.primary : colors.textSecondary }]}>
            Bireysel Hatim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'collaborative' && { borderBottomColor: colors.primary }]} 
          onPress={() => setActiveTab('collaborative')}
        >
          <View style={styles.tabWithBadge}>
            <Text style={[styles.tabText, { color: activeTab === 'collaborative' ? colors.primary : colors.textSecondary }]}>
              Ortak Hatim
            </Text>
            <View style={[styles.onlineBadge, { backgroundColor: colors.success }]} />
          </View>
        </TouchableOpacity>
      </View>

      {activeTab === 'individual' ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Progress Header */}
          <View style={[styles.headerCard, { backgroundColor: colors.primary }, Shadows.medium]}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>Haftalık Hatim</Text>
                <Text style={styles.headerSubtitle}>{getWeekDateRange()}</Text>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity 
                  onPress={() => setIsHistoryVisible(true)} 
                  style={[styles.resetButton, { marginRight: Spacing.sm }]}
                >
                  <Ionicons name="list" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={resetProgress} style={styles.resetButton}>
                  <Ionicons name="refresh" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressNumber}>{completedCount}</Text>
                <Text style={styles.progressTotal}>/30</Text>
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Cüz Tamamlandı</Text>
                <View style={[styles.progressBarBg, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${progressPercentage}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressPercent}>%{progressPercentage}</Text>
              </View>
            </View>

            {completedCount === 30 && (
              <TouchableOpacity 
                style={styles.completedBadge}
                onPress={completeHatim}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.completedText}>Hatmi Tamamla ve Kaydet</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.juzGrid}>
            {quranJuzData.map((juz) => (
              <TouchableOpacity
                key={juz.number}
                style={[
                  styles.juzCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: progress[juz.number] ? colors.primary : colors.border,
                    borderWidth: progress[juz.number] ? 2 : 1,
                  },
                  Shadows.light,
                ]}
                onPress={() => toggleJuz(juz.number)}
                onLongPress={() => showJuzDetails(juz)}
              >
                <View style={styles.juzHeader}>
                  <Text
                    style={[
                      styles.juzNumber,
                      { color: progress[juz.number] ? colors.primary : colors.text },
                    ]}
                  >
                    {juz.number}. Cüz
                  </Text>
                  {progress[juz.number] && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  )}
                </View>
                <Text style={[styles.juzName, { color: colors.textSecondary }]} numberOfLines={1}>
                  {juz.name}
                </Text>
                <Text style={[styles.juzSurah, { color: colors.textMuted }]} numberOfLines={1}>
                  {juz.surahs}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.collaborativeHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Devam Eden Ortak Hatimler</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Bir cüz seçerek ortak hatme katkıda bulunabilirsiniz.
            </Text>
          </View>

          {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />}

          {sharedHatims.map((hatim) => (
            <TouchableOpacity 
              key={hatim.id} 
              style={[styles.collabCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.medium]}
              onPress={() => handleOpenSharedHatim(hatim)}
            >
              <View style={styles.collabTop}>
                <View style={styles.collabInfo}>
                  <Text style={[styles.collabTitle, { color: colors.text }]}>{hatim.title}</Text>
                  <View style={styles.collabMeta}>
                    <Ionicons name="people" size={14} color={colors.primary} />
                    <Text style={[styles.collabMetaText, { color: colors.textSecondary }]}>
                      {hatim.participants_count} Katılımcı
                    </Text>
                    <Ionicons name="time-outline" size={14} color={colors.error} style={{ marginLeft: 8 }} />
                    <Text style={[styles.collabMetaText, { color: colors.textSecondary }]}>
                      {new Date(hatim.ends_at).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.collabProgressCircle, { borderColor: colors.primary }]}>
                  <Text style={[styles.collabPercent, { color: colors.primary }]}>
                    %{Math.round((hatim.completed_count / hatim.total_juz) * 100)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.collabProgressBarContainer}>
                <View style={[styles.collabProgressBarBg, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.collabProgressBarFill, 
                      { 
                        backgroundColor: colors.primary, 
                        width: `${(hatim.completed_count / hatim.total_juz) * 100}%` 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.collabProgressText, { color: colors.textMuted }]}>
                  {hatim.completed_count} / {hatim.total_juz} Cüz tamamlandı
                </Text>
              </View>

              <View style={[styles.joinButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.joinButtonText}>Cüz Seç ve Katıl</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity 
            style={[styles.createButton, { borderColor: colors.primary }]}
            onPress={() => setIsCreateModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.createButtonText, { color: colors.primary }]}>Yeni Ortak Hatim Başlat</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Create Hatim Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCreateModalVisible}
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsCreateModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }, Shadows.premium]}>
            <Text style={[styles.modalTitle, { color: colors.text, marginBottom: Spacing.md }]}>Yeni Ortak Hatim</Text>
            <TextInput
              style={[styles.userNameInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border, marginBottom: Spacing.lg }]}
              placeholder="Hatim Başlığı (Örn: Cuma Hatmi)"
              placeholderTextColor={colors.textMuted}
              value={newHatimTitle}
              onChangeText={setNewHatimTitle}
            />
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleCreateHatim}
            >
              <Text style={styles.modalButtonText}>Oluştur</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Shared Hatim Detail / Join Modal */}
      <Modal
        animationType="slide"
        visible={isJoinModalVisible}
        onRequestClose={() => setIsJoinModalVisible(false)}
      >
        <SafeAreaView style={[styles.joinModalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.joinModalHeader, { borderBottomColor: colors.border }]}>
            <View>
              <Text style={[styles.joinModalTitle, { color: colors.text }]}>{selectedSharedHatim?.title}</Text>
              <Text style={[styles.joinModalSub, { color: colors.textSecondary }]}>Cüz Seçimi</Text>
            </View>
            <TouchableOpacity onPress={() => setIsJoinModalVisible(false)}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.userNameContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Adınız (Diğer katılımcılar görebilir):</Text>
            <TextInput
              style={[styles.userNameInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Adınızı giriniz..."
              placeholderTextColor={colors.textMuted}
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          <ScrollView contentContainerStyle={styles.joinJuzGrid}>
            {sharedHatimDetails.map((juz) => (
              <TouchableOpacity
                key={juz.juz_number}
                disabled={juz.is_completed}
                style={[
                  styles.joinJuzCard,
                  { 
                    backgroundColor: juz.is_completed ? colors.border : colors.card,
                    borderColor: juz.is_completed ? colors.border : colors.primary 
                  }
                ]}
                onPress={() => handleJoinJuz(juz.juz_number)}
              >
                <Text style={[styles.joinJuzNumber, { color: juz.is_completed ? colors.textMuted : colors.primary }]}>
                  {juz.juz_number}. Cüz
                </Text>
                {juz.is_completed ? (
                  <Text style={[styles.joinJuzUser, { color: colors.textMuted }]}>{juz.user_name || 'Alındı'}</Text>
                ) : (
                  <Text style={[styles.joinJuzAction, { color: colors.primary }]}>Müsait</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Juz Details Modal (Bireysel) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }, Shadows.premium]}>
            <View style={styles.modalHeaderTitle}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedJuz?.number}. Cüz Detayları
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Başlangıç</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{selectedJuz?.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Sureler</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{selectedJuz?.surahs}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Sayfa Aralığı</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {selectedJuz ? `${((selectedJuz.number - 1) * 20) + 1} - ${selectedJuz.number * 20}` : '-'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: (selectedJuz && progress[selectedJuz.number]) ? colors.error : colors.primary }
              ]}
              onPress={() => {
                if (selectedJuz) {
                  toggleJuz(selectedJuz.number);
                  setIsModalVisible(false);
                }
              }}
            >
              <Text style={styles.modalButtonText}>
                {(selectedJuz && progress[selectedJuz.number]) ? 'Tamamlanmadı Olarak İşaretle' : 'Tamamlandı Olarak İşaretle'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* History Modal */}
      <Modal
        animationType="slide"
        visible={isHistoryVisible}
        onRequestClose={() => setIsHistoryVisible(false)}
      >
        <SafeAreaView style={[styles.historyContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.historyHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.historyTitle, { color: colors.text }]}>Geçmiş Hatimler</Text>
            <TouchableOpacity onPress={() => setIsHistoryVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.historyList}>
            {history.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Ionicons name="book-outline" size={64} color={colors.textMuted} />
                <Text style={[styles.emptyHistoryText, { color: colors.textSecondary }]}>
                  Henüz tamamlanmış hatim bulunmuyor.
                </Text>
              </View>
            ) : (
              history.map((item) => (
                <View 
                  key={item.id} 
                  style={[styles.historyItem, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.light]}
                >
                  <View style={styles.historyItemIcon}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.historyItemContent}>
                    <Text style={[styles.historyItemTitle, { color: colors.text }]}>
                      Hatim Tamamlandı
                    </Text>
                    <Text style={[styles.historyItemDate, { color: colors.textSecondary }]}>
                      Tarih: {new Date(item.date).toLocaleDateString('tr-TR')}
                    </Text>
                    <Text style={[styles.historyItemRange, { color: colors.textMuted }]}>
                      Hafta: {item.weekRange}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineBadge: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  headerCard: {
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerTitle: {
    color: '#fff',
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  resetButton: {
    padding: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.full,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.lg,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressNumber: {
    color: '#fff',
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  progressTotal: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.sm,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressPercent: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  completedText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  juzGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.sm,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  juzCard: {
    width: '31%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  juzHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  juzNumber: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  juzName: {
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
  juzSurah: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  modalHeaderTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
  },
  modalBody: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  modalButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  historyContainer: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  historyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  historyList: {
    flex: 1,
    padding: Spacing.md,
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: Spacing.md,
  },
  emptyHistoryText: {
    fontSize: FontSize.md,
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
  },
  historyItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  historyItemDate: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  historyItemRange: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  collaborativeHeader: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  collabCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  collabTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collabInfo: {
    flex: 1,
  },
  collabTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  collabMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collabMetaText: {
    fontSize: FontSize.xs,
    marginLeft: 4,
  },
  collabProgressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  collabPercent: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  collabProgressBarContainer: {
    marginTop: Spacing.lg,
  },
  collabProgressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  collabProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  collabProgressText: {
    fontSize: FontSize.xs,
    marginTop: Spacing.sm,
  },
  joinButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  createButton: {
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  createButtonText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  joinModalContainer: {
    flex: 1,
  },
  joinModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  joinModalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  joinModalSub: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  userNameContainer: {
    padding: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  userNameInput: {
    height: 50,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
  },
  joinJuzGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.sm,
    gap: Spacing.sm,
    paddingBottom: 40,
  },
  joinJuzCard: {
    width: '31%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  joinJuzNumber: {
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  joinJuzUser: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  joinJuzAction: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
  },
});
