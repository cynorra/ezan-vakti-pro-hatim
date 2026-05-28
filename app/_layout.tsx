import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme, Text } from 'react-native';
import '@/lib/i18n';

// Sistem yazı boyutu büyütülse dahi premium tasarımımızın kaymasını ve bozulmasını engeller
if ((Text as any).defaultProps == null) {
  (Text as any).defaultProps = {};
}
(Text as any).defaultProps.allowFontScaling = false;

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
