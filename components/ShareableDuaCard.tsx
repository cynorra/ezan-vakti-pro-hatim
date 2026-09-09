import { forwardRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Dua } from '@/lib/data/duas';

interface ShareableDuaCardProps {
  dua: Dua;
}

// Sosyal medya paylaşımı (WhatsApp durumu, Instagram/TikTok hikayesi) için sabit
// boyutlu, ekran dışında render edilip react-native-view-shot ile görsele
// dönüştürülen marka kartı. Uygulama içindeki karttan bilerek ayrı tutuldu —
// burada UI kontrolleri (paylaş ikonu vb.) yok, sadece marka + davet var.
export const ShareableDuaCard = forwardRef<View, ShareableDuaCardProps>(({ dua }, ref) => {
  return (
    <View style={styles.wrapper} ref={ref} collapsable={false}>
      <LinearGradient colors={['#0d7a3e', '#0A5C36', '#052F1C']} style={StyleSheet.absoluteFill} />

      <View style={styles.brandRow}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <Text style={styles.brandText}>Ezan Vakti + Hatim</Text>
      </View>

      <View style={styles.badge}>
        <Ionicons name="star" size={13} color="#052F1C" />
        <Text style={styles.badgeText}>GÜNÜN DUASI</Text>
      </View>

      <Text style={styles.title}>{dua.title}</Text>
      <Text style={styles.arabic}>{dua.arabic}</Text>
      <Text style={styles.transliteration}>{dua.transliteration}</Text>

      <View style={styles.meaningBox}>
        <Text style={styles.meaningLabel}>ANLAMI</Text>
        <Text style={styles.meaning}>{dua.turkish}</Text>
      </View>

      <Text style={styles.source}>{dua.source}</Text>

      <View style={styles.footer}>
        <Ionicons name="download" size={14} color="#F4D03F" />
        <Text style={styles.footerText}>Ezan Vakti + Hatim uygulamasını indir</Text>
      </View>
    </View>
  );
});

const CARD_WIDTH = 360;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: -9999,
    left: 0,
    width: CARD_WIDTH,
    height: 560,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  logo: {
    width: 26,
    height: 26,
    borderRadius: 7,
  },
  brandText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '700',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 4,
    marginBottom: 18,
  },
  badgeText: {
    color: '#052F1C',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  arabic: {
    color: '#F4D03F',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 14,
    fontFamily: 'serif',
  },
  transliteration: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 18,
  },
  meaningBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginBottom: 12,
  },
  meaningLabel: {
    color: '#F4D03F',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center',
  },
  meaning: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  source: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    bottom: 26,
  },
  footerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '700',
  },
});
