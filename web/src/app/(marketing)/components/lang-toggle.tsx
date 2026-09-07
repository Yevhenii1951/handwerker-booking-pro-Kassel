"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

export function LangToggle({ lang }: { lang: "de" | "en" }) {
  const pathname = usePathname()
  const next = lang === "de" ? "en" : "de"
  const label = lang === "de" ? "EN" : "DE"

  const href = pathname
    ? `${pathname}?lang=${next}${pathname !== "/" ? "#top" : ""}`
    : `/?lang=${next}`

  return (
    <Link
      href={href}
      className="rounded-md px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
      aria-label={`Switch language to ${label}`}
    >
      {label}
    </Link>
  )
}