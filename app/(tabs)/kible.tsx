import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.85;

// Kabe koordinatları
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function KibleScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [rotationAnim] = useState(new Animated.Value(0));

  const [wasPointing, setWasPointing] = useState(false);

  useEffect(() => {
    const checkPointing = () => {
      const isPointing = isPointingToQibla();
      if (isPointing && !wasPointing) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setWasPointing(isPointing);
    };
    checkPointing();
  }, [heading, qiblaDirection]);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    const startCompass = async () => {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        setLocationError('Konum izni gerekli');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const qibla = calculateQiblaDirection(
          location.coords.latitude,
          location.coords.longitude
        );
        setQiblaDirection(qibla);
      } catch (error) {
        setLocationError('Konum alınamadı');
      }

      const isAvailable = await Magnetometer.isAvailableAsync();
      if (!isAvailable) {
        setLocationError('Pusula sensörü bulunamadı');
        return;
      }

      Magnetometer.setUpdateInterval(100);
      subscription = Magnetometer.addListener((data) => {
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        if (Platform.OS === 'ios') {
          angle = angle - 90;
        }
        if (angle < 0) {
          angle += 360;
        }
        setHeading(angle);
      });
    };

    startCompass();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const calculateQiblaDirection = (lat: number, lng: number): number => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
    const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

    const y = Math.sin(kaabaLngRad - lngRad);
    const x =
      Math.cos(latRad) * Math.tan(kaabaLatRad) -
      Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

    let qibla = Math.atan2(y, x) * (180 / Math.PI);
    if (qibla < 0) {
      qibla += 360;
    }
    return qibla;
  };

  const getRotation = () => {
    return qiblaDirection - heading;
  };

  const isPointingToQibla = () => {
    const diff = Math.abs((getRotation() + 360) % 360);
    return diff < 8 || diff > 352;
  };

  if (locationError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.errorCard, Shadows.medium]}>
          <Ionicons name="warning" size={64} color={colors.error} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Hata Oluştu</Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>{locationError}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>KIBLE PUSULASI</Text>
        <View style={styles.headerInfo}>
          <Ionicons name="compass-outline" size={20} color="rgba(255,255,255,0.7)" />
          <Text style={styles.headerSubtitle}>Doğru sonuç için düz tutun</Text>
        </View>
      </LinearGradient>

      <View style={styles.compassSection}>
        <View style={[styles.compassOuter, { backgroundColor: colors.card }, Shadows.premium]}>
          {/* Compass Rose */}
          <View style={[styles.compassRose, { transform: [{ rotate: `${-heading}deg` }] }]}>
            {['K', 'D', 'G', 'B'].map((dir, i) => (
              <View key={dir} style={[styles.dirMark, { transform: [{ rotate: `${i * 90}deg` }] }]}>
                <Text style={[styles.dirText, { color: dir === 'K' ? colors.error : colors.textMuted }]}>
                  {dir}
                </Text>
              </View>
            ))}
            
            {/* Degree marks */}
            {[...Array(12)].map((_, i) => (
              <View key={i} style={[styles.tick, { transform: [{ rotate: `${i * 30}deg` }] }]} />
            ))}
          </View>

          {/* Qibla Needle */}
          <View style={[styles.needleContainer, { transform: [{ rotate: `${getRotation()}deg` }] }]}>
            <View style={[styles.needleArrow, { borderBottomColor: colors.accent }]} />
            <View style={[styles.needleTail, { backgroundColor: colors.accent }]} />
            <View style={styles.kaabaIconContainer}>
               <Text style={styles.kaabaIcon}>🕋</Text>
            </View>
          </View>

          {/* Center Point */}
          <View style={[styles.centerPoint, { backgroundColor: colors.primary }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={[
          styles.statusCard, 
          { backgroundColor: isPointingToQibla() ? colors.primary : colors.card },
          Shadows.medium
        ]}>
          <Ionicons 
            name={isPointingToQibla() ? "checkmark-circle" : "navigate-circle"} 
            size={32} 
            color={isPointingToQibla() ? "#fff" : colors.primary} 
          />
          <View style={styles.statusInfo}>
            <Text style={[styles.statusTitle, { color: isPointingToQibla() ? "#fff" : colors.text }]}>
              {isPointingToQibla() ? "Kıble Yönündesiniz" : "Kıbleyi Bulun"}
            </Text>
            <Text style={[styles.statusSub, { color: isPointingToQibla() ? "rgba(255,255,255,0.8)" : colors.textSecondary }]}>
              {isPointingToQibla() ? "Namaz için hazırsınız" : `Sola/Sağa ${Math.abs(getRotation()).toFixed(0)}° çevirin`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontWeight: '800',
    letterSpacing: 2,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.xs,
  },
  compassSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  compassOuter: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compassRose: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dirMark: {
    position: 'absolute',
    top: 20,
    alignItems: 'center',
    height: COMPASS_SIZE / 2 - 20,
  },
  dirText: {
    fontSize: 20,
    fontWeight: '900',
  },
  tick: {
    position: 'absolute',
    top: 10,
    width: 2,
    backgroundColor: '#ddd',
    height: COMPASS_SIZE / 2 - 10,
  },
  needleContainer: {
    width: 100,
    height: COMPASS_SIZE - 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  needleArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  needleTail: {
    width: 4,
    height: COMPASS_SIZE / 2 - 100,
    borderRadius: 2,
  },
  kaabaIconContainer: {
    marginTop: 10,
  },
  kaabaIcon: {
    fontSize: 40,
  },
  centerPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    zIndex: 10,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: 40,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  statusSub: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  errorCard: {
    padding: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    margin: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 10,
  },
});
