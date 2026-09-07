import { addDays } from "date-fns"

export const BOOKING_WINDOW_DAYS = 14

export function todayBerlin(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
  }).format(new Date())
}

export function utcDayFromString(day: string): Date {
  const [year, month, date] = day.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, date))
}

export function windowDays(start: string, count: number): string[] {
  const days: string[] = []
  let cursor = utcDayFromString(start)
  for (let i = 0; i < count; i++) {
    days.push(cursor.toISOString().slice(0, 10))
    cursor = addDays(cursor, 1)
  }
  return days
}

export function dayLabel(day: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(utcDayFromString(day))
}