import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, useColorScheme, Switch, FlatList, AppState, Linking, Share, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
import Constants from 'expo-constants';
import { PLAY_STORE_URL } from '@/lib/share';
import { openPlayStoreReview } from '@/lib/reviewPrompt';
import { CALCULATION_METHODS, CALCULATION_METHOD_IDS, CalculationMethodId } from '@/lib/prayer-times';
import { playTestEzanSound } from '@/lib/notifications';
import {
  getLocationPermissionState,
  openAppSettings,
  type LocationPermissionState,
  type MethodSetting,
} from '@/lib/location-settings';

const FEEDBACK_EMAIL = 'eren.gp54@gmail.com';

const LANGUAGES = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'bs', name: 'Bosanski', flag: '🇧🇦' },
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'uz', name: "O'zbek tili", flag: '🇺🇿' },
  { code: 'kk', name: 'Қазақ тілі', flag: '🇰🇿' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  methodSetting: MethodSetting;
  /** The method actually in use (what 'auto' resolved to for the current location). */
  resolvedMethod: CalculationMethodId;
  onChangeMethod: (setting: MethodSetting) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  notificationsEnabled,
  onToggleNotifications,
  methodSetting,
  resolvedMethod,
  onChangeMethod,
}) => {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [ezanSound, setEzanSound] = useState('Hafif Bildirim');
  const [reminderTime, setReminderTime] = useState('15 dk önce');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showMethodPicker, setShowMethodPicker] = useState(false);
  const [locationPermission, setLocationPermission] = useState<LocationPermissionState>('undetermined');

  // Re-check when the modal opens and when returning from the system settings.
  useEffect(() => {
    if (!visible) return;
    getLocationPermissionState().then(setLocationPermission);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') getLocationPermissionState().then(setLocationPermission);
    });
    return () => sub.remove();
  }, [visible]);
  const [prayerNotifications, setPrayerNotifications] = useState({
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const sound = await AsyncStorage.getItem('ezan_sound');
      const reminder = await AsyncStorage.getItem('reminder_time');
      const prayers = await AsyncStorage.getItem('prayer_notifications');
      if (sound) setEzanSound(sound);
      if (reminder) setReminderTime(reminder);
      if (prayers) setPrayerNotifications(JSON.parse(prayers));
    } catch (e) {
      console.error(e);
    }
  };

  const togglePrayerNotification = async (key: keyof typeof prayerNotifications) => {
    const newState = { ...prayerNotifications, [key]: !prayerNotifications[key] };
    setPrayerNotifications(newState);
    await AsyncStorage.setItem('prayer_notifications', JSON.stringify(newState));
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRateApp = () => {
    openPlayStoreReview();
  };

  const handleFeedback = () => {
    // App version + OS in the subject make bug reports actionable.
    const subject = `Ezan Vakti Pro+ v${Constants.expoConfig?.version ?? ''} (${Platform.OS} ${Platform.Version}, ${i18n.language})`;
    Linking.openURL(`mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}`).catch(() => {});
  };

  const handleShareApp = async () => {
    try {
      await Share.share({ message: t('settings.shareAppMessage', { playStore: PLAY_STORE_URL }) });
    } catch (e) {
      console.error(e);
    }
  };

  const SOUND_LABEL_KEYS: Record<string, string> = {
    'Hafif Bildirim': 'settings.sounds.soft',
    'Sessiz': 'settings.sounds.silent',
    'İstanbul Ezanı': 'settings.sounds.istanbul',
    'Mekke Ezanı': 'settings.sounds.mecca',
    'Medine Ezanı': 'settings.sounds.medina',
    'Mısır Ezanı': 'settings.sounds.egypt',
  };
  const reminderLabel = (value: string) => {
    const minutes = value.match(/\d+/)?.[0];
    return minutes ? t('settings.reminderMinutes', { minutes }) : t('settings.reminderOff');
  };

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleSelectLanguage = async (code: string) => {
    await i18n.changeLanguage(code);
    await AsyncStorage.setItem('appLanguage', code);
    setShowLangPicker(false);
  };

  const SettingRow = ({ icon, label, value, onPress, type = 'chevron', isSubRow = false }: any) => (
    <TouchableOpacity
      style={[
        styles.row,
        { borderBottomColor: colors.border },
        isSubRow && { paddingLeft: Spacing.xl, minHeight: 44, paddingVertical: Spacing.sm },
      ]}
      onPress={type === 'switch' ? undefined : onPress}
      disabled={type === 'switch'}
    >
      <View style={styles.rowLeft}>
        {icon ? (
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name={icon} size={20} color={colors.primary} />
          </View>
        ) : (
          <View style={{ width: 36 }} />
        )}
        <Text style={[styles.rowLabel, { color: colors.text }, isSubRow && { fontSize: FontSize.sm }]}>{label}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#fff"
        />
      ) : (
        <View style={styles.rowRight}>
          {value && <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{value}</Text>}
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={[styles.content, { backgroundColor: colors.background }]}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>{t('settings.title')}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('settings.title')}</Text>
                <SettingRow
                  icon="notifications-outline"
                  label={t('settings.notifications')}
                  type="switch"
                  value={notificationsEnabled}
                  onPress={onToggleNotifications}
                />
                {notificationsEnabled && (
                  <View style={styles.subSection}>
                    <SettingRow label={t('prayerTimes.imsak')} type="switch" value={prayerNotifications.fajr} onPress={() => togglePrayerNotification('fajr')} isSubRow />
                    <SettingRow label={t('prayerTimes.gunes')} type="switch" value={prayerNotifications.sunrise} onPress={() => togglePrayerNotification('sunrise')} isSubRow />
                    <SettingRow label={t('prayerTimes.ogle')} type="switch" value={prayerNotifications.dhuhr} onPress={() => togglePrayerNotification('dhuhr')} isSubRow />
                    <SettingRow label={t('prayerTimes.ikindi')} type="switch" value={prayerNotifications.asr} onPress={() => togglePrayerNotification('asr')} isSubRow />
                    <SettingRow label={t('prayerTimes.aksam')} type="switch" value={prayerNotifications.maghrib} onPress={() => togglePrayerNotification('maghrib')} isSubRow />
                    <SettingRow label={t('prayerTimes.yatsi')} type="switch" value={prayerNotifications.isha} onPress={() => togglePrayerNotification('isha')} isSubRow />
                  </View>
                )}
                <SettingRow
                  icon="calculator-outline"
                  label={t('settings.calcMethod')}
                  value={
                    methodSetting === 'auto'
                      ? `${t('settings.calcMethodAuto')} · ${CALCULATION_METHODS[resolvedMethod].name}`
                      : CALCULATION_METHODS[methodSetting].name
                  }
                  onPress={() => setShowMethodPicker(true)}
                />
                <SettingRow
                  icon="location-outline"
                  label={t('settings.locationPermission')}
                  value={locationPermission === 'granted' ? t('settings.permissionOn') : t('settings.permissionOff')}
                  onPress={openAppSettings}
                />
                <SettingRow
                  icon="volume-high-outline"
                  label={t('settings.sound')}
                  value={t(SOUND_LABEL_KEYS[ezanSound] ?? 'settings.sounds.soft')}
                  onPress={() => {
                    const sounds = ['Hafif Bildirim', 'Sessiz', 'İstanbul Ezanı', 'Mekke Ezanı', 'Medine Ezanı', 'Mısır Ezanı'];
                    const nextIndex = (sounds.indexOf(ezanSound) + 1) % sounds.length;
                    setEzanSound(sounds[nextIndex]);
                    saveSetting('ezan_sound', sounds[nextIndex]);
                  }}
                />
                <TouchableOpacity
                  style={[styles.testSoundBtn, { borderColor: colors.primary + '30', backgroundColor: colors.primary + '10' }]}
                  onPress={() => playTestEzanSound(ezanSound)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="volume-medium" size={16} color={colors.primary} />
                  <Text style={[styles.testSoundBtnText, { color: colors.primary }]}>
                    {t('settings.testSound', { defaultValue: 'Seçili Ezan Sesini Test Et (Çal)' })}
                  </Text>
                </TouchableOpacity>
                <SettingRow
                  icon="alarm-outline"
                  label={t('settings.reminder')}
                  value={reminderLabel(reminderTime)}
                  onPress={() => {
                    const times = ['Kapalı', '5 dk önce', '10 dk önce', '15 dk önce', '30 dk önce'];
                    const nextIndex = (times.indexOf(reminderTime) + 1) % times.length;
                    setReminderTime(times[nextIndex]);
                    saveSetting('reminder_time', times[nextIndex]);
                  }}
                />
                <SettingRow
                  icon="color-palette-outline"
                  label={t('settings.theme')}
                  value={colorScheme === 'dark' ? t('settings.themeDark') : t('settings.themeLight')}
                />
                <SettingRow
                  icon="language-outline"
                  label={t('settings.language')}
                  value={`${currentLang.flag} ${currentLang.name}`}
                  onPress={() => setShowLangPicker(true)}
                />
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('settings.support')}</Text>
                <SettingRow icon="share-social-outline" label={t('settings.shareApp')} onPress={handleShareApp} />
                <SettingRow icon="star-outline" label={t('settings.rateApp')} onPress={handleRateApp} />
                <SettingRow icon="mail-outline" label={t('settings.feedback')} onPress={handleFeedback} />
                <SettingRow icon="information-circle-outline" label={t('settings.about')} value={`v${Constants.expoConfig?.version ?? ''}`} />
              </View>

              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.widgetPreview')}</Text>
              <View style={[styles.widgetPreview, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.medium]}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.widgetGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.widgetTop}>
                    <Text style={styles.widgetCity}>İstanbul</Text>
                    <Text style={styles.widgetDate}>21 {t('hijriMonths.9')}</Text>
                  </View>
                  <View style={styles.widgetBottom}>
                    <View>
                      <Text style={styles.widgetLabel}>{t('settings.widgetNext')}</Text>
                      <Text style={styles.widgetPrayer}>{t('prayerTimes.ogle')}</Text>
                    </View>
                    <Text style={styles.widgetTime}>13:12</Text>
                  </View>
                </LinearGradient>
                <Text style={[styles.widgetHint, { color: colors.textMuted }]}>
                  {t('settings.widgetHint')}
                </Text>
              </View>

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: colors.textMuted }]}>
                  Ezan Vakti Pro+ © 2026
                </Text>
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Calculation Method Picker Modal */}
      <Modal animationType="slide" transparent={true} visible={showMethodPicker} onRequestClose={() => setShowMethodPicker(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowMethodPicker(false)}>
          <View style={[styles.langPickerContent, { backgroundColor: colors.background }]}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>{t('settings.calcMethod')}</Text>
              <TouchableOpacity onPress={() => setShowMethodPicker(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={['auto', ...CALCULATION_METHOD_IDS] as MethodSetting[]}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = methodSetting === item;
                const label =
                  item === 'auto'
                    ? `${t('settings.calcMethodAuto')} (${CALCULATION_METHODS[resolvedMethod].name})`
                    : CALCULATION_METHODS[item].name;
                return (
                  <TouchableOpacity
                    style={[styles.langRow, { borderBottomColor: colors.border }, isSelected && { backgroundColor: colors.primary + '15' }]}
                    onPress={() => {
                      onChangeMethod(item);
                      setShowMethodPicker(false);
                    }}
                  >
                    <Text style={[styles.langName, { color: colors.text }, isSelected && { color: colors.primary, fontWeight: '700' }]}>
                      {label}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Language Picker Modal */}
      <Modal animationType="slide" transparent={true} visible={showLangPicker} onRequestClose={() => setShowLangPicker(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowLangPicker(false)}>
          <View style={[styles.langPickerContent, { backgroundColor: colors.background }]}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>{t('settings.language')}</Text>
              <TouchableOpacity onPress={() => setShowLangPicker(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={LANGUAGES}
              keyExtractor={item => item.code}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = i18n.language === item.code;
                return (
                  <TouchableOpacity
                    style={[styles.langRow, { borderBottomColor: colors.border }, isSelected && { backgroundColor: colors.primary + '15' }]}
                    onPress={() => handleSelectLanguage(item.code)}
                  >
                    <Text style={styles.langFlag}>{item.flag}</Text>
                    <Text style={[styles.langName, { color: colors.text }, isSelected && { color: colors.primary, fontWeight: '700' }]}>
                      {item.name}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    height: '85%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  langPickerContent: {
    height: '75%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  subSection: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: BorderRadius.md,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: FontSize.md,
    fontWeight: '500',
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    maxWidth: '50%',
  },
  rowValue: {
    fontSize: FontSize.sm,
    textAlign: 'right',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    gap: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginHorizontal: 4,
  },
  langFlag: {
    fontSize: 24,
  },
  langName: {
    fontSize: FontSize.md,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  footerText: {
    fontSize: FontSize.xs,
  },
  widgetPreview: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  widgetGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    height: 100,
    justifyContent: 'space-between',
  },
  widgetTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widgetCity: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  widgetDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.xs,
  },
  widgetBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  widgetLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  widgetPrayer: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  widgetTime: {
    color: '#fff',
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  widgetHint: {
    fontSize: 10,
    marginTop: Spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  testSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
  },
  testSoundBtnText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
