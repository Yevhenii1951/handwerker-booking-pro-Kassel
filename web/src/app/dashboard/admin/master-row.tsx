"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { setMasterStatus, type AdminActionResult } from "./actions"

const ACTIONS: Record<string, { status: string; label: string; primary: boolean }[]> = {
  pending: [
    { status: "active", label: "Freischalten", primary: true },
    { status: "rejected", label: "Ablehnen", primary: false },
  ],
  active: [{ status: "deactivated", label: "Deaktivieren", primary: false }],
  rejected: [{ status: "active", label: "Erneut freischalten", primary: true }],
  deactivated: [{ status: "active", label: "Reaktivieren", primary: true }],
}

export function MasterRow({
  master,
  inRegion,
}: {
  master: {
    id: string
    fullName: string
    trade: string | null
    city: string | null
    plz: string | null
    status: string
    createdAt: string
  }
  inRegion: boolean | null
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function act(status: string) {
    setError(null)
    const result: AdminActionResult = await setMasterStatus(master.id, status)
    if (!result.ok) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  const actions = ACTIONS[master.status] ?? []

  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-foreground">
          {master.fullName || "Unbenannter Betrieb"}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {master.trade ?? "—"}
          {master.city ? ` · ${master.plz ? `${master.plz} ` : ""}${master.city}` : ""}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Registriert am{" "}
          {new Intl.DateTimeFormat("de-DE", {
            dateStyle: "medium",
            timeZone: "UTC",
          }).format(new Date(master.createdAt))}
          {inRegion === null ? (
            ""
          ) : inRegion ? (
            <span className="ml-2 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-900 dark:bg-teal-400/15 dark:text-teal-300">
              in Region
            </span>
          ) : (
            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-900 dark:bg-red-400/15 dark:text-red-300">
              außerhalb der Region
            </span>
          )}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.status}
            onClick={() => act(a.status)}
            className={`inline-flex h-9 items-center rounded-lg px-4 text-sm font-semibold transition-colors ${
              a.primary
                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
      {error && (
        <p className="w-full text-sm text-destructive">{error}</p>
      )}
    </li>
  )
}