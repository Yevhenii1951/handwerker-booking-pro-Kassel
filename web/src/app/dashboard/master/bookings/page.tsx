import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { BookingRow } from "./booking-row"

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

const STATUS_RANK: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  declined: 2,
  cancelled: 3,
}

export default async function MasterBookingsPage() {
  const { profile } = await requireRole(["master", "admin"])

  const supabase = await createClient()
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, start_at, status, customer_phone, notes, service_id")
    .eq("master_id", profile.id)
    .order("start_at", { ascending: true })

  const list = bookings ?? []

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

  const rows = list
    .map((b) => ({
      id: b.id,
      startAt: formatBookedAt(b.start_at),
      startSort: b.start_at,
      serviceName: b.service_id ? (serviceNames[b.service_id] ?? "Leistung") : "Leistung",
      phone: b.customer_phone,
      notes: b.notes,
      status: b.status,
    }))
    .sort((a, b) => {
      const rankDiff = (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9)
      if (rankDiff !== 0) return rankDiff
      return a.startSort.localeCompare(b.startSort)
    })

  const pendingCount = rows.filter((r) => r.status === "pending").length

  return (
    <div>
      <h1 className="text-2xl font-semibold">Buchungsanfragen</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {pendingCount > 0
          ? `${pendingCount} offene ${pendingCount === 1 ? "Anfrage" : "Anfragen"}.`
          : "Keine offenen Anfragen."}
      </p>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Noch keine Buchungsanfragen.
        </div>
      ) : (
        <ul className="mt-6 rounded-xl border border-zinc-200 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-900">
          {rows.map((b) => (
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
    </div>
  )
}