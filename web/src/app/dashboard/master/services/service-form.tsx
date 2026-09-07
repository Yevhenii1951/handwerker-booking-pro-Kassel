"use client"

import { useState } from "react"
import { createService, updateService } from "./actions"
import type { Service } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Mode = "create" | "edit"

interface ServiceFormProps {
  mode: Mode
  service?: Service
  onDone?: () => void
}

export function ServiceForm({ mode, service, onDone }: ServiceFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const result =
      mode === "create"
        ? await createService(formData)
        : await updateService(service!.id, formData)

    setIsPending(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    onDone?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="name">
          Name
        </label>
        <Input
          id="name"
          name="name"
          defaultValue={service?.name}
          required
          placeholder="z. B. Wandanstrich"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="description">
          Beschreibung
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={service?.description ?? ""}
          maxLength={300}
          rows={2}
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          placeholder="Optional, z. B. Material und Anfahrt inklusive"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="price">
            Preis (€)
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={service?.price ?? ""}
            required
            placeholder="z. B. 120,00"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="durationMinutes">
            Dauer (Minuten)
          </label>
          <Input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min={15}
            step={15}
            defaultValue={service?.duration_minutes ?? ""}
            required
            placeholder="z. B. 60"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? "Wird gespeichert…"
          : mode === "create"
            ? "Leistung hinzufügen"
            : "Speichern"}
      </Button>
    </form>
  )
}