import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { BookingRow } from "./bookings/booking-row"
import Link from "next/link"

function formatBookedAt(value: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export default async function MasterDashboard() {
  const { profile } = await requireRole(["master", "admin"])

  const supabase = await createClient()
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, start_at, status, customer_phone, notes, service_id")
    .eq("master_id", profile.id)
    .order("start_at", { ascending: true })

  const list = bookings ?? []
  const pendingCount = list.filter((b) => b.status === "pending").length

  const serviceIds = [
    ...new Set(list.map((b) => b.service_id).filter((id): id is string => Boolean(id))),
  ]
  const serviceNames: Record<string, string> = {}
  if (serviceIds.length > 0) {
    const { data: services } = await supabase
      .from("services")
      .select("id, name")
      .in("id", serviceIds)
    for (const s of services ?? []) {
      serviceNames[s.id] = s.name
    }
  }

  const recent = list
    .slice()
    .sort((a, b) => a.start_at.localeCompare(b.start_at))
    .filter((b) => b.status === "pending" || b.status === "confirmed")
    .slice(0, 5)
    .map((b) => ({
      id: b.id,
      startAt: formatBookedAt(b.start_at),
      serviceName: b.service_id ? (serviceNames[b.service_id] ?? "Leistung") : "Leistung",
      phone: b.customer_phone,
      notes: b.notes,
      status: b.status,
    }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {profile.master_status === "pending" ? "Antrag in Prüfung" : "Handwerker-Dashboard"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {profile.trade} · {profile.city}
          {profile.plz ? ` (${profile.plz})` : ""}
        </p>
      </div>

      {profile.master_status === "pending" ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <p className="font-medium">Ihr Antrag wird geprüft.</p>
          <p className="mt-1">
            Sobald ein Administrator Ihren Standort freigeschaltet hat, können
            Sie Dienste und Zeiten verwalten und Buchungen bestätigen.
          </p>
        </div>
      ) : (
        <>
          {pendingCount > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
              <p className="font-medium">
                {pendingCount} offene{" "}
                {pendingCount === 1 ? "Terminanfrage" : "Terminanfragen"} warten auf
                Ihre Antwort.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/master/bookings"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              Buchungen verwalten
            </Link>
            <Link
              href="/dashboard/master/services"
              className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Leistungen
            </Link>
            <Link
              href="/dashboard/master/schedule"
              className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Arbeitszeiten
            </Link>
          </div>

          <section>
            <h2 className="text-lg font-semibold">Aktuelle Buchungen</h2>
            {recent.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">
                Noch keine Anfragen. Sobald Kunden einen Termin anfragen, sehen Sie
                ihn hier.
              </p>
            ) : (
              <ul className="mt-4 rounded-xl border border-zinc-200 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-900">
                {recent.map((b) => (
                  <BookingRow
                    key={b.id}
                    booking={{
                      id: b.id,
                      startAt: b.startAt,
                      serviceName: b.serviceName,
                      phone: b.phone,
                      notes: b.notes,
                      status: b.status,
                    }}
                  />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}