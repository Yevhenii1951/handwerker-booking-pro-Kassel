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
    <form action={formAction} className="mt-6 space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="trade">
          Gewerk
        </label>
        <select
          id="trade"
          name="trade"
          defaultValue={profile.trade ?? ""}
          required
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
          <label className="mb-2 block text-sm font-semibold" htmlFor="plz">
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
          <label className="mb-2 block text-sm font-semibold" htmlFor="city">
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
        <label className="mb-2 block text-sm font-semibold" htmlFor="phone">
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
        <label className="mb-2 block text-sm font-semibold" htmlFor="bio">
          Über mich (optional)
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio ?? ""}
          maxLength={600}
          rows={3}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="Beschreiben Sie kurz Ihre Arbeit und Erfahrung…"
        />
      </div>

      <p className="text-xs leading-snug text-muted-foreground">
        Wir prüfen im nächsten Schritt, ob Ihr Standort in unserem Servicegebiet
        liegt (max. 50 km um Kassel oder Göttingen).
      </p>

      {state && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state}
        </p>
      )}

      <Button type="submit" className="mt-2 h-11 w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isPending}>
        {isPending ? "Wird geprüft…" : "Standort prüfen und speichern"}
      </Button>
    </form>
  )
}