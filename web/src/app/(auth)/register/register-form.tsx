"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      // Session set: user has a profile (auto-created by DB trigger).
      router.push(role === "master" ? "/dashboard/master" : "/dashboard/customer")
      router.refresh()
    } else {
      // Email confirmation required.
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