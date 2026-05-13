import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const safeHaptics = {
  impactAsync: async (style: Haptics.ImpactFeedbackStyle) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (e) {
        console.warn('Haptics not available');
      }
    }
  },
  notificationAsync: async (type: Haptics.NotificationFeedbackType) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.notificationAsync(type);
      } catch (e) {
        console.warn('Haptics not available');
      }
    }
  },
  selectionAsync: async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.selectionAsync();
      } catch (e) {
        console.warn('Haptics not available');
      }
    }
  },
};
