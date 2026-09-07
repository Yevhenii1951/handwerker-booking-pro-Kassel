"use server"

import { z } from "zod"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const MAX_SERVICES = 30

const serviceSchema = z.object({
  name: z.string().trim().min(2, "Name ist erforderlich").max(80),
  description: z.string().trim().max(300).optional(),
  price: z.coerce.number().nonnegative("Preis darf nicht negativ sein").max(1_000_000),
  durationMinutes: z.coerce
    .number()
    .int("Dauer muss eine ganze Zahl sein")
    .min(15, "Mindestens 15 Minuten")
    .max(480, "Maximal 8 Stunden"),
})

export type ServiceActionResult =
  | { ok: true }
  | { ok: false; error: string }

function parseService(formData: FormData) {
  return serviceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    price: formData.get("price"),
    durationMinutes: formData.get("durationMinutes"),
  })
}

export async function createService(
  formData: FormData
): Promise<ServiceActionResult> {
  const { profile } = await requireRole(["master", "admin"])

  const parsed = parseService(formData)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." }
  }
  const data = parsed.data

  const supabase = await createClient()

  const { count } = await supabase
    .from("services")
    .select("id", { count: "exact", head: true })
    .eq("master_id", profile.id)

  if (count !== null && count >= MAX_SERVICES) {
    return { ok: false, error: `Maximal ${MAX_SERVICES} Leistungen möglich.` }
  }

  const { error } = await supabase.from("services").insert({
    master_id: profile.id,
    name: data.name,
    description: data.description ?? null,
    price: data.price,
    duration_minutes: data.durationMinutes,
  })

  if (error) {
    return { ok: false, error: "Speichern fehlgeschlagen. Bitte erneut versuchen." }
  }

  revalidatePath("/dashboard/master/services")
  return { ok: true }
}

export async function updateService(
  serviceId: string,
  formData: FormData
): Promise<ServiceActionResult> {
  const { profile } = await requireRole(["master", "admin"])
  if (!serviceId) return { ok: false, error: "Fehlende Leistungs-ID." }

  const parsed = parseService(formData)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." }
  }
  const data = parsed.data

  const supabase = await createClient()
  const { error } = await supabase
    .from("services")
    .update({
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      duration_minutes: data.durationMinutes,
    })
    .eq("id", serviceId)
    .eq("master_id", profile.id)

  if (error) {
    return { ok: false, error: "Speichern fehlgeschlagen. Bitte erneut versuchen." }
  }

  revalidatePath("/dashboard/master/services")
  return { ok: true }
}

export async function deleteService(
  serviceId: string
): Promise<ServiceActionResult> {
  const { profile } = await requireRole(["master", "admin"])
  if (!serviceId) return { ok: false, error: "Fehlende Leistungs-ID." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId)
    .eq("master_id", profile.id)

  if (error) {
    return { ok: false, error: "Löschen fehlgeschlagen." }
  }

  revalidatePath("/dashboard/master/services")
  return { ok: true }
}