"use client"

import Link from "next/link"
import { dict } from "@/lib/i18n"
import { useLang } from "@/lib/use-lang"
import { Button } from "@/components/ui/button"
import { LangToggle } from "./lang-toggle"

export function MarketingChrome({ isLoggedIn }: { isLoggedIn: boolean }) {
  const lang = useLang()
  const t = dict[lang]

  return (
    <>
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight text-foreground"
          >
            handwerker<span className="text-accent">pro</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <LangToggle lang={lang} />
            {isLoggedIn ? (
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard">{t.layout.myArea}</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild size="sm" variant="ghost">
                  <Link href="/login">{t.layout.login}</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Link href="/register">{t.layout.register}</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>
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
    </>
  )
}