"use client"

import { useSearchParams } from "next/navigation"
import type { Lang } from "@/lib/i18n"

export function useLang(): Lang {
  const searchParams = useSearchParams()
  const raw =
    searchParams.get("lang") ??
    (typeof document !== "undefined"
      ? /(?:^|;\s*)lang=(de|en)(?:;|$)/.exec(document.cookie)?.[1]
      : undefined)
  return raw === "en" ? "en" : "de"
}