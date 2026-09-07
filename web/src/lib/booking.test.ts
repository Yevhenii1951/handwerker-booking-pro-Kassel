import { describe, expect, it } from "vitest"
import { windowDays, utcDayFromString, dayLabel } from "./booking"

describe("utcDayFromString", () => {
  it("builds a UTC midnight date from a YYYY-MM-DD string", () => {
    const date = utcDayFromString("2026-09-07")
    expect(date.toISOString()).toBe("2026-09-07T00:00:00.000Z")
    expect(date.getDay()).toBe(1) // Monday
  })
})

describe("windowDays", () => {
  it("generates a consecutive count of days from a start", () => {
    const days = windowDays("2026-09-07", 3)
    expect(days).toEqual(["2026-09-07", "2026-09-08", "2026-09-09"])
  })

  it("crosses month boundaries", () => {
    const days = windowDays("2026-09-28", 5)
    expect(days.at(-1)).toBe("2026-10-02")
  })
})

describe("dayLabel", () => {
  it("formats a weekday, day and month in German", () => {
    expect(dayLabel("2026-09-07")).toMatch(/Montag/)
  })
})