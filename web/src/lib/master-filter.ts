import { isWithinAnyRegion } from "./geo"

export interface RegionCenter {
  latitude: number
  longitude: number
  max_radius_km: number
}

export interface LocatableMaster {
  id: string
  latitude: number | null
  longitude: number | null
}

export function filterWithinRegion<T extends LocatableMaster>(
  masters: T[],
  centers: RegionCenter[]
): T[] {
  return masters.filter((m) =>
    isWithinAnyRegion(m.latitude, m.longitude, centers)
  )
}

export function isOutsideRegion<T extends LocatableMaster>(
  masters: T[],
  centers: RegionCenter[]
): T[] {
  return masters.filter((m) =>
    !isWithinAnyRegion(m.latitude, m.longitude, centers)
  )
}