"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { deletePortfolioPhoto, uploadPortfolioPhoto } from "./actions"

interface PortfolioImage {
  id: string
  image_url: string
}

const MAX_DIMENSION = 1280

async function fileToWebp(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas nicht verfügbar.")
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Bild konnte nicht kodiert werden."))),
      "image/webp",
      0.8
    )
  )
  return new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
    type: "image/webp",
  })
}

export function PortfolioManager({
  images,
}: {
  images: PortfolioImage[]
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      const webp = await fileToWebp(file)
      const formData = new FormData()
      formData.append("file", webp)
      const result = await uploadPortfolioPhoto(formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.refresh()
    } catch {
      setError("Bild konnte nicht verarbeitet werden.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  async function handleDelete(imageId: string) {
    if (!window.confirm("Foto wirklich löschen?")) return
    const result = await deletePortfolioPhoto(imageId)
    if (!result.ok) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  return (
    <div className="mt-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
      >
        {uploading ? "Wird hochgeladen…" : "Foto hinzufügen"}
      </button>

      {error && (
        <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {images.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border bg-card p-8 text-sm text-muted-foreground">
          Noch keine Fotos. Laden Sie Fotos Ihrer Arbeiten hoch — sie erscheinen auf
          Ihrer öffentlichen Betriebsseite.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((img) => (
            <li
              key={img.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={img.image_url}
                  alt="Arbeitsbeispiel"
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                className="absolute right-2 top-2 rounded-md bg-[#1c1c1c]/80 px-2.5 py-1 text-xs font-semibold text-[#fafaff] opacity-0 transition-opacity hover:bg-[#1c1c1c] group-hover:opacity-100"
              >
                Löschen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}