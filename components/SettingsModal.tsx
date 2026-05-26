import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, useColorScheme, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  notificationsEnabled,
  onToggleNotifications,
}) => {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [ezanSound, setEzanSound] = useState('İstanbul Ezanı');
  const [reminderTime, setReminderTime] = useState('15 dk önce');
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

  const SettingRow = ({ icon, label, value, onPress, type = 'chevron', isSubRow = false }: any) => (
    <TouchableOpacity 
      style={[
        styles.row, 
        { borderBottomColor: colors.border },
        isSubRow && { paddingLeft: Spacing.xl, height: 44 }
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{t('settings.title')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
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
                  <SettingRow label="İmsak" type="switch" value={prayerNotifications.fajr} onPress={() => togglePrayerNotification('fajr')} isSubRow />
                  <SettingRow label="Güneş" type="switch" value={prayerNotifications.sunrise} onPress={() => togglePrayerNotification('sunrise')} isSubRow />
                  <SettingRow label="Öğle" type="switch" value={prayerNotifications.dhuhr} onPress={() => togglePrayerNotification('dhuhr')} isSubRow />
                  <SettingRow label="İkindi" type="switch" value={prayerNotifications.asr} onPress={() => togglePrayerNotification('asr')} isSubRow />
                  <SettingRow label="Akşam" type="switch" value={prayerNotifications.maghrib} onPress={() => togglePrayerNotification('maghrib')} isSubRow />
                  <SettingRow label="Yatsı" type="switch" value={prayerNotifications.isha} onPress={() => togglePrayerNotification('isha')} isSubRow />
                </View>
              )}
              <SettingRow 
                icon="volume-high-outline" 
                label="Ezan Sesi" 
                value={ezanSound}
                onPress={() => {
                  const sounds = ['İstanbul Ezanı', 'Mekke Ezanı', 'Medine Ezanı', 'Mısır Ezanı'];
                  const nextIndex = (sounds.indexOf(ezanSound) + 1) % sounds.length;
                  setEzanSound(sounds[nextIndex]);
                  saveSetting('ezan_sound', sounds[nextIndex]);
                }}
              />
              <SettingRow 
                icon="alarm-outline" 
                label="Vakit Öncesi Hatırlatıcı" 
                value={reminderTime}
                onPress={() => {
                  const times = ['Kapalı', '5 dk önce', '10 dk önce', '15 dk önce', '30 dk önce'];
                  const nextIndex = (times.indexOf(reminderTime) + 1) % times.length;
                  setReminderTime(times[nextIndex]);
                  saveSetting('reminder_time', times[nextIndex]);
                }}
              />
              <SettingRow 
                icon="color-palette-outline" 
                label="Tema" 
                value={colorScheme === 'dark' ? 'Karanlık' : 'Aydınlık'}
              />
              <SettingRow 
                icon="language-outline" 
                label={t('settings.language')} 
                value={i18n.language.toUpperCase()}
                onPress={async () => {
                  const langs = ['tr', 'en', 'ar', 'ru'];
                  const nextIndex = (langs.indexOf(i18n.language) + 1) % langs.length;
                  const newLang = langs[nextIndex];
                  await i18n.changeLanguage(newLang);
                  await AsyncStorage.setItem('appLanguage', newLang);
                }}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Destek & Bilgi</Text>
              <SettingRow icon="star-outline" label="Uygulamayı Puanla" />
              <SettingRow icon="mail-outline" label="Geri Bildirim Gönder" />
              <SettingRow icon="information-circle-outline" label="Hakkında" value="v1.0.0" />
            </View>

            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>WIDGET ÖNİZLEME</Text>
            <View style={[styles.widgetPreview, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.medium]}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.widgetGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.widgetTop}>
                  <Text style={styles.widgetCity}>İstanbul</Text>
                  <Text style={styles.widgetDate}>21 Ramazan</Text>
                </View>
                <View style={styles.widgetBottom}>
                  <View>
                    <Text style={styles.widgetLabel}>Sıradaki</Text>
                    <Text style={styles.widgetPrayer}>Öğle</Text>
                  </View>
                  <Text style={styles.widgetTime}>13:12</Text>
                </View>
              </LinearGradient>
              <Text style={[styles.widgetHint, { color: colors.textMuted }]}>
                Widget'ı eklemek için ana ekranınıza basılı tutun.
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
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    height: '80%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
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
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  rowValue: {
    fontSize: FontSize.sm,
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
});
