import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { isWithinAnyRegion } from "@/lib/geo"
import { MasterRow } from "./master-row"

export default async function AdminDashboard() {
  await requireRole(["admin"])

  const supabase = await createClient()

  const [{ data: masters }, { data: centers }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, trade, city, plz, latitude, longitude, master_status, created_at")
      .eq("role", "master")
      .order("created_at", { ascending: false }),
    supabase.from("region_centers").select("name, latitude, longitude, max_radius_km"),
  ])

  const list = masters ?? []
  const regions = centers ?? []
  const pendingCount = list.filter((m) => m.master_status === "pending").length
  const activeCount = list.filter((m) => m.master_status === "active").length

  const sections: { title: string; empty: string; statuses: string[]; items: typeof list }[] = [
    {
      title: "Zu prüfende Anträge",
      empty: "Keine ausstehenden Anträge.",
      statuses: ["pending"],
      items: list.filter((m) => m.master_status === "pending"),
    },
    {
      title: "Aktive Betriebe",
      empty: "Noch keine aktiven Betriebe.",
      statuses: ["active"],
      items: list.filter((m) => m.master_status === "active"),
    },
    {
      title: "Abgelehnt / deaktiviert",
      empty: "Keine.",
      statuses: ["rejected", "deactivated"],
      items: list.filter(
        (m) => m.master_status === "rejected" || m.master_status === "deactivated"
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-[#1c1c1c] text-[#eef0f2]">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#fafaff]">
            Administration
          </h1>
          <p className="mt-1 text-sm text-[#b6b8b1]">
            Master-Anmeldungen freischalten oder ablehnen.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-amber-400/15 px-3 py-1 font-medium text-amber-300">
              {pendingCount} zu prüfen
            </span>
            <span className="rounded-full bg-teal-400/15 px-3 py-1 font-medium text-teal-300">
              {activeCount} aktiv
            </span>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-lg font-semibold tracking-tight">
            {section.title}
            {section.statuses.includes("pending") && section.items.length > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-400/15 dark:text-amber-300">
                {section.items.length}
              </span>
            )}
          </h2>
          {section.items.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">{section.empty}</p>
          ) : (
            <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card px-5">
              {section.items.map((m) => (
                <MasterRow
                  key={m.id}
                  master={{
                    id: m.id,
                    fullName: m.full_name ?? "",
                    trade: m.trade,
                    city: m.city,
                    plz: m.plz,
                    status: m.master_status ?? "pending",
                    createdAt: m.created_at,
                  }}
                  inRegion={isWithinAnyRegion(m.latitude, m.longitude, regions)}
                />
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}