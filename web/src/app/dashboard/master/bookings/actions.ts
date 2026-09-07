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