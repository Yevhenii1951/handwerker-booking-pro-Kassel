import { addMinutes, setHours, setMinutes } from "date-fns"

export interface TimeSlot {
  startAt: Date
  endAt: Date
}

export interface WorkingDay {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface TimePeriod {
  start_at: string
  end_at: string
}

/**
 * Generate bookable slots for a master on a given day based on fixed working
 * hours and service duration. Slots overlapping a confirmed booking or a
 * blocked time are skipped. Pending/declined/cancelled bookings do not block.
 */
export function generateSlotsForDay(
  day: Date,
  workingDays: WorkingDay[],
  serviceDurationMinutes: number,
  confirmedBookings: TimePeriod[],
  blockedTimes: TimePeriod[]
): TimeSlot[] {
  const schedule = workingDays.find((w) => w.dayOfWeek === day.getDay())
  if (!schedule) return []

  const [startH, startM] = schedule.startTime.split(":").map(Number)
  const [endH, endM] = schedule.endTime.split(":").map(Number)
  const workStart = setMinutes(setHours(day, startH), startM)
  const workEnd = setMinutes(setHours(day, endH), endM)

  const slots: TimeSlot[] = []
  let cursor = workStart

  while (addMinutes(cursor, serviceDurationMinutes) <= workEnd) {
    const endAt = addMinutes(cursor, serviceDurationMinutes)

    const isBlocked = confirmedBookings.some((b) =>
      overlaps(b, cursor, endAt)
    )
    const isUnavailable = blockedTimes.some((b) => overlaps(b, cursor, endAt))

    if (!isBlocked && !isUnavailable) {
      slots.push({ startAt: cursor, endAt })
    }

    cursor = endAt
  }

  return slots
}

export function overlaps(
  existing: TimePeriod,
  newStart: Date,
  newEnd: Date
): boolean {
  const existingStart = new Date(existing.start_at)
  const existingEnd = new Date(existing.end_at)
  return newStart < existingEnd && newEnd > existingStart
}