"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export type CancelResult = { ok: true } | { ok: false; error: string }

export async function cancelBooking(bookingId: string): Promise<CancelResult> {
  const user = await requireUser()
  if (!bookingId) return { ok: false, error: "Fehlende Buchungs-ID." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .eq("customer_id", user.id)
    .in("status", ["pending", "confirmed"])

  if (error) {
    return { ok: false, error: "Stornieren fehlgeschlagen. Bitte erneut versuchen." }
  }

  revalidatePath("/dashboard/customer")
  revalidatePath("/dashboard/master")
  return { ok: true }
}