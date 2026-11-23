import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Platform,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
import { SEOHead } from '@/components/SEOHead';
import { fetchNearbyMosques, NearbyMosque } from '@/lib/services/mosque-service';
import { loadSavedLocation, DEFAULT_LOCATION } from '@/lib/location-settings';
import { InlineBanner } from '@/components/InlineBanner';

export default function MosquesScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [mosques, setMosques] = useState<NearbyMosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMosques();
  }, []);

  const loadMosques = async () => {
    setLoading(true);
    setError(null);
    try {
      let lat = DEFAULT_LOCATION.city.latitude;
      let lon = DEFAULT_LOCATION.city.longitude;
      let hasCoords = false;

      // Try GPS first
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          try {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            lat = location.coords.latitude;
            lon = location.coords.longitude;
            hasCoords = true;
          } catch {
            const lastLoc = await Location.getLastKnownPositionAsync();
            if (lastLoc) {
              lat = lastLoc.coords.latitude;
              lon = lastLoc.coords.longitude;
              hasCoords = true;
            }
          }
        }
      } catch (locErr) {
        console.log('GPS request error in mosques:', locErr);
      }

      // If GPS unavailable or denied, fallback to saved city location
      if (!hasCoords) {
        const saved = await loadSavedLocation();
        if (saved?.city) {
          lat = saved.city.latitude;
          lon = saved.city.longitude;
          hasCoords = true;
        }
      }

      const results = await fetchNearbyMosques(lat, lon, i18n.language);
      setMosques(results);
    } catch (e) {
      console.log('Mosque fetch error:', e);
      setError(t('mosques.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const openDirections = (mosque: NearbyMosque) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SEOHead
        title="Yakın Camiler | Ezan Vakti ve Hatim"
        description="Konumunuza en yakın camileri bulun, yol tarifi alın."
        keywords="yakın camiler, en yakın cami, cami bul"
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('mosques.title'),
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#ffffff',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: Platform.OS === 'ios' ? 0 : 16 }}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.centerText, { color: colors.textSecondary }]}>{t('mosques.loading')}</Text>
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.centerText, { color: colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            onPress={loadMosques}
          >
            <Text style={styles.retryBtnText}>{t('mosques.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : mosques.length === 0 ? (
        <View style={styles.centerState}>
          <Ionicons name="location-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.centerText, { color: colors.textSecondary }]}>{t('mosques.empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={mosques}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={<InlineBanner />}
          renderItem={({ item }) => (
            <View style={[styles.mosqueCard, { backgroundColor: colors.surface }, Shadows.light]}>
              <View style={[styles.mosqueIconWrapper, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="business" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.mosqueName, { color: colors.text }]} numberOfLines={1}>
                  {item.name || t('mosques.unnamed')}
                </Text>
                <Text style={[styles.mosqueDistance, { color: colors.textSecondary }]}>
                  {item.distanceKm.toFixed(1)} km
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => openDirections(item)}
                style={[styles.directionsBtn, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="navigate" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  centerText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  listContent: {
    padding: Spacing.md,
  },
  mosqueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  mosqueIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mosqueName: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  mosqueDistance: {
    fontSize: 12,
    marginTop: 2,
  },
  directionsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
