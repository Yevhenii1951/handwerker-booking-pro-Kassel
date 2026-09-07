import { describe, expect, it } from "vitest"
import { filterWithinRegion, isOutsideRegion } from "./master-filter"

const KASSEL = { latitude: 51.3127, longitude: 9.4797, max_radius_km: 50 }
const GOETTINGEN = { latitude: 51.5413, longitude: 9.9157, max_radius_km: 50 }

const centers = [KASSEL, GOETTINGEN]

const masters = [
  { id: "kassel", latitude: 51.3127, longitude: 9.4797 }, // Kassel city center
  { id: "goettingen", latitude: 51.5413, longitude: 9.9157 }, // Göttingen
  { id: "hannover", latitude: 52.3759, longitude: 9.732 }, // ~60km, out of zone
  { id: "no-coords", latitude: null, longitude: null },
]

describe("filterWithinRegion", () => {
  it("keeps masters within 50 km of Kassel or Göttingen", () => {
    const result = filterWithinRegion(masters, centers)
    const ids = result.map((m) => m.id)
    expect(ids).toContain("kassel")
    expect(ids).toContain("goettingen")
  })

  it("excludes masters farther than 50 km from both cities", () => {
    expect(filterWithinRegion(masters, centers).map((m) => m.id)).not.toContain(
      "hannover"
    )
  })

  it("excludes masters without coordinates", () => {
    expect(filterWithinRegion(masters, centers).map((m) => m.id)).not.toContain(
      "no-coords"
    )
  })
})

describe("isOutsideRegion", () => {
  it("returns the offenders", () => {
    const outside = isOutsideRegion(masters, centers).map((m) => m.id)
    expect(outside).toContain("hannover")
    expect(outside).toContain("no-coords")
  })
})