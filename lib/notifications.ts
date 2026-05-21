import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export async function schedulePrayerNotification(
  prayerName: string,
  timeStr: string,
  city: string
) {
  if (Platform.OS === 'web') return;

  const [hours, minutes] = timeStr.split(':').map(Number);
  
  // Her gun ayni saatte tekrarla
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${prayerName} Vakti`,
      body: `${city} için ${prayerName} vakti geldi.`,
      sound: true,
      data: { prayerName, city },
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true,
    } as any,
  });
}

export async function cancelAllNotifications() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleAllPrayers(prayerTimes: any, city: string) {
  if (Platform.OS === 'web') return;
  
  await cancelAllNotifications();
  
  const prayers = [
    { name: 'İmsak', time: prayerTimes.imsak },
    { name: 'Güneş', time: prayerTimes.gunes },
    { name: 'Öğle', time: prayerTimes.ogle },
    { name: 'İkindi', time: prayerTimes.ikindi },
    { name: 'Akşam', time: prayerTimes.aksam },
    { name: 'Yatsı', time: prayerTimes.yatsi },
  ];

  for (const prayer of prayers) {
    if (prayer.time) {
      await schedulePrayerNotification(prayer.name, prayer.time, city);
    }
  }
}
