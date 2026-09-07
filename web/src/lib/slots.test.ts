import { describe, expect, it } from "vitest"
import { generateSlotsForDay, overlaps } from "./slots"

describe("generateSlotsForDay", () => {
  const workingHours = [
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
  ]

  it("generates slots from 09:00 to 17:00 for a 60-minute service", () => {
    const day = new Date(2026, 8, 7) // Monday
    const slots = generateSlotsForDay(day, workingHours, 60, [], [])

    expect(slots).toHaveLength(8)
    expect(slots[0].startAt.getHours()).toBe(9)
    expect(slots[7].startAt.getHours()).toBe(16)
  })

  it("returns empty when the day is not a working day", () => {
    const sunday = new Date(2026, 8, 6) // Sunday
    const slots = generateSlotsForDay(sunday, workingHours, 60, [], [])

    expect(slots).toHaveLength(0)
  })

  it("uses 30-minute steps for a 30-minute service", () => {
    const day = new Date(2026, 8, 7)
    const slots = generateSlotsForDay(day, workingHours, 30, [], [])

    expect(slots[0].startAt.toTimeString().slice(0, 5)).toBe("09:00")
    expect(slots[1].startAt.toTimeString().slice(0, 5)).toBe("09:30")
  })

  it("skips slots overlapping a confirmed booking", () => {
    const day = new Date(2026, 8, 7)
    const confirmed = [
      {
        start_at: "2026-09-07T10:00:00Z",
        end_at: "2026-09-07T11:00:00Z",
      },
    ]
    const slots = generateSlotsForDay(day, workingHours, 60, confirmed, [])

    expect(slots).toHaveLength(7)
    expect(slots.some((s) => s.startAt.getUTCHours() === 10)).toBe(false)
  })

  it("skips slots overlapping a blocked time", () => {
    const day = new Date(2026, 8, 7)
    const blocked = [
      {
        start_at: "2026-09-07T12:00:00Z",
        end_at: "2026-09-07T13:00:00Z",
      },
    ]
    const slots = generateSlotsForDay(day, workingHours, 60, [], blocked)

    expect(slots.some((s) => s.startAt.getUTCHours() === 12)).toBe(false)
  })

  it("does not block on slots when no confirmed bookings overlap", () => {
    const day = new Date(2026, 8, 7)

    // 8 slots from 09:00 to 16:00; empty confirmed → nothing blocked.
    expect(generateSlotsForDay(day, workingHours, 60, [], [])).toHaveLength(8)
  })
})

describe("overlaps", () => {
  it("detects a pure overlap", () => {
    expect(
      overlaps(
        { start_at: "2026-09-07T10:00:00Z", end_at: "2026-09-07T11:00:00Z" },
        new Date("2026-09-07T10:30:00Z"),
        new Date("2026-09-07T11:30:00Z")
      )
    ).toBe(true)
  })

  it("returns false for a directly adjacent (non-overlapping) interval", () => {
    expect(
      overlaps(
        { start_at: "2026-09-07T10:00:00Z", end_at: "2026-09-07T11:00:00Z" },
        new Date("2026-09-07T11:00:00Z"),
        new Date("2026-09-07T12:00:00Z")
      )
    ).toBe(false)
  })
})