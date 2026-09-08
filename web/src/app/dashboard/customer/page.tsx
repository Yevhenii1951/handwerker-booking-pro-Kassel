import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { CancelBookingButton } from "./cancel-booking-button"
import { StatusBadge } from "@/app/dashboard/status-badge"

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

export default async function CustomerDashboard() {
  const { user } = await requireRole(["customer", "master"])

  const supabase = await createClient()
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, master_id, start_at, status, service_id")
    .eq("customer_id", user.id)
    .order("start_at", { ascending: true })

  const list = bookings ?? []

  const masterIds = [
    ...new Set(list.map((b) => b.master_id).filter((id): id is string => Boolean(id))),
  ]
  const serviceIds = [
    ...new Set(list.map((b) => b.service_id).filter((id): id is string => Boolean(id))),
  ]

  const [masterResult, serviceResult] = await Promise.all([
    masterIds.length > 0
      ? supabase.from("profiles").select("id, full_name").in("id", masterIds)
      : { data: [] },
    serviceIds.length > 0
      ? supabase.from("services").select("id, name").in("id", serviceIds)
      : { data: [] },
  ])

  const masterNames = Object.fromEntries(
    (masterResult.data ?? []).map((m) => [m.id, m.full_name])
  )
  const serviceNames = Object.fromEntries(
    (serviceResult.data ?? []).map((s) => [s.id, s.name])
  )

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Meine Buchungen</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Hier sehen Sie den Status Ihrer Terminanfragen.
      </p>

      {list.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Sie haben noch keine Buchungen.
          </p>
          <Link
            href="/handwerker"
            className="mt-4 inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Jetzt einen Handwerker finden
          </Link>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card px-5">
          {list.map((b) => {
            const canCancel = b.status === "pending" || b.status === "confirmed"
            return (
              <li
                key={b.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {formatBookedAt(b.start_at)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {serviceNames[b.service_id] ?? "Leistung"} ·{" "}
                    {masterNames[b.master_id] ?? "Handwerksbetrieb"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={b.status} />
                  {canCancel && (
                    <CancelBookingButton
                      bookingId={b.id}
                      serviceName={serviceNames[b.service_id] ?? "Leistung"}
                    />
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}