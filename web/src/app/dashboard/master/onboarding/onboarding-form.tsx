"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { submitMasterOnboarding } from "./actions"
import { TRADES } from "@/lib/trades"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Profile } from "@/types/database"

interface OnboardingFormProps {
  profile: Profile
}

export function OnboardingForm({ profile }: OnboardingFormProps) {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(
    async (_prev: string, formData: FormData) => {
      const result = await submitMasterOnboarding(formData)
      if (result.ok) {
        router.push("/dashboard/master")
        router.refresh()
        return ""
      }
      return result.error
    },
    ""
  )

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="trade">
          Gewerk
        </label>
        <select
          id="trade"
          name="trade"
          defaultValue={profile.trade ?? ""}
          required
          className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="" disabled>
            Bitte wählen…
          </option>
          {TRADES.map((trade) => (
            <option key={trade} value={trade}>
              {trade}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="plz">
            PLZ
          </label>
          <Input
            id="plz"
            name="plz"
            defaultValue={profile.plz ?? ""}
            required
            inputMode="numeric"
            pattern="[0-9]{5}"
            placeholder="34117"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor="city">
            Ort
          </label>
          <Input
            id="city"
            name="city"
            defaultValue={profile.city ?? ""}
            required
            placeholder="Kassel"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="phone">
          Telefon (optional)
        </label>
        <Input
          id="phone"
          name="phone"
          defaultValue={profile.phone ?? ""}
          type="tel"
          placeholder="+49 170 1234567"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="bio">
          Über mich (optional)
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio ?? ""}
          maxLength={600}
          rows={3}
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          placeholder="Beschreiben Sie kurz Ihre Arbeit und Erfahrung…"
        />
      </div>

      <p className="text-xs leading-snug text-zinc-500">
        Wir prüfen im nächsten Schritt, ob Ihr Standort in unserem Servicegebiet
        liegt (max. 50 km um Kassel oder Göttingen).
      </p>

      {state && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Wird geprüft…" : "Standort prüfen und speichern"}
      </Button>
    </form>
  )
}