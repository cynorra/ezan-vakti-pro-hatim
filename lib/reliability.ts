import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';
import i18n from '@/lib/i18n';

/**
 * Prayer alerts must fire on the minute. On Android 12+ that needs the "Alarms & reminders"
 * special permission (off by default on Android 14+), and aggressive battery optimisation can
 * delay or drop alarms on many devices. Both are special settings pages the user must open,
 * so we explain why once and take them straight there.
 */
const EXACT_ALARM_PROMPTED_KEY = 'exact_alarm_prompted_v1';
const BATTERY_PROMPTED_KEY = 'battery_opt_prompted_v1';

const packageName = () =>
  (Constants.expoConfig?.android?.package as string | undefined) ?? 'com.cynnora.ezanvakti';

function ask(title: string, message: string, action: string, later: string): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: later, style: 'cancel', onPress: () => resolve(false) },
        { text: action, onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}

export async function openExactAlarmSettings() {
  if (Platform.OS !== 'android') return;
  await IntentLauncher.startActivityAsync('android.settings.REQUEST_SCHEDULE_EXACT_ALARM', {
    data: `package:${packageName()}`,
  });
}

export async function openBatteryOptimizationSettings() {
  if (Platform.OS !== 'android') return;
  await IntentLauncher.startActivityAsync('android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS');
}

/** Asks once for each special setting, only after notifications are allowed. Never throws. */
export async function promptPrayerAlertReliability() {
  if (Platform.OS !== 'android') return;
  try {
    const api = typeof Platform.Version === 'number' ? Platform.Version : parseInt(String(Platform.Version), 10);

    if (api >= 31 && !(await AsyncStorage.getItem(EXACT_ALARM_PROMPTED_KEY))) {
      await AsyncStorage.setItem(EXACT_ALARM_PROMPTED_KEY, '1');
      const go = await ask(
        i18n.t('reliability.exactTitle', { defaultValue: 'Adhan on the exact minute' }),
        i18n.t('reliability.exactBody', {
          defaultValue:
            'To sound the adhan exactly at prayer time, allow "Alarms & reminders" for this app on the next screen.',
        }),
        i18n.t('reliability.openSettings', { defaultValue: 'Open settings' }),
        i18n.t('reliability.later', { defaultValue: 'Later' })
      );
      if (go) await openExactAlarmSettings();
    }

    if (!(await AsyncStorage.getItem(BATTERY_PROMPTED_KEY))) {
      await AsyncStorage.setItem(BATTERY_PROMPTED_KEY, '1');
      const go = await ask(
        i18n.t('reliability.batteryTitle', { defaultValue: 'Keep the adhan reliable' }),
        i18n.t('reliability.batteryBody', {
          defaultValue:
            'Some phones delay alarms to save battery. Find this app in the list and choose "Don\'t optimize" / "Unrestricted".',
        }),
        i18n.t('reliability.openSettings', { defaultValue: 'Open settings' }),
        i18n.t('reliability.later', { defaultValue: 'Later' })
      );
      if (go) await openBatteryOptimizationSettings();
    }
  } catch (error) {
    console.log('[reliability] prompt failed:', error);
  }
}
