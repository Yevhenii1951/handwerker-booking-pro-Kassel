"use client"

import Link from "next/link"
import { dict } from "@/lib/i18n"
import { useLang } from "@/lib/use-lang"
import { Button } from "@/components/ui/button"
import { LangToggle } from "./lang-toggle"

export function MarketingHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  const lang = useLang()
  const t = dict[lang]

  return (
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
  )
}