import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { getLocales } from 'expo-localization';
import { turkishCities, City } from './data/cities';
import {
  CalculationMethodId,
  CALCULATION_METHODS,
  getAsrFactorForCountry,
  getDefaultMethodForCountry,
} from './prayer-times';

const LOCATION_KEY = 'selected_location';
const METHOD_KEY = 'calc_method';

export type MethodSetting = 'auto' | CalculationMethodId;

export interface SavedLocation {
  city: City;
  district: string;
  countryCode: string;
  /** Fixed UTC offset for the place; unset means "use the device timezone". */
  timezone?: number;
  /** 'gps' locations are refreshed on every launch; 'manual' picks are kept as-is. */
  source?: 'gps' | 'manual';
}

// Turkey has been on permanent UTC+3 since 2016, so Turkish cities keep correct
// times even when the device itself is set to another timezone.
const TURKEY_UTC_OFFSET = 3;

export const DEFAULT_LOCATION: SavedLocation = {
  city: turkishCities.find((c) => c.id === 'istanbul') ?? turkishCities[0],
  district: 'Merkez',
  countryCode: 'TR',
  timezone: TURKEY_UTC_OFFSET,
};

export function turkishCityLocation(
  city: City,
  district?: string,
  source: SavedLocation['source'] = 'manual'
): SavedLocation {
  return {
    city,
    district: district || city.districts[0] || 'Merkez',
    countryCode: 'TR',
    timezone: TURKEY_UTC_OFFSET,
    source,
  };
}

export async function loadSavedLocation(): Promise<SavedLocation | null> {
  try {
    const raw = await AsyncStorage.getItem(LOCATION_KEY);
    return raw ? (JSON.parse(raw) as SavedLocation) : null;
  } catch {
    return null;
  }
}

export async function saveLocation(location: SavedLocation): Promise<void> {
  try {
    await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(location));
  } catch {}
}

export async function loadMethodSetting(): Promise<MethodSetting> {
  try {
    const raw = await AsyncStorage.getItem(METHOD_KEY);
    if (raw && (raw === 'auto' || raw in CALCULATION_METHODS)) return raw as MethodSetting;
  } catch {}
  return 'auto';
}

export async function saveMethodSetting(setting: MethodSetting): Promise<void> {
  try {
    await AsyncStorage.setItem(METHOD_KEY, setting);
  } catch {}
}

export function resolveMethod(setting: MethodSetting, countryCode: string) {
  const method = setting === 'auto' ? getDefaultMethodForCountry(countryCode) : setting;
  const asrFactor = setting === 'auto' ? getAsrFactorForCountry(countryCode, method) : CALCULATION_METHODS[method].asrFactor;
  return { method, asrFactor };
}

export function getDeviceRegion(): string | null {
  try {
    return getLocales()[0]?.regionCode ?? null;
  } catch {
    return null;
  }
}

function nearestTurkishCity(latitude: number, longitude: number): City {
  let nearest = turkishCities[0];
  let minDistance = Infinity;
  for (const city of turkishCities) {
    const distance = Math.hypot(city.latitude - latitude, city.longitude - longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }
  return nearest;
}

/**
 * Resolves the device's GPS position. Inside Turkey it snaps to the Diyanet
 * city/district list; anywhere else it keeps the exact coordinates.
 * With prompt=false it never shows the permission dialog (silent refresh).
 * Returns null when permission is denied or the position is unavailable.
 */
export async function locateWithGps({ prompt = true }: { prompt?: boolean } = {}): Promise<SavedLocation | null> {
  const permission = prompt
    ? await Location.requestForegroundPermissionsAsync()
    : await Location.getForegroundPermissionsAsync();
  if (permission.status !== 'granted') return null;

  // A recent cached fix makes launch fast; fall back to a fresh reading.
  const position =
    (await Location.getLastKnownPositionAsync({ maxAge: 30 * 60 * 1000 }).catch(() => null)) ??
    (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
  const { latitude, longitude } = position.coords;

  let place: Location.LocationGeocodedAddress | undefined;
  try {
    [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
  } catch {}

  const countryCode = (place?.isoCountryCode ?? getDeviceRegion() ?? '').toUpperCase();

  if (countryCode === 'TR') {
    const city = nearestTurkishCity(latitude, longitude);
    const districtCandidate = place?.subregion ?? place?.district ?? '';
    const district =
      city.districts.find((d) => d.toLocaleLowerCase('tr') === districtCandidate.toLocaleLowerCase('tr')) ??
      city.districts[0] ??
      'Merkez';
    return turkishCityLocation(city, district, 'gps');
  }

  const cityName = place?.city ?? place?.subregion ?? place?.region ?? `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  return {
    city: { id: 'gps', name: cityName, latitude, longitude, districts: [] },
    district: [place?.region, place?.country].filter((part) => part && part !== cityName).join(', '),
    countryCode,
    source: 'gps',
  };
}
