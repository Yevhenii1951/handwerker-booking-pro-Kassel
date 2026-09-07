import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

async function AuthLinks() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href="/dashboard">Mein Bereich</Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="ghost">
        <Link href="/login">Anmelden</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/register">Als Handwerker registrieren</Link>
      </Button>
    </div>
  )
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="font-extrabold tracking-tight text-foreground uppercase"
          >
            Handwerker<span className="text-accent">Pro</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <AuthLinks />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            HandwerkerPro — Handwerker in Kassel & Göttingen (Radius 50 km).
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/legal/impressum" className="hover:text-foreground">
              Impressum
            </Link>
            <Link href="/legal/datenschutz" className="hover:text-foreground">
              Datenschutz
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}