"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateMasterProfile, type ProfileResult } from "./actions"
import { TRADES } from "@/lib/trades"
import type { Profile } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSaved(false)

    const result: ProfileResult = await updateMasterProfile(
      new FormData(e.currentTarget)
    )

    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setSaved(true)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="fullName">
          Betriebsname
        </label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={profile.full_name ?? ""}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="trade">
          Gewerk
        </label>
        <select id="trade" name="trade" defaultValue={profile.trade ?? ""} className={selectClass}>
          {TRADES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="plz">
            PLZ
          </label>
          <Input
            id="plz"
            name="plz"
            defaultValue={profile.plz ?? ""}
            required
            pattern="\d{5}"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="city">
            Ort
          </label>
          <Input
            id="city"
            name="city"
            defaultValue={profile.city ?? ""}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="phone">
          Telefon
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile.phone ?? ""}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="bio">
          Beschreibung
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={profile.bio ?? ""}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-lg bg-teal-100 px-3 py-2 text-sm text-teal-900 dark:bg-teal-400/15 dark:text-teal-300">
          Profil gespeichert.
        </p>
      )}

      <Button
        type="submit"
        className="bg-accent text-accent-foreground hover:bg-accent/90"
        disabled={submitting}
      >
        {submitting ? "Wird gespeichert…" : "Speichern"}
      </Button>
    </form>
  )
}