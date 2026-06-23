import { NativeModules, Platform } from 'react-native';

const { WidgetModule } = NativeModules;

export const updateWidget = (name: string, time: string) => {
  if (Platform.OS === 'android' && WidgetModule) {
    WidgetModule.setNextPrayer(name, time);
  }
};
