import { requireProfile } from "@/lib/auth"
import { LogoutButton } from "./logout-button"
import { DashboardNav, type DashboardNavItem } from "./nav"
import { NotificationBell } from "./notification-bell"
import Link from "next/link"

const NAV: Record<string, DashboardNavItem[]> = {
  customer: [{ href: "/dashboard/customer", label: "Meine Buchungen" }],
  master: [
    { href: "/dashboard/master", label: "Übersicht" },
    { href: "/dashboard/master/bookings", label: "Buchungen" },
    { href: "/dashboard/master/services", label: "Leistungen" },
    { href: "/dashboard/master/schedule", label: "Arbeitszeiten" },
    { href: "/dashboard/master/portfolio", label: "Portfolio" },
    { href: "/dashboard/master/profile", label: "Profil" },
  ],
  admin: [{ href: "/dashboard/admin", label: "Übersicht" }],
}

const ROLE_LABEL: Record<string, string> = {
  customer: "Kunde",
  master: "Handwerker",
  admin: "Administrator",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await requireProfile()

  const nav = NAV[profile.role] ?? []

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="shrink-0 text-lg font-extrabold tracking-tight text-foreground"
            >
              handwerker<span className="text-accent">pro</span>
            </Link>
            <span className="hidden shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground sm:inline-flex">
              {ROLE_LABEL[profile.role] ?? "Benutzer"}
            </span>
            {profile.full_name && (
              <span className="hidden truncate text-sm text-muted-foreground md:inline">
                {profile.full_name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <LogoutButton />
          </div>
        </div>
        {nav.length > 0 && <DashboardNav items={nav} />}
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 animate-in px-4 py-8 fade-in duration-500 ease-out motion-reduce:animate-none">
        {children}
      </main>
    </div>
  )
}