const EARTH_RADIUS_KM = 6371

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a))
}

export function isWithinAnyRegion(
  lat: number | null,
  lon: number | null,
  centers: { latitude: number; longitude: number; max_radius_km: number }[]
): boolean {
  return regionFromCenters(lat, lon, centers) !== null
}

export function regionFromCenters(
  lat: number | null,
  lon: number | null,
  centers: { name?: string; latitude: number; longitude: number; max_radius_km: number }[]
): string | null {
  if (lat === null || lon === null) return null

  for (const center of centers) {
    if (
      haversineDistanceKm(lat, lon, center.latitude, center.longitude) <=
      center.max_radius_km
    ) {
      return center.name ?? null
    }
  }

  return null
}