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

  const bottomInset = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 24 : 8);
  const tabBarHeight = 62 + bottomInset;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            height: tabBarHeight,
            paddingBottom: bottomInset,
            paddingTop: 8,
            ...Shadows.medium,
            elevation: 16,
            zIndex: 50,
          },
          tabBarItemStyle: {
            paddingVertical: 2,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            marginTop: 2,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
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
        <Tabs.Screen
          name="kaza"
          options={{
            title: t('tabs.kaza') || 'Kaza',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons name={focused ? "checkbox" : "checkbox-outline"} size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          bottom: tabBarHeight,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          zIndex: 10,
        }}
      >
        <BannerAd />
      </View>
    </View>
  );
}
