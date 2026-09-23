// Prayer times calculation based on location and date.
// Astronomy follows the standard praytimes.org / USNO approximation (accurate to
// well under a minute). Each country's official method (angles + temkin offsets)
// is selected via CALCULATION_METHODS, defaulting to Diyanet for Turkey.

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export type CalculationMethodId =
  | 'diyanet'
  | 'kemenag'
  | 'jakim'
  | 'muis'
  | 'mwl'
  | 'isna'
  | 'egypt'
  | 'karachi'
  | 'ummAlQura'
  | 'dubai'
  | 'qatar'
  | 'kuwait'
  | 'gulf'
  | 'tehran'
  | 'russia'
  | 'france';

type PrayerKey = keyof PrayerTimes;

interface CalculationMethod {
  name: string;
  fajrAngle: number;
  /** Degrees below horizon, or minutes after maghrib when ishaMinutes is set. */
  ishaAngle?: number;
  ishaMinutes?: number;
  /** Maghrib by angle instead of sunset (Tehran). */
  maghribAngle?: number;
  /** Asr shadow factor: 1 = Shafi'i/Maliki/Hanbali, 2 = Hanafi. */
  asrFactor: 1 | 2;
  /** Temkin/ihtiyat offsets in minutes, applied after calculation. */
  offsets?: Partial<Record<PrayerKey, number>>;
}

export const CALCULATION_METHODS: Record<CalculationMethodId, CalculationMethod> = {
  diyanet: {
    name: 'Diyanet İşleri Başkanlığı (Türkiye)',
    fajrAngle: 18,
    ishaAngle: 17,
    asrFactor: 1,
    offsets: { sunrise: -7, dhuhr: 5, asr: 4, maghrib: 7 },
  },
  kemenag: { name: 'Kemenag (Indonesia)', fajrAngle: 20, ishaAngle: 18, asrFactor: 1 },
  jakim: { name: 'JAKIM (Malaysia)', fajrAngle: 20, ishaAngle: 18, asrFactor: 1 },
  muis: { name: 'MUIS (Singapore)', fajrAngle: 20, ishaAngle: 18, asrFactor: 1 },
  mwl: { name: 'Muslim World League', fajrAngle: 18, ishaAngle: 17, asrFactor: 1 },
  isna: { name: 'ISNA (North America)', fajrAngle: 15, ishaAngle: 15, asrFactor: 1 },
  egypt: { name: 'Egyptian General Authority', fajrAngle: 19.5, ishaAngle: 17.5, asrFactor: 1 },
  karachi: { name: 'University of Islamic Sciences, Karachi', fajrAngle: 18, ishaAngle: 18, asrFactor: 2 },
  ummAlQura: { name: 'Umm al-Qura (Makkah)', fajrAngle: 18.5, ishaMinutes: 90, asrFactor: 1 },
  dubai: { name: 'Dubai (UAE)', fajrAngle: 18.2, ishaAngle: 18.2, asrFactor: 1 },
  qatar: { name: 'Qatar', fajrAngle: 18, ishaMinutes: 90, asrFactor: 1 },
  kuwait: { name: 'Kuwait', fajrAngle: 18, ishaAngle: 17.5, asrFactor: 1 },
  gulf: { name: 'Gulf Region', fajrAngle: 19.5, ishaMinutes: 90, asrFactor: 1 },
  tehran: { name: 'Institute of Geophysics, Tehran', fajrAngle: 17.7, ishaAngle: 14, maghribAngle: 4.5, asrFactor: 1 },
  russia: { name: 'Spiritual Administration of Muslims of Russia', fajrAngle: 16, ishaAngle: 15, asrFactor: 1 },
  france: { name: 'UOIF (France)', fajrAngle: 12, ishaAngle: 12, asrFactor: 1 },
};

export const CALCULATION_METHOD_IDS = Object.keys(CALCULATION_METHODS) as CalculationMethodId[];

