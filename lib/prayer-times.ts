// Prayer times calculation based on location and date
// Using calculation method similar to Diyanet

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface SunPosition {
  declination: number;
  equationOfTime: number;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

function calculateSunPosition(dayOfYear: number): SunPosition {
  const d = dayOfYear;
  const g = ((360 / 365.25) * (d + 0.5)) % 360;
  const gRad = toRadians(g);
  
  const declination = 0.396372 - 22.91327 * Math.cos(gRad) + 4.02543 * Math.sin(gRad)
    - 0.387205 * Math.cos(2 * gRad) + 0.051967 * Math.sin(2 * gRad)
    - 0.154527 * Math.cos(3 * gRad) + 0.084798 * Math.sin(3 * gRad);
  
  const equationOfTime = 0.004297 + 0.107029 * Math.cos(gRad) - 1.837877 * Math.sin(gRad)
    - 0.837378 * Math.cos(2 * gRad) - 2.340475 * Math.sin(2 * gRad);
  
  return { declination, equationOfTime };
}

function calculateHourAngle(latitude: number, declination: number, angle: number): number {
  const latRad = toRadians(latitude);
  const decRad = toRadians(declination);
  const angleRad = toRadians(angle);
  
  const cosHourAngle = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad));
  
  if (cosHourAngle > 1) return 0;
  if (cosHourAngle < -1) return 180;
  
  return toDegrees(Math.acos(cosHourAngle));
}

function formatTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  timezone: number = 3 // Turkey timezone UTC+3
): PrayerTimes {
  const dayOfYear = getDayOfYear(date);
  const { declination, equationOfTime } = calculateSunPosition(dayOfYear);
  
  // Calculate solar noon
  const solarNoon = 12 + (timezone * 15 - longitude) / 15 - equationOfTime / 60;
  
  // Fajr: Sun 18 degrees below horizon (Diyanet method)
  const fajrAngle = -18;
  const fajrHourAngle = calculateHourAngle(latitude, declination, fajrAngle);
  const fajr = solarNoon - fajrHourAngle / 15;
  
  // Sunrise: Sun at horizon with refraction correction
  const sunriseAngle = -0.8333;
  const sunriseHourAngle = calculateHourAngle(latitude, declination, sunriseAngle);
  const sunrise = solarNoon - sunriseHourAngle / 15;
  
  // Dhuhr: Solar noon + 5 minutes safety margin
  const dhuhr = solarNoon + 5 / 60;
  
  // Asr: Shadow equals object height (Shafi'i/Hanbali method)
  const latRad = toRadians(latitude);
  const decRad = toRadians(declination);
  const asrAngle = toDegrees(Math.atan(1 / (1 + Math.tan(Math.abs(latRad - decRad)))));
  const asrHourAngle = calculateHourAngle(latitude, declination, asrAngle);
  const asr = solarNoon + asrHourAngle / 15;
  
  // Maghrib: Sun at horizon
  const maghrib = solarNoon + sunriseHourAngle / 15;
  
  // Isha: Sun 17 degrees below horizon (Diyanet method)
  const ishaAngle = -17;
  const ishaHourAngle = calculateHourAngle(latitude, declination, ishaAngle);
  const isha = solarNoon + ishaHourAngle / 15;
  
  return {
    fajr: formatTime(fajr),
    sunrise: formatTime(sunrise),
    dhuhr: formatTime(dhuhr),
    asr: formatTime(asr),
    maghrib: formatTime(maghrib),
    isha: formatTime(isha),
  };
}

export function getNextPrayer(prayerTimes: PrayerTimes): { name: string; time: string; nameArabic: string } {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const prayers = [
    { name: 'İmsak', nameArabic: 'الفجر', time: prayerTimes.fajr },
    { name: 'Güneş', nameArabic: 'الشروق', time: prayerTimes.sunrise },
    { name: 'Öğle', nameArabic: 'الظهر', time: prayerTimes.dhuhr },
    { name: 'İkindi', nameArabic: 'العصر', time: prayerTimes.asr },
    { name: 'Akşam', nameArabic: 'المغرب', time: prayerTimes.maghrib },
    { name: 'Yatsı', nameArabic: 'العشاء', time: prayerTimes.isha },
  ];
  
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    
    if (prayerMinutes > currentTime) {
      return prayer;
    }
  }
  
  // If all prayers passed, return next day's Fajr
  return prayers[0];
}

export function getTimeUntilPrayer(prayerTime: string): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const [prayerHours, prayerMinutes] = prayerTime.split(':').map(Number);
  
  let targetTime = new Date(now);
  targetTime.setHours(prayerHours, prayerMinutes, 0, 0);
  
  // If prayer time has passed, set to next day
  if (targetTime <= now) {
    targetTime.setDate(targetTime.getDate() + 1);
  }
  
  const diff = targetTime.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
}

export const prayerNames: Record<string, { turkish: string; arabic: string }> = {
  fajr: { turkish: 'İmsak', arabic: 'الفجر' },
  sunrise: { turkish: 'Güneş', arabic: 'الشروق' },
  dhuhr: { turkish: 'Öğle', arabic: 'الظهر' },
  asr: { turkish: 'İkindi', arabic: 'العصر' },
  maghrib: { turkish: 'Akşam', arabic: 'المغرب' },
  isha: { turkish: 'Yatsı', arabic: 'العشاء' },
};
