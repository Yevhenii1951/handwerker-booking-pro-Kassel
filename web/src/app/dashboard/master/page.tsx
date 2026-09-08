import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { BookingRow } from "./bookings/booking-row"
import { requireMasterSetup } from "./setup-guard"
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
  requireMasterSetup(profile)

  const supabase = await createClient()
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, start_at, status, customer_phone, notes, service_id")
    .eq("master_id", profile.id)
    .order("start_at", { ascending: true })

  const list = bookings ?? []
  const pendingCount = list.filter((b) => b.status === "pending").length
  const confirmedCount = list.filter((b) => b.status === "confirmed").length

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

  const pending = profile.master_status === "pending"
  const firstName = profile.full_name?.split(" ")[0]
  const location = [profile.trade, profile.city]
    .filter(Boolean)
    .join(" · ")

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-[#1c1c1c] text-[#eef0f2]">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#fafaff]">
                {pending
                  ? "Antrag in Prüfung"
                  : firstName
                    ? `Willkommen, ${firstName}`
                    : "Willkommen zurück"}
              </h1>
              <p className="mt-1 text-sm text-[#b6b8b1]">
                {location}
                {profile.plz ? ` (${profile.plz})` : ""}
              </p>
            </div>
            {!pending && (
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-amber-400/15 px-3 py-1 font-medium text-amber-300">
                  {pendingCount} offen
                </span>
                <span className="rounded-full bg-teal-400/15 px-3 py-1 font-medium text-teal-300">
                  {confirmedCount} bestätigt
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {pending ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
          Sobald ein Administrator Ihren Standort freigeschaltet hat, können
          Sie Dienste und Zeiten verwalten und Buchungen bestätigen.
        </div>
      ) : (
        <>
          {pendingCount > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
              <span
                aria-hidden="true"
                className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-500"
              />
              <p>
                <span className="font-semibold">
                  {pendingCount}{" "}
                  {pendingCount === 1 ? "Terminanfrage wartet" : "Terminanfragen warten"}{" "}
                </span>
                auf Ihre Antwort.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/master/bookings"
              className="inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Buchungen verwalten
            </Link>
            <Link
              href="/dashboard/master/services"
              className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Leistungen
            </Link>
            <Link
              href="/dashboard/master/schedule"
              className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Arbeitszeiten
            </Link>
          </div>

          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              Aktuelle Buchungen
            </h2>
            {recent.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Noch keine Anfragen. Sobald Kunden einen Termin anfragen, sehen Sie
                ihn hier.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card px-5">
                {recent.map((b) => (
                  <BookingRow
                    key={b.id}
                    booking={b}
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