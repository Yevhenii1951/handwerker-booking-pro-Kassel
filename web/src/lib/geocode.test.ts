import { afterEach, describe, expect, it, vi } from "vitest"
import { getPlaceFromPlz } from "./geocode"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("getPlaceFromPlz", () => {
  it("returns coordinates for a known PLZ", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify([
            { lat: "51.3159661", lon: "9.4916103", display_name: "34117, Mitte, Kassel, Hessen, Deutschland" },
          ]),
          { status: 200 }
        )
      )
    )

    const place = await getPlaceFromPlz("34117")

    expect(place).toEqual({
      latitude: 51.3159661,
      longitude: 9.4916103,
      city: "Kassel",
    })
  })

  it("prefers the user-provided city name", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify([
            { lat: "51.5413", lon: "9.9157", display_name: "37073, Innenstadt, Göttingen, Niedersachsen, Deutschland" },
          ]),
          { status: 200 }
        )
      )
    )

    const place = await getPlaceFromPlz("37073", "Göttingen")

    expect(place?.city).toBe("Göttingen")
    expect(place?.latitude).toBe(51.5413)
  })

  it("returns null when no result matches", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("[]", { status: 200 })))

    const place = await getPlaceFromPlz("00000")

    expect(place).toBeNull()
  })

  it("returns null when the geocoder fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("error", { status: 503 })))

    const place = await getPlaceFromPlz("34117")

    expect(place).toBeNull()
  })
})