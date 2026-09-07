"use client"

import Link from "next/link"
import { dict } from "@/lib/i18n"
import { useLang } from "@/lib/use-lang"

export function MarketingFooter() {
  const lang = useLang()
  const t = dict[lang]

  return (
    <footer className="border-t border-border bg-[#1c1c1c] py-10 text-[#b6b8b1]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-extrabold tracking-tight text-[#fafaff]">
            handwerker<span className="text-accent">pro</span>
          </p>
          <p className="mt-1 text-sm">{t.layout.footerTagline}</p>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/legal/impressum" className="hover:text-[#fafaff]">
            {t.layout.impressum}
          </Link>
          <Link href="/legal/datenschutz" className="hover:text-[#fafaff]">
            {t.layout.datenschutz}
          </Link>
        </nav>
      </div>
    </footer>
  )
}