import { requireProfile } from "@/lib/auth"
import { LogoutButton } from "./logout-button"
import Link from "next/link"

const NAV: Record<string, { href: string; label: string }[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Meine Buchungen" },
  ],
  master: [
    { href: "/dashboard/master", label: "Übersicht" },
    { href: "/dashboard/master/bookings", label: "Buchungen" },
    { href: "/dashboard/master/services", label: "Leistungen" },
    { href: "/dashboard/master/schedule", label: "Arbeitszeiten" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Übersicht" },
  ],
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await requireProfile()

  const nav = NAV[profile.role] ?? []

  return (
    <div className="min-h-full flex-1">
      <header className="border-b bg-white dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-semibold">
              HandwerkerPro
            </Link>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {profile.role === "master" ? "Handwerker" : "Kunde"}
            </span>
            {profile.full_name && (
              <span className="text-sm text-zinc-500">{profile.full_name}</span>
            )}
          </div>
          <LogoutButton />
        </div>
        {nav.length > 0 && (
          <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-muted hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}