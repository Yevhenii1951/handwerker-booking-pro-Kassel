import { redirect } from "next/navigation"
import Link from "next/link"
import { requireRole } from "@/lib/auth"

const NAV_ITEMS = [
  { href: "/dashboard/master", label: "Übersicht" },
  { href: "/dashboard/master/services", label: "Leistungen" },
  { href: "/dashboard/master/schedule", label: "Arbeitszeiten" },
] as const

export default async function MasterDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await requireRole(["master", "admin"])

  if (!profile.trade || profile.latitude === null || profile.longitude === null) {
    redirect("/dashboard/master/onboarding")
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row">
      <nav className="flex shrink-0 gap-2 md:w-48 md:flex-col">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-muted hover:text-foreground dark:text-zinc-400"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}