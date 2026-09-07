"use server"

import { z } from "zod"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export const WEEKDAY_LABELS = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
] as const

const workingHourSchema = z.object({
  dayOfWeek: z.coerce
    .number()
    .int()
    .min(0)
    .max(6, "Ungültiger Wochentag"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Ungültige Uhrzeit"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Ungültige Uhrzeit"),
})

export type WorkingHourActionResult =
  | { ok: true }
  | { ok: false; error: string }

export async function upsertWorkingHour(
  formData: FormData
): Promise<WorkingHourActionResult> {
  const { profile } = await requireRole(["master", "admin"])

  const parsed = workingHourSchema.safeParse({
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  })

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." }
  }

  const { dayOfWeek, startTime, endTime } = parsed.data

  const startMinutes = toMinutes(startTime)
  const endMinutes = toMinutes(endTime)
  if (endMinutes <= startMinutes) {
    return { ok: false, error: "Endzeit muss nach der Startzeit liegen." }
  }

  const supabase = await createClient()

  const { data: existing } = await supabase
    .from("working_hours")
    .select("id")
    .eq("master_id", profile.id)
    .eq("day_of_week", dayOfWeek)
    .maybeSingle()

  const params = {
    master_id: profile.id,
    day_of_week: dayOfWeek,
    start_time: startTime,
    end_time: endTime,
  }

  const { error } = existing
    ? await supabase.from("working_hours").update(params).eq("id", existing.id)
    : await supabase.from("working_hours").insert(params)

  if (error) {
    return { ok: false, error: "Speichern fehlgeschlagen. Bitte erneut versuchen." }
  }

  revalidatePath("/dashboard/master/schedule")
  return { ok: true }
}

export async function deleteWorkingHour(
  workingHourId: string
): Promise<WorkingHourActionResult> {
  const { profile } = await requireRole(["master", "admin"])
  if (!workingHourId) return { ok: false, error: "Fehlende ID." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("working_hours")
    .delete()
    .eq("id", workingHourId)
    .eq("master_id", profile.id)

  if (error) {
    return { ok: false, error: "Löschen fehlgeschlagen." }
  }

  revalidatePath("/dashboard/master/schedule")
  return { ok: true }
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}