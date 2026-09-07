"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

const statusSchema = z.enum(["active", "rejected", "deactivated"])

export type AdminActionResult = { ok: true } | { ok: false; error: string }

export async function setMasterStatus(
  masterId: string,
  status: string
): Promise<AdminActionResult> {
  await requireRole(["admin"])

  const parsed = statusSchema.safeParse(status)
  if (!parsed.success) {
    return { ok: false, error: "Ungültiger Status." }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({ master_status: parsed.data, updated_at: new Date().toISOString() })
    .eq("id", masterId)
    .eq("role", "master")

  if (error) {
    return { ok: false, error: "Aktualisieren fehlgeschlagen. Bitte erneut versuchen." }
  }

  revalidatePath("/dashboard/admin")
  revalidatePath("/handwerker")
  revalidatePath("/")
  return { ok: true }
}