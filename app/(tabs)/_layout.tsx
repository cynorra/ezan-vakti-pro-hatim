import { Tabs } from 'expo-router';
import { useColorScheme, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { initializeAds } from '@/lib/ads';
import { BannerAd } from '@/components/BannerAd';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    initializeAds();
  }, []);

  const tabBarHeight = Platform.OS === 'ios'
    ? (insets.bottom > 0 ? 60 + insets.bottom : 88)
    : (60 + insets.bottom);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          headerShown: false, // Sayfa içlerinde özel header kullanacağız
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 0,
            height: tabBarHeight,
            paddingBottom: insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 28 : 12),
            paddingTop: 12,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            ...Shadows.medium,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            marginTop: 4,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            paddingBottom: Platform.OS === 'android' && insets.bottom > 0 ? 4 : 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.home'),
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons name={focused ? "time" : "time-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="kible"
          options={{
            title: t('tabs.qibla'),
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons name={focused ? "compass" : "compass-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tesbih"
          options={{
            title: t('tabs.dhikr'),
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons name={focused ? "radio-button-on" : "radio-button-on-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="hatim"
          options={{
            title: t('tabs.hatim'),
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons name={focused ? "book" : "book-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="dua"
          options={{
            title: t('tabs.dua'),
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      <View
        style={{
          position: 'absolute',
          bottom: tabBarHeight,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          zIndex: 99,
        }}
      >
        <BannerAd />
      </View>
    </View>
  );
}
