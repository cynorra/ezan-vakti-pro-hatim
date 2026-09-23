import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Dua } from '@/lib/data/duas';

interface ShareableDuaCardProps {
  dua: Dua | null;
  customBadge?: string;
}

// Sosyal medya paylaşımı (WhatsApp durumu, Instagram/TikTok hikayesi) için sabit
// boyutlu, ekran dışında render edilip react-native-view-shot ile görsele
// dönüştürülen marka kartı.
export const ShareableDuaCard = forwardRef<View, ShareableDuaCardProps>(({ dua, customBadge }, ref) => {
  const { t } = useTranslation();
  if (!dua) return null;

  const badgeText = (customBadge || t(`dua.categories.${dua.category}`, { defaultValue: dua.category })).toUpperCase();

  return (
    <View style={styles.wrapper} ref={ref} collapsable={false}>
      <LinearGradient colors={['#064e2b', '#0A5C36', '#032516']} style={StyleSheet.absoluteFill} />

      {/* Brand Header */}
      <View style={styles.brandRow}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <View>
          <Text style={styles.brandText}>Ezan Vakti + Hatim</Text>
          <Text style={styles.brandSlogan}>{t('dua.cardSlogan')}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Category / Featured Badge */}
      <View style={styles.badge}>
        <Ionicons name="sparkles" size={13} color="#052F1C" />
        <Text style={styles.badgeText}>{badgeText}</Text>
      </View>

      {/* Dua Content */}
      <Text style={styles.title}>{dua.title}</Text>
      
      {dua.arabic ? (
        <Text style={styles.arabic}>{dua.arabic}</Text>
      ) : null}

      {dua.transliteration ? (
        <Text style={styles.transliteration}>{dua.transliteration}</Text>
      ) : null}

      {dua.turkish ? (
        <View style={styles.meaningBox}>
          <Text style={styles.meaningLabel}>{t('dua.meaningLabel')}</Text>
          <Text style={styles.meaning}>{dua.turkish}</Text>
        </View>
      ) : null}

      {dua.source ? (
        <Text style={styles.source}>{t('dua.sourceLabel')}: {dua.source}</Text>
      ) : null}

      {/* Footer Play Store Call To Action */}
      <View style={styles.footerContainer}>
        <View style={styles.storeBadge}>
          <Ionicons name="logo-google-playstore" size={16} color="#D4AF37" />
          <Text style={styles.footerText}>{t('dua.cardFooter')}</Text>
        </View>
        <Text style={styles.footerAppId}>Ezan Vakti + Hatim</Text>
      </View>
    </View>
  );
});

const CARD_WIDTH = 380;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: -9999,
    left: 0,
    width: CARD_WIDTH,
    minHeight: 580,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  brandText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandSlogan: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontWeight: '600',
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
    marginVertical: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
    marginBottom: 14,
  },
  badgeText: {
    color: '#052F1C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 25,
  },
  arabic: {
    color: '#F4D03F',
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Traditional Arabic' : 'serif',
    paddingHorizontal: 8,
  },
  transliteration: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
  },
  meaningBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 10,
  },
  meaningLabel: {
    color: '#F4D03F',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center',
  },
  meaning: {
    color: '#ffffff',
    fontSize: 12.5,
    lineHeight: 18,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  source: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10.5,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    gap: 3,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    width: '100%',
  },
  storeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderColor: 'rgba(212,175,55,0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  footerText: {
    color: '#F4D03F',
    fontSize: 11,
    fontWeight: '700',
  },
  footerAppId: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 9.5,
    fontWeight: '600',
  },
});

