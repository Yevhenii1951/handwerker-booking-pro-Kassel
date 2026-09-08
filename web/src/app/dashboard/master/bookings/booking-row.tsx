"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { setBookingStatus, type BookingStatusResult } from "./actions"
import { StatusBadge } from "@/app/dashboard/status-badge"

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

  return (
    <li className="flex flex-col gap-3 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-foreground">{booking.startAt}</p>
          <p className="text-sm text-muted-foreground">{booking.serviceName}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {(booking.phone || booking.notes) && (
        <p className="text-sm text-muted-foreground">
          {booking.phone && <span className="font-medium text-foreground">{booking.phone}</span>}
          {booking.phone && booking.notes && <span> · </span>}
          {booking.notes}
        </p>
      )}

      {booking.status === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={() => act("confirmed")}
            className="inline-flex h-9 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Bestätigen
          </button>
          <button
            onClick={() => act("declined")}
            className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Ablehnen
          </button>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </li>
  )
}