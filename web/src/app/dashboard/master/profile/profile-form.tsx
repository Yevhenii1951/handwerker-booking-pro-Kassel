"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateMasterProfile, type ProfileResult } from "./actions"
import { TRADES } from "@/lib/trades"
import type { Profile } from "@/types/database"

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"

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
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="fullName">
          Betriebsname
        </label>
        <input
          id="fullName"
          name="fullName"
          defaultValue={profile.full_name ?? ""}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="trade">
          Gewerk
        </label>
        <select id="trade" name="trade" defaultValue={profile.trade ?? ""} className={inputClass}>
          {TRADES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="plz">
            PLZ
          </label>
          <input
            id="plz"
            name="plz"
            defaultValue={profile.plz ?? ""}
            required
            pattern="\d{5}"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="city">
            Ort
          </label>
          <input
            id="city"
            name="city"
            defaultValue={profile.city ?? ""}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="phone">
          Telefon
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile.phone ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="bio">
          Beschreibung
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={profile.bio ?? ""}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        />
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
          Profil gespeichert.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
      >
        {submitting ? "Wird gespeichert…" : "Speichern"}
      </button>
    </form>
  )
}