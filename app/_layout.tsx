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

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
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
    });

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

