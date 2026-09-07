import { requireRole } from "@/lib/auth"
import Link from "next/link"

export default async function MasterDashboard() {
  const { profile } = await requireRole(["master", "admin"])

  const status = profile.master_status

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {status === "pending" ? "Antrag in Prüfung" : "Handwerker-Dashboard"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {profile.trade} · {profile.city}
          {profile.plz ? ` (${profile.plz})` : ""}
        </p>
      </div>

      {status === "pending" ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <p className="font-medium">Ihr Antrag wird geprüft.</p>
          <p className="mt-1">
            Sobald ein Administrator Ihren Standort freigeschaltet hat, können
            Sie Dienste und Zeiten verwalten und Buchungen bestätigen.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border p-4 text-sm text-zinc-600 dark:text-zinc-400">
          Hier entsteht das Dashboard. Kommt in Ticket T3/T5.
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/master/services"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Leistungen verwalten
        </Link>
        <Link
          href="/dashboard/master/schedule"
          className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Arbeitszeiten festlegen
        </Link>
      </div>
    </div>
  )
}