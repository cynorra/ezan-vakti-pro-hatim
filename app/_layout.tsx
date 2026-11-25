import { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AnimatedSplash } from '@/components/AnimatedSplash';
import '@/lib/i18n';

// Sistem yazı boyutu büyütülse dahi premium tasarımımızın kaymasını ve bozulmasını engeller
if ((Text as any).defaultProps == null) {
  (Text as any).defaultProps = {};
}
(Text as any).defaultProps.allowFontScaling = false;

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  // Safety fallback: ensure splash overlay is always unmounted even if animation is interrupted
  useEffect(() => {
    if (!showSplash) return;
    const t = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(t);
  }, [showSplash]);

  useEffect(() => {
    const openFromNotification = (response: Notifications.NotificationResponse | null) => {
      if (!response) return;
      try {
        const data = response.notification.request.content.data;
        if (data?.screen) {
          if (data.screen === 'dua') {
            router.push('/(tabs)/dua');
          } else if (data.screen === 'tesbih') {
            router.push('/(tabs)/tesbih');
          } else if (data.screen === 'hatim') {
            router.push('/(tabs)/hatim');
          } else if (data.screen === 'kaza') {
            router.push('/(tabs)/kaza');
          } else if (data.screen === 'home') {
            router.push('/(tabs)');
          }
        }
      } catch (err) {
        console.log('Notification navigation error:', err);
      }
    };

    // Tapped while the app was running or in the background.
    const subscription = Notifications.addNotificationResponseReceivedListener(openFromNotification);
    // Tapped while the app was closed: the listener above is registered too late for it.
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        openFromNotification(response);
        return Notifications.clearLastNotificationResponseAsync?.();
      })
      .catch(() => {});

    return () => subscription.remove();
  }, [router]);

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      {showSplash && <AnimatedSplash onFinish={() => setShowSplash(false)} />}
    </>
  );
}

