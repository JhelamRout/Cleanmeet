/**
 * Geographic utility functions for CleanMeet
 */

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates distance in kilometers between two lat/lng coordinates using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Maximum allowed search radius constraint
 */
export const MAX_SEARCH_RADIUS_KM = 50;

/**
 * Default search radius if unspecified
 */
export const DEFAULT_SEARCH_RADIUS_KM = 20;

/**
 * Quick preset choices for distance selection
 */
export const RADIUS_PRESETS = [
  { km: 5, label: '5 km', desc: 'Walking / Cycling' },
  { km: 15, label: '15 km', desc: 'Nearby Neighborhoods' },
  { km: 30, label: '30 km', desc: 'Wider Metro' },
  { km: 50, label: '50 km', desc: 'Max Engagement Zone' },
];
