import { requireRole } from "@/lib/auth"

export default async function CustomerDashboard() {
  await requireRole(["customer", "master"])
  return (
    <div>
      <h1 className="text-2xl font-semibold">Mein Konto</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Hier sehen Sie Ihre Buchungen. Kommt in Ticket T5/T6.
      </p>
    </div>
  )
}