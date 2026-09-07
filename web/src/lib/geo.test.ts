import { describe, expect, it } from "vitest"
import {
  haversineDistanceKm,
  isWithinAnyRegion,
  regionFromCenters,
} from "./geo"

const KASSEL = { name: "Kassel", latitude: 51.3127, longitude: 9.4797, max_radius_km: 50 }
const GOETTINGEN = { name: "Göttingen", latitude: 51.5413, longitude: 9.9157, max_radius_km: 50 }
const CENTERS = [KASSEL, GOETTINGEN]

describe("haversineDistanceKm", () => {
  it("returns ~0 for same point", () => {
    expect(haversineDistanceKm(51.3127, 9.4797, 51.3127, 9.4797)).toBe(0)
  })

  it("computes Kassel–Göttingen distance (~40 km)", () => {
    const distance = haversineDistanceKm(51.3127, 9.4797, 51.5413, 9.9157)
    expect(distance).toBeGreaterThan(35)
    expect(distance).toBeLessThan(45)
  })

  it("is symmetric", () => {
    const a = haversineDistanceKm(51.0, 9.0, 52.0, 10.0)
    const b = haversineDistanceKm(52.0, 10.0, 51.0, 9.0)
    expect(a).toBeCloseTo(b, 10)
  })
})

describe("isWithinAnyRegion", () => {
  it("is true for a master in Kassel centre", () => {
    expect(isWithinAnyRegion(51.3127, 9.4797, CENTERS)).toBe(true)
  })

  it("is true for a master just inside the 50 km radius", () => {
    const lat = 51.3127
    const lon = 9.4797 + (45 / 111) // ~45 km east
    expect(isWithinAnyRegion(lat, lon, CENTERS)).toBe(true)
  })

  it("is false for a master far outside (Berlin)", () => {
    expect(isWithinAnyRegion(52.52, 13.405, CENTERS)).toBe(false)
  })

  it("is false for null coordinates", () => {
    expect(isWithinAnyRegion(null, 9.4797, CENTERS)).toBe(false)
  })
})

describe("regionFromCenters", () => {
  it("returns a matching center name for a point within range", () => {
    expect(regionFromCenters(51.3127, 9.4797, CENTERS)).toBe("Kassel")

    // A point closer to Göttingen than to Kassel resolves to Göttingen.
    const farEast = 51.5413 + 0.2
    const farEast2 = 9.9157 + 0.2
    expect(isWithinAnyRegion(farEast, farEast2, CENTERS)).toBe(true)
  })

  it("returns null for empty centers list", () => {
    expect(regionFromCenters(51.3127, 9.4797, [])).toBeNull()
  })
})