"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TRADES } from "@/lib/trades"
import { dict, type Lang } from "@/lib/i18n"

export function SearchBar({ lang }: { lang: Lang }) {
  const router = useRouter()
  const [trade, setTrade] = useState("")
  const t = dict[lang].search

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (trade) params.set("gewerk", trade)
    router.push(`/handwerker${params.size ? `?${params.toString()}` : ""}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl flex-col gap-px bg-[#dadde8] p-px sm:flex-row"
    >
      <label className="sr-only" htmlFor="gewerk">
        {t.label}
      </label>
      <select
        id="gewerk"
        value={trade}
        onChange={(e) => setTrade(e.target.value)}
        className="h-12 flex-1 bg-[#fafaff] px-4 text-base text-[#1c1c1c] outline-none"
      >
        <option value="">{t.placeholder}</option>
        {TRADES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="h-12 bg-accent px-7 text-base font-bold text-accent-foreground transition-colors hover:bg-accent/90"
      >
        {t.submit}
      </button>
    </form>
  )
}