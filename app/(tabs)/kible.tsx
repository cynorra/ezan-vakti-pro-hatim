import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { safeHaptics } from '@/lib/haptics';
import { Colors, Spacing, FontSize, BorderRadius, Shadows, Gradients } from '@/constants/theme';
import { SEOHead } from '@/components/SEOHead';
import { logQiblaSearched } from '@/lib/analytics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function KibleScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [heading, setHeading] = useState(0);
  const [qiblaDir, setQiblaDir] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Konum izni verilmedi.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      // Kible acisi hesaplama (Kabe: 21.4225, 39.8262)
      const lat1 = location.coords.latitude * Math.PI / 180;
      const lon1 = location.coords.longitude * Math.PI / 180;
      const lat2 = 21.4225 * Math.PI / 180;
      const lon2 = 39.8262 * Math.PI / 180;

      const y = Math.sin(lon2 - lon1);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
      const qibla = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      setQiblaDir(qibla);

      Location.watchHeadingAsync((data) => {
        setHeading(data.trueHeading);
        
        // Kibleye yaklasinca haptik geri bildirim
        const diff = Math.abs(data.trueHeading - qibla);
        if (diff < 2 || diff > 358) {
          safeHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      });
      logQiblaSearched();
    })();
  }, []);

  const rotateValue = (heading - qiblaDir);
  const isAligned = Math.abs(heading - qiblaDir) < 5 || Math.abs(heading - qiblaDir) > 355;

  return (
    <>
      <SEOHead 
        title="Kıble Pusulası | Ezan Vakti ve Hatim"
        description="GPS destekli hassas kıble pusulası. Dünyanın her yerinden Kabe yönünü saniyeler içinde hatasız olarak bulun."
        keywords="kıble bulucu, kıble pusulası, kabe yönü, kıble yönü bul, kıble açısı"
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={Gradients.premium} style={styles.header}>
        <Text style={styles.headerTitle}>{t('qibla.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('qibla.subtitle')}</Text>
      </LinearGradient>

      <View style={[styles.compassSection, { paddingBottom: 60 + insets.bottom }]}>
        {/* Outer Ring */}
        <View style={[styles.outerRing, { borderColor: colors.primary + '10' }]}>
          {/* Compass Image / Graphic */}
          <Animated.View 
            style={[
              styles.compassContainer, 
              { transform: [{ rotate: `${-heading}deg` }] }
            ]}
          >
            {/* North Indicator */}
            <View style={styles.northMarker}>
              <Text style={[styles.northText, { color: colors.error }]}>N</Text>
            </View>
            
            {/* Degree Markers */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <View 
                key={deg} 
                style={[styles.marker, { transform: [{ rotate: `${deg}deg` }] }]}
              >
                <View style={[styles.markerLine, { backgroundColor: colors.border }]} />
              </View>
            ))}
          </Animated.View>

          {/* Qibla Needle (Fixed relative to compass or pointing) */}
          <Animated.View 
            style={[
              styles.needleContainer, 
              { transform: [{ rotate: `${qiblaDir - heading}deg` }] }
            ]}
          >
            <View style={[styles.qiblaNeedle, { borderBottomColor: colors.primary }]}>
              <View style={styles.needleIcon}>
                <Ionicons name="navigate" size={24} color={colors.accent} />
              </View>
            </View>
          </Animated.View>

          {/* Center Glow */}
          {isAligned && (
            <View style={[styles.glowEffect, { backgroundColor: colors.accent + '20' }]} />
          )}
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={[styles.infoCard, { backgroundColor: colors.surface }, Shadows.medium]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('qibla.yourDirection')}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{Math.round(heading)}°</Text>
          </View>
          
          <View style={[styles.infoCard, { backgroundColor: colors.surface }, Shadows.premium, isAligned && { borderColor: colors.accent, borderWidth: 2 }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('qibla.qiblaAngle')}</Text>
            <Text style={[styles.infoValue, { color: isAligned ? colors.primary : colors.text }]}>{Math.round(qiblaDir)}°</Text>
          </View>
        </View>

        {isAligned ? (
          <View style={[styles.successBadge, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={[styles.successText, { color: colors.success }]}>{t('qibla.aligned')}</Text>
          </View>
        ) : (
          <Text style={[styles.hintText, { color: colors.textMuted }]}>
            {t('qibla.hint')}
          </Text>
        )}
      </View>
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
  compassSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xl,
  },
  outerRing: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compassContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  northMarker: {
    position: 'absolute',
    top: 10,
    alignItems: 'center',
  },
  northText: {
    fontSize: 18,
    fontWeight: '900',
  },
  marker: {
    position: 'absolute',
    width: 2,
    height: '100%',
    alignItems: 'center',
  },
  markerLine: {
    width: 1,
    height: 10,
  },
  needleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qiblaNeedle: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 130,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    top: 20,
    alignItems: 'center',
  },
  needleIcon: {
    position: 'absolute',
    bottom: -140,
    transform: [{ rotate: '180deg' }],
  },
  glowEffect: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    zIndex: -1,
  },
  infoSection: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  infoCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.xl,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  successText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  hintText: {
    fontSize: 12,
    marginTop: Spacing.xl,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    fontWeight: '500',
    lineHeight: 18,
  },
});
