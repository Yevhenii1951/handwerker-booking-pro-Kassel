"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TRADES, type Trade } from "@/lib/trades"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { checkMasterRegion } from "./actions"

const ROLES = [
  { value: "customer", label: "Kunde (ich suche einen Handwerker)" },
  { value: "master", label: "Handwerker (ich biete meine Dienste an)" },
] as const

type Role = (typeof ROLES)[number]["value"]

export function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<Role>("customer")
  const [trade, setTrade] = useState<Trade | "">("")
  const [plz, setPlz] = useState("")
  const [city, setCity] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    let metadata: Record<string, unknown> = { full_name: fullName, role }

    if (role === "master") {
      if (!trade) {
        setError("Bitte wählen Sie ein Gewerk.")
        setLoading(false)
        return
      }
      if (!/^\d{5}$/.test(plz)) {
        setError("PLZ muss 5-stellig sein.")
        setLoading(false)
        return
      }
      if (city.trim().length < 2) {
        setError("Bitte geben Sie Ihren Ort ein.")
        setLoading(false)
        return
      }

      const regionCheck = await checkMasterRegion(plz, city.trim())
      if (!regionCheck.ok) {
        setError(regionCheck.error)
        setLoading(false)
        return
      }

      metadata = {
        ...metadata,
        trade,
        plz,
        city: regionCheck.city,
        latitude: regionCheck.latitude,
        longitude: regionCheck.longitude,
      }
    }

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push(role === "master" ? "/dashboard/master" : "/dashboard/customer")
      router.refresh()
    } else {
      setError("Bitte bestätigen Sie Ihre E-Mail-Adresse. Wir haben Ihnen einen Link geschickt.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="fullName">
          Name
        </label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="Max Mustermann"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">
          E-Mail
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="max@beispiel.de"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">
          Passwort
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          placeholder="Mindestens 8 Zeichen"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="role">
          Ich bin
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {role === "master" && (
        <>
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="trade">
              Gewerk
            </label>
            <select
              id="trade"
              value={trade}
              onChange={(e) => setTrade(e.target.value as Trade)}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            >
              <option value="">Gewerk wählen…</option>
              {TRADES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="plz">
                PLZ
              </label>
              <Input
                id="plz"
                value={plz}
                onChange={(e) => setPlz(e.target.value.replace(/\D/g, "").slice(0, 5))}
                required
                placeholder="34117"
                maxLength={5}
              />
            </div>
            <div className="col-span-3">
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="city">
                Ort
              </label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="Kassel"
              />
            </div>
          </div>
        </>
      )}

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="mt-1 h-10 w-full bg-accent text-accent-foreground hover:bg-accent/90"
        disabled={loading}
      >
        {loading ? "Wird erstellt…" : "Konto erstellen"}
      </Button>
    </form>
  )
}
