"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { getPlaceFromPlz } from "@/lib/geocode"
import { isWithinAnyRegion } from "@/lib/geo"
import { TRADES } from "@/lib/trades"

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Name ist erforderlich").max(80),
  trade: z.enum(TRADES),
  plz: z.string().regex(/^\d{5}$/, "PLZ muss 5-stellig sein"),
  city: z.string().trim().min(2, "Ort ist erforderlich").max(60),
  phone: z.string().trim().max(30).optional(),
  bio: z.string().trim().max(600).optional(),
})

export type ProfileResult = { ok: true } | { ok: false; error: string }

export async function updateMasterProfile(
  formData: FormData
): Promise<ProfileResult> {
  const { profile } = await requireRole(["master", "admin"])

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    trade: formData.get("trade"),
    plz: formData.get("plz"),
    city: formData.get("city"),
    phone: formData.get("phone") || undefined,
    bio: formData.get("bio") || undefined,
  })

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." }
  }

  const { fullName, trade, plz, city, phone, bio } = parsed.data

  const place = await getPlaceFromPlz(plz, city)
  if (!place) {
    return { ok: false, error: "Die PLZ konnte nicht zugeordnet werden." }
  }

  const supabase = await createClient()
  const { data: centers } = await supabase
    .from("region_centers")
    .select("name, latitude, longitude, max_radius_km")

  const inRegion = isWithinAnyRegion(
    place.latitude,
    place.longitude,
    centers ?? []
  )
  if (!inRegion) {
    return {
      ok: false,
      error:
        "Ihr Standort liegt außerhalb unseres Servicegebiets (max. 50 km um Kassel oder Göttingen).",
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      trade,
      plz,
      city,
      phone: phone ?? null,
      bio: bio ?? null,
      latitude: place.latitude,
      longitude: place.longitude,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id)

  if (error) {
    return { ok: false, error: "Speichern fehlgeschlagen. Bitte erneut versuchen." }
  }

  revalidatePath("/dashboard/master/profile")
  revalidatePath("/dashboard/master")
  revalidatePath("/handwerker")
  revalidatePath("/")
  return { ok: true }
}