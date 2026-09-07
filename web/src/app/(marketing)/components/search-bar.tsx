"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TRADES } from "@/lib/trades"

export function SearchBar() {
  const router = useRouter()
  const [trade, setTrade] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (trade) params.set("gewerk", trade)
    router.push(`/handwerker${params.size ? `?${params.toString()}` : ""}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl flex-col gap-2 border border-border bg-background p-2 sm:flex-row"
    >
      <label className="sr-only" htmlFor="gewerk">
        Gewerk auswählen
      </label>
      <select
        id="gewerk"
        value={trade}
        onChange={(e) => setTrade(e.target.value)}
        className="h-11 flex-1 bg-transparent px-3 text-foreground outline-none"
      >
        <option value="">Alle Gewerke</option>
        {TRADES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="h-11 bg-accent px-6 font-semibold text-accent-foreground hover:bg-accent/90"
      >
        Handwerker finden
      </button>
    </form>
  )
}