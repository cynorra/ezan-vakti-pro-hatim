// OpenStreetMap Overpass API — ücretsiz, API anahtarı gerektirmez.
// amenity=place_of_worship + religion=muslim olan noktaları döner.

export interface NearbyMosque {
  id: number;
  /** Empty when the mosque has no name in OSM; the screen shows a localized fallback. */
  name: string;
  lat: number;
  lon: number;
  distanceKm: number;
}

// Public instances; the next one is tried when one is down or slow.
const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];
const REQUEST_TIMEOUT_MS = 15000;
const MAX_RESULTS = 50;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

async function queryOverpass(query: string): Promise<any[]> {
  let lastError: unknown;
  for (const url of OVERPASS_URLS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: query,
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Overpass API error: ${response.status}`);
      const data = await response.json();
      return data.elements || [];
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError ?? new Error('Overpass API unavailable');
}

async function searchRadius(latitude: number, longitude: number, radiusMeters: number, language: string) {
  // Most mosques are mapped as building outlines (ways), not points: search nodes,
  // ways and relations and use the centre of areas. No output limit here, so the
  // nearest ones cannot be cut off before sorting by distance.
  const query = `[out:json][timeout:15];
    nwr["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${latitude},${longitude});
    out center tags;`;
  const elements = await queryOverpass(query);

  return elements
    .map((el) => {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      if (typeof lat !== 'number' || typeof lon !== 'number') return null;
      return {
        id: el.id,
        name: el.tags?.[`name:${language}`] || el.tags?.name || '',
        lat,
        lon,
        distanceKm: haversineKm(latitude, longitude, lat, lon),
      };
    })
    .filter((m): m is NearbyMosque => m !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, MAX_RESULTS);
}

export async function fetchNearbyMosques(
  latitude: number,
  longitude: number,
  language = 'en'
): Promise<NearbyMosque[]> {
  const lang = language.split('-')[0];
  const nearby = await searchRadius(latitude, longitude, 3000, lang);
  // Rural areas: widen the search instead of showing an empty list.
  return nearby.length > 0 ? nearby : searchRadius(latitude, longitude, 10000, lang);
}
