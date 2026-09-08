"use server"

import { getPlaceFromPlz } from "@/lib/geocode"
import { isWithinAnyRegion } from "@/lib/geo"
import { createClient } from "@/lib/supabase/server"

export type RegionCheckResult =
  | { ok: true; latitude: number; longitude: number; city: string }
  | { ok: false; error: string }

export async function checkMasterRegion(
  plz: string,
  city: string
): Promise<RegionCheckResult> {
  const place = await getPlaceFromPlz(plz, city)
  if (!place) {
    return { ok: false, error: "Die PLZ konnte nicht zugeordnet werden." }
  }

  const supabase = await createClient()
  const { data: centers } = await supabase
    .from("region_centers")
    .select("name, latitude, longitude, max_radius_km")

  const inRegion = isWithinAnyRegion(
    place.latitude,
    place.longitude,
    centers ?? []
  )
  if (!inRegion) {
    return {
      ok: false,
      error:
        "Ihr Standort liegt außerhalb unseres Servicegebiets (max. 50 km um Kassel oder Göttingen).",
    }
  }

  return {
    ok: true,
    latitude: place.latitude,
    longitude: place.longitude,
    city: place.city,
  }
}
