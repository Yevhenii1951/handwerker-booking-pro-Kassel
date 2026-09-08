"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createBooking, getAvailableSlots, type SlotDay } from "./actions"
import { BookingCalendar } from "./booking-calendar"
import type { Service } from "@/types/database"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

interface SlotState {
  serviceId: string
  days: SlotDay[] | null
  error: string | null
}

const EMPTY_SLOT_STATE: SlotState = { serviceId: "", days: null, error: null }

export function BookingForm({ services }: { services: Service[] }) {
  const router = useRouter()
  const pathname = usePathname()

  const [serviceId, setServiceId] = useState(services[0]?.id ?? "")
  const [slotState, setSlotState] = useState<SlotState>(EMPTY_SLOT_STATE)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    if (!serviceId) return
    let cancelled = false

    getAvailableSlots(serviceId).then((result) => {
      if (cancelled) return
      if ("error" in result) {
        setSlotState({ serviceId, days: null, error: result.error })
      } else {
        setSlotState({ serviceId, days: result, error: null })
        setSelectedSlot(null)
      }
    })

    return () => {
      cancelled = true
    }
  }, [serviceId])

  const loadingSlots = slotState.serviceId !== serviceId

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!serviceId || !selectedSlot) return
    setSubmitting(true)
    setSubmitError(null)

    const result = await createBooking({
      serviceId,
      startAt: selectedSlot,
      phone: phone || undefined,
      notes: notes || undefined,
    })

    setSubmitting(false)
    if (result.ok) {
      setBookingId(result.bookingId)
    } else if (result.loginRequired) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`)
    } else {
      setSubmitError(result.error)
    }
  }

  if (bookingId) {
    return (
      <div className="rounded-lg bg-white/5 p-5 text-[#eef0f2]">
        <p className="font-bold text-[#fafaff]">Anfrage gesendet!</p>
        <p className="mt-2 text-sm text-[#dadde8]">
          Der Betrieb bestätigt Ihre Terminanfrage. Sie sehen den Status in Ihrem
          Bereich.
        </p>
        <a
          href="/dashboard/customer"
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-accent font-bold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Zu meinen Buchungen
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="mb-1.5 block text-sm font-medium text-[#dadde8]" htmlFor="service">
        Leistung
      </label>
      <select
        id="service"
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
        className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-[#fafaff] focus:border-accent focus:outline-none"
      >
        {services.map((s) => (
          <option key={s.id} value={s.id} className="bg-[#1c1c1c] text-[#fafaff]">
            {s.name} — {formatPrice(s.price)}
          </option>
        ))}
      </select>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-[#dadde8]">
          Freie Termine · Kalender
        </p>

        {loadingSlots && (
          <p className="rounded-lg bg-white/5 px-3 py-3 text-sm text-[#dadde8]">
            Termine werden geladen…
          </p>
        )}
        {!loadingSlots && slotState.error && (
          <p className="rounded-lg bg-white/5 px-3 py-3 text-sm text-[#dadde8]">
            {slotState.error}
          </p>
        )}
        {!loadingSlots &&
          !slotState.error &&
          slotState.days &&
          slotState.days.length === 0 && (
            <p className="rounded-lg bg-white/5 px-3 py-3 text-sm text-[#dadde8]">
              In den nächsten 14 Tagen sind keine freien Termine verfügbar.
            </p>
          )}

        {!loadingSlots &&
          !slotState.error &&
          slotState.days &&
          slotState.days.length > 0 && (
            <BookingCalendar
              days={slotState.days}
              value={selectedSlot}
              onChange={setSelectedSlot}
            />
          )}
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-[#dadde8]" htmlFor="phone">
          Telefon (optional)
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-[#fafaff] placeholder:text-[#dadde8]/50 focus:border-accent focus:outline-none"
          placeholder="+49 …"
        />
      </div>

      <div className="mt-3">
        <label className="mb-1.5 block text-sm font-medium text-[#dadde8]" htmlFor="notes">
          Nachricht (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#fafaff] placeholder:text-[#dadde8]/50 focus:border-accent focus:outline-none"
          placeholder="Beschreibung des Auftrags…"
        />
      </div>

      {submitError && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={!selectedSlot || !serviceId || submitting || loadingSlots}
        className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-accent font-bold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Wird gesendet…" : "Termin anfragen"}
      </button>
    </form>
  )
}