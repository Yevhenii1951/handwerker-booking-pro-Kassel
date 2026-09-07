import { requireRole } from "@/lib/auth"

export default async function MasterDashboard() {
  const { profile } = await requireRole(["master", "admin"])

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        {profile.master_status === "pending"
          ? "Antrag in Prüfung"
          : "Handwerker-Dashboard"}
      </h1>
      {profile.master_status === "pending" ? (
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Ihr Profil wird derzeit von einem Administrator geprüft. Sobald Sie
          freigeschaltet sind, können Sie Dienste und Zeiten verwalten und
          Buchungen bestätigen.
        </p>
      ) : (
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Hier entsteht das Dashboard. Kommt in Ticket T3/T5.
        </p>
      )}
    </div>
  )
}