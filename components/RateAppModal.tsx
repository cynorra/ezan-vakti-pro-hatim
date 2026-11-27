import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import {
  recordLaunchAndShouldPrompt,
  openPlayStoreReview,
  markReviewDismissed,
  markReviewNeverAsk,
} from '@/lib/reviewPrompt';

interface RateAppModalProps {
  ready: boolean;
}

export function RateAppModal({ ready }: RateAppModalProps) {
  const [visible, setVisible] = useState(false);
  const { i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    recordLaunchAndShouldPrompt().then((shouldShow) => {
      if (!cancelled && shouldShow) {
        timer = setTimeout(() => {
          if (!cancelled) setVisible(true);
        }, 6000);
      }
    });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [ready]);

  if (!visible) return null;

  const isTr = (i18n.language || '').toLowerCase().startsWith('tr');

  const title = isTr ? 'Uygulamamızı Beğeniyor musunuz?' : 'Enjoying the App?';
  const body = isTr
    ? "Ezan Vakti + Hatim'i geliştirmemize destek olmak için Google Play'de değerlendirmenizi paylaşabilirsiniz."
    : 'Your feedback on Google Play helps us improve Ezan Vakti + Hatim for everyone.';
  const rateLabel = isTr ? "Google Play'de Değerlendir" : 'Rate on Google Play';
  const laterLabel = isTr ? 'Şimdi Değil' : 'Not Now';
  const neverLabel = isTr
    ? 'Zaten değerlendirdim / Bir daha gösterme'
    : 'Already reviewed / Do not show again';

  const handleRate = async () => {
    setVisible(false);
    await openPlayStoreReview();
  };

  const handleLater = async () => {
    setVisible(false);
    await markReviewDismissed();
  };

  const handleNever = async () => {
    setVisible(false);
    await markReviewNeverAsk();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleLater}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card ?? (colorScheme === 'dark' ? '#16201c' : '#ffffff'),
              borderColor: colors.border ?? 'rgba(13, 122, 62, 0.2)',
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="star" size={30} color="#F59E0B" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.body, { color: colors.textSecondary ?? '#64748b' }]}>
            {body}
          </Text>

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
            onPress={handleRate}
          >
            <Ionicons name="star-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>{rateLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.75}
            onPress={handleLater}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
              {laterLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.neverBtn}
            activeOpacity={0.7}
            onPress={handleNever}
          >
            <Text style={[styles.neverBtnText, { color: colors.textSecondary ?? '#94a3b8' }]}>
              {neverLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    marginBottom: 10,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  neverBtn: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  neverBtnText: {
    fontSize: 12,
  },
});
