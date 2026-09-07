import { requireProfile } from "@/lib/auth"
import { LogoutButton } from "./logout-button"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await requireProfile()

  return (
    <div className="min-h-full flex-1">
      <header className="border-b bg-white dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
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
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}