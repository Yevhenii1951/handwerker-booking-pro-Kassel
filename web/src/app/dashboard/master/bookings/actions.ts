"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

const statusSchema = z.enum(["confirmed", "declined"])

export type BookingStatusResult = { ok: true } | { ok: false; error: string }

export async function setBookingStatus(
  bookingId: string,
  status: string
): Promise<BookingStatusResult> {
  const { profile } = await requireRole(["master", "admin"])

  const parsed = statusSchema.safeParse(status)
  if (!parsed.success) {
    return { ok: false, error: "Ungültiger Status." }
  }

  const supabase = await createClient()

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, master_id, start_at, status")
    .eq("id", bookingId)
    .eq("master_id", profile.id)
    .maybeSingle()

  if (!booking) {
    return { ok: false, error: "Buchung nicht gefunden." }
  }

  if (parsed.data === "confirmed") {
    const { data: conflict } = await supabase
      .from("bookings")
      .select("id")
      .eq("master_id", profile.id)
      .eq("start_at", booking.start_at)
      .eq("status", "confirmed")
      .neq("id", bookingId)
      .maybeSingle()

    if (conflict) {
      return {
        ok: false,
        error: "Dieser Termin ist bereits bestätigt für eine andere Buchung.",
      }
    }
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: parsed.data, updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .eq("master_id", profile.id)

  if (error) {
    return { ok: false, error: "Aktualisieren fehlgeschlagen. Bitte erneut versuchen." }
  }

  revalidatePath("/dashboard/master/bookings")
  revalidatePath("/dashboard/master")
  revalidatePath("/dashboard/customer")
  return { ok: true }
}
