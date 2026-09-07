"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { setBookingStatus, type BookingStatusResult } from "./actions"

const STATUS_LABELS: Record<string, string> = {
  pending: "Offen",
  confirmed: "Bestätigt",
  declined: "Abgelehnt",
  cancelled: "Storniert",
}

export function BookingRow({
  booking,
}: {
  booking: {
    id: string
    startAt: string
    serviceName: string
    phone: string | null
    notes: string | null
    status: string
  }
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function act(status: "confirmed" | "declined") {
    setError(null)
    const result: BookingStatusResult = await setBookingStatus(booking.id, status)
    if (!result.ok) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  const statusBadge = {
    pending:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    confirmed:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    declined:
      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
    cancelled: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  }[booking.status] ?? "bg-zinc-100 text-zinc-600"

  return (
    <li className="flex flex-col gap-3 border-b border-zinc-200 py-4 last:border-0 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {booking.startAt}
          </p>
          <p className="text-sm text-zinc-500">{booking.serviceName}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge}`}
        >
          {STATUS_LABELS[booking.status] ?? booking.status}
        </span>
      </div>

      {(booking.phone || booking.notes) && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {booking.phone && <span className="font-medium">{booking.phone}</span>}
          {booking.phone && booking.notes && <span> · </span>}
          {booking.notes}
        </p>
      )}

      {booking.status === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={() => act("confirmed")}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Bestätigen
          </button>
          <button
            onClick={() => act("declined")}
            className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Ablehnen
          </button>
        </div>
      )}

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </li>
  )
}