const COUNTRY_METHODS: Record<string, CalculationMethodId> = {
  TR: 'diyanet', CY: 'diyanet',
  ID: 'kemenag',
  MY: 'jakim', BN: 'jakim',
  SG: 'muis',
  SA: 'ummAlQura', YE: 'ummAlQura',
  AE: 'dubai',
  QA: 'qatar',
  KW: 'kuwait',
  BH: 'gulf', OM: 'gulf',
  EG: 'egypt', SD: 'egypt', LY: 'egypt', SY: 'egypt', LB: 'egypt', JO: 'egypt', PS: 'egypt', IQ: 'egypt',
  PK: 'karachi', IN: 'karachi', BD: 'karachi', AF: 'karachi',
  US: 'isna', CA: 'isna',
  IR: 'tehran',
  RU: 'russia',
  FR: 'france',
};

// Hanafi Asr is the norm in South/Central Asia even where the angles differ.
const HANAFI_COUNTRIES = new Set(['PK', 'IN', 'BD', 'AF', 'UZ', 'KZ', 'TJ', 'KG', 'TM']);

export function getDefaultMethodForCountry(countryCode?: string | null): CalculationMethodId {
  if (!countryCode) return 'mwl';
  return COUNTRY_METHODS[countryCode.toUpperCase()] ?? 'mwl';
}

export function getAsrFactorForCountry(countryCode: string | null | undefined, method: CalculationMethodId): 1 | 2 {
  if (countryCode && HANAFI_COUNTRIES.has(countryCode.toUpperCase())) return 2;
  return CALCULATION_METHODS[method].asrFactor;
}

const dsin = (d: number) => Math.sin((d * Math.PI) / 180);
const dcos = (d: number) => Math.cos((d * Math.PI) / 180);
const dtan = (d: number) => Math.tan((d * Math.PI) / 180);
const darcsin = (x: number) => (Math.asin(x) * 180) / Math.PI;
const darccos = (x: number) => (Math.acos(x) * 180) / Math.PI;
const darctan2 = (y: number, x: number) => (Math.atan2(y, x) * 180) / Math.PI;
const darccot = (x: number) => (Math.atan(1 / x) * 180) / Math.PI;
const fix = (a: number, b: number) => {
  const r = a - b * Math.floor(a / b);
  return r < 0 ? r + b : r;
};

function julianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

function sunPosition(jd: number): { declination: number; equation: number } {
  const d = jd - 2451545.0;
  const g = fix(357.529 + 0.98560028 * d, 360);
  const q = fix(280.459 + 0.98564736 * d, 360);
  const l = fix(q + 1.915 * dsin(g) + 0.02 * dsin(2 * g), 360);
  const e = 23.439 - 0.00000036 * d;
  const ra = darctan2(dcos(e) * dsin(l), dcos(l)) / 15;
  return {
    declination: darcsin(dsin(e) * dsin(l)),
    equation: q / 15 - fix(ra, 24),
  };
}

