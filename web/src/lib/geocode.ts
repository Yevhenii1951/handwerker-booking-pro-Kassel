import "server-only"

export interface GeocodedPlace {
  latitude: number
  longitude: number
  city: string
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

interface NominatimResult {
  lat: string
  lon: string
  display_name: string
}

/**
 * Resolve a German PLZ to coordinates via Nominatim (OpenStreetMap).
 * Returns null when the PLZ is unknown or the geocoder fails.
 * Server-side only: behind the API key and never exposed to the client.
 */
/**
 * Resolve a German PLZ (optionally combined with a city name) to coordinates
 * via Nominatim (OpenStreetMap). Returns null when unknown or on failure.
 * Server-side only: marked with "server-only", never imported by client code.
 */
export async function getPlaceFromPlz(
  plz: string,
  city?: string
): Promise<GeocodedPlace | null> {
  const url = new URL(NOMINATIM_URL)
  url.searchParams.set("format", "json")
  url.searchParams.set("countrycodes", "de")
  url.searchParams.set("q", city ? `${plz} ${city}` : plz)
  url.searchParams.set("limit", "1")

  const response = await fetch(url, {
    headers: {
      "User-Agent": "handwerker-booking-pro/0.1 (training project)",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  const results = (await response.json()) as NominatimResult[]
  const match = results[0]
  if (!match) return null

  return {
    latitude: Number(match.lat),
    longitude: Number(match.lon),
    city: cityResult(match, city),
  }
}

/**
 * Prefer the user-provided city when present; otherwise fall back to parsing
 * the display name (e.g. "34117, Mitte, Kassel, Hessen, Deutschland" → "Kassel").
 */
function cityResult(match: NominatimResult, userCity?: string): string {
  if (userCity) return userCity
  const parts: string[] = match.display_name.split(", ")
  return parts.length >= 3 ? parts[2] : parts[0]
}