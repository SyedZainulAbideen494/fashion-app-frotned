// randomLocation.js

const SAMPLE_LOCATIONS = [
  { name: 'New York, US', latitude: 40.7128, longitude: -74.0060 },
  { name: 'London, UK', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo, JP', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Sydney, AU', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Berlin, DE', latitude: 52.5200, longitude: 13.4050 },
  { name: 'Toronto, CA', latitude: 43.6532, longitude: -79.3832 },
  { name: 'Mumbai, IN', latitude: 19.0760, longitude: 72.8777 },
  { name: 'São Paulo, BR', latitude: -23.5558, longitude: -46.6396 },
  { name: 'Cape Town, ZA', latitude: -33.9249, longitude: 18.4241 },
  { name: 'Dubai, AE', latitude: 25.2048, longitude: 55.2708 }
];

// ✅ Pick random location from list
export function getRandomLocation() {
  const idx = Math.floor(Math.random() * SAMPLE_LOCATIONS.length);
  return SAMPLE_LOCATIONS[idx];
}

// 📍 Helper to reverse geocode lat/lon → city name using Nominatim API
async function reverseGeocode(latitude, longitude) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await res.json();
    // Try different properties (city, town, village) because it varies by location
    const placeName =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.display_name ||
      'Unknown Location';
    return placeName;
  } catch (err) {
    console.warn('Reverse geocoding failed:', err);
    return 'Unknown Location';
  }
}

// 📍 Get user’s location + name (or fallback random)
export function getUserOrRandomLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(getRandomLocation());
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const name = await reverseGeocode(latitude, longitude);
        resolve({ latitude, longitude, name });
      },
      (err) => {
        console.warn('Geolocation failed or denied, using random location:', err);
        resolve(getRandomLocation());
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  });
}

// 📃 Return sample list
export function listSampleLocations() {
  return SAMPLE_LOCATIONS.slice();
}