function formatTime(hours: number, rounding: 'nearest' | 'up' | 'down' = 'nearest'): string {
  if (!Number.isFinite(hours)) return '--:--';
  // Small epsilon keeps exact-minute values from being pushed a whole minute by float noise.
  const raw = hours * 60;
  const rounded = rounding === 'up' ? Math.ceil(raw - 1e-6) : rounding === 'down' ? Math.floor(raw + 1e-6) : Math.round(raw);
  const totalMinutes = fix(rounded, 24 * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export interface PrayerTimesOptions {
  method?: CalculationMethodId;
  /** Overrides the method's Asr factor (e.g. Hanafi in Pakistan). */
  asrFactor?: 1 | 2;
  /** UTC offset in hours. Defaults to the device offset on that date. */
  timezone?: number;
  /** Umm al-Qura style methods use 120 minutes (not 90) for Isha in Ramadan. */
  ramadan?: boolean;
}

export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
  options: PrayerTimesOptions = {}
): PrayerTimes {
  const method = CALCULATION_METHODS[options.method ?? 'diyanet'];
  const asrFactor = options.asrFactor ?? method.asrFactor;
  const timezone = options.timezone ?? -date.getTimezoneOffset() / 60;

  const baseJd = julianDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) - longitude / 360;

  // Each time is refined once using the sun position at its own approximate moment.
  const sunAt = (hourGuess: number) => sunPosition(baseJd + hourGuess / 24);
  const midDay = (hourGuess: number) => fix(12 - sunAt(hourGuess).equation, 24);
  const sunAngleTime = (angle: number, hourGuess: number, ccw: boolean) => {
    const decl = sunAt(hourGuess).declination;
    const noon = midDay(hourGuess);
    const cosT = (-dsin(angle) - dsin(decl) * dsin(latitude)) / (dcos(decl) * dcos(latitude));
    if (cosT < -1 || cosT > 1) return NaN; // sun never reaches this angle (high latitude)
    const t = darccos(cosT) / 15;
    return noon + (ccw ? -t : t);
  };
  const asrTime = (factor: number, hourGuess: number) => {
    const decl = sunAt(hourGuess).declination;
    const angle = -darccot(factor + dtan(Math.abs(latitude - decl)));
    return sunAngleTime(angle, hourGuess, false);
  };

  // Times are local mean solar hours until the final timezone shift. A second
  // pass re-evaluates each time with the sun position at its first estimate.
  const orFallback = (value: number, guess: number) => (Number.isFinite(value) ? value : guess);
  const refine = (compute: (guess: number) => number, guess: number) => compute(orFallback(compute(guess), guess));

  let fajr = refine((g) => sunAngleTime(method.fajrAngle, g, true), 5);
  const sunrise = refine((g) => sunAngleTime(0.833, g, true), 6);
  const dhuhr = refine(midDay, 12);
  const asr = refine((g) => asrTime(asrFactor, g), 13);
  const sunset = refine((g) => sunAngleTime(0.833, g, false), 18);
  const maghrib =
    method.maghribAngle !== undefined ? refine((g) => sunAngleTime(method.maghribAngle!, g, false), 18) : sunset;
  let isha =
    method.ishaMinutes !== undefined
      ? maghrib + (method.ishaMinutes + (options.ramadan && method.ishaMinutes === 90 ? 30 : 0)) / 60
      : refine((g) => sunAngleTime(method.ishaAngle ?? 17, g, false), 18);

  // High latitudes: when the sun never reaches the angle, use the angle-based
  // night portion rule (fraction angle/60 of the night).
  const night = fix(sunrise - sunset, 24);
  const maxFajrGap = (method.fajrAngle / 60) * night;
  if (!Number.isFinite(fajr) || fix(sunrise - fajr, 24) > maxFajrGap) fajr = sunrise - maxFajrGap;
  if (method.ishaMinutes === undefined) {
    const maxIshaGap = ((method.ishaAngle ?? 17) / 60) * night;
    if (!Number.isFinite(isha) || fix(isha - sunset, 24) > maxIshaGap) isha = sunset + maxIshaGap;
  }

  const shift = timezone - longitude / 15;
  const offsets = method.offsets ?? {};
  // Round to the safe side: imsak (start of fasting) and sunrise (end of Fajr) down,
  // every other prayer start up.
  const finalize = (key: PrayerKey, value: number) =>
    formatTime(value + shift + (offsets[key] ?? 0) / 60, key === 'fajr' || key === 'sunrise' ? 'down' : 'up');

  return {
    fajr: finalize('fajr', fajr),
    sunrise: finalize('sunrise', sunrise),
    dhuhr: finalize('dhuhr', dhuhr),
    asr: finalize('asr', asr),
    maghrib: finalize('maghrib', maghrib),
    isha: finalize('isha', isha),
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
