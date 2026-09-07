"use server"

import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

const MAX_FILE_MB = 8
const ALLOWED_TYPES = ["image/webp", "image/jpeg", "image/png"]

export type PortfolioResult = { ok: true } | { ok: false; error: string }

function extensionFor(type: string): string {
  if (type === "image/jpeg") return "jpg"
  if (type === "image/png") return "png"
  return "webp"
}

export async function uploadPortfolioPhoto(
  formData: FormData
): Promise<PortfolioResult> {
  const { profile } = await requireRole(["master", "admin"])

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return { ok: false, error: "Keine Datei angegeben." }
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: "Nur Bilder (JPG, PNG, WebP) sind erlaubt." }
  }
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    return { ok: false, error: `Datei zu groß (max. ${MAX_FILE_MB} MB).` }
  }

  const supabase = await createClient()
  const path = `${profile.id}/${crypto.randomUUID()}.${extensionFor(file.type)}`

  const { error: uploadError } = await supabase.storage
    .from("portfolio-images")
    .upload(path, file, { contentType: file.type, upsert: false })
  if (uploadError) {
    return { ok: false, error: "Upload fehlgeschlagen. Bitte erneut versuchen." }
  }

  const publicUrl = supabase.storage
    .from("portfolio-images")
    .getPublicUrl(path).data.publicUrl

  const { error: insertError } = await supabase
    .from("portfolio_images")
    .insert({ master_id: profile.id, image_url: publicUrl })

  if (insertError) {
    await supabase.storage.from("portfolio-images").remove([path])
    return { ok: false, error: "Speichern fehlgeschlagen. Bitte erneut versuchen." }
  }

  revalidatePath("/dashboard/master/portfolio")
  revalidatePath("/handwerker")
  return { ok: true }
}

export async function deletePortfolioPhoto(imageId: string): Promise<PortfolioResult> {
  const { profile } = await requireRole(["master", "admin"])

  const supabase = await createClient()
  const { data, error: selectError } = await supabase
    .from("portfolio_images")
    .select("image_url")
    .eq("id", imageId)
    .eq("master_id", profile.id)
    .single()

  if (selectError || !data) {
    return { ok: false, error: "Foto nicht gefunden." }
  }

  const match = data.image_url.match(/\/portfolio-images\/(.+)$/)
  if (match) {
    await supabase.storage.from("portfolio-images").remove([match[1]])
  }

  const { error } = await supabase
    .from("portfolio_images")
    .delete()
    .eq("id", imageId)
    .eq("master_id", profile.id)

  if (error) {
    return { ok: false, error: "Löschen fehlgeschlagen. Bitte erneut versuchen." }
  }

  revalidatePath("/dashboard/master/portfolio")
  revalidatePath("/handwerker")
  return { ok: true }
}