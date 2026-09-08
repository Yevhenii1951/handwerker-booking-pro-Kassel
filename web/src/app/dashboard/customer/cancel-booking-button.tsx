"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { cancelBooking, type CancelResult } from "./actions"

export function CancelBookingButton({
  bookingId,
  serviceName,
}: {
  bookingId: string
  serviceName: string
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCancel() {
    setSubmitting(true)
    setError(null)
    const result: CancelResult = await cancelBooking(bookingId)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        Stornieren
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {serviceName} wirklich stornieren?
      </span>
      <button
        onClick={handleCancel}
        disabled={submitting}
        className="rounded-lg bg-destructive px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-destructive/80 disabled:opacity-50"
      >
        {submitting ? "…" : "Ja"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        disabled={submitting}
        className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
      >
        Nein
      </button>
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  )
}