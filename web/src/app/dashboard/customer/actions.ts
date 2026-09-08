"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export type CancelResult = { ok: true } | { ok: false; error: string }

export async function cancelBooking(bookingId: string): Promise<CancelResult> {
  const user = await requireUser()
  if (!bookingId) return { ok: false, error: "Fehlende Buchungs-ID." }

  const supabase = await createClient()

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, master_id, start_at")
    .eq("id", bookingId)
    .eq("customer_id", user.id)
    .in("status", ["pending", "confirmed"])
    .maybeSingle()
  if (!booking) {
    return { ok: false, error: "Buchung nicht gefunden." }
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .eq("customer_id", user.id)
    .in("status", ["pending", "confirmed"])

  if (error) {
    return { ok: false, error: "Stornieren fehlgeschlagen. Bitte erneut versuchen." }
  }

  await supabase.rpc("create_notification", {
    p_user_id: booking.master_id,
    p_title: "Kunde hat storniert",
    p_body: `Ein Kunde hat einen Termin storniert.`,
    p_link: "/dashboard/master/bookings",
  })

  revalidatePath("/dashboard/customer")
  revalidatePath("/dashboard/master")
  return { ok: true }
}