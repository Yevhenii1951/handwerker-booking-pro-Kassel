"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { generateSlotsForDay } from "@/lib/slots"
import {
  BOOKING_WINDOW_DAYS,
  dayLabel,
  todayBerlin,
  utcDayFromString,
  windowDays,
} from "@/lib/booking"

export interface SlotDay {
  date: string
  dayLabel: string
  slots: { startAt: string; endAt: string }[]
}

export type SlotsResult = SlotDay[] | { error: string }

export async function getAvailableSlots(
  serviceId: string
): Promise<SlotsResult> {
  const supabase = await createClient()

  const { data: service } = await supabase
    .from("services")
    .select("id, master_id, duration_minutes")
    .eq("id", serviceId)
    .maybeSingle()

  if (!service) return { error: "Leistung nicht gefunden." }

  const masterId = service.master_id
  const days = windowDays(todayBerlin(), BOOKING_WINDOW_DAYS)
  const fromIso = utcDayFromString(days[0]).toISOString()
  const toIso = utcDayFromString(days.at(-1)!).toISOString()

  const [{ data: hours }, { data: confirmed }, { data: blocked }] =
    await Promise.all([
      supabase
        .from("working_hours")
        .select("day_of_week, start_time, end_time")
        .eq("master_id", masterId),
      supabase
        .from("public_confirmed_slots")
        .select("start_at, end_at")
        .eq("master_id", masterId)
        .gte("start_at", fromIso)
        .lt("start_at", toIso),
      supabase
        .from("blocked_times")
        .select("start_at, end_at")
        .eq("master_id", masterId)
        .gte("start_at", fromIso)
        .lt("start_at", toIso),
    ])

  const workingDays = (hours ?? []).map((h) => ({
    dayOfWeek: h.day_of_week,
    startTime: h.start_time,
    endTime: h.end_time,
  }))

  const result: SlotDay[] = []
  for (const day of days) {
    const slots = generateSlotsForDay(
      utcDayFromString(day),
      workingDays,
      service.duration_minutes,
      confirmed ?? [],
      blocked ?? []
    )
    if (slots.length === 0) continue

    result.push({
      date: day,
      dayLabel: dayLabel(day),
      slots: slots.map((s) => ({
        startAt: s.startAt.toISOString(),
        endAt: s.endAt.toISOString(),
      })),
    })
  }

  return result
}

const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  startAt: z.string().datetime(),
  phone: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(400).optional(),
})

export type BookingResult =
  | { ok: true; bookingId: string }
  | { ok: false; error: string; loginRequired?: boolean }

export async function createBooking(input: {
  serviceId: string
  startAt: string
  phone?: string
  notes?: string
}): Promise<BookingResult> {
  const user = await getCurrentUser()
  if (!user) {
    return { ok: false, error: "Bitte melden Sie sich an.", loginRequired: true }
  }

  const parsed = bookingSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." }
  }

  const { serviceId, startAt, phone, notes } = parsed.data
  const start = new Date(startAt)
  if (Number.isNaN(start.getTime())) {
    return { ok: false, error: "Ungültiger Termin." }
  }
  if (start.getTime() <= Date.now()) {
    return { ok: false, error: "Der Termin liegt in der Vergangenheit." }
  }

  const day = startAt.slice(0, 10)
  const dayStartIso = utcDayFromString(day).toISOString()
  const nextDayIso = utcDayFromString(windowDays(day, 2)[1]).toISOString()

  const supabase = await createClient()

  const { data: service } = await supabase
    .from("services")
    .select("id, master_id, duration_minutes")
    .eq("id", serviceId)
    .maybeSingle()
  if (!service) return { ok: false, error: "Leistung nicht gefunden." }

  const masterId = service.master_id
  const [{ data: master }, { data: hours }, { data: confirmed }, { data: blocked }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id")
        .eq("id", masterId)
        .eq("role", "master")
        .eq("master_status", "active")
        .maybeSingle(),
      supabase
        .from("working_hours")
        .select("day_of_week, start_time, end_time")
        .eq("master_id", masterId),
      supabase
        .from("public_confirmed_slots")
        .select("start_at, end_at")
        .eq("master_id", masterId)
        .gte("start_at", dayStartIso)
        .lt("start_at", nextDayIso),
      supabase
        .from("blocked_times")
        .select("start_at, end_at")
        .eq("master_id", masterId)
        .gte("start_at", dayStartIso)
        .lt("start_at", nextDayIso),
    ])

  if (!master) {
    return { ok: false, error: "Der Betrieb steht nicht zur Buchung zur Verfügung." }
  }

  const workingDays = (hours ?? []).map((h) => ({
    dayOfWeek: h.day_of_week,
    startTime: h.start_time,
    endTime: h.end_time,
  }))

  const slots = generateSlotsForDay(
    utcDayFromString(day),
    workingDays,
    service.duration_minutes,
    confirmed ?? [],
    blocked ?? []
  )

  const slot = slots.find((s) => s.startAt.toISOString() === start.toISOString())
  if (!slot) {
    return { ok: false, error: "Dieser Termin ist nicht mehr verfügbar." }
  }

  const { data: inserted, error } = await supabase
    .from("bookings")
    .insert({
      master_id: masterId,
      customer_id: user.id,
      service_id: serviceId,
      start_at: slot.startAt.toISOString(),
      end_at: slot.endAt.toISOString(),
      status: "pending",
      customer_phone: phone || null,
      notes: notes || null,
    })
    .select("id")
    .single()

  if (error) {
    return { ok: false, error: "Buchung fehlgeschlagen. Bitte erneut versuchen." }
  }

  revalidatePath(`/handwerker/${masterId}`)
  revalidatePath("/dashboard/customer")
  revalidatePath("/dashboard/master")
  return { ok: true, bookingId: inserted.id }
}