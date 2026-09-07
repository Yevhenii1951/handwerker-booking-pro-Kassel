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
      <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link href="/register">Als Handwerker registrieren</Link>
      </Button>
    </div>
  )
}

function Logo() {
  return (
    <Link href="/" className="text-lg font-extrabold tracking-tight text-foreground">
      handwerker<span className="text-accent">pro</span>
    </Link>
  )
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <AuthLinks />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-[#1c1c1c] py-10 text-[#b6b8b1]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-extrabold tracking-tight text-[#fafaff]">
              handwerker<span className="text-accent">pro</span>
            </p>
            <p className="mt-1 text-sm">
              Handwerker vermitteln in Kassel & Göttingen, 50 km Umkreis.
            </p>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/legal/impressum" className="hover:text-[#fafaff]">
              Impressum
            </Link>
            <Link href="/legal/datenschutz" className="hover:text-[#fafaff]">
              Datenschutz
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}