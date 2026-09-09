// OpenStreetMap Overpass API — ücretsiz, API anahtarı gerektirmez.
// amenity=place_of_worship + religion=muslim olan noktaları döner.

export interface NearbyMosque {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distanceKm: number;
}

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export async function fetchNearbyMosques(
  latitude: number,
  longitude: number,
  radiusMeters = 3000
): Promise<NearbyMosque[]> {
  const query = `[out:json][timeout:15];
    node["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${latitude},${longitude});
    out body ${30};`;

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`);
  }

  const data = await response.json();
  const elements: any[] = data.elements || [];

  return elements
    .map((el) => ({
      id: el.id,
      name: el.tags?.name || el.tags?.['name:tr'] || 'Cami',
      lat: el.lat,
      lon: el.lon,
      distanceKm: haversineKm(latitude, longitude, el.lat, el.lon),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
