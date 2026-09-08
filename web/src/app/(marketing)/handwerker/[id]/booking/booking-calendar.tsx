"use client"

import { useState } from "react"
import type { SlotsResult } from "./actions"

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

function slotTime(startAt: string): string {
  return startAt.slice(11, 16)
}

interface CalendarProps {
  days: Exclude<SlotsResult, { error: string }>
  value: string | null
  onChange: (startAt: string) => void
}

export function BookingCalendar({ days, value, onChange }: CalendarProps) {
  const availableByDate = new Map(days.map((d) => [d.date, d]))
  const availableDates = [...availableByDate.keys()]
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const first = new Date(`${availableDates[0]}T00:00:00`)
  const monthStart = new Date(first.getFullYear(), first.getMonth(), 1)
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const startOffset = (monthStart.getDay() + 6) % 7
  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const activeDate =
    selectedDate && availableByDate.has(selectedDate)
      ? selectedDate
      : (availableDates[0] ?? null)

  const activeDay = activeDate ? (availableByDate.get(activeDate) ?? null) : null

  function handleDateClick(date: string) {
    setSelectedDate(date)
    if (value && !availableByDate.get(date)?.slots.some((s) => s.startAt === value)) {
      onChange("")
    }
  }

  return (
    <div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="py-1 text-[11px] font-semibold uppercase text-[#dadde8]/70">
              {w}
            </span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            const dateStr =
              cell === null
                ? null
                : `${first.getFullYear()}-${String(first.getMonth() + 1).padStart(2, "0")}-${String(cell).padStart(2, "0")}`
            const available = dateStr !== null && availableByDate.has(dateStr)
            const active = dateStr !== null && dateStr === activeDate

            if (dateStr === null) return <div key={`e-${i}`} />

            return (
              <button
                key={dateStr}
                type="button"
                disabled={!available}
                onClick={() => handleDateClick(dateStr)}
                aria-pressed={active}
                className={`flex h-9 items-center justify-center rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-accent font-bold text-white"
                    : available
                      ? "border border-white/10 bg-white/5 text-[#fafaff] hover:bg-white/10"
                      : "cursor-not-allowed text-[#dadde8]/30"
                }`}
              >
                {cell}
              </button>
            )
          })}
        </div>
      </div>

      {activeDay && (
        <div className="mt-3 rounded-xl border border-white/10 bg-[#1c1c1c] p-4">
          <p className="mb-2 text-sm font-semibold text-[#eef0f2]">
            Freie Zeiten · {activeDay.dayLabel}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {activeDay.slots.map((slot) => {
              const active = value === slot.startAt
              return (
                <button
                  key={slot.startAt}
                  type="button"
                  onClick={() => onChange(slot.startAt)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent text-white"
                      : "border border-white/10 bg-white/5 text-[#fafaff] hover:bg-white/10"
                  }`}
                >
                  {slotTime(slot.startAt)} Uhr
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}