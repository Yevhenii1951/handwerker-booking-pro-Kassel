import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { CancelBookingButton } from "./cancel-booking-button"

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

const STATUS_LABELS: Record<string, string> = {
  pending: "Offen",
  confirmed: "Bestätigt",
  declined: "Abgelehnt",
  cancelled: "Storniert",
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  confirmed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  declined: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
  cancelled: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
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
      <h1 className="text-2xl font-semibold">Meine Buchungen</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Hier sehen Sie den Status Ihrer Terminanfragen.
      </p>

      {list.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Sie haben noch keine Buchungen.{" "}
          <Link href="/handwerker" className="font-medium text-primary hover:underline">
            Jetzt einen Handwerker finden
          </Link>
        </div>
      ) : (
        <ul className="mt-6 rounded-xl border border-zinc-200 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-900">
          {list.map((b) => {
            const canCancel = b.status === "pending" || b.status === "confirmed"
            return (
              <li
                key={b.id}
                className="flex flex-col gap-3 border-b border-zinc-200 py-4 last:border-0 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {formatBookedAt(b.start_at)}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {serviceNames[b.service_id] ?? "Leistung"} ·{" "}
                    {masterNames[b.master_id] ?? "Handwerksbetrieb"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_BADGE[b.status] ?? ""
                    }`}
                  >
                    {STATUS_LABELS[b.status] ?? b.status}
                  </span>
                  {canCancel && (
                    <CancelBookingButton bookingId={b.id} serviceName={serviceNames[b.service_id] ?? "Leistung"} />
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